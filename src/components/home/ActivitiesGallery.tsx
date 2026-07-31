'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { X, Maximize2 } from 'lucide-react'

const GALLERY_IMAGES = [
  { id: 1, src: '/images/events/event-1.jpg' },
  { id: 2, src: '/images/events/event-2.jpg' },
  { id: 3, src: '/images/events/event-3.jpg' },
  { id: 4, src: '/images/events/event-4.jpg' },
  { id: 5, src: '/images/events/event-5.jpg' },
  { id: 6, src: '/images/events/event-6.jpg' },
  { id: 7, src: '/images/events/event-7.jpg' },
  { id: 8, src: '/images/events/event-8.jpg' },
  { id: 9, src: '/images/events/event-9.jpg' },
  { id: 10, src: '/images/events/event-10.jpg' },
  { id: 11, src: '/images/events/event-11.jpg' },
  { id: 12, src: '/images/events/event-12.jpg' },
]

export function ActivitiesGallery() {
  const [selectedImage, setSelectedImage] = useState<(typeof GALLERY_IMAGES)[0] | null>(null)
  const t = useTranslations('activities')

  return (
    <section className="py-16 bg-gray-50 border-b border-gray-100">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-amber-600 font-bold text-sm uppercase tracking-wider">
            {t('badge')}
          </span>
          <h2 className="text-3xl font-extrabold text-gray-900 mt-1">{t('title')}</h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {GALLERY_IMAGES.map((img) => (
            <button
              key={img.id}
              type="button"
              onClick={() => setSelectedImage(img)}
              className="group relative aspect-[4/3] rounded-2xl overflow-hidden bg-gray-200 border border-gray-200 text-left focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-sm"
            >
              <Image
                src={img.src}
                alt="Honey Bee Power događaj"
                width={600}
                height={450}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                <Maximize2 className="w-6 h-6 drop-shadow-md" />
              </div>
            </button>
          ))}
        </div>

        {/* Lightbox Modal */}
        {selectedImage && (
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Prikaz slike u punoj veličini"
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <div
              className="relative max-w-4xl w-full max-h-[90vh] bg-black rounded-2xl overflow-hidden border border-gray-800 shadow-2xl flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                aria-label="Zatvori prikaz"
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/70 text-white flex items-center justify-center hover:bg-black transition border border-white/20"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="relative aspect-video w-full">
                <Image
                  src={selectedImage.src}
                  alt="Honey Bee Power događaj slika"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
