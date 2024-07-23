import { RecommendationContract } from "@/types/recommendation";
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
  recommendationCurrentContract: RecommendationContract;
}

export const CurrentContractTable = ({
  recommendationCurrentContract: currentContract,
}: Props) => {
  const rows = [
    { label: "Distribuidora", value: currentContract.distributor },
    { label: "Instiuição", value: currentContract.university },
    { label: "Unidade Consumidora", value: currentContract.consumerUnit },
    { label: "UC código", value: currentContract.consumerUnitCode },
    {
      label: "Tensão primária de distribuição",
      value: currentContract.supplyVoltage + " kV",
    },
    { label: "Subgrupo", value: currentContract.subgroup },
    {
      label: "Modalidade tarifária",
      value: currentContract.tariffFlag === "B" ? "Azul" : "Verde",
    },
    {
      label: "Demanda contratada atual de ponta",
      value: currentContract.peakDemandInKw + " kW",
    },
    {
      label: "Demanda contratada atual fora de ponta",
      value: currentContract.offPeakDemandInKw + " kW",
    },
  ];

  return (
    <>
      <Box>
        <TableContainer component={Paper} sx={{ boxShadow: 0 }}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead
              sx={{ bgcolor: "primary.main", display: "table-header-group" }}
            >
              <TableRow sx={{ th: { color: "white" } }}>
                <TableCell colSpan={2} align="center">
                  Contrato atual
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody
              sx={{
                "tr:nth-of-type(even)": { bgcolor: "background.default" },
              }}
            >
              {rows.map((row) => (
                <TableRow
                  key={row.label}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell>{row.label}</TableCell>
                  <TableCell align="left">{row.value}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </>
  );
};
