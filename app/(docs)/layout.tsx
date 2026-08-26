import { RootProvider } from "fumadocs-ui/provider/next";
import { DocsLayout } from "fumadocs-ui/layouts/docs";
import { source } from "@/lib/source";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";

export default function DocsLayoutRoot({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <RootProvider theme={{ enabled: false, hotKey: false }}>
        <DocsLayout
          tree={source.pageTree}
          nav={{ title: "City Scrapers Docs", enabled: false }}
          sidebar={{
            enabled: true,
          }}
        >
          {children}
        </DocsLayout>
      </RootProvider>
      <SiteFooter />
    </div>
  );
}
