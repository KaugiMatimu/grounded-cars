'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Search, MessageCircle, Car, Plus, Loader2 } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

const carMakes = ['Toyota', 'Mitsubishi', 'Nissan', 'Mazda', 'Isuzu', 'Honda', 'Subaru', 'Mercedes-Benz', 'BMW', 'Volkswagen', 'Ford', 'Hyundai', 'Kia']
const carModels = ['Camry', 'Pajero', 'Demio', 'RAV4', 'D-Max', 'AD', 'Lafesta', '3-Serie', 'Civic', 'Forester', 'Land Cruiser', 'Hilux', 'Prado', 'Vitz', 'Axio']
const carYears = Array.from({ length: 35 }, (_, i) => (2024 - i).toString())
const carConditions = ['Used', 'New', 'Certified Used']

const topVehicles = [
  { 
    id: 1, 
    name: 'TOYOTA CAMRY 1990', 
    price: 140000, 
    originalPrice: 180000, 
    image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=800&q=80', 
    badge: 'DEAL', 
    transmission: 'Manual', 
    brand: 'Toyota', 
    condition: 'Used'
  },
  { 
    id: 2, 
    name: 'MAZDA DEMIO 2005', 
    price: 290000, 
    originalPrice: 300000, 
    image: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=800&q=80', 
    badge: 'PRICE DROP', 
    transmission: 'Automatic', 
    brand: 'Mazda', 
    condition: 'Used'
  },
  { 
    id: 3, 
    name: 'TOYOTA RAV4 2000', 
    price: 280000, 
    originalPrice: 400000, 
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80', 
    badge: 'BEST DEAL', 
    transmission: 'Automatic', 
    brand: 'Toyota', 
    condition: 'Used'
  },
  { 
    id: 4, 
    name: 'TOYOTA CAMRY 2000', 
    price: 170000, 
    originalPrice: 200000, 
    image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80', 
    badge: 'BEST OFFER', 
    transmission: 'Automatic', 
    brand: 'Toyota', 
    condition: 'Used'
  }
]

