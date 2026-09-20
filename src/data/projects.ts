/*
 * RECENT WORK — powers the "last 3 shipped" live feed (#15) and the case-study
 * cards (#18). Keep this list fresh (newest first) so the feed reads as a live,
 * busy operation.
 *
 * TODO: replace with real projects. Set `loomUrl` to a Loom share URL
 * (https://www.loom.com/share/XXXX) to embed a real walkthrough video; until
 * then each card auto-plays a unique "build replay" chosen by `replayKind`.
 */

/** Which animated build-replay scene a card plays (one distinct scene each). */
export type ReplayKind = 'triage' | 'dashboard' | 'extract'

export type Project = {
  title: string
  industry: string
  category: 'AI' | 'Web' | 'Automation' | 'SaaS'
  result: string
  hoursSavedPerWeek: number
  buildTime: string
  /** human "shipped" label — update as you ship */
  shipped: string
  stack: string[]
  /** Loom share URL for the case-study walkthrough (optional) */
  loomUrl?: string
  /** The build-replay scene this card animates when there's no Loom video. */
  replayKind: ReplayKind
}

export const projects: Project[] = [
  {
    title: 'Candidate ATS auto-sync',
    industry: 'Recruiting Agency',
    category: 'Automation',
    result: 'Cut recruiter admin from 30 → 6 hrs/week',
    hoursSavedPerWeek: 24,
    buildTime: '3 weeks',
    shipped: 'this week',
    stack: ['Node.js', 'ATS API', 'OpenAI', 'Slack'],
    replayKind: 'triage',
  },
  {
    title: 'Automated client reporting',
    industry: 'Marketing Agency',
    category: 'Automation',
    result: 'Saved ~9 hrs/week of manual reporting',
    hoursSavedPerWeek: 9,
    buildTime: '2 weeks',
    shipped: '1 week ago',
    stack: ['Python', 'Meta + GA APIs', 'PDF', 'Email'],
    replayKind: 'dashboard',
  },
  {
    title: 'Invoice intake agent',
    industry: 'Accounting Firm',
    category: 'AI',
    result: 'Reduced data entry by ~70%',
    hoursSavedPerWeek: 22,
    buildTime: '4 weeks',
    shipped: '2 weeks ago',
    stack: ['OCR', 'LLM', 'QuickBooks', 'Webhooks'],
    replayKind: 'extract',
  },
  {
    title: 'Instant lead responder',
    industry: 'Real Estate Team',
    category: 'AI',
    result: 'Lead response time 4 hrs → 2 min',
    hoursSavedPerWeek: 18,
    buildTime: '2 weeks',
    shipped: '3 weeks ago',
    stack: ['Twilio', 'LLM', 'CRM', 'Zapier'],
    replayKind: 'triage',
  },
]
