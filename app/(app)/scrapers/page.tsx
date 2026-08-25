import type { Metadata } from "next";
import PageHeader from "@/components/scrapers/PageHeader";
import ScrapersTable from "@/components/scrapers/ScrapersTable";
import { listScrapers } from "@/lib/scrapers";

export const metadata: Metadata = {
  title: "Scrapers — Meetings Viewer",
  description:
    "Browse available city-meeting scrapers and inspect their output.",
};

export default async function ScrapersPage() {
  const { spiders } = await listScrapers();

  return (
    <>
      <PageHeader title="Scrapers" backHref="/" backLabel="Back to Home" />
      <ScrapersTable spiders={spiders} />
    </>
  );
}
