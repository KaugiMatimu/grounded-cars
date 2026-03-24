import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { LISTING_PACKAGES } from "@/lib/constants";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { 
      type, title, description, price, make, model, 
      year, mileage, condition, transmission, 
      fuelType, location, images, features, availability,
      pickupDelivery, package: listingPackage = "FREE"
    } = body;

    if (!type || !title || !description || !location) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    // Check listing limits for Free package
    if (listingPackage === "FREE") {
      const freeListingsCount = await prisma.listing.count({
        where: {
          userId: (session.user as any).id,
          package: "FREE"
        }
      });

      if (freeListingsCount >= LISTING_PACKAGES.FREE.listingLimit) {
        return new NextResponse("Free listing limit reached", { status: 403 });
      }
    }

    const packageConfig = LISTING_PACKAGES[listingPackage as keyof typeof LISTING_PACKAGES] || LISTING_PACKAGES.FREE;

    const listing = await prisma.listing.create({
      data: {
        type,
        title,
        description,
        price: price ? parseFloat(price) : null,
        make,
        model,
        year: year ? parseInt(year) : null,
        mileage: mileage ? parseInt(mileage) : null,
        condition,
        transmission,
        fuelType,
        location,
        images,
        features,
        availability,
        pickupDelivery,
        package: listingPackage,
        featured: packageConfig.featured,
        userId: (session.user as any).id
      }
    });

    return NextResponse.json(listing);
  } catch (error) {
    console.error("Listing creation error:", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const make = searchParams.get('make');
    const model = searchParams.get('model');
    const year = searchParams.get('year');
    const condition = searchParams.get('condition');
    const type = searchParams.get('type');
    const fuelType = searchParams.get('fuelType');
    const transmission = searchParams.get('transmission');
    const query = searchParams.get('query');
    const ids = searchParams.get('ids');

    const where: any = {
      approved: true,
    };

    if (ids) {
      where.id = { in: ids.split(',') };
      // Allow fetching even if not approved when querying by IDs?
      // For now, keep it approved only for safety unless user needs it.
    }

    if (make) where.make = { contains: make };
    if (model) where.model = { contains: model };
    if (year) where.year = parseInt(year);
    if (condition) where.condition = { contains: condition };
    if (type) where.type = { contains: type };
    if (fuelType) where.fuelType = { contains: fuelType };
    if (transmission) where.transmission = { contains: transmission };
    if (query) {
      where.OR = [
        { title: { contains: query } },
        { description: { contains: query } },
        { make: { contains: query } },
        { model: { contains: query } },
      ];
    }

    const listings = await prisma.listing.findMany({
      where,
      include: {
        user: {
          select: {
            name: true,
            email: true,
            phone: true,
            location: true
          }
        }
      },
      orderBy: [
        { featured: 'desc' },
        { createdAt: 'desc' }
      ]
    });
    return NextResponse.json(listings);
  } catch (error) {
    console.error("Fetch listings error:", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
