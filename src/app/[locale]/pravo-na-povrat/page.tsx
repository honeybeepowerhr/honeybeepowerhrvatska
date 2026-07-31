import React from 'react'

export const metadata = {
  title: 'Pravo na Povrat i Reklamacije — Honey Bee Power',
  description: 'Upute i uvjeti za jednostrani raskid ugovora i povrat robe u roku 14 dana.',
}

export default function ReturnsPage() {
  return (
    <div className="py-12 md:py-16">
      <div className="container mx-auto px-4 max-w-3xl space-y-6 text-gray-700 text-sm leading-relaxed">
        <h1 className="text-3xl font-black text-gray-900">Pravo na Povrat i Reklamacije</h1>

        <p>
          Sukladno Zakonu o zaštiti potrošača, kupac ima pravo na jednostrani raskid ugovora u roku od 14 dana od dana preuzimanja paketa, bez navođenja razloga.
        </p>

        <h2 className="text-lg font-bold text-gray-900 pt-4">Uvjeti za Povrat</h2>
        <p>
          Proizvod mora biti u originalnoj, neoštećenoj ambalaži i neotvoren (zbog zdravstvenih i higijenskih razloga prehrambenih artikala).
        </p>

        <h2 className="text-lg font-bold text-gray-900 pt-4">Postupak Povrata</h2>
        <ol className="list-decimal pl-5 space-y-1">
          <li>Pošaljite obavijest o povratu na email: info@planetbio.hr</li>
          <li>Zakirajte artikl i pošaljite ga na adresu: Planet Bio d.o.o., Krndijska ulica 4, 31500 Našice</li>
          <li>Nakon zaprimanja i pregleda artikla, izvršit ćemo povrat sredstava u roku od 7 radnih dana.</li>
        </ol>
      </div>
    </div>
  )
}
