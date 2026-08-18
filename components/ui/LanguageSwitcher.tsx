"use client";

import { Link, usePathname } from "@/i18n/navigation";
import { useLocale } from "next-intl";

export default function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const otherLocale = locale === "en" ? "ar" : "en";

  return (
    <Link
      href={pathname}
      locale={otherLocale}
      className="rounded border border-[var(--border-gold)] px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[var(--gold)] transition-colors hover:bg-[var(--gold-muted)]"
    >
      {otherLocale.toUpperCase()}
    </Link>
  );
}
