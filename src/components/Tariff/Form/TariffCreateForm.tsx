import { Grid } from "@mui/material";
import React, { Fragment, useCallback, useEffect, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import {
  selectActiveDistributorId,
  selectActiveSubgroup,
  selectIsTariffCreateFormOpen,
  selectIsTariffEditFormOpen,
  setIsErrorNotificationOpen,
  setIsSuccessNotificationOpen as setIsSuccessNotificationOpen,
  setIsTariffCreateFormOpen,
  setIsTariffEdiFormOpen,
} from "../../../store/appSlice";
import {
  CreateAndEditTariffForm,
  CreateTariffRequestPayload,
} from "../../../types/tariffs";
import { DatePicker } from "@mui/x-date-pickers";
import FormWarningDialog from "../../ConsumerUnit/Form/WarningDialog";
import {
  useCreateTariffMutation,
  useEditTariffMutation,
  useGetDistributorQuery,
  useGetTariffQuery,
} from "@/api";
import { getFormattedDateUTC, sendFormattedDate } from "@/utils/date";
import { skipToken } from "@reduxjs/toolkit/dist/query";
import FormDrawerV2 from "@/components/Form/DrawerV2";
import { getSession } from "next-auth/react";
import FormFieldError from "@/components/FormFieldError";
import Header from "./Header";
import {
  isValidDate,
  isValidEndDate,
} from "@/utils/validations/dateValidations";
import BlueMode from "./BlueMode";
import GreenMode from "./GreenMode";

const defaultValues: CreateAndEditTariffForm = {
  startDate: new Date(),
  endDate: new Date(),
  blue: {
    peakTusdInReaisPerKw: "",
    peakTusdInReaisPerMwh: "",
    peakTeInReaisPerMwh: "",
    offPeakTusdInReaisPerKw: "",
    offPeakTusdInReaisPerMwh: "",
    offPeakTeInReaisPerMwh: "",
  },
  green: {
    peakTusdInReaisPerMwh: null,
    peakTeInReaisPerMwh: null,
    offPeakTusdInReaisPerMwh: null,
    offPeakTeInReaisPerMwh: null,
    naTusdInReaisPerKw: null,
  },
};

const TariffCreateEditForm = () => {
  const dispatch = useDispatch();

  const isCreateTariffFormOpen = useSelector(selectIsTariffCreateFormOpen);
  const isEditTariffFormOpen = useSelector(selectIsTariffEditFormOpen);
  const activeDistributorId = useSelector(selectActiveDistributorId);
  const activeSubgroup = useSelector(selectActiveSubgroup);
  const { data: currentTariff, refetch: refetchCurrentTariff } =
    useGetTariffQuery({
      distributor: activeDistributorId ?? 0,
      subgroup: activeSubgroup ?? "0",
    });
  const [
    createTariff,
    {
      isError: isCreateTariffError,
      isSuccess: isCreateTariffSuccess,
      isLoading: isCreateTariffLoading,
      reset: resetCreateMutation,
    },
  ] = useCreateTariffMutation();
  const [
    editTariff,
    {
      isError: isEditTariffError,
      isSuccess: isEditTariffSuccess,
      isLoading: isEditTariffLoading,
      reset: resetEditMutation,
    },
  ] = useEditTariffMutation();
  const activeDistributor = useSelector(selectActiveDistributorId);
  const distributor = useGetDistributorQuery(activeDistributor || skipToken);
  const [shouldShowCancelDialog, setShouldShowCancelDialog] = useState(false);
  const [startDate, setStartDate] = useState(new Date(2010));
  const form = useForm({ defaultValues });
  const {
    control,
    reset,
    handleSubmit,
    setValue,
    formState: { isDirty, errors },
  } = form;

  useEffect(() => {
    if (isEditTariffFormOpen) {
      const fetchData = async () => {
        try {
          const { data: currentTariff } = await refetchCurrentTariff();

          if (!currentTariff) return;

          setValue(
            "blue.offPeakTeInReaisPerMwh",
            currentTariff.blue.offPeakTeInReaisPerMwh
          );
          setValue(
            "blue.offPeakTusdInReaisPerKw",
            currentTariff.blue.offPeakTusdInReaisPerKw
          );
          setValue(
            "blue.offPeakTusdInReaisPerMwh",
            currentTariff.blue.offPeakTusdInReaisPerMwh
          );
          setValue(
            "blue.peakTeInReaisPerMwh",
            currentTariff.blue.peakTeInReaisPerMwh
          );
          setValue(
            "blue.peakTusdInReaisPerKw",
            currentTariff.blue.peakTusdInReaisPerKw
          );
          setValue(
            "blue.peakTusdInReaisPerMwh",
            currentTariff.blue.peakTusdInReaisPerMwh
          );
          setValue(
            "green.naTusdInReaisPerKw",
            currentTariff.green.naTusdInReaisPerKw
          );
          setValue(
            "green.offPeakTeInReaisPerMwh",
            currentTariff.green.offPeakTeInReaisPerMwh
          );
          setValue(
            "green.offPeakTusdInReaisPerMwh",
            currentTariff.green.offPeakTusdInReaisPerMwh
          );
          setValue(
            "green.peakTeInReaisPerMwh",
            currentTariff.green.peakTeInReaisPerMwh
          );
          setValue(
            "green.peakTusdInReaisPerMwh",
            currentTariff.green.peakTusdInReaisPerMwh
          );

          setValue("endDate", getFormattedDateUTC(currentTariff.endDate));
          setValue("startDate", getFormattedDateUTC(currentTariff.startDate));
        } catch (err) {
          console.error("Failed to refetch:", err);
        }
      };

      // Garante que o refetch não seja executado antes do fetch
      if (isEditTariffFormOpen) {
        fetchData();
      }
    }
  }, [currentTariff, isEditTariffFormOpen, setValue, refetchCurrentTariff]);

  const handleCloseDialog = useCallback(() => {
    setShouldShowCancelDialog(false);
  }, []);

  const handleDiscardForm = useCallback(() => {
    handleCloseDialog();
    reset();
    if (isCreateTariffFormOpen) dispatch(setIsTariffCreateFormOpen(false));
    else dispatch(setIsTariffEdiFormOpen(false));
  }, [dispatch, handleCloseDialog, isCreateTariffFormOpen, reset]);

  const handleCancelEdition = useCallback(() => {
    if (isDirty) {
      setShouldShowCancelDialog(true);
      return;
    }
    handleDiscardForm();
  }, [handleDiscardForm, isDirty]);

  const handleDownloadClick = async (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event?.preventDefault();
    try {
      const session = await getSession();
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/download-step-by-step-pdf/`,
        {
          method: "GET",
          headers: {
            Authorization: `Token ${session?.user?.token}`,
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
      );
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to download file:", error);
    }
  };

  const onSubmitHandler: SubmitHandler<CreateAndEditTariffForm> = async (
    data: CreateAndEditTariffForm
  ) => {
    const { startDate: start_date, endDate: end_date, blue, green } = data;

    if (!activeDistributor) return;
    if (!activeSubgroup) return;

    const body: CreateTariffRequestPayload = {
      startDate: sendFormattedDate(start_date),
      endDate: sendFormattedDate(end_date),
      blue: blue,
      green: green,
      subgroup: activeSubgroup,
      distributor: activeDistributor,
    };

    if (isCreateTariffFormOpen) await createTariff(body);
    if (isEditTariffFormOpen) await editTariff(body);
  };

  const handleNotification = useCallback(() => {
    if (isCreateTariffFormOpen) {
      if (isCreateTariffSuccess) {
        dispatch(
          setIsSuccessNotificationOpen({
            isOpen: true,
            text: "Tarifas adicionadas com sucesso!",
          })
        );
        reset();
        resetCreateMutation();
        setTimeout(() => dispatch(setIsTariffCreateFormOpen(false)), 500);
      } else if (isCreateTariffError) {
        dispatch(
          setIsErrorNotificationOpen({
            isOpen: true,
            text: "Erro ao adicionar tarifas!",
          })
        );
        resetCreateMutation();
      }
    } else if (isEditTariffFormOpen) {
      if (isEditTariffSuccess) {
        dispatch(
          setIsSuccessNotificationOpen({
            isOpen: true,
            text: "Tarifas atualizadas com sucesso",
          })
        );
        reset();
        resetEditMutation();
        setTimeout(() => dispatch(setIsTariffEdiFormOpen(false)), 500);
      } else if (isEditTariffError) {
        dispatch(
          setIsErrorNotificationOpen({
            isOpen: true,
            text: "Erro ao editar tarifa",
          })
        );
        resetEditMutation();
      }
    }
  }, [
    dispatch,
    isCreateTariffError,
    isCreateTariffFormOpen,
    isCreateTariffSuccess,
    isEditTariffError,
    isEditTariffFormOpen,
    isEditTariffSuccess,
    reset,
    resetCreateMutation,
    resetEditMutation,
  ]);

  useEffect(() => {
    handleNotification();
  }, [handleNotification, isCreateTariffSuccess, isCreateTariffError]);

  const ValiditySection = useCallback(
    () => (
      <>
        <Grid item xs={12} marginBottom={2}>
          <Typography variant="h5">Vigência</Typography>
        </Grid>

        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Controller
              control={control}
              name="startDate"
              rules={{
                required: "Preencha este campo",
                validate: isValidDate,
              }}
              render={({
                field: { value, onChange },
                fieldState: { error },
              }) => (
                <DatePicker
                  value={value}
                  label="Início *"
                  views={["day", "month", "year"]}
                  minDate={new Date("2010")}
                  disableFuture
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      inputProps={{
                        ...params.inputProps,
                        placeholder: "dd/mm/aaaa",
                      }}
                      helperText={FormFieldError(error?.message)}
                      error={!!error}
                    />
                  )}
                  onChange={onChange}
                />
              )}
            />
          </Grid>
          <Grid item xs={6}>
            <Controller
              control={control}
              name="endDate"
              rules={{
                required: "Preencha este campo",
                validate: (date) => isValidEndDate(date, startDate),
              }}
              render={({
                field: { value, onChange },
                fieldState: { error },
              }) => (
                <DatePicker
                  value={value}
                  label="Fim *"
                  views={["day", "month", "year"]}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      inputProps={{
                        ...params.inputProps,
                        placeholder: "dd/mm/aaaa",
                      }}
                      helperText={FormFieldError(error?.message)}
                      error={!!error}
                    />
                  )}
                  onChange={onChange}
                />
              )}
            />
          </Grid>
        </Grid>
      </>
    ),
    [control, isValidDate, isValidEndDate]
  );

  const sections = [
    <ValiditySection key={0} />,
    <BlueMode control={control} key={1} />,
  ];

  if (activeSubgroup !== "A3" && activeSubgroup !== "A2") {
    sections.push(<GreenMode control={control} key={2} />);
  }

  return (
    <Fragment>
      <FormDrawerV2
        open={isCreateTariffFormOpen || isEditTariffFormOpen}
        title={`${isCreateTariffFormOpen ? "Adicionar" : "Editar"} Tarifas`}
        errorsLength={Object.keys(errors).length}
        handleCloseDrawer={handleCancelEdition}
        handleSubmitDrawer={handleSubmit(onSubmitHandler)}
        isLoading={isCreateTariffLoading || isEditTariffLoading}
        header={
          <Header
            activeSubgroup={activeSubgroup}
            distributor={distributor}
            handleDownloadClick={handleDownloadClick}
          />
        }
        sections={sections}
      />
      <FormWarningDialog
        open={shouldShowCancelDialog}
        entity={"tarifa"}
        onClose={handleCloseDialog}
        onDiscard={handleDiscardForm}
        type={isCreateTariffFormOpen ? "create" : "update"}
      />
    </Fragment>
  );
};

export default TariffCreateEditForm;
