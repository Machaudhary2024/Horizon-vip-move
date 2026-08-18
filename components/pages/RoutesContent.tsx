"use client";

import { useTranslations } from "next-intl";
import RouteMap from "@/components/routes/RouteMap";

export default function RoutesContent() {
  const t = useTranslations("routes");

  return (
    <div className="section-padding">
      <div className="mx-auto max-w-7xl">
        <h1 className="font-display mb-4 text-center text-4xl font-bold text-[var(--gold)]">
          {t("title")}
        </h1>
        <p className="mx-auto mb-12 max-w-2xl text-center text-gray-400">
          {t("description")}
        </p>
        <RouteMap />
        <div className="mt-12 grid gap-4 sm:grid-cols-3">
          {[t("easternProvince"), t("bahrain"), t("riyadh")].map((region) => (
            <div key={region} className="card-luxury text-center">
              <p className="font-display text-lg text-[var(--gold)]">{region}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
