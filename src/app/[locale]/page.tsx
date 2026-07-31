import { HeroSection } from '@/components/home/HeroSection'
import { ProductLineSection } from '@/components/home/ProductLineSection'
import { WhyHBPSection } from '@/components/home/WhyHBPSection'
import { SocialProofSection } from '@/components/home/SocialProofSection'
import { ActivitiesGallery } from '@/components/home/ActivitiesGallery'
import { NewsletterSection } from '@/components/home/NewsletterSection'
import { QuizSection } from '@/components/home/QuizSection'
import { JsonLd } from '@/components/seo/JsonLd'
import { HexDivider } from '@/components/ui/HexDivider'

export const revalidate = 60 // ISR revalidate every 60s

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const isHr = locale === 'hr'

  return {
    title: isHr
      ? 'Honey Bee Power — Prirodna Sportska Prehrana na Bazi Meda'
      : 'Honey Bee Power — Natural Honey-Based Sports Nutrition',
    description: isHr
      ? 'Prirodni energetski gelovi, izotonični napitci i whey proteini bez sukraloze i umjetnih dodataka. Proizvedeno u Hrvatskoj.'
      : 'Natural energy gels, isotonic drinks and whey protein made with 100% natural honey. Premium sports nutrition.',
  }
}

export default async function HomePage() {
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Honey Bee Power',
    legalName: 'Planet Bio d.o.o.',
    url: 'https://honeybeepower.hr',
    logo: 'https://honeybeepower.hr/logo.png',
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+385 977 097 962',
      contactType: 'customer service',
      email: 'info@planetbio.hr',
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Krndijska ulica 4',
      addressLocality: 'Našice',
      postalCode: '31500',
      addressCountry: 'HR',
    },
  }

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Honey Bee Power',
    url: 'https://honeybeepower.hr',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://honeybeepower.hr/proizvodi?search={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  }

  return (
    <>
      <JsonLd schema={organizationSchema} />
      <JsonLd schema={websiteSchema} />

      <HeroSection />
      <HexDivider className="py-6 bg-white" />
      <QuizSection />
      <ProductLineSection />
      <WhyHBPSection />
      <HexDivider className="py-6 bg-white" />
      <SocialProofSection />
      <ActivitiesGallery />
      <NewsletterSection />
    </>
  )
}
