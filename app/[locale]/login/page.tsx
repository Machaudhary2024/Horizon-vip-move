"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import Button from "@/components/ui/Button";

export default function LoginPage() {
  const t = useTranslations("auth");
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError(t("invalidCredentials"));
      setLoading(false);
      return;
    }

    router.push("/dashboard");
  };

  return (
    <div className="section-padding">
      <div className="mx-auto max-w-md">
        <h1 className="font-display mb-8 text-center text-3xl text-[var(--gold)]">
          {t("loginTitle")}
        </h1>
        <form onSubmit={handleSubmit} className="card-luxury space-y-4">
          <label className="block">
            <span className="text-sm text-gray-400">{t("email")}</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded border border-gray-700 bg-[#0A0A0A] p-3"
              required
            />
          </label>
          <label className="block">
            <span className="text-sm text-gray-400">{t("password")}</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded border border-gray-700 bg-[#0A0A0A] p-3"
              required
            />
          </label>
          {error && <p className="text-sm text-red-400">{error}</p>}
          <Button type="submit" className="w-full" disabled={loading}>
            {t("loginButton")}
          </Button>
          <p className="text-center text-sm text-gray-500">
            {t("noAccount")}{" "}
            <Link href="/register" className="text-[var(--gold)] hover:underline">
              {t("registerTitle")}
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
