export interface User {
  id: string
  name: string
  email: string
  phone: string
  location: string
  role: 'USER' | 'ADMIN'
}

export interface Listing {
  id: string
  type: 'SALE' | 'HIRE'
  title: string
  description: string
  price?: number
  make?: string
  model?: string
  year?: number
  mileage?: number
  condition?: string
  transmission?: string
  fuelType?: string
  location: string
  images: string[]
  availability?: string
  features: string[]
  pickupDelivery?: string
  approved: boolean
  featured: boolean
  package: 'FREE' | 'PREMIUM'
  userId: string
  createdAt: Date
}

export interface ServiceRequest {
  id: string
  serviceType: string
  carDetails: string
  location: string
  preferredTime?: string
  status: 'PENDING' | 'APPROVED' | 'COMPLETED' | 'CANCELLED'
  userId: string
  createdAt: Date
}