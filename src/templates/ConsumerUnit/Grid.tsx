import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { skipToken } from "@reduxjs/toolkit/dist/query";
import { useSession } from "next-auth/react";
import { Box } from "@mui/material";
import { useFetchConsumerUnitsQuery } from "@/api";
import { selectConsumerUnitActiveFilter } from "@/store/appSlice";
import ConsumerUnitsFilterButtons from "@/templates/ConsumerUnit/FilterButtons";
import ConsumerUnitCard from "@/components/ConsumerUnit/Card";
import { useMemo } from "react";

const ConsumerUnitsCardGrid = () => {
  const {
    query: { id },
  } = useRouter();

  const activeFilter = useSelector(selectConsumerUnitActiveFilter);
  const { data: session } = useSession();
  const { data: consumerUnitsData } = useFetchConsumerUnitsQuery(
    session?.user.universityId ?? skipToken
  );

  const consumerUnits = useMemo(() => {
    if (!consumerUnitsData) {
      return [];
    }

    const filteredConsumerUnits = [];

    switch (activeFilter) {
      case "all":
        filteredConsumerUnits.push(...consumerUnitsData);
        break;

      case "pending":
        const pendingConsumerUnits = consumerUnitsData.filter(
          ({ pendingEnergyBillsNumber, isCurrentEnergyBillFilled, isActive }) =>
            (pendingEnergyBillsNumber > 0 ||
              isCurrentEnergyBillFilled === false) &&
            isActive === true
        );
        filteredConsumerUnits.push(...pendingConsumerUnits);
        break;
    }

    return filteredConsumerUnits;
  }, [activeFilter, consumerUnitsData]);

  return (
    <Box
      height="100%"
      minWidth="246px"
      maxWidth="246px"
      borderRight="1px solid rgba(0, 0, 0, 0.12)"
      display="flex"
      flexDirection="column"
      position="relative"
      overflow="scroll"
    >
      <Box
        sx={{ backgroundColor: "background.default" }}
        position="sticky"
        px={2}
        pb={2}
        top={0}
        right={0}
        left={0}
        zIndex={1}
      >
        <ConsumerUnitsFilterButtons />
      </Box>

      {consumerUnits?.map((card) => (
        <Box px={2} pb={2} key={card.id}>
          <ConsumerUnitCard
            dense
            id={card.id}
            selected={parseInt(id as string, 10) === card.id}
            isActive={card.isActive}
            isFavorite={card.isActive && card.isFavorite}
            pendingEnergyBillsNumber={card.pendingEnergyBillsNumber}
            isCurrentEnergyBillFilled={card.isCurrentEnergyBillFilled}
            name={card.name}
          />
        </Box>
      ))}
    </Box>
  );
};

export default ConsumerUnitsCardGrid;
