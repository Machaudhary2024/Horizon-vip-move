"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import { useTranslations } from "next-intl";
import Button from "@/components/ui/Button";

export default function ProfileForm({ name, email, phone }: { name: string; email: string; phone: string }) {
  const t = useTranslations("auth");
  const [form, setForm] = useState({ name, phone });
  const [message, setMessage] = useState("");
  async function save(event: React.FormEvent) {
    event.preventDefault();
    const response = await fetch("/api/profile", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    setMessage(response.ok ? t("profileSaved") : t("profileSaveFailed"));
  }
  return <form onSubmit={save} className="card-luxury space-y-4"><label className="block"><span className="text-sm text-gray-400">{t("name")}</span><input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} className="mt-1 w-full rounded border border-gray-700 bg-[#0A0A0A] p-3" required /></label><label className="block"><span className="text-sm text-gray-400">{t("email")}</span><input value={email} className="mt-1 w-full rounded border border-gray-700 bg-[#0A0A0A] p-3 text-gray-500" readOnly /></label><label className="block"><span className="text-sm text-gray-400">{t("phone")}</span><input value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} className="mt-1 w-full rounded border border-gray-700 bg-[#0A0A0A] p-3" required /></label>{message && <p className="text-sm text-green-400">{message}</p>}<Button type="submit" className="w-full">{t("saveProfile")}</Button><Button type="button" variant="outline" className="w-full" onClick={() => signOut({ callbackUrl: "/en/login" })}>{t("logout")}</Button></form>;
}