import PageHeader from "@/components/scrapers/PageHeader";
import ScrapersTable from "@/components/scrapers/ScrapersTable";
import { listScrapers } from "@/components/scrapers/lib/scrapers";

export default async function ScrapersPage() {
  const { spiders } = await listScrapers();

  return (
    <>
      <PageHeader title="City Scrapers" backHref="/" backLabel="Back to Home" />
      <ScrapersTable spiders={spiders} />
    </>
  );
}
