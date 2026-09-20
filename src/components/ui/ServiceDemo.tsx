/*
 * Tiny looping "the automation actually working" demos for the service cards (#8).
 * Clean recessed screens with crisp violet motion — editorial, theme-aware.
 * All animation is CSS (respects reduced-motion).
 */
export type DemoKind = 'fill' | 'route' | 'bars' | 'chat' | 'browser' | 'sync'

function FillDemo() {
  return (
    <div className="flex h-full flex-col justify-center gap-2.5">
      {['Name', 'Email', 'Stage'].map((field, i) => (
        <div key={field} className="flex items-center gap-2.5">
          <span className="w-11 shrink-0 text-[0.6rem] font-medium uppercase tracking-wide text-muted">
            {field}
          </span>
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-border">
            <span
              className="anim-fill block h-full rounded-full bg-brand"
              style={{ animationDelay: `${i * 0.45}s` }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

function RouteDemo() {
  return (
    <div className="relative flex h-full items-center justify-between px-1">
      <span className="absolute left-[14%] right-[14%] top-1/2 h-0.5 -translate-y-1/2 rounded-full bg-border-strong" />
      <span className="anim-travel absolute top-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand shadow-[0_0_0_3px_color-mix(in_srgb,var(--brand)_18%,transparent)]" />
      {['Form', 'AI', 'Slack'].map((node) => (
        <span
          key={node}
          className="relative z-10 rounded-md border border-border-strong bg-surface-2 px-2 py-1 text-[0.6rem] font-medium text-heading"
        >
          {node}
        </span>
      ))}
    </div>
  )
}

function BarsDemo() {
  return (
    <div className="flex h-full items-end justify-center gap-2 pb-1">
      {[0, 1, 2, 3, 4].map((i) => (
        <span
          key={i}
          className="anim-bar w-3.5 rounded-t-sm bg-brand"
          style={{ height: '78%', animationDelay: `${i * 0.18}s` }}
        />
      ))}
    </div>
  )
}

function ChatDemo() {
  return (
    <div className="flex h-full flex-col justify-center gap-2">
      <span className="self-end rounded-lg rounded-br-sm border border-border bg-surface-2 px-2.5 py-1 text-[0.65rem] text-heading">
        Can we reschedule?
      </span>
      <div className="self-start rounded-lg rounded-bl-sm border border-border-strong bg-surface-2 px-2.5 py-2">
        <div className="h-1.5 w-16 overflow-hidden rounded-full bg-border">
          <span className="anim-fill block h-full rounded-full bg-brand" />
        </div>
      </div>
    </div>
  )
}

// Web Applications — a browser window with a violet "render" line sweeping down.
function BrowserDemo() {
  return (
    <div className="flex h-full flex-col gap-2">
      <div className="flex items-center gap-1">
        <span className="size-1.5 rounded-full bg-border-strong" />
        <span className="size-1.5 rounded-full bg-border-strong" />
        <span className="size-1.5 rounded-full bg-border-strong" />
        <span className="ml-1 h-2 flex-1 rounded-full bg-border" />
      </div>
      <div className="relative flex-1 overflow-hidden rounded-md border border-border bg-surface-2 p-2">
        <span className="anim-scan absolute inset-x-1 h-4 rounded-full bg-[linear-gradient(to_bottom,color-mix(in_srgb,var(--brand)_32%,transparent),transparent)]" />
        <div className="flex flex-col gap-1.5">
          <span className="h-1.5 w-1/2 rounded-full bg-border-strong" />
          <span className="h-1.5 w-full rounded-full bg-border" />
          <span className="h-1.5 w-3/4 rounded-full bg-border" />
        </div>
      </div>
    </div>
  )
}

// API Integrations — a request and a response packet crossing between two endpoints.
function SyncDemo() {
  return (
    <div className="relative flex h-full items-center justify-between px-1">
      <span className="absolute left-[24%] right-[24%] top-1/2 h-0.5 -translate-y-1/2 rounded-full bg-border-strong" />
      <span className="anim-req absolute top-[36%] size-2 -translate-y-1/2 rounded-sm bg-brand" />
      <span className="anim-res absolute top-[64%] size-2 -translate-y-1/2 rounded-sm bg-brand-soft" />
      <span className="relative z-10 rounded-md border border-border-strong bg-surface-2 px-2 py-1 text-[0.6rem] font-medium text-heading">
        CRM
      </span>
      <span className="relative z-10 rounded-md border border-border-strong bg-surface-2 px-2 py-1 font-mono text-[0.6rem] font-medium text-heading">
        {'{ }'}
      </span>
    </div>
  )
}

export function ServiceDemo({ kind }: { kind: DemoKind }) {
  return (
    <div className="relative h-24 overflow-hidden rounded-lg border border-border bg-bg p-3">
      {kind === 'fill' && <FillDemo />}
      {kind === 'route' && <RouteDemo />}
      {kind === 'bars' && <BarsDemo />}
      {kind === 'chat' && <ChatDemo />}
      {kind === 'browser' && <BrowserDemo />}
      {kind === 'sync' && <SyncDemo />}
    </div>
  )
}
