'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Search, Plus, User, Scale, Phone, Car, MessageCircle, LayoutGrid, List, ChevronRight, ChevronLeft, RotateCcw, SlidersHorizontal, Settings2, Loader2, Check } from 'lucide-react'
import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useCompare } from '@/components/providers/CompareProvider'

const carMakes = ['Toyota', 'Mitsubishi', 'Nissan', 'Mazda', 'Isuzu', 'Honda', 'Subaru', 'Mercedes-Benz', 'BMW', 'Volkswagen', 'Ford', 'Hyundai', 'Kia']
const carModels = ['Camry', 'Pajero', 'Demio', 'RAV4', 'D-Max', 'AD', 'Lafesta', '3-Serie', 'Civic', 'Forester', 'Land Cruiser', 'Hilux', 'Prado', 'Vitz', 'Axio']
const carYears = Array.from({ length: 35 }, (_, i) => (2024 - i).toString())
const carConditions = ['Used', 'New', 'Certified Used']
const transmissions = ['Manual', 'Automatic']
const fuelTypes = ['Petrol', 'Diesel', 'Hybrid', 'Electric']
const drives = ['FWD', 'RWD', 'AWD', '4WD']
const engines = ['1.0L', '1.5L', '2.0L', '2.5L', '3.0L', '3.5L', '4.0L']
const bodies = ['Sedan', 'SUV', 'Hatchback', 'Pickup', 'Van', 'Coupe', 'Convertible']

function InventoryContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { addToCompare, removeFromCompare, isInCompare } = useCompare()
  
  const [priceRange, setPriceRange] = useState([180000, 2000000])
  const [listings, setListings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  
  const [filters, setFilters] = useState({
    condition: searchParams.get('condition') || '',
    make: searchParams.get('make') || '',
    body: searchParams.get('body') || '',
    year: searchParams.get('year') || '',
    transmission: searchParams.get('transmission') || '',
    fuelType: searchParams.get('fuelType') || '',
    model: searchParams.get('model') || '',
    query: searchParams.get('query') || ''
  })

  useEffect(() => {
    async function fetchListings() {
      setLoading(true)
      try {
        const params = new URLSearchParams()
        if (filters.condition) params.append('condition', filters.condition)
        if (filters.make) params.append('make', filters.make)
        if (filters.body) params.append('body', filters.body)
        if (filters.year) params.append('year', filters.year)
        if (filters.transmission) params.append('transmission', filters.transmission)
        if (filters.fuelType) params.append('fuelType', filters.fuelType)
        if (filters.model) params.append('model', filters.model)
        if (filters.query) params.append('query', filters.query)

        const response = await fetch(`/api/listings?${params.toString()}`)
        if (response.ok) {
          const data = await response.json()
          setListings(data)
        }
      } catch (error) {
        console.error("Failed to fetch listings:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchListings()
    
    // Update URL when filters change
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value)
    })
    const queryString = params.toString()
    router.push(`/inventory${queryString ? `?${queryString}` : ''}`, { scroll: false })
  }, [filters, router])

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const resetFilters = () => {
    setFilters({
      condition: '',
      make: '',
      body: '',
      year: '',
      transmission: '',
      fuelType: '',
      model: '',
      query: ''
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans selection:bg-blue-100">
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="w-full lg:w-1/4">
            <div className="bg-[#2c3e50] text-white p-5 rounded-t-lg flex items-center justify-between">
              <h2 className="text-lg font-black uppercase tracking-wider flex items-center gap-3">
                Search Options
              </h2>
              <Search className="w-5 h-5 text-gray-400" />
            </div>
            <div className="bg-white p-6 shadow-sm border border-t-0 flex flex-col gap-4">
              {[
                { label: 'Condition', key: 'condition', options: carConditions },
                { label: 'Make', key: 'make', options: carMakes },
                { label: 'Body', key: 'body', options: bodies },
                { label: 'Year', key: 'year', options: carYears },
                { label: 'Transmission', key: 'transmission', options: transmissions },
                { label: 'Fuel type', key: 'fuelType', options: fuelTypes },
                { label: 'Model', key: 'model', options: carModels },
              ].map((filter: any) => (
                <div key={filter.label} className="relative group">
                  <select 
                    value={(filters as any)[filter.key]}
                    onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                    className="w-full appearance-none border border-gray-200 p-3 rounded text-gray-700 text-[14px] font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer bg-white group-hover:border-gray-300 transition-colors"
                  >
                    <option value="">{filter.label}</option>
                    {filter.options.map((opt: string) => <option key={opt} value={opt.toLowerCase()}>{opt}</option>)}
                  </select>
                  <ChevronLeft className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 -rotate-90 text-gray-400 pointer-events-none" />
                </div>
              ))}

              <div className="mt-4">
                <p className="text-[13px] font-bold text-gray-700 mb-2">Search by keywords</p>
                <input 
                  type="text" 
                  value={filters.query}
                  onChange={(e) => handleFilterChange('query', e.target.value)}
                  placeholder="Search..." 
                  className="w-full border border-gray-200 p-3 rounded text-[14px] focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 font-medium"
                />
              </div>

              <button 
                onClick={resetFilters}
                className="flex items-center justify-center gap-2 text-gray-600 font-bold text-[14px] mt-2 hover:text-blue-500 transition-colors py-2"
              >
                <RotateCcw className="w-4 h-4" />
                Reset All
              </button>
            </div>


            <div className="bg-white mt-8 shadow-sm border rounded-lg overflow-hidden">
              <div className="bg-blue-50 p-4 border-b flex justify-between items-center">
                <span className="text-blue-600 font-black text-xs uppercase tracking-[0.2em]">Select Price</span>
                <span className="text-gray-300 font-black">−</span>
              </div>
              <div className="p-8">
                <div className="relative h-1 bg-gray-100 rounded-full mb-8">
                  <div className="absolute left-0 right-0 h-full bg-blue-500/20" />
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-gray-200 rounded-full cursor-pointer shadow-sm" />
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-gray-200 rounded-full cursor-pointer shadow-sm" />
                </div>
                <div className="flex gap-4">
                  <div className="flex-1 border border-gray-200 p-3 rounded text-center text-sm font-bold text-gray-300">180000</div>
                  <div className="flex-1 border border-gray-200 p-3 rounded text-center text-sm font-bold text-gray-300">2000000</div>
                </div>
              </div>
            </div>
          </aside>

          {/* Content Area */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-8">
              <div className="bg-blue-600 text-white px-8 py-3 rounded-t-lg font-black text-xs uppercase tracking-[0.2em] shadow-lg">
                Featured Listings
              </div>
              <div className="flex items-center gap-10">
                <Link href="/listings/create" className="text-sm font-black text-blue-600 hover:text-blue-700 transition-all uppercase tracking-wider flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-lg">
                  <Plus className="w-4 h-4" />
                  Create Listing
                </Link>
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Sort by:</span>
                    <div className="relative group">
                      <select className="text-[11px] font-black text-gray-600 uppercase tracking-widest bg-transparent focus:outline-none cursor-pointer appearance-none pr-6">
                        <option>Date: newest first</option>
                        <option>Price: low to high</option>
                        <option>Price: high to low</option>
                      </select>
                      <ChevronLeft className="w-3 h-3 absolute right-0 top-1/2 -translate-y-1/2 -rotate-90 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                  <div className="flex items-center gap-2 border-l pl-6 border-gray-200">
                    <button className="p-2 text-blue-600 bg-blue-50 rounded shadow-inner">
                      <LayoutGrid className="w-5 h-5" />
                    </button>
                    <button className="p-2 text-gray-300 hover:text-gray-500 transition-colors">
                      <List className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
                <p className="text-gray-500 font-bold uppercase tracking-widest">Loading Marketplace...</p>
              </div>
            ) : listings.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-xl border-2 border-dashed border-gray-200">
                <Car className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                <p className="text-gray-400 font-bold uppercase tracking-widest">No listings found</p>
                <Link href="/listings/create" className="text-blue-500 font-black mt-4 inline-block hover:underline">Be the first to list a car!</Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {listings.map((car: any) => {
                  let imageUrls = [];
                  try {
                    imageUrls = JSON.parse(car.images);
                  } catch (e) {
                    imageUrls = car.images ? [car.images] : [];
                  }
                  const mainImage = imageUrls[0] || 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=800&q=80';

                  return (
                    <Link key={car.id} href={`/inventory/${car.id}`} className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 group hover:shadow-2xl transition-all duration-500 relative">
                      <div className="relative h-60 overflow-hidden">
                        <Image src={mainImage} alt={car.title} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                        {car.featured && (
                          <div className="absolute top-6 left-0 bg-red-600 text-white text-[10px] font-black px-10 py-2.5 -rotate-45 -translate-x-10 translate-y-0 origin-center shadow-xl uppercase tracking-[0.2em] z-20">
                            FEATURED
                          </div>
                        )}
                        
                        <div className="absolute top-4 right-4 z-30">
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              if (isInCompare(car.id)) {
                                removeFromCompare(car.id);
                              } else {
                                addToCompare(car.id);
                              }
                            }}
                            className={`p-2 rounded-full backdrop-blur-md border transition-all ${
                              isInCompare(car.id)
                                ? 'bg-blue-600 border-blue-500 text-white'
                                : 'bg-black/30 border-white/20 text-white hover:bg-white hover:text-blue-600'
                            }`}
                            title={isInCompare(car.id) ? 'Remove from comparison' : 'Add to comparison'}
                          >
                            {isInCompare(car.id) ? <Check className="w-5 h-5" /> : <Scale className="w-5 h-5" />}
                          </button>
                        </div>
                        
                        <div className="absolute top-4 left-4 flex gap-1 z-10">
                          <span className="bg-black/30 text-white text-[10px] px-3 py-1.5 rounded-lg flex items-center gap-2 backdrop-blur-md font-black border border-white/20">
                            <Image src="https://www.svgrepo.com/show/522064/camera.svg" alt="" width={14} height={14} className="invert" />
                            {imageUrls.length}
                          </span>
                        </div>
                      </div>
                      <div className="p-6">
                        <h3 className="text-[15px] font-black text-gray-900 leading-tight uppercase group-hover:text-blue-600 transition-colors mb-6 truncate">
                          {car.title}
                        </h3>
                        
                        <div className="flex flex-col items-end absolute top-[16.5rem] right-4">
                          <div className="bg-blue-600 text-white text-[15px] font-black px-4 py-2 rounded-sm shadow-lg tracking-tight">
                            {car.price ? `${car.price.toLocaleString()} KSh` : 'Contact for Price'}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-x-4 gap-y-4 border-t pt-6 text-[12px] font-bold text-gray-500 uppercase tracking-widest">
                          <div className="flex items-center gap-3">
                            <User className="w-4 h-4 text-gray-300" />
                            {car.condition || 'N/A'}
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="w-5 h-5 flex items-center justify-center text-[11px] border-2 border-gray-100 rounded-full text-gray-300 font-black">
                              {car.make ? car.make[0] : 'V'}
                            </div>
                            {car.make || 'Vehicle'}
                          </div>
                          <div className="flex items-center gap-3">
                            <Settings2 className="w-4 h-4 text-gray-300" />
                            {car.transmission || 'N/A'}
                          </div>
                          <div className="flex items-center gap-3">
                            <RotateCcw className="w-4 h-4 text-gray-300" />
                            {car.fuelType || 'N/A'}
                          </div>
                        </div>
                        <div className="mt-4 pt-4 border-t flex items-center justify-between">
                          <div className="flex items-center gap-2 text-[10px] font-black text-gray-400">
                            <Phone className="w-3 h-3" />
                            {car.user?.phone || '07XXXXXXXX'}
                          </div>
                          <span className="text-[10px] font-black text-blue-500">{car.location}</span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}

            {/* Pagination */}
            <div className="flex justify-center items-center mt-20 gap-3">
              <button className="w-12 h-12 flex items-center justify-center rounded-md bg-blue-600 text-white font-black text-sm shadow-lg shadow-blue-200 active:scale-95 transition-all">1</button>
              <button className="w-12 h-12 flex items-center justify-center rounded-md bg-white border border-gray-100 text-gray-400 font-black text-sm hover:bg-gray-50 transition-all active:scale-95">2</button>
              <button className="w-12 h-12 flex items-center justify-center rounded-md bg-white border border-gray-100 text-gray-400 font-black text-sm hover:bg-gray-50 transition-all active:scale-95 ml-4">
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default function Inventory() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-20">
        <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
        <p className="text-gray-500 font-bold uppercase tracking-widest">Loading Inventory...</p>
      </div>
    }>
      <InventoryContent />
    </Suspense>
  )
}
