import { defineType, defineField } from 'sanity'

export const categoryType = defineType({
  name: 'category',
  title: 'Kategorija',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Naziv',
      type: 'object',
      fields: [
        defineField({ name: 'hr', title: 'Hrvatski', type: 'string', validation: (r) => r.required() }),
        defineField({ name: 'en', title: 'English', type: 'string', validation: (r) => r.required() }),
        defineField({ name: 'de', title: 'Deutsch', type: 'string' }),
        defineField({ name: 'sl', title: 'Slovenščina', type: 'string' }),
      ],
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'name.hr' },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'description',
      title: 'Opis',
      type: 'object',
      fields: [
        defineField({ name: 'hr', title: 'Hrvatski', type: 'text' }),
        defineField({ name: 'en', title: 'English', type: 'text' }),
        defineField({ name: 'de', title: 'Deutsch', type: 'text' }),
        defineField({ name: 'sl', title: 'Slovenščina', type: 'text' }),
      ],
    }),
  ],
  preview: {
    select: { title: 'name.hr', subtitle: 'slug.current' },
  },
})
