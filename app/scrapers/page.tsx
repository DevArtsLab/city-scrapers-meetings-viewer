import PageContainer from "@/components/PageContainer";
import PageHeader from "@/components/PageHeader";
import ScrapersTable from "@/components/ScrapersTable";
import { listScrapers } from "@/lib/scrapers";

export default async function ScrapersPage() {
  const { spiders } = await listScrapers();

  return (
    <PageContainer>
      <PageHeader title="City Scrapers" />
      <ScrapersTable spiders={spiders} />
    </PageContainer>
  );
}
