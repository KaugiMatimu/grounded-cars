'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Plus, MessageCircle, Car, X, Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useCompare } from '@/components/providers/CompareProvider'

const comparisonAttributes = [
  { label: 'PRICE', key: 'price', format: (v: any) => v ? `KES ${v.toLocaleString()}` : 'N/A' },
  { label: 'CONDITION', key: 'condition' },
  { label: 'MAKE', key: 'make' },
  { label: 'MODEL', key: 'model' },
  { label: 'YEAR', key: 'year' },
  { label: 'MILEAGE', key: 'mileage', format: (v: any) => v ? `${v.toLocaleString()} km` : 'N/A' },
  { label: 'TRANSMISSION', key: 'transmission' },
  { label: 'FUEL TYPE', key: 'fuelType' },
  { label: 'LOCATION', key: 'location' },
]

export default function ComparePage() {
  const { compareIds, removeFromCompare } = useCompare()
  const [vehicles, setVehicles] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function fetchVehicles() {
      if (compareIds.length === 0) {
        setVehicles([])
        return
      }
      setLoading(true)
      try {
        const response = await fetch(`/api/listings?ids=${compareIds.join(',')}`)
        if (response.ok) {
          const data = await response.json()
          // Maintain order of compareIds
          const orderedData = compareIds.map(id => data.find((v: any) => v.id === id)).filter(Boolean)
          setVehicles(orderedData)
        }
      } catch (error) {
        console.error('Failed to fetch comparison vehicles:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchVehicles()
  }, [compareIds])

  return (
    <div className="min-h-screen bg-white text-gray-800 font-sans selection:bg-blue-100 pb-24">
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 relative">
        <div className="flex flex-col lg:flex-row gap-16 mb-16">
          <div className="lg:w-1/4">
            <h1 className="text-6xl font-black text-gray-900 tracking-tight leading-[0.8] mb-4">
              COMPARE<br />VEHICLES
            </h1>
            <p className="text-gray-400 font-bold text-xs uppercase tracking-widest mt-6">
              Compare up to 3 vehicles to find your perfect match
            </p>
          </div>

          <div className="lg:w-3/4 grid grid-cols-1 md:grid-cols-3 gap-8">
            {[0, 1, 2].map((i) => {
              const vehicle = vehicles[i]
              if (vehicle) {
                let imageUrls = []
                try {
                  imageUrls = JSON.parse(vehicle.images)
                } catch (e) {
                  imageUrls = vehicle.images ? [vehicle.images] : []
                }
                const mainImage = imageUrls[0] || 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=800&q=80'

                return (
                  <div key={vehicle.id} className="flex flex-col gap-4 relative group">
                    <button 
                      onClick={() => removeFromCompare(vehicle.id)}
                      className="absolute -top-3 -right-3 z-10 bg-white shadow-md border border-gray-100 rounded-full p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <div className="relative aspect-[3/2] rounded-xl overflow-hidden shadow-sm group-hover:shadow-xl transition-all duration-500">
                      <Image src={mainImage} alt={vehicle.title} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                    </div>
                    <div>
                      <h3 className="font-black text-sm uppercase tracking-tight text-gray-900 line-clamp-1">{vehicle.title}</h3>
                      <p className="text-blue-600 font-black text-xs mt-1">{vehicle.price ? `KES ${vehicle.price.toLocaleString()}` : 'Contact for Price'}</p>
                    </div>
                  </div>
                )
              }

              return (
                <div key={`empty-${i}`} className="flex flex-col gap-6">
                  <Link href="/inventory" className="bg-[#f8fafc] aspect-[3/2] rounded-xl border-2 border-dashed border-gray-200 flex items-center justify-center relative group cursor-pointer hover:bg-gray-100 transition-all">
                    <div className="flex flex-col items-center gap-4">
                      <div className="relative">
                        <Car className="w-12 h-12 text-gray-300" />
                        <div className="absolute -top-1 -right-1 bg-blue-500 rounded-full p-1 border-4 border-white">
                          <Plus className="w-3 h-3 text-white" />
                        </div>
                      </div>
                    </div>
                  </Link>
                  <div className="text-center font-bold text-gray-300 text-[10px] tracking-[0.2em] uppercase py-2">
                    ADD CAR TO COMPARE
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Comparison Grid */}
        <div className="border-t border-gray-100">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center gap-4">
              <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Updating Comparison...</p>
            </div>
          ) : vehicles.length > 0 ? (
            comparisonAttributes.map((attr, idx) => (
              <div key={attr.label} className="flex border-b border-gray-100 py-6 items-center group hover:bg-gray-50/50 transition-colors">
                <div className="w-1/4 font-black text-[10px] text-gray-400 tracking-[0.2em] px-4 uppercase">
                  {attr.label}
                </div>
                <div className="w-3/4 grid grid-cols-3 gap-8">
                  {[0, 1, 2].map((i) => (
                    <div key={i} className="border-l border-gray-50 px-4 min-h-[1.5rem] flex items-center">
                      {vehicles[i] ? (
                        <span className="text-xs font-bold text-gray-700">
                          {attr.format ? attr.format(vehicles[i][attr.key]) : (vehicles[i][attr.key] || '—')}
                        </span>
                      ) : (
                        <span className="text-gray-200 font-black text-[10px]">EMPTY</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="py-32 text-center border-b border-gray-100">
              <Car className="w-16 h-16 text-gray-100 mx-auto mb-6" />
              <h2 className="text-gray-300 font-black text-xs uppercase tracking-[0.3em]">No vehicles selected for comparison</h2>
              <Link href="/inventory" className="text-blue-500 font-black text-[10px] uppercase tracking-[0.2em] mt-8 inline-block hover:underline">
                Browse Inventory
              </Link>
            </div>
          )}
        </div>

        {/* WhatsApp Button */}
        <div className="fixed bottom-[40%] right-4 translate-y-1/2 z-50">
          <div className="bg-[#25D366] text-white px-7 py-5 rounded-2xl font-black flex items-center gap-4 shadow-[0_0_20px_rgba(37,211,102,0.4)] hover:scale-105 transition-all cursor-pointer">
            <span className="text-lg">WhatsApp Us**</span>
            <MessageCircle className="w-10 h-10 fill-white text-[#25D366]" />
          </div>
        </div>
      </main>

      {/* Footer Socials */}
      <footer className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 border-t flex gap-4 mt-20">
        <div className="flex gap-4">
          <Link href="#" className="bg-[#3b5998] p-2.5 rounded hover:scale-110 transition-all"><Image src="https://www.svgrepo.com/show/512317/facebook-176.svg" alt="" width={22} height={22} className="invert" /></Link>
          <Link href="#" className="bg-[#2b90d9] p-2.5 rounded hover:scale-110 transition-all"><Image src="https://www.svgrepo.com/show/508977/mastodon.svg" alt="" width={22} height={22} className="invert" /></Link>
          <Link href="#" className="bg-[#55acee] p-2.5 rounded hover:scale-110 transition-all"><Image src="https://www.svgrepo.com/show/521654/email.svg" alt="" width={22} height={22} className="invert" /></Link>
          <div className="bg-blue-600 p-2.5 rounded hover:scale-110 transition-all cursor-pointer flex items-center justify-center">
            <Plus className="w-6 h-6 text-white" />
          </div>
        </div>
      </footer>
    </div>
  )
}
