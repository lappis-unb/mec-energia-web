import { SyntheticEvent, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { skipToken } from "@reduxjs/toolkit/dist/query";
import {
  Box,
  Button,
  Container,
  Divider,
  IconButton,
  Tab,
  Tabs,
  Typography,
  TextField,
} from "@mui/material";
import { isAfter, isBefore } from 'date-fns';
import StarOutlineRoundedIcon from "@mui/icons-material/StarOutlineRounded";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import EditIcon from "@mui/icons-material/Edit";
import ReceiptLongRoundedIcon from "@mui/icons-material/ReceiptLongRounded";
import InsightsRoundedIcon from "@mui/icons-material/InsightsRounded";
import StickyNote2RoundedIcon from "@mui/icons-material/StickyNote2Rounded";
import { Upload } from "@mui/icons-material";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

import {
  selectActiveConsumerUnitId,
  selectConsumerUnitOpenedTab,
  setConsumerUnitOpenedTab,
  setIsConsumerUnitEditFormOpen,
} from "@/store/appSlice";
import { useFetchInvoicesQuery, useGetConsumerUnitQuery } from "@/api";
import { DatePicker } from "@mui/x-date-pickers";

const ConsumerUnitContentHeader = () => {
  const dispatch = useDispatch();
  const consumerUnitId = useSelector(selectActiveConsumerUnitId);
  const { data: consumerUnit } = useGetConsumerUnitQuery(
    consumerUnitId ?? skipToken
  );

  const openedTab = useSelector(selectConsumerUnitOpenedTab);



  const handleEditConsumerUnitClick = () => {
    dispatch(setIsConsumerUnitEditFormOpen(true));
  };

  const handleTabChange = (_event: SyntheticEvent, tabIndex: number) => {
    dispatch(setConsumerUnitOpenedTab(tabIndex));
  };

  const [openExportDialog, setOpenExportDialog] = useState(false);

  const [initialExportDate, setInitialExportDate] = useState(new Date());
  const [finalExportDate, setFinalExportDate] = useState(new Date());


  const handleExportClick = () => {
    setOpenExportDialog(true);
  };

  const downloadCsv = (csvString: string, filename = 'data.csv') => {


    // Create a blob with your CSV data
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });

    // Create a link element
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';

    // Append link to the body
    document.body.appendChild(link);

    // Trigger the download by simulating click
    link.click();

    // Clean up and remove the link
    link.parentNode?.removeChild(link);
  };



  const handleCloseExportDialog = () => {
    setOpenExportDialog(false);
    setInitialExportDate(new Date());
    setFinalExportDate(new Date());
  };





  const { data: consumerUnitData } = useFetchInvoicesQuery(
    consumerUnitId ?? skipToken
  );

  function formatDate(date: Date) {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();

    if (month.length < 2)
      month = '0' + month;
    if (day.length < 2)
      day = '0' + day;

    return [day, month, year].join('-');
  }


  const handleDownloadExportedInvoices = () => {
    let csvString = `data,incluirNaAnalise,valorEmReais,consumoPicoEmKwh,consumoForaPicoEmKwh,demandaPicoEmKw,demandaForaPicoEmKw\n`;
    if (consumerUnitData) {
      Object.keys(consumerUnitData).forEach((year) => {
        consumerUnitData[year].forEach((invoice) => {
          if (invoice.energyBill) {
            if (isBefore(new Date(invoice.energyBill.date), initialExportDate) || isAfter(new Date(invoice.energyBill.date), finalExportDate)) return;
            csvString += `${formatDate(new Date(invoice.energyBill.date))},${invoice.energyBill.isAtypical},${invoice.energyBill.invoiceInReais},${invoice.energyBill.peakConsumptionInKwh},${invoice.energyBill.offPeakConsumptionInKwh},${invoice.energyBill.peakMeasuredDemandInKw},${invoice.energyBill.offPeakMeasuredDemandInKw}\n`;
          }
        });
      });
    }

    downloadCsv(csvString, `faturas-${initialExportDate.getMonth()}-${initialExportDate.getFullYear()}-ate-${finalExportDate.getMonth()}-${finalExportDate.getFullYear()}.csv`);
    setOpenExportDialog(false);
    setInitialExportDate(new Date());
    setFinalExportDate(new Date());
  };

  return (
    <Box
      position="sticky"
      top={0}
      zIndex={1}
      sx={{ backgroundColor: "background.default" }}
    >
      <Container>
        <Box display="flex" justifyContent="space-between">
          <Box display="flex">
            <Box mt={-0.5}>
              <IconButton color="primary" edge="start">
                {consumerUnit?.isFavorite ? (
                  <StarRoundedIcon fontSize="large" />
                ) : (
                  <StarOutlineRoundedIcon fontSize="large" />
                )}
              </IconButton>
            </Box>

            <Box pl={1}>
              <Box display="flex" alignItems="center">
                <Typography variant="h4">{consumerUnit?.name}</Typography>

                <Box pl={2}>
                  <Button
                    variant="outlined"
                    startIcon={<EditIcon />}
                    size="small"
                    onClick={handleEditConsumerUnitClick}
                  >
                    Editar
                  </Button>
                </Box>

              </Box>


              <Typography>
                Unidade consumidora: <strong>{consumerUnit?.code}</strong>
              </Typography>
            </Box>
          </Box>

          <Box display="flex">
            <Box pl={1} display="flex" flexDirection="column" flex={1}>
              <Button
                variant="outlined"
                startIcon={<Upload />}
                size="medium"
                onClick={handleExportClick}
              >
                Exportar Fatura
              </Button>
            </Box>

            <Dialog open={openExportDialog} onClose={handleCloseExportDialog}>
              <DialogTitle>Exportar Fatura</DialogTitle>
              <DialogContent>

                <style jsx>{`
                      .csv-field {
                        font-weight: bold;
                      }
                    
                      .center-button {
                        text-align: center;
                      }
                  `}</style>

                <Typography variant="h6">
                  Campos das faturas:
                </Typography>

                <ul>
                  <li><span className="csv-field">data:</span> Data no formato DD-MM-YYYY.</li>
                  <li><span className="csv-field">incluirNaAnalise:</span>Se a fatura está incluida na análise. Normalmente todas as faturas são inclusas, exceto casos radicalmente excepcionais como greves ou a pandemia. <q>true</q> significa que está incluido e  <q>false</q> significa que não está.</li>
                  <li><span className="csv-field">valorEmReais:</span> Valor da fatura em reais (ex: 500.75).</li>
                  <li><span className="csv-field">consumoForaPicoEmKwh:</span> Consumo fora do horário de pico em kWh (ex: 100).</li>
                  <li><span className="csv-field">consumoPicoEmKwh:</span> Consumo durante o horário de pico em kWh (ex: 150).</li>
                  <li><span className="csv-field">demandaPicoEmKw:</span> Demanda medida durante o horário de pico em kW (ex: 50).</li>
                  <li><span className="csv-field">demandaForaPicoEmKw:</span> Demanda medida fora do horário de pico em kW (ex: 40).</li>
                </ul>


                <Box display="flex" justifyContent="space-between" >
                  <DatePicker
                    views={['year', 'month']}
                    label="Data de Início"
                    minDate={new Date('2000-01-01')}
                    maxDate={finalExportDate}

                    value={initialExportDate}
                    onChange={(newValue) => {
                      if (newValue) {

                        setInitialExportDate(newValue);
                      }
                    }}
                    renderInput={(params) => <TextField {...params} />}
                  />

                  <DatePicker
                    views={['year', 'month']}
                    label="Data de Fim"
                    minDate={initialExportDate}
                    maxDate={new Date()}
                    value={finalExportDate}
                    onChange={(newValue) => {
                      if (newValue) {

                        setFinalExportDate(newValue);
                      }
                    }}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </Box>

              </DialogContent>

              <DialogActions>
                <Button onClick={handleCloseExportDialog} color="primary">
                  Fechar
                </Button>
                <Button
                  onClick={handleDownloadExportedInvoices}
                  color="primary"
                  className="center-button"
                >
                  Exportar
                </Button>
              </DialogActions>
            </Dialog>
          </Box>
        </Box>




        <Tabs value={openedTab} variant="fullWidth" onChange={handleTabChange}>
          <Tab
            icon={<ReceiptLongRoundedIcon />}
            label="Faturas"
            iconPosition="start"
          />
          <Tab
            icon={<InsightsRoundedIcon />}
            label="Análise"
            iconPosition="start"
          />
          <Tab
            icon={<StickyNote2RoundedIcon />}
            label="Contrato"
            iconPosition="start"
          />
        </Tabs>

        <Divider />
      </Container>
    </Box>
  );
};

export default ConsumerUnitContentHeader;
