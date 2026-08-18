"use client";

import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

const statuses = ["PENDING", "CONFIRMED", "ASSIGNED", "IN_PROGRESS", "COMPLETED"] as const;

export default function BookingStatusTracker({
  currentStatus,
}: {
  currentStatus: string;
}) {
  const t = useTranslations("status");
  const tb = useTranslations("booking");

  const steps = [
    { key: "step1Label", status: "PENDING" },
    { key: "step2Label", status: "CONFIRMED" },
    { key: "step3Label", status: "ASSIGNED" },
    { key: "step4Label", status: "COMPLETED" },
  ] as const;

  const currentIndex = statuses.indexOf(currentStatus as (typeof statuses)[number]);

  if (currentStatus === "CANCELLED") {
    return (
      <div className="rounded-md border border-red-800 bg-red-950/30 p-4 text-center text-red-400">
        {t("CANCELLED")}
      </div>
    );
  }

  return (
    <div className="w-full">
      <h3 className="mb-6 text-center font-display text-lg text-[var(--gold)]">
        {tb("statusTitle")}
      </h3>
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isActive = index <= Math.min(currentIndex, steps.length - 1);
          const isCurrent =
            statuses[index] === currentStatus ||
            (currentStatus === "IN_PROGRESS" && index === 3);

          return (
            <div key={step.key} className="flex flex-1 flex-col items-center">
              <div
                className={cn(
                  "mb-2 flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-bold",
                  isActive
                    ? "border-[var(--gold)] bg-[var(--gold-muted)] text-[var(--gold)]"
                    : "border-gray-700 text-gray-600"
                )}
              >
                {index + 1}
              </div>
              <span
                className={cn(
                  "text-center text-[10px] uppercase tracking-wider sm:text-xs",
                  isCurrent ? "text-[var(--gold-light)]" : "text-gray-500"
                )}
              >
                {tb(step.key)}
              </span>
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "absolute hidden h-0.5 w-full sm:block",
                    isActive ? "bg-[var(--gold)]" : "bg-gray-800"
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
      <p className="mt-6 text-center text-sm text-gray-400">
        {t(currentStatus as "PENDING")}
      </p>
    </div>
  );
}
