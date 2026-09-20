import type { ReactNode } from 'react'
import { services, type Service } from '../../data/services'
import { useReveal } from '../../hooks/useReveal'
import { SectionHeader } from '../ui/SectionHeader'
import { ServiceDemo, type DemoKind } from '../ui/ServiceDemo'

const iconProps = {
  className: 'size-5',
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}

const serviceIcons: Record<Service['icon'], ReactNode> = {
  ai: (
    <svg {...iconProps}>
      <path d="M12 3l1.5 4L18 8.5 13.5 10 12 14l-1.5-4L6 8.5 10.5 7 12 3z" />
      <path d="M18 14l.7 1.8L20.5 16l-1.8.7L18 18.5l-.7-1.8L15.5 16l1.8-.2L18 14z" />
    </svg>
  ),
  web: (
    <svg {...iconProps}>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.5 2.5 2.5 15.5 0 18M12 3c-2.5 2.5-2.5 15.5 0 18" />
    </svg>
  ),
  automation: (
    <svg {...iconProps}>
      <path d="M21 12a9 9 0 1 1-2.6-6.3" />
      <path d="M21 4v4h-4" />
    </svg>
  ),
  chat: (
    <svg {...iconProps}>
      <path d="M21 11.5a8 8 0 0 1-11.5 7.2L3 21l1.8-6.5A8 8 0 1 1 21 11.5z" />
      <path d="M8.5 11.5h.01M12 11.5h.01M15.5 11.5h.01" />
    </svg>
  ),
  dashboard: (
    <svg {...iconProps}>
      <rect x="3" y="3" width="7" height="9" rx="1.5" />
      <rect x="14" y="3" width="7" height="5" rx="1.5" />
      <rect x="14" y="12" width="7" height="9" rx="1.5" />
      <rect x="3" y="16" width="7" height="5" rx="1.5" />
    </svg>
  ),
  api: (
    <svg {...iconProps}>
      <path d="M9 8l-4 4 4 4M15 8l4 4-4 4" />
      <path d="M13 6l-2 12" />
    </svg>
  ),
}

// One distinct demo per service — no two share an animation.
const demoFor: Record<Service['icon'], DemoKind> = {
  ai: 'fill',
  web: 'browser',
  automation: 'route',
  chat: 'chat',
  dashboard: 'bars',
  api: 'sync',
}

export function ServicesSection() {
  const sectionRef = useReveal<HTMLElement>()

  return (
    <section className="section-shell" id="services" ref={sectionRef}>
      <SectionHeader
        eyebrow="What we build"
        title="Automation across AI, web, ops & integrations."
        description="Hover any card to watch the kind of system we build — running, not described."
      />

      <div className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {services.map((service) => (
          <article
            key={service.title}
            data-reveal
            className="card-glow glass-card group rounded-2xl p-5"
          >
            <ServiceDemo kind={demoFor[service.icon]} />
            <div className="mt-5 flex items-center gap-2.5">
              <span className="grid size-9 shrink-0 place-items-center rounded-lg border border-border bg-[linear-gradient(145deg,color-mix(in_srgb,var(--brand)_22%,transparent),transparent)] text-brand-soft">
                {serviceIcons[service.icon]}
              </span>
              <h3 className="font-display text-lg font-semibold text-heading">{service.title}</h3>
            </div>
            <p className="mt-3 text-sm leading-7 text-muted">{service.description}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
