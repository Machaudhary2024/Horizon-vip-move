import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendEmail, statusUpdateEmail } from "@/lib/email";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { status, driverId, vehicleId, quotedPrice } = body;

    const booking = await prisma.booking.update({
      where: { id },
      data: {
        ...(status && { status }),
        ...(driverId && { driverId }),
        ...(vehicleId && { vehicleId }),
        ...(quotedPrice !== undefined && { quotedPrice }),
      },
      include: { user: true },
    });

    if (status) {
      await sendEmail({
        to: booking.user.email,
        subject: `Booking Update - ${status}`,
        html: statusUpdateEmail({
          customerName: booking.user.name,
          bookingId: booking.id,
          status,
        }),
      });
    }

    return NextResponse.json(booking);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}
