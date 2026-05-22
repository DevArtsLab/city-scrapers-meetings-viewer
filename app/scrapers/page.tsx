"use client";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { useRouter } from "next/navigation";

export default function ScrapersPage() {
  const router = useRouter();

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
        City Scrapers
      </Typography>
      <Box sx={{ mt: 2 }}>
        <Button
          variant="contained"
          onClick={() => router.push("/scrapers/atl-city-council")}
        >
          View Atlanta City Council meetings
        </Button>
      </Box>
    </Container>
  );
}
