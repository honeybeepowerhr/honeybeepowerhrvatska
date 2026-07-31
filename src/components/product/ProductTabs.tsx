'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { Locale, NutritionalRow, NutritionalTable, ProductFull } from '@/types'

// ─── Props ────────────────────────────────────────────────────────────────────

export interface ProductTabsProps {
  product: ProductFull
  locale: Locale
}

// ─── Portable Text fallback ───────────────────────────────────────────────────
// @portabletext/react is not installed yet; render a readable plain-text
// fallback by extracting the "text" spans from Portable Text blocks.

type PortableTextSpan = {
  _type: 'span'
  text: string
  marks?: string[]
}

type PortableTextBlock = {
  _type: 'block'
  style?: string
  children?: PortableTextSpan[]
}

function isPortableTextBlock(value: unknown): value is PortableTextBlock {
  return (
    typeof value === 'object' &&
    value !== null &&
    (value as Record<string, unknown>)['_type'] === 'block'
  )
}

function extractPlainText(blocks: unknown): string {
  if (typeof blocks === 'string') return blocks
  if (!Array.isArray(blocks)) return ''

  return blocks
    .filter(isPortableTextBlock)
    .map((block) =>
      (block.children ?? [])
        .map((span) => span.text)
        .join(''),
    )
    .join('\n\n')
}

function DescriptionContent({ value }: { value: unknown }) {
  const text = extractPlainText(value)

  if (!text) {
    return (
      <p className="text-sm text-gray-500 italic">Opis nije dostupan.</p>
    )
  }

  return (
    <div className="prose prose-sm max-w-none text-charcoal">
      {text.split('\n\n').map((paragraph, idx) => (
        <p key={idx} className="mb-3 last:mb-0 leading-relaxed">
          {paragraph}
        </p>
      ))}
    </div>
  )
}

// ─── Nutritional table ────────────────────────────────────────────────────────

interface NutritionalTableProps {
  data: NutritionalTable
}

interface NutrientRowDef {
  label: string
  unit: string
  key: keyof NutritionalRow
  indent?: boolean
  hideIfNull?: boolean
}

const NUTRIENT_ROWS: NutrientRowDef[] = [
  { label: 'Energija',                    unit: 'kcal', key: 'energyKcal' },
  { label: 'Energija',                    unit: 'kJ',   key: 'energyKj' },
  { label: 'Ugljikohidrati',              unit: 'g',    key: 'carbohydrates' },
  { label: 'od toga šećeri',              unit: 'g',    key: 'sugars',       indent: true },
  { label: 'Bjelančevine',                unit: 'g',    key: 'protein' },
  { label: 'Masti',                       unit: 'g',    key: 'fat' },
  { label: 'od toga zasićene masnoće',    unit: 'g',    key: 'saturatedFat', indent: true },
  { label: 'Sol',                         unit: 'g',    key: 'salt' },
  { label: 'Natrij',                      unit: 'mg',   key: 'sodium' },
  { label: 'Kofein',                      unit: 'mg',   key: 'caffeine',     hideIfNull: true },
]

function formatNutrientValue(
  value: number | null,
  unit: string,
): string {
  if (value === null) return '—'
  // Sodium is already in mg; others are in their natural unit
  return `${value}\u202F${unit}`
}

