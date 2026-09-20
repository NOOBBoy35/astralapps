/*
 * AI engines behind the three live features, powered by the Google Gemini API:
 *   - generateBlueprint  → Live Automation Builder (#1)
 *   - generateAudit      → Instant Business Audit (#2)
 *   - generateScope      → Automation Blueprint wizard (#4)
 *
 * Uses Gemini structured output (responseMimeType: application/json + a schema)
 * so the model always returns valid JSON. Falls back to a believable mock when
 * GEMINI_API_KEY is unset, so the UI works in dev / before launch.
 *
 * Model defaults to gemini-flash-latest (fast + free-tier-friendly). Override
 * with GEMINI_MODEL.
 */

const MODEL = process.env.GEMINI_MODEL || 'gemini-flash-latest'
const ENDPOINT = (model) =>
  `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`

/** Single structured-output Gemini call → parsed JSON object (or null if no key). */
async function runJson({ system, user, schema, maxTokens = 1024 }) {
  const key = process.env.GEMINI_API_KEY
  if (!key) return null

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 30000)
  let response
  try {
    response = await fetch(ENDPOINT(MODEL), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-goog-api-key': key },
      signal: controller.signal,
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: system }] },
        contents: [{ role: 'user', parts: [{ text: user }] }],
        generationConfig: {
          responseMimeType: 'application/json',
          responseSchema: schema,
          maxOutputTokens: maxTokens,
          // Skip extended thinking for these quick structured extractions.
          thinkingConfig: { thinkingBudget: 0 },
        },
      }),
    })
  } finally {
    clearTimeout(timer)
  }

  if (!response.ok) {
    const detail = await response.text().catch(() => '')
    console.error('[gemini] error', response.status, detail.slice(0, 400))
    throw Object.assign(new Error('The AI service had a problem. Please try again.'), { statusCode: 502 })
  }

  const data = await response.json()
  const text = (data?.candidates?.[0]?.content?.parts || [])
    .map((part) => part.text)
    .filter(Boolean)
    .join('')

  if (!text) throw Object.assign(new Error('Could not generate a response. Please try again.'), { statusCode: 502 })
  try {
    return JSON.parse(text)
  } catch {
    throw Object.assign(new Error('Could not parse the AI response. Please try again.'), { statusCode: 502 })
  }
}

/* ───────────────────────── Automation Builder (#1) ───────────────────────── */

const blueprintSchema = {
  type: 'OBJECT',
  properties: {
    title: { type: 'STRING' },
    summary: { type: 'STRING' },
    trigger: { type: 'STRING' },
    steps: { type: 'ARRAY', items: { type: 'STRING' } },
    tools: { type: 'ARRAY', items: { type: 'STRING' } },
    hoursSavedPerWeek: { type: 'NUMBER' },
    complexity: { type: 'STRING', enum: ['Simple', 'Moderate', 'Advanced'] },
    estimatedCostUsd: {
      type: 'OBJECT',
      description: 'Rough ONE-TIME cost to build this automation, in USD (typically a few thousand dollars — not the monthly running cost).',
      properties: { min: { type: 'NUMBER' }, max: { type: 'NUMBER' } },
      required: ['min', 'max'],
    },
  },
  required: ['title', 'summary', 'trigger', 'steps', 'tools', 'hoursSavedPerWeek', 'complexity', 'estimatedCostUsd'],
  propertyOrdering: ['title', 'summary', 'trigger', 'steps', 'tools', 'hoursSavedPerWeek', 'complexity', 'estimatedCostUsd'],
}

export async function generateBlueprint({ task, industry }) {
  const cleanTask = String(task || '').trim().slice(0, 600)
  if (cleanTask.length < 5) {
    throw Object.assign(new Error('Please describe the task in a little more detail.'), { statusCode: 400 })
  }

  const industryLine = industry ? ` The visitor runs a ${industry}.` : ''
  const input = await runJson({
    system:
      'You are an automation architect at AstralApps, an AI automation studio. A potential client ' +
      'describes a manual task their team does every week. Produce a concrete, realistic automation ' +
      'blueprint they could actually build. Be specific about the trigger, the steps, and the real ' +
      'tools (Slack, HubSpot, Gmail, QuickBooks, Zapier/Make, OpenAI, Airtable, Twilio, etc.). Keep ' +
      'the hours-saved estimate grounded and honest. estimatedCostUsd is the rough ONE-TIME cost to ' +
      'BUILD this automation in USD — usually a few thousand dollars, not the monthly running cost.' +
      industryLine,
    user: `Manual task: ${cleanTask}`,
    schema: blueprintSchema,
    maxTokens: 1024,
  })

  if (!input) return mockBlueprint(cleanTask)
  return { ...input, demo: false }
}

