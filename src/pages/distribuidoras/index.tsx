import { useEffect } from "react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { useSelector } from "react-redux";
import { skipToken } from "@reduxjs/toolkit/dist/query";

import { Box, CircularProgress } from "@mui/material";

import { selectActiveDistributorId } from "@/store/appSlice";
import { useFetchDistributorsQuery } from "@/api";
import DefaultTemplateV2 from "@/templates/DefaultV2";

const DistributorLoadingPage: NextPage = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const activeDistributorId = useSelector(selectActiveDistributorId);

  if (activeDistributorId) {
    router.push(`/distribuidoras/${activeDistributorId}`);
  }

  if (session && session.user.universityId === undefined) {
    router.push("/instituicoes");
  }

  const { data: distributors } = useFetchDistributorsQuery(
    session?.user.universityId ?? skipToken
  );

  useEffect(() => {
    router.push(`/distribuidoras/${
      distributors && distributors!.length > 0? 
      distributors[0].id : -1
    }`);
  }, [distributors, router]);

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
