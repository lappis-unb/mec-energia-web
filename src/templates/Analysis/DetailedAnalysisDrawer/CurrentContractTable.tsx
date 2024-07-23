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
import { Subtitle } from "./Subtitle";
import { GetContractsResponsePayload } from "@/types/contract";
import { sendFormattedDate } from "@/utils/date";

interface Props {
  recommendationCurrentContract: RecommendationContract;
  actualContract: GetContractsResponsePayload | undefined;
}

export const CurrentContractTable = ({
  recommendationCurrentContract: currentContract,
  actualContract,
}: Props) => {
  const rows = [
    { label: "Identificação da Instituição", value: currentContract.university },
    { label: "Identificação da Distribuidora", value: currentContract.distributor },
    { label: "Número da unidade consumidora", value: currentContract.consumerUnitCode },
    {
      label: "Tensão de fornecimento",
      value: currentContract.supplyVoltage + " kV",
    },
    {
      label: "Modalidade tarifária",
      value: currentContract.tariffFlag === "B" ? "Azul" : "Verde",
    },
    { label: "Subgrupo", value: currentContract.subgroup },
    {
      label: "Demanda contratada no horário de ponta - carga",
      value: currentContract.peakDemandInKw + " kW",
    },
    {
      label: "Demanda contratada no horário fora de ponta - carga",
      value: currentContract.offPeakDemandInKw + " kW",
    },
    {
      label: "Validade do contrato",
      value: actualContract?.endDate ? sendFormattedDate(actualContract.endDate) : null,
    },
    {
      label: "Sistema de Geração - Potência instalada",
      value: currentContract.offPeakDemandInKw + " kW",
    },
    {
      label: "Sistema de Geração - Demanda de geração contratada",
      value: currentContract.offPeakDemandInKw + " kW",
    },
  ];

  return (
    <>
      <Box>
        <Subtitle
          id="Tabela 1"
          title="Informações características de fornecimento da unidade consumidora"
        />
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
              {rows.map((row) => {
                return row.value && (
                  <TableRow
                    key={row.label}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell>{row.label}</TableCell>
                    <TableCell align="left">{row.value}</TableCell>
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
