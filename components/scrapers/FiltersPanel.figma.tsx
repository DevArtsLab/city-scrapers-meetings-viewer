import figma from "@figma/code-connect";
import FiltersPanel from "./FiltersPanel";

// Figma: FiltersPanel (04 - Data Display)
// Sticky sidebar on sm+ (300px), expands inline on mobile.
figma.connect(
  FiltersPanel,
  "https://figma.com/design/YYPijzhubmRVR6ofAIZNa4?node-id=16-152",
  {
    example: () => <FiltersPanel open onClose={() => {}} id="filters-panel" />,
  }
);
