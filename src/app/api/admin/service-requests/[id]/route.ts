import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || (session.user as any).role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { status, assignedToId } = body;

    const updatedRequest = await prisma.serviceRequest.update({
      where: { id: params.id },
      data: { 
        ...(status && { status }),
        ...(assignedToId && { assignedToId: assignedToId === "null" ? null : assignedToId })
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            phone: true
          }
        },
        assignedTo: {
          select: {
            name: true
          }
        }
      }
    });

    if (status === "APPROVED") {
      await prisma.notification.create({
        data: {
          userId: updatedRequest.userId,
          title: "Service Request Approved",
          message: "Service request Approved, Technician Will Contact you in a few"
        }
      });
    }

    return NextResponse.json(updatedRequest);
  } catch (error) {
    return new NextResponse("Internal server error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || (session.user as any).role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await prisma.serviceRequest.delete({
      where: { id: params.id }
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return new NextResponse("Internal server error", { status: 500 });
  }
}
