"use client";

import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import { usePathname } from "next/navigation";
import { LogoMark } from "./logo-mark";
import { PAGE_PADDING } from "@/lib/layout";
import { siteConfig } from "@/lib/site";

export function SiteFooter() {
  const pathname = usePathname();
  const isLanding = pathname === "/";
  const isDocs = pathname.startsWith("/docs");

  if (isDocs) return null;

  return (
    <Box
      component="footer"
      sx={{
        borderTop: 1,
        borderColor: "divider",
        bgcolor: "background.paper",
      }}
    >
      <Box sx={{ p: PAGE_PADDING }}>
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
              {`${siteConfig.name} - ${siteConfig.footerTagline}`}
            </Typography>
          </Link>

          <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
            <Link
              href="/docs"
              underline="hover"
              sx={{
                fontSize: "0.875rem",
                color: "text.secondary",
              }}
            >
              Docs
            </Link>
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
            {isLanding && (
              <Link
                href="/docs/viewer/quick-start"
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
      </Box>
    </Box>
  );
}
