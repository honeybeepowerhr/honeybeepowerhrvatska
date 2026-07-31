import { defineArrayMember, defineField, defineType } from 'sanity'

/**
 * Bundle schema
 * Requirements: 15.8 (bundles)
 *
 * Multilingual fields: name, description (Portable Text)
 * BundleItem: product (reference), variantKey (string — SKU, since variants are
 *   embedded objects not separate documents), quantity (number)
 */
export const bundleType = defineType({
  name: 'bundle',
  title: 'Bundle',
  type: 'document',
  fields: [
    // ── Name (multilingual) ─────────────────────────────────────────────────
    defineField({
      name: 'name',
      title: 'Name',
      type: 'object',
      fields: [
        defineField({ name: 'hr', title: 'HR', type: 'string', validation: (Rule) => Rule.required() }),
        defineField({ name: 'en', title: 'EN', type: 'string' }),
        defineField({ name: 'de', title: 'DE', type: 'string' }),
        defineField({ name: 'sl', title: 'SL', type: 'string' }),
      ],
      validation: (Rule) => Rule.required(),
    }),

    // ── Slug ────────────────────────────────────────────────────────────────
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name.hr',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),

    // ── Products (BundleItem[]) ──────────────────────────────────────────────
    defineField({
      name: 'products',
      title: 'Products',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'bundleItem',
          title: 'Bundle Item',
          fields: [
            defineField({
              name: 'product',
              title: 'Product',
              type: 'reference',
              to: [{ type: 'product' }],
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'variantKey',
              title: 'Variant Key (SKU)',
              type: 'string',
              description:
                'The SKU of the selected variant. Variants are embedded objects, not separate documents.',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'quantity',
              title: 'Quantity',
              type: 'number',
              initialValue: 1,
              validation: (Rule) => Rule.required().min(1).integer(),
            }),
          ],
          preview: {
            select: {
              productName: 'product.name.hr',
              variantKey: 'variantKey',
              quantity: 'quantity',
            },
            prepare({ productName, variantKey, quantity }) {
              return {
                title: productName ?? 'Product',
                subtitle: `SKU: ${variantKey ?? '—'} · Qty: ${quantity ?? 1}`,
              }
            },
          },
        }),
      ],
    }),

    // ── Bundle Price ────────────────────────────────────────────────────────
    defineField({
      name: 'bundlePrice',
      title: 'Bundle Price (in cents)',
      type: 'number',
      description: 'Total bundle price in cents (e.g. 4999 = 49.99 EUR)',
      validation: (Rule) => Rule.required().min(0).integer(),
    }),

    // ── Image Gallery ───────────────────────────────────────────────────────
    defineField({
      name: 'imageGallery',
      title: 'Image Gallery',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'image',
          options: { hotspot: true },
          fields: [
            defineField({
              name: 'alt',
              title: 'Alt Text',
              type: 'string',
            }),
          ],
        }),
      ],
    }),

    // ── Description (Portable Text) ─────────────────────────────────────────
    defineField({
      name: 'description',
      title: 'Description',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'H2', value: 'h2' },
            { title: 'H3', value: 'h3' },
          ],
          lists: [
            { title: 'Bullet', value: 'bullet' },
            { title: 'Numbered', value: 'number' },
          ],
          marks: {
            decorators: [
              { title: 'Strong', value: 'strong' },
              { title: 'Emphasis', value: 'em' },
            ],
          },
        }),
        defineArrayMember({
          type: 'image',
          options: { hotspot: true },
          fields: [
            defineField({ name: 'alt', title: 'Alt Text', type: 'string' }),
          ],
        }),
      ],
    }),
  ],

  preview: {
    select: {
      title: 'name.hr',
      media: 'imageGallery.0',
    },
  },
})
