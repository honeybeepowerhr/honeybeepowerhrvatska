'use client'

import { useId } from 'react'
import { Minus, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'

// ─── Props ────────────────────────────────────────────────────────────────────

export interface QuantityInputProps {
  value: number
  min?: number
  max?: number
  onChange: (qty: number) => void
  /** Optional class applied to the outer wrapper */
  className?: string
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function QuantityInput({
  value,
  min = 1,
  max = 99,
  onChange,
  className,
}: QuantityInputProps) {
  const labelId = useId()

  function clamp(n: number): number {
    return Math.min(max, Math.max(min, n))
  }

  function decrement() {
    onChange(clamp(value - 1))
  }

  function increment() {
    onChange(clamp(value + 1))
  }

  function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
    const parsed = parseInt(e.target.value, 10)
    if (!isNaN(parsed)) {
      onChange(clamp(parsed))
    }
  }

  function handleBlur(e: React.FocusEvent<HTMLInputElement>) {
    // Ensure the field never shows an invalid / empty value after blur
    const parsed = parseInt(e.target.value, 10)
    if (isNaN(parsed)) {
      onChange(min)
    } else {
      onChange(clamp(parsed))
    }
  }

  const atMin = value <= min
  const atMax = value >= max

  return (
    <div
      className={cn('inline-flex items-center gap-0 rounded-xl border border-gray-300 overflow-hidden', className)}
      role="group"
      aria-labelledby={labelId}
    >
      <span id={labelId} className="sr-only">
        Količina
      </span>

      {/* Decrement */}
      <button
        type="button"
        aria-label="Smanji količinu"
        disabled={atMin}
        onClick={decrement}
        className={cn(
          'flex items-center justify-center w-10 h-10 text-charcoal transition-colors',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-amber-500',
          atMin
            ? 'opacity-40 cursor-not-allowed bg-gray-50'
            : 'hover:bg-amber-50 hover:text-amber-600 active:bg-amber-100',
        )}
      >
        <Minus className="w-4 h-4" aria-hidden="true" />
      </button>

      {/* Input */}
      <input
        type="number"
        inputMode="numeric"
        value={value}
        min={min}
        max={max}
        onChange={handleInput}
        onBlur={handleBlur}
        aria-label="Količina"
        aria-valuenow={value}
        aria-valuemin={min}
        aria-valuemax={max}
        className={cn(
          'w-12 h-10 text-center text-sm font-semibold text-charcoal bg-white',
          'border-x border-gray-300',
          // Remove browser spinners
          '[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-amber-500',
        )}
      />

      {/* Increment */}
      <button
        type="button"
        aria-label="Povećaj količinu"
        disabled={atMax}
        onClick={increment}
        className={cn(
          'flex items-center justify-center w-10 h-10 text-charcoal transition-colors',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-amber-500',
          atMax
            ? 'opacity-40 cursor-not-allowed bg-gray-50'
            : 'hover:bg-amber-50 hover:text-amber-600 active:bg-amber-100',
        )}
      >
        <Plus className="w-4 h-4" aria-hidden="true" />
      </button>
    </div>
  )
}
