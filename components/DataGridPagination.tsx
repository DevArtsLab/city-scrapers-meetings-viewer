import useMediaQuery from "@mui/material/useMediaQuery";
import Pagination from "@mui/material/Pagination";
import TablePagination from "@mui/material/TablePagination";
import type { TablePaginationActionsProps } from "@mui/material/TablePaginationActions";
import {
  gridPaginationModelSelector,
  gridPaginationRowCountSelector,
  useGridApiContext,
  useGridRootProps,
  useGridSelector,
} from "@mui/x-data-grid";

/** Replaces TablePagination's default prev/next arrows with numbered page buttons. */
function PageActions({
  count,
  page,
  rowsPerPage,
  onPageChange,
}: TablePaginationActionsProps) {
  // Below this, "1 ... 5 6 7 ... 12" plus first/last jump buttons is too
  // much to fit next to the rows-per-page control without crowding.
  const isNarrow = useMediaQuery("(max-width:600px)");
  const pageCount = Math.max(1, Math.ceil(count / rowsPerPage));
  if (pageCount <= 1) return null;

  return (
    <Pagination
      color="primary"
      size="small"
      count={pageCount}
      page={page + 1}
      onChange={(_, value) => onPageChange(null, value - 1)}
      showFirstButton={!isNarrow}
      showLastButton={!isNarrow}
      siblingCount={isNarrow ? 0 : 1}
      boundaryCount={1}
      sx={{ "& .MuiPagination-ul": { justifyContent: "flex-end", rowGap: 0.5 } }}
    />
  );
}

/**
 * DataGrid footer: one pagination control instead of two. The rows-per-page
 * dropdown, the "X-Y of Z" count, and the page buttons all live in a single
 * row, with the numbered buttons standing in for the default prev/next
 * arrows rather than sitting next to them. Wraps onto its own line on
 * narrow screens instead of overflowing.
 */
export default function DataGridPagination() {
  const apiRef = useGridApiContext();
  const rootProps = useGridRootProps();
  const paginationModel = useGridSelector(apiRef, gridPaginationModelSelector);
  const rowCount = useGridSelector(apiRef, gridPaginationRowCountSelector);

  return (
    <TablePagination
      component="div"
      count={rowCount}
      page={paginationModel.page}
      rowsPerPage={paginationModel.pageSize}
      rowsPerPageOptions={rootProps.pageSizeOptions}
      onPageChange={(_, newPage) => apiRef.current.setPage(newPage)}
      onRowsPerPageChange={(event) =>
        apiRef.current.setPageSize(Number(event.target.value))
      }
      ActionsComponent={PageActions}
      labelRowsPerPage="Rows per page:"
      sx={{
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
      }}
    />
  );
}
