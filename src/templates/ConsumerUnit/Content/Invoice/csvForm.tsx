import React, { useEffect, useState } from "react";
import {
  AppBar,
  Box,
  Button,
  Container,
  Drawer,
  Grid,
  IconButton,
  Paper,
  Toolbar,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
  Switch,
} from "@mui/material";
import {
  CloseRounded,
  ArrowUpward,
  ArrowDownward,
  ReportRounded,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import {
  selectActiveConsumerUnitId,
  selectIsCsvFormOpen,
  setIsCsvFormOpen,
  setIsErrorNotificationOpen,
  setIsSuccessNotificationOpen,
} from "@/store/appSlice";
import { useTheme } from "@mui/material/styles";
import { skipToken } from "@reduxjs/toolkit/dist/query";

import { useGetContractQuery, usePostMultipleInvoicesMutation } from "@/api";

interface CsvData {
  consumerUnit: { value: string; error: boolean };
  date: {
    value: string;
    errorDoubleDateCsv: boolean;
    errorDoubleDateRegistered: boolean;
    errorDateNotCoveredByContract: boolean;
  };
  invoiceInReais: { value: string; error: boolean };
  peakConsumptionInKwh: { value: string; error: boolean };
  offPeakConsumptionInKwh: { value: string; error: boolean };
  peakMeasuredDemandInKw: { value: string; error: boolean };
  offPeakMeasuredDemandInKw: { value: string; error: boolean };
}

interface CsvFormProps {
  csvData: CsvData[];
}

const CsvForm: React.FC<CsvFormProps> = ({ csvData }) => {
  const dispatch = useDispatch();
  const isCsvFormOpen = useSelector(selectIsCsvFormOpen);
  const theme = useTheme();
  const consumerUnitId = useSelector(selectActiveConsumerUnitId);
  const { data: contractData } = useGetContractQuery(
    consumerUnitId ?? skipToken
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [selectedRows, setSelectedRows] = useState<CsvData[]>([]);
  const [postMultipleInvoice, { isLoading }] =
    usePostMultipleInvoicesMutation();

  const transformSelectedRows = (rows: CsvData[]) => {
    return rows.map((row) => ({
      consumerUnit: row.consumerUnit.value,
      date: row.date.value,
      invoiceInReais: parseFloat(row.invoiceInReais.value),
      peakConsumptionInKwh: parseFloat(row.peakConsumptionInKwh.value),
      offPeakConsumptionInKwh: parseFloat(row.offPeakConsumptionInKwh.value),
      peakMeasuredDemandInKw: parseFloat(row.peakMeasuredDemandInKw.value),
      offPeakMeasuredDemandInKw: parseFloat(
        row.offPeakMeasuredDemandInKw.value
      ),
    }));
  };

  const handleCloseDrawer = () => {
    dispatch(setIsCsvFormOpen(false));
  };

  const handleSort = () => {
    setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
  };

  const handleSwitchChange = (item: CsvData) => {
    setSelectedRows((prevSelectedRows) => {
      if (prevSelectedRows.includes(item)) {
        return prevSelectedRows.filter((row) => row !== item);
      } else {
        return [...prevSelectedRows, item];
      }
    });
  };

  const handleSubmitDrawer = async (event: React.FormEvent) => {
    event.preventDefault();
    console.log("Dados selecionados para envio:", selectedRows);

    const payload = {
      consumerUnit: consumerUnitId?.toString(),
      contract: contractData?.id.toString(),
      energyBills: transformSelectedRows(selectedRows),
    };

    const handleNotification = (isSuccess: boolean) => {
      if (isSuccess) {
        dispatch(
          setIsSuccessNotificationOpen({
            isOpen: true,
            text: "Faturas lançadas com sucesso",
          })
        );
      } else {
        dispatch(
          setIsErrorNotificationOpen({
            isOpen: true,
            text: "Erro ao lançar faturas",
          })
        );
      }
    };

    try {
      const response = await postMultipleInvoice(payload).unwrap();
      console.log("Success:", response);
      handleNotification(true);
      // Optionally, close the drawer on success
      handleCloseDrawer();
    } catch (err) {
      handleNotification(false);
      console.error("Error:", err);
    }
  };

  const sortedData = [...csvData].sort((a, b) => {
    if (sortOrder === "asc") {
      return (
        new Date(a.date.value).getTime() - new Date(b.date.value).getTime()
      );
    } else {
      return (
        new Date(b.date.value).getTime() - new Date(a.date.value).getTime()
      );
    }
  });

  useEffect(() => {
    const initialSelected = csvData.filter(
      (item) =>
        !(
          item.date.errorDoubleDateCsv ||
          item.date.errorDoubleDateRegistered ||
          item.date.errorDateNotCoveredByContract ||
          item.peakConsumptionInKwh.error ||
          item.offPeakConsumptionInKwh.error ||
          item.peakMeasuredDemandInKw.error ||
          item.offPeakMeasuredDemandInKw.error ||
          item.invoiceInReais.error
        )
    );
    setSelectedRows(initialSelected);
  }, [csvData]);

  return (
    <Drawer
      open={isCsvFormOpen}
      anchor="bottom"
      PaperProps={{ sx: { height: "100%" } }}
      onClose={handleCloseDrawer}
    >
      <AppBar position="static">
        <Toolbar>
          <Container maxWidth="lg">
            <Box display="flex" alignItems="center">
              <IconButton
                edge="start"
                color="inherit"
                aria-label="Fechar formulário"
                onClick={handleCloseDrawer}
              >
                <CloseRounded />
              </IconButton>

              <Box ml={3}>
                <Typography variant="h6">Importar CSV</Typography>
              </Box>
            </Box>
          </Container>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg">
        <Box mt={3} mb={6} component="form" onSubmit={handleSubmitDrawer}>
          <Box my={4}>
            <Typography variant="body2" color="primary.main">
              * campos obrigatórios
            </Typography>
          </Box>

          <Box mt={4}>
            <Box p={2}>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow
                      style={{
                        backgroundColor: "#EEF4F4",
                        color: "#000",
                        border: "none",
                      }}
                    >
                      <TableCell
                        colSpan={1}
                        style={{
                          backgroundColor: "transparent",
                          border: "none",
                          borderBottom: "none",
                          padding: "8px",
                        }}
                      ></TableCell>
                      <TableCell
                        colSpan={1}
                        style={{
                          backgroundColor: "transparent",
                          border: "none",
                          borderBottom: "none",
                          padding: "8px",
                        }}
                      ></TableCell>
                      <TableCell
                        colSpan={2}
                        align="center"
                        style={{
                          backgroundColor: "#0A5C6714",
                          color: "#000",
                          border: "none",
                          borderBottom: "none",
                          padding: "8px",
                        }}
                      >
                        Consumo (kWh)
                      </TableCell>
                      <TableCell
                        colSpan={2}
                        align="center"
                        style={{
                          backgroundColor: "#0A5C6714",
                          color: "#000",
                          border: "none",
                          borderBottom: "none",
                          padding: "8px",
                        }}
                      >
                        Demanda (kW)
                      </TableCell>
                      <TableCell
                        colSpan={1}
                        style={{
                          backgroundColor: "transparent",
                          border: "none",
                          borderBottom: "none",
                          padding: "8px",
                        }}
                      ></TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell>Incluir</TableCell>
                      <TableCell
                        onClick={handleSort}
                        style={{ cursor: "pointer", whiteSpace: "nowrap" }}
                      >
                        Data{" "}
                        {sortOrder === "asc" ? (
                          <ArrowUpward fontSize="small" />
                        ) : (
                          <ArrowDownward fontSize="small" />
                        )}
                      </TableCell>
                      <TableCell>Ponta</TableCell>
                      <TableCell>Fora Ponta</TableCell>
                      <TableCell>Ponta</TableCell>
                      <TableCell>Fora Ponta</TableCell>
                      <TableCell>Valor (R$)</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {sortedData.map((item, index) => {
                      const hasError =
                        item.date.errorDoubleDateCsv ||
                        item.date.errorDoubleDateRegistered ||
                        item.date.errorDateNotCoveredByContract ||
                        item.peakConsumptionInKwh.error ||
                        item.offPeakConsumptionInKwh.error ||
                        item.peakMeasuredDemandInKw.error ||
                        item.offPeakMeasuredDemandInKw.error ||
                        item.invoiceInReais.error;

                      const errorMessages = [];
                      if (item.date.errorDoubleDateCsv) {
                        errorMessages.push("- Data duplicada dentro do CSV.");
                      }
                      if (item.date.errorDoubleDateRegistered) {
                        errorMessages.push(
                          "- Data já registrada para esta unidade consumidora."
                        );
                      }
                      if (item.date.errorDateNotCoveredByContract) {
                        errorMessages.push("- Data não coberta pelo contrato.");
                      }
                      if (
                        item.peakConsumptionInKwh.error ||
                        item.offPeakConsumptionInKwh.error
                      ) {
                        errorMessages.push(
                          "- Valores de Consumo devem ser números entre 0,1 e 99.999,99"
                        );
                      }
                      if (
                        item.peakMeasuredDemandInKw.error ||
                        item.offPeakMeasuredDemandInKw.error
                      ) {
                        errorMessages.push(
                          "- Valores de Demanda devem ser números entre 0,1 e 99.999,99"
                        );
                      }
                      if (item.invoiceInReais.error) {
                        errorMessages.push(
                          "- O valor da fatura é opcional, mas se preenchido deve ser um número entre 0,1 e 99.999.999,99"
                        );
                      }

                      return (
                        <React.Fragment key={index}>
                          <TableRow
                            style={{
                              backgroundColor:
                                index % 2 === 0 ? "#FFFFFF" : "#EEF4F4",
                            }}
                          >
                            <TableCell
                              rowSpan={hasError ? 2 : 1}
                              style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                verticalAlign: "middle",
                              }}
                            >
                              {hasError ? (
                                <ReportRounded
                                  style={{ color: theme.palette.error.main }}
                                />
                              ) : (
                                <Switch
                                  checked={selectedRows.includes(item)}
                                  onChange={() => handleSwitchChange(item)}
                                />
                              )}
                            </TableCell>
                            <TableCell
                              style={{
                                backgroundColor:
                                  item.date.errorDoubleDateCsv ||
                                  item.date.errorDoubleDateRegistered ||
                                  item.date.errorDateNotCoveredByContract
                                    ? theme.palette.error.main
                                    : "inherit",
                                color:
                                  item.date.errorDoubleDateCsv ||
                                  item.date.errorDoubleDateRegistered ||
                                  item.date.errorDateNotCoveredByContract
                                    ? "#FFFFFF"
                                    : "inherit",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {item.date.value}
                            </TableCell>
                            <TableCell
                              style={{
                                backgroundColor: item.peakConsumptionInKwh.error
                                  ? theme.palette.error.main
                                  : "inherit",
                                color: item.peakConsumptionInKwh.error
                                  ? "#FFFFFF"
                                  : "inherit",
                              }}
                            >
                              {item.peakConsumptionInKwh.value}
                            </TableCell>
                            <TableCell
                              style={{
                                backgroundColor: item.offPeakConsumptionInKwh
                                  .error
                                  ? theme.palette.error.main
                                  : "inherit",
                                color: item.offPeakConsumptionInKwh.error
                                  ? "#FFFFFF"
                                  : "inherit",
                              }}
                            >
                              {item.offPeakConsumptionInKwh.value}
                            </TableCell>
                            <TableCell
                              style={{
                                backgroundColor: item.peakMeasuredDemandInKw
                                  .error
                                  ? theme.palette.error.main
                                  : "inherit",
                                color: item.peakMeasuredDemandInKw.error
                                  ? "#FFFFFF"
                                  : "inherit",
                              }}
                            >
                              {item.peakMeasuredDemandInKw.value}
                            </TableCell>
                            <TableCell
                              style={{
                                backgroundColor: item.offPeakMeasuredDemandInKw
                                  .error
                                  ? theme.palette.error.main
                                  : "inherit",
                                color: item.offPeakMeasuredDemandInKw.error
                                  ? "#FFFFFF"
                                  : "inherit",
                              }}
                            >
                              {item.offPeakMeasuredDemandInKw.value}
                            </TableCell>
                            <TableCell
                              style={{
                                backgroundColor: item.invoiceInReais.error
                                  ? theme.palette.error.main
                                  : "inherit",
                                color: item.invoiceInReais.error
                                  ? "#FFFFFF"
                                  : "inherit",
                              }}
                            >
                              {item.invoiceInReais.value}
                            </TableCell>
                          </TableRow>
                          {hasError && (
                            <TableRow>
                              <TableCell
                                colSpan={7}
                                style={{
                                  color: theme.palette.error.main,
                                  textAlign: "left",
                                  paddingLeft: "16px",
                                }}
                              >
                                {errorMessages.map((msg, idx) => (
                                  <div key={idx}>{msg}</div>
                                ))}
                              </TableCell>
                            </TableRow>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </Box>

          <Box mt={4} display="flex" flexDirection="column" alignItems="center">
            <Alert
              variant="filled"
              severity="warning"
              style={{ marginBottom: "16px" }}
            >
              Apenas meses selecionados como “Incluir” serão gravados
            </Alert>
            <Grid
              item
              xs={12}
              style={{ display: "flex", justifyContent: "center" }}
            >
              <Button
                onClick={handleSubmitDrawer}
                variant="contained"
                color="primary"
                size="large"
                style={{ marginRight: "16px", width: "100px" }}
                disabled={isLoading}
              >
                Enviar
              </Button>
              <Button
                variant="outlined"
                onClick={handleCloseDrawer}
                size="large"
                style={{ width: "100px" }}
              >
                <Typography pl={3} pr={3}>
                  Cancelar
                </Typography>
              </Button>
            </Grid>
          </Box>
        </Box>
      </Container>
    </Drawer>
  );
};

export default CsvForm;
