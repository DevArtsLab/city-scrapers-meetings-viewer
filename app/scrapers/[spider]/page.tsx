import { notFound } from "next/navigation";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import MuiLink from "@mui/material/Link";
import NextLink from "@/components/NextLink";
import MeetingsTable from "@/components/MeetingsTable";
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
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Box sx={{ mb: 2 }}>
        <Breadcrumbs aria-label="breadcrumb">
          <MuiLink component={NextLink} href="/scrapers" underline="hover">
            Scrapers
          </MuiLink>
          <Typography color="text.primary">{spider}</Typography>
        </Breadcrumbs>
      </Box>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
        {spider}
      </Typography>
      <MeetingsTable records={records} />
    </Container>
  );
}
