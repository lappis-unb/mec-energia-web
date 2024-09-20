import React, { Fragment, SyntheticEvent, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { skipToken } from "@reduxjs/toolkit/dist/query";

import { Divider, Tab, Tabs } from "@mui/material";
import WarningRoundedIcon from "@mui/icons-material/WarningRounded";

import { useGetDistributorSubgroupsQuery } from "@/api";
import {
  selectActiveDistributorId,
  selectActiveSubgroup,
  setActiveSubgroup,
} from "@/store/appSlice";

const getTabLabel = (subgroup: string) => {
  return `Subgrupo ${subgroup}`;
};

const ORDER = ["AS", "A4", "A3", "A3a", "A2", "A1"];

const DistributorContentHeaderTabs: React.FC = () => {
  const dispatch = useDispatch();
  const distributorId = useSelector(selectActiveDistributorId);
  const selectedTariffSubgroup = useSelector(selectActiveSubgroup);

  const { data: tariffsSubgroups } = useGetDistributorSubgroupsQuery(
    distributorId ?? skipToken
  );

  // Ordenar os subgrupos de acordo com a ordem especificada
  const sortedTariffsSubgroups = useMemo(() => {
    if (!tariffsSubgroups) return [];
    const orderMap = ORDER.reduce<{ [key: string]: number }>(
      (acc, key, index) => {
        acc[key] = index;
        return acc;
      },
      {}
    );

    return [...tariffsSubgroups].sort((a, b) => {
      return (
        (orderMap[a.subgroup] ?? Infinity) - (orderMap[b.subgroup] ?? Infinity)
      );
    });
  }, [tariffsSubgroups]);

  const selectedTabIndex = useMemo(() => {
    if (!sortedTariffsSubgroups || sortedTariffsSubgroups.length === 0) {
      return false;
    }

    const selectedTariffSubgroupIndex = sortedTariffsSubgroups.findIndex(
      ({ subgroup }) => subgroup === selectedTariffSubgroup
    );

    return selectedTariffSubgroupIndex >= 0 ? selectedTariffSubgroupIndex : 0;
  }, [selectedTariffSubgroup, sortedTariffsSubgroups]);

  const handleTabChange = useCallback(
    (_event: SyntheticEvent, tabIndex: number) => {
      const selectedSubgroup =
        sortedTariffsSubgroups?.[tabIndex].subgroup ?? null;
      dispatch(setActiveSubgroup(selectedSubgroup));
    },
    [sortedTariffsSubgroups, dispatch]
  );

  return (
    <Fragment>
      <Tabs
        value={selectedTabIndex}
        variant="fullWidth"
        onChange={handleTabChange}
      >
        {sortedTariffsSubgroups?.map(({ subgroup, pending }) => (
          <Tab
            key={subgroup}
            label={getTabLabel(subgroup)}
            iconPosition="start"
            {...(pending && {
              icon: <WarningRoundedIcon color="warning" />,
            })}
          />
        ))}
      </Tabs>

      <Divider />
    </Fragment>
  );
};

export default DistributorContentHeaderTabs;
