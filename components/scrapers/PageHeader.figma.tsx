import figma from "@figma/code-connect";
import PageHeader from "./PageHeader";

// Figma: PageHeader (03 - Navigation)
figma.connect(
  PageHeader,
  "https://figma.com/design/YYPijzhubmRVR6ofAIZNa4?node-id=14-79",
  {
    props: {
      title: figma.textContent("Scrapers"),
    },
    example: (props) => (
      <PageHeader
        title={props.title}
        backHref="/scrapers"
        backLabel="Back to Scrapers"
      />
    ),
  }
);
