import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import crypto from "node:crypto";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { rateLimitMiddleware } from "@/lib/rate-limit";
import { sendEmail } from "@/lib/email";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(8),
  password: z.string().min(8).regex(/[A-Z]/).regex(/[a-z]/).regex(/[0-9]/).regex(/[^A-Za-z0-9]/),
});

export async function POST(request: Request) {
  try {
    const rateLimit = await rateLimitMiddleware(request, "register");
    if (!rateLimit.allowed) return rateLimit.response;

    const body = await request.json();
    const data = schema.parse({
      ...body,
      email: typeof body.email === "string" ? body.email.trim().toLowerCase() : body.email,
    });

    const existing = await prisma.user.findUnique({ where: { email: data.email } });
    if (existing) {
      return NextResponse.json({ error: "Email already registered" }, { status: 400 });
    }

    const hashed = await bcrypt.hash(data.password, 12);
    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        password: hashed,
        role: "CUSTOMER",
      },
    });

    const otp = crypto.randomInt(100000, 1000000).toString();
    const tokenHash = crypto.createHash("sha256").update(otp).digest("hex");
    await prisma.emailVerificationToken.create({
      data: {
        tokenHash,
        userId: user.id,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      },
    });

    await sendEmail({
      to: user.email,
      subject: "Verify your Horizon-VIP-Move account",
      html: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;"><h2>Verify your email</h2><p>Your verification code is:</p><p style="font-size: 32px; letter-spacing: 8px; font-weight: bold;">${otp}</p><p>This code expires in 10 minutes.</p></div>`,
    });

    return NextResponse.json({ success: true, email: user.email });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}
