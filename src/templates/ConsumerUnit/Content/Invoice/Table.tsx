import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { skipToken } from "@reduxjs/toolkit/dist/query";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import ConfirmWarning from "@/components/ConfirmWarning/ConfirmWarning";
import { GetApp } from "@mui/icons-material";
import { formatToPtBrCurrency } from "@/utils/number";

import { Box, Button, Grid, IconButton, styled } from "@mui/material";
import {
  DataGrid,
  GridColDef,
  GridColumnGroupingModel,
  GridInitialState,
} from "@mui/x-data-grid";
import {
  CancelRounded,
  CheckCircleOutlineRounded,
  InsightsRounded,
  WarningRounded,
  Edit,
  Delete,
} from "@mui/icons-material";

import { useFetchInvoicesQuery, useDeleteEnergiBillMutation } from "@/api";
import {
  selectActiveConsumerUnitId,
  selectConsumerUnitInvoiceActiveFilter,
  selectConsumerUnitInvoiceDataGridRows,
  setConsumerUnitInvoiceDataGridRows,
  setEnergyBillEdiFormParams,
  setIsEnergyBillCreateFormOpen,
  setIsEnergyBillEdiFormOpen,
} from "@/store/appSlice";
import { ConsumerUnitInvoiceFilter } from "@/types/app";
import {
  EnergyBill,
  InvoiceDataGridRow,
  InvoicePayload,
  InvoicesPayload,
} from "@/types/consumerUnit";

const getMonthFromNumber = (
  month: number,
  year: number,
  shouldCapitalize?: boolean
) => {
  const date = new Date(year, month, 1);
  const monthFullName = format(date, "MMMM", { locale: ptBR });

  if (!shouldCapitalize) {
    return monthFullName;
  }

  return monthFullName.charAt(0).toUpperCase() + monthFullName.slice(1);
};

const initialState: GridInitialState = {
  sorting: { sortModel: [{ field: "month", sort: "asc" }] },
};

const getFilteredInvoices = (
  invoicesPayload: InvoicesPayload,
  activeFilter: ConsumerUnitInvoiceFilter
) => {
  if (activeFilter === "pending") {
    return Object.values(invoicesPayload)
      .flat()
      .filter(({ isEnergyBillPending }) => isEnergyBillPending);
  }

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  return invoicesPayload[activeFilter].filter(
    (invoice) => invoice.month <= currentMonth || invoice.year < currentYear
  );
};

const formatConsumptionDemandToPtBrCurrency = (energyBill: EnergyBill) => {
  return {
    invoiceInReais:
      typeof energyBill.invoiceInReais == "number"
        ? formatToPtBrCurrency(energyBill.invoiceInReais, 2)
        : "-",
    offPeakConsumptionInKwh: formatToPtBrCurrency(
      energyBill.offPeakConsumptionInKwh
    ),
    peakConsumptionInKwh: formatToPtBrCurrency(energyBill.peakConsumptionInKwh),
    offPeakMeasuredDemandInKw: formatToPtBrCurrency(
      energyBill.offPeakMeasuredDemandInKw
    ),
    peakMeasuredDemandInKw: formatToPtBrCurrency(
      energyBill.peakMeasuredDemandInKw
    ),
  };
};

const getDataGridRows = (
  invoicesPayload: InvoicePayload[],
  activeFilter: ConsumerUnitInvoiceFilter
): InvoiceDataGridRow[] => {
  return invoicesPayload.map(
    ({ month, year, isEnergyBillPending, energyBill }) => ({
      ...energyBill,
      id: parseInt(`${year}${month >= 10 ? month : "0" + month}`),
      ...(energyBill && {
        energyBillId: energyBill.id,
        ...formatConsumptionDemandToPtBrCurrency(energyBill),
      }),
      month,
      year,
      isEnergyBillPending,
      activeFilter,
    })
  );
};

const NoRowsOverlay = () => (
  <Box display="flex" justifyContent="center" pt={3}>
    Não há faturas para o filtro selecionado
  </Box>
);

