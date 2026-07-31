'use client'

import React from 'react'
import { usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useCartStore } from '@/features/cart/store'
import { Building2, ShoppingBag, Info, Lock } from 'lucide-react'

interface ShopModeToggleProps {
  compact?: boolean
  className?: string
}

export function ShopModeToggle({ compact = false, className = '' }: ShopModeToggleProps) {
  const t = useTranslations('shopMode')
  const pathname = usePathname()
  const shopMode = useCartStore((state) => state.shopMode)
  const setShopMode = useCartStore((state) => state.setShopMode)

  const isLockedOnCheckout = pathname?.includes('/narudzba') ?? false

  if (isLockedOnCheckout) {
    if (compact) {
      return (
        <div className={`inline-flex items-center gap-1.5 bg-slate-900/90 text-amber-300 px-3 py-1.5 rounded-full border border-amber-500/40 text-xs font-bold ${className}`}>
          <Lock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span>{shopMode === 'wholesale' ? t('wholesaleTab') : t('retailTab')}</span>
        </div>
      )
    }

    return (
      <div className={`bg-slate-900 border border-amber-500/40 rounded-2xl p-4 text-white shadow-md ${className}`}>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 shrink-0">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-amber-300/80 uppercase tracking-wider font-semibold">
              Mod narudžbe zaključan
            </div>
            <div className="text-sm font-bold text-white flex items-center gap-2">
              {shopMode === 'wholesale' ? (
                <>
                  <Building2 className="w-4 h-4 text-amber-400 inline" />
                  <span>{t('wholesaleBadge')}</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4 text-amber-400 inline" />
                  <span>{t('retailBadge')}</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (compact) {
    return (
      <div className={`inline-flex items-center bg-amber-950/40 p-1 rounded-full border border-amber-500/30 ${className}`}>
        <button
          type="button"
          onClick={() => setShopMode('wholesale')}
          className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full transition-all ${
            shopMode === 'wholesale'
              ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md'
              : 'text-amber-100/70 hover:text-white'
          }`}
        >
          <Building2 className="w-3.5 h-3.5" />
          <span>{t('wholesaleTab')}</span>
        </button>

        <button
          type="button"
          onClick={() => setShopMode('retail')}
          className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full transition-all ${
            shopMode === 'retail'
              ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md'
              : 'text-amber-100/70 hover:text-white'
          }`}
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>{t('retailTab')}</span>
        </button>
      </div>
    )
  }

  return (
    <div className={`bg-gradient-to-r from-slate-900 via-amber-950/60 to-slate-900 border border-amber-500/20 rounded-2xl p-4 shadow-lg text-white ${className}`}>
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Toggle Switch Tabs */}
        <div className="flex items-center bg-slate-950/80 p-1.5 rounded-xl border border-amber-500/30 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setShopMode('wholesale')}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all ${
              shopMode === 'wholesale'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-gray-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>{t('wholesaleTab')}</span>
          </button>

          <button
            type="button"
            onClick={() => setShopMode('retail')}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all ${
              shopMode === 'retail'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-gray-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>{t('retailTab')}</span>
          </button>
        </div>

        {/* Dynamic Banner Note */}
        <div className="flex items-center gap-2 text-xs sm:text-sm text-amber-200/90 text-center sm:text-left">
          <Info className="w-4 h-4 text-amber-400 shrink-0 hidden sm:inline-block" />
          <span>
            {shopMode === 'wholesale'
              ? t('wholesaleBadge')
              : t('retailSurchargeNotice')}
          </span>
        </div>
      </div>
    </div>
  )
}
