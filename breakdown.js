// "Break it down": turns a big goal into 3 steps using hand-written templates (Spec 009), shaped
// by what the person says is hardest about it (Spec 010).
// The goal's words pick the template; nothing leaves the page (Decision 011 in the class repo).
// Chores and errands have no template on purpose: Break it down didn't help with them
// (Sprint 5 daily notes, days 1 and 2), so they get the "one go" message instead.

// Leading verbs dropped so the goal's own words read naturally inside a step.
const LEAD = /^(go( to)?|run to|stop by|study(ing)? for|prep(are)? for|cram for|review for|write|writing|draft|finish|complete|start|do|get( a| an)?|find( a| an)?|land( a| an)?|apply (to|for)|submit|plan|planning|organize|throw|host|clean( up)?|tidy( up)?|learn( how to)?|get better at|practice|work on|build|make|create|launch)\s+/i;

const DETERMINER = /^(my|the|a|an|your|this|that|next|our|his|her|their)\b/i;

// "chem midterm" -> "the chem midterm"; "my room" stays "my room".
const the = (x) => (DETERMINER.test(x) || /^\S+'s\b/i.test(x) ? x : `the ${x}`);

const TEMPLATES = [
  {
    match: /\b(test|tests|exam|exams|midterms?|finals|final exam|quiz(zes)?|mcat|lsat|gre|gmat|sat|act)\b/i,
    steps: (x) => [
      `List every topic ${the(x)} covers and star the 3 you know least`,
      "Make a one-page study guide, then take a practice test",
      "Go over what you missed with a TA or study group",
    ],
    start: (x) => [
      `Spend 10 minutes listing what ${the(x)} covers`,
      "Pick the topic you know least and study it for 25 minutes",
      "Take a practice test and go over what you missed",
    ],
    how: (x) => [
      `Ask your professor or TA what ${the(x)} will focus on`,
      "Get practice questions or an old exam from the course page or a classmate",
      "Study the topics you missed, then try those questions again",
    ],
    time: (x) => [
      `List the topics ${the(x)} covers (15 min)`,
      "Study your 2 weakest topics (two 30-min sessions)",
      "Take a practice test and check your answers (45 min)",
    ],
  },
  {
    match: /\b(paper|essay|report|thesis|dissertation|article|blog post|reflection|lit(erature)? review)\b/i,
    steps: (x) => [
      `Reread the prompt for ${the(x)} and write your main point in one sentence`,
      "Find 3 sources and write a messy first draft",
      "Revise it (the writing center can help), check citations, and submit",
    ],
    start: (x) => [
      `Spend 10 minutes writing anything you think about ${the(x)}, no editing`,
      "Turn your best idea into one sentence and outline 3 points",
      "Write the draft one section at a time, then revise and submit",
    ],
    how: (x) => [
      `Ask your professor or TA what they want to see in ${the(x)}`,
      "Find one strong example (a sample paper or a past one) and note how it's built",
      "Outline yours the same way, write it, and take the draft to the writing center",
    ],
    time: (x) => [
      `Reread the prompt for ${the(x)} and write your main point (20 min)`,
      "Write a messy first draft (two 45-min sessions)",
      "Revise, check citations, and submit (45 min)",
    ],
  },
  {
    match: /\b(homework|assignment|problem set|p-?set|worksheet|lab report)\b/i,
    steps: (x) => [
      `List each part of ${the(x)} and do the easiest one first`,
      "Take the parts you're stuck on to a TA or tutoring lab",
      "Check your answers and submit it",
    ],
    start: (x) => [
      `Spend 10 minutes on the easiest part of ${the(x)}`,
      "Do the next part while it's fresh",
      "Finish the rest, check your answers, and submit",
    ],
    how: (x) => [
      `Reread the instructions for ${the(x)} and mark what you don't understand`,
      "Find the matching example in your notes or textbook, or ask a TA",
      "Work through it with the example next to you, then submit",
    ],
    time: (x) => [
      `Do the first half of ${the(x)} (30 min)`,
      "Do the second half (30 min)",
      "Check your answers and submit (15 min)",
    ],
  },
  {
    match: /\b(class(es)?|course|grades?|gpa|pass(ing)?|an a in|syllabus|semester)\b/i,
    steps: () => [
      "Write the grade you want and every big due date from the syllabus",
      "Go to office hours once and join a study group",
      "Check your grade every Friday and adjust",
    ],
    start: (x) => [
      "Spend 10 minutes finding your current grade and what's due next",
      "Start the next assignment early, even just the first part",
      "Go to office hours once this week",
    ],
    how: (x) => [
      "Ask your professor in office hours what students who do well do differently",
      "Find a classmate who's doing well and study together once",
      "Use what you learned on the next assignment, then check your grade",
    ],
    time: (x) => [
      "Put every due date from the syllabus in your calendar (20 min)",
      "Block one study hour for this class each week (5 min to set up)",
      "Check your grade every Friday (5 min)",
    ],
  },
  {
    match: /(\$\d|\b(save|saving|budget|money|pay off|debt|loan|rent)\b)/i,
    steps: () => [
      "Write the exact amount and the date you want it by",
      "Pick 2 things to cut and set up an automatic transfer",
      "Check your progress every Sunday",
    ],
    start: (x) => [
      "Spend 10 minutes looking at what you spent last month",
      "Write the amount you want and the date you want it by",
      "Set up one automatic transfer, even a small one",
    ],
    how: (x) => [
      "Talk to someone good with money, or your school's financial wellness office",
      "Write a simple budget: what comes in, what goes out, what's left",
      "Pick 2 things to cut and set up an automatic transfer",
    ],
    time: (x) => [
      "Write the amount and the date you want it by (10 min)",
      "Look at last month's spending and pick 2 things to cut (20 min)",
      "Set up an automatic transfer so it happens on its own (10 min)",
    ],
  },
  {
    match: /\b(jobs?|internships?|co-?op|career|hired|position|role|employment|resume|cover letter|linkedin)\b/i,
    steps: () => [
      "Pick the 3 kinds of roles you want and get your resume reviewed at the career center",
      "Save 10 openings (like on Handshake) and ask someone you know for a referral",
      "Apply to your top 3, then follow up a week later",
    ],
    start: (x) => [
      "Spend 10 minutes saving 3 openings that look interesting (like on Handshake)",
      "Update your resume for the one you like most",
      "Apply to that one, then pick the next",
    ],
    how: (x) => [
      "Book a meeting at the career center and ask where to start",
      "Ask someone with a job you want how they got it (a 15-minute chat)",
      "Use what they told you to fix your resume, then apply to your top 3",
    ],
    time: (x) => [
      "Save 5 openings on Handshake (20 min)",
      "Tailor your resume to your top pick (30 min)",
      "Apply to your top 3, one a day (20 min each)",
    ],
  },
  {
    match: /\b(applications?|apply|scholarships?|grad(uate)? school|law school|med school|college|admissions?|program|fafsa|visa|grant)\b/i,
    steps: (x) => [
      `Find the deadline for ${the(x)} and list everything it asks for`,
      "Ask for recommendation letters (give 2+ weeks) and draft your answers",
      "Have an advisor read it, then submit and save the confirmation",
    ],
    start: (x) => [
      `Spend 10 minutes finding the deadline for ${the(x)}`,
      "List everything it asks for and do the easiest piece",
      "Ask for recommendation letters (give 2+ weeks)",
    ],
    how: (x) => [
      `Ask an advisor or someone who applied what ${the(x)} looks for`,
      "Read one example of a strong answer or essay",
      "Draft your answers, have an advisor read them, then submit",
    ],
    time: (x) => [
      `List everything ${the(x)} asks for and the deadline (20 min)`,
      "Ask for recommendation letters (15 min)",
      "Write one answer per sitting, then submit (30 min each)",
    ],
  },
  {
    match: /\b(habit|every ?day|daily|each day|every (morning|night|week)|routine|work ?out|exercise|gym|run(ning)?|meditat(e|ion)|journal(ing)?|read(ing)?|drink (more )?water|sleep|in shape|eat healthier|wake up)\b/i,
    steps: () => [
      "Pick the smallest version you could do on a bad day, and when you'll do it",
      "Set a phone reminder and do it today, even if it's tiny",
      "Track it for one week, then adjust",
    ],
    start: (x) => [
      "Do a 10-minute version today",
      "Pick the time of day you'll do it and set a phone reminder",
      "Do it 3 times this week, even if it's tiny",
    ],
    how: (x) => [
      "Find one simple beginner plan (an app, a video, or a friend who does it)",
      "Try it once and write down what was hard",
      "Adjust the plan and do it 3 times this week",
    ],
    time: (x) => [
      "Pick a 10-minute slot you already have, like right after class (5 min)",
      "Set a phone reminder for that slot (2 min)",
      "Do it in that slot 3 times this week (10 min each)",
    ],
  },
  {
    match: /\b(learn|skill|get better at|language|spanish|french|german|japanese|chinese|asl|guitar|piano|ukulele|instrument|coding|code|program(ming)?|python|javascript|excel|photoshop|figma|cook(ing)?|draw(ing)?)\b/i,
    steps: (x) => [
      `Decide what "good enough" at ${x} looks like and pick one beginner course or book`,
      "Do 3 short practice sessions this week",
      "Make one small thing with what you learned and ask for feedback",
    ],
    start: (x) => [
      `Spend 10 minutes on a free beginner video for ${x}`,
      "Do one short practice session",
      "Make one tiny thing with what you learned",
    ],
    how: (x) => [
      `Ask someone who knows ${x} where they'd start`,
      "Pick the beginner course or book they recommend",
      "Do the first lesson and 2 short practice sessions",
    ],
    time: (x) => [
      `Pick one beginner course for ${x} (15 min)`,
      "Do 3 short practice sessions this week (15 min each)",
      "Make one small thing with what you learned (30 min)",
    ],
  },
  {
    match: /\b(party|birthday|trip|vacation|travel|event|wedding|dinner|concert|celebration|shower|reunion|visit|date night|game night|fundraiser|conference)\b/i,
    steps: (x) => [
      `Pick the date, budget, and guest list for ${the(x)}`,
      "Book the place or tickets and send the invites",
      "Confirm everything 2 days before",
    ],
    start: (x) => [
      `Spend 10 minutes texting 2 people about ${the(x)} and picking a date`,
      "Set the budget and guest list",
      "Book the place or tickets and send the invites",
    ],
    how: (x) => [
      `Ask someone who's planned something like ${the(x)} what to book first`,
      "Make a checklist: date, place, budget, guests, food",
      "Book the place, send the invites, and confirm 2 days before",
    ],
    time: (x) => [
      `Pick the date, budget, and guest list for ${the(x)} (20 min)`,
      "Book the place or tickets and send the invites (30 min)",
      "Confirm everything 2 days before (10 min)",
    ],
  },
  {
    match: /\b(project|capstone|presentation|portfolio|app|website|site|research|poster|video|podcast|lab|business|startup|club|book|novel)\b/i,
    steps: (x) => [
      `Write what "done" looks like for ${the(x)} and list every piece`,
      "Run your plan by your professor or TA, then do the first piece today",
      "Leave a day at the end to review and polish",
    ],
    start: (x) => [
      `Spend 10 minutes listing every piece of ${the(x)}`,
      "Do the smallest piece",
      "Run your plan by your professor or TA",
    ],
    how: (x) => [
      `Ask your professor or TA what "done" looks like for ${the(x)}`,
      "Find one finished example and list its pieces",
      "Do the first piece and show it to them for feedback",
    ],
    time: (x) => [
      `List every piece of ${the(x)} (20 min)`,
      "Do one piece per sitting (45 min each)",
      "Leave a day at the end to review and polish (1 hour)",
    ],
  },
];

// The answers to "What's the hardest part?" (Spec 010). Each template has its own 3 steps
// for each one; Skip (or no answer) gives the template's usual steps.
export const HARDEST = [
  { key: "start", label: "Getting started" },
  { key: "how", label: "Knowing what to do" },
  { key: "time", label: "Finding the time" },
];

// Returns [] when no template fits: the page then says it looks like a one-step to-do
// instead of inventing vague steps (friend test, 2026-10-26).
export function breakDown(goal, hardest) {
  const text = goal.trim().replace(/[.!?]+$/, "");
  const x = text.replace(LEAD, "") || text;
  const template = TEMPLATES.find((t) => t.match.test(text));
  if (!template) return [];
  return (template[hardest] ?? template.steps)(x);
}
