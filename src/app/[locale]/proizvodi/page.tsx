import type { Metadata } from 'next'
import type { Locale } from '@/types'
import CatalogueGrid from '@/components/product/CatalogueGrid'
import { ShopModeToggle } from '@/components/layout/ShopModeToggle'
import { REAL_PRODUCTS } from '@/lib/products-data'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Proizvodi | Honey Bee Power',
  description:
    'Pregledaj kompletnu ponudu Honey Bee Power proizvoda — energetski gelovi i izotonični napitci na bazi meda.',
}

interface ProizvodiPageProps {
  params: Promise<{ locale: Locale }>
}

export default async function ProizvodiPage({ params }: ProizvodiPageProps) {
  const { locale } = await params

  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl relative z-10 space-y-8">
      <div>
        <h1 className="text-4xl sm:text-5xl font-black mb-3 font-heading uppercase tracking-wide text-gray-900">
          Svi proizvodi
        </h1>
        <p className="text-lg text-gray-600 font-sans font-medium">
          Sto posto prirodna sportska prehrana na bazi meda, liofiliziranog voća i elektrolita.
        </p>
      </div>

      {/* Mode selection banner: Wholesale vs Retail */}
      <ShopModeToggle />

      <CatalogueGrid products={REAL_PRODUCTS} locale={locale} />
    </div>
  )
}
