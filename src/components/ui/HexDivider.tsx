import React from 'react'

// ----------------------------------------------------------
// HexDivider — a small, static row of honeycomb outlines used
// as a section accent so the honey theme shows up in more
// places without repeating the old full-page background.
//
// Fixed small viewBox tiled a handful of times (not stretched
// edge-to-edge across the viewport), so there's no scaling or
// alignment risk — it's just a short decorative strip.
// ----------------------------------------------------------

interface HexDividerProps {
  className?: string
  tone?: 'light' | 'dark'
}

export function HexDivider({ className = '', tone = 'light' }: HexDividerProps) {
  const stroke = tone === 'dark' ? '#fbbf24' : '#b45309'

  return (
    <div className={`flex justify-center gap-2.5 ${className}`} aria-hidden="true">
      {Array.from({ length: 9 }).map((_, i) => (
        <svg key={i} width="14" height="16" viewBox="0 0 14 16" className="shrink-0">
          <polygon
            points="7,0 14,4 14,12 7,16 0,12 0,4"
            fill="none"
            stroke={stroke}
            strokeWidth="1.4"
            opacity={i % 3 === 1 ? 1 : 0.45}
          />
        </svg>
      ))}
    </div>
  )
}
