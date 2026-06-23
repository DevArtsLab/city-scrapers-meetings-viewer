import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import ScrapersTable from "@/components/ScrapersTable";
import { listScrapers } from "@/lib/scrapers";

export default async function ScrapersPage() {
  const { spiders } = await listScrapers();

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 3, sm: 6 } }}>
      <Typography
        variant="h4"
        gutterBottom
        sx={{ fontWeight: 600, fontSize: { xs: "1.5rem", sm: "2.125rem" } }}
      >
        City Scrapers
      </Typography>
      <ScrapersTable spiders={spiders} />
    </Container>
  );
}
