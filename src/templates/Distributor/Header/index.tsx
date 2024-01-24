import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { skipToken } from "@reduxjs/toolkit/dist/query";

import { Box, Button, Collapse, Container, Typography } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";

import { useGetDistributorSubgroupsQuery, useGetDistributorQuery } from "@/api";
import {
  selectActiveDistributorId,
  setActiveSubgroup,
  setIsDistributorEditFormOpen,
} from "@/store/appSlice";
import DistributorContentHeaderTabs from "./Tabs";
import DistributorEditForm from "@/components/Distributor/Form/DistributorEditForm";
import { DeleteForever } from "@mui/icons-material";
import Tooltip from "@mui/material/Tooltip";
import DeleteDistributorDialog from "@/components/Distributor/Form/DeleteDistributorDialog";

const DistributorContentHeader = () => {
  const dispatch = useDispatch();
  const distributorId = useSelector(selectActiveDistributorId);

  const { data: distributor } = useGetDistributorQuery(
    distributorId ?? skipToken
  );

  const [shouldShowCancelDialog, setShouldShowCancelDialog] = useState(false);


  const { data: tariffsSubgroups, isLoading: isTariffsSubgroupsLoading } =
    useGetDistributorSubgroupsQuery(distributorId ?? skipToken);

  useEffect(() => {
    if (!tariffsSubgroups || tariffsSubgroups.length === 0) {
      dispatch(setActiveSubgroup(null));

      return;
    }

    const firstPendingTariff = tariffsSubgroups.findIndex(
      ({ pending }) => pending
    );

    if (firstPendingTariff >= 0) {
      dispatch(
        setActiveSubgroup(tariffsSubgroups[firstPendingTariff].subgroup)
      );

      return;
    }

    dispatch(setActiveSubgroup(tariffsSubgroups[0].subgroup));
  }, [dispatch, tariffsSubgroups]);

  const shouldShowTabs = useMemo(
    () =>
      tariffsSubgroups &&
      tariffsSubgroups.length > 1 &&
      !isTariffsSubgroupsLoading,
    [tariffsSubgroups, isTariffsSubgroupsLoading]
  );

  const handleEditDistributorClick = useCallback(() => {
    dispatch(setIsDistributorEditFormOpen(true));
  }, [dispatch]);

  const handleDeleteDistributorClick = useCallback(() => {
    setShouldShowCancelDialog(true);

  }, []);

  return (
    <Box
      position="sticky"
      top={0}
      zIndex={1}
      sx={{ backgroundColor: "background.default" }}
    >
      <Container>
        <Box display="flex">
          <Box>
            <Box display="flex" alignItems="center">
              <Typography variant="h4">{distributor?.name}</Typography>

              <Box pl={2}>
                <Button
                  variant="outlined"
                  startIcon={<EditIcon />}
                  size="small"
                  onClick={handleEditDistributorClick}
                  sx={{ marginRight: 2 }}
                >
                  Editar
                </Button>



                {distributor?.consumerUnits !== 0 ? (
                  <Tooltip title="Enquanto houver uma UC com contrato associado à distribuidora, ela não pode ser apagada. Mesmo que a UC esteja inativa.">
                    <span>
                      <Button
                        variant="outlined"
                        color="error"
                        disabled
                        startIcon={<DeleteForever />}
                        size="small"
                        onClick={() => {
                          ""
                        }}
                      >
                        Deletar
                      </Button>
                    </span>
                  </Tooltip>
                ) : (
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<DeleteForever />}
                    size="small"
                    onClick={handleDeleteDistributorClick}
                  >
                    Deletar
                  </Button>
                )}

                <DistributorEditForm />
              </Box>
            </Box>
            <DeleteDistributorDialog
              open={shouldShowCancelDialog}
              onClose={() => setShouldShowCancelDialog(false)}
              onDiscard={() => setShouldShowCancelDialog(false)}
              titleText="Deseja excluir esta distribuidora?"
              confirmText="Excluir"
              cancelText="Cancelar"
              dataLossMessage="Ao excluir esta distribuidora, todos os dados relacionados a ela serão perdidos. Essa ação não poderá ser desfeita."
            ></DeleteDistributorDialog>

            <Typography>
              CNPJ: <strong>{distributor?.cnpj}</strong>
            </Typography>
          </Box>
        </Box>

        <Collapse in={shouldShowTabs}>
          <Box minHeight={24}>
            <DistributorContentHeaderTabs />
          </Box>
        </Collapse>
      </Container >
    </Box >
  );
};

export default DistributorContentHeader;
