'use client'

import Image from 'next/image'
import { Clock, Calendar, MapPin, CheckCircle2, Loader2, Plus } from 'lucide-react'
import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function Hire() {
  const [listings, setListings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchListings() {
      try {
        const response = await fetch('/api/listings')
        if (response.ok) {
          const data = await response.json()
          // Filter for hire listings only
          const hireListings = data.filter((l: any) => l.type === 'HIRE')
          setListings(hireListings)
        }
      } catch (error) {
        console.error("Failed to fetch hire listings:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchListings()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans selection:bg-blue-100">
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-black text-gray-900 tracking-tight uppercase">Vehicles for Hire</h1>
          <Link href="/listings/create" className="bg-blue-600 text-white px-6 py-3 rounded-lg font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg flex items-center gap-2">
            <Plus className="w-5 h-5" />
            List Your Car
          </Link>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="w-full lg:w-1/4">
            <div className="bg-blue-600 text-white p-5 rounded-t-lg">
              <h2 className="text-lg font-black uppercase tracking-wider flex items-center gap-3">
                Rental Filter
              </h2>
            </div>
            <div className="bg-white p-6 shadow-sm border border-t-0 flex flex-col gap-4">
              <select className="w-full border border-gray-200 p-3 rounded text-[14px] font-bold">
                <option>Car Category</option>
                <option>SUV</option>
                <option>Saloon</option>
                <option>Luxury</option>
              </select>
              <select className="w-full border border-gray-200 p-3 rounded text-[14px] font-bold">
                <option>Duration</option>
                <option>Short Term (1-7 days)</option>
                <option>Long Term (7+ days)</option>
              </select>
              <button className="bg-blue-500 text-white p-3 rounded font-black hover:bg-blue-600 transition-all uppercase tracking-widest text-xs">
                Search
              </button>
            </div>
          </aside>

          {/* Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
                <p className="text-gray-500 font-bold uppercase tracking-widest">Loading Rentals...</p>
              </div>
            ) : listings.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-xl border-2 border-dashed border-gray-200">
                <Calendar className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                <p className="text-gray-400 font-bold uppercase tracking-widest">No cars available for hire</p>
                <Link href="/listings/create" className="text-blue-500 font-black mt-4 inline-block hover:underline">Be the first to list a car for hire!</Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                {listings.map((car) => {
                  let imageUrls = [];
                  try {
                    imageUrls = JSON.parse(car.images);
                  } catch (e) {
                    imageUrls = car.images ? [car.images] : [];
                  }
                  const mainImage = imageUrls[0] || 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=800&q=80';

                  let features = [];
                  try {
                    features = JSON.parse(car.features);
                  } catch (e) {
                    features = [];
                  }

                  const isBooked = car.availability?.toLowerCase().includes('booked');

                  return (
                    <div key={car.id} className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 group hover:shadow-2xl transition-all duration-500 relative">
                      <div className="relative h-60 overflow-hidden">
                        <Image src={mainImage} alt={car.title} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                        {car.featured && (
                          <div className="absolute top-6 left-0 bg-red-600 text-white text-[10px] font-black px-10 py-2.5 -rotate-45 -translate-x-10 translate-y-0 origin-center shadow-xl uppercase tracking-[0.2em] z-20">
                            FEATURED
                          </div>
                        )}
                        <div className={`absolute top-4 right-4 ${isBooked ? 'bg-red-500' : 'bg-green-600'} text-white text-[10px] font-black px-3 py-1.5 rounded uppercase tracking-wider z-10 shadow-lg`}>
                          {car.availability || 'AVAILABLE'}
                        </div>
                      </div>
                      <div className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="text-lg font-black text-gray-900 uppercase leading-tight">{car.title}</h3>
                        </div>
                        
                        <p className="text-blue-600 font-black text-2xl mb-4">
                          Ksh {car.price?.toLocaleString()} <span className="text-sm text-gray-400 font-normal">per day</span>
                        </p>

                        <div className="flex flex-wrap gap-2 mb-6">
                          {features.slice(0, 3).map((f: string) => (
                            <span key={f} className="text-[10px] font-black bg-gray-100 text-gray-500 px-2 py-1 rounded uppercase tracking-widest">
                              {f}
                            </span>
                          ))}
                          {features.length > 3 && (
                            <span className="text-[10px] font-black bg-gray-50 text-gray-400 px-2 py-1 rounded uppercase tracking-widest">
                              +{features.length - 3} more
                            </span>
                          )}
                        </div>

                        <div className="space-y-3 border-t pt-4">
                          <div className="flex items-center gap-3 text-sm text-gray-500 font-bold uppercase tracking-wider">
                            <Clock className="w-4 h-4 text-blue-500" />
                            {car.transmission || 'Automatic'}
                          </div>
                          <div className="flex items-center gap-3 text-sm text-gray-500 font-bold uppercase tracking-wider">
                            <MapPin className="w-4 h-4 text-blue-500" />
                            {car.location}
                          </div>
                          {car.pickupDelivery && (
                            <div className="flex items-center gap-3 text-sm text-gray-500 font-bold uppercase tracking-wider">
                              <CheckCircle2 className="w-4 h-4 text-blue-500" />
                              {car.pickupDelivery}
                            </div>
                          )}
                        </div>

                        <button className="w-full mt-8 bg-gray-900 text-white py-4 rounded-xl font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-lg active:scale-95">
                          Book Now
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
