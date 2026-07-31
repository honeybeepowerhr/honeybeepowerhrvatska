import React from 'react'
import Link from 'next/link'
import { ArrowLeft, ShoppingBag } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="py-20 flex items-center justify-center">
      <div className="text-center px-4 max-w-md">
        <div className="text-6xl font-black text-amber-500 mb-2">404</div>
        <h1 className="text-2xl font-extrabold text-gray-900 mb-3">Stranica nije pronađena</h1>
        <p className="text-sm text-gray-600 mb-8 leading-relaxed">
          Stranica koju tražite ne postoji ili je premještena. Pregledajte naš katalog i pronađite svoje omiljene proizvode.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl shadow">
            <Link href="/proizvodi">
              <ShoppingBag className="w-4 h-4 mr-2" />
              Vidi Katalog
            </Link>
          </Button>
          <Button asChild variant="outline" className="rounded-xl font-bold">
            <Link href="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Povratak na Početnu
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
