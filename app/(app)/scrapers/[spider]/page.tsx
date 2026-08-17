import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageHeader from "@/components/scrapers/PageHeader";
import ScraperWorkspace from "@/components/scrapers/ScraperWorkspace";
import {
  getScraperOutput,
  type MeetingRecord,
} from "@/components/scrapers/lib/scrapers";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ spider: string }>;
}): Promise<Metadata> {
  const { spider } = await params;
  return {
    title: `${spider} — Meetings Viewer`,
    description: `Inspect the JSON output of the ${spider} scraper.`,
  };
}

export default async function SpiderPage({
  params,
}: {
  params: Promise<{ spider: string }>;
}) {
  const { spider } = await params;

  let records: MeetingRecord[];
  try {
    records = await getScraperOutput(spider);
  } catch {
    notFound();
  }

  return (
    <>
      <PageHeader
        title={spider}
        backHref="/scrapers"
        backLabel="Back to Scrapers"
      />
      <ScraperWorkspace records={records} />
    </>
  );
}
