import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { Locale } from '@/types'

/**
 * Merges Tailwind CSS class names intelligently.
 * Combines clsx (conditional class logic) with tailwind-merge (deduplication).
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const FLAVOUR_MAP: Record<string, Record<Locale, string>> = {
  naranca: { hr: 'Naranča', en: 'Orange', de: 'Orange', sl: 'Pomaranča', pl: 'Pomarańcza' },
  naranča: { hr: 'Naranča', en: 'Orange', de: 'Orange', sl: 'Pomaranča', pl: 'Pomarańcza' },
  orange: { hr: 'Naranča', en: 'Orange', de: 'Orange', sl: 'Pomaranča', pl: 'Pomarańcza' },
  limun: { hr: 'Limun', en: 'Lemon', de: 'Zitrone', sl: 'Limona', pl: 'Cytryna' },
  lemon: { hr: 'Limun', en: 'Lemon', de: 'Zitrone', sl: 'Limona', pl: 'Cytryna' },
  malina: { hr: 'Šumska malina', en: 'Forest Raspberry', de: 'Waldhimbeere', sl: 'Gozdna malina', pl: 'Malina leśna' },
  'šumska malina': { hr: 'Šumska malina', en: 'Forest Raspberry', de: 'Waldhimbeere', sl: 'Gozdna malina', pl: 'Malina leśna' },
  'sumska malina': { hr: 'Šumska malina', en: 'Forest Raspberry', de: 'Waldhimbeere', sl: 'Gozdna malina', pl: 'Malina leśna' },
  raspberry: { hr: 'Šumska malina', en: 'Forest Raspberry', de: 'Waldhimbeere', sl: 'Gozdna malina', pl: 'Malina leśna' },
  cokolada: { hr: 'Čokolada', en: 'Chocolate', de: 'Schokolade', sl: 'Čokolada', pl: 'Czekolada' },
  čokolada: { hr: 'Čokolada', en: 'Chocolate', de: 'Schokolade', sl: 'Čokolada', pl: 'Czekolada' },
  chocolate: { hr: 'Čokolada', en: 'Chocolate', de: 'Schokolade', sl: 'Čokolada', pl: 'Czekolada' },
  natur: { hr: 'Prirodno', en: 'Natural', de: 'Natur', sl: 'Naravno', pl: 'Naturalny' },
  natural: { hr: 'Prirodno', en: 'Natural', de: 'Natur', sl: 'Naravno', pl: 'Naturalny' },
  prirodno: { hr: 'Prirodno', en: 'Natural', de: 'Natur', sl: 'Naravno', pl: 'Naturalny' },
}

export function translateFlavour(flavour: string, locale: Locale = 'hr'): string {
  if (!flavour) return flavour
  const key = flavour.trim().toLowerCase()
  const match = FLAVOUR_MAP[key]
  if (match && match[locale]) {
    return match[locale]
  }
  return flavour
}
