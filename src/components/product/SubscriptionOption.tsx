'use client'

import { useState, useId } from 'react'
import { cn } from '@/lib/utils'
import { Tag } from 'lucide-react'

export type PurchaseType = 'one_time' | 'subscription'
export type SubscriptionInterval = '4w' | '8w'

export interface SubscriptionOptionProps {
  basePrice: number
  onChange: (type: PurchaseType, interval?: SubscriptionInterval) => void
}

const DISCOUNT_PERCENT = 10

const INTERVAL_LABELS: Record<SubscriptionInterval, string> = {
  '4w': 'Svaka 4 tjedna',
  '8w': 'Svakih 8 tjedana',
}

/** Formatira cijenu iz centi u EUR string, npr. 1990 → "19,90 €" */
function formatPrice(cents: number): string {
  return new Intl.NumberFormat('hr-HR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
  }).format(cents / 100)
}

/**
 * Komponenta za odabir između jednokratne kupnje i pretplate s popustom.
 * Koristi fieldset/legend za WCAG skupno označavanje radio opcija.
 */
export default function SubscriptionOption({
  basePrice,
  onChange,
}: SubscriptionOptionProps) {
  const [selectedType, setSelectedType] = useState<PurchaseType>('one_time')
  const [selectedInterval, setSelectedInterval] = useState<SubscriptionInterval>('4w')

  const legendId = useId()
  const intervalSelectId = useId()

  const discountedPrice = Math.round(basePrice * (1 - DISCOUNT_PERCENT / 100))

  function handleTypeChange(type: PurchaseType) {
    setSelectedType(type)
    onChange(type, type === 'subscription' ? selectedInterval : undefined)
  }

  function handleIntervalChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const interval = e.target.value as SubscriptionInterval
    setSelectedInterval(interval)
    onChange('subscription', interval)
  }

  return (
    <fieldset
      className="rounded-xl border border-gray-200 overflow-hidden"
      aria-labelledby={legendId}
    >
      <legend
        id={legendId}
        className="sr-only"
      >
        Odaberite način kupnje
      </legend>

      {/* ── Jednokratna kupnja ───────────────────────────────── */}
      <label
        className={cn(
          'flex items-center gap-3 px-4 py-3.5 cursor-pointer transition-colors',
          selectedType === 'one_time'
            ? 'bg-amber-50 border-b border-amber-200'
            : 'bg-white border-b border-gray-100 hover:bg-gray-50',
        )}
      >
        <input
          type="radio"
          name="purchase-type"
          value="one_time"
          checked={selectedType === 'one_time'}
          onChange={() => handleTypeChange('one_time')}
          className="
            w-4 h-4 shrink-0
            accent-amber-500
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500
          "
          aria-label="Jednokratna kupnja"
        />
        <div className="flex-1 min-w-0">
          <span className="font-medium text-sm text-charcoal">
            Jednokratna kupnja
          </span>
        </div>
        <span
          className={cn(
            'text-sm font-semibold shrink-0',
            selectedType === 'one_time' ? 'text-charcoal' : 'text-gray-500',
          )}
          aria-label={`Cijena: ${formatPrice(basePrice)}`}
        >
          {formatPrice(basePrice)}
        </span>
      </label>

      {/* ── Pretplati se i uštedi ────────────────────────────── */}
      <div
        className={cn(
          selectedType === 'subscription'
            ? 'bg-amber-50'
            : 'bg-white hover:bg-gray-50',
        )}
      >
        <label
          className="flex items-center gap-3 px-4 py-3.5 cursor-pointer"
        >
          <input
            type="radio"
            name="purchase-type"
            value="subscription"
            checked={selectedType === 'subscription'}
            onChange={() => handleTypeChange('subscription')}
            className="
              w-4 h-4 shrink-0
              accent-amber-500
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500
            "
            aria-label="Pretplati se i uštedi"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-medium text-sm text-charcoal">
                Pretplati se i uštedi
              </span>
              {/* Discount badge */}
              <span
                className="inline-flex items-center gap-1 bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded-full"
                aria-label={`Uštedite ${DISCOUNT_PERCENT}% s pretplatom`}
              >
                <Tag className="w-3 h-3" aria-hidden="true" />
                -{DISCOUNT_PERCENT}%
              </span>
            </div>
          </div>
          <div
            className="flex flex-col items-end shrink-0"
            aria-label={`Cijena s pretplatom: ${formatPrice(discountedPrice)}`}
          >
            <span
              className={cn(
                'text-sm font-semibold',
                selectedType === 'subscription' ? 'text-green-700' : 'text-gray-500',
              )}
            >
              {formatPrice(discountedPrice)}
            </span>
            <span className="text-xs text-gray-400 line-through">
              {formatPrice(basePrice)}
            </span>
          </div>
        </label>

        {/* Interval dropdown — vidljiv samo kad je pretplata odabrana */}
        {selectedType === 'subscription' && (
          <div className="px-4 pb-4">
            <label
              htmlFor={intervalSelectId}
              className="block text-xs font-medium text-gray-600 mb-1.5"
            >
              Učestalost dostave
            </label>
            <select
              id={intervalSelectId}
              value={selectedInterval}
              onChange={handleIntervalChange}
              aria-label="Odaberi učestalost dostave pretplate"
              className={cn(
                'w-full h-9 px-3 rounded-lg border border-amber-300 bg-white text-sm text-charcoal',
                'appearance-none cursor-pointer',
                'focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent',
                'transition-colors',
              )}
            >
              {(Object.entries(INTERVAL_LABELS) as [SubscriptionInterval, string][]).map(
                ([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ),
              )}
            </select>
          </div>
        )}
      </div>
    </fieldset>
  )
}
