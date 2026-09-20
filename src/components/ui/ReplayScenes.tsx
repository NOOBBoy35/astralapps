/*
 * Build-replay scenes — one visually distinct animation per case study.
 * Each is a pure function of `progress` (0..1 around the loop), so the shared
 * player engine drives them and reduced-motion just holds a near-complete frame.
 *
 *   triage    — a candidate queue: each row is scored, then synced
 *   dashboard — an analytics report building itself, then sent
 *   extract   — an invoice scanned, fields lifted into a structured record
 */

type SceneProps = { progress: number }

const clamp01 = (n: number) => Math.max(0, Math.min(1, n))

const Check = ({ className = 'size-3' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M4 13l4 4L20 5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

/* ── Scene 1: candidate triage queue ──────────────────────────────── */
const CANDIDATES = [
  { initials: 'AK', score: 92 },
  { initials: 'RM', score: 88 },
  { initials: 'JD', score: 95 },
]

export function TriageScene({ progress }: SceneProps) {
  const run = clamp01(progress / 0.85)
  const current = Math.min(CANDIDATES.length, Math.floor(run * CANDIDATES.length))

  return (
    <div className="flex h-full flex-col justify-center gap-1.5">
      {CANDIDATES.map((c, i) => {
        const done = i < current
        const scoring = i === current && progress < 0.85
        return (
          <div
            key={c.initials}
            className={`flex items-center gap-2 rounded-md border px-2 py-1.5 transition-all duration-300 ${
              done
                ? 'border-[color-mix(in_srgb,var(--brand)_35%,transparent)] bg-[color-mix(in_srgb,var(--brand)_8%,transparent)]'
                : scoring
                  ? 'border-border-strong bg-surface'
                  : 'border-border bg-surface opacity-55'
            }`}
          >
            <span
              className={`grid size-6 shrink-0 place-items-center rounded-full font-mono text-[0.58rem] font-semibold transition-colors ${
                done || scoring ? 'bg-brand text-white' : 'bg-border text-muted'
              }`}
            >
              {c.initials}
            </span>
            <div className="flex-1 space-y-1">
              <span className="block h-1.5 w-2/3 rounded-full bg-border-strong" />
              <span className="block h-1.5 w-2/5 rounded-full bg-border" />
            </div>
            {done ? (
              <span className="flex shrink-0 items-center gap-1 font-mono text-[0.6rem] font-semibold text-brand">
                {c.score}
                <Check className="size-3" />
              </span>
            ) : scoring ? (
              <span className="flex shrink-0 items-center gap-1 font-mono text-[0.6rem] text-muted">
                <span className="size-3 animate-spin rounded-full border border-border-strong border-t-brand" />
                scoring
              </span>
            ) : (
              <span className="shrink-0 font-mono text-[0.6rem] text-muted">queued</span>
            )}
          </div>
        )
      })}
    </div>
  )
}

/* ── Scene 2: analytics dashboard building + sending ──────────────── */
const BARS = [44, 70, 52, 84, 63]

export function DashboardScene({ progress }: SceneProps) {
  const reach = Math.floor(24800 * clamp01((progress - 0.04) / 0.55))
  const sent = clamp01((progress - 0.74) / 0.14)

  return (
    <div className="relative flex h-full items-stretch gap-3">
      <div className="flex w-[38%] flex-col justify-center">
        <span className="font-mono text-[0.55rem] uppercase tracking-wider text-muted">Reach</span>
        <span className="font-display text-xl font-semibold tabular-nums leading-tight text-heading">
          {reach.toLocaleString()}
        </span>
        <span className="mt-0.5 font-mono text-[0.55rem] text-brand">▲ aggregating</span>
      </div>

      <div className="flex flex-1 items-end justify-between gap-1.5 pb-0.5">
        {BARS.map((h, i) => {
          const grow = clamp01((progress - 0.04 - i * 0.05) / 0.3)
          return (
            <span
              key={i}
              className="w-full rounded-t-sm bg-brand"
              style={{ height: `${Math.max(6, h * grow)}%` }}
            />
          )
        })}
      </div>

      <div
        className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-1.5 rounded-md border border-[color-mix(in_srgb,var(--brand)_35%,transparent)] bg-[color-mix(in_srgb,var(--bg)_95%,transparent)] py-1 font-mono text-[0.6rem] font-medium text-heading"
        style={{ opacity: sent, transform: `translateY(${(1 - sent) * 8}px)` }}
      >
        <Check className="size-3 text-brand" />
        report emailed → 12 clients
      </div>
    </div>
  )
}

/* ── Scene 3: invoice OCR → structured record ─────────────────────── */
const FIELDS = [
  { label: 'Vendor', value: 'Acme Co.' },
  { label: 'Invoice', value: '#4192' },
  { label: 'Total', value: '$4,120' },
]

export function ExtractScene({ progress }: SceneProps) {
  const run = clamp01(progress / 0.85)
  const read = Math.min(FIELDS.length, Math.floor(run * FIELDS.length))
  // scan line sweeps the doc top→bottom as it reads
  const scanTop = 14 + Math.min(1, run) * 62

  return (
    <div className="flex h-full items-center gap-3">
      {/* invoice document with a scan line */}
      <div className="relative h-[86%] w-[38%] shrink-0 overflow-hidden rounded-md border border-border bg-surface-2 p-2">
        <span className="block h-1.5 w-1/2 rounded-full bg-border-strong" />
        <div className="mt-2 space-y-1.5">
          {FIELDS.map((f, i) => (
            <span
              key={f.label}
              className={`block h-1.5 rounded-full transition-colors duration-200 ${
                i < read ? 'bg-[color-mix(in_srgb,var(--brand)_45%,transparent)]' : 'bg-border'
              }`}
              style={{ width: `${68 - i * 12}%` }}
            />
          ))}
        </div>
        {progress < 0.85 && (
          <span
            className="absolute inset-x-1 h-4 rounded bg-[linear-gradient(to_bottom,color-mix(in_srgb,var(--brand)_28%,transparent),transparent)]"
            style={{ top: `${scanTop}%` }}
          />
        )}
      </div>

      {/* structured record filling in */}
      <div className="flex-1 space-y-1.5">
        {FIELDS.map((f, i) => {
          const shown = i < read
          return (
            <div
              key={f.label}
              className={`flex items-center justify-between rounded border px-2 py-1 font-mono text-[0.62rem] transition-colors duration-300 ${
                shown ? 'border-[color-mix(in_srgb,var(--brand)_30%,transparent)] bg-surface' : 'border-border bg-surface'
              }`}
            >
              <span className="text-muted">{f.label}</span>
              {shown ? (
                <span className="flex items-center gap-1 font-semibold text-heading">
                  {f.value}
                  <Check className="size-2.5 text-brand" />
                </span>
              ) : (
                <span className="h-1.5 w-10 rounded-full bg-border" />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
