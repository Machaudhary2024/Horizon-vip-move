"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { COMPANY } from "@/lib/constants";

export default function MobileCTA() {
  const t = useTranslations("hero");

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 flex gap-2 border-t border-[var(--border-gold)] bg-[#0A0A0A]/95 p-3 backdrop-blur-md md:hidden">
      <Link href="/booking" className="btn-primary flex-1 !py-2.5 !text-xs">
        {t("bookNow")}
      </Link>
      <a
        href={COMPANY.whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-outline flex-1 !py-2.5 !text-xs"
      >
        {t("whatsapp")}
      </a>
    </div>
  );
}
