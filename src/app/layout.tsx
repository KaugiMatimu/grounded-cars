import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'
import AuthProvider from '@/components/providers/AuthProvider'
import { CompareProvider } from '@/components/providers/CompareProvider'
import Navbar from '@/components/layout/Navbar'
import WhatsAppBar from '@/components/layout/WhatsAppBar'
import Footer from '@/components/layout/Footer'
import './globals.css'

const poppins = Poppins({ 
  subsets: ['latin'], 
  weight: ['400', '500', '600', '700', '800', '900'] 
})

export const metadata: Metadata = {
  title: 'Grounded Cars KE | Discover and List Grounded in Kenya Effortlessly ',
  description: 'Comprehensive automotive marketplace and service platform',
  icons: {
    icon: '/images/car-logos/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={poppins.className}>
        <AuthProvider>
          <CompareProvider>
            <Navbar />
            <WhatsAppBar />
            <main>
              {children}
            </main>
            <Footer />
          </CompareProvider>
        </AuthProvider>
      </body>
    </html>
  )
}