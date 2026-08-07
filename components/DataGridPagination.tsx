import useMediaQuery from "@mui/material/useMediaQuery";
import Pagination from "@mui/material/Pagination";
import type { TablePaginationProps } from "@mui/material/TablePagination";
import {
  gridPageCountSelector,
  useGridApiContext,
  useGridSelector,
} from "@mui/x-data-grid";

/** Replaces TablePagination's default prev/next arrows with numbered page buttons. */
function PageActions({
  page,
  onPageChange,
  className,
}: Pick<TablePaginationProps, "page" | "onPageChange" | "className">) {
  const apiRef = useGridApiContext();
  const pageCount = useGridSelector(apiRef, gridPageCountSelector);
  // Below this, "1 ... 5 6 7 ... 12" plus first/last jump buttons is too
  // much to fit next to the rows-per-page control without crowding.
  const isNarrow = useMediaQuery("(max-width:600px)");
  if (pageCount <= 1) return null;

  return (
    <Pagination
      className={className}
      color="primary"
      size="small"
      count={pageCount}
      page={page + 1}
      onChange={(_, value) => onPageChange(null, value - 1)}
      showFirstButton={!isNarrow}
      showLastButton={!isNarrow}
      siblingCount={isNarrow ? 0 : 1}
      sx={{ "& .MuiPagination-ul": { justifyContent: "flex-end", rowGap: 0.5 } }}
    />
  );
}

/**
 * Pass to DataGrid's `slotProps` to swap the default footer's prev/next
 * arrows for numbered page buttons (MUI's documented recipe: reuse the
 * built-in GridPagination/TablePagination and only override ActionsComponent
 * rather than reimplementing the footer). Also makes it wrap onto its own
 * line on narrow screens instead of overflowing.
 */
export const dataGridPaginationSlotProps = {
  basePagination: {
    material: {
      ActionsComponent: PageActions,
      sx: {
        width: "100%",
        "& .MuiTablePagination-toolbar": {
          flexWrap: "wrap",
          justifyContent: "flex-end",
          rowGap: 1,
          columnGap: { xs: 1.5, sm: 2 },
          minHeight: "auto",
          py: 1,
          px: { xs: 1.5, sm: 2 },
        },
        "& .MuiTablePagination-spacer": {
          display: "none",
        },
        "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows": {
          margin: 0,
        },
        "& .MuiTablePagination-actions": {
          marginLeft: 0,
        },
      },
    },
  },
};
