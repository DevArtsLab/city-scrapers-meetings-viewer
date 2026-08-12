import { notFound } from "next/navigation";
import PageContainer from "@/components/PageContainer";
import PageHeader from "@/components/PageHeader";
import ScraperWorkspace from "@/components/ScraperWorkspace";
import { getScraperOutput, type MeetingRecord } from "@/lib/scrapers";

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
    <PageContainer>
      <PageHeader
        title={spider}
        backHref="/scrapers"
        backLabel="Back to Scrapers"
      />
      <ScraperWorkspace records={records} />
    </PageContainer>
  );
}