/* ───────────────────────── Business Audit (#2) ───────────────────────── */

const auditSchema = {
  type: 'OBJECT',
  properties: {
    company: { type: 'STRING' },
    summary: { type: 'STRING' },
    opportunities: {
      type: 'ARRAY',
      items: {
        type: 'OBJECT',
        properties: {
          title: { type: 'STRING' },
          description: { type: 'STRING' },
          hoursPerWeek: { type: 'NUMBER' },
          tools: { type: 'ARRAY', items: { type: 'STRING' } },
        },
        required: ['title', 'description', 'hoursPerWeek', 'tools'],
        propertyOrdering: ['title', 'description', 'hoursPerWeek', 'tools'],
      },
    },
  },
  required: ['company', 'summary', 'opportunities'],
  propertyOrdering: ['company', 'summary', 'opportunities'],
}

async function fetchSiteText(rawUrl) {
  let url
  try {
    url = new URL(/^https?:\/\//i.test(rawUrl) ? rawUrl : `https://${rawUrl}`)
  } catch {
    return ''
  }
  const host = url.hostname
  if (!/^https?:$/.test(url.protocol)) return ''
  if (host === 'localhost' || host.endsWith('.local') || /^(127\.|10\.|192\.168\.|169\.254\.|0\.)/.test(host)) {
    return ''
  }
  try {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), 8000)
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { 'User-Agent': 'AstralAppsBot/1.0 (+https://astralapps.com)' },
      redirect: 'follow',
    })
    clearTimeout(timer)
    if (!res.ok) return ''
    const html = (await res.text()).slice(0, 200_000)
    return html
      .replace(/<script[\s\S]*?<\/script>/gi, ' ')
      .replace(/<style[\s\S]*?<\/style>/gi, ' ')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 4000)
  } catch {
    return ''
  }
}

export async function generateAudit({ url }) {
  const cleanUrl = String(url || '').trim().slice(0, 200)
  if (cleanUrl.length < 3) {
    throw Object.assign(new Error('Please enter your website URL.'), { statusCode: 400 })
  }

  if (!process.env.GEMINI_API_KEY) return mockAudit(cleanUrl)

  const siteText = await fetchSiteText(cleanUrl)
  const context = siteText
    ? `Website content:\n${siteText}`
    : `I could not fetch the page. Infer what you can from the URL itself: ${cleanUrl}`

  const input = await runJson({
    system:
      'You are an automation consultant at AstralApps. Given a company website, identify 3-5 specific ' +
      'workflows the business is most likely doing manually, and how AI/automation would handle each. ' +
      'Be concrete and specific to this business, not generic. Estimate manual hours/week honestly.',
    user: `Audit this business for automation opportunities.\n${context}`,
    schema: auditSchema,
    maxTokens: 1300,
  })

  if (!input) return mockAudit(cleanUrl)
  return { ...input, demo: false }
}

/* ───────────────────────── Blueprint Wizard (#4) ───────────────────────── */

const scopeSchema = {
  type: 'OBJECT',
  properties: {
    summary: { type: 'STRING' },
    deliverables: { type: 'ARRAY', items: { type: 'STRING' } },
    timelineWeeks: {
      type: 'OBJECT',
      properties: { min: { type: 'NUMBER' }, max: { type: 'NUMBER' } },
      required: ['min', 'max'],
    },
    priceRangeUsd: {
      type: 'OBJECT',
      properties: { min: { type: 'NUMBER' }, max: { type: 'NUMBER' } },
      required: ['min', 'max'],
    },
    firstStep: { type: 'STRING' },
  },
  required: ['summary', 'deliverables', 'timelineWeeks', 'priceRangeUsd', 'firstStep'],
  propertyOrdering: ['summary', 'deliverables', 'timelineWeeks', 'priceRangeUsd', 'firstStep'],
}

