import { HelmetProvider } from 'react-helmet-async'
import SEO, { homeSchema } from '../components/SEO'
import Hero from '../sections/Hero'
import TrustSection from '../sections/TrustSection'
import ServicesSection from '../sections/ServicesSection'
import HowItWorks from '../sections/HowItWorks'
import ProjectsSection from '../sections/ProjectsSection'
import CaseStudiesSection from '../sections/CaseStudiesSection'
import CTASection from '../sections/CTASection'

export default function Home() {
  return (
    <HelmetProvider>
      <SEO title="KiwiKoru 3D | Custom 3D Printing & Product Development NZ"
        description="Custom 3D printing and product development in New Zealand. Rapid prototyping, replacement parts, and engineering solutions from Whangārei."
      />
      <script type="application/ld+json">{JSON.stringify(homeSchema)}</script>
      <Hero />
      <TrustSection />
      <ServicesSection />
      <HowItWorks />
      <ProjectsSection />
      <CaseStudiesSection />
      <CTASection />
    </HelmetProvider>
  )
}
