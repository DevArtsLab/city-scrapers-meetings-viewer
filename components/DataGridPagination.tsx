import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import {
  GridPagination,
  gridPageCountSelector,
  gridPageSelector,
  useGridApiContext,
  useGridSelector,
} from "@mui/x-data-grid";

/**
 * DataGrid footer that adds a numbered page selector next to the default
 * rows-per-page control, so users can jump straight to a page instead of
 * only stepping one at a time.
 */
export default function DataGridPagination() {
  const apiRef = useGridApiContext();
  const pageCount = useGridSelector(apiRef, gridPageCountSelector);
  const page = useGridSelector(apiRef, gridPageSelector);

  return (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      sx={{
        width: "100%",
        alignItems: "center",
        justifyContent: "flex-end",
        flexWrap: "wrap",
      }}
    >
      {pageCount > 1 && (
        <Pagination
          color="primary"
          size="small"
          count={pageCount}
          page={page + 1}
          onChange={(_, value) => apiRef.current.setPage(value - 1)}
          showFirstButton
          showLastButton
        />
      )}
      <GridPagination />
    </Stack>
  );
}
