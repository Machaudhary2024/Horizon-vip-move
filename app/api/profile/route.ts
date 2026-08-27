import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const schema = z.object({ name: z.string().min(2), phone: z.string().min(8) });

export async function PATCH(request: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const data = schema.parse(await request.json());
    const user = await prisma.user.update({ where: { id: session.user.id }, data, select: { name: true, email: true, phone: true } });
    return NextResponse.json(user);
  } catch {
    return NextResponse.json({ error: "Invalid profile details" }, { status: 400 });
  }
}