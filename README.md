# GroundedCars Platform

A comprehensive automotive marketplace and service platform built with Next.js.

## Features

- User registration and authentication
- Vehicle marketplace (cars for sale and hire)
- On-demand automotive services
- Admin panel for management
- M-Pesa payment integration
- Listing packages for monetization

## Tech Stack

- Frontend: Next.js 14, React 18, TypeScript, Tailwind CSS
- Backend: Next.js API routes
- Database: Prisma with PostgreSQL
- Authentication: NextAuth.js
- Payments: M-Pesa integration
- Image Upload: Cloudinary

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables in `.env.local`:
   ```
   DATABASE_URL="postgresql://..."
   NEXTAUTH_SECRET="..."
   NEXTAUTH_URL="http://localhost:3000"
   CLOUDINARY_CLOUD_NAME="..."
   CLOUDINARY_API_KEY="..."
   CLOUDINARY_API_SECRET="..."
   MPESA_CONSUMER_KEY="..."
   MPESA_CONSUMER_SECRET="..."
   MPESA_SHORTCODE="..."
   ```

3. Run Prisma migrations:
   ```bash
   npx prisma migrate dev
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## Project Structure

- `src/app` - Next.js app router pages
- `src/components` - Reusable UI components
- `src/lib` - Utility functions and configurations
- `src/types` - TypeScript type definitions
- `src/utils` - Helper functions

## Development Phases

1. Set up project structure and dependencies
2. Implement user authentication
3. Create database schema with Prisma
4. Build vehicle listing features (sale and hire)
5. Implement service request system
6. Develop admin panel
7. Integrate M-Pesa payments
8. Add listing packages and monetization
9. Testing and deployment

## API Endpoints

- `/api/auth` - Authentication
- `/api/listings` - Vehicle listings
- `/api/services` - Service requests
- `/api/admin` - Admin functions
- `/api/payments` - Payment processing

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make changes and test
4. Submit a pull request

## License

MIT License