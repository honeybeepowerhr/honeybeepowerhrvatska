import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { JsonLd } from '@/components/seo/JsonLd'

export const revalidate = 300

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const formattedTitle = slug.replace(/-/g, ' ')
  return {
    title: `${formattedTitle} — Honey Bee Power Vodič`,
    description: 'Prirodna sportska prehrana i savjeti za vrhunske performanse bez probavnih smetnji.',
  }
}

export default async function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  await params
  const title = 'Zašto je med bolji od malto-dekstrina na maratonu?'

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    image: ['/images/events/event-1.jpg'],
    datePublished: '2025-05-20T08:00:00+02:00',
    dateModified: '2025-05-20T08:00:00+02:00',
    author: [
      {
        '@type': 'Person',
        name: 'Dr. sc. Ante Horvat',
      },
    ],
    publisher: {
      '@type': 'Organization',
      name: 'Honey Bee Power',
      logo: {
        '@type': 'ImageObject',
        url: 'https://honeybeepower.hr/logo.png',
      },
    },
  }

  return (
    <article className="py-12 md:py-16 bg-white">
      <JsonLd schema={articleSchema} />

      <div className="container mx-auto px-4 max-w-3xl">
        
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="text-xs text-gray-500 mb-8 flex items-center gap-2">
          <Link href="/" className="hover:underline">Početna</Link>
          <span>/</span>
          <Link href="/vodici" className="hover:underline">Vodiči</Link>
          <span>/</span>
          <span className="font-semibold text-gray-900 truncate max-w-[200px]">{title}</span>
        </nav>

        <header className="mb-8">
          <div className="text-xs font-bold text-amber-600 uppercase tracking-widest mb-2">
            Sportska Nutricionistika
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight">
            {title}
          </h1>
          <div className="flex items-center gap-4 text-xs text-gray-500 mt-4 pb-6 border-b border-gray-100">
            <span>Autor: Dr. sc. Ante Horvat</span>
            <span>•</span>
            <span>20. svibnja 2025.</span>
            <span>•</span>
            <span>5 min čitanja</span>
          </div>
        </header>

        <div className="relative aspect-video w-full rounded-2xl overflow-hidden mb-8 bg-gray-100 shadow-md">
          <Image
            src="/images/events/event-1.jpg"
            alt={title}
            fill
            className="object-cover"
            priority
          />
        </div>

        <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-6 font-sans">
          <p className="text-lg font-medium text-gray-900">
            Tijekom intenzivnog maratonskog trčanja ili dugotrajnog bicikliranja, odabir izvora ugljikohidrata može značiti razliku između osobnog rekorda i odustajanja zbog mučnine u želucu.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8">
            Sintetička glukoza vs. Prirodni cvjetni med
          </h2>

          <p>
            Većina industrijskih energetskih gelova oslanja se na sintetički malto-dekstrin. Iako malto-dekstrin ima visoki glikemijski indeks, on brzo povlači vodu u crijeva, uzrokujući nadutost i poznati &quot;runner&apos;s stomach&quot;.
          </p>

          <p>
            Nasuprot tome, <strong>prirodni med</strong> prirodno sadrži idealan omjer fruktoze i glukoze (otprilike 1:1) uz dodatne minerale, enzime i antioksidanse. Fruktoza i glukoza koriste različite transportne proteine u crijevima (GLUT5 i SGLT1), što omogućuje maksimalnu apsorpciju do 90 grama ugljikohidrata po satu bez opterećenja probave.
          </p>

          <div className="p-6 bg-amber-50 rounded-2xl border border-amber-200 my-8">
            <h3 className="text-lg font-bold text-amber-900 mb-2">Preporučeni proizvod za utrke:</h3>
            <p className="text-sm text-amber-800 mb-4">
              Honey Power Energy Gel pruža 26g čistih ugljikohidrata po pakiranju uz liofilizirano šumsko voće.
            </p>
            <Link
              href="/proizvodi/honey-power-energy-gel"
              className="inline-flex items-center px-4 py-2 bg-amber-500 text-slate-950 font-bold rounded-xl text-xs hover:bg-amber-600 transition"
            >
              Pogledaj Honey Power Energy Gel →
            </Link>
          </div>
        </div>

      </div>
    </article>
  )
}
