# Seed podatci — Honey Bee Power Webshop

Direktorij `sanity/seeds/` sadrži strukturirane TypeScript objekte koji opisuju
početne podatke za Sanity Studio. **Ova datoteka nije skripta koja automatski
upisuje u bazu** — podaci su namijenjeni ručnom unosu ili budućem CLI importu.

---

## Što se nalazi u `seedData.ts`

| Export | Tip | Opis |
|---|---|---|
| `categorySeeds` | `CategorySeed[]` | 3 kategorije (gelovi, izotonici, whey) |
| `productSeeds` | `ProductSeed[]` | 3 proizvoda s varijantama i nutritivnim vrijednostima |
| `blogPostSeeds` | `BlogPostSeed[]` | 8 blog skeleton-a |

---

## Ručni import kroz Sanity Studio

### 1. Pokrenite Sanity Studio lokalno

```bash
cd sanity   # ili korijen projekta, ovisno o konfiguraciji
npx sanity dev
```

Studio je dostupan na `http://localhost:3333`.

### 2. Unesite kategorije

Kategorije je potrebno unijeti **prve** jer ih proizvodi referenciraju.

1. U bočnom izborniku otvorite **Kategorija**.
2. Kliknite **+ New Kategorija**.
3. Unesite podatke iz `categorySeeds` za svaku od 3 kategorije:
   - `energetski-gelovi` → Energetski gelovi / Energy Gels
   - `izotonicni-napitci` → Izotonični napitci / Isotonic Drinks
   - `whey-proteini` → Whey proteini / Whey Proteins
4. **Spremi i objavi** svaku kategoriju. Zabilježite generiraju se `_id` vrijednosti
   (prikazane u URL-u: `…/category,<ID>`).

### 3. Unesite proizvode

1. Otvorite **Proizvod** → **+ New Proizvod**.
2. Za svaki objekt iz `productSeeds` ispunite polja:
   - **Naziv** (hr/en)
   - **Slug** (generirajte iz hr naziva ili upišite vrijednost `slug.current`)
   - **Kategorija** — povežite na prethodno kreiranu kategoriju prema `categorySlug`
   - **Kratki opis** (hr)
   - **Osnovna cijena** — vrijednost u centima (npr. `290` = 2,90 €)
   - **Varijante** — dodajte jednu po jednu prema nizu `variants`
   - **Nutritivna tablica** — ispunite `servingSize`, `per100g` i `perServing`
   - **Sastojci** (hr)
   - **Alergeni** — odaberite iz liste (npr. `lactose` za Whey Protein)
   - **Status** → Aktivan
   - **Dostupan za pretplatu** → uključite ako `eligibleForSubscription: true`
3. Dodajte barem jednu sliku u galeriju (obavezno polje prema shemi).
4. **Spremi i objavi**.

### 4. Unesite blog postove

1. Otvorite **Blog Post** → **+ New Blog Post**.
2. Za svaki objekt iz `blogPostSeeds` ispunite:
   - **Title** (hr)
   - **Slug** (prema `slug.current`)
   - **Author** → `HBP Tim`
   - **Category**
   - **Published At** → datum iz `publishedAt`
3. Tijelo posta (`body`) možete ostaviti praznim — skeleton-i su namijenjeni
   budućem pisanju sadržaja.
4. **Spremi i objavi**.

---

## Napomene o cijenama

Sve cijene se pohranjuju **u centima (EUR)**:

| Vrijednost u seedu | Prikaz na stranici |
|---|---|
| `290` | 2,90 € |
| `190` | 1,90 € |
| `1490` | 14,90 € |
| `4490` | 44,90 € |
| `390` | 3,90 € |

---

## Budući CLI import (TODO)

Kada bude implementiran CLI alat za automatski import, koristit će se Sanity
Client (`@sanity/client`) i izvoz iz ove datoteke:

```ts
import { categorySeeds, productSeeds, blogPostSeeds } from './seedData'
import { createClient } from '@sanity/client'

const client = createClient({ projectId: '...', dataset: 'production', token: '...' })

for (const doc of categorySeeds) {
  await client.create(doc)
}
// itd.
```

Za sad, preporučen je ručni unos opisano gore.
