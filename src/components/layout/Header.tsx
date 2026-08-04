'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { useLocale } from 'next-intl'
import { Menu, X, Search, ShoppingCart, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import LanguageSwitcher from './LanguageSwitcher'
import type { Locale } from '@/types'
import { useCartStore } from '@/features/cart'
import { SearchOverlay } from '@/features/search/SearchOverlay'

// ─── Bee logo SVG ─────────────────────────────────────────────────────────────

function BeeLogo() {
  return (
    <Image
      src="/images/logo.png"
      alt="Honey Bee Power Logo"
      width={44}
      height={44}
      className="w-11 h-11 rounded-xl object-contain shrink-0"
    />
  )
}

// ─── Navigation data ──────────────────────────────────────────────────────────

interface NavCategory {
  labelKey: string
  href: string
}

const PRODUCT_CATEGORIES: NavCategory[] = [
  { labelKey: 'Svi proizvodi',     href: '/proizvodi' },
  { labelKey: 'Energetski gelovi', href: '/proizvodi/energetski-gelovi' },
  { labelKey: 'Izotonični napitci', href: '/proizvodi/izotonicki-napitci' },
]

// ─── MegaMenu ─────────────────────────────────────────────────────────────────

interface MegaMenuProps {
  isOpen: boolean
  onClose: () => void
  locale: Locale
}

function MegaMenu({ isOpen, onClose, locale }: MegaMenuProps) {
  const t = useTranslations('nav')
  const prefix = locale === 'hr' ? '' : `/${locale}`

  return (
    <div
      id="mega-menu"
      role="region"
      aria-label="Mega menu — kategorije proizvoda"
      className={cn(
        'absolute top-full left-0 w-72 bg-white shadow-xl rounded-b-xl border border-gray-100 p-5 z-50',
        'transition-all duration-200 origin-top',
        isOpen ? 'opacity-100 scale-y-100 pointer-events-auto' : 'opacity-0 scale-y-95 pointer-events-none'
      )}
    >
      <p className="text-xs font-semibold uppercase tracking-widest text-charcoal-muted mb-3">
        {t('products')}
      </p>
      <ul role="list" className="space-y-1">
        {PRODUCT_CATEGORIES.map((cat) => (
          <li key={cat.href}>
            <Link
              href={`${prefix}${cat.href}`}
              onClick={onClose}
              className="block px-3 py-2 rounded-lg text-sm text-charcoal hover:bg-amber-50 hover:text-amber-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
            >
              {cat.labelKey}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

// ─── CartBadge ────────────────────────────────────────────────────────────────

function CartBadge({ count }: { count: number }) {
  const { openCart } = useCartStore()

  return (
    <button
      type="button"
      onClick={openCart}
      aria-label="Otvori košaricu"
      className="relative flex items-center justify-center p-2 rounded-lg text-charcoal hover:bg-amber-50 hover:text-amber-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
    >
      <ShoppingCart className="w-5 h-5" aria-hidden="true" />
      {count > 0 && (
        <span
          aria-hidden="true"
          className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-amber-500 text-slate-950 text-[10px] font-black rounded-full flex items-center justify-center px-1 leading-none shadow-sm"
        >
          {count > 99 ? '99+' : count}
        </span>
      )}
    </button>
  )
}

// ─── Mobile menu ──────────────────────────────────────────────────────────────

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
  locale: Locale
}

function MobileMenu({ isOpen, onClose, locale }: MobileMenuProps) {
  const t = useTranslations('nav')
  const prefix = locale === 'hr' ? '' : `/${locale}`

  const navLinks = [
    { key: 'products',   label: t('products'),   href: `${prefix}/proizvodi` },
    { key: 'whereToBuy', label: t('whereToBuy'), href: `${prefix}/gdje-kupiti` },
    { key: 'athletes',   label: t('athletes'),   href: `${prefix}/sportasi` },
    { key: 'guides',     label: t('guides'),     href: `${prefix}/vodici` },
    { key: 'contact',    label: t('contact'),    href: `${prefix}/kontakt` },
    { key: 'b2b',        label: t('b2b'),        href: `${prefix}/b2b` },
  ]

  return (
    <div
      id="mobile-menu"
      role="dialog"
      aria-modal="true"
      aria-label="Mobilni navigacijski izbornik"
      className={cn(
        'fixed inset-0 z-50 flex md:hidden',
        isOpen ? 'pointer-events-auto' : 'pointer-events-none'
      )}
    >
      {/* Backdrop */}
      <div
        aria-hidden="true"
        onClick={onClose}
        className={cn(
          'absolute inset-0 bg-black/60 transition-opacity duration-300',
          isOpen ? 'opacity-100' : 'opacity-0'
        )}
      />

      {/* Drawer */}
      <nav
        aria-label="Mobilna navigacija"
        className={cn(
          'relative w-80 max-w-[85vw] bg-white h-full flex flex-col shadow-2xl',
          'transition-transform duration-300',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <BeeLogo />
            <span className="font-heading font-bold text-lg text-charcoal">Honey Bee Power</span>
          </div>
          <button
            onClick={onClose}
            aria-label="Zatvori izbornik"
            className="p-2 rounded-lg text-charcoal hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Nav links */}
        <ul role="list" className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {navLinks.map((link) => (
            <li key={link.key}>
              <Link
                href={link.href}
                onClick={onClose}
                className="flex items-center px-4 py-3 rounded-xl text-charcoal font-medium hover:bg-amber-50 hover:text-amber-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Categories */}
        <div className="px-5 py-4 border-t border-gray-100">
          <p className="text-xs font-semibold uppercase tracking-widest text-charcoal-muted mb-2">
            Kategorije
          </p>
          <ul role="list" className="space-y-1">
            {PRODUCT_CATEGORIES.map((cat) => (
              <li key={cat.href}>
                <Link
                  href={`${prefix}${cat.href}`}
                  onClick={onClose}
                  className="block px-3 py-2 text-sm text-charcoal rounded-lg hover:bg-amber-50 hover:text-amber-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
                >
                  {cat.labelKey}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Language switcher */}
        <div className="px-5 py-4 border-t border-gray-100 space-y-3">
          <LanguageSwitcher />
        </div>
      </nav>
    </div>
  )
}

// ─── Header ───────────────────────────────────────────────────────────────────

export interface HeaderClientProps {
  cartItemCount?: number
}

export default function Header({ cartItemCount = 0 }: HeaderClientProps) {
  const t = useTranslations('nav')
  const tHeader = useTranslations('header')
  const locale = useLocale() as Locale
  const prefix = locale === 'hr' ? '' : `/${locale}`

  const [megaOpen, setMegaOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  const megaRef = useRef<HTMLDivElement>(null)
  const megaTriggerRef = useRef<HTMLButtonElement>(null)

  // Shadow on scroll
  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 8)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close mega menu on outside click
  useEffect(() => {
    function onPointerDown(e: PointerEvent) {
      if (
        megaRef.current &&
        !megaRef.current.contains(e.target as Node) &&
        megaTriggerRef.current &&
        !megaTriggerRef.current.contains(e.target as Node)
      ) {
        setMegaOpen(false)
      }
    }
    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [])

  // Close mobile menu on Escape
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setMegaOpen(false)
        setMobileOpen(false)
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [])

  // Lock body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  const closeMobileMenu = useCallback(() => setMobileOpen(false), [])

  const desktopNavLinks = [
    { key: 'whereToBuy', label: t('whereToBuy'), href: `${prefix}/gdje-kupiti` },
    { key: 'athletes',   label: t('athletes'),   href: `${prefix}/sportasi` },
    { key: 'guides',     label: t('guides'),     href: `${prefix}/vodici` },
    { key: 'b2b',        label: t('b2b'),        href: `${prefix}/b2b` },
  ]

  return (
    <header
      role="banner"
      className={cn(
        'sticky top-0 z-40 w-full bg-white transition-shadow duration-300',
        scrolled ? 'shadow-md' : 'shadow-sm'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16 gap-4">

          {/* Hamburger — mobile only */}
          <button
            aria-label="Otvori navigacijski izbornik"
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            onClick={() => setMobileOpen(true)}
            className="md:hidden p-2 -ml-1 rounded-lg text-charcoal hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
          >
            <Menu className="w-5 h-5" aria-hidden="true" />
          </button>

          {/* Logo */}
          <Link
            href={`${prefix}/`}
            aria-label="Honey Bee Power — početna stranica"
            className="flex items-center gap-2 shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded-lg"
          >
            <BeeLogo />
            <span className="font-heading font-black text-xl text-charcoal hidden sm:block">
              Honey Bee Power
            </span>
          </Link>

          {/* Desktop nav */}
          <nav
            aria-label="Glavna navigacija"
            className="hidden md:flex items-center gap-1 ml-4 flex-1"
          >
            {/* Products with MegaMenu */}
            <div
              className="relative flex items-center"
              ref={megaRef}
              onMouseEnter={() => setMegaOpen(true)}
              onMouseLeave={() => setMegaOpen(false)}
            >
              <Link
                href={`${prefix}/proizvodi`}
                className={cn(
                  'flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-charcoal hover:bg-amber-50 hover:text-amber-600',
                  megaOpen && 'bg-amber-50 text-amber-600'
                )}
              >
                {t('products')}
              </Link>
              <button
                ref={megaTriggerRef}
                type="button"
                aria-haspopup="true"
                aria-expanded={megaOpen}
                aria-label="Kategorije proizvoda"
                onClick={() => setMegaOpen((v) => !v)}
                className="p-1 -ml-1 text-charcoal hover:text-amber-600 focus-visible:outline-none"
              >
                <ChevronDown
                  className={cn('w-3.5 h-3.5 transition-transform duration-200', megaOpen && 'rotate-180')}
                  aria-hidden="true"
                />
              </button>
              <MegaMenu
                isOpen={megaOpen}
                onClose={() => setMegaOpen(false)}
                locale={locale}
              />
            </div>

            {/* Other nav links */}
            {desktopNavLinks.map((link) => (
              <Link
                key={link.key}
                href={link.href}
                className="px-3 py-2 rounded-lg text-sm font-medium text-charcoal hover:bg-gray-100 hover:text-amber-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right-side actions */}
          <div className="flex items-center gap-1.5 ml-auto">
            {/* Search trigger */}
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label={tHeader('search')}
              className="p-2 rounded-lg text-charcoal hover:bg-amber-50 hover:text-amber-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
            >
              <Search className="w-5 h-5" aria-hidden="true" />
            </button>

            {/* Language switcher — desktop only */}
            <LanguageSwitcher className="hidden md:flex" />

            {/* Cart badge */}
            <CartBadge count={cartItemCount} />
          </div>
        </div>
      </div>

      {/* Search overlay */}
      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* Mobile menu */}
      <MobileMenu
        isOpen={mobileOpen}
        onClose={closeMobileMenu}
        locale={locale}
      />
    </header>
  )
}
