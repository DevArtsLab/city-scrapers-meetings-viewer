import figma from "@figma/code-connect";
import { LogoMark } from "./logo-mark";

// Figma: LogoMark (03 - Navigation)
// Theme-responsive via CSS vars; Figma uses logo/plate + logo/accent vars.
figma.connect(
  LogoMark,
  "https://figma.com/design/YYPijzhubmRVR6ofAIZNa4?node-id=14-5",
  {
    example: () => <LogoMark size={32} />,
  }
);
