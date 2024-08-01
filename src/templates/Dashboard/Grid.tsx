import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Grid } from "@mui/material";
import {
  selectDashboardActiveFilter,
  setActiveConsumerUnitId,
} from "@/store/appSlice";
import DistributorCard from "@/components//Distributor/DistributorCard";
import ConsumerUnitCard from "@/components/ConsumerUnit/CardV2";
import { useFetchConsumerUnitsQuery, useFetchPendingDistributorsQuery } from "@/api";
import { useSession } from "next-auth/react";
import { skipToken } from "@reduxjs/toolkit/dist/query";

const DashboardCardGrid = () => {
  const dispatch = useDispatch();
  const { data: session } = useSession();

  const { data: distributors } = useFetchPendingDistributorsQuery(
    session?.user.universityId ?? skipToken
  );

  const { data: consumerUnitsData } = useFetchConsumerUnitsQuery(
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

  return (
    <Grid container spacing={3} py={3} style={{ display: 'flex', flexWrap: 'wrap' }}>
      {distributors?.map((card) => (
        <Grid
          key={card.id}
          item
          xs={12}
          sm={6}
          md={4}
          lg={2.4}
          xl={2.4}
          style={{ display: 'flex', justifyContent: 'center', flex: '1 1 calc(20% - 24px)', maxWidth: 'calc(20% - 24px)' }}
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
          lg={2.4}
          xl={2.4}
          style={{ display: 'flex', justifyContent: 'center', flex: '1 1 calc(20% - 24px)', maxWidth: 'calc(20% - 24px)' }}
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
