'use client'

import React, { useState } from 'react'
import { CheckCircle2, Loader2, Send, AlertCircle } from 'lucide-react'

export default function ContactForm() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    message: '',
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!formData.fullName.trim()) {
      setError('Molimo unesite vaše ime i prezime.')
      return
    }

    if (!formData.email.trim() || !formData.email.includes('@')) {
      setError('Molimo unesite valjanu e-mail adresu.')
      return
    }

    if (!formData.message.trim()) {
      setError('Molimo unesite poruku.')
      return
    }

    setIsSubmitting(true)

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (!res.ok || !data.success) {
        setError(data.error || 'Slanje upita nije uspjelo. Pokušajte ponovno.')
        return
      }

      setIsSuccess(true)
      setFormData({ fullName: '', email: '', phone: '', message: '' })
    } catch {
      setError('Došlo je do pogreške prilikom povezivanja. Provjerite mrežu i pokušajte ponovno.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm space-y-4">
      <h2 className="text-xl font-bold text-gray-900">Pošaljite Poruku</h2>

      {isSuccess ? (
        <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start gap-4 text-emerald-900">
          <CheckCircle2 className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-bold text-lg">Hvala vam na javljanju!</h3>
            <p className="text-sm text-emerald-800 mt-1 leading-relaxed">
              Vaš upit je uspješno zaprimljen i proslijeđen našem timu. Odgovorit ćemo vam u najkraćem mogućem roku.
            </p>
            <button
              type="button"
              onClick={() => setIsSuccess(false)}
              className="mt-4 text-xs font-bold text-emerald-700 underline hover:text-emerald-900"
            >
              Pošalji novu poruku
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700 text-sm">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label htmlFor="contact-fullName" className="block text-xs font-bold text-gray-700 uppercase mb-1">
              Ime i Prezime *
            </label>
            <input
              id="contact-fullName"
              type="text"
              required
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              className="w-full p-3 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-amber-500 outline-none"
              placeholder="Vaše ime i prezime"
            />
          </div>

          <div>
            <label htmlFor="contact-email" className="block text-xs font-bold text-gray-700 uppercase mb-1">
              Email Adresa *
            </label>
            <input
              id="contact-email"
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full p-3 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-amber-500 outline-none"
              placeholder="vas@email.com"
            />
          </div>

          <div>
            <label htmlFor="contact-phone" className="block text-xs font-bold text-gray-700 uppercase mb-1">
              Broj Telefona (opcionalno)
            </label>
            <input
              id="contact-phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full p-3 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-amber-500 outline-none"
              placeholder="+385 91 123 4567"
            />
          </div>

          <div>
            <label htmlFor="contact-message" className="block text-xs font-bold text-gray-700 uppercase mb-1">
              Poruka *
            </label>
            <textarea
              id="contact-message"
              required
              rows={4}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full p-3 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-amber-500 outline-none resize-none"
              placeholder="Kako vam možemo pomoći?"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-slate-950 font-extrabold rounded-xl transition text-sm flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Šaljem...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Pošalji Upit
              </>
            )}
          </button>
        </form>
      )}
    </div>
  )
}
