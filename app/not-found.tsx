import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { PAGE_PADDING } from "@/lib/layout";

/**
 * Root not-found fallback. Catches all unmatched routes (e.g. /a, /foo).
 * Rendered inside the root layout, so header and footer are present.
 */
export default function NotFound() {
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
        Page not found
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 4 }}>
        The page you are looking for doesn&apos;t exist or may have been moved.
      </Typography>
      <Button href="/" variant="outlined" sx={{ textTransform: "none" }}>
        Back to home
      </Button>
    </Box>
  );
}
