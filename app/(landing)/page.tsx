import type { Metadata } from "next";
import { Capabilities } from "@/components/landing/capabilities";
import { Hero } from "@/components/landing/hero";
import { Modes } from "@/components/landing/modes";
import { siteConfig } from "@/lib/site";

const landingTitle = `${siteConfig.name} - ${siteConfig.tagline}`;

export const metadata: Metadata = {
  title: landingTitle,
  description: siteConfig.landingDescription,
  openGraph: {
    title: landingTitle,
    description: siteConfig.landingDescription,
    type: "website",
  },
};

export default function Home() {
  return (
    <>
      <Hero />
      <Modes />
      <Capabilities />
    </>
  );
}
