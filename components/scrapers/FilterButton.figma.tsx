import figma from "@figma/code-connect";
import FilterButton from "./FilterButton";

// Figma: FilterButton variant set (02 - Primitives)
figma.connect(
  FilterButton,
  "https://figma.com/design/YYPijzhubmRVR6ofAIZNa4?node-id=168-41",
  {
    props: {
      open: figma.enum("State", {
        closed: false,
        open: true,
      }),
    },
    example: (props) => (
      <FilterButton
        open={props.open}
        onToggle={() => {}}
        panelId="filters-panel"
      />
    ),
  }
);
