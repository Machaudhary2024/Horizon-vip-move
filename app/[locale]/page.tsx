import type { Metadata } from "next";
import HeroSection from "@/components/home/HeroSection";
import FeatureIconBar from "@/components/home/FeatureIconBar";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import { COMPANY } from "@/lib/constants";

export const metadata: Metadata = {
  title: `${COMPANY.name} | ${COMPANY.tagline}`,
  description: "Premium VIP passenger transportation between Saudi Arabia and Bahrain. Door-to-door private car service.",
  openGraph: {
    title: COMPANY.name,
    description: COMPANY.tagline,
    url: COMPANY.website,
    siteName: COMPANY.name,
    images: [{ url: "/images/poster-hero.png" }],
  },
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeatureIconBar />
      <WhyChooseUs />
    </>
  );
}
