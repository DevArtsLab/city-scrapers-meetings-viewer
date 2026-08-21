import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

/**
 * Root not-found fallback. Catches all unmatched routes (e.g. /a, /foo).
 * Rendered outside the AppShell, so it is viewport-centered with no
 * header or footer.
 */
export default function NotFound() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100dvh",
        textAlign: "center",
        px: 2,
      }}
    >
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
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
