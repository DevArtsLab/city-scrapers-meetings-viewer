import figma from "@figma/code-connect";
import ScrapersTable from "./ScrapersTable";

// Figma: ScrapersTable (04 - Data Display)
figma.connect(
  ScrapersTable,
  "https://figma.com/design/YYPijzhubmRVR6ofAIZNa4?node-id=16-290",
  {
    example: () => <ScrapersTable spiders={[]} />,
  }
);
