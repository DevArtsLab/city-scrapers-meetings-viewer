import figma from "@figma/code-connect";
import { StatusChip } from "./StatusChip";

// Figma: StatusChip variant set (02 - Primitives)
figma.connect(
  StatusChip,
  "https://figma.com/design/YYPijzhubmRVR6ofAIZNa4?node-id=11-73",
  {
    props: {
      status: figma.enum("Status", {
        passed: "passed",
        cancelled: "cancelled",
        tentative: "tentative",
        confirmed: "confirmed",
        default: "",
      }),
    },
    example: (props) => <StatusChip status={props.status} />,
  }
);
