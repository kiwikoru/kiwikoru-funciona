import SEO, { homeSchema } from '../components/SEO'
import Hero from '../sections/Hero'
import TrustSection from '../sections/TrustSection'
import ServicesSection from '../sections/ServicesSection'
import FounderSection from '../sections/FounderSection'
import IndustriesSection from '../sections/IndustriesSection'
import HowItWorks from '../sections/HowItWorks'
import ProjectsSection from '../sections/ProjectsSection'
import CaseStudiesSection from '../sections/CaseStudiesSection'
import CTASection from '../sections/CTASection'

export default function Home() {
  return (
    <>
      <SEO title="KiwiKoru 3D | Custom 3D Printing & Manufacturing NZ"
        description="Professional 3D printing and custom manufacturing in New Zealand. Rapid prototyping, replacement parts, engineering components. Based in Whangārei, serving nationwide."
      />
      <script type="application/ld+json">{JSON.stringify(homeSchema)}</script>
      <Hero />
      <TrustSection />
      <ServicesSection />
      <FounderSection />
      <IndustriesSection />
      <HowItWorks />
      <ProjectsSection />
      <CaseStudiesSection />
      <CTASection />
    </>
  )
}
