import { AppShell } from "@/components/layout/app-shell";

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppShell showLandingLinks>{children}</AppShell>;
}