const ConsumerUnitInvoiceContentTable = () => {
  const dispatch = useDispatch();
  const consumerUnitId = useSelector(selectActiveConsumerUnitId);
  const [deleteEnergiBill] = useDeleteEnergiBillMutation();
  const [isWarningOpen, setIsWarningOpen] = useState(false);
  const [selectedBillenergyId, setSelectedEnergyBillId] = useState<number>(0);

  const { data: invoicesPayload } = useFetchInvoicesQuery(
    consumerUnitId ?? skipToken,
    {
      refetchOnMountOrArgChange: true,
    }
  );

  const activeFilter = useSelector(selectConsumerUnitInvoiceActiveFilter);
  const dataGridRows = useSelector(selectConsumerUnitInvoiceDataGridRows);

  const handleEditInvoiceFormOpen = (params: {
    month: number;
    year: number;
    id: number;
  }) => {
    const { month, year, id } = params;
    dispatch(setIsEnergyBillEdiFormOpen(true));
    dispatch(setEnergyBillEdiFormParams({ month, year, id }));
  };

  const handleDeleteInvoice = async () => {
    try {
      await deleteEnergiBill(selectedBillenergyId);
    } catch (error) {
      console.error("Failed to delete invoice:", error);
    }
  };

  const confirmWarning = () => {
    setIsWarningOpen(false);
    handleDeleteInvoice();
  };

  const cancelWarning = () => {
    setIsWarningOpen(false);
  };

  const handleDownloadPDF = (energyBillId: number) => {
    const pdfUrl = `/media/energy_bills/`;

    // Criando um novo link para realizar o download do arquivo PDF
    const link = document.createElement("a");
    link.href = pdfUrl;
    link.download = `${energyBillId}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const columns: GridColDef<InvoiceDataGridRow>[] = [
    {
      field: "month",
      headerName: "Mês",
      headerAlign: "center",
      align: "left",
      flex: 2,
      valueGetter: ({ row: { id } }) => id,
      renderCell: ({ row }) => renderMonthCell(row),
      colSpan: ({ row: { isEnergyBillPending } }) => {
        if (isEnergyBillPending) {
          return columns.length;
        }
      },
    },
    {
      field: "isAtypical",
      headerAlign: "center",
      align: "center",
      flex: 0,
      renderHeader: () => <InsightsRounded />,
      renderCell: ({ row: { isAtypical, energyBillId } }) => {
        if (energyBillId === undefined) {
          return "";
        }

        if (isAtypical) {
          return <CancelRounded />;
        }

        return <CheckCircleOutlineRounded />;
      },
    },
    {
      field: "peakConsumptionInKwh",
      headerClassName: "MuiDataGrid-columnHeaderMain",
      headerName: "Ponta",
      headerAlign: "right",
      align: "right",
      flex: 1,
    },
    {
      field: "offPeakConsumptionInKwh",
      headerClassName: "MuiDataGrid-columnHeaderMain",
      headerName: "Fora Ponta",
      headerAlign: "right",
      align: "right",
      flex: 1,
    },
    {
      field: "peakMeasuredDemandInKw",
      headerClassName: "MuiDataGrid-columnHeaderMain",
      headerName: "Ponta",
      headerAlign: "right",
      align: "right",
      flex: 1,
    },
    {
      field: "offPeakMeasuredDemandInKw",
      headerClassName: "MuiDataGrid-columnHeaderMain",
      headerName: "Fora Ponta",
      headerAlign: "right",
      align: "right",
      flex: 1,
    },
    {
      field: "invoiceInReais",
      headerClassName: "MuiDataGrid-columnHeaderMain",
      headerName: "Valor (R$)",
      headerAlign: "right",
      align: "right",
      flex: 1,
    },
    {
      field: "id",
      headerClassName: "MuiDataGrid-columnHeaderMain",
      headerName: "Ações",
      headerAlign: "center",
      align: "center",
      flex: 1,
      sortable: false,
      renderCell: ({ row: { month, year, energyBillId } }) => {
        if (!energyBillId) {
          return <></>;
        }

        return (
          <>
            <IconButton
              onClick={() => {
                handleEditInvoiceFormOpen({ month, year, id: energyBillId });
              }}
            >
              <Edit />
            </IconButton>
            <IconButton
              onClick={() => {
                setSelectedEnergyBillId(energyBillId);
                setIsWarningOpen(true);
              }}
            >
              <Delete />
            </IconButton>
          </>
        );
      },
    },
    {
      field: "download",
      headerClassName: "MuiDataGrid-columnHeaderMain",
      headerName: "Download",
      headerAlign: "center",
      align: "center",
      flex: 1.4,
      sortable: false,
      renderCell: ({ row: { energyBillId } }) => {
        if (!energyBillId) {
          return <></>;
        }

        return (
          <IconButton
            onClick={() => {
              handleDownloadPDF(energyBillId);
            }}
          >
            <GetApp />{" "}
            {/* Este é um ícone de download do Material Icons. Se não for adequado, você pode substituí-lo por outro ícone de sua preferência. */}
          </IconButton>
        );
      },
    },
  ];

  const columnGroupingModel: GridColumnGroupingModel = [
    {
      groupId: "consumption",
      headerName: "Consumo (kWh)",
      headerAlign: "center",
      children: [
        { field: "peakConsumptionInKwh" },
        { field: "offPeakConsumptionInKwh" },
      ],
    },
    {
      groupId: "demand",
      headerName: "Demanda (kW)",
      headerAlign: "center",
      children: [
        { field: "peakMeasuredDemandInKw" },
        { field: "offPeakMeasuredDemandInKw" },
      ],
    },
  ];

  useEffect(() => {
    if (!invoicesPayload) {
      return;
    }

    const filteredInvoices = getFilteredInvoices(invoicesPayload, activeFilter);
    const dataGridRows = getDataGridRows(filteredInvoices, activeFilter);

    dispatch(setConsumerUnitInvoiceDataGridRows(dataGridRows));
  }, [activeFilter, invoicesPayload, dispatch]);

  const handleOpenAddEnergyBillForm = useCallback(
    (month: number, year: number) => {
      dispatch(setIsEnergyBillCreateFormOpen(true));
      dispatch(setEnergyBillEdiFormParams({ month, year }));
    },
    [dispatch]
  );

  const renderMonthCell = useCallback(
    (invoiceRow: InvoiceDataGridRow) => {
      const { activeFilter, isEnergyBillPending, month, year, energyBillId } =
        invoiceRow;

      const buttonLabel =
        "Lançar " +
        getMonthFromNumber(month, year) +
        `${activeFilter === "pending" ? " — " + year : ""}`;

      if (isEnergyBillPending) {
        return (
          <Button
            variant="contained"
            color="secondary"
            onClick={() => handleOpenAddEnergyBillForm(month, year)}
            startIcon={<WarningRounded />}
          >
            {buttonLabel}
          </Button>
        );
      }

      if (!energyBillId) {
        return (
          <Button
            variant="contained"
            onClick={() => handleOpenAddEnergyBillForm(month, year)}
          >
            {buttonLabel}
          </Button>
        );
      }

      return getMonthFromNumber(month, year, true);
    },
    [handleOpenAddEnergyBillForm]
  );

  /**
   * Fonte: https://github.com/mui/mui-x/issues/5189
   * @description fixa o menu da tabela
   */
  const FixedMenuDataGrid = styled(DataGrid)(() => ({
    "& .MuiDataGrid-main": {
      // remove overflow hidden overwise sticky does not work
      overflow: "unset",
    },
    "& .MuiDataGrid-columnHeaders": {
      position: "sticky",
      backgroundColor: "#EEF4F4",
      zIndex: 1,
      top: 70,
    },
    "& .MuiDataGrid-virtualScroller": {
      // remove the space left for the header
      marginTop: "0!important",
    },
  }));

  return (
    <>
      <Grid container justifyContent="flex-end"></Grid>
      <FixedMenuDataGrid
        experimentalFeatures={{ columnGrouping: true }}
        columnGroupingModel={columnGroupingModel}
        columns={columns}
        rows={dataGridRows}
        initialState={initialState}
        components={{ NoRowsOverlay }}
        autoHeight
        hideFooter
        disableColumnMenu
      />
      <ConfirmWarning
        open={isWarningOpen}
        onConfirm={confirmWarning}
        onCancel={cancelWarning}
      />
    </>
  );
};

export default ConsumerUnitInvoiceContentTable;
