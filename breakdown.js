// "Break it down": turns a big goal into 3 to 6 steps using hand-written templates.
// The goal's words pick the template; nothing leaves the page (Decision 011 in the class repo).

// Leading verbs dropped so the goal's own words read naturally inside a step.
const LEAD = /^(go( to)?|run to|stop by|study(ing)? for|prep(are)? for|cram for|review for|write|writing|draft|finish|complete|start|do|get( a| an)?|find( a| an)?|land( a| an)?|apply (to|for)|submit|plan|planning|organize|throw|host|clean( up)?|tidy( up)?|learn( how to)?|get better at|practice|work on|build|make|create|launch)\s+/i;

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
      "Go to office hours or a TA review session with 2 questions",
      "Do a practice test and go over what you missed",
      "Book your testing center time if needed, then sleep well the night before",
    ],
  },
  {
    match: /\b(paper|essay|report|thesis|dissertation|article|blog post|reflection|lit(erature)? review)\b/i,
    steps: (x) => [
      `Reread the prompt and rubric for ${the(x)}`,
      "Pick your topic and write your main point in one sentence",
      "Find 3 to 5 sources (a campus librarian can help if you're stuck)",
      "Write a rough outline and a messy first draft",
      "Take your draft to the writing center or office hours",
      "Revise, check citations, and submit it",
    ],
  },
  {
    match: /\b(homework|assignment|problem set|p-?set|worksheet|lab report)\b/i,
    steps: (x) => [
      `Open ${the(x)} and list each problem or part`,
      "Gather your notes, the textbook, and the lecture slides",
      "Do the easiest part first to get going",
      "Bring the parts you're stuck on to a TA, tutoring lab, or study group",
      "Check your answers and submit it",
    ],
  },
  {
    match: /\b(store|grocer(y|ies)|shopping|shop|errands?|pick up|buy|target|walmart|costco|pharmacy|prescription|bank|post office|mail|return)\b/i,
    steps: () => [
      "Write a list of what you need",
      "Check what you already have at home",
      "Grab your bags, wallet, and keys",
      "Go and get everything on the list",
      "Put it all away when you get home",
    ],
  },
  {
    match: /\b(class(es)?|course|grades?|gpa|pass(ing)?|an a in|syllabus|semester)\b/i,
    steps: () => [
      "Write down the grade you're aiming for",
      "Check the syllabus for every big due date and exam",
      "Add those due dates to your School list",
      "Find your professor's and TA's office hours",
      "Join or start a study group",
      "Check your grade every Friday",
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
      "Get your resume reviewed at the campus career center",
      "Find 10 openings on your school's job board (like Handshake) and save them",
      "Ask a professor, alum, or friend for a referral or a quick chat",
      "Apply to your top 3 this week",
      "Follow up on each one a week later",
    ],
  },
  {
    match: /\b(applications?|apply|scholarships?|grad(uate)? school|law school|med school|college|admissions?|program|fafsa|visa|grant)\b/i,
    steps: (x) => [
      `Find the deadline and requirements for ${the(x)}`,
      "Make a checklist of every document it asks for",
      "Ask a professor for a recommendation letter (give them 2+ weeks)",
      "Draft your personal statement or answers",
      "Have the writing center or an advisor read it over",
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
    match: /\b(clean|tidy|laundry|dishes|declutter|vacuum|organi[sz]e|chores?|room|kitchen|bathroom|closet|garage|car|fridge|desk|pack(ing)?|move|moving)\b/i,
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
      "List every piece of the work (check the rubric)",
      "If it's a group, split the pieces and set a weekly check-in",
      "Run your idea by your professor or TA in office hours",
      "Do the first piece today",
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
