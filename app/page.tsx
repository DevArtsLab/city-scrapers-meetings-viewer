import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import NextLink from "@/components/ui/NextLink";

/**
 * Landing page for the Meetings Viewer application.
 *
 * The viewer is a web interface for inspecting the JSON output of
 * city-meeting scrapers. Its purpose is to reduce QA time during scraper
 * development and remove ambiguity between QA teams about whether a scraper
 * is functional. The primary entry point is the scrapers index at /scrapers.
 */
export default function Home() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        flex: 1,
        textAlign: "center",
        px: 2,
        py: { xs: 6, sm: 10 },
      }}
    >
      <Container maxWidth="sm">
        <Typography variant="h3" component="h1" sx={{ fontWeight: 700, mb: 2 }}>
          Meetings Viewer
        </Typography>
        <Typography
          variant="h6"
          component="p"
          color="text.secondary"
          sx={{ mb: 1.5, fontWeight: 400 }}
        >
          A web interface for inspecting the JSON output of city scrapers.
        </Typography>
        <Typography
          variant="body1"
          component="p"
          color="text.secondary"
          sx={{ mb: 4 }}
        >
          Reducing QA time during scraper development and clearing up confusion
          between QA teams about whether a scraper is functional.
        </Typography>
        <Button
          component={NextLink}
          href="/scrapers"
          variant="contained"
          size="large"
        >
          Browse Scrapers
        </Button>
      </Container>
    </Box>
  );
}
