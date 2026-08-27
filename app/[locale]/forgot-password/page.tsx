"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import Button from "@/components/ui/Button";

export default function ForgotPasswordPage() {
  const t = useTranslations("auth");
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    await fetch("/api/auth/forgot-password", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) });
    setSent(true);
  }

  return <div className="section-padding"><div className="mx-auto max-w-md"><h1 className="font-display mb-8 text-center text-3xl text-[var(--gold)]">{t("forgotPassword")}</h1><form onSubmit={submit} className="card-luxury space-y-4"><label className="block"><span className="text-sm text-gray-400">{t("email")}</span><input type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="mt-1 w-full rounded border border-gray-700 bg-[#0A0A0A] p-3" required /></label>{sent && <p className="text-sm text-green-400">{t("resetEmailSent")}</p>}<Button type="submit" className="w-full">{t("sendResetLink")}</Button><Link href="/login" className="block text-center text-sm text-[var(--gold)] hover:underline">{t("backToLogin")}</Link></form></div></div>;
}