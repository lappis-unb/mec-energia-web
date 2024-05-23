import StripedDataGrid from "@/components/StripedDataGrid";
import {
  ContractComparisonTableRow,
  ContractsComparisonTotals,
} from "@/types/recommendation";
import { monthYear } from "@/utils/date";
import { formatNumber } from "@/utils/number";
import {
  TableContainer,
} from "@mui/material";
import { GridColDef, GridColumnGroupingModel } from "@mui/x-data-grid";

interface Props {
  rows: ContractComparisonTableRow[];
  totals: ContractsComparisonTotals;
}

export const ContractsComparisonTable = ({ rows, totals }: Props) => {

  const columnGroupingModel: GridColumnGroupingModel = [
    {
      groupId: "actualContract",
      headerName: "Contrato atual (R$)",
      headerAlign: "center",
      children: [
        { field: "consumptionCostInReaisInCurrent" },
        { field: "demandCostInReaisInCurrent" },
      ],
    },
    {
      groupId: "proposedContract",
      headerName: "Contrato proposto (R$)",
      headerAlign: "center",
      children: [
        { field: "consumptionCostInReaisInRecommended" },
        { field: "demandCostInReaisInRecommended" },
      ],
    },
  ];

  const columns: GridColDef<ContractComparisonTableRow>[] = [
    {
      field: "date",
      headerName: "Mês",
      headerAlign: "left",
      align: "left",
      flex: 2,
      sortable: false
    },
    {
      field: "consumptionCostInReaisInCurrent",
      headerClassName: "MuiDataGrid-columnHeaderMain",
      headerName: "Consumo",
      headerAlign: "right",
      align: "right",
      flex: 1,
      sortable: false
    },
    {
      field: "demandCostInReaisInCurrent",
      headerClassName: "MuiDataGrid-columnHeaderMain",
      headerName: "Demanda",
      headerAlign: "right",
      align: "right",
      flex: 1,
      sortable: false
    },
    {
      field: "consumptionCostInReaisInRecommended",
      headerClassName: "MuiDataGrid-columnHeaderMain",
      headerName: "Consumo",
      headerAlign: "right",
      align: "right",
      flex: 1,
      sortable: false
    },
    {
      field: "demandCostInReaisInRecommended",
      headerClassName: "MuiDataGrid-columnHeaderMain",
      headerName: "Demanda",
      headerAlign: "right",
      align: "right",
      flex: 1,
      sortable: false
    },
  ];

  const getDataGridRows = (
    contractComparisonTableRow: ContractComparisonTableRow[]
  ): ContractComparisonTableRow[] => {
    const rowsWithTotal: ContractComparisonTableRow[] = [...contractComparisonTableRow, {
      date: "Total",
      totalCostInReaisInCurrent: 0,
      totalCostInReaisInRecommended: 0,
      absoluteDifference: 0,
      consumptionCostInReaisInCurrent: 0,
      consumptionCostInReaisInRecommended: 0,
      demandCostInReaisInCurrent: 0,
      demandCostInReaisInRecommended: 0
    }];

    return rowsWithTotal.map(
      (row, index) => {
        // Ultima linha deve ter os dados de total
        if (index == rowsWithTotal.length - 1) {
          return {
            ...contractComparisonTableRow,
            id: index,
            date: "Total",
            consumptionCostInReaisInCurrent: formatNumber(totals.consumptionCostInReaisInCurrent),
            demandCostInReaisInCurrent: formatNumber(totals.demandCostInReaisInCurrent),
            consumptionCostInReaisInRecommended: formatNumber(totals.consumptionCostInReaisInRecommended),
            demandCostInReaisInRecommended: formatNumber(totals.demandCostInReaisInRecommended),
          };
        };

        return {
          ...contractComparisonTableRow,
          id: index,
          date: monthYear(row.date),
          consumptionCostInReaisInCurrent: formatNumber(row.consumptionCostInReaisInCurrent, "Indisponível"),
          demandCostInReaisInCurrent: formatNumber(row.demandCostInReaisInCurrent, "Indisponível"),
          consumptionCostInReaisInRecommended: formatNumber(row.consumptionCostInReaisInRecommended, "Indisponível"),
          demandCostInReaisInRecommended: formatNumber(row.demandCostInReaisInRecommended, "Indisponível"),
        };
      }
    );
  };

  return (
    <TableContainer sx={{ boxShadow: 0 }}>
      <StripedDataGrid
        experimentalFeatures={{ columnGrouping: true }}
        columnGroupingModel={columnGroupingModel} 
        columns={columns}
        rows={getDataGridRows(rows)}
      />
    </TableContainer>
  )
};
