"use client";

import {
  Shield,
  UserCheck,
  Car,
  Clock,
  Headphones,
} from "lucide-react";
import { useTranslations } from "next-intl";

const items = [
  { key: "safeSecure", descKey: "safeSecureDesc", Icon: Shield },
  { key: "experiencedDrivers", descKey: "experiencedDriversDesc", Icon: UserCheck },
  { key: "qualityVehicles", descKey: "qualityVehiclesDesc", Icon: Car },
  { key: "punctual", descKey: "punctualDesc", Icon: Clock },
  { key: "support", descKey: "supportDesc", Icon: Headphones },
] as const;

export default function WhyChooseUs() {
  const t = useTranslations("whyChoose");

  return (
    <section className="section-padding">
      <div className="mx-auto max-w-7xl">
        <h2 className="font-display mb-12 text-center text-3xl font-bold text-[var(--gold)] sm:text-4xl">
          {t("title")}
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {items.map(({ key, descKey, Icon }) => (
            <div key={key} className="card-luxury text-center">
              <Icon className="mx-auto mb-4 h-10 w-10 text-[var(--gold)]" />
              <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-white">
                {t(key)}
              </h3>
              <p className="text-xs leading-relaxed text-gray-400">{t(descKey)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
