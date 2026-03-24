'use client'

import Link from 'next/link'
import { Clock, MapPin, ChevronLeft, ShieldCheck, CheckCircle2 } from 'lucide-react'

export default function PaintWorkPage() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      <main className="mx-auto max-w-4xl px-4 py-10">
        <Link href="/services" className="flex items-center gap-2 text-blue-600 font-bold mb-8 hover:underline">
          <ChevronLeft className="w-5 h-5" />
          Back to Services
        </Link>

        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100">
          <div className="text-7xl mb-6">🎨</div>
          <h1 className="text-4xl font-black text-gray-900 mb-4 uppercase">Professional Paint Work</h1>
          <p className="text-xl text-gray-500 font-medium mb-8">
            Restore your car's showroom shine with our professional bodywork and painting services. High-quality finishes guaranteed.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="space-y-4">
              <h3 className="text-xl font-black uppercase tracking-tight">What's Included</h3>
              <ul className="space-y-3">
                {[
                  'Professional Scratch Repair',
                  'Panel Beating & Dent Removal',
                  'Full Body Respray',
                  'Color Matching Technology',
                  'High-Gloss Clear Coat',
                  'Waxing & Buffing'
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 font-medium text-gray-600">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
              <h3 className="text-xl font-black uppercase tracking-tight mb-4 text-blue-900">Service Details</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 font-bold uppercase text-sm">Estimated Time</span>
                  <span className="font-black text-gray-900">2-3 Days</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 font-bold uppercase text-sm">Base Price</span>
                  <span className="font-black text-blue-600 text-xl">Ksh 15,000</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 font-bold uppercase text-sm">Location</span>
                  <span className="font-black text-gray-900">Partner Garage</span>
                </div>
              </div>
              
              <Link 
                href="/services/request?type=Paint%20Work"
                className="w-full mt-8 bg-blue-600 text-white py-4 rounded-xl font-black hover:bg-blue-700 transition-all shadow-lg flex items-center justify-center gap-3"
              >
                <MapPin className="w-5 h-5" />
                Book This Service
              </Link>
            </div>
          </div>

          <div className="border-t pt-10">
            <h3 className="text-2xl font-black mb-6 uppercase">Quality Finish</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { title: 'Oven-Baked', desc: 'Superior durability and mirror-like finish.' },
                { title: 'OEM Paints', desc: 'We use original manufacturer paint codes.' },
                { title: 'Warranty', desc: '12-month warranty on paint peeling or fading.' }
              ].map((item) => (
                <div key={item.title}>
                  <h4 className="font-black uppercase text-blue-600 mb-1">{item.title}</h4>
                  <p className="text-gray-500 text-sm font-medium">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
