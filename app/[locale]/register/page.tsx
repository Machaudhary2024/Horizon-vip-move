"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import Button from "@/components/ui/Button";

export default function RegisterPage() {
  const t = useTranslations("auth");
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    setError("");

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Registration failed");
      setLoading(false);
      return;
    }

    router.push("/login");
  };

  return (
    <div className="section-padding">
      <div className="mx-auto max-w-md">
        <h1 className="font-display mb-8 text-center text-3xl text-[var(--gold)]">
          {t("registerTitle")}
        </h1>
        <form onSubmit={handleSubmit} className="card-luxury space-y-4">
          {(["name", "email", "phone", "password", "confirmPassword"] as const).map((field) => (
            <label key={field} className="block">
              <span className="text-sm text-gray-400">{t(field)}</span>
              <input
                type={field.includes("password") ? "password" : field === "email" ? "email" : "text"}
                value={form[field]}
                onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                className="mt-1 w-full rounded border border-gray-700 bg-[#0A0A0A] p-3"
                required
              />
            </label>
          ))}
          {error && <p className="text-sm text-red-400">{error}</p>}
          <Button type="submit" className="w-full" disabled={loading}>
            {t("registerButton")}
          </Button>
          <p className="text-center text-sm text-gray-500">
            {t("hasAccount")}{" "}
            <Link href="/login" className="text-[var(--gold)] hover:underline">
              {t("loginTitle")}
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
