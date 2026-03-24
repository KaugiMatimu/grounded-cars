import { Phone, Clock, MapPin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-white py-32 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-5xl font-black mb-4 text-gray-900 tracking-tight">Contact Us</h2>
        <p className="text-gray-400 text-2xl mb-24 font-medium">Where we are and when we&apos;re open</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-20">
          <div className="flex items-center gap-8 group">
            <div className="w-20 h-20 bg-gray-50 rounded-2xl flex items-center justify-center border border-gray-100 shadow-sm group-hover:border-blue-500 group-hover:bg-blue-50 transition-all duration-300">
              <Phone className="w-10 h-10 text-gray-900 group-hover:text-blue-600 transition-colors" />
            </div>
            <span className="text-4xl font-black tracking-tighter text-gray-900">+254727919076</span>
          </div>
          <div className="flex items-center gap-8 group">
            <div className="w-20 h-20 bg-gray-50 rounded-2xl flex items-center justify-center border border-gray-100 shadow-sm group-hover:border-blue-500 group-hover:bg-blue-50 transition-all duration-300">
              <Clock className="w-10 h-10 text-gray-900 group-hover:text-blue-600 transition-colors" />
            </div>
            <div>
              <p className="font-black text-3xl mb-1 text-gray-900">Working Hours</p>
              <p className="text-gray-400 font-black text-xl tracking-widest">24/7</p>
            </div>
          </div>
          <div className="flex items-center gap-8 group">
            <div className="w-20 h-20 bg-gray-50 rounded-2xl flex items-center justify-center border border-gray-100 shadow-sm group-hover:border-blue-500 group-hover:bg-blue-50 transition-all duration-300">
              <MapPin className="w-10 h-10 text-gray-900 group-hover:text-blue-600 transition-colors" />
            </div>
            <div>
              <p className="font-black text-3xl mb-1 text-gray-900">Our Address</p>
              <p className="text-gray-400 font-black text-lg uppercase tracking-wider leading-tight">10700 UTAWALA<br/>NAIROBI, KENYA</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
