import { ReactNode } from "react";
import { useSelector } from "react-redux";

import { Box } from "@mui/material";

import { selectConsumerUnitOpenedTab } from "@/store/appSlice";
import { ConsumerUnitTab } from "@/types/app";

import ConsumerUnitInvoiceContent from "@/templates/ConsumerUnit/Content/Invoice";
import ConsumerUnitContractContent from "@/templates/ConsumerUnit/Content/Contract";
import { AnalysisAndRecommendation } from "@/components/ConsumerUnit/Content/AnalysisAndRecommendation";

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
  return (
    <>
      <TabPanel value={openedTab} index={ConsumerUnitTab.INVOICE}>
        <ConsumerUnitInvoiceContent />
      </TabPanel>

      <TabPanel value={openedTab} index={ConsumerUnitTab.ANALYSIS}>
        <AnalysisAndRecommendation />
      </TabPanel>

      <TabPanel value={openedTab} index={ConsumerUnitTab.CONTRACT}>
        <ConsumerUnitContractContent />
      </TabPanel>
    </>
  );
};

export default ConsumerUnitContent;
