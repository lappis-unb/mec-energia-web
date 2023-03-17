import { useSelector } from "react-redux";
import { skipToken } from "@reduxjs/toolkit/dist/query";

import { Alert, Box, Grid, Typography } from "@mui/material";

import { useGetDistributorQuery, useGetDistributorSubgroupsQuery } from "@/api";
import {
  selectActiveDistributorId,
  selectActiveSubgroup,
} from "@/store/appSlice";

import DistributorContentConsumerUnitsList from "./ConsumerUnitsList";
import DistributorContentTariffsTable from "./TariffsTable";
import { FlashOffRounded } from "@mui/icons-material";

const DistributorContent = () => {
  const distributorId = useSelector(selectActiveDistributorId);
  const selectedSubgroupTariff = useSelector(selectActiveSubgroup);

  const { data: distributor, isLoading: isDistributorLoading } =
    useGetDistributorQuery(distributorId ?? skipToken);

  const { isLoading: isSubgroupLoading } = useGetDistributorSubgroupsQuery(
    distributorId ?? skipToken
  );

  if (isDistributorLoading || isSubgroupLoading) {
    return <Box pt={2}>Carregando...</Box>;
  }

  if (distributor && !distributor.isActive) {
    return (
      <Box pt={2}>
        <Alert
          color="warning"
          icon={
            <FlashOffRounded
              sx={{
                color: "black",
              }}
            />
          }
        >
          Distribuidora desativada
        </Alert>

        <Box pt={2}>
          <DistributorContentConsumerUnitsList />
        </Box>

        <Box pt={2}>
          <Typography variant="body2" color="text.secondary">
            Apenas distribuidoras ativas exibem informações de tarifas.
          </Typography>
        </Box>
      </Box>
    );
  }

  if (!selectedSubgroupTariff) {
    return (
      <Box pt={2}>
        <Typography variant="h5">
          Nenhuma unidade consumidora associada
        </Typography>

        <Box pt={2}>
          <Typography variant="body2" color="text.secondary">
            Para ver tarifas, selecione esta distribuidora no contrato de uma
            unidade consumidora.
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Grid container pt={2} spacing={2}>
      <Grid item xs={8}>
        <DistributorContentTariffsTable />
      </Grid>

      <Grid item xs={4}>
        <DistributorContentConsumerUnitsList />
      </Grid>
    </Grid>
  );
};

export default DistributorContent;
