import Container from "@mui/material/Container";
import { AppShell } from "@/components/layout/app-shell";

const PAGE_SPACING = { pt: { xs: 2, sm: 3 }, pb: { xs: 3, sm: 6 } };

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppShell>
      <Container maxWidth="xl" sx={PAGE_SPACING}>
        {children}
      </Container>
    </AppShell>
  );
}
