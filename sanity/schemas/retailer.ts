import { defineField, defineType } from 'sanity'

/**
 * Retailer schema
 * Requirements: 15.8
 *
 * coordinates: { lat: number, lng: number }
 * type enum: 'shop' | 'pharmacy' | 'online'
 */
export const retailerType = defineType({
  name: 'retailer',
  title: 'Retailer',
  type: 'document',
  fields: [
    // ── Name ────────────────────────────────────────────────────────────────
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),

    // ── Address ─────────────────────────────────────────────────────────────
    defineField({
      name: 'address',
      title: 'Address',
      type: 'string',
    }),

    // ── City ────────────────────────────────────────────────────────────────
    defineField({
      name: 'city',
      title: 'City',
      type: 'string',
    }),

    // ── Coordinates ─────────────────────────────────────────────────────────
    defineField({
      name: 'coordinates',
      title: 'Coordinates',
      type: 'object',
      fields: [
        defineField({
          name: 'lat',
          title: 'Latitude',
          type: 'number',
          validation: (Rule) => Rule.min(-90).max(90),
        }),
        defineField({
          name: 'lng',
          title: 'Longitude',
          type: 'number',
          validation: (Rule) => Rule.min(-180).max(180),
        }),
      ],
    }),

    // ── Type ────────────────────────────────────────────────────────────────
    defineField({
      name: 'type',
      title: 'Type',
      type: 'string',
      options: {
        list: [
          { title: 'Shop', value: 'shop' },
          { title: 'Pharmacy', value: 'pharmacy' },
          { title: 'Online', value: 'online' },
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),

    // ── Logo (optional) ─────────────────────────────────────────────────────
    defineField({
      name: 'logo',
      title: 'Logo',
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

  preview: {
    select: {
      title: 'name',
      subtitle: 'city',
      media: 'logo',
    },
    prepare({ title, subtitle, media }) {
      return {
        title,
        subtitle: subtitle ? `📍 ${subtitle}` : undefined,
        media,
      }
    },
  },
})
