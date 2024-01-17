import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { skipToken } from "@reduxjs/toolkit/dist/query";
import { useSession } from "next-auth/react";
import { Box } from "@mui/material";
import { useFetchConsumerUnitsQuery } from "@/api";
import { selectConsumerUnitActiveFilter } from "@/store/appSlice";
import { ConsumerUnitsPayload } from "@/types/consumerUnit";
import ConsumerUnitsFilterButtons from "@/templates/ConsumerUnit/FilterButtons";
import ConsumerUnitCard from "@/components/ConsumerUnit/CardV2";

const ConsumerUnitsCardGrid = () => {
  const {
    query: { id },
  } = useRouter();

  const { data: session } = useSession();
  const { data: consumerUnitsData, refetch } = useFetchConsumerUnitsQuery(
    session?.user.universityId ?? skipToken
  );

  const activeFilter = useSelector(selectConsumerUnitActiveFilter);

  const [consumerUnits, setConsumerUnits] = useState<ConsumerUnitsPayload>([]);

  useEffect(() => {
    if (!consumerUnitsData) {
      return;
    }

    const filteredConsumerUnits = [];

    switch (activeFilter) {
      case "all":
        filteredConsumerUnits.push(...consumerUnitsData);
        break;

      case "pending":
        const pendingConsumerUnits = consumerUnitsData.filter(
          ({ pendingEnergyBillsNumber }) => pendingEnergyBillsNumber > 0
        );
        filteredConsumerUnits.push(...pendingConsumerUnits);
        break;
    }

    const sortedConsumerUnits = filteredConsumerUnits
      .sort(({ isFavorite }) => (isFavorite ? -1 : 1)) // favorites first
      .sort(({ isActive }) => (isActive ? -1 : 1)); // disabled last

    setConsumerUnits(sortedConsumerUnits);
    refetch()
  })

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
            isFavorite={card.isFavorite}
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
