import { AppRouterCacheProvider } from "@mui/material-nextjs/v16-appRouter";
import InitColorSchemeScript from "@mui/material/InitColorSchemeScript";
import Box from "@mui/material/Box";
import type { Metadata } from "next";
import { Geist, Geist_Mono, Roboto } from "next/font/google";
import { siteConfig } from "@/lib/site";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { SiteHeader } from "@/components/layout/site-header";
import { DocsDarkModeSyncScript } from "@/components/layout/dark-mode-sync-script";
import theme from "./theme";
import "./globals.css";
import { SiteFooter } from "@/components/layout/site-footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-roboto",
});

export const metadata: Metadata = {
  title: siteConfig.name,
  description: siteConfig.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${roboto.variable} h-full antialiased`}
    >
      <body>
        <InitColorSchemeScript attribute="data" />
        {/* Sync Fumadocs .dark class with MUI color scheme before hydration */}
        <DocsDarkModeSyncScript />
        {/* enableCssLayer keeps MUI's generated styles inside @layer mui so Tailwind utilities win. */}
        <AppRouterCacheProvider options={{ enableCssLayer: true }}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                minHeight: "100vh",
              }}
            >
              <SiteHeader />
              <Box
                component="main"
                sx={{ display: "flex", flexDirection: "column", flex: 1 }}
              >
                {children}
              </Box>
              <SiteFooter />
            </Box>
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