export async function generateScope({ industry, teamSize, timeDrain, urgency }) {
  const drain = String(timeDrain || '').trim().slice(0, 300)
  if (drain.length < 3) {
    throw Object.assign(new Error('Tell us your biggest time-drain so we can scope it.'), { statusCode: 400 })
  }

  const input = await runJson({
    system:
      'You are a delivery lead at AstralApps, an AI automation studio. From a short intake, produce a ' +
      'realistic project scope a client could act on: deliverables, a timeline in weeks, a rough price ' +
      'range in USD, and a concrete first step. Be grounded and specific; do not over-promise.',
    user:
      `Industry: ${industry || 'unspecified'}\nTeam size: ${teamSize || 'unspecified'}\n` +
      `Biggest time-drain: ${drain}\nUrgency: ${urgency || 'unspecified'}`,
    schema: scopeSchema,
    maxTokens: 1024,
  })

  if (!input) return mockScope(drain)
  return { ...input, demo: false }
}

/* ───────────────────────── Mocks (no API key) ───────────────────────── */

function mockBlueprint(task) {
  const lower = task.toLowerCase()
  const primaryTool = lower.includes('invoice') || lower.includes('account')
    ? 'QuickBooks'
    : lower.includes('crm') || lower.includes('lead')
      ? 'HubSpot'
      : lower.includes('email') || lower.includes('follow')
        ? 'Gmail'
        : 'Airtable'
  return {
    title: 'Automated workflow',
    summary: `An automation that handles “${task}” end-to-end, removing the manual steps your team repeats every week.`,
    trigger: 'A new record, message, or document arrives in one of your tools',
    steps: [
      'Detect the trigger event via webhook or a scheduled check',
      'Extract and validate the relevant details with AI',
      `Create or update the record in ${primaryTool} and any connected tools`,
      'Notify the right person and log the outcome for reporting',
    ],
    tools: [primaryTool, 'Zapier / Make', 'OpenAI', 'Webhooks'],
    hoursSavedPerWeek: 6,
    complexity: 'Moderate',
    estimatedCostUsd: { min: 1500, max: 4000 },
    demo: true,
  }
}

function mockAudit(url) {
  const name = url.replace(/^https?:\/\//i, '').replace(/^www\./i, '').split(/[/.]/)[0] || 'your business'
  return {
    company: name.charAt(0).toUpperCase() + name.slice(1),
    summary: 'A business with repeatable customer, data, and reporting workflows that are likely still manual.',
    opportunities: [
      { title: 'Lead capture & routing', description: 'New enquiries are probably copied between forms, email, and a CRM by hand. This can be captured, enriched, and routed automatically.', hoursPerWeek: 5, tools: ['CRM', 'Webhooks', 'Slack'] },
      { title: 'Follow-up sequences', description: 'Follow-ups sent one by one can be triggered and personalised automatically based on each contact’s stage.', hoursPerWeek: 6, tools: ['Email', 'OpenAI'] },
      { title: 'Reporting & dashboards', description: 'Weekly numbers assembled by hand can compile and deliver themselves on a schedule.', hoursPerWeek: 4, tools: ['Sheets / BI', 'Scheduler'] },
      { title: 'Document intake', description: 'Invoices, forms, and PDFs re-keyed into software can be read and entered automatically.', hoursPerWeek: 5, tools: ['OCR / AI', 'Accounting tool'] },
    ],
    demo: true,
  }
}

function mockScope(drain) {
  return {
    summary: `A focused automation that removes “${drain}” from your team’s week, built and deployed in a short engagement.`,
    deliverables: [
      'Discovery + a mapped workflow for the target process',
      'The production automation, integrated with your existing tools',
      'Monitoring, alerting, and a simple dashboard',
      'Handover docs and 30 days of support',
    ],
    timelineWeeks: { min: 2, max: 5 },
    priceRangeUsd: { min: 3000, max: 9000 },
    firstStep: 'A 30-minute discovery call to confirm the workflow and success metric',
    demo: true,
  }
}
