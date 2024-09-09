import { useCallback, useMemo } from "react";
import { useSelector } from "react-redux";
import { skipToken } from "@reduxjs/toolkit/dist/query";
import { useSession } from "next-auth/react";
import { Box } from "@mui/material";
import { selectActiveDistributorId } from "@/store/appSlice";
import DistributorCard from "./Card";
import { useFetchDistributorsQuery } from "@/api";

const DistributorsCardGrid = () => {
  const { data: session } = useSession();
  const distributorId = useSelector(selectActiveDistributorId);
  const { data: distributors } = useFetchDistributorsQuery(
    session?.user.universityId ?? skipToken
  );

  const isSelectedCard = useCallback(
    (cardId: number) => cardId === distributorId,
    [distributorId]
  );

  const distributorsInAlphabeticOrder = useMemo(() => {
    if (!distributors) {
      return [];
    }

    return [...distributors]?.sort((a, b) =>
      (a.name || '').localeCompare(b.name || ''));
  }, [distributors]);

  return (
    <Box
      height="100%"
      minWidth="246px"
      maxWidth="246px"
      borderRight="1px solid rgba(0, 0, 0, 0.12)"
      display="flex"
      flexDirection="column"
      overflow="scroll"
    >
      {distributorsInAlphabeticOrder.map((card) => (
        <Box px={2} pb={2} key={card.id}>
          <DistributorCard
            id={card.id}
            name={card.name}
            isActive={card.isActive}
            consumerUnitsCount={card.consumerUnitsCount}
            pendingTariffsCount={card.pendingTariffsCount}
            selected={isSelectedCard(card.id)}
            dense
          />
        </Box>
      ))}
    </Box>
  );
};

export default DistributorsCardGrid;
