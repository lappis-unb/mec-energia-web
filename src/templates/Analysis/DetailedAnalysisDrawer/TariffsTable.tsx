import StripedDataGrid from "@/components/StripedDataGrid";
import { tariffLabelToPtBr, TariffsTableRow } from "@/types/recommendation";
import {
  Box,
  TableContainer,
} from "@mui/material";
import Paper from "@mui/material/Paper";
import { GridColDef } from "@mui/x-data-grid";

interface Props {
  rows: TariffsTableRow[];
}

export const TariffsTable = ({ rows }: Props) => {
  const copy = [...rows].sort((a, b) => {
    if (a.billingTime > b.billingTime) return -1;
    if (a.billingTime < b.billingTime) return 1;
    return 0;
  });

  copy.sort((a, b) => {
    if (a.label > b.label) return -1;
    if (a.label < b.label) return 1;
    return 0;
  });

  const tableRows = copy.map((r) => ({
    ...r,
    blue: r.blue ? r.blue.toLocaleString("pt-BR") : "-",
    green: r.green ? r.green.toLocaleString("pt-BR") : "-",
  }));

  const columns: GridColDef<TariffsTableRow>[] = [
    {
      field: "label",
      headerName: "Tipo de tarifa",
      headerAlign: "left",
      align: "left",
      flex: 2,
      sortable: false
    },
    {
      field: "billingTime",
      headerClassName: "MuiDataGrid-columnHeaderMain",
      headerName: "Posto tarifário",
      headerAlign: "center",
      align: "center",
      flex: 1,
      sortable: false
    },
    {
      field: "blue",
      headerClassName: "MuiDataGrid-columnHeaderMain",
      headerName: "Valor tarifa azul",
      headerAlign: "right",
      align: "right",
      flex: 1,
      sortable: false
    },
    {
      field: "green",
      headerClassName: "MuiDataGrid-columnHeaderMain",
      headerName: "Valor tarifa verde",
      headerAlign: "right",
      align: "right",
      flex: 1,
      sortable: false
    },
  ];

  const getDataGridRows = (
    tariffsTableRow: TariffsTableRow[]
  ): TariffsTableRow[] => {
    return tariffsTableRow.map(
      (row, index) => ({
        ...row,
        id: index,
        label: tariffLabelToPtBr[row.label],
        billingTime: row.billingTime,
        blue: row.blue,
        green: row.green,
      })
    );
  };

  return (
    <>
      <Box>
        <TableContainer component={Paper} sx={{ boxShadow: 0 }}>
          <StripedDataGrid 
            columns={columns}
            rows={getDataGridRows(tableRows)}
          />
        </TableContainer>
      </Box>
    </>
  );
};
