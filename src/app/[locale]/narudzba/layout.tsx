import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Upit | Honey Bee Power',
  description: 'Pošaljite upit za ponudu — javit ćemo vam se s cijenom i načinom plaćanja.',
  robots: {
    index: false,
    follow: false,
    noarchive: true,
  },
}

export default function InquiryLayout({ children }: { children: React.ReactNode }) {
  return children
}
