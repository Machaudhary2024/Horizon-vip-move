import { NextResponse } from "next/server";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  token: z.string().min(1),
  password: z.string().min(8).regex(/[A-Z]/).regex(/[a-z]/).regex(/[0-9]/).regex(/[^A-Za-z0-9]/),
});

export async function POST(request: Request) {
  try {
    const data = schema.parse(await request.json());
    const tokenHash = crypto.createHash("sha256").update(data.token).digest("hex");
    const resetToken = await prisma.passwordResetToken.findUnique({ where: { tokenHash } });
    if (!resetToken || resetToken.expiresAt < new Date()) {
      return NextResponse.json({ error: "This reset link is invalid or expired" }, { status: 400 });
    }

    await prisma.user.update({ where: { id: resetToken.userId }, data: { password: await bcrypt.hash(data.password, 12) } });
    await prisma.passwordResetToken.delete({ where: { id: resetToken.id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Unable to reset password" }, { status: 400 });
  }
}