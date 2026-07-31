import { defineType, defineField } from 'sanity'

/**
 * Variant object type — used as inline objects inside product.variants[].
 * Also registered as a standalone object type so it can be referenced by name.
 */
export const variantType = defineType({
  name: 'variant',
  title: 'Varijanta',
  type: 'object',
  fields: [
    defineField({
      name: 'flavour',
      title: 'Okus',
      type: 'string',
      description: 'npr. "Jagoda", "Naranča", "Čokolada"',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'size',
      title: 'Veličina',
      type: 'string',
      description: 'npr. "40g", "500g", "700g"',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'sku',
      title: 'SKU',
      type: 'string',
      description: 'Jedinstveni identifikator zalihe',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'gtin',
      title: 'GTIN / EAN',
      type: 'string',
      description: 'Global Trade Item Number (barkod)',
    }),
    defineField({
      name: 'price',
      title: 'Cijena (centi)',
      type: 'number',
      description: 'Cijena u centima (EUR). Nadjačava basePrice proizvoda.',
      validation: (r) => r.required().min(0),
    }),
    defineField({
      name: 'stockLevel',
      title: 'Razina zalihe',
      type: 'number',
      description: 'Trenutna količina na zalihi.',
      validation: (r) => r.required().min(0).integer(),
    }),
    defineField({
      name: 'imageOverride',
      title: 'Slika varijante (override)',
      type: 'image',
      description: 'Ako je postavljeno, prikazuje se umjesto prve slike galerije.',
      options: { hotspot: true },
      fields: [
        defineField({ name: 'alt', type: 'string', title: 'Alt tekst' }),
      ],
    }),
  ],
  preview: {
    select: { title: 'flavour', subtitle: 'size' },
    prepare({ title, subtitle }: { title?: string; subtitle?: string }) {
      return { title: title ?? 'Varijanta', subtitle }
    },
  },
})