function NutritionalTableContent({ data }: NutritionalTableProps) {
  const visibleRows = NUTRIENT_ROWS.filter(
    (row) => !(row.hideIfNull && data.per100g[row.key] === null),
  )

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="min-w-full text-sm">
        <caption className="px-4 py-2 text-left text-xs text-gray-500 font-normal">
          Veličina serviranja: {data.servingSize}
        </caption>
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            <th
              scope="col"
              className="px-4 py-2.5 text-left font-semibold text-charcoal"
            >
              Hranjiva vrijednost
            </th>
            <th
              scope="col"
              className="px-4 py-2.5 text-right font-semibold text-charcoal whitespace-nowrap"
            >
              Na 100&nbsp;g
            </th>
            <th
              scope="col"
              className="px-4 py-2.5 text-right font-semibold text-charcoal whitespace-nowrap"
            >
              Po obroku ({data.servingSize})
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {visibleRows.map((row) => (
            <tr
              key={`${row.key}-${row.unit}`}
              className="even:bg-gray-50 hover:bg-amber-50 transition-colors"
            >
              <th
                scope="row"
                className={`px-4 py-2 text-left font-normal text-charcoal${row.indent ? ' pl-8 text-gray-600' : ''}`}
              >
                {row.label}
              </th>
              <td className="px-4 py-2 text-right tabular-nums text-gray-700">
                {formatNutrientValue(data.per100g[row.key], row.unit)}
              </td>
              <td className="px-4 py-2 text-right tabular-nums text-gray-700">
                {formatNutrientValue(data.perServing[row.key], row.unit)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ─── Static content sections ──────────────────────────────────────────────────

function HowToUseContent() {
  return (
    <div className="space-y-3 text-sm text-charcoal leading-relaxed">
      <p>
        Konzumirajte 1–2 gela po satu trčanja. Uzimajte s vodom.
      </p>
      <ul className="list-disc list-inside space-y-1 text-gray-700">
        <li>Otvorite pakiranje neposredno prije konzumacije.</li>
        <li>Popijte s najmanje 150&nbsp;ml vode kako biste olakšali apsorpciju.</li>
        <li>Preporuča se uzimanje 15–30 minuta prije napora i svaki sat aktivnosti.</li>
        <li>Nije zamjena za uravnoteženu prehranu.</li>
      </ul>
    </div>
  )
}

function ShippingContent() {
  return (
    <div className="space-y-4 text-sm text-charcoal leading-relaxed">
      <section>
        <h3 className="font-semibold mb-1">Dostava</h3>
        <p className="text-gray-700">
          Standardna dostava: <strong>1–2 radna dana</strong>. Narudžbe primljene do 14:00
          šaljemo isti dan (radnim danom).
        </p>
        <p className="mt-1 text-gray-700">
          Besplatna dostava za narudžbe iznad <strong>50&nbsp;€</strong>.
        </p>
      </section>
      <section>
        <h3 className="font-semibold mb-1">Povrat i zamjena</h3>
        <p className="text-gray-700">
          Imate pravo na povrat u roku od <strong>14 dana</strong> od primitka pošiljke, bez
          navođenja razloga, u skladu s važećim propisima o zaštiti potrošača.
        </p>
        <p className="mt-1 text-gray-700">
          Povrat je moguć isključivo za neotvorene i neoštećene proizvode. Troškove povrata
          snosi kupac, osim u slučaju pogrešno isporučenog ili oštećenog proizvoda.
        </p>
      </section>
    </div>
  )
}

function ReviewsPlaceholder() {
  return (
    <p className="text-sm text-gray-500 italic py-2">
      Recenzije se učitavaju…
    </p>
  )
}

// ─── Tab definitions ──────────────────────────────────────────────────────────

const TAB_VALUES = [
  'opis',
  'nutritivne-vrijednosti',
  'kako-koristiti',
  'recenzije',
  'dostava',
] as const

type TabValue = typeof TAB_VALUES[number]

const TAB_LABELS: Record<TabValue, string> = {
  'opis':                  'Opis',
  'nutritivne-vrijednosti':'Nutritivne vrijednosti',
  'kako-koristiti':        'Kako koristiti',
  'recenzije':             'Recenzije',
  'dostava':               'Dostava i povrat',
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function ProductTabs({ product, locale }: ProductTabsProps) {
  const description = (product.fullDescription as Record<string, unknown>)?.[locale]
    ?? (product.fullDescription as Record<string, unknown>)?.['hr']
    ?? product.fullDescription

  return (
    <Tabs defaultValue="opis" className="w-full">
      {/* Tab list — scrollable on small screens */}
      <div className="overflow-x-auto">
        <TabsList
          className="
            h-auto w-max min-w-full flex flex-nowrap
            gap-1 rounded-none border-b border-gray-200
            bg-transparent p-0
          "
          aria-label="Informacije o proizvodu"
        >
          {TAB_VALUES.map((value) => (
            <TabsTrigger
              key={value}
              value={value}
              className="
                rounded-none border-b-2 border-transparent px-4 py-3
                text-sm font-medium text-gray-600 whitespace-nowrap
                data-[state=active]:border-amber-500
                data-[state=active]:text-amber-600
                data-[state=active]:bg-transparent
                data-[state=active]:shadow-none
                hover:text-charcoal transition-colors
              "
            >
              {TAB_LABELS[value]}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>

      {/* ── Opis ───────────────────────────────────────────────────── */}
      <TabsContent value="opis" className="pt-5">
        <DescriptionContent value={description} />
      </TabsContent>

      {/* ── Nutritivne vrijednosti ──────────────────────────────────── */}
      <TabsContent value="nutritivne-vrijednosti" className="pt-5">
        <NutritionalTableContent data={product.nutritionalValues} />
      </TabsContent>

      {/* ── Kako koristiti ─────────────────────────────────────────── */}
      <TabsContent value="kako-koristiti" className="pt-5">
        <HowToUseContent />
      </TabsContent>

      {/* ── Recenzije ──────────────────────────────────────────────── */}
      <TabsContent value="recenzije" className="pt-5">
        <ReviewsPlaceholder />
      </TabsContent>

      {/* ── Dostava i povrat ────────────────────────────────────────── */}
      <TabsContent value="dostava" className="pt-5">
        <ShippingContent />
      </TabsContent>
    </Tabs>
  )
}
