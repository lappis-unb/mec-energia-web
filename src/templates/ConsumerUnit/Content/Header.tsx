import React, { SyntheticEvent, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { skipToken } from "@reduxjs/toolkit/dist/query";
import {
  Box,
  Button,
  Container,
  Divider,
  IconButton,
  Stack,
  Tab,
  Tabs,
  Typography,
  Alert,
} from "@mui/material";
import { FlashOffRounded } from "@mui/icons-material";
import StarOutlineRoundedIcon from "@mui/icons-material/StarOutlineRounded";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import EditIcon from "@mui/icons-material/Edit";
import UploadFileIcon from "@mui/icons-material/UploadFileRounded";
import ReceiptLongRoundedIcon from "@mui/icons-material/ReceiptLongRounded";
import InsightsRoundedIcon from "@mui/icons-material/InsightsRounded";
import StickyNote2RoundedIcon from "@mui/icons-material/StickyNote2Rounded";
import {
  useEditPersonFavoritesMutation,
  useFetchConsumerUnitsQuery,
} from "@/api";

import {
  selectActiveConsumerUnitId,
  selectConsumerUnitOpenedTab,
  setConsumerUnitOpenedTab,
  setIsConsumerUnitEditFormOpen,
  setIsCsvFormOpen,
} from "@/store/appSlice";
import { useGetConsumerUnitQuery, usePostInvoiceCsvMutation } from "@/api";
import CsvDialog from "./Invoice/csvDialog";
import CsvForm from "./Invoice/csvForm";
import { RootState } from "@/types/app";
import { useSession } from "next-auth/react";

interface CsvData {
  consumerUnit: { value: string; error: boolean };
  date: { value: string; error: boolean };
  invoiceInReais: { value: string; error: boolean };
  isAtypical: { value: string; error: boolean };
  peakConsumptionInKwh: { value: string; error: boolean };
  offPeakConsumptionInKwh: { value: string; error: boolean };
  peakMeasuredDemandInKw: { value: string; error: boolean };
  offPeakMeasuredDemandInKw: { value: string; error: boolean };
}

const ConsumerUnitContentHeader = () => {
  const dispatch = useDispatch();
  const consumerUnitId = useSelector(selectActiveConsumerUnitId);
  const { data: consumerUnit } = useGetConsumerUnitQuery(
    consumerUnitId ?? skipToken
  );
  const [editPersonFavorites] = useEditPersonFavoritesMutation();

  const { data: session } = useSession();
  const { data: consumerUnitsData } = useFetchConsumerUnitsQuery(
    session?.user.universityId ?? skipToken
  );
  const openedTab = useSelector(selectConsumerUnitOpenedTab);
  const isCsvFormOpen = useSelector(
    (state: RootState) => state.app.consumerUnit.isCsvFormOpen
  );
  const [isCsvDialogOpen, setIsCsvDialogOpen] = useState(false);
  const [csvData, setCsvData] = useState<CsvData[]>([]);
  const [postInvoiceCsvMutation] = usePostInvoiceCsvMutation();

  const handleEditConsumerUnitClick = () => {
    dispatch(setIsConsumerUnitEditFormOpen(true));
  };

  const handleTabChange = (_event: SyntheticEvent, tabIndex: number) => {
    dispatch(setConsumerUnitOpenedTab(tabIndex));
  };

  const handleOpenCsvDialog = () => {
    setIsCsvDialogOpen(true);
  };

  const handleCloseCsvDialog = () => {
    setIsCsvDialogOpen(false);
  };

  const handleFileSelect = async (file: File) => {
    try {
      const formDataCsv = new FormData();
      formDataCsv.append("consumer_unit_id", (consumerUnitId ?? "").toString());
      formDataCsv.append("csvFile", file);
      const response = await postInvoiceCsvMutation(formDataCsv).unwrap();

      if (response && typeof response === "object" && "data" in response) {
        setCsvData(response.data);
      }

      handleCloseCsvDialog();
      dispatch(setIsCsvFormOpen(true)); // Abre o CsvForm
    } catch (error) {
      console.error("Erro ao enviar o arquivo CSV:", error);
    }
  };
  const handleFavoriteButtonClick = useCallback<
    MouseEventHandler<HTMLButtonElement>
  >(async (event) => {
    event.stopPropagation();
    const body: EditFavoritesRequestPayload = {
      consumerUnitId: consumerUnit?.id,
      personId: session?.user?.id,
      action: consumerUnit?.isFavorite ? "remove" : "add",
    };
    await editPersonFavorites(body);
  });

  const activeConsumerUnitData = consumerUnitsData?.find(
    (consumerUnit) => consumerUnit?.id === consumerUnitId
  );

  if (!activeConsumerUnitData) {
    return null;
  }

  return (
    <Box
      position="sticky"
      top={0}
      zIndex={1}
      sx={{ backgroundColor: "background.default" }}
    >
      <Container>
        <Box display="flex">
          <Box mt={-0.5}>
            <IconButton
              color="primary"
              edge="start"
              onClick={handleFavoriteButtonClick}
            >
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
                <Stack direction="row" spacing={2}>
                  <Button
                    variant="outlined"
                    startIcon={<EditIcon />}
                    size="small"
                    onClick={handleEditConsumerUnitClick}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<UploadFileIcon />}
                    size="small"
                    onClick={handleOpenCsvDialog}
                  >
                    Importar planilha
                  </Button>
                </Stack>
              </Box>
            </Box>
            <Typography>
              Unidade consumidora: <strong>{consumerUnit?.code}</strong>
            </Typography>
          </Box>
        </Box>

        {!consumerUnit?.isActive &&
          (
            <Alert
              severity="warning"
              variant="filled"
              icon={<FlashOffRounded style={{ color: "#000", opacity: 0.5 }} />}
              sx={{ cursor: 'pointer', whiteSpace: 'pre-line', mt: 3 }}
            >
              Unidade desativada
            </Alert>
          )
        }

        <Tabs value={openedTab} variant="fullWidth" onChange={handleTabChange}>
          <Tab
            icon={<ReceiptLongRoundedIcon />}
            label="Faturas"
            iconPosition="start"
          />
          {
            consumerUnit?.isActive && (
              <Tab
                icon={<InsightsRoundedIcon />}
                label="Análise"
                iconPosition="start"
              />)
          }
          <Tab
            icon={<StickyNote2RoundedIcon />}
            label="Contrato"
            iconPosition="start"
          />
        </Tabs>
        <Divider />
        <CsvDialog
          isCsvDialogOpen={isCsvDialogOpen}
          handleCloseCsvDialog={handleCloseCsvDialog}
          onFileSelect={handleFileSelect}
        />
      </Container>
      {isCsvFormOpen && <CsvForm csvData={csvData} />}
    </Box>
  );
};

export default ConsumerUnitContentHeader;
