'use client'

import Link from 'next/link'
import { useTranslations, useLocale } from 'next-intl'
import type { Locale } from '@/types'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { useCartStore } from '@/features/cart'
import { CartItem } from './CartItem'

const FREE_SHIPPING_THRESHOLD = 5000 // 50 € in cents

export function CartPanel() {
  const t = useTranslations('cart')
  const locale = useLocale() as Locale
  const prefix = locale === 'hr' ? '' : `/${locale}`

  const { items, isOpen, closeCart, removeItem, updateQuantity, subtotalAmount, packagingSurcharge, totalAmount, shopMode } =
    useCartStore()

  const tShop = useTranslations('shopMode')

  const subtotal = subtotalAmount()
  const surcharge = packagingSurcharge()
  const total = totalAmount()

  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal)
  const progressPercent =
    remaining === 0
      ? 100
      : Math.round(((FREE_SHIPPING_THRESHOLD - remaining) / FREE_SHIPPING_THRESHOLD) * 100)

  const formattedSubtotal = (subtotal / 100).toFixed(2)
  const formattedSurcharge = (surcharge / 100).toFixed(2)
  const formattedRemaining = (remaining / 100).toFixed(2)
  const formattedTotal = (total / 100).toFixed(2)

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && closeCart()}>
      <SheetContent
        side="right"
        className="flex w-full flex-col p-0 sm:max-w-md bg-white border-l border-amber-200 shadow-2xl z-50"
        aria-label={t('title')}
      >
        {/* Header */}
        <SheetHeader className="flex flex-row items-center justify-between border-b border-amber-100 px-5 py-4 bg-amber-50/50">
          <SheetTitle className="text-lg font-black text-gray-900 font-heading uppercase tracking-wide flex items-center justify-between w-full">
            <span>
              {t('title')}
              {items.length > 0 && (
                <span className="ml-2 text-sm font-bold text-amber-700 font-sans">
                  ({items.length === 1 ? t('itemCountOne') : t('itemsCount', { count: items.length })})
                </span>
              )}
            </span>
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          /* Empty state */
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 mb-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="8" cy="21" r="1" />
                <circle cx="19" cy="21" r="1" />
                <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
              </svg>
            </div>
            <p className="text-base font-bold text-gray-800">{t('empty')}</p>
            <p className="text-xs text-gray-500 max-w-xs">{t('emptySub')}</p>
            <Link
              href={`${prefix}/proizvodi`}
              onClick={closeCart}
              className="mt-2 inline-flex items-center justify-center px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-sm shadow-md transition-transform active:scale-95"
            >
              {t('viewProducts')}
            </Link>
          </div>
        ) : (
          <>
            {/* Scrollable items list */}
            <div className="flex-1 overflow-y-auto px-5">
              <ul className="divide-y divide-amber-100">
                {items.map((item) => (
                  <CartItem
                    key={`${item.productId}-${item.variantId}`}
                    item={item}
                    onRemove={() => removeItem(item.productId, item.variantId)}
                    onUpdateQuantity={(qty) =>
                      updateQuantity(item.productId, item.variantId, qty)
                    }
                  />
                ))}
              </ul>
            </div>

            {/* Free shipping progress */}
            <div className="border-t border-amber-100 px-5 py-3 bg-amber-50/30">
              <div className="mb-1.5 flex items-center justify-between text-xs font-bold">
                {remaining === 0 ? (
                  <span className="text-emerald-600 flex items-center gap-1">
                    {t('freeShippingReached')}
                  </span>
                ) : (
                  <span className="text-gray-700">
                    {t('freeShippingProgress', { amount: `${formattedRemaining} €` })}
                  </span>
                )}
              </div>
              <div
                className="h-2 w-full overflow-hidden rounded-full bg-amber-100"
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={progressPercent}
                aria-label="Napredak do besplatne dostave"
              >
                <div
                  className="h-full rounded-full bg-gradient-to-r from-orange-500 to-amber-500 transition-all duration-500 shadow-sm"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Footer / Checkout */}
            <div className="border-t border-amber-200 px-5 py-5 bg-white space-y-3">
              {/* Surcharge breakdown if retail mode */}
              {shopMode === 'retail' && surcharge > 0 && (
                <div className="space-y-1.5 pb-2 border-b border-gray-100 text-xs">
                  <div className="flex items-center justify-between text-gray-600">
                    <span>{tShop('subtotal')}</span>
                    <span className="font-semibold">{formattedSubtotal} €</span>
                  </div>
                  <div className="flex items-center justify-between text-amber-700 font-semibold bg-amber-50 p-2 rounded-xl border border-amber-200/60">
                    <span>{tShop('packagingSurcharge')}</span>
                    <span>+{formattedSurcharge} €</span>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between text-base">
                <span className="font-bold text-gray-700">{t('total')}</span>
                <span className="font-black text-2xl text-gray-900 font-heading">{formattedTotal} €</span>
              </div>
              <Link
                href={`${prefix}/narudzba`}
                onClick={closeCart}
                className="flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-red-600 via-orange-500 to-amber-500 hover:from-red-700 hover:to-amber-600 px-5 py-3.5 text-base font-black text-white shadow-xl shadow-orange-500/25 transition-transform active:scale-98"
              >
                {t('checkoutBtn')}
              </Link>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
