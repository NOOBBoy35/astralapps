import { useEffect, useRef } from 'react'
import { navItems, socialLinks } from '../../data/site'
import { ROUTES } from '../../lib/router'
import { Button } from '../ui/Button'
import { Icon } from '../ui/Icon'

type MobileMenuProps = {
  open: boolean
  onClose: () => void
  activeId: string
  route: string
}

export function MobileMenu({ open, onClose, activeId, route }: MobileMenuProps) {
  const panelRef = useRef<HTMLDivElement>(null)

  // Lock scroll, trap focus, and restore focus on close.
  useEffect(() => {
    if (!open) return
    const previouslyFocused = document.activeElement as HTMLElement | null
    document.body.style.overflow = 'hidden'

    const focusables = panelRef.current?.querySelectorAll<HTMLElement>('a[href], button')
    focusables?.[0]?.focus()

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
        return
      }
      if (event.key === 'Tab' && focusables && focusables.length > 0) {
        const first = focusables[0]
        const last = focusables[focusables.length - 1]
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault()
          last.focus()
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault()
          first.focus()
        }
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = ''
      previouslyFocused?.focus?.()
    }
  }, [open, onClose])

  return (
    <div
      className={`fixed inset-0 z-60 md:hidden ${open ? '' : 'pointer-events-none'}`}
      aria-hidden={!open}
    >
      <div
        className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${open ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        className={`absolute right-0 top-0 flex h-full w-[84%] max-w-sm flex-col border-l border-border-strong bg-bg-2/95 p-6 backdrop-blur-xl transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="font-display text-xs uppercase tracking-[0.22em] text-muted">
            Navigation
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="grid size-10 place-items-center rounded-full border border-border text-heading transition hover:border-border-strong"
          >
            <svg className="size-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="m6 6 12 12M18 6 6 18"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        <nav className="mt-8 flex flex-col" aria-label="Mobile">
          {navItems.map((item) => {
            const isActive =
              item.kind === 'route' ? route === item.href : route === ROUTES.home && activeId === item.href.slice(1)
            const baseColor = item.accent
              ? 'text-brand hover:text-brand'
              : isActive
                ? 'text-heading'
                : 'text-muted hover:text-heading'
            return (
              <a
                key={item.href}
                href={item.href}
                onClick={onClose}
                aria-current={isActive ? 'page' : undefined}
                className={`flex items-center justify-between border-b border-border py-4 font-display text-2xl transition-colors ${baseColor}`}
              >
                {item.label}
                {item.accent ? (
                  <span aria-hidden="true" className="text-brand">
                    →
                  </span>
                ) : (
                  isActive && <span className="size-1.5 rounded-full bg-brand" />
                )}
              </a>
            )
          })}
        </nav>

        <div className="mt-auto pt-8">
          <Button href={ROUTES.contact} size="lg" withArrow onClick={onClose} className="w-full">
            Start a project
          </Button>
          <div className="mt-6 flex items-center gap-3">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                aria-label={social.label}
                target="_blank"
                rel="noreferrer"
                className="grid size-10 place-items-center rounded-full border border-border text-muted transition hover:border-border-strong hover:text-heading"
              >
                <Icon name={social.icon} className="size-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
