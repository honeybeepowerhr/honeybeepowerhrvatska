'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Clock, MessageCircleQuestion } from 'lucide-react'
import { useTranslations, useLocale } from 'next-intl'
import InquiryForm from '@/components/inquiry/InquiryForm'
import { useCartStore } from '@/features/cart'
import type { InquiryFormValues, Locale } from '@/types'

function OrderSummary() {
  const t = useTranslations('checkout')
  const { items } = useCartStore()

  return (
    <aside
      aria-label={t('summaryTitle')}
      className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sticky top-24 space-y-6"
    >
      <h2 className="text-base font-semibold text-charcoal font-heading uppercase tracking-wide">
        {t('summaryTitle')}
      </h2>

      <ul role="list" className="divide-y divide-gray-100 space-y-0">
        {items.map((item) => (
          <li key={`${item.productId}-${item.variantId}`} className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
            <div
              aria-hidden="true"
              className="w-12 h-12 rounded-lg bg-amber-100 shrink-0 flex items-center justify-center text-xl"
            >
              🍯
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-charcoal truncate">{item.name}</p>
              <p className="text-xs text-gray-500 mt-0.5">
                {item.variantLabel} × {item.quantity}
              </p>
            </div>
          </li>
        ))}
      </ul>

      <div className="flex flex-col gap-2 pt-2 border-t border-gray-100">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Clock className="w-3.5 h-3.5 text-amber-500 shrink-0" aria-hidden="true" />
          {t('replyNotice')}
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <MessageCircleQuestion className="w-3.5 h-3.5 text-amber-500 shrink-0" aria-hidden="true" />
          {t('noObligation')}
        </div>
      </div>
    </aside>
  )
}

export default function InquiryPage() {
  const t = useTranslations('checkout')
  const tCart = useTranslations('cart')
  const locale = useLocale() as Locale
  const prefix = locale === 'hr' ? '' : `/${locale}`

  const { items, clearCart } = useCartStore()
  const [hydrated, setHydrated] = useState(false)
  const [justSubmitted, setJustSubmitted] = useState(false)

  useEffect(() => {
    useCartStore.persist.rehydrate()
    setHydrated(true)
  }, [])

  const handleSubmit = async (values: InquiryFormValues) => {
    const res = await fetch('/api/inquiry', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customer: {
          fullName: values.fullName,
          email: values.email,
          phone: values.phone,
        },
        shippingAddress: {
          address: values.address,
          city: values.city,
          postalCode: values.postalCode,
          country: values.country,
        },
        notes: values.notes,
        items: items.map((item) => ({
          name: item.name,
          variantLabel: item.variantLabel,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          imageSrc: item.imageSrc,
        })),
      }),
    })

    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      throw new Error(data.error || 'Slanje upita nije uspjelo. Pokušajte ponovno.')
    }

    setJustSubmitted(true)
    clearCart()
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="font-heading font-black text-3xl sm:text-4xl text-charcoal tracking-tight">
            {t('title')}
          </h1>
          <p className="text-gray-500 mt-1 text-sm">
            {t('subtitle')}
          </p>
        </div>

        {!justSubmitted && hydrated && items.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center">
            <p className="text-base font-medium text-charcoal mb-2">{tCart('empty')}</p>
            <p className="text-sm text-gray-500 mb-6">
              {tCart('emptySub')}
            </p>
            <Link
              href={`${prefix}/proizvodi`}
              className="inline-flex items-center justify-center px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm shadow-md transition-transform active:scale-95"
            >
              {tCart('viewProducts')}
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 items-start">
            <div>
              <InquiryForm onSubmit={handleSubmit} />
            </div>
            {!justSubmitted && <OrderSummary />}
          </div>
        )}
      </div>
    </div>
  )
}
