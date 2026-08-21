import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import { LogoMark } from "./logo-mark";

export function SiteFooter({
  showLandingLinks = false,
}: {
  showLandingLinks?: boolean;
}) {
  return (
    <Box
      component="footer"
      sx={{
        borderTop: 1,
        borderColor: "divider",
        py: 6,
        bgcolor: "background.paper",
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 3,
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
            <LogoMark size={24} />
            <Typography
              sx={{
                fontSize: "0.875rem",
                color: "text.secondary",
              }}
            >
              Meetings Viewer — QA tooling for city-scrapers output
            </Typography>
          </Link>

          <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
            <Link
              href="/scrapers"
              underline="hover"
              sx={{
                fontSize: "0.875rem",
                color: "text.secondary",
              }}
            >
              Scrapers
            </Link>
            {showLandingLinks && (
              <Link
                href="#quick-start"
                underline="hover"
                sx={{
                  fontSize: "0.875rem",
                  color: "text.secondary",
                }}
              >
                Quick start
              </Link>
            )}
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
