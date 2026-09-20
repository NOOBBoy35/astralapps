import { Button } from './Button'

type CtaAction = {
  label: string
  href: string
  variant?: 'primary' | 'secondary'
}

type CtaBandProps = {
  eyebrow: string
  title: string
  description?: string
  actions: CtaAction[]
}

/*
 * A centered closing call-to-action band. Used to send visitors onward to the
 * pricing / contact pages now that those no longer sit at the bottom of the
 * single scroll.
 */
export function CtaBand({ eyebrow, title, description, actions }: CtaBandProps) {
  return (
    <section className="section-shell">
      <div className="relative overflow-hidden rounded-3xl border border-border bg-surface p-8 text-center md:p-14">
        {/* gradient hairline accent along the top edge */}
        <div className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,var(--brand),var(--accent),transparent)]" />

        <p className="eyebrow">{eyebrow}</p>
        <h2 className="mx-auto mt-4 max-w-2xl text-balance font-display text-3xl font-semibold leading-[1.1] text-heading md:text-4xl">
          {title}
        </h2>
        {description && (
          <p className="mx-auto mt-4 max-w-xl text-base leading-8 text-muted">{description}</p>
        )}

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          {actions.map((action) => (
            <Button
              key={action.href}
              href={action.href}
              variant={action.variant ?? 'primary'}
              withArrow={(action.variant ?? 'primary') === 'primary'}
            >
              {action.label}
            </Button>
          ))}
        </div>
      </div>
    </section>
  )
}
