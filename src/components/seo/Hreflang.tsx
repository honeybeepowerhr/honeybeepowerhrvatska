import React from 'react'

export interface HreflangProps {
  pathname: string // e.g. "/proizvodi/honey-power-energy-gel"
  currentLocale?: string
}

const DOMAIN = 'https://honeybeepower.hr'
const LOCALES = ['hr', 'en', 'de', 'sl', 'pl'] as const

export function Hreflang({ pathname }: HreflangProps) {
  const cleanPath = pathname.startsWith('/') ? pathname : `/${pathname}`
  const canonicalUrl = `${DOMAIN}/hr${cleanPath}`

  return (
    <>
      {/* Canonical Link */}
      <link rel="canonical" href={canonicalUrl} />

      {/* 6 Hreflang Tags: hr, en, de, sl, pl, x-default */}
      {LOCALES.map((locale) => (
        <link
          key={locale}
          rel="alternate"
          hrefLang={locale}
          href={`${DOMAIN}/${locale}${cleanPath}`}
        />
      ))}
      <link
        rel="alternate"
        hrefLang="x-default"
        href={canonicalUrl}
      />
    </>
  )
}
