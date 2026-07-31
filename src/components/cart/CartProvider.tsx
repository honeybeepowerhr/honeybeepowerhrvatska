'use client'

import { useEffect } from 'react'
import { useCartStore } from '@/features/cart'

/**
 * Rehydrira Zustand cart store na klijentskoj strani.
 *
 * Mora biti uključen visoko u stablu komponenti (npr. u root layoutu)
 * kako bi persist middleware popunio state iz localStorage-a prije
 * nego što se cart UI prikaže.
 */
export function CartProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    void useCartStore.persist.rehydrate()
  }, [])

  return <>{children}</>
}
