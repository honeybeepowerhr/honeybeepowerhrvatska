import React from 'react'

export const metadata = {
  title: 'Politika Privatnosti — Honey Bee Power',
  description: 'Informacije o obradi osobnih podataka i GDPR pravima kupaca.',
}

export default function PrivacyPolicyPage() {
  return (
    <div className="py-12 md:py-16">
      <div className="container mx-auto px-4 max-w-3xl space-y-6 text-gray-700 leading-relaxed text-sm">
        <h1 className="text-3xl font-black text-gray-900">Politika Privatnosti</h1>

        <p>
          Planet Bio d.o.o. poštuje vašu privatnost i obvezuje se štititi vaše osobne podatke sukladno Općoj uredbi o zaštiti podataka (GDPR, EU 2016/679).
        </p>

        <h2 className="text-lg font-bold text-gray-900 pt-4">Prikupljanje podataka</h2>
        <p>
          Prikupljamo samo podatke nužne za obradu narudžbe: ime, prezime, adresu dostave, email adresu i telefonski broj.
        </p>

        <h2 className="text-lg font-bold text-gray-900 pt-4">Vaša prava</h2>
        <p>
          U svakom trenutku imate pravo zatražiti uvid, ispravak ili brisanje svojih osobnih podataka slanjem emaila na info@planetbio.hr.
        </p>
      </div>
    </div>
  )
}
