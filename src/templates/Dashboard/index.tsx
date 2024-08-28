import { useMemo } from "react";
import Head from "next/head";
import { getHeadTitle } from "@/utils/head";
import DashboardFilterButtons from "@/templates/Dashboard/FilterButtons";
import DashboardCardGrid from "@/templates/Dashboard/Grid";
import DefaultTemplateV2 from "@/templates/DefaultV2";
import CreateEditEnergyBillForm from "@/components/ElectricityBill/Form/CreateEditElectricityBillForm";
import SuccessNotification from "@/components/Notification/SuccessNotification";
import FailNotification from "@/components/Notification/FailNotification";
import { useSession } from "next-auth/react";
import { useFetchConsumerUnitsQuery } from "@/api";
import { skipToken } from "@reduxjs/toolkit/query";
import ConsumerUnitCreateForm from "@/components/ConsumerUnit/Form/Create";

const DashboardTemplate = () => {
  const headTitle = useMemo(() => getHeadTitle("Painel"), []);

  const { data: session } = useSession();
  const { data: consumerUnitsData } = useFetchConsumerUnitsQuery(
    session?.user.universityId ?? skipToken
  );

  return (
    <DefaultTemplateV2
      headerAction={(consumerUnitsData && (consumerUnitsData?.length > 0)) && <DashboardFilterButtons />}
      contentContainerMaxWidth="xl"
    >
      <Head>
        <title>{headTitle}</title>
      </Head>

      <DashboardCardGrid />
      <CreateEditEnergyBillForm />
      <ConsumerUnitCreateForm />
      <SuccessNotification />
      <FailNotification />
    </DefaultTemplateV2>
  );
};

export default DashboardTemplate;
