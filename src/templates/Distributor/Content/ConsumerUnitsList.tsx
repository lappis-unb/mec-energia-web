import { useMemo } from "react";
import Link from "next/link";
import { useSelector } from "react-redux";
import { skipToken } from "@reduxjs/toolkit/dist/query";

import { Typography } from "@mui/material";

import { useGetDistributorSubgroupsQuery } from "@/api";
import {
  selectActiveDistributorId,
  selectActiveSubgroup,
} from "@/store/appSlice";

const DistributorContentConsumerUnitsList = () => {
  const distributorId = useSelector(selectActiveDistributorId);
  const selectedSubgroupTariff = useSelector(selectActiveSubgroup);

  const { data: tariffsSubgroups, isLoading } = useGetDistributorSubgroupsQuery(
    distributorId ?? skipToken,
    {
      refetchOnMountOrArgChange: true,
    }
  );

  const consumerUnits = useMemo(() => {
    if (!tariffsSubgroups) {
      return [];
    }

    const tariffSubgroup = tariffsSubgroups.find(
      ({ subgroup }) => subgroup === selectedSubgroupTariff
    );

    if (!tariffSubgroup) {
      return [];
    }

    return tariffSubgroup.consumerUnits;
  }, [tariffsSubgroups, selectedSubgroupTariff]);

  if (isLoading) {
    return <Typography variant="body1">Carregando...</Typography>;
  }

  return (
    <>
      <Typography variant="h5">Unidades consumidoras</Typography>

      <ul>
        {consumerUnits.map(({ id, name }) => (
          <li key={id}>
            <Link href={`/uc/${id}`}>{name}</Link>
          </li>
        ))}
      </ul>
    </>
  );
};

export default DistributorContentConsumerUnitsList;
