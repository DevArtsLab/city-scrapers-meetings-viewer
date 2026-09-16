import figma from "@figma/code-connect";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Switch from "@mui/material/Switch";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/icons-material/Menu";
import Close from "@mui/icons-material/Close";
import FilterList from "@mui/icons-material/FilterList";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { FullSearchTrigger } from "fumadocs-ui/layouts/shared/slots/search-trigger";

// Figma: Button variant set (02 - Primitives)
// "tonal" is an app convention: MUI text button tinted via primary channel
// (see SiteHeader nav items).
figma.connect(
  Button,
  "https://figma.com/design/YYPijzhubmRVR6ofAIZNa4?node-id=11-60",
  {
    props: {
      variant: figma.enum("Variant", {
        contained: "contained",
        outlined: "outlined",
        tonal: "text",
      }),
      size: figma.enum("Size", {
        sm: "small",
        md: "medium",
        lg: "large",
      }),
    },
    example: (props) => (
      <Button variant={props.variant} size={props.size}>
        Label
      </Button>
    ),
  }
);

// Figma: IconButton/{menu,close,filter} (02 - Primitives)
figma.connect(
  IconButton,
  "https://figma.com/design/YYPijzhubmRVR6ofAIZNa4?node-id=13-37",
  {
    example: () => (
      <IconButton aria-label="Open navigation menu">
        <Menu />
      </IconButton>
    ),
  }
);
figma.connect(
  IconButton,
  "https://figma.com/design/YYPijzhubmRVR6ofAIZNa4?node-id=13-40",
  {
    example: () => (
      <IconButton size="small" aria-label="Close">
        <Close fontSize="small" />
      </IconButton>
    ),
  }
);
figma.connect(
  IconButton,
  "https://figma.com/design/YYPijzhubmRVR6ofAIZNa4?node-id=13-43",
  {
    example: () => (
      <IconButton aria-label="Toggle filters">
        <FilterList />
      </IconButton>
    ),
  }
);

// Figma: Switch/off + Switch/on (02 - Primitives)
figma.connect(
  Switch,
  "https://figma.com/design/YYPijzhubmRVR6ofAIZNa4?node-id=13-27",
  {
    example: () => <Switch checked={false} />,
  }
);
figma.connect(
  Switch,
  "https://figma.com/design/YYPijzhubmRVR6ofAIZNa4?node-id=13-31",
  {
    example: () => <Switch checked />,
  }
);

// Figma: SearchTrigger (02 - Primitives)
// Fumadocs FullSearchTrigger, used in SiteHeader and NavDrawer.
figma.connect(
  FullSearchTrigger,
  "https://figma.com/design/YYPijzhubmRVR6ofAIZNa4?node-id=13-47",
  {
    example: () => <FullSearchTrigger style={{ width: "100%" }} />,
  }
);

// Figma: Input/Search (02 - Primitives)
// MUI TextField as used in MeetingFilters.
figma.connect(
  TextField,
  "https://figma.com/design/YYPijzhubmRVR6ofAIZNa4?node-id=168-20",
  {
    example: () => <TextField label="Search" size="small" fullWidth />,
  }
);

// Figma: Input/Select (02 - Primitives)
// MUI TextField with select + MenuItem options.
figma.connect(
  TextField,
  "https://figma.com/design/YYPijzhubmRVR6ofAIZNa4?node-id=168-31",
  {
    example: () => (
      <TextField select label="Scope" size="small" fullWidth>
        <MenuItem value="all">All</MenuItem>
      </TextField>
    ),
  }
);

// Figma: Input/Date (02 - Primitives)
// MUI X DatePicker inside LocalizationProvider (see DateRangeFilter).
figma.connect(
  DatePicker,
  "https://figma.com/design/YYPijzhubmRVR6ofAIZNa4?node-id=168-40",
  {
    example: () => <DatePicker label="Date" />,
  }
);
