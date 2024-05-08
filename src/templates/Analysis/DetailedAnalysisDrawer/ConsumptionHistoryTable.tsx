import { ConsumptionHistoryTableRow } from "@/types/recommendation";
import { monthYear } from "@/utils/date";
import { formatNumber } from "@/utils/number";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

interface Props {
  consumptionHistory: ConsumptionHistoryTableRow[];
}

export const ConsumptionHistoryTable = ({ consumptionHistory }: Props) => {
  return (
    <TableContainer sx={{ boxShadow: 0 }}>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow sx={{ "& th": { p: 0.5 } }}>
            <TableCell 
              sx={{ bgcolor: "background.paper" }}
            />
            <TableCell
              align="center"
              colSpan={2}
              sx={{ bgcolor: "background.columnGroup", color: "#353838", position: "relative" }}
              style={{color: "#2E3131"}}
            >
              Consumo médio (kWh)
            </TableCell>
            <TableCell
              align="center"
              colSpan={2}
              sx={{ bgcolor: "background.columnGroup" }}
              style={{color: "#2E3131"}}
            >
              Demanda medida (kW)
            </TableCell>
          </TableRow>

          <TableRow sx={{ th: { color: "white" }, bgcolor: "primary.main" }}>
            <TableCell>Mês</TableCell>
            <TableCell align="right">Ponta</TableCell>
            <TableCell align="right">Fora Ponta</TableCell>
            <TableCell align="right">Ponta</TableCell>
            <TableCell align="right">Fora Ponta</TableCell>
          </TableRow>
        </TableHead>

        <TableBody
          sx={{
            "tr:nth-of-type(even)": { bgcolor: "background.default" },
          }}
        >
          {consumptionHistory.map((row) => (
            <TableRow key={row.date}>
              <TableCell>{monthYear(row.date)}</TableCell>
              <TableCell align="right">
                {formatNumber(row.peakConsumptionInKwh, "Indisponível")}
              </TableCell>
              <TableCell align="right">
                {formatNumber(row.offPeakConsumptionInKwh, "Indisponível")}
              </TableCell>
              <TableCell align="right">
                {formatNumber(row.peakMeasuredDemandInKw, "Indisponível")}
              </TableCell>
              <TableCell align="right">
                {formatNumber(row.offPeakMeasuredDemandInKw, "Indisponível")}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
