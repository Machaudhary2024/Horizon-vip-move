"use client";

import { useTranslations } from "next-intl";
import VehicleCard from "@/components/vehicles/VehicleCard";
import PricingTierCard from "@/components/vehicles/PricingTierCard";

export default function VehiclesContent() {
  const t = useTranslations("vehicles");

  return (
    <div className="section-padding">
      <div className="mx-auto max-w-7xl">
        <h1 className="font-display mb-4 text-center text-4xl font-bold text-[var(--gold)]">
          {t("title")}
        </h1>

        <div className="mb-16 grid gap-8 md:grid-cols-2">
          <VehicleCard name={t("bmw")} image="/images/poster-hero.png" tierSlug="private" />
          <VehicleCard name={t("escalade")} image="/images/poster-detail.png" tierSlug="family" />
        </div>

        <h2 className="font-display mb-8 text-center text-3xl text-[var(--gold)]">
          {t("pricingTitle")}
        </h2>
        <div className="mb-8 grid gap-6 md:grid-cols-3">
          <PricingTierCard slug="private" titleKey="privateStage" descKey="privateDesc" />
          <PricingTierCard slug="family" titleKey="familyStage" descKey="familyDesc" />
          <PricingTierCard slug="group" titleKey="groupStage" descKey="groupDesc" />
        </div>
        <p className="text-center text-sm text-gray-500">{t("pricingNote")}</p>
      </div>
    </div>
  );
}
