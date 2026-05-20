import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

export default async function SpiderPage({
  params,
}: {
  params: Promise<{ spider: string }>;
}) {
  const { spider } = await params;

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Box sx={{ mb: 2 }}>
        <Button variant="text" href="/scrapers" sx={{ pl: 0 }}>
          ← Back to Scrapers
        </Button>
      </Box>
      <Typography variant="h4" sx={{ fontWeight: 600 }}>
        {spider}
      </Typography>
    </Container>
  );
}
