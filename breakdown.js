// "Break it down": turns a big goal into 3 to 6 steps using hand-written templates.
// The goal's words pick the template; nothing leaves the page (Decision 011 in the class repo).

// Leading verbs dropped so the goal's own words read naturally inside a step.
const LEAD = /^(study(ing)? for|prep(are)? for|cram for|review for|write|writing|draft|finish|complete|start|do|get( a| an)?|find( a| an)?|land( a| an)?|apply (to|for)|submit|plan|planning|organize|throw|host|clean( up)?|tidy( up)?|learn( how to)?|get better at|practice|work on|build|make|create|launch)\s+/i;

const DETERMINER = /^(my|the|a|an|your|this|that|next|our|his|her|their)\b/i;

// "chem midterm" -> "the chem midterm"; "my room" stays "my room".
const the = (x) => (DETERMINER.test(x) || /^\S+'s\b/i.test(x) ? x : `the ${x}`);

const TEMPLATES = [
  {
    match: /\b(test|tests|exam|exams|midterms?|finals|final exam|quiz(zes)?|mcat|lsat|gre|gmat|sat|act)\b/i,
    steps: (x) => [
      `List every topic ${the(x)} covers`,
      "Gather your notes, slides, and old homework",
      "Make a one-page study guide of the key ideas",
      "Do a practice test or 10 practice problems",
      "Go back over the ones you missed",
      "Quick review the night before, then sleep",
    ],
  },
  {
    match: /\b(paper|essay|report|thesis|dissertation|article|blog post|reflection|lit(erature)? review)\b/i,
    steps: (x) => [
      `Reread the prompt and rubric for ${the(x)}`,
      "Pick your topic and write your main point in one sentence",
      "Find 3 to 5 sources and save the quotes you'll use",
      "Write a rough outline",
      "Write a messy first draft",
      "Revise, check citations, and proofread out loud",
    ],
  },
  {
    match: /\b(homework|assignment|problem set|p-?set|worksheet|lab report)\b/i,
    steps: (x) => [
      `Open ${the(x)} and list each problem or part`,
      "Gather what you need (notes, textbook, calculator)",
      "Do the easiest part first to get going",
      "Mark the parts you're stuck on and ask for help",
      "Check your answers and submit it",
    ],
  },
  {
    match: /(\$\d|\b(save|saving|budget|money|pay off|debt|loan|rent)\b)/i,
    steps: () => [
      "Write down the exact amount and the date you want it by",
      "Divide it into a weekly amount",
      "Look at last month's spending and pick 2 things to cut",
      "Set up an automatic transfer to savings",
      "Check your progress every Sunday",
    ],
  },
  {
    match: /\b(jobs?|internships?|co-?op|career|hired|position|role|employment|resume|cover letter|linkedin)\b/i,
    steps: () => [
      "Write down the 3 kinds of roles you want most",
      "Update your resume",
      "Find 10 openings and save them in one place",
      "Ask one person you know for a referral or a quick chat",
      "Apply to your top 3 this week",
      "Follow up on each one a week later",
    ],
  },
  {
    match: /\b(applications?|apply|scholarships?|grad(uate)? school|law school|med school|college|admissions?|program|fafsa|visa|grant)\b/i,
    steps: (x) => [
      `Find the deadline and requirements for ${the(x)}`,
      "Make a checklist of every document it asks for",
      "Ask for recommendation letters (give people 2+ weeks)",
      "Draft your personal statement or answers",
      "Have someone read it over",
      "Submit it and save the confirmation",
    ],
  },
  {
    match: /\b(habit|every ?day|daily|each day|every (morning|night|week)|routine|work ?out|exercise|gym|run(ning)?|meditat(e|ion)|journal(ing)?|read(ing)?|drink (more )?water|sleep|in shape|eat healthier|wake up)\b/i,
    steps: () => [
      "Decide the smallest version you could do on a bad day",
      "Pick a time and place it will happen each day",
      "Tie it to something you already do (after breakfast, after class)",
      "Set a reminder on your phone",
      "Do it today, even if it's tiny",
      "Track it for one week, then adjust",
    ],
  },
  {
    match: /\b(learn|skill|get better at|language|spanish|french|german|japanese|chinese|asl|guitar|piano|ukulele|instrument|coding|code|program(ming)?|python|javascript|excel|photoshop|figma|cook(ing)?|draw(ing)?)\b/i,
    steps: (x) => [
      `Decide what "good enough" at ${x} looks like for you`,
      "Find one good beginner course, video series, or book",
      "Schedule 3 short practice sessions this week",
      "Do the first 20-minute lesson",
      "Make or try one small thing with what you learned",
      "Ask someone who knows it for feedback",
    ],
  },
  {
    match: /\b(party|birthday|trip|vacation|travel|event|wedding|dinner|concert|celebration|shower|reunion|visit|date night|game night|fundraiser|conference)\b/i,
    steps: (x) => [
      `Pick the date and budget for ${the(x)}`,
      "Decide who's coming and make the guest list",
      "Book the place, tickets, or travel",
      "List what to buy or bring",
      "Send invites or share the plan",
      "Confirm everything 2 days before",
    ],
  },
  {
    match: /\b(clean|tidy|laundry|dishes|declutter|vacuum|organi[sz]e|chores?|room|kitchen|bathroom|closet|garage|car|fridge|desk|pack(ing)?|move|moving|groceries)\b/i,
    steps: (x) => [
      "Gather what you need",
      `Set a 15-minute timer and start on ${the(x)}`,
      "Do the biggest or messiest part first",
      "Finish the small stuff",
      "Put everything away and take out the trash",
    ],
  },
  {
    match: /\b(project|capstone|presentation|portfolio|app|website|site|research|poster|video|podcast|lab|business|startup|club|book|novel)\b/i,
    steps: (x) => [
      `Write what "done" looks like for ${the(x)}`,
      "List every piece of the work",
      "Put a date next to each piece, working back from the due date",
      "If it's a group, split the pieces and agree on a check-in",
      "Do the first piece today",
      "Leave a day at the end to review and polish",
    ],
  },
];

// Goals that match no template get a general plan.
const GENERAL = [
  'Decide what "done" looks like',
  "Break it into the 3 biggest pieces",
  "Pick a date to finish each piece",
  "Do the first 15-minute piece",
  "Check your progress at the end of the week",
];

export function breakDown(goal) {
  const text = goal.trim().replace(/[.!?]+$/, "");
  const x = text.replace(LEAD, "") || text;
  const template = TEMPLATES.find((t) => t.match.test(text));
  return template ? template.steps(x) : GENERAL;
}
