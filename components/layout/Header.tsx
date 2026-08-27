"use client";

import { useState } from "react";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { Menu, X } from "lucide-react";
import Logo from "@/components/ui/Logo";
import LanguageSwitcher from "@/components/ui/LanguageSwitcher";
import { COMPANY } from "@/lib/constants";

const navItems = [
  { href: "/", key: "home" },
  { href: "/services", key: "services" },
  { href: "/vehicles", key: "vehicles" },
  { href: "/routes", key: "routes" },
  { href: "/booking", key: "booking" },
  { href: "/contact", key: "contact" },
] as const;

export default function Header({ isAdmin }: { isAdmin?: boolean }) {
  const t = useTranslations("nav");
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border-gold)] bg-[#0A0A0A]/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <Logo />
          <div>
            <span className="font-display text-lg font-bold text-[var(--gold)] sm:text-xl">
              {COMPANY.name}
            </span>
            <p className="hidden text-[10px] uppercase tracking-[0.2em] text-gray-400 sm:block">
              {COMPANY.tagline}
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className="text-sm uppercase tracking-wider text-gray-300 transition-colors hover:text-[var(--gold)]"
            >
              {t(item.key)}
            </Link>
          ))}
          {isAdmin && (
            <Link href="/admin" className="text-sm text-[var(--gold-light)]">
              {t("admin")}
            </Link>
          )}
          <Link href="/dashboard" className="text-sm text-gray-300 hover:text-[var(--gold)]">
            {t("dashboard")}
          </Link>
          <Link href="/profile" className="text-sm text-gray-300 hover:text-[var(--gold)]">
            {t("profile")}
          </Link>
          <LanguageSwitcher />
          <Link href="/booking" className="btn-primary !py-2 !text-xs">
            {t("booking")}
          </Link>
        </nav>

        <div className="flex items-center gap-3 lg:hidden">
          <LanguageSwitcher />
          <button
            onClick={() => setOpen(!open)}
            className="text-[var(--gold)]"
            aria-label="Toggle menu"
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-[var(--border-gold)] bg-[#111] px-4 py-4 lg:hidden">
          {navItems.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              onClick={() => setOpen(false)}
              className="block border-b border-gray-800 py-3 text-sm uppercase tracking-wider text-gray-300"
            >
              {t(item.key)}
            </Link>
          ))}
          <Link
            href="/dashboard"
            onClick={() => setOpen(false)}
            className="block py-3 text-sm text-gray-300"
          >
            {t("dashboard")}
          </Link>
          <Link href="/profile" onClick={() => setOpen(false)} className="block py-3 text-sm text-gray-300">
            {t("profile")}
          </Link>
        </nav>
      )}
    </header>
  );
}
