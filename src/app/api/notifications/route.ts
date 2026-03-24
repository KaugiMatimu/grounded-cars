import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const notifications = await prisma.notification.findMany({
      where: {
        userId: (session.user as any).id
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(notifications);
  } catch (error) {
    console.error("Fetch notifications error:", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { id, read } = body;

    if (id) {
      // Mark specific notification as read
      const notification = await prisma.notification.update({
        where: { id },
        data: { read }
      });
      return NextResponse.json(notification);
    } else {
      // Mark all as read
      await prisma.notification.updateMany({
        where: { userId: (session.user as any).id, read: false },
        data: { read: true }
      });
      return new NextResponse("All notifications marked as read", { status: 200 });
    }
  } catch (error) {
    console.error("Update notification error:", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
