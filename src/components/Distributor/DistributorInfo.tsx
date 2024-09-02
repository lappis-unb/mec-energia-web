import * as React from "react";
import { useState, useEffect, useCallback } from "react";
import { Badge, Box, Button, Divider, Typography } from "@mui/material";
import {
  DistributorConsumerUnits,
  DistributorPropsTariffs,
} from "../../types/distributor";
import { useRouter } from "next/router";
import EditIcon from "@mui/icons-material/Edit";
import Link from "next/link";
import { Link as MUILink, IconButton } from "@mui/material";
import { TariffTable } from "../Tariff/TariffTable";
import { mockedDistributor } from "../../mocks/mockedDistributor";
import { mockedDistributorComsumerUnit } from "../../mocks/mockedDistributor";
import {
  selectActiveDistributorId,
  selectActiveSubgroup,
  setIsTariffCreateFormOpen,
  setIsTariffEdiFormOpen,
} from "../../store/appSlice";
import { useDispatch, useSelector } from "react-redux";
import { useGetTariffQuery } from "@/api";

export const DistributorInfo = () => {
  const router = useRouter();

  const [currentDist, setCurrentDist] = useState<DistributorPropsTariffs>(
    mockedDistributor[0]
  );
  const [currentConsumerUnitList, setCurrentConsumerUnitList] =
    useState<DistributorConsumerUnits>();
  const [titleTariffs, setTitleTariffs] = useState("Tarifas");
  const [isOverdue, setIsOverdue] = useState(false);
  const [isPendingTariffAddition, setIsPendingTariffAddition] = useState(false);
  const dispatch = useDispatch();
  const activeDistributorId = useSelector(selectActiveDistributorId);
  const activeSubgroup = useSelector(selectActiveSubgroup);
  const { data: currentTariff } = useGetTariffQuery({
    distributor: activeDistributorId || 0,
    subgroup: activeSubgroup || "",
  });

  const createTitleTariffs = useCallback(() => {
    if (currentDist?.tariffs.length === 0) {
      setTitleTariffs("");
      console.error("Nenhuma tarifa encontrada.");
    } else if (currentDist?.tariffs.length === 1) {
      if (currentTariff) {
        if (isOverdue) {
          setTitleTariffs(
            `Tarifas do subgrupo ${currentTariff.subgroup} pendentes`
          );
          console.error("Tarifas pendentes encontradas.");
        } else {
          setTitleTariffs(`Tarifas do subgrupo ${currentTariff.subgroup}`);
        }
      } else {
        console.error("Tarifa atual não encontrada.");
      }
    } else if (currentDist?.tariffs.length > 1) {
      if (!isOverdue) {
        setTitleTariffs("Tarifas");
      } else {
        setTitleTariffs("Tarifas com atualização pendente");
        console.error("Atualizações de tarifas pendentes encontradas.");
      }
    }
  }, [currentDist?.tariffs.length, currentTariff, isOverdue]);

  useEffect(() => {
    const { id } = router.query;
    setCurrentDist(mockedDistributor[Number(id) - 1]);
    setCurrentConsumerUnitList(mockedDistributorComsumerUnit[Number(id) - 1]);

    const overdue = currentTariff?.overdue;
    if (overdue !== undefined) setIsOverdue(overdue);
    const hasConsumerUnit =
      mockedDistributor[Number(id) - 1]?.consumerUnits > 0 ? true : false;
    const needAddTariff = mockedDistributor[Number(id) - 1]?.tariffs.find(
      (tariff) =>
        tariff.startDate === "" && tariff.endDate === "" && hasConsumerUnit
    );
    if (needAddTariff === undefined) {
      setIsPendingTariffAddition(false);
    } else {
      setIsPendingTariffAddition(true);
      console.error("Tarifa pendente de adição encontrada.");
    }

    createTitleTariffs();
  }, [createTitleTariffs, currentTariff?.overdue, router.query]);

  useEffect(() => {
    createTitleTariffs();
  }, [createTitleTariffs, currentDist]);

  useEffect(() => {
    const { id } = router.query;
    setCurrentDist(mockedDistributor[Number(id) - 1]);
    setCurrentConsumerUnitList(mockedDistributorComsumerUnit[Number(id) - 1]);
  }, [router.asPath, router.query]);

  const handleEditTariffClick = () => {
    dispatch(setIsTariffEdiFormOpen(true));
  };

  const handleCreateTariffClick = () => {
    dispatch(setIsTariffCreateFormOpen(true));
  };

  return (
    <Box display={"flex"} justifyContent="space-between" width={"100%"} mt={3}>
      <Box
        flex={7}
        mr={5}
        display={
          currentDist?.consumerUnits === 0 || !currentDist?.isActive
            ? "none"
            : ""
        }
      >
        <Box
          display={"flex"}
          justifyContent={"space-between"}
          alignItems={"center"}
        >
          <Typography variant="h5">{titleTariffs}</Typography>
          {!isPendingTariffAddition && (
            <IconButton onClick={handleEditTariffClick} style={{ color: '#000000DE' }}>
              <EditIcon />
            </IconButton>
          )}
        </Box>
        <Divider />
        {!isPendingTariffAddition && currentDist?.tariffs.length > 0 && (
          <TariffTable />
        )}
        {isPendingTariffAddition && (
          <Box
            width={"30%"}
            display="flex"
            justifyContent={"space-between"}
            alignItems={"center"}
            mt={2}
          >
            <Badge badgeContent={"!"} color="secondary"></Badge>
            <Button
              variant="outlined"
              size="small"
              onClick={handleCreateTariffClick}
            >
              Adicionar Tarifas
            </Button>
          </Box>
        )}
      </Box>
      <Box flex={4}>
        <Typography variant="h5">
          Unidades Consumidoras
          <Divider />
          {currentDist?.consumerUnits === 0 ? (
            <Box>
              <Box ml={3} mt={2} mb={3}>
                <Typography>Nenhuma</Typography>
              </Box>
              <Typography>
                <Box sx={{ color: "text.secondary" }}>
                  Para ver Tarifas, selecione esta distribuidora no contrato com
                  uma Unidade Consumidora.
                </Box>
              </Typography>
            </Box>
          ) : (
            currentConsumerUnitList?.subgroups[0].consumer_units?.map(
              (consumer_unit) => {
                return (
                  <ul key={consumer_unit.id}>
                    <li>
                      <Typography>
                        <Link href={`/uc/${consumer_unit.id}`}>
                          <MUILink sx={{ cursor: "pointer" }} color="inherit">
                            {consumer_unit.name}
                          </MUILink>
                        </Link>
                      </Typography>
                    </li>
                  </ul>
                );
              }
            )
          )}
          {!currentDist?.isActive && (
            <Box sx={{ color: "text.secondary" }}>
              <Typography>
                Apenas distribuidoras ativas exibem informações de tarifa.
              </Typography>
            </Box>
          )}
        </Typography>
      </Box>
    </Box>
  );
};
