import StripedDataGrid from "@/components/StripedDataGrid";
import { ConsumptionHistoryTableRow } from "@/types/recommendation";
import { monthYear } from "@/utils/date";
import { formatNumber } from "@/utils/number";
import { GridColDef, GridColumnGroupingModel } from "@mui/x-data-grid";

interface Props {
  consumptionHistory: ConsumptionHistoryTableRow[];
}

export const ConsumptionHistoryTable = ({ consumptionHistory }: Props) => {

  const columns: GridColDef<ConsumptionHistoryTableRow>[] = [
    {
      field: "date",
      headerName: "Mês",
      headerAlign: "left",
      align: "left",
      flex: 2,
      sortable: false
    },
    {
      field: "peakConsumptionInKwh",
      headerClassName: "MuiDataGrid-columnHeaderMain",
      headerName: "Ponta",
      headerAlign: "right",
      align: "right",
      flex: 1,
      sortable: false
    },
    {
      field: "offPeakConsumptionInKwh",
      headerClassName: "MuiDataGrid-columnHeaderMain",
      headerName: "Fora Ponta",
      headerAlign: "right",
      align: "right",
      flex: 1,
      sortable: false
    },
    {
      field: "peakMeasuredDemandInKw",
      headerClassName: "MuiDataGrid-columnHeaderMain",
      headerName: "Ponta",
      headerAlign: "right",
      align: "right",
      flex: 1,
      sortable: false
    },
    {
      field: "offPeakMeasuredDemandInKw",
      headerClassName: "MuiDataGrid-columnHeaderMain",
      headerName: "Fora Ponta",
      headerAlign: "right",
      align: "right",
      flex: 1,
      sortable: false
    },
  ];

  const columnGroupingModel: GridColumnGroupingModel = [
    {
      groupId: "consumption",
      headerName: "Consumo médio (kWh)",
      headerAlign: "center",
      children: [
        { field: "peakConsumptionInKwh" },
        { field: "offPeakConsumptionInKwh" },
      ],
    },
    {
      groupId: "demand",
      headerName: "Demanda medida (kW)",
      headerAlign: "center",
      children: [
        { field: "peakMeasuredDemandInKw" },
        { field: "offPeakMeasuredDemandInKw" },
      ],
    },
  ];

  const getDataGridRows = (
    consumptionHistoryTableRow: ConsumptionHistoryTableRow[]
  ): ConsumptionHistoryTableRow[] => {
    return consumptionHistoryTableRow.map(
      (row, index) => ({
        id: index,
        date: monthYear(row.date),
        peakConsumptionInKwh: formatNumber(row.peakConsumptionInKwh, "Indisponível"),
        offPeakConsumptionInKwh: formatNumber(row.offPeakConsumptionInKwh, "Indisponível"),
        peakMeasuredDemandInKw: formatNumber(row.peakMeasuredDemandInKw, "Indisponível"),
        offPeakMeasuredDemandInKw: formatNumber(row.offPeakMeasuredDemandInKw, "Indisponível"),
      })
    );
  };

  return (
    <StripedDataGrid 
      experimentalFeatures={{ columnGrouping: true }}
      columnGroupingModel={columnGroupingModel}
      columns={columns}
      rows={getDataGridRows(consumptionHistory)}
    />
  );
};
