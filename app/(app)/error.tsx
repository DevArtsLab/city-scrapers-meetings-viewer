"use client";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <Box sx={{ textAlign: "center", py: { xs: 6, sm: 10 } }}>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
        Something went wrong
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 1 }}>
        {error.message ||
          "An unexpected error occurred while loading scraper data."}
      </Typography>
      {error.digest && (
        <Typography
          variant="caption"
          color="text.disabled"
          sx={{ display: "block", mb: 4, fontFamily: "monospace" }}
        >
          Error ID: {error.digest}
        </Typography>
      )}
      <Button onClick={reset} variant="outlined" sx={{ textTransform: "none" }}>
        Try again
      </Button>
    </Box>
  );
}
