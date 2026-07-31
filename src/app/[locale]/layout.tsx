import type { Metadata } from 'next'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { Barlow_Condensed, Inter } from 'next/font/google'
import { locales } from '@/features/i18n/config'
import type { Locale } from '@/types'
import InfoBar from '@/components/layout/InfoBar'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { CartPanel } from '@/components/cart/CartPanel'
import { AmbientBackground } from '@/components/ui/AmbientBackground'
import '../globals.css'

const barlowCondensed = Barlow_Condensed({
  subsets: ['latin', 'latin-ext'],
  weight: ['700', '800', '900'],
  variable: '--font-barlow-condensed',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-inter',
  display: 'swap',
})

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://honeybeepower.hr'),
  title: {
    template: '%s | Honey Bee Power',
    default: 'Honey Bee Power – Prirodna sportska prehrana',
  },
  description:
    'Energetski gelovi, izotonični napitci i whey proteini na bazi meda. Bez sukraloze, bez umjetnih aditiva.',
}

interface LocaleLayoutProps {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params

  if (!locales.includes(locale as Locale)) {
    notFound()
  }

  const messages = await getMessages()

  return (
    <html lang={locale} className={`${barlowCondensed.variable} ${inter.variable}`}>
      <head>
        {/* GTM placeholder — aktivira se u koraku 13 */}
        {process.env.NEXT_PUBLIC_GTM_ID && (
          <script
            dangerouslySetInnerHTML={{
              __html: `<!-- GTM will be loaded here in step 13 -->`,
            }}
          />
        )}
      </head>
      <body className="font-inter bg-[#fffaf0] text-charcoal antialiased relative">
        <NextIntlClientProvider messages={messages}>
          {/* Global soft ambient background */}
          <AmbientBackground />
          {/* Free-shipping info bar — 5 EUR threshold = 500 cents */}
          <InfoBar freeShippingThreshold={5000} locale={locale as Locale} />
          {/* Sticky header */}
          <Header />
          {/* Page content */}
          <main id="main-content" tabIndex={-1}>
            {children}
          </main>
          {/* Footer */}
          <Footer />
          {/* Slide-over cart drawer */}
          <CartPanel />
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
