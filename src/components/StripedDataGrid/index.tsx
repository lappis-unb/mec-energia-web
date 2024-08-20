import { styled } from "@mui/system";
import { DataGrid, gridClasses } from "@mui/x-data-grid";
import { DataGridComponents } from "@mui/x-data-grid/themeAugmentation";

export default function StripedDataGrid(props: DataGridComponents) {
  const StripedDataGrid = styled(DataGrid)(({ theme }) => ({
    [`& .${gridClasses.row}.even`]: {
      backgroundColor: theme.palette.background.default,
    },

    [`& .${gridClasses.row}.odd`]: {
      backgroundColor: theme.palette.background.paper,
    },
  }));

  return (
    <StripedDataGrid
      style={{ marginTop: "8px", marginBottom: "8px" }}
      getRowClassName={(params) =>
        params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
      }
      disableSelectionOnClick
      autoHeight
      hideFooter
      disableColumnMenu
      {...props}
    />
  );
}