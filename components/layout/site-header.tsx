"use client";

import { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import Link from "@mui/material/Link";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { usePathname } from "next/navigation";
import { LogoMark } from "./logo-mark";
import { siteConfig } from "@/lib/site";
import { PAGE_PADDING, SECTION_GAP } from "@/lib/layout";
import { Toolbar } from "@mui/material";

type NavItem = {
  label: string;
  href: string;
  variant?: "contained" | "text";
};

function useNavItems() {
  const isLanding = usePathname() === "/";
  const items: NavItem[] = [];
  if (isLanding) {
    items.push({
      label: "Quick start",
      href: "/docs/viewer/quick-start",
    });
  }
  items.push({ label: "Docs", href: "/docs" });
  items.push({ label: "Scrapers", href: "/scrapers", variant: "contained" });
  return items;
}

export function SiteHeader() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const pathname = usePathname();
  const navItems = useNavItems();

  const drawer = (
    <Box
      sx={{ width: 280 }}
      role="presentation"
      onClick={() => setDrawerOpen(false)}
    >
      <Link
        href="/"
        title="Go to homepage"
        aria-label={`${siteConfig.name} - go to homepage`}
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          px: 2.5,
          py: 2,
          borderBottom: 1,
          borderColor: "divider",
          textDecoration: "none",
          color: "inherit",
        }}
      >
        <LogoMark size={28} />
        <Typography sx={{ fontWeight: 600, fontSize: "1rem" }}>
          {siteConfig.name}
        </Typography>
      </Link>

      <List sx={{ pt: 1, px: 1.5 }}>
        {navItems.map((item) => {
          const active = pathname === item.href;
          return (
            <ListItemButton
              key={item.href}
              component="a"
              href={item.href}
              sx={{
                borderRadius: 1,
                mb: 0.5,
                py: 1.25,
                bgcolor: active ? "action.selected" : "transparent",
                "&:hover": {
                  bgcolor: "action.hover",
                },
              }}
            >
              <ListItemText
                primary={item.label}
                slotProps={{
                  primary: {
                    sx: {
                      fontWeight: active ? 600 : 500,
                      fontSize: "0.9375rem",
                    },
                  },
                }}
              />
              <ChevronRightIcon sx={{ fontSize: 20, color: "text.disabled" }} />
            </ListItemButton>
          );
        })}
      </List>

      <Divider sx={{ my: 1.5 }} />

      <Box sx={{ px: 2.5, py: 1 }}>
        <Typography sx={{ fontSize: "0.75rem", color: "text.secondary" }}>
          {siteConfig.tagline}
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Box
      component="header"
      sx={{
        position: "sticky",
        top: 0,
        zIndex: 40,
        borderBottom: 1,
        borderColor: "divider",
        bgcolor: "background.paper",
        backdropFilter: "blur(8px)",
      }}
    >
      <Toolbar sx={{ p: PAGE_PADDING }} disableGutters>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            flexGrow: 1,
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Link
            href="/"
            title="Go to homepage"
            aria-label={`${siteConfig.name} - go to homepage`}
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
              {siteConfig.name}
            </Typography>
          </Link>

          {/* Desktop nav */}
          <Box
            sx={{
              display: { xs: "none", sm: "flex" },
              flexDirection: "row",
              // gap: 1.5,
              alignItems: "center",
            }}
          >
            {navItems.map((item) => (
              <Button
                key={item.href}
                href={item.href}
                color={item.variant === "contained" ? "primary" : "inherit"}
                variant={item.variant ?? "text"}
                sx={{ textTransform: "none" }}
              >
                {item.label}
              </Button>
            ))}
          </Box>

          {/* Mobile hamburger */}
          <IconButton
            aria-label="Open navigation menu"
            onClick={() => setDrawerOpen(true)}
            sx={{ display: { xs: "inline-flex", sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
        </Box>
      </Toolbar>

      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        slotProps={{ paper: { sx: { width: 280 } } }}
      >
        {drawer}
      </Drawer>
    </Box>
  );
}
