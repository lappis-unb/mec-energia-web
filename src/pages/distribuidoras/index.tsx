import { NextPage } from "next";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { skipToken } from "@reduxjs/toolkit/dist/query";

import { Box, CircularProgress } from "@mui/material";

import { useFetchDistributorsQuery } from "@/api";
import DefaultTemplateV2 from "@/templates/DefaultV2";

const DistributorLoadingPage: NextPage = () => {
  const router = useRouter();
  const { data: session } = useSession();

  if (session && session.user.universityId === undefined) {
    router.push("/instituicoes");
  }

  const { data: distributors } = useFetchDistributorsQuery(
    session?.user.universityId ?? skipToken
  );

  if (distributors) {
    router.push(`/distribuidoras/${distributors!.length > 0 ?
      distributors[0].id : -1
      }`);
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

export default DistributorLoadingPage;
