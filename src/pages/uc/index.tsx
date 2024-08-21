import { NextPage } from "next";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { skipToken } from "@reduxjs/toolkit/dist/query";

import { Box, CircularProgress } from "@mui/material";

import { useFetchConsumerUnitsQuery } from "@/api";
import DefaultTemplateV2 from "@/templates/DefaultV2";

const ConsumerUnitLoadingPage: NextPage = () => {
  const router = useRouter();
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (status === "unauthenticated") {
    router.push("/");
    return null;
  }

  if (session && session.user.universityId === undefined) {
    router.push("/instituicoes");
  }

  const { data: consumerUnits } = useFetchConsumerUnitsQuery(
    session?.user.universityId ?? skipToken
  );

  if (consumerUnits) {
    router.push(`/uc/${consumerUnits!.length > 0 ? consumerUnits[0].id : -1}`);
  }

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
