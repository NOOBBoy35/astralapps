import { HeroSection } from '../sections/HeroSection'
import { MetricsStrip } from '../sections/MetricsStrip'
import { BeforeAfterSection } from '../sections/BeforeAfterSection'
import { GraveyardSection } from '../sections/GraveyardSection'
import { TimelineSection } from '../sections/TimelineSection'
import { ServicesSection } from '../sections/ServicesSection'
import { BusinessAuditSection } from '../sections/BusinessAuditSection'
import { WorkSection } from '../sections/WorkSection'
import { TechMarquee } from '../sections/TechMarquee'
import { ProcessSection } from '../sections/ProcessSection'
import { RoiSection } from '../sections/RoiSection'
import { BlueprintWizardSection } from '../sections/BlueprintWizardSection'
import { FaqSection } from '../sections/FaqSection'
import { RefusalSection } from '../sections/RefusalSection'
import { CtaBand } from '../ui/CtaBand'
import { ROUTES } from '../../lib/router'

/*
 * The landing page — the full story and interactive proof. Pricing and contact
 * used to live at the bottom of this scroll; they now have their own pages, and
 * the closing CtaBand hands visitors off to them.
 */
export function HomePage() {
  return (
    <>
      {/* Hook — the site is the demo */}
      <HeroSection />
      <MetricsStrip />
      {/* Story */}
      <BeforeAfterSection />
      <GraveyardSection />
      <TimelineSection />
      {/* Capability + interactive proof */}
      <ServicesSection />
      <BusinessAuditSection />
      <WorkSection />
      <TechMarquee />
      <ProcessSection />
      {/* Conversion */}
      <RoiSection />
      <BlueprintWizardSection />
      {/* Trust + close */}
      <FaqSection />
      <RefusalSection />
      <CtaBand
        eyebrow="Next step"
        title="See what it costs — or tell us what to automate."
        description="Transparent pricing and a real conversation are one click away."
        actions={[
          { label: 'View pricing', href: ROUTES.pricing, variant: 'secondary' },
          { label: 'Start a project', href: ROUTES.contact, variant: 'primary' },
        ]}
      />
    </>
  )
}
