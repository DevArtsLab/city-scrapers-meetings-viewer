/**
 * Landing page for the Meetings Viewer application.
 *
 * The viewer is a web interface for inspecting the JSON output of
 * city-meeting scrapers. Its purpose is to reduce QA time during scraper
 * development and remove ambiguity between QA teams about whether a scraper
 * is functional. The primary entry point is the scrapers index at /scrapers.
 */
import Box from "@mui/material/Box";
import { Capabilities } from "./capabilities";
import { Hero } from "./hero";
import { Modes } from "./modes";
import { QuickStart } from "./quick-start";
import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";

export function LandingPage() {
  return (
    <Box sx={{ minHeight: "100dvh", bgcolor: "background.default" }}>
      <SiteHeader />
      <Box component="main">
        <Hero />
        <Modes />
        <Capabilities />
        <QuickStart />
      </Box>
      <SiteFooter />
    </Box>
  );
}
