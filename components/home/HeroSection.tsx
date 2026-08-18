"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { COMPANY } from "@/lib/constants";

export default function HeroSection() {
  const t = useTranslations("hero");

  return (
    <section className="relative min-h-[85vh] overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="/images/poster-hero.png"
          alt="Riyadh skyline with luxury vehicles"
          fill
          className="object-cover object-center opacity-40"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A]/60 via-[#0A0A0A]/80 to-[#0A0A0A]" />
      </div>

      <div className="relative mx-auto flex max-w-7xl flex-col items-center px-4 py-20 text-center sm:px-6 lg:px-8 lg:py-32">
        <p className="mb-4 text-xs uppercase tracking-[0.3em] text-[var(--gold-light)]">
          {COMPANY.tagline}
        </p>
        <h1 className="font-display mb-6 max-w-4xl text-3xl font-bold leading-tight sm:text-4xl md:text-5xl lg:text-6xl gold-gradient-text">
          {t("headline")}
        </h1>
        <p className="mb-4 text-lg text-[var(--gold)] sm:text-xl">{t("subheadline")}</p>
        <p className="mb-8 max-w-2xl text-sm leading-relaxed text-gray-400 sm:text-base">
          {t("description")}
        </p>

        <div className="mb-10 rounded-full border border-[var(--border-gold)] bg-[var(--gold-muted)] px-6 py-2 text-sm text-[var(--gold-light)]">
          {t("serviceArea")}
        </div>

        <div className="flex flex-col gap-4 sm:flex-row">
          <Link href="/booking" className="btn-primary">
            {t("bookNow")}
          </Link>
          <a
            href={COMPANY.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline"
          >
            {t("whatsapp")}
          </a>
        </div>
      </div>
    </section>
  );
}
