import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import AdminBookingTable from "@/components/admin/AdminBookingTable";
import Link from "next/link";

export default async function AdminBookingsPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") return null;

  const [bookings, drivers, vehicles] = await Promise.all([
    prisma.booking.findMany({
      include: { user: true, vehicleTier: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.driver.findMany({ where: { isActive: true } }),
    prisma.vehicle.findMany({ where: { isActive: true } }),
  ]);

  return (
    <div className="min-h-screen bg-[#0A0A0A] p-6 text-white lg:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="font-display text-3xl text-[var(--gold)]">Manage Bookings</h1>
          <Link href="/admin" className="text-sm text-gray-400 hover:text-[var(--gold)]">← Back</Link>
        </div>
        <AdminBookingTable
          bookings={bookings.map((b) => ({
            ...b,
            pickupDate: b.pickupDate.toISOString(),
          }))}
          drivers={drivers}
          vehicles={vehicles}
        />
      </div>
    </div>
  );
}
