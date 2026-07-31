import Link from 'next/link'
import Image from 'next/image'
import { Camera } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useLocale } from 'next-intl'
import type { Locale } from '@/types'
import { HexDivider } from '@/components/ui/HexDivider'

// ─── Bee wordmark (Logo Image) ────────────────────────────────────────────────

function BeeLogoSmall() {
  return (
    <Image
      src="/images/logo.png"
      alt="Honey Bee Power Logo"
      width={36}
      height={36}
      className="w-9 h-9 rounded-lg object-contain shrink-0"
    />
  )
}

// ─── Footer component ─────────────────────────────────────────────────────────

export default function Footer() {
  const t = useTranslations('footer')
  const tNav = useTranslations('nav')
  const locale = useLocale() as Locale
  const prefix = locale === 'hr' ? '' : `/${locale}`

  const productLinks = [
    { label: t('energyGels'),     href: `${prefix}/proizvodi/energetski-gelovi` },
    { label: t('isotonicDrinks'),  href: `${prefix}/proizvodi/izotonicki-napitci` },
    { label: t('whereToBuy'),      href: `${prefix}/gdje-kupiti` },
  ]

  const infoLinks = [
    { label: t('faq'),             href: `${prefix}/faq` },
    { label: t('shippingPayment'),  href: `${prefix}/dostava-i-placanje` },
    { label: t('returns'),         href: `${prefix}/pravo-na-povrat` },
    { label: t('privacy'),         href: `${prefix}/politika-privatnosti` },
    { label: t('terms'),           href: `${prefix}/uvjeti-koristenja` },
    { label: t('impressum'),       href: `${prefix}/impressum` },
  ]

  const companyLinks = [
    { label: tNav('athletes'), href: `${prefix}/sportasi` },
    { label: tNav('guides'),   href: `${prefix}/vodici` },
    { label: tNav('b2b'),      href: `${prefix}/b2b` },
    { label: tNav('contact'),  href: `${prefix}/kontakt` },
  ]

  const currentYear = new Date().getFullYear()

  return (
    <footer role="contentinfo" className="bg-charcoal text-white">
      <HexDivider tone="dark" className="pt-8" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand + Contact */}
          <div className="space-y-4">
            <Link
              href={`${prefix}/`}
              aria-label="Honey Bee Power — početna stranica"
              className="flex items-center gap-2 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded"
            >
              <BeeLogoSmall />
              <span className="font-heading font-black text-lg text-white">
                Honey Bee Power
              </span>
            </Link>

            <p className="text-sm text-gray-400 leading-relaxed max-w-xs">
              {t('aboutText')}
            </p>

            {/* Contact details */}
            <address
              className="not-italic text-sm text-gray-400 space-y-1"
              aria-label="Kontakt podaci Planet Bio d.o.o."
            >
              <p className="font-semibold text-gray-200">Planet Bio d.o.o.</p>
              <p>Krndijska ulica 4</p>
              <p>31500 Našice, Hrvatska</p>
              <a
                href="mailto:info@planetbio.hr"
                className="block hover:text-amber-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded"
                aria-label="Pošalji e-mail na info@planetbio.hr"
              >
                info@planetbio.hr
              </a>
              <a
                href="tel:+385977097962"
                className="block hover:text-amber-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded"
                aria-label="Pozovi +385 977 097 962"
              >
                +385 977 097 962
              </a>
              <a
                href="https://www.instagram.com/planet__bio/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 pt-2 text-amber-400 hover:text-amber-300 font-semibold text-xs transition-colors"
                aria-label="Pratite nas na Instagramu @planet__bio"
              >
                <Camera className="w-4 h-4" />
                <span>@planet__bio</span>
              </a>
            </address>
          </div>

          {/* Products column */}
          <nav aria-label="Navigacija — Proizvodi">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">
              {t('products')}
            </h3>
            <ul role="list" className="space-y-2">
              {productLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-300 hover:text-amber-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Info / Legal column */}
          <nav aria-label="Navigacija — Informacije">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">
              {t('info')}
            </h3>
            <ul role="list" className="space-y-2">
              {infoLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-300 hover:text-amber-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Company column */}
          <nav aria-label="Navigacija — Tvrtka">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">
              {t('company')}
            </h3>
            <ul role="list" className="space-y-2">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-300 hover:text-amber-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
          <p>
            &copy; {currentYear} Planet Bio d.o.o. — {t('rights')}.
          </p>
          <div className="flex items-center gap-4">
            <Link
              href={`${prefix}/impressum`}
              className="hover:text-gray-300 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded"
            >
              {t('impressum')}
            </Link>
            <Link
              href={`${prefix}/politika-privatnosti`}
              className="hover:text-gray-300 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded"
            >
              {t('privacy')}
            </Link>
            <Link
              href={`${prefix}/uvjeti-koristenja`}
              className="hover:text-gray-300 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded"
            >
              {t('terms')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
