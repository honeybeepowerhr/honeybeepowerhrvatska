import type { ProductSummary } from '@/types'

export const REAL_PRODUCTS: ProductSummary[] = [
  {
    _id: 'hbp-gel-lemon',
    name: {
      hr: 'Honey Bee Power Energy Gel – Limun',
      en: 'Honey Bee Power Energy Gel – Lemon',
      de: 'Honey Bee Power Energy Gel – Zitrone',
      sl: 'Honey Bee Power Energy Gel – Limona',
      pl: 'Honey Bee Power Energy Gel – Cytryna',
    },
    slug: 'honey-bee-power-energy-gel-limun',
    category: 'energetski-gelovi',
    minQuantity: 50,
    shortDescription: {
      hr: 'Prirodni energetski gel na bazi domaćeg cvjetnog meda i prirodnog soka limuna. Brza i dugotrajna energija bez padova.',
      en: 'Natural energy gel based on local flower honey and natural lemon juice. Fast, sustained energy without sugar crashes.',
      de: 'Natürliches Energiegel auf Basis von Blütenhonig und Zitronensaft.',
      sl: 'Naravni energijski gel na osnovi cvetličnega medu in limoninega soka.',
      pl: 'Naturalny żel energetyczny na bazie lokalnego miodu kwiatowego i soku z cytryny.',
    },
    basePrice: 249,
    mainImage: {
      _type: 'image',
      asset: {
        _ref: '/images/products/energygellimun.png',
        _type: 'reference',
      },
      alt: 'Honey Bee Power Energy Gel Limun',
    },
    imageGallery: [
      {
        _type: 'image',
        asset: { _ref: '/images/products/energygellimun.png', _type: 'reference' },
        alt: 'Honey Bee Power Energy Gel Limun — pakiranje',
      },
      {
        _type: 'image',
        asset: { _ref: '/images/products/energygellimun-detail-1.jpg', _type: 'reference' },
        alt: 'Honey Bee Power Energy Gel Limun — detalj',
      },
    ],
    variants: [
      { _key: 'v1', flavour: 'Limun', size: '40g sachet', sku: 'HBP-GEL-LIM-40', price: 249, stockLevel: 100, minQuantity: 50 },
      { _key: 'v2', flavour: 'Limun', size: 'Paket 10x40g', sku: 'HBP-GEL-LIM-10', price: 1999, stockLevel: 45, minQuantity: 5 },
    ],
    averageRating: 4.9,
    reviewCount: 38,
  },
  {
    _id: 'hbp-gel-lemon-pack10',
    name: {
      hr: 'Honey Bee Power Energy Gel – Limun (Paket 10 kom)',
      en: 'Honey Bee Power Energy Gel – Lemon (10 Pack)',
      de: 'Honey Bee Power Energy Gel – Zitrone (10er Pack)',
      sl: 'Honey Bee Power Energy Gel – Limona (Paket 10 kos)',
      pl: 'Honey Bee Power Energy Gel – Cytryna (Zestaw 10 szt.)',
    },
    slug: 'honey-bee-power-energy-gel-limun-paket-10',
    category: 'energetski-gelovi',
    minQuantity: 5,
    shortDescription: {
      hr: 'Paket od 10 komada prirodnog energetskog gela na bazi domaćeg cvjetnog meda i prirodnog soka limuna. Brza i dugotrajna energija bez padova.',
      en: 'Pack of 10 natural energy gels based on local flower honey and natural lemon juice. Fast, sustained energy without sugar crashes.',
      de: 'Paket von 10 natürlichen Energiegels auf Basis von Blütenhonig und Zitronensaft.',
      sl: 'Paket 10 naravnih energijskih gelov na osnovi cvetličnega medu in limoninega soka.',
      pl: 'Zestaw 10 naturalnych żeli energetycznych na bazie miodu kwiatowego i soku z cytryny.',
    },
    basePrice: 1999,
    mainImage: {
      _type: 'image',
      asset: {
        _ref: '/images/products/energygelpaketlimun.png',
        _type: 'reference',
      },
      alt: 'Honey Bee Power Energy Gel Limun (Paket 10 kom)',
    },
    imageGallery: [
      {
        _type: 'image',
        asset: { _ref: '/images/products/energygelpaketlimun.png', _type: 'reference' },
        alt: 'Honey Bee Power Energy Gel Limun — paket 10 kom',
      },
      {
        _type: 'image',
        asset: { _ref: '/images/products/energygellimun-detail-1.jpg', _type: 'reference' },
        alt: 'Honey Bee Power Energy Gel Limun — detalj',
      },
    ],
    variants: [
      { _key: 'v1', flavour: 'Limun', size: 'Paket 10x40g', sku: 'HBP-GEL-LIM-10P', price: 1999, stockLevel: 80, minQuantity: 5 },
    ],
    averageRating: 4.9,
    reviewCount: 24,
  },
  {
    _id: 'hbp-gel-orange',
    name: {
      hr: 'Honey Bee Power Energy Gel – Naranča',
      en: 'Honey Bee Power Energy Gel – Orange',
      de: 'Honey Bee Power Energy Gel – Orange',
      sl: 'Honey Bee Power Energy Gel – Pomaranča',
      pl: 'Honey Bee Power Energy Gel – Pomarańcza',
    },
    slug: 'honey-bee-power-energy-gel-naranca',
    category: 'energetski-gelovi',
    minQuantity: 50,
    shortDescription: {
      hr: 'Prirodni energetski gel s medom i sočnom cvjetnom narančom. Savršen omjer fruktoze i glukoze za maksimalnu izdržljivost.',
      en: 'Natural energy gel with honey and juicy orange. Perfect fructose to glucose ratio for endurance.',
      de: 'Natürliches Energiegel mit Honig und frischer Orange.',
      sl: 'Naravni energijski gel z medom in pomarančo.',
      pl: 'Naturalny żel energetyczny z miodem i soczystą pomarańczą.',
    },
    basePrice: 249,
    mainImage: {
      _type: 'image',
      asset: {
        _ref: '/images/products/energygelnaranca.png',
        _type: 'reference',
      },
      alt: 'Honey Bee Power Energy Gel Naranča',
    },
    imageGallery: [
      {
        _type: 'image',
        asset: { _ref: '/images/products/energygelnaranca.png', _type: 'reference' },
        alt: 'Honey Bee Power Energy Gel Naranča — pakiranje',
      },
      {
        _type: 'image',
        asset: { _ref: '/images/products/energygelnaranca-detail-1.png', _type: 'reference' },
        alt: 'Honey Bee Power Energy Gel Naranča — detalj',
      },
    ],
    variants: [
      { _key: 'v1', flavour: 'Naranča', size: '40g sachet', sku: 'HBP-GEL-NAR-40', price: 249, stockLevel: 120, minQuantity: 50 },
      { _key: 'v2', flavour: 'Naranča', size: 'Paket 10x40g', sku: 'HBP-GEL-NAR-10', price: 1999, stockLevel: 50, minQuantity: 5 },
    ],
    averageRating: 5.0,
    reviewCount: 42,
  },
  {
    _id: 'hbp-gel-orange-pack10',
    name: {
      hr: 'Honey Bee Power Energy Gel – Naranča (Paket 10 kom)',
      en: 'Honey Bee Power Energy Gel – Orange (10 Pack)',
      de: 'Honey Bee Power Energy Gel – Orange (10er Pack)',
      sl: 'Honey Bee Power Energy Gel – Pomaranča (Paket 10 kos)',
      pl: 'Honey Bee Power Energy Gel – Pomarańcza (Zestaw 10 szt.)',
    },
    slug: 'honey-bee-power-energy-gel-naranca-paket-10',
    category: 'energetski-gelovi',
    minQuantity: 5,
    shortDescription: {
      hr: 'Paket od 10 komada prirodnog energetskog gela s medom i sočnom cvjetnom narančom. Savršen omjer fruktoze i glukoze za maksimalnu izdržljivost.',
      en: 'Pack of 10 natural energy gels with honey and juicy orange. Perfect fructose to glucose ratio for endurance.',
      de: 'Paket von 10 natürlichen Energiegels mit Honig und frischer Orange.',
      sl: 'Paket 10 naravnih energijskih gelov z medom in pomarančo.',
      pl: 'Zestaw 10 naturalnych żeli energetycznych z miodem i pomarańczą.',
    },
    basePrice: 1999,
    mainImage: {
      _type: 'image',
      asset: {
        _ref: '/images/products/energygelpaketorange.png',
        _type: 'reference',
      },
      alt: 'Honey Bee Power Energy Gel Naranča (Paket 10 kom)',
    },
    imageGallery: [
      {
        _type: 'image',
        asset: { _ref: '/images/products/energygelpaketorange.png', _type: 'reference' },
        alt: 'Honey Bee Power Energy Gel Naranča — paket 10 kom',
      },
      {
        _type: 'image',
        asset: { _ref: '/images/products/energygelnaranca-detail-1.png', _type: 'reference' },
        alt: 'Honey Bee Power Energy Gel Naranča — detalj',
      },
    ],
    variants: [
      { _key: 'v1', flavour: 'Naranča', size: 'Paket 10x40g', sku: 'HBP-GEL-NAR-10P', price: 1999, stockLevel: 80, minQuantity: 5 },
    ],
    averageRating: 5.0,
    reviewCount: 31,
  },
  {
    _id: 'hbp-gel-raspberry',
    name: {
      hr: 'Honey Bee Power Energy Gel – Malina',
      en: 'Honey Bee Power Energy Gel – Raspberry',
      de: 'Honey Bee Power Energy Gel – Himbeere',
      sl: 'Honey Bee Power Energy Gel – Malina',
      pl: 'Honey Bee Power Energy Gel – Malina',
    },
    slug: 'honey-bee-power-energy-gel-malina',
    category: 'energetski-gelovi',
    minQuantity: 50,
    shortDescription: {
      hr: 'Prirodni energetski gel s liofiliziranom šumskom malinom i prirodnim elektrolitima. Bez umjetnih aditiva i bez sukraloze.',
      en: 'Natural energy gel with freeze-dried wild raspberry and natural electrolytes. No artificial additives.',
      de: 'Natürliches Energiegel mit gefriergetrockneten Himbeeren.',
      sl: 'Naravni energijski gel z liofiliziranimi malinami.',
      pl: 'Naturalny żel energetyczny z liofilizowaną maliną leśną i naturalnymi elektrolitami.',
    },
    basePrice: 249,
    mainImage: {
      _type: 'image',
      asset: {
        _ref: '/images/products/energygelmalina.png',
        _type: 'reference',
      },
      alt: 'Honey Bee Power Energy Gel Malina',
    },
    imageGallery: [
      {
        _type: 'image',
        asset: { _ref: '/images/products/energygelmalina.png', _type: 'reference' },
        alt: 'Honey Bee Power Energy Gel Malina — pakiranje',
      },
      {
        _type: 'image',
        asset: { _ref: '/images/products/energygelmalina-detail-1.jpg', _type: 'reference' },
        alt: 'Honey Bee Power Energy Gel Malina — detalj',
      },
    ],
    variants: [
      { _key: 'v1', flavour: 'Malina', size: '40g sachet', sku: 'HBP-GEL-MAL-40', price: 249, stockLevel: 90, minQuantity: 50 },
      { _key: 'v2', flavour: 'Malina', size: 'Paket 10x40g', sku: 'HBP-GEL-MAL-10', price: 1999, stockLevel: 40, minQuantity: 5 },
    ],
    averageRating: 4.8,
    reviewCount: 29,
  },
  {
    _id: 'hbp-gel-raspberry-pack10',
    name: {
      hr: 'Honey Bee Power Energy Gel – Malina (Paket 10 kom)',
      en: 'Honey Bee Power Energy Gel – Raspberry (10 Pack)',
      de: 'Honey Bee Power Energy Gel – Himbeere (10er Pack)',
      sl: 'Honey Bee Power Energy Gel – Malina (Paket 10 kos)',
      pl: 'Honey Bee Power Energy Gel – Malina (Zestaw 10 szt.)',
    },
    slug: 'honey-bee-power-energy-gel-malina-paket-10',
    category: 'energetski-gelovi',
    minQuantity: 5,
    shortDescription: {
      hr: 'Paket od 10 komada prirodnog energetskog gela s liofiliziranom šumskom malinom i prirodnim elektrolitima. Bez umjetnih aditiva i bez sukraloze.',
      en: 'Pack of 10 natural energy gels with freeze-dried wild raspberry and natural electrolytes. No artificial additives.',
      de: 'Paket von 10 natürlichen Energiegels mit gefriergetrockneten Himbeeren.',
      sl: 'Paket 10 naravnih energijskih gelov z liofiliziranimi malinami.',
      pl: 'Zestaw 10 naturalnych żeli energetycznych z liofilizowaną maliną leśną.',
    },
    basePrice: 1999,
    mainImage: {
      _type: 'image',
      asset: {
        _ref: '/images/products/energygelpaketmalina.png',
        _type: 'reference',
      },
      alt: 'Honey Bee Power Energy Gel Malina (Paket 10 kom)',
    },
    imageGallery: [
      {
        _type: 'image',
        asset: { _ref: '/images/products/energygelpaketmalina.png', _type: 'reference' },
        alt: 'Honey Bee Power Energy Gel Malina — paket 10 kom',
      },
      {
        _type: 'image',
        asset: { _ref: '/images/products/energygelmalina-detail-1.jpg', _type: 'reference' },
        alt: 'Honey Bee Power Energy Gel Malina — detalj',
      },
    ],
    variants: [
      { _key: 'v1', flavour: 'Malina', size: 'Paket 10x40g', sku: 'HBP-GEL-MAL-10P', price: 1999, stockLevel: 80, minQuantity: 5 },
    ],
    averageRating: 4.8,
    reviewCount: 19,
  },
  {
    _id: 'hbp-iso-lemon',
    name: {
      hr: 'Honey Bee Power Izotonični Napitak – Limun',
      en: 'Honey Bee Power Isotonic Drink – Lemon',
      de: 'Honey Bee Power Isotonisches Getränk – Zitrone',
      sl: 'Honey Bee Power Izotonični Napitek – Limona',
      pl: 'Honey Bee Power Napój Izotoniczny – Cytryna',
    },
    slug: 'honey-bee-power-izotonicki-napitak-limun',
    category: 'izotonicki-napitci',
    minQuantity: 5,
    shortDescription: {
      hr: 'Prirodni izotonični napitak s medom u prahu, prirodnim limunom i morskom solju za brzu nadoknadu elektrolita.',
      en: 'Natural isotonic drink with honey powder, lemon, and sea salt for rapid electrolyte replenishment.',
      de: 'Isotonisches Getränk mit Honigpulver und Zitrone.',
      sl: 'Izotonični napitek z medom v prahu in limono.',
      pl: 'Naturalny napój izotoniczny z miodem w proszku, cytryną i solą morską.',
    },
    basePrice: 999,
    mainImage: {
      _type: 'image',
      asset: {
        _ref: '/images/products/isodrinklimun.png',
        _type: 'reference',
      },
      alt: 'Honey Bee Power Izotonični Napitak Limun',
    },
    imageGallery: [
      {
        _type: 'image',
        asset: { _ref: '/images/products/isodrinklimun.png', _type: 'reference' },
        alt: 'Honey Bee Power Izotonični Napitak Limun — pakiranje',
      },
    ],
    variants: [
      { _key: 'v1', flavour: 'Limun', size: '500g posuda', sku: 'HBP-ISO-LIM-500', price: 999, stockLevel: 60, minQuantity: 5 },
    ],
    averageRating: 4.9,
    reviewCount: 33,
  },
  {
    _id: 'hbp-iso-orange',
    name: {
      hr: 'Honey Bee Power Izotonični Napitak – Naranča',
      en: 'Honey Bee Power Isotonic Drink – Orange',
      de: 'Honey Bee Power Isotonic Drink – Orange',
      sl: 'Honey Bee Power Izotonični Napitek – Pomaranča',
      pl: 'Honey Bee Power Napój Izotoniczny – Pomarańcza',
    },
    slug: 'honey-bee-power-izotonicki-napitak-naranca',
    category: 'izotonicki-napitci',
    minQuantity: 5,
    shortDescription: {
      hr: 'Prirodni izotonični napitak s medom i prirodnom sočnom narančom. Sprječava grčeve i održava hidraciju u utrci.',
      en: 'Natural isotonic drink with honey and juicy orange. Prevents cramps and sustains hydration during races.',
      de: 'Isotonisches Getränk mit Honig und Orange.',
      sl: 'Izotonični napitek z medom in pomarančo.',
      pl: 'Naturalny napój izotoniczny z miodem i soczystą pomarańczą.',
    },
    basePrice: 999,
    mainImage: {
      _type: 'image',
      asset: {
        _ref: '/images/products/isodrinknaranca.png',
        _type: 'reference',
      },
      alt: 'Honey Bee Power Izotonični Napitak Naranča',
    },
    imageGallery: [
      {
        _type: 'image',
        asset: { _ref: '/images/products/isodrinknaranca.png', _type: 'reference' },
        alt: 'Honey Bee Power Izotonični Napitak Naranča — pakiranje',
      },
    ],
    variants: [
      { _key: 'v1', flavour: 'Naranča', size: '500g posuda', sku: 'HBP-ISO-NAR-500', price: 999, stockLevel: 75, minQuantity: 5 },
    ],
    averageRating: 5.0,
    reviewCount: 26,
  },
]
