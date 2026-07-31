'use client'

import { useState } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'

interface GalleryImage {
  src: string
  alt: string
}

interface ProductImageGalleryProps {
  images: GalleryImage[]
}

export default function ProductImageGallery({ images }: ProductImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const active = images[activeIndex] ?? images[0]

  return (
    <div className="space-y-4">
      {/* Main image */}
      <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-amber-50/60 p-6 border border-amber-100 shadow-inner">
        <Image
          src={active.src}
          alt={active.alt}
          fill
          priority
          className="object-contain p-4"
        />
      </div>

      {/* Thumbnails — only shown when there's more than one image */}
      {images.length > 1 && (
        <div className="flex gap-3" role="tablist" aria-label="Slike proizvoda">
          {images.map((img, i) => (
            <button
              key={img.src + i}
              type="button"
              role="tab"
              aria-selected={i === activeIndex}
              aria-label={img.alt}
              onClick={() => setActiveIndex(i)}
              className={cn(
                'relative w-20 h-20 shrink-0 rounded-xl overflow-hidden border-2 bg-amber-50/60 p-2 transition-colors',
                i === activeIndex
                  ? 'border-amber-500'
                  : 'border-transparent hover:border-amber-200'
              )}
            >
              <Image src={img.src} alt={img.alt} fill className="object-contain p-1.5" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
