import Image from 'next/image'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { 
  Phone, MessageCircle, Mail, MapPin, 
  CheckCircle2, Scale, Heart, Share2,
  Calendar, Gauge, Fuel, Settings2,
  User, Car, Check, ChevronRight,
  ShieldCheck, PenTool, Users
} from 'lucide-react'

export default async function CarDetailPage({ params }: { params: { id: string } }) {
  const car = await prisma.listing.findUnique({
    where: { id: params.id },
    include: {
      user: {
        select: {
          name: true,
          phone: true,
          email: true
        }
      }
    }
  })

  if (!car) {
    notFound()
  }

  let imageUrls = []
  try {
    imageUrls = JSON.parse(car.images)
  } catch (e) {
    imageUrls = car.images ? [car.images] : []
  }

  let features: string[] = []
  try {
    features = JSON.parse(car.features)
  } catch (e) {
    features = car.features ? car.features.split(',').map((f: string) => f.trim()) : []
  }

  const mainImage = imageUrls[0] || 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=1200&q=80'

  return (
    <div className="min-h-screen bg-white">
      {/* Top Banner Features */}
      <div className="bg-gray-50 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <h3 className="text-sm font-black text-gray-900">Wide Range of Brands</h3>
                <p className="text-xs text-gray-500">Our service department maintain your vehicle.</p>
              </div>
            </div>
            <div className="flex items-center gap-4 border-l pl-8 border-gray-200">
              <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
                <PenTool className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <h3 className="text-sm font-black text-gray-900">Car Service & Maintenance</h3>
                <p className="text-xs text-gray-500">Stay safe on the road for many more years.</p>
              </div>
            </div>
            <div className="flex items-center gap-4 border-l pl-8 border-gray-200">
              <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <h3 className="text-sm font-black text-gray-900">Trusted by Thousands</h3>
                <p className="text-xs text-gray-500">Department maintain your car to stay safe.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Car Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-black text-gray-900 mb-2 uppercase tracking-tight">{car.title}</h1>
          <div className="flex items-center gap-2 text-gray-400 text-xs font-bold uppercase tracking-widest">
            <Calendar className="w-3.5 h-3.5" />
            ADDED: {new Date(car.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Image Gallery */}
            <div className="relative aspect-[16/9] rounded-xl overflow-hidden mb-6 group border border-gray-100 shadow-sm">
              <Image 
                src={mainImage} 
                alt={car.title} 
                fill 
                className="object-cover"
              />
              {car.featured && (
                <div className="absolute top-6 right-0 bg-yellow-400 text-black text-[10px] font-black px-10 py-2.5 -rotate-45 translate-x-10 translate-y-0 origin-center shadow-xl uppercase tracking-[0.2em] z-20">
                  DEAL
                </div>
              )}
            </div>

            <div className="grid grid-cols-5 gap-4 mb-12">
              {imageUrls.map((url: string, index: number) => (
                <div key={index} className="relative aspect-[4/3] rounded-lg overflow-hidden border border-gray-100 cursor-pointer hover:border-blue-500 transition-all">
                  <Image src={url} alt={`${car.title} - ${index + 1}`} fill className="object-cover" />
                </div>
              ))}
            </div>

            {/* Car Summary Section */}
            <div className="mb-16">
              <div className="flex flex-col md:flex-row items-start gap-12">
                <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tight w-full md:w-48 shrink-0">Car summary</h2>
                <div className="flex-1 w-full">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-x-12 gap-y-10">
                    {[
                      { icon: <User className="w-5 h-5" />, label: 'Condition', value: car.condition },
                      { icon: <PenTool className="w-5 h-5" />, label: 'Make', value: car.make },
                      { icon: <Car className="w-5 h-5" />, label: 'Body', value: 'Other' },
                      { icon: <Calendar className="w-5 h-5" />, label: 'Year', value: car.year },
                      { icon: <Gauge className="w-5 h-5" />, label: 'Mileage', value: car.mileage ? `${car.mileage.toLocaleString()} km` : 'N/A' },
                      { icon: <Settings2 className="w-5 h-5" />, label: 'Transmission', value: car.transmission },
                      { icon: <Car className="w-5 h-5" />, label: 'Engine', value: 'N/A' },
                      { icon: <Car className="w-5 h-5" />, label: 'Exterior C...', value: 'N/A' },
                      { icon: <Fuel className="w-5 h-5" />, label: 'Fuel type', value: car.fuelType },
                      { icon: <Car className="w-5 h-5" />, label: 'Drive', value: 'N/A' },
                      { icon: <Car className="w-5 h-5" />, label: 'Registered', value: 'N/A' },
                      { icon: <Users className="w-5 h-5" />, label: 'Stock id', value: car.id.slice(-4) },
                    ].map((spec: any, i: number) => (
                      <div key={i} className="flex items-center gap-4">
                        <div className="text-blue-500 shrink-0">{spec.icon}</div>
                        <div>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{spec.label}</p>
                          <p className="text-sm font-black text-gray-900">{spec.value || 'N/A'}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Sections */}
            {[
              { id: 'highlights', title: 'Car highlights' },
              { id: 'features', title: 'Car features', items: features },
              { id: 'overview', title: 'Car overview', content: car.description },
              { id: 'location', title: 'Car location' },
              { id: 'loan', title: 'Loan calculator' }
            ].map((section: any) => (
              <div key={section.id} className="mb-12 pt-12 border-t border-gray-100">
                <div className="flex flex-col md:flex-row items-start gap-12">
                  <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tight w-full md:w-48 shrink-0">{section.title}</h2>
                  <div className="flex-1 w-full">
                    {section.id === 'features' && section.items && (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-y-4">
                        {(section.items as string[]).map((feature: string, i: number) => (
                          <div key={i} className="flex items-center gap-3">
                            <Check className="w-4 h-4 text-blue-500" />
                            <span className="text-sm font-bold text-gray-600">{feature}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    {section.id === 'overview' && section.content && (
                      <div className="prose prose-sm max-w-none text-gray-600 font-medium leading-relaxed">
                        <ul className="list-disc pl-5 space-y-2">
                          {section.content.split('\n').filter((l: string) => l.trim()).map((line: string, i: number) => (
                            <li key={i}>{line}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {section.id === 'location' && (
                      <div className="space-y-6">
                        <div className="bg-gray-50 h-64 rounded-xl flex items-center justify-center border border-gray-100">
                           <div className="flex flex-col items-center gap-2">
                             <MapPin className="w-8 h-8 text-gray-300" />
                             <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{car.location}</p>
                           </div>
                        </div>
                        <div className="flex justify-end">
                          <Link href={`https://wa.me/254${car.user.phone.slice(-9)}`} className="bg-[#25D366] text-white px-8 py-4 rounded-xl font-black flex items-center gap-3 shadow-[0_20px_40px_rgba(37,211,102,0.3)] hover:scale-105 transition-all">
                            <span>WhatsApp Us**</span>
                            <MessageCircle className="w-7 h-7 fill-white text-[#25D366]" />
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}


            {/* Contact Form */}
            <div className="bg-gray-50 p-10 rounded-xl mt-20">
              <form className="space-y-6">
                <textarea 
                  placeholder="Your Message" 
                  rows={4}
                  className="w-full border border-gray-200 p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                ></textarea>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="text-[11px] font-black uppercase tracking-widest mb-2 block">Name</label>
                    <input type="text" placeholder="Your name..." className="w-full border border-gray-200 p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium" />
                  </div>
                  <div>
                    <label className="text-[11px] font-black uppercase tracking-widest mb-2 block">Email*</label>
                    <input type="email" placeholder="Your email..." className="w-full border border-gray-200 p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium" />
                  </div>
                  <div>
                    <label className="text-[11px] font-black uppercase tracking-widest mb-2 block">Phone</label>
                    <input type="text" placeholder="Your Phone" className="w-full border border-gray-200 p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium" />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="privacy" className="w-4 h-4" />
                  <label htmlFor="privacy" className="text-xs font-bold text-gray-500">I accept the privacy policy</label>
                </div>
                <button className="bg-blue-600 text-white px-10 py-4 rounded-lg font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-100">
                  Send Message
                </button>
              </form>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <div className="bg-white p-8 border border-gray-100 rounded-xl shadow-sm">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-gray-400" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-gray-900 leading-tight">{car.user.name}</h3>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Private Seller</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-4 text-2xl font-black text-gray-900">
                  <Phone className="w-6 h-6 text-blue-500" />
                  +{car.user.phone}
                </div>
                <button className="w-full bg-white border border-gray-200 p-4 rounded-lg flex items-center justify-center gap-3 text-xs font-black uppercase tracking-widest hover:bg-gray-50 transition-colors">
                  <Mail className="w-4 h-4 text-blue-500" />
                  Message Us
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Motors Cars Quality Section */}
      <div className="bg-white py-32 border-t border-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-black text-gray-900 mb-6 uppercase tracking-tight">Motors Cars Quality</h2>
          <p className="text-gray-400 max-w-3xl mx-auto mb-20 font-medium leading-relaxed">
            Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2 000 years old.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-y-16 gap-x-12">
            {[
              { title: 'Passed our thorough 300 point inspection', desc: '' },
              { title: 'The Motors A minimum of 2.5mm tyre treads', desc: '' },
              { title: 'Completed a road test by our technicians', desc: '' },
              { title: 'Had a recent service or MOT, if required', desc: '' },
              { title: 'All Vehicle Photos of imperfections, if needed', desc: '' },
              { title: 'Been reconditioned to our high standards', desc: '' },
            ].map((item: any, i: number) => (
              <div key={i} className="flex flex-col items-start text-left">
                <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle2 className="w-6 h-6 text-blue-500" />
                </div>
                <h3 className="text-lg font-black text-gray-900 leading-tight mb-4">{item.title}</h3>
                <p className="text-sm text-gray-500 font-medium">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
