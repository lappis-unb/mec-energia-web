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

export const BaseCostComparisonTable = ({ rows, totals }: Props) => {

  const columnGroupingModel: GridColumnGroupingModel = [
    {
      groupId: "actualContract",
      headerName: "Custo-base (R$)",
      headerAlign: "center",
      children: [
        { field: "totalCostInReaisInCurrent" },
        { field: "totalCostInReaisInRecommended" },
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
      field: "totalCostInReaisInCurrent",
      headerClassName: "MuiDataGrid-columnHeaderMain",
      headerName: "Atual",
      headerAlign: "right",
      align: "right",
      flex: 1,
      sortable: false
    },
    {
      field: "totalCostInReaisInRecommended",
      headerClassName: "MuiDataGrid-columnHeaderMain",
      headerName: "Proposto",
      headerAlign: "right",
      align: "right",
      flex: 1,
      sortable: false
    },
    {
      field: "absoluteDifference",
      headerClassName: "MuiDataGrid-columnHeaderMain",
      headerName: "Diferença (R$)",
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
            totalCostInReaisInCurrent: formatNumber(totals.totalCostInReaisInCurrent),
            totalCostInReaisInRecommended: formatNumber(totals.totalCostInReaisInRecommended),
            absoluteDifference: formatNumber(totals.absoluteDifference),
          };
        };

        return {
          ...contractComparisonTableRow,
          id: index,
          date: monthYear(row.date),
          totalCostInReaisInCurrent: formatNumber(row.totalCostInReaisInCurrent, "Indisponível"),
          totalCostInReaisInRecommended: formatNumber(row.totalCostInReaisInRecommended, "Indisponível"),
          absoluteDifference: formatNumber(row.absoluteDifference, "Indisponível"),
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
  );
};
