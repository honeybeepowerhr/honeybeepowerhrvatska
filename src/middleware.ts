import createMiddleware from 'next-intl/middleware'

export default createMiddleware({
  locales: ['hr', 'en', 'de', 'sl', 'pl'],
  defaultLocale: 'hr',
  localePrefix: 'as-needed', // HR nema prefiks, /en/, /de/, /sl/, /pl/ imaju
  localeDetection: false,
})

export const config = {
  matcher: ['/((?!api|_next|_vercel|studio|.*\\..*).*)']
}
