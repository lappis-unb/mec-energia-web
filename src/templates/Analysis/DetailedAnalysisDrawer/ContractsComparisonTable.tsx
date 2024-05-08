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

export const ContractsComparisonTable = ({ rows, totals }: Props) => (
  <TableContainer sx={{ boxShadow: 0 }}>
    <Table>
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
            Contrato atual (R$)
          </TableCell>
          <TableCell
            align="center"
            colSpan={2}
            sx={{ bgcolor: "background.columnGroup" }}
            style={{color: "#2E3131"}}
          >
            Contrato proposto (R$)
          </TableCell>
        </TableRow>
        <TableRow sx={{ th: { color: "white" }, bgcolor: "primary.main" }}>
          <TableCell>Mês</TableCell>
          <TableCell align="right">Consumo</TableCell>
          <TableCell align="right">Demanda</TableCell>
          <TableCell align="right">Consumo</TableCell>
          <TableCell align="right">Demanda</TableCell>
        </TableRow>
      </TableHead>

      <TableBody
        sx={{
          "tr:nth-of-type(even)": { bgcolor: "background.default" },
        }}
      >
        {rows.map((r) => (
          <TableRow key={r.date}>
            <TableCell> {monthYear(r.date)} </TableCell>
            <TableCell align="right">
              {formatNumber(r.consumptionCostInReaisInCurrent, "Indisponível")}
            </TableCell>
            <TableCell align="right">
              {formatNumber(r.demandCostInReaisInCurrent, "Indisponível")}
            </TableCell>
            <TableCell align="right">
              {formatNumber(
                r.consumptionCostInReaisInRecommended,
                "Indisponível"
              )}
            </TableCell>
            <TableCell align="right">
              {formatNumber(r.demandCostInReaisInRecommended, "Indisponível")}
            </TableCell>
          </TableRow>
        ))}

        <TableRow sx={{ "th,td": { color: "white" }, bgcolor: "primary.main" }}>
          <TableCell align="center">Total</TableCell>
          <TableCell align="right">
            {formatNumber(totals.consumptionCostInReaisInCurrent)}
          </TableCell>
          <TableCell align="right">
            {formatNumber(totals.demandCostInReaisInCurrent)}
          </TableCell>
          <TableCell align="right">
            {formatNumber(totals.consumptionCostInReaisInRecommended)}
          </TableCell>
          <TableCell align="right">
            {formatNumber(totals.demandCostInReaisInRecommended)}
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </TableContainer>
);
