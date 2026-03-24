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

    const unreadCount = await prisma.notification.count({
      where: {
        userId: (session.user as any).id,
        read: false
      }
    });

    return NextResponse.json({ count: unreadCount });
  } catch (error) {
    console.error("Unread notifications count error:", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
