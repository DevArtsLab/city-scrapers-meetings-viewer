import ArrowForwardRounded from "@mui/icons-material/ArrowForwardRounded";
import CheckCircleRounded from "@mui/icons-material/CheckCircleRounded";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { CONTENT_MAX_WIDTH } from "@/lib/layout";
import { siteConfig } from "@/lib/site";

const facts = [
  "No database",
  "No API server",
  "Reads scrapy output straight from disk",
];

export function Hero() {
  return (
    <Box
      component="section"
      sx={{
        pt: { xs: 8, md: 12 },
        pb: { xs: 8, md: 10 },
        position: "relative",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 600,
          background:
            "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(25, 118, 210, 0.08), transparent)",
          pointerEvents: "none",
        },
      }}
    >
      <Container maxWidth={CONTENT_MAX_WIDTH} sx={{ position: "relative" }}>
        <Box sx={{ maxWidth: 800, mx: "auto", textAlign: "center" }}>
          <Typography
            component="p"
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 1,
              px: 2,
              py: 1,
              mb: 4,
              borderRadius: 2,
              border: 1,
              borderColor: "divider",
              color: "text.secondary",
              fontSize: "0.875rem",
            }}
          >
            <Box
              component="span"
              sx={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                bgcolor: "primary.main",
              }}
            />
            QA tooling for city-scrapers
          </Typography>

          <Typography
            component="h1"
            sx={{
              fontSize: { xs: "2.5rem", sm: "3rem", md: "3.75rem" },
              fontWeight: 600,
              lineHeight: 1.1,
              mb: 3,
              letterSpacing: "-0.02em",
            }}
          >
            See exactly what your scraper produced.
          </Typography>

          <Typography
            sx={{
              fontSize: { xs: "1.125rem", md: "1.25rem" },
              lineHeight: 1.6,
              color: "text.secondary",
              maxWidth: 700,
              mx: "auto",
              mb: 4,
            }}
          >
            {siteConfig.name} turns raw Scrapy JSON into a browsable, filterable
            table. Review a spider&apos;s output in minutes instead of an
            afternoon — and stop debating whether a scraper is actually working.
          </Typography>

          <Box
            sx={{
              mt: 4,
              display: "flex",
              flexWrap: "wrap",
              gap: 2,
              justifyContent: "center",
            }}
          >
            <Button
              href="/scrapers"
              variant="contained"
              size="large"
              endIcon={<ArrowForwardRounded />}
              sx={{ textTransform: "none", fontWeight: 500, px: 3 }}
            >
              Browse scrapers
            </Button>
            <Button
              href="/docs/viewer/quick-start"
              variant="outlined"
              size="large"
              sx={{
                textTransform: "none",
                fontWeight: 500,
                px: 3,
              }}
            >
              Quick start
            </Button>
          </Box>

          <Box
            component="ul"
            sx={{
              p: 0,
              m: 0,
              mt: 6,
              listStyle: "none",
              display: "flex",
              flexWrap: "wrap",
              gap: 3,
              justifyContent: "center",
            }}
          >
            {facts.map((fact) => (
              <Typography
                key={fact}
                component="li"
                sx={{
                  fontSize: "0.875rem",
                  color: "text.secondary",
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <CheckCircleRounded
                  sx={{ fontSize: 16, color: "primary.main" }}
                />
                {fact}
              </Typography>
            ))}
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
