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
  console.log(invoices);

  const invoicesFilters = useMemo(() => {
    if (!invoices || !consumerUnit) {
      return [];
    }

    return Object.keys(invoices)
      .filter((year) => {
        const hasValidInvoice = invoices[year].some(
          (invoice) => invoice.energyBill !== null
        );
        return consumerUnit.isActive || hasValidInvoice;
      })
      .reverse();
  }, [invoices, consumerUnit]);

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
      <Box display="flex" alignItems="flex-start" px={2} py={1.5}>
        <Typography variant="caption" mt={0.5}>
          Mostrar:
        </Typography>

        <Box display="flex" flexWrap="wrap" rowGap={2}>
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
          {consumerUnit.isActive ? (
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
          ) : (
            ""
          )}

          {invoicesFilters.map((year) => (
            <Box ml={2} key={year}>
              <Button
                sx={{ borderRadius: 10 }}
                size="small"
                disableElevation
                variant={
                  invoiceActiveFilter === year ? "contained" : "outlined"
                }
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
      </Box>
    </Paper>
  );
};

export default ConsumerUnitInvoiceContentFilter;
