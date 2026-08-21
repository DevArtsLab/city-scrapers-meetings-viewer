import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

export default function SpiderNotFound() {
  return (
    <Box sx={{ textAlign: "center", py: { xs: 6, sm: 10 } }}>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
        Spider not found
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 4 }}>
        No JSON output was found for this spider. Check that the scraper has
        been run and its output file exists in the data directory.
      </Typography>
      <Button
        href="/scrapers"
        variant="outlined"
        sx={{ textTransform: "none" }}
      >
        Browse available scrapers
      </Button>
    </Box>
  );
}
