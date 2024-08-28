import { useMemo } from "react";
import { useSelector } from "react-redux";
import { skipToken } from "@reduxjs/toolkit/dist/query";

import { Box, Typography, Link } from "@mui/material";

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
      <Box display="flex" flexDirection="column" gap={2}>
        <Typography variant="h5">Unidades consumidoras</Typography>

        {(consumerUnits.length <= 0) ? (<Typography 
          variant="caption" 
          fontSize="14px" 
          color="text.secondary" 
          lineHeight="20px"
          letterSpacing="0.15px">
          Nenhuma unidade consumidora associada
        </Typography>) : (
          <ul>
            {consumerUnits.map(({ id, name }) => (
              <li key={id}>
                <Link href={`/uc/${id}`} color="primary" underline="always">
                  {name}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Box>

      
    </>
  );
};

export default DistributorContentConsumerUnitsList;
