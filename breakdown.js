// "Break it down": turns a big goal into 3 steps using hand-written templates (Spec 009).
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
  },
  {
    match: /\b(paper|essay|report|thesis|dissertation|article|blog post|reflection|lit(erature)? review)\b/i,
    steps: (x) => [
      `Reread the prompt for ${the(x)} and write your main point in one sentence`,
      "Find 3 sources and write a messy first draft",
      "Revise it (the writing center can help), check citations, and submit",
    ],
  },
  {
    match: /\b(homework|assignment|problem set|p-?set|worksheet|lab report)\b/i,
    steps: (x) => [
      `List each part of ${the(x)} and do the easiest one first`,
      "Take the parts you're stuck on to a TA or tutoring lab",
      "Check your answers and submit it",
    ],
  },
  {
    match: /\b(class(es)?|course|grades?|gpa|pass(ing)?|an a in|syllabus|semester)\b/i,
    steps: () => [
      "Write the grade you want and every big due date from the syllabus",
      "Go to office hours once and join a study group",
      "Check your grade every Friday and adjust",
    ],
  },
  {
    match: /(\$\d|\b(save|saving|budget|money|pay off|debt|loan|rent)\b)/i,
    steps: () => [
      "Write the exact amount and the date you want it by",
      "Pick 2 things to cut and set up an automatic transfer",
      "Check your progress every Sunday",
    ],
  },
  {
    match: /\b(jobs?|internships?|co-?op|career|hired|position|role|employment|resume|cover letter|linkedin)\b/i,
    steps: () => [
      "Pick the 3 kinds of roles you want and get your resume reviewed at the career center",
      "Save 10 openings (like on Handshake) and ask someone you know for a referral",
      "Apply to your top 3, then follow up a week later",
    ],
  },
  {
    match: /\b(applications?|apply|scholarships?|grad(uate)? school|law school|med school|college|admissions?|program|fafsa|visa|grant)\b/i,
    steps: (x) => [
      `Find the deadline for ${the(x)} and list everything it asks for`,
      "Ask for recommendation letters (give 2+ weeks) and draft your answers",
      "Have an advisor read it, then submit and save the confirmation",
    ],
  },
  {
    match: /\b(habit|every ?day|daily|each day|every (morning|night|week)|routine|work ?out|exercise|gym|run(ning)?|meditat(e|ion)|journal(ing)?|read(ing)?|drink (more )?water|sleep|in shape|eat healthier|wake up)\b/i,
    steps: () => [
      "Pick the smallest version you could do on a bad day, and when you'll do it",
      "Set a phone reminder and do it today, even if it's tiny",
      "Track it for one week, then adjust",
    ],
  },
  {
    match: /\b(learn|skill|get better at|language|spanish|french|german|japanese|chinese|asl|guitar|piano|ukulele|instrument|coding|code|program(ming)?|python|javascript|excel|photoshop|figma|cook(ing)?|draw(ing)?)\b/i,
    steps: (x) => [
      `Decide what "good enough" at ${x} looks like and pick one beginner course or book`,
      "Do 3 short practice sessions this week",
      "Make one small thing with what you learned and ask for feedback",
    ],
  },
  {
    match: /\b(party|birthday|trip|vacation|travel|event|wedding|dinner|concert|celebration|shower|reunion|visit|date night|game night|fundraiser|conference)\b/i,
    steps: (x) => [
      `Pick the date, budget, and guest list for ${the(x)}`,
      "Book the place or tickets and send the invites",
      "Confirm everything 2 days before",
    ],
  },
  {
    match: /\b(project|capstone|presentation|portfolio|app|website|site|research|poster|video|podcast|lab|business|startup|club|book|novel)\b/i,
    steps: (x) => [
      `Write what "done" looks like for ${the(x)} and list every piece`,
      "Run your plan by your professor or TA, then do the first piece today",
      "Leave a day at the end to review and polish",
    ],
  },
];

// Returns [] when no template fits: the page then says it looks like a one-step to-do
// instead of inventing vague steps (friend test, 2026-10-26).
export function breakDown(goal) {
  const text = goal.trim().replace(/[.!?]+$/, "");
  const x = text.replace(LEAD, "") || text;
  const template = TEMPLATES.find((t) => t.match.test(text));
  return template ? template.steps(x) : [];
}
