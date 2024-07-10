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

import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const formatDate = (dateString: string) => {
  const date = parseISO(dateString);
  const formattedDate = format(date, "MMMM yyyy", { locale: ptBR });
  return formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
};

const formatNumber = (numberString: string) => {
  const number = parseFloat(numberString);
  return number.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

interface CsvData {
  consumerUnit: { value: string; error: boolean };
  date: {
    value: string;
    errors: [[number, string]] | null
  };
  invoiceInReais: { value: string; errors: [[number, string]] | null };
  peakConsumptionInKwh: { value: string; errors: [[number, string]] | null };
  offPeakConsumptionInKwh: { value: string; errors: [[number, string]] | null };
  peakMeasuredDemandInKw: { value: string; errors: [[number, string]] | null };
  offPeakMeasuredDemandInKw: { value: string; errors: [[number, string]] | null };
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
  const [hasErrorInCsv, setHasErrorInCsv] = useState(false);

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
      (item) => !(hasRowWithErrorInCsv(item))
    );
    const hasErrorInCsv = csvData.some(hasRowWithErrorInCsv);

    setSelectedRows(initialSelected);
    setHasErrorInCsv(hasErrorInCsv);
  }, [csvData]);

  const hasRowWithErrorInCsv = (item: CsvData) => {
    return (
      item.date.errors ||
      item.peakConsumptionInKwh.errors ||
      item.offPeakConsumptionInKwh.errors ||
      item.peakMeasuredDemandInKw.errors ||
      item.offPeakMeasuredDemandInKw.errors ||
      item.invoiceInReais.errors
    );
  }

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
              <TableContainer component={Paper} sx={{ boxShadow: "none" }}>
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
                      const hasError = hasRowWithErrorInCsv(item);
                      const errorMessages = [];
                      Object.keys(item).forEach((key) => {
                        if (item[key].errors) {
                          item[key].errors.forEach(([, msg]) => {
                            errorMessages.push("- " + msg)
                          })
                        }
                      })

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
                                alignContent: "center",
                                verticalAlign: "middle",
                              }}
                            >
                              <Box display="flex" justifyContent="center" alignItems="center">
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
                              </Box>
                            </TableCell>
                            <TableCell
                              style={{
                                backgroundColor:
                                  item.date.errors
                                    ? theme.palette.error.main
                                    : "inherit",
                                color:
                                  item.date.errors
                                    ? "#FFFFFF"
                                    : "inherit",
                                whiteSpace: "nowrap",
                                borderBottom: hasError ? "none" : "1px solid #e0e0e0"
                              }}
                            >
                              {formatDate(item.date.value)}
                            </TableCell>
                            <TableCell
                              style={{
                                backgroundColor: item.peakConsumptionInKwh.errors
                                  ? theme.palette.error.main
                                  : "inherit",
                                color: item.peakConsumptionInKwh.errors
                                  ? "#FFFFFF"
                                  : "inherit",
                                borderBottom: hasError ? "none" : "1px solid #e0e0e0"
                              }}
                            >
                              {formatNumber(item.peakConsumptionInKwh.value)}
                            </TableCell>
                            <TableCell
                              style={{
                                backgroundColor: item.offPeakConsumptionInKwh
                                  .error
                                  ? theme.palette.error.main
                                  : "inherit",
                                color: item.offPeakConsumptionInKwh.errors
                                  ? "#FFFFFF"
                                  : "inherit",
                                borderBottom: hasError ? "none" : "1px solid #e0e0e0"
                              }}
                            >
                              {formatNumber(item.offPeakConsumptionInKwh.value)}
                            </TableCell>
                            <TableCell
                              style={{
                                backgroundColor: item.peakMeasuredDemandInKw
                                  .error
                                  ? theme.palette.error.main
                                  : "inherit",
                                color: item.peakMeasuredDemandInKw.errors
                                  ? "#FFFFFF"
                                  : "inherit",
                                borderBottom: hasError ? "none" : "1px solid #e0e0e0"
                              }}
                            >
                              {formatNumber(item.peakMeasuredDemandInKw.value)}
                            </TableCell>
                            <TableCell
                              style={{
                                backgroundColor: item.offPeakMeasuredDemandInKw
                                  .error
                                  ? theme.palette.error.main
                                  : "inherit",
                                color: item.offPeakMeasuredDemandInKw.errors
                                  ? "#FFFFFF"
                                  : "inherit",
                                borderBottom: hasError ? "none" : "1px solid #e0e0e0"
                              }}
                            >
                              {formatNumber(item.offPeakMeasuredDemandInKw.value)}
                            </TableCell>
                            <TableCell
                              style={{
                                backgroundColor: item.invoiceInReais.errors
                                  ? theme.palette.error.main
                                  : "inherit",
                                color: item.invoiceInReais.errors
                                  ? "#FFFFFF"
                                  : "inherit",
                                borderBottom: hasError ? "none" : "1px solid #e0e0e0"
                              }}
                            >
                              {formatNumber(item.invoiceInReais.value)}
                            </TableCell>
                          </TableRow>
                          {hasError && (
                            <TableRow
                              style={{
                                backgroundColor:
                                  index % 2 === 0 ? "#FFFFFF" : "#EEF4F4",
                              }}
                            >
                              <TableCell
                                colSpan={7}
                                style={{
                                  color: theme.palette.error.main,
                                  textAlign: "left",
                                  paddingLeft: "0px"
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

          <Box display="flex" alignItems="center" justifyContent="center">
            <Box mt={4} display="flex" flexDirection="column" alignItems="self-start">
              {hasErrorInCsv ? (
                <Alert
                  variant="filled"
                  severity="error"
                  style={{ marginBottom: "16px" }}
                >
                  Corrija os erros na planilha e importe-a novamente
                </Alert>
              ) : (
                <Alert
                  variant="filled"
                  severity="warning"
                  style={{ marginBottom: "16px" }}
                >
                  Apenas meses selecionados como “Incluir” serão gravados
                </Alert>
              )}
              <Grid
                item
                xs={12}
                style={{ display: "flex" }}
              >
                <Button
                  onClick={handleSubmitDrawer}
                  variant="contained"
                  color="primary"
                  size="large"
                  style={{ marginRight: "16px", width: "100px" }}
                  disabled={isLoading || (selectedRows.length <= 0)}
                >
                  Gravar
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
        </Box>
      </Container>
    </Drawer>
  );
};

export default CsvForm;
