import { RootProvider } from "fumadocs-ui/provider/next";
import { DocsLayout } from "fumadocs-ui/layouts/docs";
import { source } from "@/lib/source";
import { DarkModeSync } from "@/components/docs/dark-mode-sync";
import { siteConfig } from "@/lib/site";

export default function DocsLayoutRoot({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <DarkModeSync />
      <RootProvider theme={{ enabled: false, hotKey: false }}>
        <DocsLayout
          tree={source.pageTree}
          nav={{ title: siteConfig.docsNavTitle, enabled: false }}
          sidebar={{
            enabled: true,
          }}
          themeSwitch={{ enabled: false }}
          containerProps={{
            style: {
              "--fd-layout-width": "100vw",
              "--fd-docs-row-1": "69px",
            } as React.CSSProperties,
          }}
        >
          {children}
        </DocsLayout>
      </RootProvider>
    </>
  );
}
