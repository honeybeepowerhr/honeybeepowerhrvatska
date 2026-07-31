import { describe, it, expect } from 'vitest'
import React from 'react'
import { Hreflang } from '@/components/seo/Hreflang'

describe('Unit & Accessibility — Component Integrity Checks', () => {
  it('renders Hreflang component without throwing', () => {
    const el = Hreflang({ pathname: '/proizvodi' })
    expect(el).not.toBeNull()
    expect(React.isValidElement(el)).toBe(true)
  })
})
