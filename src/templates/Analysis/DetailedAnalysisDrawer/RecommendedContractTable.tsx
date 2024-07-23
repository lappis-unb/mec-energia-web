import StripedDataGrid from "@/components/StripedDataGrid";
import { RecommendationContract } from "@/types/recommendation";
import { tariffFlags } from "@/utils/tariff";
import {
  Box,
  TableContainer,
} from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";

interface Props {
  recommendedContract: RecommendationContract;
  currentContract: RecommendationContract;
}

interface CurrentVsRecommendedRow {
  label: string;
  current: string | number | null;
  recommended: string | number | null;
  different: boolean;
}

interface InfoRows extends CurrentVsRecommendedRow {
  value?: string;
}

export const RecommendedContractTable = ({
  recommendedContract,
  currentContract,
}: Props) => {
  const areTariffFlagsBothG =
    recommendedContract.tariffFlag === "G" && currentContract.tariffFlag === "G";

  const fixedRows = [
    { label: "Distribuidora", value: recommendedContract.distributor },
    { label: "Instiuição", value: recommendedContract.university },
    { label: "Unidade Consumidora", value: recommendedContract.consumerUnit },
    { label: "UC código", value: recommendedContract.consumerUnitCode },
    {
      label: "Tensão primária de distribuição",
      value: recommendedContract.supplyVoltage + " kV",
    },
    { label: "Subgrupo", value: recommendedContract.subgroup },
  ];

  const rows: CurrentVsRecommendedRow[] = areTariffFlagsBothG
    ? [
      {
        label: "Modalidade tarifária",
        current: tariffFlags[currentContract.tariffFlag],
        recommended: tariffFlags[recommendedContract.tariffFlag],
        different: false, // Both are "G" so there's no difference
      },
      {
        label: "Demanda contratada atual",
        current: currentContract.peakDemandInKw + " kW",
        recommended: recommendedContract.peakDemandInKw + " kW",
        different:
          currentContract.peakDemandInKw !== recommendedContract.peakDemandInKw,
      },
    ]
    : [
      {
        label: "Modalidade tarifária",
        current: tariffFlags[currentContract.tariffFlag],
        recommended: tariffFlags[recommendedContract.tariffFlag],
        different: currentContract.tariffFlag !== recommendedContract.tariffFlag,
      },
      {
        label: "Demanda contratada atual de ponta",
        current: currentContract.peakDemandInKw + " kW",
        recommended: recommendedContract.peakDemandInKw + " kW",
        different:
          currentContract.peakDemandInKw !== recommendedContract.peakDemandInKw,
      },
      {
        label: "Demanda contratada atual fora de ponta",
        current: currentContract.offPeakDemandInKw + " kW",
        recommended: recommendedContract.offPeakDemandInKw + " kW",
        different:
          currentContract.offPeakDemandInKw !==
          recommendedContract.offPeakDemandInKw,
      },
    ];

  const columns: GridColDef<InfoRows>[] = [
    {
      field: "label",
      headerName: "",
      headerAlign: "left",
      align: "left",
      flex: 2,
      sortable: false,
    },
    {
      field: "current",
      headerClassName: "MuiDataGrid-columnHeaderMain",
      headerName: "Contrato atual",
      headerAlign: "center",
      align: "center",
      flex: 1,
      sortable: false,
      colSpan: ({ row }) => (row?.value ? 2 : 1),
      renderCell: ({ row }) => {
        return row?.value ? (
          <span style={{ textAlign: "center" }}>
            {row.value}
          </span>
        ) : (
          <span style={{ textDecoration: row.different ? "line-through" : "" }}>
            {row.current}
          </span>
        )
      }
    },
    {
      field: "recommended",
      headerClassName: "MuiDataGrid-columnHeaderMain",
      headerName: "Contrato recomendado",
      headerAlign: "center",
      align: "center",
      flex: 1,
      sortable: false,
      renderCell: ({ row }) => (
        <span style={{ fontWeight: "bold" }}>
          {row.recommended}
        </span>
      )
    },
  ];

  const getDataGridRows = (
    currentVsRecommendedRow: CurrentVsRecommendedRow[]
  ): InfoRows[] => {
    const newRows: InfoRows[] = [
      ...fixedRows,
      ...currentVsRecommendedRow,
    ];

    return newRows.map(
      (row, index) => {
        return {
          ...row,
          id: index,
        };
      }
    );
  };

  return (
    <>
      <Box>
        <TableContainer sx={{ boxShadow: 0 }}>
          <StripedDataGrid
            columns={columns}
            rows={getDataGridRows(rows)}
          />
        </TableContainer>
      </Box>
    </>
  );
};
