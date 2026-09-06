"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import Button from "@/components/ui/Button";

export default function VerifyEmailPage() {
  const t = useTranslations("auth");
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState(searchParams.get("email") || "");
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error || t("verificationFailed"));
        return;
      }
      setMessage(t("verificationSuccess"));
      setTimeout(() => router.push("/login"), 800);
    } catch {
      setError(t("verificationFailed"));
    } finally {
      setLoading(false);
    }
  };

  const resendCode = async () => {
    setError("");
    setMessage("");
    const response = await fetch("/api/auth/resend-verification", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await response.json();
    if (response.ok) setMessage(t("verificationResent"));
    else setError(data.error || t("verificationFailed"));
  };

  return (
    <div className="section-padding">
      <div className="mx-auto max-w-md">
        <h1 className="font-display mb-8 text-center text-3xl text-[var(--gold)]">{t("verifyEmail")}</h1>
        <form onSubmit={handleSubmit} className="card-luxury space-y-4">
          <p className="text-sm text-gray-400">{t("verificationInstructions")}</p>
          <label className="block">
            <span className="text-sm text-gray-400">{t("email")}</span>
            <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="mt-1 w-full rounded border border-gray-700 bg-[#0A0A0A] p-3" required />
          </label>
          <label className="block">
            <span className="text-sm text-gray-400">{t("verificationCode")}</span>
            <input type="text" inputMode="numeric" pattern="[0-9]{6}" maxLength={6} value={code} onChange={(event) => setCode(event.target.value.replace(/\D/g, ""))} className="mt-1 w-full rounded border border-gray-700 bg-[#0A0A0A] p-3 tracking-[0.5em]" required />
          </label>
          {error && <p className="text-sm text-red-400">{error}</p>}
          {message && <p className="text-sm text-green-400">{message}</p>}
          <Button type="submit" className="w-full" disabled={loading}>{t("verifyButton")}</Button>
          <button type="button" onClick={resendCode} className="w-full text-sm text-[var(--gold)] hover:underline">{t("resendVerification")}</button>
          <p className="text-center text-sm text-gray-500"><Link href="/login" className="text-[var(--gold)] hover:underline">{t("backToLogin")}</Link></p>
        </form>
      </div>
    </div>
  );
}