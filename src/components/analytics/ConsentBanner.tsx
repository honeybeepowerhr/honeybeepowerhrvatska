'use client'

import React, { useState, useEffect } from 'react'
import { Cookie } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { shouldLoadAnalytics } from '@/features/analytics/logic'

const CONSENT_KEY = 'hbp_cookie_consent'

export function ConsentBanner() {
  const [showBanner, setShowBanner] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem(CONSENT_KEY)
    if (consent === null) {
      setShowBanner(true)
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem(CONSENT_KEY, 'granted')
    setShowBanner(false)
    if (shouldLoadAnalytics(true)) {
      window.dispatchEvent(new Event('consent_updated'))
    }
  }

  const handleDecline = () => {
    localStorage.setItem(CONSENT_KEY, 'denied')
    setShowBanner(false)
  }

  if (!showBanner) return null

  return (
    <div
      role="region"
      aria-label="Kolačići i privatnost"
      className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 z-50 max-w-md bg-slate-900 text-white rounded-3xl p-6 shadow-2xl border border-slate-800"
    >
      <div className="flex items-start gap-3">
        <Cookie className="w-6 h-6 text-amber-400 flex-shrink-0 mt-1" />
        <div className="space-y-2">
          <h3 className="font-bold text-base">Postavke Privatnosti i Kolačića</h3>
          <p className="text-xs text-gray-300 leading-relaxed">
            Koristimo kolačiće za poboljšanje vašeg iskustva pretraživanja i analitiku posjeta. Možete prihvatiti sve ili nastaviti bez analitičkih kolačića.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-slate-800">
        <Button
          type="button"
          variant="ghost"
          onClick={handleDecline}
          className="text-xs text-gray-400 hover:text-white rounded-xl"
        >
          Samo nužni
        </Button>
        <Button
          type="button"
          onClick={handleAccept}
          className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs px-4 py-2 rounded-xl shadow"
        >
          Prihvati sve
        </Button>
      </div>
    </div>
  )
}
