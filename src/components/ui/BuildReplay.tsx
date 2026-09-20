import { useEffect, useState } from 'react'
import type { Project } from '../../data/projects'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'
import { DashboardScene, ExtractScene, TriageScene } from './ReplayScenes'

/*
 * "Build replay" — a self-playing, on-brand stand-in for a real screen-recording
 * until a Loom URL is added. The player chrome (header, progress, timecode,
 * play/pause) is shared; the scene inside is unique per case study, chosen by
 * `project.replayKind`. Fully synthetic, theme-aware, reduced-motion-safe.
 */

const LOOP_MS = 9000 // one full replay loop
const TICK = 50 // ms between frames (~20fps — plenty for a small player)
const RUNTIME_S = 120 // faux "2:00" runtime the timecode counts against

function timecode(totalSeconds: number) {
  const s = Math.max(0, Math.floor(totalSeconds))
  return `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`
}

function Scene({ kind, progress }: { kind: Project['replayKind']; progress: number }) {
  if (kind === 'dashboard') return <DashboardScene progress={progress} />
  if (kind === 'extract') return <ExtractScene progress={progress} />
  return <TriageScene progress={progress} />
}

export function BuildReplay({ project, index = 0 }: { project: Project; index?: number }) {
  const reduced = usePrefersReducedMotion()
  const [playing, setPlaying] = useState(true)
  // Offset each card's start so the three players don't animate in lockstep.
  const [elapsed, setElapsed] = useState(index * 1700)
  const animating = playing && !reduced

  useEffect(() => {
    if (!animating) return
    const id = setInterval(() => setElapsed((e) => e + TICK), TICK)
    return () => clearInterval(id)
  }, [animating])

  // Reduced-motion rests on a near-complete frame instead of looping.
  const pos = reduced ? 0.96 : (elapsed % LOOP_MS) / LOOP_MS

  return (
    <div className="flex aspect-video w-full flex-col bg-bg">
      {/* header */}
      <div className="flex items-center justify-between border-b border-border px-3 py-2">
        <span className="flex items-center gap-1.5 font-mono text-[0.6rem] uppercase tracking-wider text-muted">
          <span className="rounded bg-[color-mix(in_srgb,var(--brand)_16%,transparent)] px-1.5 py-0.5 text-brand">
            {project.category}
          </span>
          build replay
        </span>
        <span className="flex items-center gap-1.5 font-mono text-[0.6rem] uppercase tracking-wider text-muted">
          <span className={`size-1.5 rounded-full bg-accent ${animating ? 'live-dot' : ''}`} />
          +{project.hoursSavedPerWeek}h/wk
        </span>
      </div>

      {/* scene */}
      <div className="relative flex-1 overflow-hidden px-3 py-2.5">
        <Scene kind={project.replayKind} progress={pos} />
      </div>

      {/* controls */}
      <div className="flex items-center gap-2.5 border-t border-border px-3 py-2">
        <button
          type="button"
          onClick={() => setPlaying((p) => !p)}
          aria-label={animating ? 'Pause replay' : 'Play replay'}
          className="grid size-6 shrink-0 place-items-center rounded-full border border-border-strong text-heading transition hover:border-brand hover:text-brand"
        >
          {animating ? (
            <svg className="size-3" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <rect x="6" y="5" width="4" height="14" rx="1" />
              <rect x="14" y="5" width="4" height="14" rx="1" />
            </svg>
          ) : (
            <svg className="size-3" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>
        <div className="h-1 flex-1 overflow-hidden rounded-full bg-border">
          <span className="block h-full rounded-full bg-brand" style={{ width: `${pos * 100}%` }} />
        </div>
        <span className="shrink-0 font-mono text-[0.6rem] tabular-nums text-muted">
          {timecode(pos * RUNTIME_S)} / 2:00
        </span>
      </div>
    </div>
  )
}
