import { NextPage } from "next";
import { NextParsedUrlQuery } from "next/dist/server/request-meta";

import { wrapper } from "@/store";
import { setActiveConsumerUnitId } from "@/store/appSlice";

import DefaultTemplateV2 from "@/templates/DefaultV2";
import ConsumerUnitsCardGrid from "@/templates/ConsumerUnit/Grid";
import ConsumerUnitHeaderAction from "@/templates/ConsumerUnit/HeaderAction";
import ConsumerUnitContent from "@/templates/ConsumerUnit/Content";
import ConsumerUnitCreateForm from "@/components/ConsumerUnit/Form/Create";
import ConsumerUnitEditForm from "@/components/ConsumerUnit/Form/Edit";
import ConsumerUnitRenewContractForm from "@/components/ConsumerUnit/Form/RenewContract";
import SuccessNotification from "@/components/Notification/SuccessNotification";
import FailNotification from "@/components/Notification/FailNotification";
import CreateEditEnergyBillForm from "@/components/ElectricityBill/Form/CreateEditElectricityBillForm";
import ConsumerUnitContentHeader from "@/templates/ConsumerUnit/Content/Header";

type ExpectedQuery = {
  id: string;
};

function isValidQuery(query: NextParsedUrlQuery): query is ExpectedQuery {
  return typeof query.id === "string" && query.id.indexOf(" ") < 0;
}

export const getServerSideProps = wrapper.getServerSideProps(
  (store) =>
    async ({ query }) => {
      if (!isValidQuery(query)) {
        return {
          notFound: true,
        };
      }

      const consumerUnitId = Number(query.id);

      if (!consumerUnitId || isNaN(consumerUnitId)) {
        return {
          notFound: true,
        };
      }

      store.dispatch(setActiveConsumerUnitId(consumerUnitId));

      return {
        props: {},
      };
    }
);

const ConsumerUnitPage: NextPage = () => {
  return (
    <DefaultTemplateV2
      headerAction={<ConsumerUnitHeaderAction />}
      secondaryDrawer={<ConsumerUnitsCardGrid />}
      contentHeader={<ConsumerUnitContentHeader />}
    >
      <ConsumerUnitContent />

      <ConsumerUnitCreateForm />
      <ConsumerUnitEditForm />
      <ConsumerUnitRenewContractForm />
      <SuccessNotification />
      <FailNotification />
      <CreateEditEnergyBillForm />
    </DefaultTemplateV2>
  );
};

export default ConsumerUnitPage;
