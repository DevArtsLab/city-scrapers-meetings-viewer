import Box from "@mui/material/Box";

/**
 * Inline version of the app icon (app/icon.svg), themed to the MUI palette so
 * it can sit inside the header and footer without a second asset.
 */
export function LogoMark({ size = 28 }: { size?: number }) {
  return (
    <Box
      component="svg"
      viewBox="0 0 32 32"
      aria-hidden="true"
      sx={{ width: size, height: size, display: "block", flexShrink: 0 }}
    >
      <Box
        component="rect"
        width="32"
        height="32"
        rx="7"
        sx={{ fill: "text.primary" }}
      />
      <Box
        component="rect"
        x="7"
        y="7"
        width="18"
        height="3"
        rx="1.5"
        sx={{ fill: "background.default" }}
      />
      <Box
        component="rect"
        x="7"
        y="13.5"
        width="18"
        height="2.5"
        rx="1.25"
        sx={{ fill: "background.default", opacity: 0.5 }}
      />
      <Box
        component="rect"
        x="7"
        y="18.5"
        width="13"
        height="2.5"
        rx="1.25"
        sx={{ fill: "background.default", opacity: 0.5 }}
      />
      <Box
        component="rect"
        x="7"
        y="23.5"
        width="8"
        height="2.5"
        rx="1.25"
        sx={{ fill: "primary.main" }}
      />
    </Box>
  );
}
