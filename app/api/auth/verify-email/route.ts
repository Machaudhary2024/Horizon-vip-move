import { NextResponse } from "next/server";
import crypto from "node:crypto";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  email: z.string().email(),
  code: z.string().regex(/^\d{6}$/),
});

export async function POST(request: Request) {
  try {
    const data = schema.parse(await request.json());
    const email = data.email.trim().toLowerCase();
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || user.emailVerified) {
      return NextResponse.json({ success: true });
    }

    const tokenHash = crypto.createHash("sha256").update(data.code).digest("hex");
    const token = await prisma.emailVerificationToken.findFirst({
      where: { userId: user.id, tokenHash, expiresAt: { gt: new Date() } },
    });

    if (!token) {
      return NextResponse.json({ error: "Invalid or expired code" }, { status: 400 });
    }

    await prisma.$transaction([
      prisma.user.update({ where: { id: user.id }, data: { emailVerified: new Date() } }),
      prisma.emailVerificationToken.deleteMany({ where: { userId: user.id } }),
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid verification code" }, { status: 400 });
    }
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}