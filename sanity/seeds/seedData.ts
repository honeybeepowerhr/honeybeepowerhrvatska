/**
 * Seed data za Honey Bee Power webshop
 *
 * Ova datoteka sadrži strukturirane TypeScript objekte koji odgovaraju
 * Sanity shemama. Nije skripta za automatski import — podaci su namijenjeni
 * ručnom unosu u Sanity Studio ili budućem CLI alatu.
 *
 * Sve cijene su u centima (EUR).
 * Primjer: 290 = 2,90 €
 */

import type { NutritionalRow, NutritionalTable, Variant } from '@/types'

// ─────────────────────────────────────────────────────────────────────────────
// Lokalni tipovi koji mapiraju Sanity dokumente (bez _id jer ga generira Sanity)
// ─────────────────────────────────────────────────────────────────────────────

interface LocalizedString {
  hr: string
  en: string
  de?: string
  sl?: string
}

interface LocalizedText {
  hr: string
  en?: string
  de?: string
  sl?: string
}

interface SanitySlug {
  _type: 'slug'
  current: string
}

interface CategorySeed {
  _type: 'category'
  name: LocalizedString
  slug: SanitySlug
}

interface VariantSeed extends Omit<Variant, '_key' | 'imageOverride'> {
  _key: string
}

interface ProductSeed {
  _type: 'product'
  name: LocalizedString
  slug: SanitySlug
  /** Privremeni string — pri importu zamijeniti Sanity referencom na kategoriju */
  categorySlug: string
  shortDescription: LocalizedText
  basePrice: number
  variants: VariantSeed[]
  nutritionalValues: NutritionalTable
  ingredients: LocalizedText
  allergens: string[]
  eligibleForSubscription: boolean
  status: 'active' | 'inactive'
}

interface BlogPostSeed {
  _type: 'blogPost'
  title: { hr: string }
  slug: SanitySlug
  author: string
  category: string
  publishedAt: string
}

// ─────────────────────────────────────────────────────────────────────────────
// KATEGORIJE
// ─────────────────────────────────────────────────────────────────────────────

export const categorySeeds: CategorySeed[] = [
  {
    _type: 'category',
    name: { hr: 'Energetski gelovi', en: 'Energy Gels' },
    slug: { _type: 'slug', current: 'energetski-gelovi' },
  },
  {
    _type: 'category',
    name: { hr: 'Izotonični napitci', en: 'Isotonic Drinks' },
    slug: { _type: 'slug', current: 'izotonicni-napitci' },
  },
  {
    _type: 'category',
    name: { hr: 'Whey proteini', en: 'Whey Proteins' },
    slug: { _type: 'slug', current: 'whey-proteini' },
  },
]

// ─────────────────────────────────────────────────────────────────────────────
// NUTRITIVNE VRIJEDNOSTI — Energy Gel
// ─────────────────────────────────────────────────────────────────────────────

const energyGelNutrition: NutritionalTable = {
  servingSize: '40g',
  per100g: {
    energyKj: 1050,
    energyKcal: 250,
    carbohydrates: 60,
    sugars: 52,
    protein: 1,
    fat: 0.5,
    saturatedFat: 0.1,
    salt: 0.5,
    sodium: 200,
    caffeine: 50,
  } satisfies NutritionalRow,
  perServing: {
    energyKj: 420,
    energyKcal: 100,
    carbohydrates: 24,
    sugars: 21,
    protein: 0.4,
    fat: 0.2,
    saturatedFat: 0.04,
    salt: 0.2,
    sodium: 80,
    caffeine: 20,
  } satisfies NutritionalRow,
}

// ─────────────────────────────────────────────────────────────────────────────
// NUTRITIVNE VRIJEDNOSTI — Isotonic Drink
// ─────────────────────────────────────────────────────────────────────────────

const isotonicNutrition: NutritionalTable = {
  servingSize: '15g',
  per100g: {
    energyKj: 390,
    energyKcal: 93,
    carbohydrates: 23,
    sugars: 21,
    protein: 0.2,
    fat: 0.1,
    saturatedFat: 0,
    salt: 0.8,
    sodium: 320,
    caffeine: null,
  } satisfies NutritionalRow,
  perServing: {
    energyKj: 58,
    energyKcal: 14,
    carbohydrates: 3.5,
    sugars: 3.1,
    protein: 0.03,
    fat: 0.01,
    saturatedFat: 0,
    salt: 0.12,
    sodium: 48,
    caffeine: null,
  } satisfies NutritionalRow,
}

