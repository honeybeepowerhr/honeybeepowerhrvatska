'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { cn, translateFlavour } from '@/lib/utils'
import type { Locale, ProductSummary, Variant } from '@/types'

// ─── Props ────────────────────────────────────────────────────────────────────

interface VariantSelectModalProps {
  product: ProductSummary
  locale: Locale
  open: boolean
  onClose: () => void
  onSelect: (variant: Variant) => void
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function VariantSelectModal({
  product,
  locale,
  open,
  onClose,
  onSelect,
}: VariantSelectModalProps) {
  const productName = product.name[locale] ?? product.name.hr

  return (
    <Dialog open={open} onOpenChange={(isOpen) => { if (!isOpen) onClose() }}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="font-heading text-xl text-charcoal">
            Odaberi varijantu
          </DialogTitle>
          <DialogDescription>
            {productName} — odaberi željenu veličinu i okus.
          </DialogDescription>
        </DialogHeader>

        <ul role="list" className="mt-2 space-y-2">
          {product.variants.map((variant) => {
            const outOfStock = variant.stockLevel <= 0

            const label = [translateFlavour(variant.flavour, locale), variant.size]
              .filter(Boolean)
              .join(' / ')

            return (
              <li key={variant._key}>
                <button
                  type="button"
                  disabled={outOfStock}
                  onClick={() => {
                    onSelect(variant)
                    onClose()
                  }}
                  className={cn(
                    'w-full flex items-center justify-between gap-4 px-4 py-3 rounded-xl border text-left',
                    'transition-colors duration-150',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-1',
                    outOfStock
                      ? 'opacity-50 cursor-not-allowed border-gray-200 bg-gray-50'
                      : 'border-gray-200 bg-white hover:border-amber-400 hover:bg-amber-50 cursor-pointer',
                  )}
                  aria-label={`${label}${outOfStock ? ' – rasprodano' : ''}`}
                >
                  <span className="flex flex-col gap-0.5 min-w-0">
                    <span className="text-sm font-semibold text-charcoal truncate">
                      {label}
                    </span>
                    {outOfStock && (
                      <span className="text-xs text-red-500 font-medium">Rasprodano</span>
                    )}
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      </DialogContent>
    </Dialog>
  )
}
