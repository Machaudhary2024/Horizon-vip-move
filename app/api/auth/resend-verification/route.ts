import { NextResponse } from "next/server";
import crypto from "node:crypto";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email";

const schema = z.object({ email: z.string().email() });

export async function POST(request: Request) {
  try {
    const { email: rawEmail } = schema.parse(await request.json());
    const email = rawEmail.trim().toLowerCase();
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || user.emailVerified) return NextResponse.json({ success: true });

    const otp = crypto.randomInt(100000, 1000000).toString();
    const tokenHash = crypto.createHash("sha256").update(otp).digest("hex");
    await prisma.$transaction([
      prisma.emailVerificationToken.deleteMany({ where: { userId: user.id } }),
      prisma.emailVerificationToken.create({
        data: {
          tokenHash,
          userId: user.id,
          expiresAt: new Date(Date.now() + 10 * 60 * 1000),
        },
      }),
    ]);

    await sendEmail({
      to: user.email,
      subject: "Your new Horizon-VIP-Move verification code",
      html: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;"><h2>Verify your email</h2><p>Your new verification code is:</p><p style="font-size: 32px; letter-spacing: 8px; font-weight: bold;">${otp}</p><p>This code expires in 10 minutes.</p></div>`,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }
    return NextResponse.json({ error: "Unable to resend code" }, { status: 500 });
  }
}