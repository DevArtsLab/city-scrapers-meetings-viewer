import figma from "@figma/code-connect";
import MeetingDetailPanel from "./MeetingDetailPanel";

// Figma: MeetingDetailPanel (04 - Data Display)
// Reads the selected meeting from MeetingSelectionContext; sticky sidebar
// at md+, right-anchored Drawer below. Renders nothing when no selection.
figma.connect(
  MeetingDetailPanel,
  "https://figma.com/design/YYPijzhubmRVR6ofAIZNa4?node-id=16-242",
  {
    example: () => <MeetingDetailPanel />,
  }
);
