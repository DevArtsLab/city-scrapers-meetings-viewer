import figma from "@figma/code-connect";
import MeetingCard from "./MeetingCard";
import type { MeetingRecord } from "@/lib/scraper-data";

const record: MeetingRecord = {
  id: "meeting-1",
  title: "Sample title",
  description: "",
  classification: "City Council",
  start: "2024-06-17 13:00:00",
  end: "2024-06-17 15:00:00",
  all_day: false,
  time_notes: "",
  location: { name: "Test Building", address: "" },
  links: [],
  source: "",
  status: "confirmed",
};

// Figma: MeetingCard (04 - Data Display)
// Mobile alternative to the table row; paper outline, status chip top-right.
figma.connect(
  MeetingCard,
  "https://figma.com/design/YYPijzhubmRVR6ofAIZNa4?node-id=16-133",
  {
    example: () => <MeetingCard record={record} />,
  }
);
