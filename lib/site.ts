/**
 * Single source of truth for the site name, taglines, and descriptions.
 * Every layout, page, and component should import from here instead of
 * hard-coding strings.
 */
export const siteConfig = {
  name: "Meetings Viewer",
  tagline: "QA tooling for city-scrapers",
  description:
    "Inspect the JSON output of city-meeting scrapers as a browsable, filterable table. Built to cut QA time during scraper development.",
  landingDescription:
    "Turn raw Scrapy JSON into a browsable, filterable table. Review a spider's output in minutes instead of an afternoon.",
  docsNavTitle: "City Scrapers Docs",
  footerTagline: "QA tooling for city-scrapers output",
} as const;

/** Build a page title in the `Subtitle - App Name` format. */
export function pageTitle(subtitle?: string): string {
  return subtitle ? `${subtitle} - ${siteConfig.name}` : siteConfig.name;
}
