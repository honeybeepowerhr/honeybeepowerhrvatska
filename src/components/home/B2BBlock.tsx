import Link from 'next/link'
import { useTranslations, useLocale } from 'next-intl'
import { ArrowRight, Building2 } from 'lucide-react'
import type { Locale } from '@/types'

export default function B2BBlock() {
  const t = useTranslations('b2bBlock')
  const locale = useLocale() as Locale
  const prefix = locale === 'hr' ? '' : `/${locale}`

  return (
    <section aria-labelledby="b2b-heading" className="py-16 bg-charcoal">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-8 text-center sm:text-left">
          <div className="flex items-start gap-5">
            <div
              aria-hidden="true"
              className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center shrink-0 mt-0.5"
            >
              <Building2 className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <h2
                id="b2b-heading"
                className="font-heading font-black text-2xl sm:text-3xl text-white mb-2"
              >
                {t('title')}
              </h2>
              <p className="text-gray-400 text-base">
                {t('subtitle')}
              </p>
            </div>
          </div>

          <Link
            href={`${prefix}/b2b`}
            className="inline-flex items-center gap-2 px-6 py-3.5 bg-amber-500 hover:bg-amber-600 text-white font-bold text-base rounded-xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal shrink-0"
          >
            {t('cta')}
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  )
}
