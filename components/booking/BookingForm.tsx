"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";
import Button from "@/components/ui/Button";

const routes = [
  "EASTERN_TO_BAHRAIN",
  "BAHRAIN_TO_EASTERN",
  "RIYADH_TO_BAHRAIN",
  "BAHRAIN_TO_RIYADH",
  "EASTERN_TO_RIYADH",
  "RIYADH_TO_EASTERN",
] as const;

export default function BookingForm({
  tiers,
  isLoggedIn,
}: {
  tiers: { id: string; slug: string; nameEn: string; nameAr: string; maxPassengers: number }[];
  isLoggedIn: boolean;
}) {
  const t = useTranslations("booking");
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedTier = searchParams.get("tier");

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    pickupDate: "",
    pickupTime: "",
    pickupLocation: "",
    dropoffLocation: "",
    route: "EASTERN_TO_BAHRAIN",
    passengers: 1,
    vehicleTierId: tiers.find((t) => t.slug === preselectedTier)?.id || tiers[0]?.id || "",
    notes: "",
  });

  if (!isLoggedIn) {
    return (
      <div className="card-luxury text-center">
        <p className="mb-4 text-gray-400">{t("loginRequired")}</p>
        <div className="flex justify-center gap-4">
          <Button onClick={() => router.push("/login")}>{t("step1Label")}</Button>
          <Button variant="outline" onClick={() => router.push("/register")}>
            Register
          </Button>
        </div>
      </div>
    );
  }

  const update = (field: string, value: string | number) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const submit = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to submit");
      }
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { num: 1, label: t("step1Label"), desc: t("step1") },
    { num: 2, label: t("step2Label"), desc: t("step2") },
    { num: 3, label: t("step3Label"), desc: t("step3") },
    { num: 4, label: t("step4Label"), desc: t("step4") },
  ];

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-8 grid grid-cols-4 gap-2">
        {steps.map((s) => (
          <div
            key={s.num}
            className={`rounded border p-2 text-center text-[10px] sm:text-xs ${
              step >= s.num
                ? "border-[var(--gold)] bg-[var(--gold-muted)] text-[var(--gold)]"
                : "border-gray-800 text-gray-600"
            }`}
          >
            <div className="font-bold">{s.num}</div>
            <div className="hidden sm:block">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="card-luxury">
        {step === 1 && (
          <div className="space-y-4">
            <p className="text-gray-400">{t("step1")}</p>
            <label className="block">
              <span className="text-sm text-gray-400">{t("vehicleTier")}</span>
              <select
                value={form.vehicleTierId}
                onChange={(e) => update("vehicleTierId", e.target.value)}
                className="mt-1 w-full rounded border border-gray-700 bg-[#0A0A0A] p-3 text-white"
              >
                {tiers.map((tier) => (
                  <option key={tier.id} value={tier.id}>
                    {tier.nameEn}
                  </option>
                ))}
              </select>
            </label>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <label className="block">
              <span className="text-sm text-gray-400">{t("pickupDate")}</span>
              <input
                type="date"
                value={form.pickupDate}
                onChange={(e) => update("pickupDate", e.target.value)}
                className="mt-1 w-full rounded border border-gray-700 bg-[#0A0A0A] p-3 text-white"
                required
              />
            </label>
            <label className="block">
              <span className="text-sm text-gray-400">{t("pickupTime")}</span>
              <input
                type="time"
                value={form.pickupTime}
                onChange={(e) => update("pickupTime", e.target.value)}
                className="mt-1 w-full rounded border border-gray-700 bg-[#0A0A0A] p-3 text-white"
                required
              />
            </label>
            <label className="block">
              <span className="text-sm text-gray-400">{t("route")}</span>
              <select
                value={form.route}
                onChange={(e) => update("route", e.target.value)}
                className="mt-1 w-full rounded border border-gray-700 bg-[#0A0A0A] p-3 text-white"
              >
                {routes.map((route) => (
                  <option key={route} value={route}>
                    {route.replace(/_/g, " ")}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="text-sm text-gray-400">{t("pickupLocation")}</span>
              <input
                type="text"
                value={form.pickupLocation}
                onChange={(e) => update("pickupLocation", e.target.value)}
                className="mt-1 w-full rounded border border-gray-700 bg-[#0A0A0A] p-3 text-white"
                required
              />
            </label>
            <label className="block">
              <span className="text-sm text-gray-400">{t("dropoffLocation")}</span>
              <input
                type="text"
                value={form.dropoffLocation}
                onChange={(e) => update("dropoffLocation", e.target.value)}
                className="mt-1 w-full rounded border border-gray-700 bg-[#0A0A0A] p-3 text-white"
                required
              />
            </label>
            <label className="block">
              <span className="text-sm text-gray-400">{t("passengers")}</span>
              <input
                type="number"
                min={1}
                max={7}
                value={form.passengers}
                onChange={(e) => update("passengers", parseInt(e.target.value))}
                className="mt-1 w-full rounded border border-gray-700 bg-[#0A0A0A] p-3 text-white"
              />
            </label>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <p className="text-gray-400">{t("step3")}</p>
            <label className="block">
              <span className="text-sm text-gray-400">{t("notes")}</span>
              <textarea
                value={form.notes}
                onChange={(e) => update("notes", e.target.value)}
                rows={4}
                className="mt-1 w-full rounded border border-gray-700 bg-[#0A0A0A] p-3 text-white"
              />
            </label>
            <div className="rounded border border-gray-800 bg-[#0A0A0A] p-4 text-sm text-gray-400">
              <p><strong className="text-[var(--gold)]">Date:</strong> {form.pickupDate}</p>
              <p><strong className="text-[var(--gold)]">Time:</strong> {form.pickupTime}</p>
              <p><strong className="text-[var(--gold)]">From:</strong> {form.pickupLocation}</p>
              <p><strong className="text-[var(--gold)]">To:</strong> {form.dropoffLocation}</p>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="text-center">
            <p className="mb-4 text-gray-400">{t("step4")}</p>
            <p className="text-[var(--gold)]">{t("success")}</p>
          </div>
        )}

        {error && <p className="mt-4 text-sm text-red-400">{error}</p>}

        <div className="mt-6 flex justify-between">
          {step > 1 && (
            <Button variant="outline" onClick={() => setStep(step - 1)}>
              {t("back")}
            </Button>
          )}
          {step < 3 && (
            <Button className="ml-auto" onClick={() => setStep(step + 1)}>
              {t("next")}
            </Button>
          )}
          {step === 3 && (
            <Button className="ml-auto" onClick={() => setStep(4)}>
              {t("next")}
            </Button>
          )}
          {step === 4 && (
            <Button className="ml-auto" onClick={submit} disabled={loading}>
              {loading ? "..." : t("submit")}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
