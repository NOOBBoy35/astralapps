import { projects, type Project } from '../../data/projects'
import { useReveal } from '../../hooks/useReveal'
import { BuildReplay } from '../ui/BuildReplay'
import { SectionHeader } from '../ui/SectionHeader'

function LoomCard({ project, index }: { project: Project; index: number }) {
  const embed = project.loomUrl?.replace('/share/', '/embed/')
  return (
    <article data-reveal className="glass-card overflow-hidden rounded-2xl">
      {embed ? (
        <div className="aspect-video w-full bg-bg">
          <iframe
            src={embed}
            title={`${project.title} walkthrough`}
            allowFullScreen
            className="h-full w-full"
          />
        </div>
      ) : (
        // No Loom URL yet — play a synthetic "build replay" of the automation.
        <BuildReplay project={project} index={index} />
      )}
      <div className="p-5">
        <span className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-brand-soft">
          {project.industry}
        </span>
        <h3 className="mt-2 font-display text-lg font-semibold text-heading">{project.title}</h3>
        <p className="mt-1.5 text-sm text-muted">{project.result}</p>
      </div>
    </article>
  )
}

export function WorkSection() {
  const sectionRef = useReveal<HTMLElement>()
  const recent = projects.slice(0, 3)

  return (
    <section className="section-shell" id="work" ref={sectionRef}>
      <SectionHeader
        eyebrow="Recent work"
        title="Shipped recently. Updated weekly."
        description="A live look at what's coming out of the studio — real automations, real hours saved."
      />

      {/* Live feed (#15) */}
      <div data-reveal className="mt-10 overflow-hidden rounded-2xl border border-border">
        <div className="flex items-center gap-2 border-b border-border bg-surface px-5 py-3">
          <span className="live-dot size-2 rounded-full bg-accent" />
          <span className="font-mono text-xs uppercase tracking-[0.18em] text-muted">
            last shipped · live feed
          </span>
        </div>
        <ul>
          {recent.map((project) => (
            <li
              key={project.title}
              className="flex flex-col gap-2 border-b border-border px-5 py-4 last:border-b-0 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-center gap-3">
                <span className="rounded-md border border-border bg-bg px-2 py-0.5 font-mono text-[0.65rem] uppercase text-brand-soft">
                  {project.category}
                </span>
                <div>
                  <p className="font-medium text-heading">{project.title}</p>
                  <p className="text-xs text-muted">{project.industry}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 pl-9 font-mono text-xs text-muted sm:pl-0">
                <span className="tabular-nums text-brand-soft">+{project.hoursSavedPerWeek}h/wk</span>
                <span>built in {project.buildTime}</span>
                <span className="text-text">{project.shipped}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Loom case studies (#18) */}
      <div className="mt-10">
        <p data-reveal className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
          Watch a build — 2-min case studies
        </p>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {recent.map((project, i) => (
            <LoomCard key={project.title} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
