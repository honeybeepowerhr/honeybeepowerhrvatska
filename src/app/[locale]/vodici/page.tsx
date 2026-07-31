import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useTranslations } from 'next-intl'

export const revalidate = 300 // ISR revalidate every 5 mins

export const metadata = {
  title: 'Vodiči i Savjeti za Sportske Performanse — Honey Bee Power',
  description:
    'Stručni članci o prehrani na maratonima, hidrataciji za bicikliste i oporavku mišića uz pomoć prirodnog meda.',
}

const ARTICLES = [
  {
    slug: 'zasto-je-med-bolji-od-malto-dekstrina-na-maratonu',
    title: 'Zašto je med bolji od malto-dekstrina na maratonu?',
    excerpt: 'Znanstvena usporedba prirodnog omjera fruktoze i glukoze u medu naspram sintetičkih ugljikovih hidrata.',
    date: '20. svibnja 2025.',
    readTime: '5 min čitanja',
    imageUrl: '/images/events/event-1.jpg',
  },
  {
    slug: 'kako-sprijeciti-grceve-u-misicima-tijekom-ljetnih-voznji',
    title: 'Kako spriječiti grčeve u mišićima tijekom ljetnih vožnji biciklom',
    excerpt: 'Prava strategija unos elektrolita i tekućine. Vodič za optimalnu hidrataciju.',
    date: '12. lipnja 2025.',
    readTime: '4 min čitanja',
    imageUrl: '/images/events/event-8.jpg',
  },
  {
    slug: 'uloga-bjelancevina-i-meda-u-brzem-oporavku-nakon-treninga',
    title: 'Uloga bjelančevina i meda u bržem oporavku mišićnih vlakana',
    excerpt: 'Kombinacija proteina sirutke i brzih prirodnih ugljikohidrata obnavlja zalihe glikogena u rekordnom roku.',
    date: '04. srpnja 2025.',
    readTime: '6 min čitanja',
    imageUrl: '/images/events/event-11.jpg',
  },
]

export default function BlogListingPage() {
  const t = useTranslations('guidesPage')

  return (
    <div className="py-12 md:py-16 bg-gray-50/50">
      <div className="container mx-auto px-4 max-w-7xl">
        
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="text-xs text-gray-500 mb-6 flex items-center gap-2">
          <Link href="/" className="hover:underline">Početna</Link>
          <span>/</span>
          <span className="font-semibold text-gray-900">{t('badge')}</span>
        </nav>

        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-amber-600 font-bold text-sm uppercase tracking-wider">{t('badge')}</span>
          <h1 className="text-4xl font-extrabold text-gray-900 mt-1">
            {t('title')}
          </h1>
          <p className="text-gray-600 mt-3 text-base">
            {t('subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {ARTICLES.map((article) => (
            <article
              key={article.slug}
              className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-lg transition-all flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-video w-full bg-gray-100">
                  <Image
                    src={article.imageUrl}
                    alt={article.title}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="p-6">
                  <div className="flex items-center gap-3 text-xs text-gray-400 mb-3">
                    <span>{article.date}</span>
                    <span>•</span>
                    <span>{article.readTime}</span>
                  </div>

                  <h2 className="text-xl font-bold text-gray-900 hover:text-amber-600 transition-colors leading-snug">
                    <Link href={`/vodici/${article.slug}`}>{article.title}</Link>
                  </h2>

                  <p className="text-sm text-gray-600 mt-3 line-clamp-3 leading-relaxed">
                    {article.excerpt}
                  </p>
                </div>
              </div>

              <div className="p-6 pt-0">
                <Link
                  href={`/vodici/${article.slug}`}
                  className="inline-flex items-center text-amber-600 font-bold text-sm hover:underline"
                >
                  {t('readMore')}
                </Link>
              </div>
            </article>
          ))}
        </div>

      </div>
    </div>
  )
}
