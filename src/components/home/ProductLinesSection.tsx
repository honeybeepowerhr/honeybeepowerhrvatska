import Link from 'next/link'
import { Star, ArrowRight } from 'lucide-react'

interface ProductLine {
  slug: string
  category: string
  name: string
  tagline: string
  price: string
  unit: string
  rating: number
  reviews: number
  color: string
  bgColor: string
  badge: string
  highlights: string[]
  href: string
}

const productLines: ProductLine[] = [
  {
    slug: 'energetski-gelovi',
    category: 'Energetski gelovi',
    name: 'Energy Gel',
    tagline: 'Brza energija. Bez maltodekstrina.',
    price: '2,90',
    unit: '/ 40g sašet',
    rating: 4.9,
    reviews: 128,
    color: 'text-amber-700',
    bgColor: 'bg-amber-50 border-amber-200',
    badge: '24g UH · 0g sukraloze',
    highlights: ['Med kao baza', 'Liofilizirano voće', 'Guarana + morska sol'],
    href: '/proizvodi/energetski-gelovi',
  },
  {
    slug: 'izotonicni-napitci',
    category: 'Izotonični napitci',
    name: 'Isotonic Drink',
    tagline: 'Hidratacija i elektroliti bez kemije.',
    price: '14,90',
    unit: '/ 500g kanta',
    rating: 4.8,
    reviews: 84,
    color: 'text-green-700',
    bgColor: 'bg-green-50 border-green-200',
    badge: '33 porcije · Prirodni okusi',
    highlights: ['Med + glukoza', 'Natrij iz morske soli', 'Limun ili naranča'],
    href: '/proizvodi/izotonicni-napitci',
  },
  {
    slug: 'whey-proteini',
    category: 'Whey proteini',
    name: 'Whey Protein',
    tagline: '91% proteina. Nema ničeg suvišnog.',
    price: '44,90',
    unit: '/ 700g PET',
    rating: 4.9,
    reviews: 212,
    color: 'text-terracotta',
    bgColor: 'bg-orange-50 border-orange-200',
    badge: '91% whey · Stevija · 0g sukraloze',
    highlights: ['Med + stevija', 'Guma akacije', 'Desertni okusi'],
    href: '/proizvodi/whey-proteini',
  },
]

function StarRating({ rating, count }: { rating: number; count: number }) {
  return (
    <div className="flex items-center gap-1.5" aria-label={`Ocjena ${rating} od 5, ${count} recenzija`}>
      <div className="flex" aria-hidden="true">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`w-3.5 h-3.5 ${i < Math.floor(rating) ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}`}
          />
        ))}
      </div>
      <span className="text-xs text-gray-500 font-medium">{rating} ({count})</span>
    </div>
  )
}

export default function ProductLinesSection() {
  return (
    <section aria-labelledby="product-lines-heading" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <h2
            id="product-lines-heading"
            className="font-heading font-black text-4xl sm:text-5xl text-charcoal mb-4"
          >
            Tri linije. Jedan cilj.
          </h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            Energija, hidratacija i oporavak — sve iz prirodnih izvora.
          </p>
        </div>

        {/* Cards grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {productLines.map((p) => (
            <article
              key={p.slug}
              className={`flex flex-col rounded-2xl border-2 p-6 ${p.bgColor} hover:shadow-lg transition-shadow`}
              aria-label={p.name}
            >
              {/* Category + badge */}
              <div className="flex items-start justify-between mb-4">
                <span className={`text-xs font-bold uppercase tracking-widest ${p.color}`}>
                  {p.category}
                </span>
                <span className="text-xs bg-white/80 text-gray-600 font-semibold px-2 py-0.5 rounded-full border border-gray-200">
                  {p.badge}
                </span>
              </div>

              {/* Name + tagline */}
              <h3 className={`font-heading font-black text-2xl ${p.color} mb-1`}>{p.name}</h3>
              <p className="text-gray-600 text-sm mb-4">{p.tagline}</p>

              {/* Highlights */}
              <ul className="space-y-1 mb-6 flex-1" role="list">
                {p.highlights.map((h) => (
                  <li key={h} className="flex items-center gap-2 text-sm text-gray-700">
                    <span aria-hidden="true" className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                    {h}
                  </li>
                ))}
              </ul>

              {/* Rating */}
              <div className="mb-4">
                <StarRating rating={p.rating} count={p.reviews} />
              </div>

              {/* Price + CTA */}
              <div className="flex items-end justify-between mt-auto">
                <div>
                  <p className="text-xs text-gray-400 font-medium">od</p>
                  <p className={`font-heading font-black text-2xl ${p.color}`}>
                    {p.price} €{' '}
                    <span className="text-sm font-normal text-gray-400">{p.unit}</span>
                  </p>
                </div>
                <Link
                  href={p.href}
                  className={`inline-flex items-center gap-1.5 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white text-sm font-bold rounded-xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2`}
                  aria-label={`Pogledaj ${p.name}`}
                >
                  Pogledaj
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Link>
              </div>
            </article>
          ))}
        </div>

        {/* All products CTA */}
        <div className="text-center mt-10">
          <Link
            href="/proizvodi"
            className="inline-flex items-center gap-2 text-amber-600 hover:text-amber-700 font-semibold text-base transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded"
          >
            Svi proizvodi
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  )
}
