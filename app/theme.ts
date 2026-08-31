"use client";

import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  cssVariables: {
    colorSchemeSelector: "data",
  },
  colorSchemes: {
    light: {
      palette: {
        primary: {
          main: "#4f7cc7",
        },
      },
    },
    dark: true,
  },
  typography: {
    fontFamily: "var(--font-roboto)",
  },
});

export default theme;
