import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { name, email, password, phone, location } = await req.json();

    if (!name || !email || !password || !phone || !location) {
      return new Response("All fields are required", { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({
      where: {
        email
      }
    });

    if (existingUser) {
      return new Response("User already exists", { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        phone,
        location
      }
    });

    return new Response(JSON.stringify(user), { status: 201 });
  } catch (error) {
    console.error("Registration error:", error);
    return new Response("Internal server error", { status: 500 });
  }
}
