import { RootProvider } from "fumadocs-ui/provider/next";
import { DocsLayout } from "fumadocs-ui/layouts/docs";
import { source } from "@/lib/source";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { DarkModeSync } from "@/components/docs/dark-mode-sync";

export default function DocsLayoutRoot({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="flex min-h-dvh flex-col"
      style={{ "--fd-banner-height": "72px" } as React.CSSProperties}
    >
      <DarkModeSync />
      <SiteHeader />
      <RootProvider theme={{ enabled: false, hotKey: false }}>
        <DocsLayout
          tree={source.pageTree}
          nav={{ title: "City Scrapers Docs", enabled: false }}
          sidebar={{
            enabled: true,
          }}
          themeSwitch={{ enabled: false }}
        >
          {children}
        </DocsLayout>
      </RootProvider>
      <SiteFooter />
    </div>
  );
}
