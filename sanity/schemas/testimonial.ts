import { defineField, defineType } from 'sanity'

/**
 * Testimonial schema
 * Requirements: 15.7
 *
 * Multilingual fields: quote
 * Rating: number 1–5
 */
export const testimonialType = defineType({
  name: 'testimonial',
  title: 'Testimonial',
  type: 'document',
  fields: [
    // ── Name ────────────────────────────────────────────────────────────────
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),

    // ── Photo (optional) ────────────────────────────────────────────────────
    defineField({
      name: 'photo',
      title: 'Photo',
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

    // ── Sport ───────────────────────────────────────────────────────────────
    defineField({
      name: 'sport',
      title: 'Sport',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),

    // ── Achievement ─────────────────────────────────────────────────────────
    defineField({
      name: 'achievement',
      title: 'Achievement',
      type: 'string',
      description: 'Key result or personal best (e.g. "Sub-3 marathon, 2024")',
    }),

    // ── Quote (multilingual) ────────────────────────────────────────────────
    defineField({
      name: 'quote',
      title: 'Quote',
      type: 'object',
      fields: [
        defineField({ name: 'hr', title: 'HR', type: 'text', rows: 3, validation: (Rule) => Rule.required() }),
        defineField({ name: 'en', title: 'EN', type: 'text', rows: 3 }),
        defineField({ name: 'de', title: 'DE', type: 'text', rows: 3 }),
        defineField({ name: 'sl', title: 'SL', type: 'text', rows: 3 }),
      ],
      validation: (Rule) => Rule.required(),
    }),

    // ── Rating (1–5) ────────────────────────────────────────────────────────
    defineField({
      name: 'rating',
      title: 'Rating',
      type: 'number',
      description: 'Rating from 1 (lowest) to 5 (highest)',
      validation: (Rule) => Rule.required().min(1).max(5).integer(),
    }),
  ],

  preview: {
    select: {
      title: 'name',
      subtitle: 'sport',
      media: 'photo',
    },
    prepare({ title, subtitle, media }) {
      return {
        title,
        subtitle,
        media,
      }
    },
  },
})
