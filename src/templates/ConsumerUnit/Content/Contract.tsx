import { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  Typography,
} from "@mui/material";
import {
  selectActiveConsumerUnitId,
  setIsConsumerUnitEditFormOpen,
  setIsConsumerUnitRenewContractFormOpen,
} from "@/store/appSlice";
import { useGetConsumerUnitQuery, useGetContractQuery } from "@/api";
import { skipToken } from "@reduxjs/toolkit/dist/query";
import { getFormattedDate } from "@/utils/date";
import { getTariffFlagName } from "@/utils/tariff";

const ConsumerUnitContractContent = () => {
  const dispatch = useDispatch();
  const consumerUnitId = useSelector(selectActiveConsumerUnitId);
  const { data: contractData } = useGetContractQuery(
    consumerUnitId ?? skipToken,
    {
      refetchOnMountOrArgChange: true,
    }
  );
  const { data: consumerUnit } = useGetConsumerUnitQuery(
    consumerUnitId ?? skipToken
  )
  const [isRenewContractDialogOpen, setIsRenewContractDialogOpen] =
    useState(false);

  const contract = useMemo(() => {
    if (!contractData) {
      return null;
    }

    return {
      ...contractData,
      startDate: getFormattedDate(contractData.startDate),
      tariffFlag: getTariffFlagName(contractData.tariffFlag),
    };
  }, [contractData]);

  const handleCloseRenewContractDialog = () => {
    setIsRenewContractDialogOpen(false);
  };

  const handleRenewContractClick = () => {
    setIsRenewContractDialogOpen(true);
  };

  const handleRenewContractConfirm = () => {
    setIsRenewContractDialogOpen(false);
    dispatch(setIsConsumerUnitRenewContractFormOpen(true));
  };

  const handleEditFormClick = () => {
    dispatch(setIsConsumerUnitEditFormOpen(true));
  };

  return (
    <Box display="flex" justifyContent="center">
      <Card sx={{ maxWidth: "450px" }}>
        <CardHeader title={contract?.distributorName} />
        <CardContent>
          <Grid container rowSpacing="28px" columnSpacing={4} >
            <Grid item xs={6}>
              <Typography variant="body2" color="GrayText">
                Início
              </Typography>

              <Typography variant="body1">{contract?.startDate}</Typography>
            </Grid>

            <Grid item xs={6}>
              <Typography variant="body2" color="GrayText">
                Modalidade tarifária
              </Typography>

              <Typography variant="body1">{contract?.tariffFlag}</Typography>
            </Grid>

            <Grid item xs={6} display="grid">
              <Grid>
                <Typography variant="body2" color="GrayText">
                  Tensão de fornecimento
                </Typography>

                <Typography variant="body1">
                  {contract?.supplyVoltage} kV - Subgrupo {contract?.subgroup}
                </Typography>
              </Grid>

              {consumerUnit?.totalInstalledPower &&
                <Grid mt="28px">
                  <Typography variant="body2" color="GrayText" sx={{ maxWidth: "167px" }}>
                    Potência de geração total instalada
                  </Typography>

                  <Typography variant="body1">
                    {consumerUnit?.totalInstalledPower} kW
                  </Typography>
                </Grid>
              }
            </Grid>

            <Grid item xs={6}>
              <Typography variant="subtitle2">Demanda contratada</Typography>

              <Box display="flex">
                <Box>
                  <Typography variant="body2" color="GrayText">
                    Ponta
                  </Typography>

                  <Typography variant="body1">
                    {contract?.peakContractedDemandInKw} kW
                  </Typography>
                </Box>

                <Box ml={3}>
                  <Typography variant="body2" color="GrayText">
                    Fora Ponta
                  </Typography>

                  <Typography variant="body1">
                    {contract?.offPeakContractedDemandInKw} kW
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </CardContent>


        <CardActions>
          <Button size="small" onClick={handleEditFormClick}>
            Editar
          </Button>

          <Button size="small" onClick={handleRenewContractClick}>
            Renovar contrato
          </Button>
        </CardActions>
      </Card>

      <Dialog
        open={isRenewContractDialogOpen}
        onClose={handleCloseRenewContractDialog}
        maxWidth="xs"
      >
        <DialogTitle>Iniciar renovação de contrato?</DialogTitle>

        <DialogContent>
          <Typography>
            Renove apenas em caso de alterações legais ou de ter recebido um
            novo contrato.
          </Typography>

          <Box pt={2}>
            <DialogContentText>
              Para corrigir erros no contrato vigente, use a opção{" "}
              <strong>Editar</strong> na tela anterior.
            </DialogContentText>
          </Box>
        </DialogContent>

        <DialogActions>
          <Button autoFocus onClick={handleCloseRenewContractDialog}>
            Cancelar
          </Button>

          <Button onClick={handleRenewContractConfirm}>
            Iniciar renovação
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ConsumerUnitContractContent;
