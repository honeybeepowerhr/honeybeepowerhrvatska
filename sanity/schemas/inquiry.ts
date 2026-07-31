import { defineArrayMember, defineField, defineType } from 'sanity'

/**
 * Inquiry schema — a cart submitted as a request for a quote instead of a paid
 * order. The owner reviews these in Sanity Studio and replies to the customer
 * by email with final pricing and payment instructions.
 */
export const inquiryType = defineType({
  name: 'inquiry',
  title: 'Upit',
  type: 'document',
  fields: [
    defineField({
      name: 'inquiryType',
      title: 'Vrsta upita',
      type: 'string',
      options: {
        list: [
          { title: 'Upit za ponudu (Košarica)', value: 'narudzba' },
          { title: 'Kontakt poruka', value: 'kontakt' },
          { title: 'B2B zahtjev za suradnju', value: 'b2b' },
        ],
        layout: 'radio',
      },
      initialValue: 'narudzba',
    }),
    defineField({
      name: 'orderNumber',
      title: 'Broj upita',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'Novo', value: 'novo' },
          { title: 'Odgovoreno', value: 'odgovoreno' },
          { title: 'Zatvoreno', value: 'zatvoreno' },
        ],
        layout: 'radio',
      },
      initialValue: 'novo',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'customer',
      title: 'Kupac / Pošiljatelj',
      type: 'object',
      fields: [
        defineField({ name: 'fullName', title: 'Ime i prezime', type: 'string', validation: (Rule) => Rule.required() }),
        defineField({ name: 'email', title: 'E-mail', type: 'string', validation: (Rule) => Rule.required() }),
        defineField({ name: 'phone', title: 'Telefon', type: 'string' }),
      ],
    }),
    defineField({
      name: 'shippingAddress',
      title: 'Adresa dostave',
      type: 'object',
      fields: [
        defineField({ name: 'address', title: 'Ulica i kućni broj', type: 'string' }),
        defineField({ name: 'city', title: 'Grad', type: 'string' }),
        defineField({ name: 'postalCode', title: 'Poštanski broj', type: 'string' }),
        defineField({ name: 'country', title: 'Država', type: 'string' }),
      ],
    }),
    defineField({
      name: 'items',
      title: 'Stavke',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'inquiryItem',
          title: 'Stavka',
          fields: [
            defineField({ name: 'name', title: 'Naziv proizvoda', type: 'string' }),
            defineField({ name: 'variantLabel', title: 'Varijanta', type: 'string' }),
            defineField({ name: 'quantity', title: 'Količina', type: 'number' }),
            defineField({ name: 'unitPrice', title: 'Okvirna cijena (u centima)', type: 'number' }),
            defineField({ name: 'imageSrc', title: 'Slika (URL)', type: 'string' }),
          ],
          preview: {
            select: { title: 'name', subtitle: 'variantLabel', quantity: 'quantity' },
            prepare({ title, subtitle, quantity }) {
              return { title, subtitle: `${subtitle ?? ''} × ${quantity ?? 1}` }
            },
          },
        }),
      ],
    }),
    defineField({
      name: 'notes',
      title: 'Poruka / Napomena',
      type: 'text',
    }),
    defineField({
      name: 'createdAt',
      title: 'Vrijeme zaprimanja',
      type: 'datetime',
      validation: (Rule) => Rule.required(),
    }),
  ],
  orderings: [
    {
      title: 'Najnovije prvo',
      name: 'createdAtDesc',
      by: [{ field: 'createdAt', direction: 'desc' }],
    },
  ],
  preview: {
    select: {
      title: 'customer.fullName',
      orderNumber: 'orderNumber',
      status: 'status',
      inquiryType: 'inquiryType',
    },
    prepare({ title, orderNumber, status, inquiryType }) {
      const typeLabel =
        inquiryType === 'b2b'
          ? 'B2B'
          : inquiryType === 'kontakt'
          ? 'Kontakt'
          : 'Narudžba'
      return {
        title: title ? `${title} (${typeLabel})` : `Upit (${typeLabel})`,
        subtitle: `${orderNumber ?? ''} · ${status ?? 'novo'}`,
      }
    },
  },
})
