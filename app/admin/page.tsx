import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import AdminBookingTable from "@/components/admin/AdminBookingTable";
import Link from "next/link";

export default async function AdminPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return null;
  }

  const [bookings, drivers, vehicles, stats] = await Promise.all([
    prisma.booking.findMany({
      include: {
        user: true,
        vehicleTier: true,
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.driver.findMany({ where: { isActive: true } }),
    prisma.vehicle.findMany({ where: { isActive: true }, include: { vehicleTier: true } }),
    prisma.booking.groupBy({
      by: ["status"],
      _count: true,
    }),
  ]);

  const pending = stats.find((s) => s.status === "PENDING")?._count ?? 0;
  const total = bookings.length;

  return (
    <div className="min-h-screen bg-[#0A0A0A] p-6 text-white lg:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <h1 className="font-display text-3xl text-[var(--gold)]">Admin Dashboard</h1>
          <nav className="flex gap-4 text-sm">
            <Link href="/admin" className="text-[var(--gold)]">Overview</Link>
            <Link href="/admin/bookings" className="text-gray-400 hover:text-[var(--gold)]">Bookings</Link>
            <Link href="/admin/fleet" className="text-gray-400 hover:text-[var(--gold)]">Fleet</Link>
            <Link href="/en" className="text-gray-400 hover:text-[var(--gold)]">View Site</Link>
          </nav>
        </div>

        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <div className="card-luxury">
            <p className="text-xs uppercase text-gray-500">Total Bookings</p>
            <p className="font-display text-3xl text-[var(--gold)]">{total}</p>
          </div>
          <div className="card-luxury">
            <p className="text-xs uppercase text-gray-500">Pending</p>
            <p className="font-display text-3xl text-[var(--gold-light)]">{pending}</p>
          </div>
          <div className="card-luxury">
            <p className="text-xs uppercase text-gray-500">Active Drivers</p>
            <p className="font-display text-3xl text-[var(--gold)]">{drivers.length}</p>
          </div>
        </div>

        <h2 className="mb-4 font-display text-xl text-[var(--gold)]">Recent Bookings</h2>
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
