// ============================================================
// Shared TypeScript types — Honey Bee Power Webshop
// ============================================================

// ----------------------------------------------------------
// Internacionalizacija / Localisation
// ----------------------------------------------------------

export type Locale = 'hr' | 'en' | 'de' | 'sl' | 'pl'
export const locales: Locale[] = ['hr', 'en', 'de', 'sl', 'pl']
export const defaultLocale: Locale = 'hr'

export interface LocalizedString {
  hr: string
  en: string
  de: string
  sl?: string
  pl?: string
}

// ----------------------------------------------------------
// Sanity primitives
// ----------------------------------------------------------

export interface SanityReference {
  _ref: string
  _type: 'reference'
}

export interface SanityImage {
  _type: 'image'
  asset: SanityReference
  alt?: string
  hotspot?: { x: number; y: number; height: number; width: number }
}

// ----------------------------------------------------------
// Nutritional data
// ----------------------------------------------------------

export interface NutritionalRow {
  energyKj: number
  energyKcal: number
  carbohydrates: number
  sugars: number
  protein: number
  fat: number
  saturatedFat: number
  salt: number
  sodium: number
  caffeine: number | null
}

export interface NutritionalTable {
  servingSize: string
  per100g: NutritionalRow
  perServing: NutritionalRow
}

// ----------------------------------------------------------
// Product & Variant
// ----------------------------------------------------------

export type ShopMode = 'wholesale' | 'retail'

export interface Variant {
  _key: string
  flavour: string
  size: string               // e.g. "40g", "500g", "700g"
  sku: string
  gtin?: string
  price: number              // in cents; overrides basePrice when set
  compareAtPrice?: number | null
  stockLevel: number
  imageOverride?: SanityImage | null
  minQuantity?: number       // MOQ for wholesale mode
}

/** Lightweight product representation used in catalogue listings and cart. */
export interface ProductSummary {
  _id: string
  name: LocalizedString
  slug: string
  category: string
  shortDescription: LocalizedString
  basePrice: number
  compareAtPrice?: number | null
  averageRating?: number
  reviewCount?: number
  mainImage: SanityImage
  /** Additional product photos shown below the main image on the product page. */
  imageGallery?: SanityImage[]
  variants: Variant[]
  eligibleForSubscription?: boolean
  isBundleItem?: boolean
  minQuantity?: number       // MOQ for wholesale mode
}

/** Full product with all CMS fields — used on the Product Page. */
export interface ProductFull extends ProductSummary {
  fullDescription: unknown          // Portable Text blocks
  imageGallery: SanityImage[]
  nutritionalValues: NutritionalTable
  ingredients: LocalizedString
  allergens: string[]
  faq: FAQ[]
  status: 'active' | 'inactive'
  seoTitle: LocalizedString
  seoDescription: LocalizedString
}

// ----------------------------------------------------------
// FAQ
// ----------------------------------------------------------

export interface FAQ {
  _key: string
  question: LocalizedString
  answer: LocalizedString
}

// ----------------------------------------------------------
// Bundle
// ----------------------------------------------------------

export interface BundleItem {
  product: SanityReference
  variant: SanityReference
  quantity: number
}

export interface Bundle {
  _id: string
  name: LocalizedString
  slug: string
  products: BundleItem[]
  bundlePrice: number          // in cents
  imageGallery: SanityImage[]
  description: unknown         // Portable Text blocks
}

// ----------------------------------------------------------
// Cart
// ----------------------------------------------------------

export interface CartItem {
  productId: string
  variantId: string
  name: string                 // localised at add-to-cart time
  slug: string
  imageSrc: string
  variantLabel: string         // e.g. "Jagoda / 500g"
  unitPrice: number            // in cents
  quantity: number
  minQuantity?: number         // MOQ if applicable
}

export interface CartStore {
  items: CartItem[]
  isOpen: boolean
  shopMode: ShopMode
  setShopMode: (mode: ShopMode) => void
  addItem: (item: CartItem) => void
  removeItem: (productId: string, variantId: string) => void
  updateQuantity: (productId: string, variantId: string, qty: number) => void
  clearCart: () => void
  openCart: () => void
  closeCart: () => void
  /** Sum of (unitPrice × quantity) across all items, in cents. */
  subtotalAmount: () => number
  /** Flat €10 (1000 cents) surcharge for packaging and shipping in retail mode if cart is non-empty. */
  packagingSurcharge: () => number
  /** Total including surcharge if applicable, in cents. */
  totalAmount: () => number
  /** Sum of quantity across all items. */
  totalItems: () => number
  /** True when totalAmount() >= threshold. */
  isAboveFreeShipping: (threshold: number) => boolean
  /** Bundle atomicity: add all bundle items as one line item, or rollback. */
  addBundle: (bundle: Bundle) => void
}

/** Shape persisted to localStorage. */
export interface PersistedCart {
  version: 1
  items: CartItem[]
  updatedAt: string            // ISO 8601
}

// ----------------------------------------------------------
// Address & Order
// ----------------------------------------------------------

export interface Address {
  fullName: string
  email: string
  phone?: string
  street: string
  city: string
  postalCode: string
  country: string              // ISO-3166 alpha-2
}

export type PaymentMethod = 'card' | 'cod' | 'bank_transfer' | 'google_pay' | 'apple_pay'
export type DeliveryMethod = 'hp_express' | 'overseas' | 'gls' | 'pickup'
export type OrderStatus = 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled'

