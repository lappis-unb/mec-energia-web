import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { skipToken } from "@reduxjs/toolkit/dist/query";
import { useRouter } from "next/router";

import {
  Box,
  Button,
  Collapse,
  Container,
  Grid,
  IconButton,
  Link,
  Modal,
  Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import HelpOutlineSharpIcon from "@mui/icons-material/HelpOutlineSharp";

import {
  useGetDistributorSubgroupsQuery,
  useGetDistributorQuery,
  useDeleteDistributorMutation,
  useFetchDistributorsQuery,
} from "@/api";
import {
  selectActiveDistributorId,
  setActiveSubgroup,
  setIsDistributorEditFormOpen,
  setIsErrorNotificationOpen,
  setIsSuccessNotificationOpen,
} from "@/store/appSlice";
import DistributorContentHeaderTabs from "./Tabs";
import DistributorEditForm from "@/components/Distributor/Form/DistributorEditForm";
import { Delete } from "@mui/icons-material";
import Tooltip from "@mui/material/Tooltip";
import DeleteDistributorDialog from "@/components/Distributor/Form/DeleteDistributorDialog";
import { getSession, useSession } from "next-auth/react";

const DistributorContentHeader = () => {
  const dispatch = useDispatch();
  const distributorId = useSelector(selectActiveDistributorId);
  const { data: session } = useSession();

  const { data: distributors } = useFetchDistributorsQuery(
    session?.user.universityId ?? skipToken
  );

  const activeDistributorData = distributors?.find(
    (distributor) => distributor?.id === distributorId
  );

  const router = useRouter();

  const { data: distributor } = useGetDistributorQuery(
    distributorId ?? skipToken
  );
  const [deleteDistributor] = useDeleteDistributorMutation();
  const [shouldShowCancelDialog, setShouldShowCancelDialog] = useState(false);

  const { data: tariffsSubgroups, isLoading: isTariffsSubgroupsLoading } =
    useGetDistributorSubgroupsQuery(distributorId ?? skipToken);

  const [
    isOpenModalInfoAboutSubGroupsAndTariff,
    setOpenModalInfoAboutSubGroupsAndTariff,
  ] = useState(false);

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

  const handleDeleteDistributor = useCallback(async () => {
    if (distributorId !== null) {
      try {
        await deleteDistributor(distributorId);
        dispatch(
          setIsSuccessNotificationOpen({
            isOpen: true,
            text: "Distribuidora excluída com sucesso!",
          })
        );
        setShouldShowCancelDialog(false);
        router.push("/distribuidoras");
      } catch (error) {
        dispatch(
          setIsErrorNotificationOpen({
            isOpen: true,
            text: "Erro ao excluir distribuidora.",
          })
        );
        console.error("Erro ao excluir distribuidora:", error);
      }
    } else {
      console.error("ID do distribuidor não encontrado.");
    }
  }, [dispatch, deleteDistributor, distributorId, router]);

  const ModalInfoAboutSubGroupsAndTariff = () => {
    const handleDownloadClick = async (
      event: React.MouseEvent<HTMLButtonElement>
    ) => {
      event?.preventDefault();
      try {
        const session = await getSession(); // Garanta que getSession está sendo importado corretamente.
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/download-step-by-step-pdf/`,
          {
            method: "GET",
            headers: {
              Authorization: `Token ${session?.user?.token}`, // Ajuste conforme sua configuração de autenticação.
              "Content-Type": "application/pdf",
            },
          }
        );
        if (!response.ok) throw new Error("Network response was not ok");
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute(
          "download",
          "Pegar_dados_de_tarifas_das_distribuidoras.pdf"
        ); // Adapte conforme necessário
        document.body.appendChild(link);
        link.click();
        link.parentNode?.removeChild(link);
        window.URL.revokeObjectURL(url); // Limpa a referência ao objeto criado após o download.
      } catch (error) {
        console.error("Failed to download file:", error);
      }
    };

    return (
      <Modal open={isOpenModalInfoAboutSubGroupsAndTariff}>
        <Grid
          container
          spacing={1}
          sx={{
            borderRadius: 1,
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 600,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            "@media print": {
              borderRadius: 1,
              width: 600,
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 4,
            },
          }}
        >
          <Grid item marginBottom={2}>
            <Typography variant="h6">Subgrupos e Tarifas</Typography>
          </Grid>
          <Grid item>
            <Typography variant="body1">
              Os subgrupos correspondem à tensão de fornecimento contratada para
              uma unidade Consumidora. Apenas os subgrupos usados em unidades
              consumidoras ativas precisam estar atualizadas.
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant="body1">
              A vigência e os valores das tarifas são determinadas pela ANEEL.
              Os valores podem variar de um subgrupo a outro.
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant="body1">
              Siga{" "}
              <Link
                style={{ cursor: "pointer" }}
                fontWeight="bold"
                onClick={handleDownloadClick}
                target="_blank"
              >
                este passo-a-passo
              </Link>{" "}
              para encontrar as informações de tarifa no site da ANEEL.
            </Typography>
          </Grid>

          <Grid item width="100%" display="flex" justifyContent="end">
            <Button
              onClick={() => setOpenModalInfoAboutSubGroupsAndTariff(false)}
              variant="text"
            >
              Fechar
            </Button>
          </Grid>
        </Grid>
      </Modal>
    );
  };

  if (!activeDistributorData) {
    return null;
  }

  return (
    <Box
      position="sticky"
      top={0}
      zIndex={1}
      sx={{ backgroundColor: "background.default" }}
      display={"flex"}
    >
      <Container>
        <Box display="flex" justifyContent="space-between">
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

                {distributor?.consumerUnitsCount !== 0 ? (
                  <Tooltip title="Enquanto houver uma UC com contrato associado à essa distribuidora, ela não pode ser apagada. Mesmo que a UC esteja inativa.">
                    <span>
                      <Button
                        variant="outlined"
                        color="error"
                        disabled
                        startIcon={<Delete />}
                        size="small"
                        onClick={() => {
                          ("");
                        }}
                      >
                        Apagar
                      </Button>
                    </span>
                  </Tooltip>
                ) : (
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<Delete />}
                    size="small"
                    onClick={handleDeleteDistributorClick}
                  >
                    Apagar
                  </Button>
                )}

                <DistributorEditForm />
              </Box>
            </Box>
            <DeleteDistributorDialog
              open={shouldShowCancelDialog}
              onClose={() => handleDeleteDistributor()}
              onDiscard={() => setShouldShowCancelDialog(false)}
              titleText={`Apagar ${distributor?.name}?`}
              confirmText="Apagar"
              cancelText="Cancelar"
              dataLossMessage="Os dados lançados serão perdidos."
            />

            <Typography>
              CNPJ: <strong>{distributor?.cnpj}</strong>
            </Typography>
          </Box>

          <ModalInfoAboutSubGroupsAndTariff />
        </Box>

        <Collapse in={shouldShowTabs}>
          <Box minHeight={24}>
            <DistributorContentHeaderTabs />
          </Box>
        </Collapse>
      </Container>

      <Box>
        <IconButton
          onClick={() => setOpenModalInfoAboutSubGroupsAndTariff(true)}
        >
          <HelpOutlineSharpIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default DistributorContentHeader;
