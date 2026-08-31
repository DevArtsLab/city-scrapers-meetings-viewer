import Box from "@mui/material/Box";
import { PAGE_PADDING, SECTION_GAP } from "@/lib/layout";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: SECTION_GAP,
        flex: 1,
        p: PAGE_PADDING,
      }}
    >
      {children}
    </Box>
  );
}
