import { useMemo, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { skipToken } from "@reduxjs/toolkit/dist/query";

import { Box, Button, Paper, Typography } from "@mui/material";
import DoneRoundedIcon from "@mui/icons-material/DoneRounded";

import { useFetchInvoicesQuery, useGetConsumerUnitQuery } from "@/api";
import {
  selectActiveConsumerUnitId,
  selectConsumerUnitInvoiceActiveFilter,
  setConsumerUnitInvoiceActiveFilter,
} from "@/store/appSlice";
import { ConsumerUnitInvoiceFilter } from "@/types/app";

const ConsumerUnitInvoiceContentFilter = () => {
  const dispatch = useDispatch();
  const consumerUnitId = useSelector(selectActiveConsumerUnitId);
  const invoiceActiveFilter = useSelector(
    selectConsumerUnitInvoiceActiveFilter
  );
  const [pendingFilterLabel, setPendingFilterLabel] = useState("Pendentes");
  const [isPendingFilterActive, setPendingFilterActive] = useState(false);

  const invoicesQuery = useFetchInvoicesQuery(consumerUnitId ?? skipToken);
  const consumerUnitQuery = useGetConsumerUnitQuery(
    consumerUnitId ?? skipToken
  );

  const invoices = invoicesQuery.data;
  const consumerUnit = consumerUnitQuery.data;

  const invoicesFilters = useMemo(() => {
    if (!invoices) {
      return [];
    }

    return Object.keys(invoices).reverse();
  }, [invoices]);

  useEffect(() => {
    const pending = consumerUnit?.pendingEnergyBillsNumber ?? -1;
    setPendingFilterActive(pending > 0);
    setPendingFilterLabel(pending < 0 ? "Pendentes" : `Pendentes (${pending})`);
  }, [consumerUnit]);

  const handleFilterButtonClick = (filter: ConsumerUnitInvoiceFilter) => () => {
    dispatch(setConsumerUnitInvoiceActiveFilter(filter));
  };

  return (
    <Paper>
      <Box display="flex" flexWrap="wrap" rowGap={2} alignItems="center" px={2} py={1.5}>
        <Typography variant="caption">Mostrar:</Typography>

        <Box ml={2}>
          <Button
            disabled={!isPendingFilterActive}
            sx={{ borderRadius: 10 }}
            size="small"
            disableElevation
            variant={
              invoiceActiveFilter === "pending" ? "contained" : "outlined"
            }
            onClick={handleFilterButtonClick("pending")}
            {...(invoiceActiveFilter === "pending" && {
              startIcon: <DoneRoundedIcon />,
            })}
          >
            {pendingFilterLabel}
          </Button>
        </Box>

        {invoicesFilters.map((year) => (
          <Box ml={2} key={year}>
            <Button
              sx={{ borderRadius: 10 }}
              size="small"
              disableElevation
              variant={invoiceActiveFilter === year ? "contained" : "outlined"}
              {...(invoiceActiveFilter === year && {
                startIcon: <DoneRoundedIcon />,
              })}
              onClick={handleFilterButtonClick(year)}
            >
              {year}
            </Button>
          </Box>
        ))}
      </Box>
    </Paper>
  );
};

export default ConsumerUnitInvoiceContentFilter;
