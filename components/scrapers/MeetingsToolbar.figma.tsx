import figma from "@figma/code-connect";
import MeetingsToolbar from "./MeetingsToolbar";

// Figma: MeetingsToolbar (04 - Data Display)
// Stacks vertically below sm; FilterButton + count + MeetingStats.
figma.connect(
  MeetingsToolbar,
  "https://figma.com/design/YYPijzhubmRVR6ofAIZNa4?node-id=16-5",
  {
    example: () => (
      <MeetingsToolbar
        records={[]}
        filteredCount={0}
        filtersOpen={false}
        onToggleFilters={() => {}}
        panelId="filters-panel"
      />
    ),
  }
);
