import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import BookingForm from "@/components/booking/BookingForm";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function BookingPage() {
  const t = await getTranslations("booking");
  const session = await auth();
  const tiers = await prisma.vehicleTier.findMany({ orderBy: { minPassengers: "asc" } });

  return (
    <div className="section-padding">
      <div className="mx-auto max-w-7xl">
        <h1 className="font-display mb-4 text-center text-4xl font-bold text-[var(--gold)]">
          {t("title")}
        </h1>
        <p className="mb-12 text-center text-gray-400">{t("stepsTitle")}</p>
        <Suspense fallback={<div className="text-center text-gray-500">Loading...</div>}>
          <BookingForm
            tiers={tiers}
            isLoggedIn={!!session?.user}
          />
        </Suspense>
      </div>
    </div>
  );
}
