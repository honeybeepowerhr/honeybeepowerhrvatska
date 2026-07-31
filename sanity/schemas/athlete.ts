import { defineArrayMember, defineField, defineType } from 'sanity'

/**
 * Athlete schema
 * Requirements: 15.5
 *
 * Multilingual fields: biography, quote
 */
export const athleteType = defineType({
  name: 'athlete',
  title: 'Athlete',
  type: 'document',
  fields: [
    // ── Name ────────────────────────────────────────────────────────────────
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),

    // ── Photo ───────────────────────────────────────────────────────────────
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
      validation: (Rule) => Rule.required(),
    }),

    // ── Sport ───────────────────────────────────────────────────────────────
    defineField({
      name: 'sport',
      title: 'Sport',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),

    // ── Discipline ──────────────────────────────────────────────────────────
    defineField({
      name: 'discipline',
      title: 'Discipline',
      type: 'string',
    }),

    // ── Key Results ─────────────────────────────────────────────────────────
    defineField({
      name: 'keyResults',
      title: 'Key Results',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
    }),

    // ── Biography (multilingual) ────────────────────────────────────────────
    defineField({
      name: 'biography',
      title: 'Biography',
      type: 'object',
      fields: [
        defineField({ name: 'hr', title: 'HR', type: 'text', rows: 4 }),
        defineField({ name: 'en', title: 'EN', type: 'text', rows: 4 }),
        defineField({ name: 'de', title: 'DE', type: 'text', rows: 4 }),
        defineField({ name: 'sl', title: 'SL', type: 'text', rows: 4 }),
      ],
    }),

    // ── Quote (multilingual) ────────────────────────────────────────────────
    defineField({
      name: 'quote',
      title: 'Quote',
      type: 'object',
      fields: [
        defineField({ name: 'hr', title: 'HR', type: 'text', rows: 2 }),
        defineField({ name: 'en', title: 'EN', type: 'text', rows: 2 }),
        defineField({ name: 'de', title: 'DE', type: 'text', rows: 2 }),
        defineField({ name: 'sl', title: 'SL', type: 'text', rows: 2 }),
      ],
    }),
  ],

  preview: {
    select: {
      title: 'name',
      subtitle: 'sport',
      media: 'photo',
    },
  },
})
