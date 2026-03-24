export const KENYAN_CITIES = [
  "Nairobi",
  "Mombasa",
  "Kisumu",
  "Nakuru",
  "Eldoret",
  "Thika",
  "Malindi",
  "Kitale",
  "Garissa",
  "Kakamega",
  "Machakos",
  "Meru",
  "Nyeri",
  "Naivasha",
  "Kiambu"
] as const;

export type KenyanCity = typeof KENYAN_CITIES[number];

export const CAR_FEATURES = [
  "AC",
  "Sunroof",
  "Leather Seats",
  "Backup Camera",
  "Bluetooth",
  "Navigation System",
  "Heated Seats",
  "Third Row Seating",
  "Luxury",
  "SUV",
  "4WD/AWD"
] as const;

export type CarFeature = typeof CAR_FEATURES[number];

export const LISTING_PACKAGES = {
  FREE: {
    id: "FREE",
    name: "Free Package",
    price: 0,
    listingLimit: 3,
    featured: false,
    durationDays: 30,
    priorityVisibility: false,
  },
  PREMIUM: {
    id: "PREMIUM",
    name: "Premium Package",
    price: 2000,
    listingLimit: 10,
    featured: true,
    durationDays: 90,
    priorityVisibility: true,
  },
} as const;

export type ListingPackageId = keyof typeof LISTING_PACKAGES;
