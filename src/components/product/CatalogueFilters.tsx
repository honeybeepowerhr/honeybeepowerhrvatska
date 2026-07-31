'use client'

import { useMemo, useState, useEffect } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import type { Locale, ProductSummary } from '@/types'
import { cn, translateFlavour } from '@/lib/utils'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface CatalogueFiltersProps {
  products: ProductSummary[]
  onFilteredChange: (filtered: ProductSummary[]) => void
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const CATEGORIES = [
  { value: 'energetski-gelovi', key: 'energyGels' },
  { value: 'izotonicni-napitci', key: 'isotonicDrinks' },
  { value: 'whey-proteini', key: 'wheyProteins' },
] as const

type CategoryValue = (typeof CATEGORIES)[number]['value']

const ACTIVITY_CATEGORY_MAP: Record<string, CategoryValue[]> = {
  running: ['energetski-gelovi', 'izotonicni-napitci'],
  cycling: ['energetski-gelovi', 'izotonicni-napitci'],
  fitness: ['whey-proteini'],
}

const ACTIVITIES = [
  { key: 'running', labelKey: 'running' },
  { key: 'cycling', labelKey: 'cycling' },
  { key: 'fitness', labelKey: 'fitness' },
] as const

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function CatalogueFilters({ products, onFilteredChange }: CatalogueFiltersProps) {
  const t = useTranslations('filters')
  const locale = useLocale() as Locale
  const [selectedCategory, setSelectedCategory] = useState<CategoryValue | null>(null)
  const [selectedFlavours, setSelectedFlavours] = useState<string[]>([])
  const [selectedActivities, setSelectedActivities] = useState<string[]>([])

  // Dinamički popis okusa iz svih varijanti
  const allFlavours = useMemo<string[]>(() => {
    const set = new Set<string>()
    for (const product of products) {
      for (const variant of product.variants) {
        if (variant.flavour) set.add(variant.flavour)
      }
    }
    return Array.from(set).sort()
  }, [products])

  // Filtered logic
  const filtered = useMemo<ProductSummary[]>(() => {
    const activityCategories = selectedActivities.flatMap(
      (activity) => ACTIVITY_CATEGORY_MAP[activity] ?? [],
    )
    const hasActivityFilter = activityCategories.length > 0

    return products.filter((product) => {
      // --- Category filter ---
      if (selectedCategory !== null && product.category !== selectedCategory) return false

      // --- Activity filter ---
      if (hasActivityFilter) {
        const matchesActivity = activityCategories.includes(product.category as CategoryValue)
        if (!matchesActivity) return false
      }

      // --- Flavour filter ---
      if (selectedFlavours.length > 0) {
        const hasFlavour = product.variants.some((v) => selectedFlavours.includes(v.flavour))
        if (!hasFlavour) return false
      }

      return true
    })
  }, [products, selectedCategory, selectedFlavours, selectedActivities])

  // Notify parent on every filter change
  useEffect(() => {
    onFilteredChange(filtered)
  }, [filtered, onFilteredChange])

  // ---------------------------------------------------------------------------
  // Handlers
  // ---------------------------------------------------------------------------

  function handleCategoryChange(value: CategoryValue | null) {
    setSelectedCategory((prev) => (prev === value ? null : value))
  }

  function handleFlavourToggle(flavour: string) {
    setSelectedFlavours((prev) =>
      prev.includes(flavour) ? prev.filter((f) => f !== flavour) : [...prev, flavour],
    )
  }

  function handleActivityToggle(activityKey: string) {
    setSelectedActivities((prev) =>
      prev.includes(activityKey) ? prev.filter((a) => a !== activityKey) : [...prev, activityKey],
    )
  }

  function handleReset() {
    setSelectedCategory(null)
    setSelectedFlavours([])
    setSelectedActivities([])
  }

  const hasActiveFilters =
    selectedCategory !== null || selectedFlavours.length > 0 || selectedActivities.length > 0

  return (
    <aside
      aria-label={t('title')}
      className="w-full space-y-6 rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-gray-700">{t('title')}</h2>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={handleReset}
            className="text-xs font-medium text-amber-600 hover:text-amber-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded"
          >
            {t('clear')}
          </button>
        )}
      </div>

      {/* ---- Kategorija ---- */}
      <fieldset>
        <legend className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
          {t('category')}
        </legend>
        <div className="space-y-2">
          {/* "Sve" option */}
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="radio"
              name="category"
              checked={selectedCategory === null}
              onChange={() => handleCategoryChange(null)}
              className="h-4 w-4 accent-amber-500 cursor-pointer"
            />
            <span className={cn('text-sm', selectedCategory === null ? 'font-semibold text-gray-900' : 'text-gray-700')}>
              {t('all')}
            </span>
          </label>

          {CATEGORIES.map(({ value, key }) => (
            <label key={value} className="flex cursor-pointer items-center gap-2">
              <input
                type="radio"
                name="category"
                checked={selectedCategory === value}
                onChange={() => handleCategoryChange(value)}
                className="h-4 w-4 accent-amber-500 cursor-pointer"
              />
              <span
                className={cn(
                  'text-sm',
                  selectedCategory === value ? 'font-semibold text-gray-900' : 'text-gray-700',
                )}
              >
                {t(key)}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      {/* Divider */}
      <hr className="border-gray-100" />

      {/* ---- Okus ---- */}
      {allFlavours.length > 0 && (
        <>
          <fieldset>
            <legend className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
              {t('flavour')}
            </legend>
            <div className="space-y-2">
              {allFlavours.map((flavour) => (
                <label key={flavour} className="flex cursor-pointer items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedFlavours.includes(flavour)}
                    onChange={() => handleFlavourToggle(flavour)}
                    className="h-4 w-4 rounded accent-amber-500 cursor-pointer"
                  />
                  <span
                    className={cn(
                      'text-sm',
                      selectedFlavours.includes(flavour)
                        ? 'font-semibold text-gray-900'
                        : 'text-gray-700',
                    )}
                  >
                    {translateFlavour(flavour, locale)}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          {/* Divider */}
          <hr className="border-gray-100" />
        </>
      )}

      {/* ---- Ciljna aktivnost ---- */}
      <fieldset>
        <legend className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
          {t('activity')}
        </legend>
        <div className="space-y-2">
          {ACTIVITIES.map(({ key, labelKey }) => (
            <label key={key} className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                checked={selectedActivities.includes(key)}
                onChange={() => handleActivityToggle(key)}
                className="h-4 w-4 rounded accent-amber-500 cursor-pointer"
              />
              <span
                className={cn(
                  'text-sm',
                  selectedActivities.includes(key)
                    ? 'font-semibold text-gray-900'
                    : 'text-gray-700',
                )}
              >
                {t(labelKey)}
              </span>
            </label>
          ))}
        </div>
      </fieldset>
    </aside>
  )
}
