import { Helmet } from 'react-helmet-async'

interface SEOProps {
  title: string
  description: string
  path?: string
}

const BASE_URL = 'https://kiwikoru3d.com'

const DEFAULT_KEYWORDS = '3D printing New Zealand, 3D printing NZ, custom manufacturing NZ, rapid prototyping New Zealand, replacement parts NZ, 3D printing Northland, 3D printing Whangarei, engineering components NZ, small batch production, product development NZ, on demand manufacturing, 3D printing services Auckland, 3D printing Wellington, Christchurch 3D printing, 3D prototyping, industrial 3D printing, 3D printed parts'

export default function SEO({ title, description, path = '' }: SEOProps) {
  const url = `${BASE_URL}${path}`
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={DEFAULT_KEYWORDS} />
      <link rel="canonical" href={url} />
      <meta name="robots" content="index, follow" />
      <meta name="geo.region" content="NZ-NTL" />
      <meta name="geo.placename" content="Whangarei" />
      <meta name="geo.position" content="-35.7251;174.3236" />
      <meta name="ICBM" content="-35.7251, 174.3236" />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:site_name" content="KiwiKoru 3D" />
      <meta property="og:locale" content="en_NZ" />
      <meta property="og:image" content={`${BASE_URL}/images/og-image.jpg`} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={`${BASE_URL}/images/og-image.jpg`} />
    </Helmet>
  )
}

export const homeSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "KiwiKoru 3D",
  "url": BASE_URL,
  "logo": `${BASE_URL}/images/logo.png`,
  "email": "kiwikoru3d@gmail.com",
  "telephone": "+64-27-260-2954",
  "address": { "@type": "PostalAddress", "addressLocality": "Whangarei", "addressCountry": "NZ" },
  "description": "Custom 3D printing and product development services in New Zealand. Specialising in rapid prototyping, engineering solutions, and replacement parts.",
  "sameAs": ["https://wa.me/640272602954"],
  "priceRange": "$$",
  "paymentAccepted": "Bank Transfer",
  "currenciesAccepted": "NZD",
  "openingHours": ["Mo-Fr 08:00-17:00"],
  "areaServed": { "@type": "Country", "name": "New Zealand" },
}

export const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "KiwiKoru 3D",
  "image": `${BASE_URL}/images/og-image.jpg`,
  "@id": `${BASE_URL}`,
  "url": BASE_URL,
  "telephone": "+64-27-260-2954",
  "email": "kiwikoru3d@gmail.com",
  "address": { "@type": "PostalAddress", "streetAddress": "Morningside", "addressLocality": "Whangarei", "addressRegion": "Northland", "addressCountry": "NZ" },
  "geo": { "@type": "GeoCoordinates", "latitude": -35.7251, "longitude": 174.3236 },
  "openingHoursSpecification": [{ "@type": "OpeningHoursSpecification", "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday"], "opens": "08:00", "closes": "17:00" }],
  "priceRange": "$$",
  "areaServed": { "@type": "Country", "name": "New Zealand" },
  "hasOfferCatalog": { "@type": "OfferCatalog", "name": "3D Printing Services", "itemListElement": [
    { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Custom 3D Printing" } },
    { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Rapid Prototyping" } },
    { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Replacement Parts" } },
    { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Product Development" } },
  ]},
}
