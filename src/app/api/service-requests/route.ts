import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await req.json();
    const { name, phoneNumber, serviceType, carDetails, location, locationType, preferredTime } = body;

    if (!serviceType || !carDetails || !location) {
      return new NextResponse('Missing required fields', { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return new NextResponse('User not found', { status: 404 });
    }

    // Basic automatic assignment logic: pick the first available technician
    const technician = await prisma.user.findFirst({
      where: { role: 'TECHNICIAN' }
    });

    const request = await prisma.serviceRequest.create({
      data: {
        userId: user.id,
        name,
        phoneNumber,
        serviceType,
        carDetails,
        location,
        locationType: locationType || "Home",
        preferredTime,
        assignedToId: technician?.id,
        status: technician ? 'ASSIGNED' : 'PENDING',
      },
    });

    return NextResponse.json(request);
  } catch (error) {
    console.error('Service request request error:', error);
    return new NextResponse('Internal server error', { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return new NextResponse('User not found', { status: 404 });
    }

    const requests = await prisma.serviceRequest.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(requests);
  } catch (error) {
    console.error('Service request fetch error:', error);
    return new NextResponse('Internal server error', { status: 500 });
  }
}
