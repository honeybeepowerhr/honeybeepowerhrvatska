'use client'

import React, { useState } from 'react'
import { MapPin, Phone } from 'lucide-react'
import { useTranslations } from 'next-intl'

interface Retailer {
  id: string
  name: string
  address: string
  city: string
  postalCode: string
  type: 'shop' | 'pharmacy' | 'online'
  phone?: string
  website?: string
  lat: number
  lng: number
}

const RETAILERS: Retailer[] = [
  {
    id: '1',
    name: 'Planet Bio Skladište & Sjedište',
    address: 'Krndijska ulica 4',
    city: 'Našice',
    postalCode: '31500',
    type: 'shop',
    phone: '+385 977 097 962',
    website: 'https://planetbio.hr',
    lat: 45.496,
    lng: 18.093,
  },
  {
    id: '2',
    name: 'BioSport Trgovina Zagreb',
    address: 'Ilica 42',
    city: 'Zagreb',
    postalCode: '10000',
    type: 'shop',
    phone: '+385 1 4812 345',
    lat: 45.813,
    lng: 15.977,
  },
  {
    id: '3',
    name: 'Ljekarna Osijek Centar',
    address: 'Trg Ante Starčevića 7',
    city: 'Osijek',
    postalCode: '31000',
    type: 'pharmacy',
    phone: '+385 31 200 111',
    lat: 45.560,
    lng: 18.675,
  },
  {
    id: '4',
    name: 'FitZona Rijeka',
    address: 'Riva 16',
    city: 'Rijeka',
    postalCode: '51000',
    type: 'shop',
    phone: '+385 51 333 444',
    lat: 45.327,
    lng: 14.442,
  },
]

export default function WhereToBuyPage() {
  const t = useTranslations('whereToBuyPage')
  const [selectedRetailer, setSelectedRetailer] = useState<Retailer | null>(RETAILERS[0])

  return (
    <div className="py-12 md:py-16 bg-gray-50/50">
      <div className="container mx-auto px-4 max-w-7xl">
        
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-amber-600 font-bold text-sm uppercase tracking-wider">{t('badge')}</span>
          <h1 className="text-4xl font-black text-gray-900 mt-1">
            {t('title')}
          </h1>
          <p className="text-gray-600 mt-3 text-base">
            {t('subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Retailers List */}
          <div className="lg:col-span-5 space-y-4">
            <h2 className="text-lg font-bold text-gray-900 mb-4">{t('listTitle')} ({RETAILERS.length})</h2>

            {RETAILERS.map((ret) => {
              const isSelected = selectedRetailer?.id === ret.id
              return (
                <div
                  key={ret.id}
                  onClick={() => setSelectedRetailer(ret)}
                  className={[
                    'p-5 rounded-2xl border transition-all cursor-pointer bg-white shadow-sm',
                    isSelected
                      ? 'border-amber-500 ring-2 ring-amber-500/20 bg-amber-50/30'
                      : 'border-gray-200 hover:border-amber-300',
                  ].join(' ')}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-100 text-amber-900 mb-2">
                        {ret.type === 'shop' ? t('shop') : ret.type === 'pharmacy' ? t('pharmacy') : t('online')}
                      </span>
                      <h3 className="font-bold text-gray-900 text-base">{ret.name}</h3>
                      <p className="text-sm text-gray-600 mt-1 flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-amber-600 flex-shrink-0" />
                        <span>{ret.address}, {ret.postalCode} {ret.city}</span>
                      </p>
                    </div>
                  </div>

                  {ret.phone && (
                    <p className="text-xs text-gray-500 mt-3 flex items-center gap-1.5 pt-3 border-t border-gray-100">
                      <Phone className="w-3.5 h-3.5 text-gray-400" />
                      <span>{ret.phone}</span>
                    </p>
                  )}
                </div>
              )
            })}
          </div>

          {/* Interactive Map Visual */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-md h-full flex flex-col justify-between">
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-amber-600" />
                  <span>{t('mapTitle')}</span>
                </h2>

                <div className="w-full aspect-square max-h-[450px] rounded-2xl bg-amber-50/60 border border-amber-200 relative overflow-hidden flex flex-col items-center justify-center p-6 text-center">
                  <div className="w-16 h-16 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center font-bold shadow-lg mb-4 animate-bounce">
                    <MapPin className="w-8 h-8" />
                  </div>

                  {selectedRetailer ? (
                    <div className="bg-white p-4 rounded-xl shadow-xl border border-gray-200 max-w-sm">
                      <div className="font-bold text-gray-900">{selectedRetailer.name}</div>
                      <div className="text-xs text-gray-600 mt-1">
                        {selectedRetailer.address}, {selectedRetailer.city}
                      </div>
                      <div className="text-xs text-amber-600 font-semibold mt-2">
                        {selectedRetailer.lat}, {selectedRetailer.lng}
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm font-medium text-gray-600">{t('mapSelectNotice')}</p>
                  )}
                </div>
              </div>

              <p className="text-xs text-gray-400 mt-4 text-center">
                {t('b2bNotice')}
              </p>
            </div>
          </div>

        </div>

      </div>
    </div>
  )
}
