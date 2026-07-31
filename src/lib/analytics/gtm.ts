/**
 * Google Tag Manager & GA4 Enhanced Ecommerce Tracking Helper
 */

declare global {
  interface Window {
    dataLayer?: any[]
  }
}

export function pushToDataLayer(event: string, payload: Record<string, any> = {}): void {
  if (typeof window === 'undefined') return
  window.dataLayer = window.dataLayer || []
  window.dataLayer.push({
    event,
    ...payload,
  })
}

export function trackViewItem(product: { id: string; name: string; price: number; category?: string }) {
  pushToDataLayer('view_item', {
    ecommerce: {
      currency: 'EUR',
      value: product.price / 100,
      items: [
        {
          item_id: product.id,
          item_name: product.name,
          item_category: product.category,
          price: product.price / 100,
          quantity: 1,
        },
      ],
    },
  })
}

export function trackAddToCart(item: { productId: string; name: string; unitPrice: number; quantity: number }) {
  pushToDataLayer('add_to_cart', {
    ecommerce: {
      currency: 'EUR',
      value: (item.unitPrice * item.quantity) / 100,
      items: [
        {
          item_id: item.productId,
          item_name: item.name,
          price: item.unitPrice / 100,
          quantity: item.quantity,
        },
      ],
    },
  })
}

export function trackBeginCheckout(items: Array<{ productId: string; name: string; unitPrice: number; quantity: number }>, totalValue: number) {
  pushToDataLayer('begin_checkout', {
    ecommerce: {
      currency: 'EUR',
      value: totalValue / 100,
      items: items.map((i) => ({
        item_id: i.productId,
        item_name: i.name,
        price: i.unitPrice / 100,
        quantity: i.quantity,
      })),
    },
  })
}

export function trackPurchase(orderId: string, totalValue: number, items: Array<{ productId: string; name: string; unitPrice: number; quantity: number }>) {
  pushToDataLayer('purchase', {
    ecommerce: {
      transaction_id: orderId,
      currency: 'EUR',
      value: totalValue / 100,
      items: items.map((i) => ({
        item_id: i.productId,
        item_name: i.name,
        price: i.unitPrice / 100,
        quantity: i.quantity,
      })),
    },
  })
}
