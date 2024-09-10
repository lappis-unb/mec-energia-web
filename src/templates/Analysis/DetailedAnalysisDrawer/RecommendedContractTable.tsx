import { RecommendationContract } from "@/types/recommendation";
import { tariffFlags } from "@/utils/tariff";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { selectActiveConsumerUnitId } from "@/store/appSlice";
import { useSelector } from "react-redux";
import { skipToken } from "@reduxjs/toolkit/query";
import { useGetConsumerUnitQuery } from "@/api";

interface Props {
  recommendedContract: RecommendationContract;
  currentContract: RecommendationContract;
}

interface InfoRows {
  label: string;
  value?: string;
  recommended?: string;
}

export const RecommendedContractTable = ({
  recommendedContract,
  currentContract,
}: Props) => {
  const consumerUnitId = useSelector(selectActiveConsumerUnitId);
  const { data: consumerUnit } = useGetConsumerUnitQuery(
    consumerUnitId || skipToken
  );

  const fixedRows = [
    { label: "Identificação da Instituição", value: recommendedContract.university },
    { label: "Identificação da Distribuidora", value: recommendedContract.distributor },
    { label: "Número da unidade consumidora", value: recommendedContract.consumerUnitCode },
    { label: "Tensão de fornecimento", value: recommendedContract.supplyVoltage + " kV" },
    { label: "Modalidade tarifária", value: tariffFlags[recommendedContract.tariffFlag] },
    { label: "Subgrupo", value: recommendedContract.subgroup },
  ];

  const greenRows = [
    {
      label: "Demanda contratada - carga",
      recommended: currentContract.peakDemandInKw + " kW",
    },
  ];

  const blueRows = [
    {
      label: "Demanda contratada no horário de ponta - carga",
      recommended: currentContract.peakDemandInKw + " kW",
    },
    {
      label: "Demanda contratada no horário fora de ponta - carga",
      recommended: currentContract.offPeakDemandInKw + " kW",
    },
  ];

  const getDataGridRows = (): InfoRows[] => {
    let rows: InfoRows[] = [
      ...fixedRows
    ];

    if (recommendedContract.tariffFlag === "B") {
      rows = [
        ...rows,
        ...blueRows,
      ];
    } else {
      rows = [
        ...rows,
        ...greenRows
      ];
    }

    if (consumerUnit?.totalInstalledPower && consumerUnit.totalInstalledPower > 0) {
      rows = [
        ...rows,
        {
          label: "Sistema de Geração - Potência instalada",
          recommended: consumerUnit?.totalInstalledPower + " kW",
        },
        {
          label: "Sistema de Geração - Demanda de geração contratada",
          recommended: consumerUnit?.totalInstalledPower + " kW",
        }
      ]
    }

    return rows;
  };

  return (
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
              <TableCell colSpan={2} align="center">
                Contrato proposto
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody
            sx={{
              "tr:nth-of-type(even)": { bgcolor: "background.default" },
            }}
          >
            {getDataGridRows().map((row) => (
              <TableRow
                key={row.label}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell>{row.label}</TableCell>
                <TableCell align="left">
                  {row?.value || row?.recommended}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};
