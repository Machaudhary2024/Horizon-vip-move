"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function VehicleCard({
  name,
  image,
  tierSlug,
}: {
  name: string;
  image: string;
  tierSlug: string;
}) {
  const t = useTranslations("vehicles");

  return (
    <div className="card-luxury group overflow-hidden">
      <div className="relative mb-4 aspect-[4/3] overflow-hidden rounded-md">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <h3 className="font-display mb-2 text-xl text-[var(--gold)]">{name}</h3>
      <Link
        href={`/booking?tier=${tierSlug}`}
        className="btn-outline mt-4 w-full !text-xs"
      >
        {t("select")}
      </Link>
    </div>
  );
}
