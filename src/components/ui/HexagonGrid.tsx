import React from 'react'

interface HexagonGridProps {
  className?: string
  colorTheme?: 'red-orange-yellow' | 'orange-yellow' | 'subtle'
}

export function HexagonGrid({ className = '' }: HexagonGridProps) {
  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`} aria-hidden="true">
      {/* Top right floating 2D Hexagons */}
      <svg
        className="absolute -top-12 -right-12 w-96 h-96 opacity-25"
        viewBox="0 0 200 200"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g strokeWidth="2">
          {/* Hexagon 1 - Red */}
          <polygon points="100,10 140,33 140,77 100,100 60,77 60,33" fill="none" stroke="#ef4444" />
          {/* Hexagon 2 - Orange */}
          <polygon points="140,33 180,56 180,100 140,123 100,100 100,56" fill="none" stroke="#f97316" />
          {/* Hexagon 3 - Yellow */}
          <polygon points="100,100 140,123 140,167 100,190 60,167 60,123" fill="none" stroke="#eab308" />
          {/* Inner filled small hexagon */}
          <polygon points="100,45 118,55 118,76 100,86 82,76 82,55" fill="#f97316" fillOpacity="0.15" stroke="#f97316" />
        </g>
      </svg>

      {/* Bottom left floating 2D Hexagons */}
      <svg
        className="absolute -bottom-16 -left-16 w-80 h-80 opacity-20"
        viewBox="0 0 200 200"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g strokeWidth="2">
          <polygon points="100,10 140,33 140,77 100,100 60,77 60,33" fill="none" stroke="#dc2626" />
          <polygon points="60,77 100,100 100,144 60,167 20,144 20,100" fill="none" stroke="#f97316" />
          <polygon points="100,100 140,123 140,167 100,190 60,167 60,123" fill="none" stroke="#eab308" />
          <polygon points="60,33 78,43 78,64 60,74 42,64 42,43" fill="#ef4444" fillOpacity="0.2" stroke="#ef4444" />
        </g>
      </svg>
    </div>
  )
}
