import type { Metadata } from "next";
import { Capabilities } from "@/components/landing/capabilities";
import { Hero } from "@/components/landing/hero";
import { Modes } from "@/components/landing/modes";

export const metadata: Metadata = {
  title: "Meetings Viewer — QA tooling for city-scrapers",
  description:
    "Turn raw Scrapy JSON into a browsable, filterable table. Review a spider's output in minutes instead of an afternoon.",
  openGraph: {
    title: "Meetings Viewer — QA tooling for city-scrapers",
    description:
      "Turn raw Scrapy JSON into a browsable, filterable table. Review a spider's output in minutes instead of an afternoon.",
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