// ─────────────────────────────────────────────────────────────────────────────
// NUTRITIVNE VRIJEDNOSTI — Whey Protein
// ─────────────────────────────────────────────────────────────────────────────

const wheyNutrition: NutritionalTable = {
  servingSize: '33g',
  per100g: {
    energyKj: 1600,
    energyKcal: 382,
    carbohydrates: 5,
    sugars: 4,
    protein: 91,
    fat: 2.5,
    saturatedFat: 1.2,
    salt: 0.3,
    sodium: 120,
    caffeine: null,
  } satisfies NutritionalRow,
  perServing: {
    energyKj: 528,
    energyKcal: 126,
    carbohydrates: 1.7,
    sugars: 1.3,
    protein: 30,
    fat: 0.8,
    saturatedFat: 0.4,
    salt: 0.1,
    sodium: 40,
    caffeine: null,
  } satisfies NutritionalRow,
}

// ─────────────────────────────────────────────────────────────────────────────
// PROIZVODI
// ─────────────────────────────────────────────────────────────────────────────

export const productSeeds: ProductSeed[] = [
  // ── Proizvod 1: Energy Gel ────────────────────────────────────────────────
  {
    _type: 'product',
    name: {
      hr: 'Honey Bee Power Energy Gel',
      en: 'Honey Bee Power Energy Gel',
    },
    slug: { _type: 'slug', current: 'energy-gel' },
    categorySlug: 'energetski-gelovi',
    shortDescription: {
      hr: 'Energetski gel na bazi meda s liofiliziranim voćem i guaranom. Bez maltodekstrina. Bez sukraloze.',
    },
    basePrice: 249,
    variants: [
      {
        _key: 'gel-limun-40',
        flavour: 'Limun',
        size: '40g',
        sku: 'HBP-GEL-LIM-40',
        price: 249,
        stockLevel: 500,
      },
      {
        _key: 'gel-naranca-40',
        flavour: 'Naranča',
        size: '40g',
        sku: 'HBP-GEL-NAR-40',
        price: 249,
        stockLevel: 500,
      },
      {
        _key: 'gel-malina-40',
        flavour: 'Malina',
        size: '40g',
        sku: 'HBP-GEL-MAL-40',
        price: 249,
        stockLevel: 300,
      },
    ],
    nutritionalValues: energyGelNutrition,
    ingredients: {
      hr: 'Med (višecvjetni), liofilizirano voće (malina/limun/naranča), glukoza, morska sol, guarana ekstrakt.',
    },
    allergens: [],
    eligibleForSubscription: true,
    status: 'active',
  },

  // ── Proizvod 2: Isotonic Drink ────────────────────────────────────────────
  {
    _type: 'product',
    name: {
      hr: 'Honey Bee Power Izotonik',
      en: 'Honey Bee Power Isotonic',
    },
    slug: { _type: 'slug', current: 'izotonik' },
    categorySlug: 'izotonicni-napitci',
    shortDescription: {
      hr: 'Izotonični napitak s medom, glukozom i elektrolitima. Prirodni okusi.',
    },
    basePrice: 999,
    variants: [
      {
        _key: 'iso-limun-500',
        flavour: 'Limun',
        size: '500g',
        sku: 'HBP-ISO-LIM-500',
        price: 999,
        stockLevel: 200,
      },
      {
        _key: 'iso-naranca-500',
        flavour: 'Naranča',
        size: '500g',
        sku: 'HBP-ISO-NAR-500',
        price: 999,
        stockLevel: 200,
      },
      {
        _key: 'iso-limun-15',
        flavour: 'Limun',
        size: '15g',
        sku: 'HBP-ISO-LIM-15',
        price: 190,
        stockLevel: 300,
      },
    ],
    nutritionalValues: isotonicNutrition,
    ingredients: {
      hr: 'Med, glukoza, liofilizirano voće, morska sol, limunska kiselina, prirodni okus.',
    },
    allergens: [],
    eligibleForSubscription: true,
    status: 'active',
  },

  // ── Proizvod 3: Whey Protein ──────────────────────────────────────────────
  {
    _type: 'product',
    name: {
      hr: 'Honey Bee Power Whey Protein',
      en: 'Honey Bee Power Whey Protein',
    },
    slug: { _type: 'slug', current: 'whey-protein' },
    categorySlug: 'whey-proteini',
    shortDescription: {
      hr: 'Whey protein s 91-92% čistoćom. Med kao sladilo. Bez sukraloze. Bez umjetnih aditiva.',
    },
    basePrice: 4490,
    variants: [
      {
        _key: 'whey-vanilija-700',
        flavour: 'Vanilija',
        size: '700g',
        sku: 'HBP-WHY-VAN-700',
        price: 4490,
        stockLevel: 150,
      },
      {
        _key: 'whey-cokolada-700',
        flavour: 'Čokolada',
        size: '700g',
        sku: 'HBP-WHY-COK-700',
        price: 4490,
        stockLevel: 150,
      },
      {
        _key: 'whey-jagoda-700',
        flavour: 'Jagoda',
        size: '700g',
        sku: 'HBP-WHY-JAG-700',
        price: 4490,
        stockLevel: 100,
      },
      {
        _key: 'whey-vanilija-33',
        flavour: 'Vanilija',
        size: '33g',
        sku: 'HBP-WHY-VAN-33',
        price: 390,
        stockLevel: 200,
      },
    ],
    nutritionalValues: wheyNutrition,
    ingredients: {
      hr: 'Whey protein koncentrat (91%), sušeni med, guma akacije, stevija, prirodni okus.',
    },
    allergens: ['lactose'],
    eligibleForSubscription: true,
    status: 'active',
  },
]

