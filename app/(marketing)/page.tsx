import { Capabilities } from "@/components/landing/capabilities";
import { Hero } from "@/components/landing/hero";
import { Modes } from "@/components/landing/modes";
import { QuickStart } from "@/components/landing/quick-start";

export default function Home() {
  return (
    <>
      <Hero />
      <Modes />
      <Capabilities />
      <QuickStart />
    </>
  );
}
