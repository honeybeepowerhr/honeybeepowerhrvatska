'use client'

import React from 'react'
import { Check, X } from 'lucide-react'
import { useTranslations } from 'next-intl'

export function ComparisonTable() {
  const t = useTranslations('comparison')

  const comparisonData = [
    {
      feature: t('row1Feature'),
      hbp: t('row1Hbp'),
      generic: t('row1Generic'),
    },
    {
      feature: t('row2Feature'),
      hbp: t('row2Hbp'),
      generic: t('row2Generic'),
    },
    {
      feature: t('row3Feature'),
      hbp: t('row3Hbp'),
      generic: t('row3Generic'),
    },
    {
      feature: t('row4Feature'),
      hbp: t('row4Hbp'),
      generic: t('row4Generic'),
    },
    {
      feature: t('row5Feature'),
      hbp: t('row5Hbp'),
      generic: t('row5Generic'),
    },
    {
      feature: t('row6Feature'),
      hbp: true,
      generic: false,
    },
  ]

  return (
    <div className="w-full space-y-6">
      <h3 className="text-2xl sm:text-3xl font-black text-gray-900 text-center font-heading uppercase tracking-wide">
        {t('heading')}
      </h3>

      <div className="w-full overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm">
        <table className="w-full min-w-[340px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50/80">
              <th className="py-4 px-4 font-bold text-gray-900 w-1/3">{t('colFeature')}</th>
              <th className="py-4 px-4 font-extrabold text-amber-700 bg-amber-50/80 w-1/3 text-center rounded-t-xl">
                {t('colHbp')}
              </th>
              <th className="py-4 px-4 font-bold text-gray-500 w-1/3 text-center">
                {t('colGeneric')}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {comparisonData.map((row, idx) => (
              <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                <td className="py-3.5 px-4 font-semibold text-gray-900">{row.feature}</td>

                {/* HBP Column */}
                <td className="py-3.5 px-4 bg-amber-50/30 text-center font-bold text-amber-950">
                  {typeof row.hbp === 'boolean' ? (
                    row.hbp ? (
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 mx-auto">
                        <Check className="w-4 h-4 stroke-[3]" />
                      </span>
                    ) : (
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-red-100 text-red-700 mx-auto">
                        <X className="w-4 h-4 stroke-[3]" />
                      </span>
                    )
                  ) : (
                    row.hbp
                  )}
                </td>

                {/* Generic Column */}
                <td className="py-3.5 px-4 text-center text-gray-500">
                  {typeof row.generic === 'boolean' ? (
                    row.generic ? (
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 mx-auto">
                        <Check className="w-4 h-4 stroke-[3]" />
                      </span>
                    ) : (
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-red-100 text-red-700 mx-auto">
                        <X className="w-4 h-4 stroke-[3]" />
                      </span>
                    )
                  ) : (
                    row.generic
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
