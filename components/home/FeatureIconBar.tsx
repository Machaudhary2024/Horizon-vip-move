"use client";

import {
  Armchair,
  ShieldCheck,
  Users,
  Luggage,
  ClipboardList,
  Wifi,
} from "lucide-react";
import { useTranslations } from "next-intl";

const features = [
  { key: "comfortableSeating", Icon: Armchair },
  { key: "safetyCommitment", Icon: ShieldCheck },
  { key: "professionalDrivers", Icon: Users },
  { key: "airportPickup", Icon: Luggage },
  { key: "fastProcedures", Icon: ClipboardList },
  { key: "freeWifi", Icon: Wifi },
] as const;

export default function FeatureIconBar() {
  const t = useTranslations("features");

  return (
    <section className="border-y border-[var(--border-gold)] bg-[#111111]">
      <div className="feature-scroll mx-auto flex max-w-7xl gap-6 overflow-x-auto px-4 py-8 sm:justify-center sm:px-6 lg:px-8">
        {features.map(({ key, Icon }) => (
          <div
            key={key}
            className="flex min-w-[120px] flex-col items-center gap-3 text-center"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-full border border-[var(--border-gold)] bg-[var(--gold-muted)]">
              <Icon className="h-6 w-6 text-[var(--gold)]" />
            </div>
            <span className="text-xs uppercase tracking-wider text-gray-300">
              {t(key)}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
