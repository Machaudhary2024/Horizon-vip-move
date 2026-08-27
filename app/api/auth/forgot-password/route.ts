import { NextResponse } from "next/server";
import crypto from "crypto";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { passwordResetEmail, sendEmail } from "@/lib/email";

const schema = z.object({ email: z.string().email() });

export async function POST(request: Request) {
  const { email } = schema.parse(await request.json());
  const user = await prisma.user.findUnique({ where: { email } });

  if (user) {
    const token = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
    await prisma.passwordResetToken.deleteMany({ where: { userId: user.id } });
    await prisma.passwordResetToken.create({
      data: { userId: user.id, tokenHash, expiresAt: new Date(Date.now() + 60 * 60 * 1000) },
    });

    const baseUrl = process.env.NEXTAUTH_URL || new URL(request.url).origin;
    const resetUrl = `${baseUrl}/en/reset-password?token=${token}`;
    await sendEmail({ to: user.email, subject: "Reset your Horizon-VIP-Move password", html: passwordResetEmail({ resetUrl }) });
  }

  return NextResponse.json({ success: true });
}