export default function Home() {
  const router = useRouter()
  const [listings, setListings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchFilters, setSearchFilters] = useState({
    make: '',
    model: '',
    year: '',
    condition: ''
  })

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (searchFilters.make) params.append('make', searchFilters.make)
    if (searchFilters.model) params.append('model', searchFilters.model)
    if (searchFilters.year) params.append('year', searchFilters.year)
    if (searchFilters.condition) params.append('condition', searchFilters.condition)
    router.push(`/inventory?${params.toString()}`)
  }

  useEffect(() => {
    async function fetchListings() {
      try {
        const response = await fetch('/api/listings')
        if (response.ok) {
          const data = await response.json()
          setListings(data.slice(0, 4)) // Show top 4 for now
        }
      } catch (error) {
        console.error("Failed to fetch listings:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchListings()
  }, [])

  return (
    <div className="min-h-screen bg-white text-gray-800 font-sans">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center pt-20">
        <Image 
          src="/images/hero-image.jpg" 
          alt="Hero Background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative mx-auto max-w-7xl px-4 w-full sm:px-6 lg:px-8 flex flex-col items-start">
          <h1 className="text-6xl font-black text-white sm:text-8xl mb-6 tracking-tight drop-shadow-2xl">
            Welcome to Grounded Cars Listing
          </h1>
          <p className="max-w-3xl text-2xl text-white mb-10 font-medium drop-shadow-lg">
            The Kenya&apos;s Largest Grounded, Salvage and Used Cars&apos; Marketplace
          </p>

          <div className="flex flex-wrap gap-4 mb-16">
            <Link href="/listings/create" className="bg-blue-600 text-white px-10 py-5 rounded-xl font-black text-lg hover:bg-blue-700 transition-all shadow-xl hover:-translate-y-1 active:translate-y-0 uppercase tracking-wider flex items-center gap-3">
              <Plus className="w-6 h-6 stroke-[3px]" />
              List Your Car
            </Link>
            <Link href="/hire" className="bg-white text-gray-900 px-10 py-5 rounded-xl font-black text-lg hover:bg-gray-100 transition-all shadow-xl hover:-translate-y-1 active:translate-y-0 uppercase tracking-wider">
              Hire a Car
            </Link>
            <Link href="/services/request" className="bg-gray-900 text-white px-10 py-5 rounded-xl font-black text-lg hover:bg-black transition-all shadow-xl hover:-translate-y-1 active:translate-y-0 uppercase tracking-wider">
              Request Service
            </Link>
          </div>

          <div className="w-full max-w-6xl">
            <div className="bg-white p-2 rounded-lg shadow-2xl">
              <div className="flex gap-2 p-2">
                <button 
                  onClick={() => setSearchFilters(prev => ({ ...prev, condition: '' }))}
                  className={`text-sm font-black px-6 py-3 rounded border ${!searchFilters.condition ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-200 bg-white text-gray-900 shadow-sm'}`}
                >
                  All
                </button>
                {carConditions.map(condition => (
                  <button 
                    key={condition}
                    onClick={() => setSearchFilters(prev => ({ ...prev, condition: condition.toLowerCase() }))}
                    className={`text-sm font-black px-6 py-3 rounded transition-all ${searchFilters.condition === condition.toLowerCase() ? 'bg-blue-600 text-white' : 'bg-[#2c3e50] text-white hover:bg-gray-700'}`}
                  >
                    {condition}
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border-t">
                <div className="relative">
                  <select 
                    value={searchFilters.make}
                    onChange={(e) => setSearchFilters(prev => ({ ...prev, make: e.target.value }))}
                    className="w-full appearance-none border border-gray-200 p-4 rounded text-gray-500 text-[15px] font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer bg-white"
                  >
                    <option value="">Select Make</option>
                    {carMakes.map(make => <option key={make} value={make.toLowerCase()}>{make}</option>)}
                  </select>
                </div>
                <div className="relative">
                  <select 
                    value={searchFilters.model}
                    onChange={(e) => setSearchFilters(prev => ({ ...prev, model: e.target.value }))}
                    className="w-full appearance-none border border-gray-200 p-4 rounded text-gray-500 text-[15px] font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer bg-white"
                  >
                    <option value="">Select Model</option>
                    {carModels.map(model => <option key={model} value={model.toLowerCase()}>{model}</option>)}
                  </select>
                </div>
                <div className="relative">
                  <select 
                    value={searchFilters.year}
                    onChange={(e) => setSearchFilters(prev => ({ ...prev, year: e.target.value }))}
                    className="w-full appearance-none border border-gray-200 p-4 rounded text-gray-500 text-[15px] font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer bg-white"
                  >
                    <option value="">Select Year</option>
                    {carYears.map(year => <option key={year} value={year}>{year}</option>)}
                  </select>
                </div>
                <div className="relative">
                  <select 
                    value={searchFilters.condition}
                    onChange={(e) => setSearchFilters(prev => ({ ...prev, condition: e.target.value }))}
                    className="w-full appearance-none border border-gray-200 p-4 rounded text-gray-500 text-[15px] font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer bg-white"
                  >
                    <option value="">Select Condition</option>
                    {carConditions.map(condition => <option key={condition} value={condition.toLowerCase()}>{condition}</option>)}
                  </select>
                </div>
              </div>
              <div className="flex justify-end p-4 border-t">
                <button 
                  onClick={handleSearch}
                  className="bg-blue-500 text-white px-12 py-4 rounded font-black flex items-center gap-3 hover:bg-blue-600 transition-all shadow-lg text-lg"
                >
                  <Search className="w-6 h-6 stroke-[3px]" />
                  Search Cars
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* WhatsApp Button */}
        <Link href="https://wa.me/254727919076" className="fixed bottom-1/2 right-4 translate-y-1/2 z-50 bg-[#25D366] text-white px-6 py-4 rounded-xl font-black flex items-center gap-3 shadow-[0_0_20px_rgba(37,211,102,0.4)] hover:scale-105 transition-all">
          <span className="text-lg">WhatsApp Us**</span>
          <MessageCircle className="w-8 h-8 fill-white text-[#25D366]" />
        </Link>
      </section>

      {/* Browse Sections */}
      <section className="max-w-7xl mx-auto px-4 py-24 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-32">
          <div>
            <div className="flex justify-between items-end mb-12">
              <h2 className="text-4xl font-black text-gray-900 tracking-tight">Browse by Make</h2>
              <Link href="#" className="text-sm font-bold text-gray-400 border-b border-dashed border-gray-400 pb-1 hover:text-blue-500 hover:border-blue-500 transition-all uppercase tracking-wider">Show all Makes</Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-12">
              {[
                { name: 'Mazda', logo: '/images/car-logos/mazda.png' },
                { name: 'Mitsubishi', logo: '/images/car-logos/mitsubishi.png' },
                { name: 'Nissan', logo: '/images/car-logos/nissan.png' },
                { name: 'Toyota', logo: '/images/car-logos/toyota.png' }
              ].map((make) => (
                <div key={make.name} className="flex flex-col items-center gap-5 group cursor-pointer">
                  <div className="w-28 h-28 border-2 border-gray-100 rounded-full flex items-center justify-center bg-white group-hover:border-blue-500 group-hover:shadow-xl transition-all duration-300 overflow-hidden relative p-6">
                    <Image src={make.logo} alt={make.name} fill className="object-contain grayscale group-hover:grayscale-0 transition-all p-6" />
                  </div>
                  <span className="text-sm font-black text-gray-500 group-hover:text-blue-600 uppercase tracking-widest">{make.name}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="flex justify-between items-end mb-12">
              <h2 className="text-4xl font-black text-gray-900 tracking-tight">Browse by Body</h2>
              <Link href="#" className="text-sm font-bold text-gray-400 border-b border-dashed border-gray-400 pb-1 hover:text-blue-500 hover:border-blue-500 transition-all uppercase tracking-wider">Show all Bodies</Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-12">
              <div className="flex flex-col items-center gap-5 group cursor-pointer">
                <div className="w-28 h-28 border-2 border-gray-100 rounded-full flex items-center justify-center bg-white group-hover:border-blue-500 group-hover:shadow-xl transition-all duration-300 p-6">
                  <Car className="text-blue-400 w-12 h-12" />
                </div>
                <span className="text-sm font-black text-gray-500 group-hover:text-blue-600 uppercase tracking-widest">SUV</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* New/Used Cars */}
      <section className="bg-gray-50 py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col mb-16">
            <div className="flex flex-col md:flex-row justify-between w-full items-start md:items-end gap-10">
              <h2 className="text-5xl font-black text-gray-900 tracking-tight">New/Used Cars</h2>
              <div className="flex gap-10 overflow-x-auto pb-4 w-full md:w-auto">
                <button className="text-sm font-black text-white bg-blue-500 px-10 py-3 rounded-full shadow-blue-200 shadow-xl whitespace-nowrap uppercase tracking-widest transition-all hover:scale-105 active:scale-95">Popular items</button>
                <button className="text-sm font-black text-gray-500 border-b-2 border-dashed border-gray-300 hover:text-blue-600 hover:border-blue-600 transition-all whitespace-nowrap uppercase tracking-widest">Recent items</button>
                <button className="text-sm font-black text-gray-500 border-b-2 border-dashed border-gray-300 hover:text-blue-600 hover:border-blue-600 transition-all whitespace-nowrap uppercase tracking-widest">Featured items</button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {loading ? (
              <div className="col-span-full flex justify-center py-20">
                <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
              </div>
            ) : listings.length === 0 ? (
              <div className="col-span-full text-center py-20 bg-white rounded-xl border-2 border-dashed border-gray-100">
                <Car className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                <p className="text-gray-400 font-bold uppercase tracking-widest">No listings available</p>
              </div>
            ) : (
              listings.map((car) => {
                let imageUrls = [];
                try {
                  imageUrls = JSON.parse(car.images);
                } catch (e) {
                  imageUrls = car.images ? [car.images] : [];
                }
                const mainImage = imageUrls[0] || 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=800&q=80';

                return (
                  <Link key={car.id} href={`/inventory/${car.id}`} className="bg-white rounded-xl overflow-hidden shadow-sm group border border-gray-100 hover:shadow-2xl transition-all duration-500">
                    <div className="relative h-64 overflow-hidden">
                      <Image src={mainImage} alt={car.title} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                      {car.featured && (
                        <div className="absolute top-5 left-0 bg-[#a3e635] text-white text-[11px] font-black px-8 py-2 -rotate-45 -translate-x-8 translate-y-0 origin-center shadow-lg uppercase tracking-[0.2em] z-10">
                          FEATURED
                        </div>
                      )}
                      <div className="absolute top-4 left-4 flex gap-1">
                        <span className="bg-black/40 text-white text-[11px] px-3 py-1.5 rounded-lg flex items-center gap-2 backdrop-blur-md font-black">
                          <Image src="https://www.svgrepo.com/show/522064/camera.svg" alt="" width={16} height={16} className="invert" />
                          {imageUrls.length}
                        </span>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-[16px] font-black text-gray-900 mb-6 leading-snug group-hover:text-blue-600 transition-colors uppercase tracking-tight truncate">{car.title}</h3>
                      <div className="flex justify-between items-center mb-8">
                        <div className="flex flex-col gap-1.5">
                          <div className="bg-blue-500 text-white px-5 py-2 rounded font-black text-[16px] shadow-lg shadow-blue-100 inline-block text-center">
                            {car.price ? `${car.price.toLocaleString()} Ksh` : 'Contact for Price'}
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-y-4 gap-x-4 border-t border-gray-50 pt-6">
                        <div className="flex items-center gap-3 text-[12px] font-black text-gray-400 uppercase tracking-tighter">
                          <Car className="w-5 h-5 text-gray-200" />
                          {car.condition || 'Used'}
                        </div>
                        <div className="flex items-center gap-3 text-[12px] font-black text-gray-400 uppercase tracking-tighter">
                          <Car className="w-5 h-5 text-gray-200" />
                          {car.make || 'Toyota'}
                        </div>
                        <div className="flex items-center gap-3 text-[12px] font-black text-gray-400 uppercase tracking-tighter">
                          <Car className="w-5 h-5 text-gray-200" />
                          {car.transmission || 'Automatic'}
                        </div>
                        <div className="flex items-center gap-3 text-[12px] font-black text-gray-400 uppercase tracking-tighter">
                          <Car className="w-5 h-5 text-gray-200" />
                          {car.fuelType || 'Petrol'}
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })
            )}
          </div>

          <div className="mt-20 flex justify-center">
            <button className="bg-[#2c3e50] text-white px-16 py-5 rounded-lg font-black text-[15px] uppercase tracking-[0.3em] hover:bg-black transition-all shadow-2xl hover:-translate-y-1 active:translate-y-0">Show All</button>
          </div>
        </div>
      </section>

      {/* Sell Your Car Section */}
      <section className="bg-[#1a2b3c] py-32 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-blue-500/5 blur-3xl rounded-full" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-24">
            <div className="lg:w-1/2">
              <h2 className="text-6xl font-black text-white mb-10 leading-[1.1] tracking-tight">
                Sell Your Grounded/Used Cars Here
              </h2>
              <p className="text-gray-400 text-2xl mb-14 leading-relaxed font-medium">
                Add your car to Your Listing to track its market value and cash in when the time is right to sell. Get an offer online and quickly complete the transaction with a local dealer/ customer.
              </p>
              <Link href="/listings/create" className="bg-blue-500 text-white px-12 py-5 rounded-lg font-black text-lg hover:bg-blue-600 transition-all shadow-[0_20px_40px_rgba(59,130,246,0.3)] hover:-translate-y-1 active:translate-y-0 inline-block">Get started</Link>
            </div>
            <div className="lg:w-1/2 relative">
              <div className="relative group">
                <div className="relative aspect-[12/8] rounded-2xl overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.5)] z-20 group-hover:scale-[1.02] transition-transform duration-700">
                  <Image 
                    src="https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80" 
                    alt="Toyota Car" 
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="absolute -inset-4 bg-blue-500/20 rounded-2xl -z-10 blur-xl group-hover:bg-blue-500/30 transition-all" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
