'use client'

import { useLocale } from 'next-intl'
import { useRouter, usePathname } from 'next/navigation'
import { locales, localeNames } from '@/features/i18n/config'
import type { Locale } from '@/types'
import { cn } from '@/lib/utils'

interface LanguageSwitcherProps {
  className?: string
}

export default function LanguageSwitcher({ className }: LanguageSwitcherProps) {
  const locale = useLocale() as Locale
  const router = useRouter()
  const pathname = usePathname()

  function switchLocale(nextLocale: Locale) {
    if (nextLocale === locale) return

    // Set cookie for next-intl locale persistence
    document.cookie = `NEXT_LOCALE=${nextLocale}; path=/; max-age=31536000; SameSite=Lax`

    // Strip existing locale prefix from path, then re-build with new locale.
    // next-intl uses `localePrefix: 'as-needed'`: HR has no prefix, others do.
    const strippedPath = (() => {
      for (const l of locales) {
        if (l === 'hr') continue // HR has no prefix
        if (pathname.startsWith(`/${l}/`)) return pathname.slice(l.length + 1)
        if (pathname === `/${l}`) return '/'
      }
      return pathname
    })()

    const newPath =
      nextLocale === 'hr'
        ? strippedPath
        : `/${nextLocale}${strippedPath === '/' ? '' : strippedPath}`

    router.push(newPath)
  }

  return (
    <div
      role="navigation"
      aria-label="Odabir jezika"
      className={cn('flex items-center gap-1', className)}
    >
      {locales.map((l) => (
        <button
          key={l}
          onClick={() => switchLocale(l)}
          aria-label={`Promijeni jezik na ${localeNames[l]}`}
          aria-current={l === locale ? 'true' : undefined}
          className={cn(
            'px-2 py-1 rounded text-xs font-semibold uppercase tracking-wide transition-colors',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-1',
            l === locale
              ? 'bg-amber-500 text-white'
              : 'text-charcoal-light hover:bg-gray-100'
          )}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  )
}
