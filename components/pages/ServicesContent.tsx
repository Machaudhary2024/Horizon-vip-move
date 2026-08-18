"use client";

import { Calendar, Clock, ArrowLeftRight, MapPin, Check } from "lucide-react";
import { useTranslations } from "next-intl";

const checklist = [
  "modernVehicles",
  "experiencedDrivers",
  "appointmentCommitment",
  "realTimeTracking",
  "competitivePrices",
  "cleanVehicles",
  "wifi",
] as const;

export default function ServicesContent() {
  const t = useTranslations("services");

  const whyItems = [
    { key: "onTime", Icon: Clock },
    { key: "borderCrossing", Icon: ArrowLeftRight },
    { key: "dailyDepartures", Icon: Calendar },
    { key: "pickupAnywhere", Icon: MapPin },
  ] as const;

  return (
    <div className="section-padding">
      <div className="mx-auto max-w-7xl">
        <h1 className="font-display mb-4 text-center text-4xl font-bold text-[var(--gold)]">
          {t("title")}
        </h1>
        <p className="mx-auto mb-12 max-w-3xl text-center leading-relaxed text-gray-400">
          {t("description")}
        </p>

        <div className="mb-16 flex justify-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border-gold)] bg-[var(--gold-muted)] px-6 py-3 text-[var(--gold-light)]">
            <Calendar className="h-5 w-5" />
            {t("dailyTrips")}
          </div>
        </div>

        <h2 className="font-display mb-8 text-center text-2xl text-[var(--gold)]">
          {t("whyTravel")}
        </h2>
        <div className="mb-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {whyItems.map(({ key, Icon }) => (
            <div key={key} className="card-luxury text-center">
              <Icon className="mx-auto mb-3 h-8 w-8 text-[var(--gold)]" />
              <p className="text-sm uppercase tracking-wider">{t(key)}</p>
            </div>
          ))}
        </div>

        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <h2 className="font-display mb-6 text-2xl text-[var(--gold)]">
              {t("checklistTitle")}
            </h2>
            <ul className="space-y-3">
              {checklist.map((item) => (
                <li key={item} className="flex items-center gap-3 text-gray-300">
                  <Check className="h-5 w-5 shrink-0 text-[var(--gold)]" />
                  {t(item)}
                </li>
              ))}
            </ul>
          </div>
          <div className="card-luxury flex flex-col items-center justify-center text-center">
            <MapPin className="mb-4 h-12 w-12 text-[var(--gold)]" />
            <p className="font-display text-xl text-[var(--gold-light)]">{t("riyadhMap")}</p>
            <p className="mt-2 text-sm text-gray-500">Riyadh • Eastern Province • Bahrain</p>
          </div>
        </div>
      </div>
    </div>
  );
}
