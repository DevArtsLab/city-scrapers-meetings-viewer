import figma from "@figma/code-connect";
import BackLink from "./BackLink";

// Figma: BackLink (02 - Primitives)
figma.connect(
  BackLink,
  "https://figma.com/design/YYPijzhubmRVR6ofAIZNa4?node-id=13-59",
  {
    props: {
      label: figma.textContent("Back to Scrapers"),
    },
    example: (props) => <BackLink href="/scrapers" label={props.label} />,
  }
);
