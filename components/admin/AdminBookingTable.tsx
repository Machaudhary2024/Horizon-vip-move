"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

type Booking = {
  id: string;
  status: string;
  pickupDate: string;
  pickupLocation: string;
  dropoffLocation: string;
  user: { name: string; email: string; phone: string };
  vehicleTier: { nameEn: string };
  quotedPrice: number | null;
};

export default function AdminBookingTable({
  bookings: initial,
  drivers,
  vehicles,
}: {
  bookings: Booking[];
  drivers: { id: string; name: string }[];
  vehicles: { id: string; name: string; model: string }[];
}) {
  const t = useTranslations("admin");
  const ts = useTranslations("status");
  const [bookings, setBookings] = useState(initial);
  const [filter, setFilter] = useState("ALL");

  const filtered =
    filter === "ALL" ? bookings : bookings.filter((b) => b.status === filter);

  const updateStatus = async (id: string, status: string, extra?: Record<string, unknown>) => {
    const res = await fetch(`/api/admin/bookings/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, ...extra }),
    });
    if (res.ok) {
      const updated = await res.json();
      setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, ...updated } : b)));
    }
  };

  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-2">
        {["ALL", "PENDING", "CONFIRMED", "ASSIGNED", "IN_PROGRESS", "COMPLETED", "CANCELLED"].map(
          (s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`rounded px-3 py-1 text-xs uppercase ${
                filter === s
                  ? "bg-[var(--gold)] text-black"
                  : "border border-gray-700 text-gray-400"
              }`}
            >
              {s === "ALL" ? "All" : ts(s as "PENDING")}
            </button>
          )
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-gray-800 text-xs uppercase text-gray-500">
              <th className="p-3">{t("customer")}</th>
              <th className="p-3">{t("date")}</th>
              <th className="p-3">Route</th>
              <th className="p-3">{t("status")}</th>
              <th className="p-3">{t("price")}</th>
              <th className="p-3">{t("actions")}</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((booking) => (
              <tr key={booking.id} className="border-b border-gray-900">
                <td className="p-3">
                  <div className="font-medium text-white">{booking.user.name}</div>
                  <div className="text-xs text-gray-500">{booking.user.phone}</div>
                </td>
                <td className="p-3 text-gray-400">
                  {new Date(booking.pickupDate).toLocaleDateString()}
                </td>
                <td className="p-3 text-xs text-gray-400">
                  {booking.pickupLocation} → {booking.dropoffLocation}
                </td>
                <td className="p-3">
                  <span className="rounded bg-[var(--gold-muted)] px-2 py-1 text-xs text-[var(--gold)]">
                    {ts(booking.status as "PENDING")}
                  </span>
                </td>
                <td className="p-3">
                  <input
                    type="number"
                    defaultValue={booking.quotedPrice ?? ""}
                    placeholder="SAR"
                    className="w-20 rounded border border-gray-700 bg-[#0A0A0A] p-1 text-xs"
                    onBlur={(e) =>
                      updateStatus(booking.id, booking.status, {
                        quotedPrice: parseFloat(e.target.value) || null,
                      })
                    }
                  />
                </td>
                <td className="p-3">
                  <div className="flex flex-wrap gap-1">
                    {booking.status === "PENDING" && (
                      <>
                        <button
                          onClick={() => updateStatus(booking.id, "CONFIRMED")}
                          className="rounded bg-green-900 px-2 py-1 text-xs text-green-300"
                        >
                          {t("approve")}
                        </button>
                        <button
                          onClick={() => updateStatus(booking.id, "CANCELLED")}
                          className="rounded bg-red-900 px-2 py-1 text-xs text-red-300"
                        >
                          {t("reject")}
                        </button>
                      </>
                    )}
                    {booking.status === "CONFIRMED" && (
                      <select
                        className="rounded border border-gray-700 bg-[#0A0A0A] p-1 text-xs"
                        onChange={(e) =>
                          updateStatus(booking.id, "ASSIGNED", {
                            driverId: e.target.value,
                          })
                        }
                        defaultValue=""
                      >
                        <option value="">{t("assign")} Driver</option>
                        {drivers.map((d) => (
                          <option key={d.id} value={d.id}>
                            {d.name}
                          </option>
                        ))}
                      </select>
                    )}
                    {booking.status === "ASSIGNED" && (
                      <button
                        onClick={() => updateStatus(booking.id, "IN_PROGRESS")}
                        className="rounded bg-blue-900 px-2 py-1 text-xs text-blue-300"
                      >
                        Start Trip
                      </button>
                    )}
                    {booking.status === "IN_PROGRESS" && (
                      <button
                        onClick={() => updateStatus(booking.id, "COMPLETED")}
                        className="rounded bg-[var(--gold-muted)] px-2 py-1 text-xs text-[var(--gold)]"
                      >
                        Complete
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
