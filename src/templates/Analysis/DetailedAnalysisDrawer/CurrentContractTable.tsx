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
import { GetContractsResponsePayload } from "@/types/contract";
import { getFormattedDateUTC, sendFormattedDate } from "@/utils/date";
import { useSelector } from "react-redux";
import { useGetConsumerUnitQuery } from "@/api";
import { skipToken } from "@reduxjs/toolkit/query";
import { selectActiveConsumerUnitId } from "@/store/appSlice";

interface Props {
  recommendationCurrentContract: RecommendationContract;
  actualContract: GetContractsResponsePayload | undefined;
}

export const CurrentContractTable = ({
  recommendationCurrentContract: currentContract,
  actualContract,
}: Props) => {
  const consumerUnitId = useSelector(selectActiveConsumerUnitId);
  const { data: consumerUnit } = useGetConsumerUnitQuery(
    consumerUnitId || skipToken
  );

  const getValidityOfTheContract: () => string | null = () => {
    if (actualContract?.startDate) {
      const startDate = getFormattedDateUTC(actualContract?.startDate);
      const endDate = new Date(startDate!);

      endDate.setFullYear(startDate!.getFullYear() + 1);

      return sendFormattedDate(endDate, "dd/MM/yyyy");
    }

    return null;
  };

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

  ];

  const greenRows = [
    {
      label: "Demanda contratada - carga",
      value: currentContract.peakDemandInKw + " kW",
    },
    {
      label: "Validade do contrato",
      value: actualContract?.startDate ? getValidityOfTheContract() : null,
    },
    {
      label: "Sistema de Geração - Potência instalada",
      value: consumerUnit?.totalInstalledPower ? consumerUnit.totalInstalledPower + " kW" : null,
    },
    {
      label: "Sistema de Geração - Demanda de geração contratada",
      value: consumerUnit?.totalInstalledPower ? consumerUnit.totalInstalledPower + " kW" : null,
    },
  ];

  const blueRows = [
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
      value: actualContract?.startDate ? getValidityOfTheContract() : null,
    },
    {
      label: "Sistema de Geração - Potência instalada",
      value: consumerUnit?.totalInstalledPower ? consumerUnit.totalInstalledPower + " kW" : null,
    },
    {
      label: "Sistema de Geração - Demanda de geração contratada",
      value: consumerUnit?.totalInstalledPower ? consumerUnit.totalInstalledPower + " kW" : null,
    },
  ];

  const getRows = () => {
    if (currentContract.tariffFlag == 'B') {
      return [
        ...rows,
        ...blueRows,
      ];
    } else {
      return [
        ...rows,
        ...greenRows,
      ];
    }
  };

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
              {getRows().map((row) => {
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
