import { tariffLabelToPtBr, TariffsTableRow } from "@/types/recommendation";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import Paper from "@mui/material/Paper";

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
      <Box
        sx={{
          "@media print": {
            width: "620px",
            marginX: "auto",
          }
        }}
      >
        <TableContainer component={Paper} sx={{ boxShadow: 0 }}>
          <Table aria-label="simple table">
            <TableHead
              sx={{ bgcolor: "primary.main", display: "table-header-group" }}
            >
              <TableRow sx={{ th: { color: "white" } }}>
                <TableCell align="left">
                  Tarifa
                </TableCell>
                <TableCell align="right">
                  Valor tarifa Azul
                </TableCell>
                <TableCell align="right">
                  Valor tarifa Verde
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody
              sx={{
                "tr:nth-of-type(even)": { bgcolor: "background.default" },
              }}
            >
              {getDataGridRows(tableRows).map((row) => {
                return row.label && (
                  <TableRow
                    key={row.label}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell align="left">{row.label}</TableCell>
                    <TableCell align="right">{row.blue}</TableCell>
                    <TableCell align="right">{row.green}</TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </>
  );
};
