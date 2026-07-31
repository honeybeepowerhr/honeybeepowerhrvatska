import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://honeybeepower.hr'
  const locales = ['hr', 'en', 'de', 'sl', 'pl']

  const routes = [
    '',
    '/proizvodi',
    '/proizvodi/honey-power-energy-gel',
    '/proizvodi/honey-power-isotonic-drink',
    '/proizvodi/honey-power-whey-protein',
    '/vodici',
    '/b2b',
    '/gdje-kupiti',
    '/sportasi',
    '/aktivnosti',
    '/kontakt',
    '/o-nama',
    '/impressum',
    '/uvjeti-koristenja',
    '/politika-privatnosti',
    '/dostava-i-placanje',
    '/pravo-na-povrat',
    '/faq',
  ]

  const sitemapEntries: MetadataRoute.Sitemap = []

  for (const locale of locales) {
    for (const route of routes) {
      sitemapEntries.push({
        url: `${baseUrl}/${locale}${route}`,
        lastModified: new Date(),
        changeFrequency: route === '' || route === '/proizvodi' ? 'daily' : 'weekly',
        priority: route === '' ? 1.0 : route.startsWith('/proizvodi') ? 0.9 : 0.7,
      })
    }
  }

  return sitemapEntries
}
