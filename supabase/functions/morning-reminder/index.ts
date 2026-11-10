// Morning notification (Spec 007).
//
// Two ways this runs:
// 1. Every hour at :30, a Supabase cron job calls it with the x-cron-secret header. It sends a
//    notification to every device where it is now 7:xx AM in that device's time zone.
// 2. A signed-in user taps "Send a test" in the app. It calls this with their login token and
//    ?test=1, and only their own devices get a notification right away.
//
// Secrets (Supabase dashboard > Edge Functions > Secrets): VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY,
// CRON_SECRET. SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are provided by Supabase.
// "Verify JWT" is turned off for this function because it checks callers itself (below).

import { createClient } from "npm:@supabase/supabase-js@2.45.4";
import webpush from "npm:web-push@3.6.7";

const SITE = "https://nikkihemminger-dotcom.github.io/todo-app/";
const REMINDER_HOUR = 7; // with the cron job at :30, this is 7:30 AM
const MAX_ITEMS = 5;

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, apikey, content-type, x-cron-secret",
};

webpush.setVapidDetails(
  "https://nikkihemminger-dotcom.github.io",
  Deno.env.get("VAPID_PUBLIC_KEY")!,
  Deno.env.get("VAPID_PRIVATE_KEY")!,
);

const db = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

type Sub = { id: string; user_id: string; endpoint: string; p256dh: string; auth: string; time_zone: string };

// The date ("2026-11-09") and hour (0-23) right now in a time zone.
function localNow(timeZone: string) {
  const now = new Date();
  try {
    const date = new Intl.DateTimeFormat("en-CA", { timeZone, year: "numeric", month: "2-digit", day: "2-digit" }).format(now);
    const hour = Number(new Intl.DateTimeFormat("en-US", { timeZone, hour: "numeric", hourCycle: "h23" }).format(now));
    return { date, hour };
  } catch {
    return localNow("America/Denver");
  }
}

// The words in the notification, from the to-dos and steps due that day and not checked off.
async function messageFor(userId: string, date: string) {
  const { data, error } = await db.from("todos")
    .select("title")
    .eq("user_id", userId).eq("is_complete", false).eq("due_date", date)
    .order("position");
  if (error) throw error;
  const titles = (data ?? []).map((t) => t.title);
  if (!titles.length) return { title: "Good morning!", body: "Nothing is due today. Enjoy it!" };
  const shown = titles.slice(0, MAX_ITEMS).join(" · ");
  const more = titles.length > MAX_ITEMS ? ` +${titles.length - MAX_ITEMS} more` : "";
  return { title: "Here is what you need to do today:", body: shown + more };
}

async function send(subs: Sub[]) {
  let sent = 0, removed = 0, failed = 0;
  const messages = new Map<string, { title: string; body: string }>();
  for (const s of subs) {
    const { date } = localNow(s.time_zone);
    const key = `${s.user_id}|${date}`;
    if (!messages.has(key)) messages.set(key, await messageFor(s.user_id, date));
    const payload = JSON.stringify({ ...messages.get(key), url: SITE });
    try {
      await webpush.sendNotification({ endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth } }, payload, { TTL: 4 * 3600 });
      sent++;
    } catch (e) {
      const code = (e as { statusCode?: number }).statusCode;
      if (code === 404 || code === 410) {
        // The phone turned notifications off or the app was removed; forget this device.
        await db.from("push_subscriptions").delete().eq("id", s.id);
        removed++;
      } else {
        console.error("send failed", code, (e as Error).message);
        failed++;
      }
    }
  }
  return { sent, removed, failed };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  const json = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), { status, headers: { ...cors, "Content-Type": "application/json" } });

  try {
    const url = new URL(req.url);

    // A user asking for a test notification on their own devices.
    if (url.searchParams.get("test") === "1") {
      const token = (req.headers.get("authorization") ?? "").replace(/^Bearer /, "");
      const { data: { user } } = await db.auth.getUser(token);
      if (!user) return json({ error: "Please sign in." }, 401);
      const { data, error } = await db.from("push_subscriptions").select("*").eq("user_id", user.id);
      if (error) throw error;
      return json(await send(data as Sub[]));
    }

    // The hourly cron job.
    if (req.headers.get("x-cron-secret") !== Deno.env.get("CRON_SECRET")) return json({ error: "Not allowed." }, 401);
    const { data, error } = await db.from("push_subscriptions").select("*");
    if (error) throw error;
    const due = (data as Sub[]).filter((s) => localNow(s.time_zone).hour === REMINDER_HOUR);
    return json({ checked: data.length, ...(await send(due)) });
  } catch (e) {
    console.error(e);
    return json({ error: (e as Error).message }, 500);
  }
});
