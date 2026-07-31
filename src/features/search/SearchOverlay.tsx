'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { Search, X, ArrowRight } from 'lucide-react'
import { useTranslations, useLocale } from 'next-intl'
import { Input } from '@/components/ui/input'
import { REAL_PRODUCTS } from '@/lib/products-data'
import type { Locale } from '@/types'

interface SearchItem {
  id: string
  title: string
  category: string
  url: string
}

interface SearchOverlayProps {
  isOpen: boolean
  onClose: () => void
}

export function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const t = useTranslations('search')
  const tNav = useTranslations('nav')
  const locale = (useLocale() || 'hr') as Locale

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50)
    } else {
      setQuery('')
    }
  }, [isOpen])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const searchItems: SearchItem[] = [
    ...REAL_PRODUCTS.map((p) => ({
      id: p._id,
      title: p.name[locale] || p.name.hr,
      category: t('product'),
      url: `/${locale}/proizvodi/${p.slug}`,
    })),
    {
      id: 'guides',
      title: tNav('guides'),
      category: t('guide'),
      url: `/${locale}/vodici`,
    },
    {
      id: 'b2b',
      title: tNav('b2b'),
      category: t('page'),
      url: `/${locale}/b2b`,
    },
    {
      id: 'whereToBuy',
      title: tNav('whereToBuy'),
      category: t('page'),
      url: `/${locale}/gdje-kupiti`,
    },
    {
      id: 'athletes',
      title: tNav('athletes'),
      category: t('page'),
      url: `/${locale}/sportasi`,
    },
  ]

  const results = query.trim()
    ? searchItems.filter((item) =>
        item.title.toLowerCase().includes(query.toLowerCase().trim()),
      )
    : []

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={t('ariaLabel')}
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-start justify-center pt-16 px-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-white rounded-3xl p-6 border border-gray-200 shadow-2xl space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <div className="relative flex-grow flex items-center">
            <Search className="w-5 h-5 text-gray-400 absolute left-3" />
            <Input
              ref={inputRef}
              type="search"
              placeholder={t('placeholder')}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10 h-12 text-base rounded-xl border-none bg-gray-50 focus-visible:ring-2 focus-visible:ring-amber-500"
            />
          </div>

          <button
            type="button"
            aria-label={t('closeLabel')}
            onClick={onClose}
            className="ml-3 text-gray-400 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto space-y-2">
          {query.trim() === '' ? (
            <p className="text-xs text-gray-400 text-center py-6">
              {t('hint')}
            </p>
          ) : results.length === 0 ? (
            <p className="text-sm font-semibold text-gray-500 text-center py-6">
              {t('noResults', { query })}
            </p>
          ) : (
            results.map((res) => (
              <Link
                key={res.id}
                href={res.url}
                onClick={onClose}
                className="flex items-center justify-between p-4 rounded-2xl hover:bg-amber-50/60 border border-transparent hover:border-amber-200 transition-all group"
              >
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600">
                    {res.category}
                  </span>
                  <div className="font-bold text-gray-900 group-hover:text-amber-600 transition-colors">
                    {res.title}
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-amber-600 transition-transform group-hover:translate-x-1" />
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
