import { ReactNode, useMemo } from "react";
import { useSelector } from "react-redux";
import Head from "next/head";

import { Alert, AlertTitle, Box } from "@mui/material";

import {
  selectActiveConsumerUnitId,
  selectConsumerUnitOpenedTab,
} from "@/store/appSlice";
import { ConsumerUnitTab } from "@/types/app";

import ConsumerUnitInvoiceContent from "@/templates/ConsumerUnit/Content/Invoice";
import ConsumerUnitContractContent from "@/templates/ConsumerUnit/Content/Contract";
import { AnalysisAndRecommendation } from "@/components/ConsumerUnit/Content/AnalysisAndRecommendation";
import { useSession } from "next-auth/react";
import { useFetchConsumerUnitsQuery } from "@/api";
import { skipToken } from "@reduxjs/toolkit/query";

import { getHeadTitle } from "@/utils/head";
interface TabPanelProps {
  children?: ReactNode;
  dir?: string;
  index: number;
  value: number;
}

const TabPanel = ({ children, value, index, ...other }: TabPanelProps) => (
  <div
    role="tabpanel"
    hidden={value !== index}
    id={`full-width-tabpanel-${index}`}
    aria-labelledby={`full-width-tab-${index}`}
    {...other}
  >
    {value === index && <Box pt={3}>{children}</Box>}
  </div>
);

export const EmptyConsumerUnitContent = () => {
  return (
    <Box
      height="40vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      <h2 style={{ color: "#0A5C67" }}>Não existem UCs cadastradas</h2>
    </Box>
  );
};

const ConsumerUnitContent = () => {
  const openedTab = useSelector(selectConsumerUnitOpenedTab);
  const { data: session } = useSession();
  const {
    data: consumerUnitsData,
    isLoading: isConsumerUnitsLoading,
    data,
  } = useFetchConsumerUnitsQuery(session?.user.universityId ?? skipToken);
  const activeConsumerUnit = useSelector(selectActiveConsumerUnitId);

  const activeConsumerUnitData = consumerUnitsData?.find(
    (consumerUnit) => consumerUnit?.id === activeConsumerUnit
  );

  const headTitle = useMemo(() => getHeadTitle("Unidades Consumidoras"), []);

  if (isConsumerUnitsLoading || !data) {
    return <Box pt={2}>Carregando...</Box>;
  }

  if (!activeConsumerUnitData) {
    return (
      <Box marginRight={3}>
        <Head>
          <title>{headTitle}</title>
        </Head>
        <Alert
          sx={{ ml: 4, width: 1, mt: 2 }}
          severity="error"
          variant="filled"
        >
          <AlertTitle>Unidade consumidora não encontrada</AlertTitle>
          Selecione outra unidade consumidora na lista ao lado
        </Alert>
      </Box>
    );
  }

  const contractTabIndex = activeConsumerUnitData.isActive
    ? ConsumerUnitTab.CONTRACT
    : ConsumerUnitTab.ANALYSIS;
  return (
    <Box marginRight={3}>
      <Head>
        <title>{headTitle}</title>
      </Head>

      <TabPanel value={openedTab} index={ConsumerUnitTab.INVOICE}>
        <ConsumerUnitInvoiceContent />
      </TabPanel>
      {activeConsumerUnitData.isActive && (
        <TabPanel value={openedTab} index={ConsumerUnitTab.ANALYSIS}>
          <AnalysisAndRecommendation />
        </TabPanel>
      )}
      <TabPanel value={openedTab} index={contractTabIndex}>
        <ConsumerUnitContractContent />
      </TabPanel>
    </Box>
  );
};

export default ConsumerUnitContent;
