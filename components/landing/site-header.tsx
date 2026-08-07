import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { LogoMark } from "./logo-mark";

export function SiteHeader() {
  return (
    <Box
      component="header"
      sx={{
        position: "sticky",
        top: 0,
        zIndex: 10,
        borderBottom: 1,
        borderColor: "divider",
        bgcolor: "background.paper",
        backdropFilter: "blur(8px)",
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
            height: 72,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <LogoMark size={32} />
            <Typography
              component="span"
              sx={{ fontWeight: 700, fontSize: "1.125rem" }}
            >
              Meetings Viewer
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Button
              href="#quick-start"
              color="inherit"
              sx={{
                display: { xs: "none", sm: "inline-flex" },
                textTransform: "none",
                fontWeight: 500,
              }}
            >
              Quick start
            </Button>
            <Button
              href="/scrapers"
              variant="contained"
              sx={{ textTransform: "none", fontWeight: 600 }}
            >
              Scrapers
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
