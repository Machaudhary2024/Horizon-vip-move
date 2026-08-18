"use client";

import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import Logo from "@/components/ui/Logo";
import { COMPANY } from "@/lib/constants";

export default function Footer() {
  const t = useTranslations("contact");
  const tf = useTranslations("footer");
  const tv = useTranslations("values");
  const locale = useLocale() as "en" | "ar";

  const values = ["commitment", "punctuality", "safety", "comfort", "trust"] as const;

  return (
    <footer className="border-t border-[var(--border-gold)] bg-[#080808]">
      <div className="gold-divider" />
      <div className="mx-auto max-w-7xl section-padding">
        <div className="mb-8 flex flex-wrap items-center justify-center gap-4 text-xs uppercase tracking-[0.15em] text-[var(--gold)]">
          {values.map((v, i) => (
            <span key={v} className="flex items-center gap-4">
              {tv(v)}
              {i < values.length - 1 && <span className="text-gray-600">•</span>}
            </span>
          ))}
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <div className="mb-4 flex items-center gap-2">
              <Logo className="h-8 w-8" />
              <h3 className="font-display text-lg text-[var(--gold)]">{t("address")}</h3>
            </div>
            <p className="text-sm leading-relaxed text-gray-400">
              {COMPANY.address[locale]}
            </p>
          </div>

          <div>
            <h3 className="mb-4 font-display text-lg text-[var(--gold)]">{t("phone")}</h3>
            <div className="space-y-2 text-sm text-gray-400">
              <p>
                <span className="text-gray-500">{t("bookingNumber")}: </span>
                <a href={COMPANY.whatsappUrl} className="hover:text-[var(--gold)]">
                  {COMPANY.whatsapp}
                </a>
              </p>
              <p>
                <span className="text-gray-500">{t("companyPhone")}: </span>
                <a href={COMPANY.companyPhoneUrl} className="hover:text-[var(--gold)]">
                  {COMPANY.phone}
                </a>
              </p>
              <p>
                <span className="text-gray-500">{t("email")}: </span>
                <a href={COMPANY.emailUrl} className="hover:text-[var(--gold)]">
                  {COMPANY.email}
                </a>
              </p>
            </div>
          </div>

          <div>
            <h3 className="mb-4 font-display text-lg text-[var(--gold)]">{tf("companyInfo")}</h3>
            <div className="space-y-2 text-sm text-gray-400">
              <p>{t("vat")}: {COMPANY.vat}</p>
              <p>{t("unified")}: {COMPANY.unifiedNumber}</p>
              <p>
                {t("website")}:{" "}
                <a href={COMPANY.website} className="hover:text-[var(--gold)]">
                  www.vip-move.online
                </a>
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-gray-800 pt-6 text-center text-xs text-gray-500">
          <p>© {new Date().getFullYear()} {COMPANY.name}. {tf("rights")}</p>
          <p className="mt-2 text-[var(--gold)]">{COMPANY.tagline}</p>
        </div>
      </div>
    </footer>
  );
}
