'use client'

import { cn } from '@/lib/utils'
import { ShoppingCart, Check } from 'lucide-react'

export interface StickyAddToCartButtonProps {
  label?: string
  onClick: () => void
  disabled?: boolean
  isAdded?: boolean
}

/**
 * Sticky "Dodaj u košaricu" gumb fiksiran na dnu ekrana na mobilnom uređaju.
 * Na md+ breakpointu je sakriven (md:hidden) jer se na desktopu koristi
 * standardni gumb unutar product page layouta.
 */
export default function StickyAddToCartButton({
  label = 'Dodaj u košaricu',
  onClick,
  disabled = false,
  isAdded = false,
}: StickyAddToCartButtonProps) {
  const effectiveLabel = isAdded ? 'Dodano u košaricu' : label

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
      role="region"
      aria-label="Brzi dodaj u košaricu"
    >
      {/* Blur-fade na vrhu radi vizualnog odvajanja od sadržaja */}
      <div aria-hidden="true" className="h-4 bg-gradient-to-t from-white/90 to-transparent pointer-events-none" />

      <div className="bg-white/95 backdrop-blur-sm border-t border-gray-200 px-4 py-3 pb-safe">
        <button
          type="button"
          onClick={onClick}
          disabled={disabled || isAdded}
          aria-label={effectiveLabel}
          aria-disabled={disabled || isAdded}
          className={cn(
            'w-full flex items-center justify-center gap-2',
            'h-12 rounded-xl font-heading font-bold text-base uppercase tracking-wide',
            'transition-all duration-200',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2',
            isAdded
              ? 'bg-green-600 text-white cursor-default'
              : disabled
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-amber-honey text-white hover:bg-amber-honey-dark active:scale-[0.98]',
          )}
        >
          {isAdded ? (
            <Check className="w-5 h-5 shrink-0" aria-hidden="true" />
          ) : (
            <ShoppingCart className="w-5 h-5 shrink-0" aria-hidden="true" />
          )}
          <span>{effectiveLabel}</span>
        </button>
      </div>
    </div>
  )
}
