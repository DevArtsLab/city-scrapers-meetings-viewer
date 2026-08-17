import Container from "@mui/material/Container";
import type { ReactNode } from "react";

/**
 * Shared vertical spacing for top-level pages. Centralized here so page
 * headers can change without page files drifting out of sync on padding.
 */
const PAGE_SPACING = { pt: { xs: 2, sm: 3 }, pb: { xs: 3, sm: 6 } };

/** Reusable page-level container with consistent max width and spacing. */
export default function PageContainer({ children }: { children: ReactNode }) {
  return (
    <Container maxWidth="xl" sx={PAGE_SPACING}>
      {children}
    </Container>
  );
}
