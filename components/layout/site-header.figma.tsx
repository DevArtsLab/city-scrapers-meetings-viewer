import figma from "@figma/code-connect";
import { SiteHeader } from "./site-header";

// Figma: SiteHeader/Desktop (03 - Navigation)
// One responsive component: desktop nav at sm+, hamburger drawer below.
figma.connect(
  SiteHeader,
  "https://figma.com/design/YYPijzhubmRVR6ofAIZNa4?node-id=14-12",
  {
    example: () => <SiteHeader />,
  }
);

// Figma: SiteHeader/Mobile (03 - Navigation)
figma.connect(
  SiteHeader,
  "https://figma.com/design/YYPijzhubmRVR6ofAIZNa4?node-id=14-39",
  {
    example: () => <SiteHeader />,
  }
);

// Figma: NavDrawer (03 - Navigation)
// The drawer content lives inside SiteHeader (MUI Drawer, below sm).
figma.connect(
  SiteHeader,
  "https://figma.com/design/YYPijzhubmRVR6ofAIZNa4?node-id=14-52",
  {
    example: () => <SiteHeader />,
  }
);
