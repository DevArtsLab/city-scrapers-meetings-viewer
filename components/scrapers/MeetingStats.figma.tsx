import figma from "@figma/code-connect";
import MeetingStats from "./MeetingStats";

// Figma: StatChip/{Total,Passed,Cancelled,Tentative,Duplicates}
// Individual chips are internal to MeetingStats, which renders the full row.
figma.connect(
  MeetingStats,
  "https://figma.com/design/YYPijzhubmRVR6ofAIZNa4?node-id=11-76",
  {
    example: () => <MeetingStats records={[]} />,
  }
);
figma.connect(
  MeetingStats,
  "https://figma.com/design/YYPijzhubmRVR6ofAIZNa4?node-id=11-79",
  {
    example: () => <MeetingStats records={[]} />,
  }
);
figma.connect(
  MeetingStats,
  "https://figma.com/design/YYPijzhubmRVR6ofAIZNa4?node-id=11-82",
  {
    example: () => <MeetingStats records={[]} />,
  }
);
figma.connect(
  MeetingStats,
  "https://figma.com/design/YYPijzhubmRVR6ofAIZNa4?node-id=11-85",
  {
    example: () => <MeetingStats records={[]} />,
  }
);
figma.connect(
  MeetingStats,
  "https://figma.com/design/YYPijzhubmRVR6ofAIZNa4?node-id=11-88",
  {
    example: () => <MeetingStats records={[]} />,
  }
);
