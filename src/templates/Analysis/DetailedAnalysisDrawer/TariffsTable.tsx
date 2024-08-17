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
      headerName: "Tarifa",
      headerAlign: "left",
      align: "left",
      flex: 2,
      sortable: false,
      minWidth: 500,
    },
    {
      field: "blue",
      headerClassName: "MuiDataGrid-columnHeaderMain",
      headerName: "Valor tarifa Azul",
      headerAlign: "right",
      align: "right",
      flex: 0.65,
      sortable: false,
      renderHeader: (params) => {
        return (<div style={{
          whiteSpace: "normal",
          lineHeight: "20px",
          textAlign: "right",
          fontWeight: 500,
        }}>
          {params.colDef.headerName}
        </div>);
      },
    },
    {
      field: "green",
      headerClassName: "MuiDataGrid-columnHeaderMain",
      headerName: "Valor tarifa Verde",
      headerAlign: "right",
      align: "right",
      flex: 0.65,
      sortable: false,
      renderHeader: (params) => {
        return (<div style={{
          whiteSpace: "normal",
          lineHeight: "20px",
          textAlign: "right",
          fontWeight: 500,
        }}>
          {params.colDef.headerName}
        </div>);
      },
    },
  ];

  const getDataGridRows = (
    tariffsTableRow: TariffsTableRow[],
  ): TariffsTableRow[] => {
    const reorderedTariffsTableRow = [
      tariffsTableRow[2],
      tariffsTableRow[5],
      tariffsTableRow[0],
      tariffsTableRow[3],
      tariffsTableRow[1],
      tariffsTableRow[4],
      tariffsTableRow[6],
    ];

    return reorderedTariffsTableRow.map(
      (row, index) => ({
        ...row,
        id: index,
        label: tariffLabelToPtBr[row.label],
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
