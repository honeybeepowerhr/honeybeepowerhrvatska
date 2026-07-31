import React from 'react'

export const metadata = {
  title: 'Uvjeti Korištenja — Honey Bee Power',
  description: 'Opći uvjeti poslovanja i korištenja web trgovine Honey Bee Power.',
}

export default function TermsPage() {
  return (
    <div className="py-12 md:py-16">
      <div className="container mx-auto px-4 max-w-3xl space-y-6 text-gray-700 leading-relaxed text-sm">
        <h1 className="text-3xl font-black text-gray-900">Uvjeti Korištenja</h1>
        <p>Datum stupanja na snagu: 1. siječnja 2025.</p>

        <h2 className="text-lg font-bold text-gray-900 pt-4">1. Opće odredbe</h2>
        <p>
          Ovi Opći uvjeti poslovanja uređuju odnos između kupca i trgovačkog društva Planet Bio d.o.o., Krndijska ulica 4, 31500 Našice za kupovinu putem webshopa honeybeepower.hr.
        </p>

        <h2 className="text-lg font-bold text-gray-900 pt-4">2. Cijene i plaćanje</h2>
        <p>
          Sve cijene u trgovini izražene su u Eurima (€) i uključuju zakonski pripadajući PDV (25%). Plaćanje se vrši kreditnim/debitnim karticama (Stripe), pouzećem ili bankovnom doznakom.
        </p>

        <h2 className="text-lg font-bold text-gray-900 pt-4">3. Dostava</h2>
        <p>
          Dostava se vrši na području Republike Hrvatske i Europske Unije u suradnji s kurirskim službama (HP Express, GLS, Overseas). Besplatna dostava odnosi se na sve narudžbe iznad 50,00 €.
        </p>
      </div>
    </div>
  )
}
