import { NextPage } from "next";
import { NextParsedUrlQuery } from "next/dist/server/request-meta";

import { wrapper } from "@/store";
import { setActiveDistributorId } from "@/store/appSlice";
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
  return (
    <DefaultTemplateV2
      secondaryDrawer={<DistributorsCardGrid />}
      headerAction={<DistributorHeaderAction />}
      contentHeader={<DistributorContentHeader />}
    >
      <DistributorContent />
      <DistributorCreateForm />
      <DistributorEditForm />
      <TariffCreateEditForm />
      <SuccessNotification />
      <FailNotification />
    </DefaultTemplateV2>
  );
};

export default DistributorPage;
