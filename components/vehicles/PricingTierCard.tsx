"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function PricingTierCard({
  slug,
  titleKey,
  descKey,
}: {
  slug: string;
  titleKey: "privateStage" | "familyStage" | "groupStage";
  descKey: "privateDesc" | "familyDesc" | "groupDesc";
}) {
  const t = useTranslations("vehicles");

  return (
    <div className="card-luxury flex flex-col items-center text-center">
      <h3 className="font-display mb-2 text-xl text-[var(--gold)]">{t(titleKey)}</h3>
      <p className="mb-4 text-sm text-gray-400">{t(descKey)}</p>
      <p className="mb-6 text-xs uppercase tracking-wider text-[var(--gold-light)]">
        {t("pricingTitle")}
      </p>
      <Link href={`/booking?tier=${slug}`} className="btn-primary !text-xs">
        {t("select")}
      </Link>
    </div>
  );
}
