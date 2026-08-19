import Box from "@mui/material/Box";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";

export function AppShell({
  children,
  showLandingLinks = false,
}: {
  children: React.ReactNode;
  showLandingLinks?: boolean;
}) {
  return (
    <Box
      sx={{
        minHeight: "100dvh",
        display: "flex",
        flexDirection: "column",
        bgcolor: "background.default",
      }}
    >
      <SiteHeader showLandingLinks={showLandingLinks} />
      <Box component="main" sx={{ flex: 1 }}>
        {children}
      </Box>
      <SiteFooter showLandingLinks={showLandingLinks} />
    </Box>
  );
}
