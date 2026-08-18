"use client";

import { useTranslations, useLocale } from "next-intl";
import { MapPin, Phone, Mail, Globe } from "lucide-react";
import { COMPANY } from "@/lib/constants";

export default function ContactContent() {
  const t = useTranslations("contact");
  const th = useTranslations("hero");
  const locale = useLocale() as "en" | "ar";

  return (
    <div className="section-padding">
      <div className="mx-auto max-w-7xl">
        <h1 className="font-display mb-12 text-center text-4xl font-bold text-[var(--gold)]">
          {t("title")}
        </h1>

        <div className="grid gap-8 md:grid-cols-3">
          <div className="card-luxury">
            <MapPin className="mb-4 h-8 w-8 text-[var(--gold)]" />
            <h2 className="mb-3 font-display text-lg text-[var(--gold)]">{t("address")}</h2>
            <p className="text-sm leading-relaxed text-gray-400">{COMPANY.address[locale]}</p>
          </div>

          <div className="card-luxury">
            <Phone className="mb-4 h-8 w-8 text-[var(--gold)]" />
            <h2 className="mb-3 font-display text-lg text-[var(--gold)]">{t("phone")}</h2>
            <div className="space-y-2 text-sm">
              <p>
                <span className="text-gray-500">{t("bookingNumber")}</span>
                <br />
                <a href={COMPANY.whatsappUrl} className="text-[var(--gold-light)] hover:underline">
                  {COMPANY.whatsapp}
                </a>
              </p>
              <p>
                <span className="text-gray-500">{t("companyPhone")}</span>
                <br />
                <a href={COMPANY.companyPhoneUrl} className="hover:text-[var(--gold)]">
                  {COMPANY.phone}
                </a>
              </p>
            </div>
          </div>

          <div className="card-luxury">
            <Mail className="mb-4 h-8 w-8 text-[var(--gold)]" />
            <h2 className="mb-3 font-display text-lg text-[var(--gold)]">{t("email")}</h2>
            <a href={COMPANY.emailUrl} className="text-sm hover:text-[var(--gold)]">
              {COMPANY.email}
            </a>
            <div className="mt-4 flex items-center gap-2">
              <Globe className="h-5 w-5 text-[var(--gold)]" />
              <a href={COMPANY.website} className="text-sm hover:text-[var(--gold)]">
                www.vip-move.online
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 card-luxury text-center">
          <p className="text-gray-400">{t("vat")}: {COMPANY.vat}</p>
          <p className="mt-2 text-gray-400">{t("unified")}: {COMPANY.unifiedNumber}</p>
          <p className="mt-6 font-display text-lg text-[var(--gold)]">{th("tagline")}</p>
        </div>
      </div>
    </div>
  );
}
