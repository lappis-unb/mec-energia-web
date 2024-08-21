import { NextPage } from "next";
import { NextParsedUrlQuery } from "next/dist/server/request-meta";

import { wrapper } from "@/store";
import { selectActiveDistributorId, setActiveDistributorId } from "@/store/appSlice";
import DefaultTemplateV2 from "@/templates/DefaultV2";
import DistributorsCardGrid from "@/templates/Distributor/Grid";
import DistributorContentHeader from "@/templates/Distributor/Header";
import DistributorContent from "@/templates/Distributor/Content";
import DistributorHeaderAction from "@/templates/Distributor/Header/Action";
import DistributorCreateForm from "@/components/Distributor/Form/DistributorCreateForm";
import DistributorEditForm from "@/components/Distributor/Form/DistributorEditForm";
import TariffCreateEditForm from "@/components/Tariff/Form/TariffCreateForm";
import FailNotification from "@/components/Notification/FailNotification";
import SuccessNotification from "@/components/Notification/SuccessNotification";
import { useSelector } from "react-redux";
import { useSession } from "next-auth/react";
import { useFetchDistributorsQuery } from "@/api";
import { skipToken } from "@reduxjs/toolkit/query";
import { useRouter } from "next/router";
import { CircularProgress, Box } from "@mui/material";

type ExpectedQuery = {
  distributorId: string;
};

function isValidQuery(query: NextParsedUrlQuery): query is ExpectedQuery {
  return (
    typeof query.distributorId === "string" &&
    query.distributorId.indexOf(" ") < 0
  );
}

export const getServerSideProps = wrapper.getServerSideProps(
  (store) =>
    async ({ query }) => {
      if (!isValidQuery(query)) {
        return {
          notFound: true,
        };
      }

      const distributorId = Number(query.distributorId);

      if (!distributorId || isNaN(distributorId)) {
        return {
          notFound: true,
        };
      }

      store.dispatch(setActiveDistributorId(distributorId));

      return {
        props: {},
      };
    }
);

const DistributorPage: NextPage = () => {
  const activeDistributorUnit = useSelector(selectActiveDistributorId);

  const { data: session, status } = useSession();
  const router = useRouter();

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

  const { data: distributors } = useFetchDistributorsQuery(
    session?.user.universityId ?? skipToken
  );

  const activeDistributorData = distributors?.find(
    distributor => distributor?.id === activeDistributorUnit
  );

  const contentContainerMaxWidth = activeDistributorData === undefined
  ? false
  : undefined;
  return (
    <DefaultTemplateV2
      headerAction={<DistributorHeaderAction />}
      secondaryDrawer={<DistributorsCardGrid />}
      contentHeader={<DistributorContentHeader />}
      contentContainerMaxWidth={contentContainerMaxWidth}
    >
      {<DistributorContent />}

      <DistributorCreateForm />
      <DistributorEditForm />
      <TariffCreateEditForm />
      <SuccessNotification />
      <FailNotification />
    </DefaultTemplateV2>
  );
};

export default DistributorPage;
