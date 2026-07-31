'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import Image from 'next/image'

// ----------------------------------------------------------------
// Types
// ----------------------------------------------------------------

export interface GalleryImage {
  src: string
  alt: string
  width?: number
  height?: number
}

interface ProductGalleryProps {
  images: GalleryImage[]
}

// ----------------------------------------------------------------
// Constants
// ----------------------------------------------------------------

const DEFAULT_IMG_WIDTH = 800
const DEFAULT_IMG_HEIGHT = 800
const SWIPE_THRESHOLD = 50 // px

// ----------------------------------------------------------------
// Component
// ----------------------------------------------------------------

export default function ProductGallery({ images }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isZoomed, setIsZoomed] = useState(false)
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 })

  // Touch tracking refs (no re-renders on touch move)
  const touchStartX = useRef<number | null>(null)
  const touchStartY = useRef<number | null>(null)

  const hasImages = images.length > 0
  const activeImage = hasImages ? images[activeIndex] : null
  const clampedIndex = Math.max(0, Math.min(activeIndex, images.length - 1))

  // Keep activeIndex in bounds if images change
  useEffect(() => {
    if (activeIndex >= images.length && images.length > 0) {
      setActiveIndex(images.length - 1)
    }
  }, [images.length, activeIndex])

  // ---- Navigation helpers -------------------------------------

  const goTo = useCallback(
    (index: number) => {
      if (!hasImages) return
      setActiveIndex(Math.max(0, Math.min(index, images.length - 1)))
      setIsZoomed(false)
    },
    [hasImages, images.length],
  )

  const goPrev = useCallback(() => goTo(clampedIndex - 1), [goTo, clampedIndex])
  const goNext = useCallback(() => goTo(clampedIndex + 1), [goTo, clampedIndex])

  // ---- Keyboard navigation ------------------------------------

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        goPrev()
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        goNext()
      } else if (e.key === 'Escape') {
        setIsZoomed(false)
      }
    },
    [goPrev, goNext],
  )

  // ---- Zoom on desktop ----------------------------------------

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setZoomPosition({ x, y })
  }, [])

  const handleMouseEnter = useCallback(() => setIsZoomed(true), [])
  const handleMouseLeave = useCallback(() => setIsZoomed(false), [])

  // ---- Touch / swipe on mobile --------------------------------

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
    touchStartY.current = e.touches[0].clientY
  }, [])

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (touchStartX.current === null || touchStartY.current === null) return

      const deltaX = e.changedTouches[0].clientX - touchStartX.current
      const deltaY = e.changedTouches[0].clientY - touchStartY.current

      // Only act on predominantly horizontal swipes
      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > SWIPE_THRESHOLD) {
        if (deltaX < 0) {
          goNext()
        } else {
          goPrev()
        }
      }

      touchStartX.current = null
      touchStartY.current = null
    },
    [goNext, goPrev],
  )

  // ----------------------------------------------------------------
  // Render — placeholder when no images
  // ----------------------------------------------------------------

  if (!hasImages) {
    return (
      <div
        role="img"
        aria-label="Slika nije dostupna"
        className="flex items-center justify-center w-full aspect-square rounded-2xl bg-gray-100 border border-gray-200 text-gray-400 text-base font-medium select-none"
      >
        Slika nije dostupna
      </div>
    )
  }

  // ----------------------------------------------------------------
  // Render — gallery
  // ----------------------------------------------------------------

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* ---- Main image ---------------------------------------- */}
      <div
        role="region"
        aria-roledescription="carousel"
        tabIndex={0}
        onKeyDown={handleKeyDown}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="relative w-full aspect-square rounded-2xl overflow-hidden bg-gray-100 border border-gray-200 cursor-zoom-in focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-honey focus-visible:ring-offset-2 select-none"
        aria-label={`${activeImage?.alt ?? 'Slika proizvoda'} — slika ${clampedIndex + 1} od ${images.length}. Koristite tipke sa strelicama za navigaciju.`}
      >
        {/* Image */}
        <Image
          key={clampedIndex}
          src={activeImage!.src}
          alt={activeImage!.alt}
          width={activeImage!.width ?? DEFAULT_IMG_WIDTH}
          height={activeImage!.height ?? DEFAULT_IMG_HEIGHT}
          priority={clampedIndex === 0}
          loading={clampedIndex === 0 ? undefined : 'lazy'}
          className={[
            'w-full h-full object-contain p-4 transition-transform duration-200 ease-out drop-shadow-md',
            isZoomed ? 'scale-150' : 'scale-100',
          ].join(' ')}
          style={
            isZoomed
              ? { transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%` }
              : undefined
          }
          draggable={false}
        />

        {/* Prev / Next arrow buttons — visible on desktop hover */}
        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={goPrev}
              disabled={clampedIndex === 0}
              aria-label="Prethodna slika"
              className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center justify-center w-9 h-9 rounded-full bg-white/80 hover:bg-white shadow text-charcoal transition-opacity opacity-0 group-hover:opacity-100 focus-visible:opacity-100 disabled:opacity-20 disabled:cursor-not-allowed"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-5 h-5"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
                  clipRule="evenodd"
                />
              </svg>
            </button>

            <button
              type="button"
              onClick={goNext}
              disabled={clampedIndex === images.length - 1}
              aria-label="Sljedeća slika"
              className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center w-9 h-9 rounded-full bg-white/80 hover:bg-white shadow text-charcoal transition-opacity opacity-0 group-hover:opacity-100 focus-visible:opacity-100 disabled:opacity-20 disabled:cursor-not-allowed"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-5 h-5"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </>
        )}

        {/* Dot indicators (mobile) */}
        {images.length > 1 && (
          <div
            role="tablist"
            aria-label="Navigacija slika"
            className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 md:hidden"
          >
            {images.map((_, i) => (
              <button
                key={i}
                type="button"
                role="tab"
                aria-selected={i === clampedIndex}
                aria-label={`Slika ${i + 1}`}
                onClick={() => goTo(i)}
                className={[
                  'w-2 h-2 rounded-full border transition-all',
                  i === clampedIndex
                    ? 'bg-amber-honey border-amber-honey scale-125'
                    : 'bg-white/60 border-white/60 hover:bg-white',
                ].join(' ')}
              />
            ))}
          </div>
        )}
      </div>

      {/* ---- Thumbnail strip ----------------------------------- */}
      {images.length > 1 && (
        <div
          role="list"
          aria-label="Minijature galerije"
          className="flex flex-row gap-2 overflow-x-auto pb-1 scrollbar-thin"
        >
          {images.map((img, i) => (
            <button
              key={i}
              type="button"
              role="listitem"
              onClick={() => goTo(i)}
              aria-label={`Prikaži sliku: ${img.alt}`}
              aria-current={i === clampedIndex ? 'true' : undefined}
              className={[
                'relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-honey focus-visible:ring-offset-1 bg-white',
                i === clampedIndex
                  ? 'border-amber-honey ring-1 ring-amber-honey'
                  : 'border-gray-200 hover:border-amber-honey/60 opacity-70 hover:opacity-100',
              ].join(' ')}
            >
              <Image
                src={img.src}
                alt={img.alt}
                width={img.width ?? 128}
                height={img.height ?? 128}
                loading="lazy"
                className="w-full h-full object-contain p-1"
                draggable={false}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
