import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function AdminFleetPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") return null;

  const [tiers, vehicles, drivers] = await Promise.all([
    prisma.vehicleTier.findMany({ include: { vehicles: true } }),
    prisma.vehicle.findMany({ include: { vehicleTier: true } }),
    prisma.driver.findMany(),
  ]);

  return (
    <div className="min-h-screen bg-[#0A0A0A] p-6 text-white lg:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="font-display text-3xl text-[var(--gold)]">Fleet & Pricing</h1>
          <Link href="/admin" className="text-sm text-gray-400 hover:text-[var(--gold)]">← Back</Link>
        </div>

        <h2 className="mb-4 text-lg text-[var(--gold)]">Vehicle Tiers</h2>
        <div className="mb-12 grid gap-4 md:grid-cols-3">
          {tiers.map((tier) => (
            <div key={tier.id} className="card-luxury">
              <h3 className="font-display text-xl text-[var(--gold)]">{tier.nameEn}</h3>
              <p className="text-sm text-gray-400">{tier.descriptionEn}</p>
              <p className="mt-2 text-xs text-gray-500">
                {tier.minPassengers}-{tier.maxPassengers} passengers
              </p>
              {tier.basePrice && (
                <p className="mt-2 text-[var(--gold-light)]">From SAR {tier.basePrice}</p>
              )}
            </div>
          ))}
        </div>

        <h2 className="mb-4 text-lg text-[var(--gold)]">Vehicles</h2>
        <div className="mb-12 grid gap-4 sm:grid-cols-2">
          {vehicles.map((v) => (
            <div key={v.id} className="card-luxury">
              <p className="font-semibold">{v.name}</p>
              <p className="text-sm text-gray-400">{v.model} • {v.vehicleTier.nameEn}</p>
              <p className={`mt-2 text-xs ${v.isActive ? "text-green-400" : "text-red-400"}`}>
                {v.isActive ? "Active" : "Inactive"}
              </p>
            </div>
          ))}
        </div>

        <h2 className="mb-4 text-lg text-[var(--gold)]">Drivers</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {drivers.map((d) => (
            <div key={d.id} className="card-luxury">
              <p className="font-semibold">{d.name}</p>
              <p className="text-sm text-gray-400">{d.phone}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
