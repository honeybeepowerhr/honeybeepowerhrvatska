// Zustand store za košaricu s localStorage persistencijom
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { CartItem, CartStore, Bundle } from '@/types'

// ----------------------------------------------------------------
// Helpers
// ----------------------------------------------------------------

function matchItem(a: CartItem, productId: string, variantId: string): boolean {
  return a.productId === productId && a.variantId === variantId
}

// ----------------------------------------------------------------
// Safe localStorage storage (fallback to in-memory on failure)
// ----------------------------------------------------------------

/**
 * In-memory fallback used when localStorage is unavailable
 * (private/incognito mode, storage quota exceeded, SSR, etc.)
 */
const memoryStorage = new Map<string, string>()

const safeLocalStorage = {
  getItem: (key: string): string | null => {
    try {
      return localStorage.getItem(key)
    } catch {
      return memoryStorage.get(key) ?? null
    }
  },
  setItem: (key: string, value: string): void => {
    try {
      localStorage.setItem(key, value)
    } catch {
      memoryStorage.set(key, value)
    }
  },
  removeItem: (key: string): void => {
    try {
      localStorage.removeItem(key)
    } catch {
      memoryStorage.delete(key)
    }
  },
}

// ----------------------------------------------------------------
// Store implementation
// ----------------------------------------------------------------

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      // ---- State ------------------------------------------------
      items: [],
      isOpen: false,
      shopMode: 'wholesale',

      // ---- Mutations --------------------------------------------
      setShopMode: (mode) =>
        set((state) => {
          if (mode === 'wholesale') {
            // When switching to wholesale mode, elevate any items below MOQ to their wholesale minimum
            const updatedItems = state.items.map((item) => {
              const moq = item.minQuantity ?? 5
              return item.quantity < moq ? { ...item, quantity: moq } : item
            })
            return { shopMode: mode, items: updatedItems }
          }
          if (mode === 'retail') {
            // When switching back to retail mode, reset items that were at wholesale MOQ back to 1
            const updatedItems = state.items.map((item) => {
              const moq = item.minQuantity ?? 5
              return item.quantity === moq ? { ...item, quantity: 1 } : item
            })
            return { shopMode: mode, items: updatedItems }
          }
          return { shopMode: mode }
        }),

      addItem: (item: CartItem) => {
        set((state) => {
          const existing = state.items.find((i) =>
            matchItem(i, item.productId, item.variantId),
          )
          if (existing) {
            return {
              items: state.items.map((i) =>
                matchItem(i, item.productId, item.variantId)
                  ? { ...i, quantity: i.quantity + item.quantity }
                  : i,
              ),
            }
          }
          return { items: [...state.items, item] }
        })
      },

      removeItem: (productId: string, variantId: string) => {
        set((state) => ({
          items: state.items.filter(
            (i) => !matchItem(i, productId, variantId),
          ),
        }))
      },

      updateQuantity: (productId: string, variantId: string, qty: number) => {
        if (qty <= 0) {
          get().removeItem(productId, variantId)
          return
        }

        const targetItem = get().items.find((i) => matchItem(i, productId, variantId))
        const moq = targetItem?.minQuantity ?? 5
        const finalQty = get().shopMode === 'wholesale' && qty < moq ? moq : qty

        set((state) => ({
          items: state.items.map((i) =>
            matchItem(i, productId, variantId) ? { ...i, quantity: finalQty } : i,
          ),
        }))
      },

      clearCart: () => set({ items: [] }),

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      // ---- Derived / computed -----------------------------------
      subtotalAmount: () =>
        get().items.reduce(
          (sum, item) => sum + item.unitPrice * item.quantity,
          0,
        ),

      packagingSurcharge: () =>
        get().shopMode === 'retail' && get().items.length > 0 ? 1000 : 0,

      totalAmount: () =>
        get().subtotalAmount() + get().packagingSurcharge(),

      totalItems: () =>
        get().items.reduce((sum, item) => sum + item.quantity, 0),

      isAboveFreeShipping: (threshold: number) =>
        get().totalAmount() >= threshold,

      // ---- Bundle atomicity ------------------------------------
      /**
       * Adds every product from the bundle as a single CartItem line.
       * If any individual addItem call throws, the entire operation is
       * rolled back to the pre-call snapshot.
       */
      addBundle: (bundle: Bundle) => {
        const snapshot = get().items

        try {
          for (const bundleItem of bundle.products) {
            const cartItem: CartItem = {
              productId: bundleItem.product._ref,
              variantId: bundleItem.variant._ref,
              // Bundle-level metadata — callers should enrich these
              // fields when the full product data is available.
              name: bundle.name.hr,
              slug: bundle.slug,
              imageSrc:
                bundle.imageGallery[0]?.asset._ref ?? '',
              variantLabel: bundle.name.hr,
              unitPrice: bundle.bundlePrice,
              quantity: bundleItem.quantity,
            }
            get().addItem(cartItem)
          }
        } catch {
          // Rollback: restore the pre-bundle snapshot
          set({ items: snapshot })
        }
      },
    }),

    // ---- Persist options ----------------------------------------
    {
      name: 'hbp-cart',
      storage: createJSONStorage(() => safeLocalStorage),
      version: 1,
      /**
       * Only persist items — transient UI state (isOpen) should not
       * survive a page reload.
       */
      partialize: (state) => ({ items: state.items, shopMode: state.shopMode }),
      /**
       * skipHydration: true prevents the store from automatically
       * hydrating on the server (SSR safety).  Call
       * useCartStore.persist.rehydrate() manually on the client if
       * needed (e.g. inside a useEffect in the root layout).
       */
      skipHydration: true,
    },
  ),
)
