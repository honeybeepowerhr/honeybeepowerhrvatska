import React from 'react'

// ----------------------------------------------------------
// Global background — soft, blurred honey-toned glow.
//
// No tiled geometry, so there's nothing that can look
// "misaligned": just a few large, softly blurred gradient
// blobs positioned behind the content. Fixed to the viewport,
// low-opacity, decorative only.
//
// Uses a NEGATIVE z-index (not z-0) and no opaque background —
// a fixed + z-0 element is a positioned stacking-context layer,
// which paints ABOVE plain in-flow siblings (e.g. the footer,
// which has no z-index of its own), hiding them. A negative
// z-index always paints behind normal content, regardless of
// whether that content sets its own z-index.
// ----------------------------------------------------------

export function AmbientBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden" aria-hidden="true">
      <div
        className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full opacity-40 blur-3xl"
        style={{ background: 'radial-gradient(circle, #fde68a 0%, transparent 70%)' }}
      />
      <div
        className="absolute -top-20 -right-32 w-[520px] h-[520px] rounded-full opacity-30 blur-3xl"
        style={{ background: 'radial-gradient(circle, #fb923c 0%, transparent 70%)' }}
      />
      <div
        className="absolute -bottom-48 left-1/4 w-[680px] h-[680px] rounded-full opacity-30 blur-3xl"
        style={{ background: 'radial-gradient(circle, #f59e0b 0%, transparent 70%)' }}
      />
      <div
        className="absolute bottom-0 -right-40 w-[480px] h-[480px] rounded-full opacity-25 blur-3xl"
        style={{ background: 'radial-gradient(circle, #fca5a5 0%, transparent 70%)' }}
      />
    </div>
  )
}
