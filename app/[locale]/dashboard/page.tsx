import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import BookingStatusTracker from "@/components/booking/BookingStatusTracker";
import { Link } from "@/i18n/navigation";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/en/login");

  const bookings = await prisma.booking.findMany({
    where: { userId: session.user.id },
    include: { vehicleTier: true },
    orderBy: { createdAt: "desc" },
  });

  const t = await getTranslations("booking");
  const ts = await getTranslations("status");

  return (
    <div className="section-padding">
      <div className="mx-auto max-w-4xl">
        <h1 className="font-display mb-8 text-center text-3xl text-[var(--gold)]">
          {t("statusTitle")}
        </h1>

        {bookings.length === 0 ? (
          <div className="card-luxury text-center">
            <p className="mb-4 text-gray-400">{t("noBookings")}</p>
            <Link href="/booking" className="btn-primary">
              {t("title")}
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {bookings.map((booking) => (
              <div key={booking.id} className="card-luxury">
                <div className="mb-6 flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="text-xs text-gray-500">ID: {booking.id.slice(0, 8)}</p>
                    <p className="font-display text-lg text-[var(--gold)]">
                      {booking.vehicleTier.nameEn}
                    </p>
                  </div>
                  <span className="rounded bg-[var(--gold-muted)] px-3 py-1 text-xs text-[var(--gold)]">
                    {ts(booking.status)}
                  </span>
                </div>
                <p className="mb-2 text-sm text-gray-400">
                  {new Date(booking.pickupDate).toLocaleDateString()} • {booking.pickupLocation} → {booking.dropoffLocation}
                </p>
                <BookingStatusTracker currentStatus={booking.status} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
