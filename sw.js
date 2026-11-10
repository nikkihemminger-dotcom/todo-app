// Lets phones install the site as an app. It caches nothing, so every visit gets the
// newest version and your to-dos always come straight from the database.
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (e) => e.waitUntil(self.clients.claim()));
self.addEventListener("fetch", () => {});

// Morning notification (Spec 007): show what the morning-reminder function sent.
self.addEventListener("push", (e) => {
  let data = {};
  try { data = e.data ? e.data.json() : {}; } catch {}
  e.waitUntil(self.registration.showNotification(data.title || "Here is what you need to do today:", {
    body: data.body || "Open the app to see your to-dos.",
    icon: "icons/icon-192.png",
    badge: "icons/icon-192.png",
    data: { url: data.url || self.registration.scope },
  }));
});

// Tapping the notification opens the app (or brings it to the front if it's already open).
self.addEventListener("notificationclick", (e) => {
  e.notification.close();
  const url = e.notification.data?.url || self.registration.scope;
  e.waitUntil((async () => {
    const open = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
    const existing = open.find((c) => c.url.startsWith(self.registration.scope));
    if (existing) return existing.focus();
    return self.clients.openWindow(url);
  })());
});
