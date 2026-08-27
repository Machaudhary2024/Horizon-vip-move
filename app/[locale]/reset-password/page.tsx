"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import { Eye, EyeOff } from "lucide-react";
import Button from "@/components/ui/Button";

export default function ResetPasswordPage() {
  const t = useTranslations("auth");
  const router = useRouter();
  const token = useSearchParams().get("token") || "";
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/.test(password)) return setError(t("passwordRequirements"));
    if (password !== confirmPassword) return setError(t("passwordMismatch"));
    const response = await fetch("/api/auth/reset-password", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ token, password }) });
    if (!response.ok) return setError((await response.json()).error || t("resetFailed"));
    router.push("/login");
  }

  return <div className="section-padding"><div className="mx-auto max-w-md"><h1 className="font-display mb-8 text-center text-3xl text-[var(--gold)]">{t("resetPassword")}</h1><form onSubmit={submit} className="card-luxury space-y-4"><label className="block"><span className="text-sm text-gray-400">{t("password")}</span><div className="relative mt-1"><input type={show ? "text" : "password"} value={password} onChange={(event) => setPassword(event.target.value)} className="w-full rounded border border-gray-700 bg-[#0A0A0A] p-3 pr-11" required /><button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-3 text-gray-400" aria-label={show ? "Hide password" : "Show password"}>{show ? <EyeOff size={20} /> : <Eye size={20} />}</button></div><span className="mt-1 block text-xs text-gray-500">{t("passwordRequirements")}</span></label><label className="block"><span className="text-sm text-gray-400">{t("confirmPassword")}</span><input type={show ? "text" : "password"} value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} className="mt-1 w-full rounded border border-gray-700 bg-[#0A0A0A] p-3" required /></label>{error && <p className="text-sm text-red-400">{error}</p>}<Button type="submit" className="w-full">{t("resetPassword")}</Button><Link href="/login" className="block text-center text-sm text-[var(--gold)] hover:underline">{t("backToLogin")}</Link></form></div></div>;
}