import Box from "@mui/material/Box";

/**
 * Inline version of the app icon, themed to the MUI palette so
 * it can sit inside the header and footer without a second asset.
 * Responds to light/dark color schemes via MUI theme tokens.
 */
export function LogoMark({ size = 28 }: { size?: number }) {
  return (
    <Box
      component="svg"
      viewBox="0 0 72 72"
      aria-hidden="true"
      sx={{
        width: size,
        height: size,
        display: "block",
        flexShrink: 0,
        "--mv-plate": "#10151A",
        "--mv-row": "#F4F2ED",
        "--mv-accent": "#1F4FD8",
        "@media (prefers-color-scheme: dark)": {
          "--mv-plate": "#F4F2ED",
          "--mv-row": "#10151A",
          "--mv-accent": "#5B87FF",
        },
      }}
    >
      {/* <Box
        component="rect"
        x="0"
        y="0"
        width="72"
        height="72"
        rx="16"
        sx={{ fill: "var(--mv-plate)" }}
      /> */}
      <Box
        component="rect"
        x="2"
        y="2"
        width="68"
        height="68"
        rx="14"
        sx={{ fill: "none", stroke: "var(--mv-plate)", strokeWidth: 1.5, opacity: 0.2 }}
      />
      <Box
        component="rect"
        x="16"
        y="22"
        width="40"
        height="6"
        rx="3"
        sx={{ fill: "var(--mv-plate)" }}
      />
      <Box
        component="rect"
        x="16"
        y="33"
        width="26"
        height="6"
        rx="3"
        sx={{ fill: "var(--mv-plate)", opacity: 0.55 }}
      />
      <Box
        component="rect"
        x="16"
        y="44"
        width="34"
        height="6"
        rx="3"
        sx={{ fill: "var(--mv-accent)" }}
      />
    </Box>
  );
}
