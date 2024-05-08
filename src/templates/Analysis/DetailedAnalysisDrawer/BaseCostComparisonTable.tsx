import {
  ContractComparisonTableRow,
  ContractsComparisonTotals,
} from "@/types/recommendation";
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
  rows: ContractComparisonTableRow[];
  totals: ContractsComparisonTotals;
}

export const BaseCostComparisonTable = ({ rows, totals }: Props) => (
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
            sx={{ bgcolor: "background.columnGroup", position: "relative" }}
            style={{color: "#2E3131"}}
          >
            Custo-base (R$)
          </TableCell>
          <TableCell 
            sx={{ bgcolor: "background.paper" }}
          />
        </TableRow>

        <TableRow sx={{ th: { color: "white" }, bgcolor: "primary.main" }}>
          <TableCell>Mês</TableCell>
          <TableCell align="right">Atual</TableCell>
          <TableCell align="right">Proposto</TableCell>
          <TableCell align="right">Diferença (R$)</TableCell>
        </TableRow>
      </TableHead>

      <TableBody
        sx={{
          "tr:nth-of-type(even)": { bgcolor: "background.default" },
        }}
      >
        {rows.map((row) => (
          <TableRow key={row.date}>
            <TableCell>{monthYear(row.date)}</TableCell>
            <TableCell align="right">
              {formatNumber(row.totalCostInReaisInCurrent, "Indisponível")}
            </TableCell>
            <TableCell align="right">
              {formatNumber(row.totalCostInReaisInRecommended, "Indisponível")}
            </TableCell>
            <TableCell align="right">
              {formatNumber(row.absoluteDifference, "Indisponível")}
            </TableCell>
          </TableRow>
        ))}

        <TableRow sx={{ "th,td": { color: "white" }, bgcolor: "primary.main" }}>
          <TableCell align="center">Total</TableCell>
          <TableCell align="right">
            {formatNumber(totals.totalCostInReaisInCurrent)}
          </TableCell>
          <TableCell align="right">
            {formatNumber(totals.totalCostInReaisInRecommended)}
          </TableCell>
          <TableCell align="right">
            {formatNumber(totals.absoluteDifference)}
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </TableContainer>
);
