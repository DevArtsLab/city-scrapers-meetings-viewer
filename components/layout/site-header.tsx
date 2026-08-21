import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import { LogoMark } from "./logo-mark";

export function SiteHeader({
  showLandingLinks = false,
}: {
  showLandingLinks?: boolean;
}) {
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
          <Link
            href="/"
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              textDecoration: "none",
              color: "inherit",
            }}
          >
            <LogoMark size={32} />
            <Typography
              component="span"
              sx={{ fontWeight: 600, fontSize: "1.125rem" }}
            >
              Meetings Viewer
            </Typography>
          </Link>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {showLandingLinks && (
              <Button
                href="#quick-start"
                color="inherit"
                sx={{
                  display: { xs: "none", sm: "inline-flex" },
                  textTransform: "none",
                }}
              >
                Quick start
              </Button>
            )}
            <Button
              href="/scrapers"
              variant="contained"
              sx={{ textTransform: "none" }}
            >
              Scrapers
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
