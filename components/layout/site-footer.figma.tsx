import figma from "@figma/code-connect";
import { SiteFooter } from "./site-footer";

// Figma: SiteFooter (03 - Navigation)
// Hidden on /docs routes; "Quick start" link only on the landing page.
figma.connect(
  SiteFooter,
  "https://figma.com/design/YYPijzhubmRVR6ofAIZNa4?node-id=14-89",
  {
    example: () => <SiteFooter />,
  }
);
