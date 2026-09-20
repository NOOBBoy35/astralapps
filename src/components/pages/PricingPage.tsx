import { PricingSection } from '../sections/PricingSection'
import { CtaBand } from '../ui/CtaBand'
import { ROUTES } from '../../lib/router'

/* Pricing on its own page — the transparent tiers, then a nudge to reach out. */
export function PricingPage() {
  return (
    <>
      <PricingSection />
      <CtaBand
        eyebrow="Ready when you are"
        title="Found the right fit?"
        description="Tell us what you want to automate and we'll scope it with you — no obligation."
        actions={[{ label: 'Start a project', href: ROUTES.contact, variant: 'primary' }]}
      />
    </>
  )
}
