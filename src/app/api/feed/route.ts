import { NextResponse } from 'next/server'

export const revalidate = 3600 // ISR revalidate every 1 hour

const PRODUCTS_FEED_DATA = [
  {
    id: 'prod-energy-gel-lemon',
    title: 'Honey Bee Power Energy Gel — Limun 40g',
    description: '100% prirodni energetski gel od domaćeg meda i liofiliziranog limuna.',
    link: 'https://planetbio.hr/hr/proizvodi/honey-bee-power-energy-gel-limun',
    imageLink: 'https://planetbio.hr/images/products/energygellimun.png',
    price: '2.49 EUR',
    availability: 'in_stock',
    brand: 'Honey Bee Power',
    gtin: '3851234567890',
  },
  {
    id: 'prod-isotonic-lemon',
    title: 'Honey Bee Power Izotonični Napitak — Limun 500g',
    description: 'Izotonični prah od meda i morske soli za optimalnu hidrataciju.',
    link: 'https://planetbio.hr/hr/proizvodi/honey-bee-power-izotonicki-napitak-limun',
    imageLink: 'https://planetbio.hr/images/products/isodrinklimun.png',
    price: '9.99 EUR',
    availability: 'in_stock',
    brand: 'Honey Bee Power',
    gtin: '3851234567891',
  },
  {
    id: 'prod-energy-gel-lemon-pack10',
    title: 'Honey Bee Power Energy Gel — Limun (Paket 10 kom)',
    description: 'Paket od 10 komada prirodnog energetskog gela na bazi meda.',
    link: 'https://planetbio.hr/hr/proizvodi/honey-bee-power-energy-gel-limun-paket-10',
    imageLink: 'https://planetbio.hr/images/products/energygelpaketlimun.png',
    price: '19.99 EUR',
    availability: 'in_stock',
    brand: 'Honey Bee Power',
    gtin: '3851234567892',
  },
]

export async function GET(): Promise<NextResponse> {
  const xmlItems = PRODUCTS_FEED_DATA.map(
    (item) => `
    <item>
      <g:id>${item.id}</g:id>
      <g:title><![CDATA[${item.title}]]></g:title>
      <g:description><![CDATA[${item.description}]]></g:description>
      <g:link>${item.link}</g:link>
      <g:image_link>${item.imageLink}</g:image_link>
      <g:price>${item.price}</g:price>
      <g:availability>${item.availability}</g:availability>
      <g:brand>${item.brand}</g:brand>
      <g:gtin>${item.gtin}</g:gtin>
    </item>`,
  ).join('\n')

  const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>Honey Bee Power Google Merchant Feed</title>
    <link>https://honeybeepower.hr</link>
    <description>100% Prirodna Sportska Prehrana na Bazi Meda</description>
    ${xmlItems}
  </channel>
</rss>`

  return new NextResponse(xmlContent, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}
