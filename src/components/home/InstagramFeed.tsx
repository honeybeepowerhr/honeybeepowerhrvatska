'use client'

import React from 'react'
import Image from 'next/image'
import { Camera } from 'lucide-react'

const STATIC_INSTAGRAM_POSTS = [
  {
    id: '1',
    src: '/images/events/event-1.jpg',
    alt: 'Honey Bee Power na natjecanju',
    likes: 245,
  },
  {
    id: '2',
    src: '/images/events/event-4.jpg',
    alt: 'KBK Impact natjecanje uz Honey Bee Power',
    likes: 412,
  },
  {
    id: '3',
    src: '/images/events/event-8.jpg',
    alt: 'Honey Bee Power terenske aktivnosti',
    likes: 318,
  },
  {
    id: '4',
    src: '/images/events/event-11.jpg',
    alt: 'Promo pult maraton Vukovar',
    likes: 356,
  },
]

export function InstagramFeed() {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        <a
          href="https://www.instagram.com/planet__bio/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 font-bold text-gray-900 hover:text-amber-600 transition-colors"
        >
          <Camera className="w-5 h-5 text-amber-600" />
          <span>Pratite nas na Instagramu @planet__bio</span>
        </a>
        <a
          href="https://www.instagram.com/planet__bio/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs sm:text-sm font-semibold text-amber-600 hover:text-amber-700 underline"
        >
          #planetbio
        </a>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {STATIC_INSTAGRAM_POSTS.map((post) => (
          <a
            key={post.id}
            href="https://www.instagram.com/planet__bio/"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative aspect-square rounded-xl overflow-hidden bg-gray-100 border border-gray-200 block shadow-sm hover:shadow-md transition-all"
          >
            <Image
              src={post.src}
              alt={post.alt}
              width={300}
              height={300}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-semibold text-sm">
              <Camera className="w-6 h-6 mr-1" />
              <span>{post.likes}</span>
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}
