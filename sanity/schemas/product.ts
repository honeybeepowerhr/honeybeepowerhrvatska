import { defineType, defineField } from 'sanity'

/** Helper to create a multilingual string object with hr/en/de/sl subfields. */
const multilingualString = (name: string, title: string, required = false) =>
  defineField({
    name,
    title,
    type: 'object',
    fields: [
      defineField({ name: 'hr', title: 'Hrvatski',    type: 'string', validation: required ? (r) => r.required() : undefined }),
      defineField({ name: 'en', title: 'English',     type: 'string', validation: required ? (r) => r.required() : undefined }),
      defineField({ name: 'de', title: 'Deutsch',     type: 'string' }),
      defineField({ name: 'sl', title: 'Slovenščina', type: 'string' }),
    ],
    ...(required ? { validation: (r: any) => r.required() } : {}),
  })

/** Helper to create a multilingual text (textarea) object. */
const multilingualText = (name: string, title: string, required = false) =>
  defineField({
    name,
    title,
    type: 'object',
    fields: [
      defineField({ name: 'hr', title: 'Hrvatski',    type: 'text', validation: required ? (r) => r.required() : undefined }),
      defineField({ name: 'en', title: 'English',     type: 'text', validation: required ? (r) => r.required() : undefined }),
      defineField({ name: 'de', title: 'Deutsch',     type: 'text' }),
      defineField({ name: 'sl', title: 'Slovenščina', type: 'text' }),
    ],
    ...(required ? { validation: (r: any) => r.required() } : {}),
  })

export const productType = defineType({
  name: 'product',
  title: 'Proizvod',
  type: 'document',
  fields: [
    // ── Multilingual identifiers ───────────────────────────────────────
    multilingualString('name', 'Naziv', true),

    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'name.hr', maxLength: 96 },
      validation: (r) => r.required(),
    }),

    defineField({
      name: 'category',
      title: 'Kategorija',
      type: 'reference',
      to: [{ type: 'category' }],
      validation: (r) => r.required(),
    }),

    multilingualText('shortDescription', 'Kratki opis', true),

    // fullDescription is Portable Text (multilingual is handled via locale-wrapped blocks
    // or a simple object with per-locale array fields)
    defineField({
      name: 'fullDescription',
      title: 'Puni opis',
      type: 'object',
      fields: [
        defineField({ name: 'hr', title: 'Hrvatski',    type: 'array', of: [{ type: 'block' }] }),
        defineField({ name: 'en', title: 'English',     type: 'array', of: [{ type: 'block' }] }),
        defineField({ name: 'de', title: 'Deutsch',     type: 'array', of: [{ type: 'block' }] }),
        defineField({ name: 'sl', title: 'Slovenščina', type: 'array', of: [{ type: 'block' }] }),
      ],
    }),

    // ── Variants (inline objects) ──────────────────────────────────────
    defineField({
      name: 'variants',
      title: 'Varijante',
      type: 'array',
      of: [{ type: 'variant' }],
      validation: (r) => r.required().min(1),
    }),

    // ── Pricing ───────────────────────────────────────────────────────
    defineField({
      name: 'basePrice',
      title: 'Osnovna cijena (centi)',
      type: 'number',
      description: 'Osnovna cijena u centima (EUR). Može biti nadjačana po varijanti.',
      validation: (r) => r.required().min(0),
    }),

    defineField({
      name: 'compareAtPrice',
      title: 'Usporedna cijena (centi)',
      type: 'number',
      description: 'Cijena prije popusta. Prikaži prečrtano samo kada compareAtPrice > basePrice. Ostavi prazno ako nema promocije.',
      validation: (r) => r.min(0),
    }),

    // ── Media ─────────────────────────────────────────────────────────
    defineField({
      name: 'imageGallery',
      title: 'Galerija slika',
      type: 'array',
      of: [
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            defineField({ name: 'alt', type: 'string', title: 'Alt tekst' }),
          ],
        },
      ],
      validation: (r) => r.required().min(1),
    }),

    // ── Nutritional values ────────────────────────────────────────────
    defineField({
      name: 'nutritionalValues',
      title: 'Nutritivne vrijednosti',
      type: 'nutritionalTable',
    }),

    // ── Ingredients & allergens ───────────────────────────────────────
    multilingualText('ingredients', 'Sastojci'),

    defineField({
      name: 'allergens',
      title: 'Alergeni',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'Gluten',     value: 'gluten' },
          { title: 'Laktoza',    value: 'lactose' },
          { title: 'Jaja',       value: 'eggs' },
          { title: 'Orasi',      value: 'nuts' },
          { title: 'Kikiriki',   value: 'peanuts' },
          { title: 'Soja',       value: 'soy' },
          { title: 'Ribe',       value: 'fish' },
          { title: 'Školjkaši',  value: 'shellfish' },
          { title: 'Sezam',      value: 'sesame' },
          { title: 'Gorušica',   value: 'mustard' },
          { title: 'Sulfiti',    value: 'sulphites' },
        ],
      },
    }),

    // ── FAQ ──────────────────────────────────────────────────────────
    defineField({
      name: 'faq',
      title: 'Često postavljana pitanja',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'faqItem',
          title: 'FAQ stavka',
          fields: [
            defineField({
              name: 'question',
              title: 'Pitanje',
              type: 'object',
              fields: [
                defineField({ name: 'hr', title: 'Hrvatski',    type: 'string', validation: (r) => r.required() }),
                defineField({ name: 'en', title: 'English',     type: 'string' }),
                defineField({ name: 'de', title: 'Deutsch',     type: 'string' }),
                defineField({ name: 'sl', title: 'Slovenščina', type: 'string' }),
              ],
            }),
            defineField({
              name: 'answer',
              title: 'Odgovor',
              type: 'object',
              fields: [
                defineField({ name: 'hr', title: 'Hrvatski',    type: 'text', validation: (r) => r.required() }),
                defineField({ name: 'en', title: 'English',     type: 'text' }),
                defineField({ name: 'de', title: 'Deutsch',     type: 'text' }),
                defineField({ name: 'sl', title: 'Slovenščina', type: 'text' }),
              ],
            }),
          ],
          preview: {
            select: { title: 'question.hr' },
          },
        },
      ],
    }),

    // ── Status & flags ────────────────────────────────────────────────
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'Aktivan',    value: 'active' },
          { title: 'Neaktivan',  value: 'inactive' },
        ],
        layout: 'radio',
      },
      initialValue: 'active',
      validation: (r) => r.required(),
    }),

    defineField({
      name: 'eligibleForSubscription',
      title: 'Dostupan za pretplatu',
      type: 'boolean',
      initialValue: false,
    }),

    defineField({
      name: 'isBundleItem',
      title: 'Može biti dio paketa',
      type: 'boolean',
      initialValue: false,
    }),

    // ── SEO ──────────────────────────────────────────────────────────
    multilingualString('seoTitle', 'SEO naslov'),
    multilingualText('seoDescription', 'SEO opis'),
  ],

  preview: {
    select: {
      title:    'name.hr',
      subtitle: 'status',
      media:    'imageGallery.0',
    },
    prepare({ title, subtitle, media }: { title?: string; subtitle?: string; media?: any }) {
      return {
        title:    title ?? 'Proizvod',
        subtitle: subtitle === 'active' ? '✅ Aktivan' : '🚫 Neaktivan',
        media:    media as any,
      }
    },
  },
})
