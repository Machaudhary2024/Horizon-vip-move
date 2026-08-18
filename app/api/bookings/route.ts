import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendEmail, bookingNotificationEmail } from "@/lib/email";

const schema = z.object({
  pickupDate: z.string(),
  pickupTime: z.string(),
  pickupLocation: z.string().min(2),
  dropoffLocation: z.string().min(2),
  route: z.enum([
    "EASTERN_TO_BAHRAIN",
    "BAHRAIN_TO_EASTERN",
    "RIYADH_TO_BAHRAIN",
    "BAHRAIN_TO_RIYADH",
    "EASTERN_TO_RIYADH",
    "RIYADH_TO_EASTERN",
    "CUSTOM",
  ]),
  passengers: z.number().min(1).max(7),
  vehicleTierId: z.string(),
  notes: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const data = schema.parse(body);

    const booking = await prisma.booking.create({
      data: {
        userId: session.user.id,
        vehicleTierId: data.vehicleTierId,
        route: data.route,
        pickupDate: new Date(data.pickupDate),
        pickupTime: data.pickupTime,
        pickupLocation: data.pickupLocation,
        dropoffLocation: data.dropoffLocation,
        passengers: data.passengers,
        notes: data.notes || null,
        status: "PENDING",
      },
      include: { user: true },
    });

    const admin = await prisma.user.findFirst({ where: { role: "ADMIN" } });
    const emailHtml = bookingNotificationEmail({
      bookingId: booking.id,
      customerName: booking.user.name,
      pickupDate: data.pickupDate,
      pickupLocation: data.pickupLocation,
      dropoffLocation: data.dropoffLocation,
      isAdmin: true,
    });

    if (admin?.email) {
      await sendEmail({
        to: admin.email,
        subject: `New Booking Request - ${booking.id.slice(0, 8)}`,
        html: emailHtml,
      });
    }

    await sendEmail({
      to: booking.user.email,
      subject: "Booking Request Received - Horizon-VIP-Move",
      html: bookingNotificationEmail({
        bookingId: booking.id,
        customerName: booking.user.name,
        pickupDate: data.pickupDate,
        pickupLocation: data.pickupLocation,
        dropoffLocation: data.dropoffLocation,
      }),
    });

    return NextResponse.json(booking);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }
    console.error(error);
    return NextResponse.json({ error: "Failed to create booking" }, { status: 500 });
  }
}

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const bookings = await prisma.booking.findMany({
    where: { userId: session.user.id },
    include: { vehicleTier: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(bookings);
}
