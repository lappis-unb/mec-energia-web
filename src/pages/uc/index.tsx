import { useEffect } from "react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { useSelector } from "react-redux";
import { skipToken } from "@reduxjs/toolkit/dist/query";

import { Box, CircularProgress } from "@mui/material";

import { selectActiveConsumerUnitId } from "@/store/appSlice";
import { useFetchConsumerUnitsQuery } from "@/api";
import DefaultTemplateV2 from "@/templates/DefaultV2";

const ConsumerUnitLoadingPage: NextPage = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const activeConsumerUnitId = useSelector(selectActiveConsumerUnitId);

  if (activeConsumerUnitId) {
    router.push(`/uc/${activeConsumerUnitId}`);
  }

  if (session && session.user.universityId === undefined) {
    router.push("/instituicoes");
  }

  const { data: consumerUnits } = useFetchConsumerUnitsQuery(
    session?.user.universityId ?? skipToken
  );

  useEffect(() => {
    router.push(`/uc/${consumerUnits && consumerUnits!.length > 0 ? consumerUnits[0].id : -1}`);
  }, [consumerUnits, router]);

  return (
    <DefaultTemplateV2>
      <Box
        height="100%"
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <CircularProgress />
      </Box>
    </DefaultTemplateV2>
  );
};

export default ConsumerUnitLoadingPage;
