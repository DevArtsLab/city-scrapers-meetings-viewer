import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { PAGE_PADDING } from "@/lib/layout";

/**
 * Not-found fallback for /scrapers/[spider]. Rendered when a spider name
 * doesn't match any JSON output file in the data directory.
 */
export default function SpiderNotFound() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        flex: 1,
        textAlign: "center",
        p: PAGE_PADDING,
      }}
    >
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
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
