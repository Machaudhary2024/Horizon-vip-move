import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MobileCTA from "@/components/layout/MobileCTA";
import InstallPrompt from "@/components/ui/InstallPrompt";
import Providers from "@/components/Providers";
import { auth } from "@/lib/auth";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as "en" | "ar")) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();
  const session = await auth();
  const isAdmin = session?.user?.role === "ADMIN";
  const dir = locale === "ar" ? "rtl" : "ltr";

  return (
    <div lang={locale} dir={dir}>
      <Providers>
        <NextIntlClientProvider messages={messages}>
          <Header isAdmin={isAdmin} />
          <main className="flex-1 pb-20 md:pb-0">{children}</main>
          <Footer />
          <MobileCTA />
          <InstallPrompt />
        </NextIntlClientProvider>
      </Providers>
    </div>
  );
}
