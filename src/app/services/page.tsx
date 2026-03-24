'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Search, Plus, User, Scale, Phone, Car, MessageCircle, LayoutGrid, List, ChevronRight, ChevronLeft, RotateCcw, Clock, Calendar, ShieldCheck, MapPin, Loader2 } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'

const services = [
  { 
    id: 1, 
    name: 'Car Diagnostics', 
    price: 2500, 
    time: '1 hour',
    icon: '💻',
    description: 'Full vehicle computer diagnostics and 50-point inspection',
    href: '/services/car-diagnostics'
  },
  { 
    id: 2, 
    name: 'Car AC Refilling & Repair', 
    price: 3500, 
    time: '1.5 hours',
    icon: '❄️',
    description: 'AC system pressure test, leak detection and gas refilling',
    href: '/services/car-ac'
  },
  { 
    id: 3, 
    name: 'Car Alarm & Tracker Installation', 
    price: 8500, 
    time: '3 hours',
    icon: '🛡️',
    description: 'High-security alarm systems and real-time GPS tracking installation',
    href: '/services/car-alarm'
  },
  { 
    id: 4, 
    name: 'Paint Work', 
    price: 15000, 
    time: '2-3 days',
    icon: '🎨',
    description: 'Professional scratch repair, panel beating and full body respray',
    href: '/services/paint-work'
  },
  { 
    id: 5, 
    name: 'Standard Car Wash', 
    price: 500, 
    time: '45 mins',
    icon: '🚿',
    description: 'Exterior body wash, interior vacuuming and carpet cleaning',
    href: '#'
  },
  { 
    id: 6, 
    name: 'Oil Change & Service', 
    price: 4500, 
    time: '1.5 hours',
    icon: '🔧',
    description: 'Full engine oil replacement with high quality synthetic oil',
    href: '#'
  }
]

export default function Services() {
  const { data: session } = useSession()
  const [activeRequests, setActiveRequests] = useState<any[]>([])
  const [loadingRequests, setLoadingRequests] = useState(false)

  useEffect(() => {
    if (session) {
      const fetchRequests = async () => {
        setLoadingRequests(true)
        try {
          const response = await fetch('/api/service-requests')
          if (response.ok) {
            const data = await response.json()
            setActiveRequests(data.filter((r: any) => r.status !== 'COMPLETED' && r.status !== 'CANCELLED'))
          }
        } catch (error) {
          console.error('Failed to fetch requests:', error)
        } finally {
          setLoadingRequests(false)
        }
      }
      fetchRequests()
    }
  }, [session])

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans selection:bg-blue-100">
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12">
            <div>
                <h1 className="text-4xl font-black text-gray-900 mb-2 tracking-tight">On-Demand Services</h1>
                <p className="text-lg text-gray-500 font-medium">Professional automotive care delivered to your doorstep</p>
            </div>
            <Link href="/services/request" className="bg-gray-900 text-white px-8 py-4 rounded-xl font-black shadow-lg hover:bg-blue-600 transition-all">
                Request Service
            </Link>
        </div>

        {session && (activeRequests.length > 0 || loadingRequests) && (
          <div className="mb-16">
            <h2 className="text-xl font-black text-gray-900 mb-6 uppercase tracking-widest flex items-center gap-3">
              <Clock className="text-blue-500 w-6 h-6" />
              Active Requests
            </h2>
            {loadingRequests ? (
              <div className="flex items-center gap-3 text-gray-400 font-bold uppercase tracking-widest text-xs">
                <Loader2 className="w-4 h-4 animate-spin" />
                Updating Status...
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {activeRequests.map((request) => (
                  <div key={request.id} className="bg-white p-6 rounded-2xl border border-blue-100 shadow-sm flex flex-col gap-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-black text-gray-900 uppercase text-sm">{request.serviceType}</h4>
                        <p className="text-xs text-gray-500 font-bold mt-1 uppercase tracking-tight">{request.carDetails}</p>
                      </div>
                      <span className={`text-[10px] px-2 py-1 rounded-full font-black uppercase tracking-widest ${
                        request.status === 'APPROVED' ? 'bg-green-100 text-green-700' : 
                        request.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-700' : 
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {request.status.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-400 font-bold">
                      <MapPin className="w-3 h-3" />
                      {request.location}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <div key={service.id} className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
              <Link href={service.href}>
                <div className="text-6xl mb-6 cursor-pointer">{service.icon}</div>
                <h3 className="text-xl font-black text-gray-900 mb-2 uppercase hover:text-blue-600 transition-colors cursor-pointer">{service.name}</h3>
              </Link>
              <p className="text-gray-500 font-bold mb-6 min-h-[48px]">
                {service.description}
              </p>
              
              <div className="flex flex-col gap-4 border-t pt-6">
                <div className="flex justify-between items-center text-sm font-black uppercase tracking-widest text-gray-400">
                    <span className="flex items-center gap-2"><Clock className="w-4 h-4" /> {service.time}</span>
                    <span className="text-blue-600 text-2xl">Ksh {service.price.toLocaleString()}</span>
                </div>
                
                <Link 
                  href={`/services/request?type=${encodeURIComponent(service.name)}`}
                  className="w-full mt-4 bg-blue-500 text-white py-4 rounded-xl font-black hover:bg-blue-600 transition-all shadow-blue-100 shadow-xl flex items-center justify-center gap-3"
                >
                  <MapPin className="w-5 h-5" />
                  Request Now
                </Link>
              </div>
            </div>
          ))}
        </div>

        <section className="mt-20 bg-[#2c3e50] rounded-3xl p-12 text-white relative overflow-hidden">
            <div className="relative z-10 flex flex-col md:flex-row gap-12 items-center">
                <div className="flex-1">
                    <h2 className="text-3xl font-black mb-6 uppercase tracking-tight">How it works</h2>
                    <div className="space-y-8">
                        {[
                            { step: '01', title: 'Choose Service', desc: 'Select from our wide range of automotive services' },
                            { step: '02', title: 'Set Location', desc: 'Tell us where your car is parked (Home or Office)' },
                            { step: '03', title: 'Expert Arrives', desc: 'Our certified professional arrives and completes the task' }
                        ].map((item) => (
                            <div key={item.step} className="flex gap-6 items-start">
                                <span className="text-4xl font-black text-blue-500">{item.step}</span>
                                <div>
                                    <h4 className="text-lg font-black uppercase mb-1">{item.title}</h4>
                                    <p className="text-gray-400 font-medium">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="flex-1 bg-white/5 p-8 rounded-2xl backdrop-blur-sm border border-white/10 w-full">
                    <h3 className="text-xl font-black mb-6 flex items-center gap-3">
                        <ShieldCheck className="text-blue-500 w-6 h-6" />
                        Our Guarantee
                    </h3>
                    <ul className="space-y-4 text-gray-300 font-medium">
                        <li>• Certified Automotive Professionals</li>
                        <li>• Genuine Parts & Consumables</li>
                        <li>• Transparent Fixed Pricing</li>
                        <li>• Service Warranty Included</li>
                    </ul>
                </div>
            </div>
        </section>
      </main>
    </div>
  )
}
