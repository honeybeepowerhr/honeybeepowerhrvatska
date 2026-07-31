import { useTranslations } from 'next-intl'
import type { InfoBarProps } from '@/types'

function formatEur(cents: number): string {
  return (cents / 100).toFixed(0)
}

export default function InfoBar({ freeShippingThreshold }: InfoBarProps) {
  const t = useTranslations('header')

  return (
    <div
      role="banner"
      aria-label="Informacijska traka"
      className="w-full bg-amber-500 text-white text-sm font-medium text-center py-2 px-4"
    >
      <p>{t('freeShipping', { amount: formatEur(freeShippingThreshold) })}</p>
    </div>
  )
}
