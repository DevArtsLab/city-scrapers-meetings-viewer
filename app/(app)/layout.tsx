import Container from "@mui/material/Container";

const PAGE_SPACING = { pt: { xs: 2, sm: 3 }, pb: { xs: 3, sm: 6 } };

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <Container maxWidth="xl" sx={PAGE_SPACING}>
      {children}
    </Container>
  );
}
