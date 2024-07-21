import { useCallback, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, Button, Grid, Typography } from "@mui/material";
import {
  selectDashboardActiveFilter,
  setActiveConsumerUnitId,
  setIsConsumerUnitCreateFormOpen,
} from "@/store/appSlice";
import DistributorCard from "@/components//Distributor/DistributorCard";
import ConsumerUnitCard from "@/components/ConsumerUnit/CardV2";
import { useFetchConsumerUnitsQuery, useFetchPendingDistributorsQuery } from "@/api";
import { useSession } from "next-auth/react";
import { skipToken } from "@reduxjs/toolkit/dist/query";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import FlagRoundedIcon from '@mui/icons-material/FlagRounded';

const DashboardCardGrid = () => {
  const dispatch = useDispatch();
  const { data: session } = useSession();

  const { data: distributors } = useFetchPendingDistributorsQuery(
    session?.user.universityId ?? skipToken
  );

  const { data: consumerUnitsData, isFetching } = useFetchConsumerUnitsQuery(
    session?.user.universityId ?? skipToken
  );

  const activeFilter = useSelector(selectDashboardActiveFilter);

  const consumerUnits = useMemo(() => {
    if (!consumerUnitsData) {
      return [];
    }

    const filteredConsumerUnits = [];

    switch (activeFilter) {
      case "all":
        filteredConsumerUnits.push(...consumerUnitsData);
        break;

      case "active":
        const activeConsumerUnits = consumerUnitsData.filter(
          ({ isActive }) => isActive
        );
        filteredConsumerUnits.push(...activeConsumerUnits);
        break;

      case "pending":
        const pendingConsumerUnits = consumerUnitsData.filter(
          ({ pendingEnergyBillsNumber, isCurrentEnergyBillFilled, isActive }) => (pendingEnergyBillsNumber > 0 || isCurrentEnergyBillFilled === false) && isActive === true
        );
        filteredConsumerUnits.push(...pendingConsumerUnits);
        break;
    }

    return filteredConsumerUnits;
  }, [activeFilter, consumerUnitsData]);

  useEffect(() => {
    const activeConsumerUnitId = consumerUnits.at(0)?.id ?? null;

    dispatch(setActiveConsumerUnitId(activeConsumerUnitId));
  }, [consumerUnits, dispatch]);

  const handleInsertConsumeUnit = useCallback(() => {
    dispatch(setIsConsumerUnitCreateFormOpen(true));
  }, [dispatch]);

  return (!isFetching && (consumerUnitsData && consumerUnitsData.length <= 0)) ? (
    <Box display={consumerUnitsData.length <= 0 ? 'flex' : 'none'} justifyContent="center" alignItems="center" height="100%">
      <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center">
        <FlagRoundedIcon color="primary" sx={{ width: "75px", height: "85px" }} />

        <Typography variant="h1" fontSize="48px" color="primary" lineHeight="60px" marginBottom="32px" fontWeight="regular">
          Olá, boas-vindas ao MEPA
        </Typography>

        <Typography variant="h2" fontSize="20px" color="rgba(0, 0, 0, 0.87)" lineHeight="32px" fontWeight="600" marginBottom="16px">
          Para começar, crie a 1ª unidade consumidora
        </Typography>

        <Button
          variant="contained"
          startIcon={<AddRoundedIcon />}
          onClick={handleInsertConsumeUnit}
        >
          Unidade Consumidora
        </Button>
      </Box>
    </Box>
  ) : (
    <Grid display={consumerUnitsData && consumerUnitsData.length <= 0 ? 'none' : 'flex'} container spacing={5} py={3}>
      {distributors?.map((card) => (
        <Grid
          key={card.id}
          item
          xs={12}
          sm={6}
          md={4}
          lg={3}
          display="flex"
          justifyContent="center"
        >
          <DistributorCard
            id={card.id}
            name={card.name}
            isActive={card.isActive}
            consumerUnitsCount={card.consumerUnitsCount}
            pendingTariffsCount={card.pendingTariffsCount}
          />
        </Grid>
      ))}

      {consumerUnits?.map((card) => (
        <Grid
          key={card.id}
          item
          xs={12}
          sm={6}
          md={4}
          lg={3}
          display="flex"
          justifyContent="center"
        >
          <ConsumerUnitCard
            isActive={card.isActive}
            isFavorite={card.isFavorite}
            id={card.id}
            pendingEnergyBillsNumber={card.pendingEnergyBillsNumber}
            isCurrentEnergyBillFilled={card.isCurrentEnergyBillFilled}
            name={card.name}
          />
        </Grid>
      ))}
    </Grid>
  );
};

export default DashboardCardGrid;
