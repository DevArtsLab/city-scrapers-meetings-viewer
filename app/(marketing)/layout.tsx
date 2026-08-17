import Box from "@mui/material/Box";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Box sx={{ minHeight: "100dvh", bgcolor: "background.default" }}>
      <SiteHeader />
      <Box component="main">{children}</Box>
      <SiteFooter />
    </Box>
  );
}
