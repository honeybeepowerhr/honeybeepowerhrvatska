import type { Locale } from '@/types'

export const locales: Locale[] = ['hr', 'en', 'de', 'sl', 'pl']
export const defaultLocale: Locale = 'hr'

export const localeNames: Record<Locale, string> = {
  hr: 'Hrvatski',
  en: 'English',
  de: 'Deutsch',
  sl: 'Slovenščina',
  pl: 'Polski',
}
