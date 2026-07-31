'use client'

import { cn, translateFlavour } from '@/lib/utils'
import { useLocale } from 'next-intl'
import type { Locale, Variant } from '@/types'

// ─── Flavour → swatch colour map ──────────────────────────────────────────────

const FLAVOUR_COLOURS: Record<string, string> = {
  // Exact lowercase keys → Tailwind bg colour
  limun:    'bg-yellow-300 border-yellow-400',
  lemon:    'bg-yellow-300 border-yellow-400',
  naranča:  'bg-orange-400 border-orange-500',
  naranca:  'bg-orange-400 border-orange-500',
  orange:   'bg-orange-400 border-orange-500',
  malina:   'bg-red-500 border-red-600',
  jagoda:   'bg-red-400 border-red-500',
  strawberry: 'bg-red-400 border-red-500',
  raspberry:  'bg-red-500 border-red-600',
  vanilija: 'bg-amber-100 border-amber-300',
  vanilla:  'bg-amber-100 border-amber-300',
  čokolada: 'bg-amber-900 border-amber-950',
  cokolada: 'bg-amber-900 border-amber-950',
  chocolate:'bg-amber-900 border-amber-950',
}

function getFlavourColour(flavour: string): string {
  const key = flavour.toLowerCase().trim()
  // Try exact match first, then partial match
  if (FLAVOUR_COLOURS[key]) return FLAVOUR_COLOURS[key]
  for (const [k, v] of Object.entries(FLAVOUR_COLOURS)) {
    if (key.includes(k) || k.includes(key)) return v
  }
  return 'bg-gray-300 border-gray-400'
}

// ─── Derived helpers ──────────────────────────────────────────────────────────

/** Unique flavours preserving first-seen order */
function uniqueFlavours(variants: Variant[]): string[] {
  const seen = new Set<string>()
  const result: string[] = []
  for (const v of variants) {
    if (!seen.has(v.flavour)) {
      seen.add(v.flavour)
      result.push(v.flavour)
    }
  }
  return result
}

/** Unique sizes preserving first-seen order */
function uniqueSizes(variants: Variant[]): string[] {
  const seen = new Set<string>()
  const result: string[] = []
  for (const v of variants) {
    if (!seen.has(v.size)) {
      seen.add(v.size)
      result.push(v.size)
    }
  }
  return result
}

// ─── Props ────────────────────────────────────────────────────────────────────

export interface VariantSwitcherProps {
  variants: Variant[]
  selectedVariantId: string
  onSelect: (variantId: string) => void
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function VariantSwitcher({
  variants,
  selectedVariantId,
  onSelect,
}: VariantSwitcherProps) {
  const locale = useLocale() as Locale
  const selected = variants.find((v) => v._key === selectedVariantId)
  const flavours = uniqueFlavours(variants)
  const sizes = uniqueSizes(variants)

  // ── Flavour swatches ──────────────────────────────────────────────────────

  return (
    <div className="space-y-5">
      {/* Flavour row — only shown when >1 distinct flavour exists */}
      {flavours.length > 1 && (
        <fieldset>
          <legend className="text-sm font-semibold text-charcoal mb-2">
            Okus
            {selected && (
              <span className="ml-2 font-normal text-gray-500">
                — {translateFlavour(selected.flavour, locale)}
              </span>
            )}
          </legend>

          <div className="flex flex-wrap gap-2" role="group" aria-label="Odaberite okus">
            {flavours.map((flavour) => {
              const candidates = variants.filter((v) => v.flavour === flavour)
              const match =
                candidates.find((v) => v.size === selected?.size) ?? candidates[0]
              const isSelected = match._key === selectedVariantId
              const isOutOfStock = match.stockLevel === 0
              const colourClass = getFlavourColour(flavour)
              const localizedFlavour = translateFlavour(flavour, locale)

              return (
                <button
                  key={flavour}
                  type="button"
                  aria-pressed={isSelected}
                  aria-label={`${localizedFlavour}${isOutOfStock ? ' — nije na zalihi' : ''}`}
                  disabled={isOutOfStock}
                  onClick={() => onSelect(match._key)}
                  title={localizedFlavour}
                  className={cn(
                    'relative w-8 h-8 rounded-full border-2 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2',
                    colourClass,
                    isSelected && 'ring-2 ring-amber-500 ring-offset-2',
                    isOutOfStock
                      ? 'opacity-40 cursor-not-allowed'
                      : 'cursor-pointer hover:scale-110',
                  )}
                >
                  {isOutOfStock && (
                    <span
                      aria-hidden="true"
                      className="absolute inset-0 flex items-center justify-center"
                    >
                      {/* Diagonal slash overlay */}
                      <svg viewBox="0 0 32 32" className="w-full h-full" fill="none">
                        <line x1="6" y1="6" x2="26" y2="26" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                      </svg>
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </fieldset>
      )}

      {/* Size buttons — shown when >1 distinct size */}
      {sizes.length > 1 && (
        <fieldset>
          <legend className="text-sm font-semibold text-charcoal mb-2">
            Pakiranje
            {selected && (
              <span className="ml-2 font-normal text-gray-500">
                — {selected.size}
              </span>
            )}
          </legend>

          <div className="flex flex-wrap gap-2" role="group" aria-label="Odaberite veličinu pakovanja">
            {sizes.map((size) => {
              // Match the variant for this size with current flavour (if possible)
              const candidates = variants.filter((v) => v.size === size)
              const match =
                candidates.find((v) => v.flavour === selected?.flavour) ?? candidates[0]
              const isSelected = match._key === selectedVariantId
              const isOutOfStock = match.stockLevel === 0

              return (
                <button
                  key={size}
                  type="button"
                  aria-pressed={isSelected}
                  aria-label={`${selected?.flavour ?? ''} ${size}${isOutOfStock ? ', nije na zalihi' : ''}`}
                  disabled={isOutOfStock}
                  onClick={() => onSelect(match._key)}
                  className={cn(
                    'px-4 py-1.5 rounded-lg border text-sm font-medium transition-all',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2',
                    isSelected
                      ? 'border-amber-500 bg-amber-50 text-amber-700 ring-1 ring-amber-500'
                      : 'border-gray-300 bg-white text-charcoal hover:border-amber-400 hover:bg-amber-50',
                    isOutOfStock && 'opacity-40 cursor-not-allowed line-through',
                  )}
                >
                  {size}
                </button>
              )
            })}
          </div>
        </fieldset>
      )}

      {/* Single size / single flavour — just show the label, no switcher needed */}
      {flavours.length === 1 && sizes.length === 1 && (
        <p className="text-sm text-gray-500">
          {flavours[0]} · {sizes[0]}
        </p>
      )}
    </div>
  )
}
