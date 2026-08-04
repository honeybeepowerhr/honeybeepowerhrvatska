'use client'

import Image from 'next/image'
import { useTranslations } from 'next-intl'
import type { CartItem as CartItemType } from '@/types'

interface CartItemProps {
  item: CartItemType
  onRemove: () => void
  onUpdateQuantity: (qty: number) => void
}

export function CartItem({ item, onRemove, onUpdateQuantity }: CartItemProps) {
  const t = useTranslations('cart')

  return (
    <li className="flex gap-3 py-4 border-b border-border last:border-0 items-center">
      {/* Product image */}
      <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl bg-amber-50/80 border border-amber-200">
        {item.imageSrc ? (
          <Image
            src={item.imageSrc}
            alt={item.name}
            fill
            className="object-contain p-1"
            sizes="64px"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted-foreground text-xs">
            {t('noImage')}
          </div>
        )}
      </div>

      {/* Product info */}
      <div className="flex flex-1 flex-col gap-1 min-w-0">
        <p className="text-sm font-bold text-gray-900 leading-tight truncate">{item.name}</p>
        {item.variantLabel && (
          <p className="text-xs text-amber-700 font-semibold">{item.variantLabel}</p>
        )}

        {/* Quantity controls + remove */}
        <div className="flex items-center justify-between mt-1">
          <div className="flex items-center gap-1.5 bg-gray-100 rounded-lg p-0.5">
            <button
              type="button"
              onClick={() => onUpdateQuantity(item.quantity - 1)}
              className="flex h-6 w-6 items-center justify-center rounded-md bg-white border border-gray-200 text-sm font-bold hover:bg-amber-100 transition-colors disabled:opacity-40"
              disabled={item.quantity <= 1}
              aria-label={`Smanji količinu za ${item.name}`}
            >
              −
            </button>
            <span className="min-w-[1.5rem] text-center text-sm font-extrabold text-gray-900">
              {item.quantity}
            </span>
            <button
              type="button"
              onClick={() => onUpdateQuantity(item.quantity + 1)}
              className="flex h-6 w-6 items-center justify-center rounded-md bg-white border border-gray-200 text-sm font-bold hover:bg-amber-100 transition-colors"
              aria-label={`Povećaj količinu za ${item.name}`}
            >
              +
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onRemove}
              className="text-gray-400 hover:text-red-600 transition-colors p-1"
              aria-label={`${t('remove')} ${item.name}`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M3 6h18" />
                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </li>
  )
}
