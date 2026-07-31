import React from 'react'
import { ActivitiesGallery } from '@/components/home/ActivitiesGallery'

export const metadata = {
  title: 'Sportske Aktivnosti & Događaji — Honey Bee Power',
  description: 'Pregled utrka, maratona i biciklističkih natjecanja na kojima je prisutan Honey Bee Power tim.',
}

export default function ActivitiesPage() {
  return (
    <div className="py-8">
      <ActivitiesGallery />
    </div>
  )
}