export interface OrderItem {
  productId: string
  variantId: string
  name: string
  variantLabel: string
  quantity: number
  unitPrice: number            // in cents
  totalPrice: number           // in cents
  isBundle: boolean
}

export interface Order {
  id: string                   // Stripe PaymentIntent ID
  orderNumber: string          // HBP-YYYY-NNNNN
  status: OrderStatus
  customer: {
    fullName: string
    email: string
    phone?: string
  }
  shippingAddress: Address
  items: OrderItem[]
  paymentMethod: PaymentMethod
  deliveryMethod: DeliveryMethod
  promoCode?: string
  discountAmount: number       // in cents
  subtotal: number             // in cents
  shippingCost: number         // in cents
  vatAmount: number            // in cents
  total: number                // in cents
  currency: 'EUR'
  createdAt: string            // ISO 8601
  locale: Locale
  abandonedCartEmailsSent: number
  abandonedCartScheduledAt: string | null
}

// ----------------------------------------------------------
// Checkout form (mirrors checkoutSchema Zod shape)
// ----------------------------------------------------------

export interface CheckoutFormValues {
  fullName: string
  email: string
  phone?: string
  address: string
  city: string
  postalCode: string
  country: string              // ISO-3166 alpha-2
  paymentMethod: PaymentMethod
  deliveryMethod: DeliveryMethod
  promoCode?: string
  isGuestCheckout: boolean
  notes?: string
}

// ----------------------------------------------------------
// Inquiry (request-a-quote) — replaces online checkout
// ----------------------------------------------------------

/** Form values collected on the "send inquiry" page — no payment info. */
export interface InquiryFormValues {
  fullName: string
  email: string
  phone?: string
  address: string
  city: string
  postalCode: string
  country: string              // ISO-3166 alpha-2
  notes?: string
}

export interface InquiryItem {
  name: string
  variantLabel: string
  quantity: number
  unitPrice: number             // in cents — indicative only
  imageSrc: string
}

/** Payload sent to POST /api/inquiry. */
export interface InquiryRequestBody {
  customer: {
    fullName: string
    email: string
    phone?: string
  }
  shippingAddress: {
    address: string
    city: string
    postalCode: string
    country: string
  }
  notes?: string
  items: InquiryItem[]
}

// ----------------------------------------------------------
// Quiz engine
// ----------------------------------------------------------

export interface QuizOption {
  id: string
  labelKey: string             // i18n key
  tags: string[]               // e.g. ['running', 'endurance']
}

export interface QuizQuestion {
  id: string
  questionKey: string          // i18n key
  options: QuizOption[]
}

export interface QuizResult {
  productIds: string[]         // 1–3 recommendations
  explanationKey: string       // i18n key for explanation text
  answeredQuestions: number
}

export type QuizRecommendFn = (answers: Record<string, string[]>) => QuizResult

// ----------------------------------------------------------
// Reviews
// ----------------------------------------------------------

export interface Review {
  _id: string
  productId: string
  rating: number               // 1–5
  title: string
  body: string
  author: string
  status: 'pending' | 'approved' | 'rejected'
  createdAt: string            // ISO 8601
}

// ----------------------------------------------------------
// Blog
// ----------------------------------------------------------

export interface BlogPostSummary {
  _id: string
  title: LocalizedString
  slug: string
  publishedAt: string          // ISO 8601
  category: string
  featuredImage: SanityImage
  seoTitle: LocalizedString
  seoDescription: LocalizedString
}

// ----------------------------------------------------------
// Athlete
// ----------------------------------------------------------

export interface Athlete {
  _id: string
  name: string
  photo: SanityImage
  sport: string
  discipline: string
  keyResults: string[]
  biography: LocalizedString
  quote: LocalizedString
}

// ----------------------------------------------------------
// Retailer
// ----------------------------------------------------------

export interface Retailer {
  _id: string
  name: string
  address: string
  city: string
  coordinates: { lat: number; lng: number }
  type: 'shop' | 'pharmacy' | 'online'
  logo: SanityImage | null
}

// ----------------------------------------------------------
// Testimonial
// ----------------------------------------------------------

export interface Testimonial {
  _id: string
  name: string
  photo?: SanityImage
  sport: string
  achievement: string
  quote: LocalizedString
  rating: number               // 1–5
}

// ----------------------------------------------------------
// Component prop interfaces
// ----------------------------------------------------------

export interface HeaderProps {
  locale: Locale
  cartItemCount: number
}

export interface InfoBarProps {
  freeShippingThreshold: number  // in cents (EUR)
  locale: Locale
}

export interface ProductCardProps {
  product: ProductSummary
  locale: Locale
  onAddToCart: (product: ProductSummary, variant?: Variant) => void
  showRating?: boolean
  showPromoPrice?: boolean
}

// ----------------------------------------------------------
// Analytics / GTM
// ----------------------------------------------------------

export type GA4EcommerceEvent =
  | 'view_item'
  | 'add_to_cart'
  | 'remove_from_cart'
  | 'begin_checkout'
  | 'purchase'

export type CustomGA4Event =
  | 'quiz_completed'
  | 'quiz_result_added_to_cart'
  | 'newsletter_signup'
  | 'b2b_form_submit'
  | 'pdf_download'
  | 'whatsapp_click'
  | 'phone_click'

export interface GTMDataLayerPush {
  event: GA4EcommerceEvent | CustomGA4Event
  ecommerce?: object
  [key: string]: unknown
}
