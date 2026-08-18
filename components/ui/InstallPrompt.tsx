"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { X, Download } from "lucide-react";

export default function InstallPrompt() {
  const t = useTranslations("pwa");
  const [deferredPrompt, setDeferredPrompt] = useState<Event | null>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      const dismissed = localStorage.getItem("pwa-dismissed");
      if (!dismissed) setShow(true);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const install = async () => {
    if (!deferredPrompt) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (deferredPrompt as any).prompt();
    setShow(false);
    localStorage.setItem("pwa-dismissed", "1");
  };

  const dismiss = () => {
    setShow(false);
    localStorage.setItem("pwa-dismissed", "1");
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 z-50 rounded-lg border border-[var(--border-gold)] bg-[#111] p-4 shadow-xl md:bottom-4 md:left-auto md:right-4 md:max-w-sm">
      <button
        onClick={dismiss}
        className="absolute right-2 top-2 text-gray-500 hover:text-white"
        aria-label="Dismiss"
      >
        <X size={16} />
      </button>
      <div className="flex items-start gap-3">
        <Download className="mt-1 h-5 w-5 shrink-0 text-[var(--gold)]" />
        <div>
          <p className="font-semibold text-[var(--gold)]">{t("install")}</p>
          <p className="mt-1 text-xs text-gray-400">{t("installDesc")}</p>
          <button onClick={install} className="btn-primary mt-3 !py-2 !text-xs">
            {t("install")}
          </button>
        </div>
      </div>
    </div>
  );
}
