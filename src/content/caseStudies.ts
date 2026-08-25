export type Highlight = {
  value: string
  label: string
}

export type Phase = {
  name: string
  timeframe: string
}

export type CaseStudy = {
  id: string
  title: string
  summary: string
  tags: readonly string[]
  problem: string
  approach: string
  outcome: string
  /** Reflections — what I'd do differently or explore next, in hindsight. Optional. */
  futureIterations?: string;
  /** Real thumbnail image, once one exists. Falls back to a gradient placeholder. */
  image?: string;
  /** Small stat callouts shown in the modal's left rail. Optional, any number. */
  highlights?: readonly Highlight[];
  /** Compact, ordered timeline strip for a case study built around a multi-phase
   *  framework rather than a single project narrative. Renders at the top of the
   *  content pane. Optional — most case studies won't have one. */
  phases?: readonly Phase[];
}

export const caseStudies: readonly CaseStudy[] = [
  {
    id: "CS 1",
    title: "Taking the Quality Function on a Product From Zero to One",
    summary:
      "A repeatable framework for standing up a product's entire quality function from nothing - the order of operations I'd follow on any product, regardless of team size or timeline, built from actually doing it at Eventric.",
    tags: ["Quality Strategy", "Leadership", "Process"],
    problem:
      "Most QA advice assumes a team and some coverage already exist. When I joined Eventric as the first dedicated QA hire, there was no process to build on and no playbook for the order to build it in - just a stack of things that all felt urgent at once. I needed an actual sequence, not a wish list.",
    approach:
      "I start with assessment, not action: mapping the current release process, identifying the highest-risk surfaces - what breaks most, what would hurt most, what's changing fastest - and taking stock of the tech stack per platform. Nothing gets built until I know what I'm building for.\n\nFrom there the order is deliberate: manual gates before automation, foundations before features, critical path before edge cases. Manual review tiers scaled to risk and basic bug triage go in first, because a safety net doesn't need to be automated to count. Framework foundations - fixtures, navigation helpers, a page-object layer scaffolded for every major section, a CI skeleton - go in early and overlap that window, so nothing gets rebuilt once real tests land on top of it. Automation starts with the highest-value workflows, not the easiest ones, wired into CI on every PR while lower-priority tiers stay manual until their turn. From there it's expansion outward by risk tier, with coverage tracked continuously instead of celebrated once, and CI gates maturing from tests existing to tests actually blocking a bad release.\n\nThe honest caveat: the timeline is the part I'd hold loosest. I went from solo to a two-person team partway through my own build, and team size changes the calendar more than anything else. The sequencing - foundations before features, manual gates from day one, critical path before edge cases - is the real signal, not the week counts.",
    outcome:
      "This isn't theoretical - it's the order I actually followed building Eventric's quality function from nothing, and the MT3 desktop automation case study is phases 2 and 3 of this framework in practice: the same fixtures, page-object layer, and critical-path-first sequencing described here. I've now run the early phases solo and the later ones with a second QA engineer, and the sequencing held up under both - team size changed the pace, not the order.",
    futureIterations:
      "The phase I've tested least is late-stage maturity - where tests actually block releases and coverage becomes an ongoing operating model rather than a project with an end date. I got Eventric through the early-to-mid phases in full and partway into that maturity stretch, but I haven't run this at a company big enough to see how the later phases hold up under real pressure to ship automation results faster than the sequencing recommends.",
    phases: [
      { name: "Assessment", timeframe: "Wks 1–2" },
      { name: "Manual Gates & Quick Wins", timeframe: "Wks 2–6" },
      { name: "Framework Foundations", timeframe: "Wks 4–10" },
      { name: "Critical Path Automation", timeframe: "Mo 2–4" },
      { name: "Expand by Risk Tier", timeframe: "Mo 4–8" },
      { name: "CI/CD Gate Maturity", timeframe: "Ongoing" },
      { name: "Full Coverage & Continuous Maturity", timeframe: "Mo 8–12+" },
    ],
  },
  {
    id: "CS 2",
    title: `Building E2E Test Automation From Zero for Eventric's Flagship Desktop App`,
    summary:
      "Master Tour Desktop is an Electron desktop app backed by a local SQLite database that had no existing E2E coverage. As QA Lead, I owned building that test coverage from the ground up.",
    tags: ["Automation", "Playwright", "Electron", "SQLite"],
    problem:
      "Testing on the main desktop product for Eventric was slow and inconsistent. All testing was manual and required significant setup time. As we moved towards faster releases, we needed a more efficient way to regression test the app before release.",
    approach:
      "Because the app is offline-first, our options for E2E automation tooling were limited. I wrote a PRD weighing Playwright against WebDriverIO and chose Playwright for its ease of setup - it's the industry standard for Electron apps - plus a handful of useful out-of-the-box tools like auto-wait, built-in screenshots and video, and session recording. I documented the rollout plan in Confluence, then broke it into epics in Jira before writing a single test. I sequenced test-writing by business value - critical/high volume user flows first, edge cases last, ensuring the team had usable CI coverage early rather than needing months before anything worked. One major design constraint that I ended solving for: Electron plus a local SQLite database meant tests couldn't safely run in parallel. Multiple workers hitting the same local DB caused data collisions when testing similar content areas. Rather than trying to fight that, I designed the suite to run serially and built the framework around it: a shared authenticated-session fixture (avoiding repeated logins from a cold Electron start), a centralized navigation helper, and a page-object layer scaffolded for every major app section up front. The final step was wiring this into CI/CD - I built a Bitbucket Pipelines workflow that ran the suite on command. That command ran the full suite on every PR, and again on a weekly schedule.",
    outcome:
      "Framework foundations and the highest-value test tier shipped first, becoming the base every later suite was built on. Regression testing on release candidates went from fully manual to automated, with spot checks limited to feature-specific changes. On average, validating the critical paths dropped from ~4 hours to ~10 minutes. Weekly runs also confirmed that no regressions had occurred outside the scope of client code, building historical confidence in the product's stability.",
    futureIterations:
      "Communication of test results remained a major pain point. Down the road, I'd like to log results directly on the PR that triggered the pipeline and add a Slack channel that flags failures and regressions automatically. Without this piece QA is required to check and relay run results manually to the development team.\n\n\nI'd also like to match test scope to the CI trigger. Right now the full suite runs on every trigger, even when only a small subset of the pipeline actually changed. Splitting it into Smoke, Regression, and Feature-Specific playlists would let us be more surgical, the immediate win would be a ~2-3 minute smoke suite that runs on every push, not just PR creation.",
    highlights: [
      { value: "4 hrs → 10 min", label: "Critical path validation time" },
      { value: "Manual → Automated", label: "Release regression testing" },
      { value: "Weekly", label: "Scheduled regression runs" },
    ],
  },
  {
    id: "CS 3",
    title: "Improve Bug to Automation Test Case Pipeline by Leveraging AI Tooling",
    summary:
      "As we matured our quality function at Eventric and built out large scale test frameworks, it became abundantly clear that a piece of the developer → quality pipeline was missing. As bugs were getting fixed, there was no trackable way to ensure that automated test cases were created to prevent future regression.",
    tags: ["Automation", "Process", "AI"],
    problem:
      "Asking our client team to log out follow up stories to create automation cases for the bugs they fix was a frail system with too many points of failure and an unreasonable drain on developer time. This process needed to be repeatable and faster.",
    approach:
      "I designed this as two gates that run before a bugfix PR even opens, meaning the check happens inside the developer's existing workflow instead of becoming a separate step someone has to remember later. First, the developer has Claude compare the changed files against the app's existing test coverage and flag whether the fix genuinely needs a new unit test - distinguishing a real logic gap from something like a UI-only prop change with nothing testable behind it. When that call is inconclusive, the default is to write the test anyway: I'd rather over-cover an ambiguous fix than let it slip through silently. Second, the developer has Claude draft the follow-up QA coverage as a Jira story with instructions for validating the original fix. The story deliberately leaves out the acceptance criteria from the original ticket to avoid introducing bias to whichever Quality Engineer eventually picks it up. It gets logged into a holding epic scoped to gaps from recent bugfixes; I was deliberate about calling that epic an intake queue, not a backlog, since stories in it are expected to get scheduled within the current or next sprint - an epic without that expectation just becomes the same kind of gap this process exists to close. The PR itself links back to the story, so QA can trace coverage to the fix that created it. I rolled this out across Mobile, Desktop, and Venues at once rather than piloting on one product, since the underlying gap was identical across all three.",
    outcome:
      "This closed the structural gap directly: every bugfix now gets an explicit, traceable checkpoint for both unit coverage and QA follow-up, instead of relying on someone remembering to create one. Over its first three months live, the process generated 20+ automation cases across 10+ fixed bugs - all without a developer having to remember to ask.",
    futureIterations:
      "The natural next step is pushing this further. Prompting Claude for the follow-up story is a good starting point but it's not strictly necessary, a script could scrape the PR description and testing notes straight into the Jira story format without any engineer input at all.",
    highlights: [
      { value: "20+", label: "Automation cases generated in 3 months" },
      { value: "Manual → Automated", label: "Follow-up QA test case creation" },
    ],
  },
  {
    id: "CS 4",
    title: "Cutting QA's Support Load From ~10 Hours a Week to ~2",
    summary:
      "Support tickets were quietly eating close to a third of QA's week in ad hoc Slack pings and one-off investigations. I built a structured office-hours process to contain it, then measured and iterated until it actually worked.",
    tags: ["Process", "Leadership", "Cross-functional"],
    problem:
      "As QA Lead, I noticed the team was constantly being pulled into Support requests outside of any planned process - reproducing customer-reported bugs, answering ad hoc questions in Slack, investigating one-offs. When I actually measured it, it came out to roughly 10 hours a week of QA time, unplanned and unscheduled, cutting directly into time we had for actual coverage work.",
    approach:
      "Rather than just telling Support to route requests differently, I set up dedicated office hours - a standing, scheduled block where Support could bring anything, instead of interrupting QA ad hoc throughout the day. I started at twice a week because I didn't trust a single weekly slot to absorb the backlog immediately, then measured the actual time cost again after a few weeks. Once the numbers showed it was working, I stepped it down to once a week rather than leaving a heavier cadence in place out of caution - the goal was containing the time cost, not maximizing meeting time. I treated the format itself as something to iterate on, not a one-time fix, adjusting it based on what kept coming up unscheduled anyway.",
    outcome:
      "QA time lost to unplanned Support interruptions dropped from about 10 hours a week to about 2 - freeing up roughly 8 hours a week of QA capacity that went back into planned coverage work, without Support losing a reliable way to get QA's attention.",
    futureIterations:
      "I'd formalize triage criteria earlier - a lightweight rule for what counts as 'bring it to office hours' versus 'this is actually urgent enough to interrupt,' so the edge cases stop being a judgment call every time.",
    highlights: [
      { value: "10 hrs → 2 hrs", label: "QA time lost to unplanned Support interruptions, per week" },
      { value: "2x/wk → 1x/wk", label: "Office hours cadence, stepped down once it worked" },
    ],
  },
] as const;