// ─────────────────────────────────────────────────────────────────────────────
// BLOG POSTOVI (8 skeleton-a)
// ─────────────────────────────────────────────────────────────────────────────

export const blogPostSeeds: BlogPostSeed[] = [
  {
    _type: 'blogPost',
    title: { hr: 'Koliko gelova po satu na maratonu?' },
    slug: { _type: 'slug', current: 'koliko-gelova-maraton' },
    author: 'HBP Tim',
    category: 'prehrana-i-trening',
    publishedAt: '2024-02-01T08:00:00Z',
  },
  {
    _type: 'blogPost',
    title: { hr: 'Med vs. maltodekstrin — što je bolje gorivo za trkače?' },
    slug: { _type: 'slug', current: 'med-vs-maltodekstrin' },
    author: 'HBP Tim',
    category: 'sastojci',
    publishedAt: '2024-02-15T08:00:00Z',
  },
  {
    _type: 'blogPost',
    title: { hr: 'Kako izbjeći probavne probleme za vrijeme treninga' },
    slug: { _type: 'slug', current: 'probavni-problemi-trening' },
    author: 'HBP Tim',
    category: 'prehrana-i-trening',
    publishedAt: '2024-03-01T08:00:00Z',
  },
  {
    _type: 'blogPost',
    title: { hr: 'Elektroliti i natrij — zašto se znojite i što morate nadoknaditi' },
    slug: { _type: 'slug', current: 'elektroliti-natrij-znojenje' },
    author: 'HBP Tim',
    category: 'prehrana-i-trening',
    publishedAt: '2024-03-15T08:00:00Z',
  },
  {
    _type: 'blogPost',
    title: { hr: 'Kada uzeti protein — timing oporavka za sportaše' },
    slug: { _type: 'slug', current: 'kada-uzeti-protein' },
    author: 'HBP Tim',
    category: 'oporavak',
    publishedAt: '2024-04-01T08:00:00Z',
  },
  {
    _type: 'blogPost',
    title: { hr: 'Sukraloza u sportskoj prehrani — zašto je izbjegavamo' },
    slug: { _type: 'slug', current: 'sukraloza-sportska-prehrana' },
    author: 'HBP Tim',
    category: 'sastojci',
    publishedAt: '2024-04-15T08:00:00Z',
  },
  {
    _type: 'blogPost',
    title: { hr: 'Plan prehrane za polumaraton — tjedan pred utrku' },
    slug: { _type: 'slug', current: 'plan-prehrane-polumaraton' },
    author: 'HBP Tim',
    category: 'prehrana-i-trening',
    publishedAt: '2024-05-01T08:00:00Z',
  },
  {
    _type: 'blogPost',
    title: { hr: 'Liofilizirano voće — zašto je bolje od sintetskih aroma' },
    slug: { _type: 'slug', current: 'liofilizirano-voce' },
    author: 'HBP Tim',
    category: 'sastojci',
    publishedAt: '2024-05-15T08:00:00Z',
  },
]
