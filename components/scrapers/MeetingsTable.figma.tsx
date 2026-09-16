import figma from "@figma/code-connect";
import MeetingsTable from "./MeetingsTable";

// Figma: MeetingsTable (04 - Data Display)
// MUI X DataGrid wrapper: 39px header, 16px cell padding, 62px footer.
figma.connect(
  MeetingsTable,
  "https://figma.com/design/YYPijzhubmRVR6ofAIZNa4?node-id=16-35",
  {
    example: () => (
      <MeetingsTable
        records={[]}
        search=""
        searchScope="all"
        duplicateInfoMap={new Map()}
      />
    ),
  }
);

// Figma: EmptyState/No meetings (04 - Data Display)
// Internal noRowsOverlay of MeetingsTable.
figma.connect(
  MeetingsTable,
  "https://figma.com/design/YYPijzhubmRVR6ofAIZNa4?node-id=168-43",
  {
    example: () => (
      <MeetingsTable
        records={[]}
        search=""
        searchScope="all"
        duplicateInfoMap={new Map()}
      />
    ),
  }
);

// Figma: EmptyState/All columns hidden (04 - Data Display)
// Internal noColumnsOverlay of MeetingsTable.
figma.connect(
  MeetingsTable,
  "https://figma.com/design/YYPijzhubmRVR6ofAIZNa4?node-id=168-46",
  {
    example: () => (
      <MeetingsTable
        records={[]}
        search=""
        searchScope="all"
        duplicateInfoMap={new Map()}
      />
    ),
  }
);

// Figma: EmptyState/No rows (04 - Data Display)
figma.connect(
  MeetingsTable,
  "https://figma.com/design/YYPijzhubmRVR6ofAIZNa4?node-id=168-49",
  {
    example: () => (
      <MeetingsTable
        records={[]}
        search=""
        searchScope="all"
        duplicateInfoMap={new Map()}
      />
    ),
  }
);
