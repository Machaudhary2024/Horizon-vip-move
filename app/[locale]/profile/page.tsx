import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { auth } from "@/lib/auth";
import ProfileForm from "@/components/profile/ProfileForm";

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/en/login");
  const t = await getTranslations("auth");
  return <div className="section-padding"><div className="mx-auto max-w-md"><h1 className="font-display mb-8 text-center text-3xl text-[var(--gold)]">{t("profile")}</h1><ProfileForm name={session.user.name || ""} email={session.user.email || ""} phone={session.user.phone || ""} /></div></div>;
}