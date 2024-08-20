import {
  Alert,
  Box,
  Grid,
  InputAdornment,
  TextField,
  Typography,
  Link,
} from "@mui/material";
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
import { isAfter, isFuture, isValid } from "date-fns";
import { NumericFormat } from "react-number-format";
import FormWarningDialog from "../../ConsumerUnit/Form/WarningDialog";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
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

  const minTariffValue = 0.1;
  const maxTariffValue = 9999.99;

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

  const isValidDate = useCallback(
    (date: CreateAndEditTariffForm["startDate"]) => {
      if (!date || !isValid(date)) {
        return "Insira uma data válida no formato dd/mm/aaaa.";
      }

      if (isFuture(new Date(date))) {
        return "Insira uma data anterior ou igual a data atual no formato dd/mm/aaaa";
      }

      if (!isAfter(new Date(date), new Date("2010"))) {
        return "Insira uma data a partir de 2010";
      }

      setStartDate(new Date(date));

      return true;
    },
    []
  );

  const isValidEndDate = useCallback(
    (date: CreateAndEditTariffForm["endDate"]) => {
      if (!date || !isValid(date)) {
        return "Insira uma data válida no formato dd/mm/aaaa.";
      }

      if (!isAfter(new Date(date), startDate)) {
        return "Insira uma data posterior à data de início";
      }

      return true;
    },
    [startDate]
  );

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
                  views={["month", "year"]}
                  minDate={new Date("2010")}
                  disableFuture
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      inputProps={{
                        ...params.inputProps,
                        placeholder: "dd/mm/aaaa",
                      }}
                      helperText={error?.message ?? " "}
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
                validate: isValidEndDate,
              }}
              render={({
                field: { value, onChange },
                fieldState: { error },
              }) => (
                <DatePicker
                  value={value}
                  label="Fim *"
                  views={["month", "year"]}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      inputProps={{
                        ...params.inputProps,
                        placeholder: "dd/mm/aaaa",
                      }}
                      helperText={error?.message ?? " "}
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

  const BlueMode = useCallback(
    () => (
      <>
        <Grid item xs={12}>
          <Typography variant="h5">Modalidade Azul</Typography>
        </Grid>

        <Grid item xs={12} style={{ marginBottom: "20px", marginTop: "20px" }}>
          <Typography variant="inherit" color="primary">
            Ponta
          </Typography>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <Controller
              control={control}
              name={"blue.peakTusdInReaisPerKw"}
              rules={{
                required: "Preencha este campo",
                min: {
                  value: minTariffValue,
                  message: "Insira um valor maior que R$ 0,00",
                },
              }}
              render={({
                field: { onChange, onBlur, value },
                fieldState: { error },
              }) => (
                <NumericFormat
                  value={value}
                  customInput={TextField}
                  label="TUSD R$/kW  *"
                  helperText={error?.message ?? " "}
                  error={!!error}
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">R$</InputAdornment>
                    ),
                    placeholder: "0,00",
                  }}
                  type="text"
                  allowNegative={false}
                  isAllowed={({ floatValue }) =>
                    !floatValue || floatValue <= maxTariffValue
                  }
                  decimalScale={2}
                  decimalSeparator=","
                  thousandSeparator={"."}
                  onValueChange={(values) =>
                    onChange(values.floatValue ?? null)
                  }
                  onBlur={onBlur}
                />
              )}
            />
          </Grid>

          <Grid item xs={4}>
            <Controller
              control={control}
              name={"blue.peakTusdInReaisPerMwh"}
              rules={{
                required: "Preencha este campo",
                min: {
                  value: minTariffValue,
                  message: "Insira um valor maior que R$ 0,00",
                },
              }}
              render={({
                field: { onChange, onBlur, value },
                fieldState: { error },
              }) => (
                <NumericFormat
                  value={value !== 0 ? value : null}
                  customInput={TextField}
                  label="TUSD R$/MWh *"
                  helperText={error?.message ?? " "}
                  error={!!error}
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">R$</InputAdornment>
                    ),
                    placeholder: "0,00",
                  }}
                  type="text"
                  allowNegative={false}
                  isAllowed={({ floatValue }) =>
                    !floatValue || floatValue <= maxTariffValue
                  }
                  decimalScale={2}
                  decimalSeparator=","
                  thousandSeparator={"."}
                  onValueChange={(values) =>
                    onChange(values.floatValue ?? null)
                  }
                  onBlur={onBlur}
                />
              )}
            />
          </Grid>

          <Grid item xs={4}>
            <Controller
              control={control}
              name={"blue.peakTeInReaisPerMwh"}
              rules={{
                required: "Preencha este campo",
                min: {
                  value: minTariffValue,
                  message: "Insira um valor maior que R$ 0,00",
                },
              }}
              render={({
                field: { onChange, onBlur, value },
                fieldState: { error },
              }) => (
                <NumericFormat
                  value={value !== 0 ? value : null}
                  customInput={TextField}
                  label="TE R$/MWh  *"
                  helperText={error?.message ?? " "}
                  error={!!error}
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">R$</InputAdornment>
                    ),
                    placeholder: "0,00",
                  }}
                  type="text"
                  allowNegative={false}
                  isAllowed={({ floatValue }) =>
                    !floatValue || floatValue <= maxTariffValue
                  }
                  decimalScale={2}
                  decimalSeparator=","
                  thousandSeparator={"."}
                  onValueChange={(values) =>
                    onChange(values.floatValue ?? null)
                  }
                  onBlur={onBlur}
                />
              )}
            />
          </Grid>
        </Grid>

        <Grid item xs={12} style={{ marginBottom: "20px", marginTop: "10px" }}>
          <Typography variant="inherit" color="primary">
            Fora Ponta
          </Typography>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <Controller
              control={control}
              name={"blue.offPeakTusdInReaisPerKw"}
              rules={{
                required: "Preencha este campo",
                min: {
                  value: 0.01,
                  message: "Insira um valor maior que R$ 0,00",
                },
              }}
              render={({
                field: { onChange, onBlur, value },
                fieldState: { error },
              }) => (
                <NumericFormat
                  value={value !== 0 ? value : null}
                  customInput={TextField}
                  label="TUSD R$/kW  *"
                  helperText={error?.message ?? " "}
                  error={!!error}
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">R$</InputAdornment>
                    ),
                    placeholder: "0,00",
                  }}
                  type="text"
                  allowNegative={false}
                  isAllowed={({ floatValue }) =>
                    !floatValue || floatValue <= maxTariffValue
                  }
                  decimalScale={2}
                  decimalSeparator=","
                  thousandSeparator={"."}
                  onValueChange={(values) =>
                    onChange(values.floatValue ?? null)
                  }
                  onBlur={onBlur}
                />
              )}
            />
          </Grid>

          <Grid item xs={4}>
            <Controller
              control={control}
              name={"blue.offPeakTusdInReaisPerMwh"}
              rules={{
                required: "Preencha este campo",
                min: {
                  value: 0.01,
                  message: "Insira um valor maior que R$ 0,00",
                },
              }}
              render={({
                field: { onChange, onBlur, value },
                fieldState: { error },
              }) => (
                <NumericFormat
                  value={value !== 0 ? value : null}
                  customInput={TextField}
                  label="TUSD R$/MWh *"
                  helperText={error?.message ?? " "}
                  error={!!error}
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">R$</InputAdornment>
                    ),
                    placeholder: "0,00",
                  }}
                  type="text"
                  allowNegative={false}
                  isAllowed={({ floatValue }) =>
                    !floatValue || floatValue <= maxTariffValue
                  }
                  decimalScale={2}
                  decimalSeparator=","
                  thousandSeparator={"."}
                  onValueChange={(values) =>
                    onChange(values.floatValue ?? null)
                  }
                  onBlur={onBlur}
                />
              )}
            />
          </Grid>

          <Grid item xs={4}>
            <Controller
              control={control}
              name={"blue.offPeakTeInReaisPerMwh"}
              rules={{
                required: "Preencha este campo",
                min: {
                  value: 0.01,
                  message: "Insira um valor maior que R$ 0,00",
                },
              }}
              render={({
                field: { onChange, onBlur, value },
                fieldState: { error },
              }) => (
                <NumericFormat
                  value={value !== 0 ? value : undefined}
                  customInput={TextField}
                  label="TE R$/MWh  *"
                  helperText={error?.message ?? " "}
                  error={!!error}
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">R$</InputAdornment>
                    ),
                    placeholder: "0,00",
                  }}
                  type="text"
                  allowNegative={false}
                  isAllowed={({ floatValue }) =>
                    !floatValue || floatValue <= maxTariffValue
                  }
                  decimalScale={2}
                  decimalSeparator=","
                  thousandSeparator={"."}
                  onValueChange={(values) =>
                    onChange(values.floatValue ?? null)
                  }
                  onBlur={onBlur}
                />
              )}
            />
          </Grid>
        </Grid>
      </>
    ),
    [control]
  );

  const GreenMode = useCallback(
    () => (
      <>
        <Grid item xs={12}>
          <Typography variant="h5">Modalidade Verde</Typography>
        </Grid>

        <Grid item xs={12} style={{ marginBottom: "20px", marginTop: "20px" }}>
          <Typography variant="inherit" color="primary">
            NA
          </Typography>
        </Grid>

        <Grid item xs={4}>
          <Controller
            control={control}
            name={"green.naTusdInReaisPerKw"}
            rules={{
              required: "Preencha este campo",
              min: {
                value: 0.01,
                message: "Insira um valor maior que R$ 0,00",
              },
            }}
            render={({
              field: { onChange, onBlur, value },
              fieldState: { error },
            }) => (
              <NumericFormat
                value={value !== 0 ? value : null}
                customInput={TextField}
                label="TUSD R$/kW  *"
                helperText={error?.message ?? " "}
                error={!!error}
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">R$</InputAdornment>
                  ),
                  placeholder: "0,00",
                  style: { maxWidth: "31.5%" },
                }}
                type="text"
                allowNegative={false}
                isAllowed={({ floatValue }) =>
                  !floatValue || floatValue <= maxTariffValue
                }
                decimalScale={2}
                decimalSeparator=","
                thousandSeparator={"."}
                onValueChange={(values) => onChange(values.floatValue ?? null)}
                onBlur={onBlur}
              />
            )}
          />
        </Grid>

        <Grid item xs={12} style={{ marginBottom: "20px", marginTop: "10px" }}>
          <Typography variant="inherit" color="primary">
            Ponta
          </Typography>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <Controller
              control={control}
              name={"green.peakTusdInReaisPerMwh"}
              rules={{
                required: "Preencha este campo",
                min: {
                  value: 0.01,
                  message: "Insira um valor maior que R$ 0,00",
                },
              }}
              render={({
                field: { onChange, onBlur, value },
                fieldState: { error },
              }) => (
                <NumericFormat
                  value={value !== 0 ? value : null}
                  customInput={TextField}
                  label="TUSD R$/MWh *"
                  helperText={error?.message ?? " "}
                  error={!!error}
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">R$</InputAdornment>
                    ),
                    placeholder: "0,00",
                  }}
                  type="text"
                  allowNegative={false}
                  isAllowed={({ floatValue }) =>
                    !floatValue || floatValue <= maxTariffValue
                  }
                  decimalScale={2}
                  decimalSeparator=","
                  thousandSeparator={"."}
                  onValueChange={(values) =>
                    onChange(values.floatValue ?? null)
                  }
                  onBlur={onBlur}
                />
              )}
            />
          </Grid>

          <Grid item xs={4}>
            <Controller
              control={control}
              name={"green.peakTeInReaisPerMwh"}
              rules={{
                required: "Preencha este campo",
                min: {
                  value: 0.01,
                  message: "Insira um valor maior que R$ 0,00",
                },
              }}
              render={({
                field: { onChange, onBlur, value },
                fieldState: { error },
              }) => (
                <NumericFormat
                  value={value !== 0 ? value : null}
                  customInput={TextField}
                  label="TE R$/MWh  *"
                  helperText={error?.message ?? " "}
                  error={!!error}
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">R$</InputAdornment>
                    ),
                    placeholder: "0,00",
                  }}
                  type="text"
                  allowNegative={false}
                  isAllowed={({ floatValue }) =>
                    !floatValue || floatValue <= maxTariffValue
                  }
                  decimalScale={2}
                  decimalSeparator=","
                  thousandSeparator={"."}
                  onValueChange={(values) =>
                    onChange(values.floatValue ?? null)
                  }
                  onBlur={onBlur}
                />
              )}
            />
          </Grid>
        </Grid>
        <Grid item xs={12} style={{ marginBottom: "20px", marginTop: "10px" }}>
          <Typography variant="inherit" color="primary">
            Fora Ponta
          </Typography>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <Controller
              control={control}
              name={"green.offPeakTusdInReaisPerMwh"}
              rules={{
                required: "Preencha este campo",
                min: {
                  value: 0.01,
                  message: "Insira um valor maior que R$ 0,00",
                },
              }}
              render={({
                field: { onChange, onBlur, value },
                fieldState: { error },
              }) => (
                <NumericFormat
                  value={value !== 0 ? value : null}
                  customInput={TextField}
                  label="TUSD R$/MWh *"
                  helperText={error?.message ?? " "}
                  error={!!error}
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">R$</InputAdornment>
                    ),
                    placeholder: "0,00",
                  }}
                  type="text"
                  allowNegative={false}
                  isAllowed={({ floatValue }) =>
                    !floatValue || floatValue <= maxTariffValue
                  }
                  decimalScale={2}
                  decimalSeparator=","
                  thousandSeparator={"."}
                  onValueChange={(values) =>
                    onChange(values.floatValue ?? null)
                  }
                  onBlur={onBlur}
                />
              )}
            />
          </Grid>

          <Grid item xs={4}>
            <Controller
              control={control}
              name={"green.offPeakTeInReaisPerMwh"}
              rules={{
                required: "Preencha este campo",
                min: {
                  value: 0.01,
                  message: "Insira um valor maior que R$ 0,00",
                },
              }}
              render={({
                field: { onChange, onBlur, value },
                fieldState: { error },
              }) => (
                <NumericFormat
                  value={value !== 0 ? value : null}
                  customInput={TextField}
                  label="TE R$/MWh  *"
                  helperText={error?.message ?? " "}
                  error={!!error}
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">R$</InputAdornment>
                    ),
                    placeholder: "0,00",
                  }}
                  type="text"
                  allowNegative={false}
                  isAllowed={({ floatValue }) =>
                    !floatValue || floatValue <= maxTariffValue
                  }
                  decimalScale={2}
                  decimalSeparator=","
                  thousandSeparator={"."}
                  onValueChange={(values) =>
                    onChange(values.floatValue ?? null)
                  }
                  onBlur={onBlur}
                />
              )}
            />
          </Grid>
        </Grid>
      </>
    ),
    [control]
  );

  const Header = useCallback(
    () => (
      <>
        <Typography variant="h4">Subgrupo {activeSubgroup}</Typography>
        <Typography>Distribuidora: {distributor.data?.name}</Typography>
        <Box mt={3} mb={3}>
          <Alert icon={<ErrorOutlineIcon />} severity="info" variant="filled">
            Siga este{" "}
            <Link
              component="button"
              onClick={handleDownloadClick}
              style={{
                cursor: "pointer",
                color: "white",
                textDecoration: "underline",
              }}
            >
              passo-a-passo
            </Link>{" "}
            a seguir para encontrar as informações de tarifa no site da ANEEL.
          </Alert>
        </Box>
      </>
    ),
    [activeSubgroup, distributor.data?.name]
  );

  const sections = [<ValiditySection key={0} />, <BlueMode key={1} />];

  if (activeSubgroup !== "A3" && activeSubgroup !== "A2") {
    sections.push(<GreenMode key={2} />);
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
        header={<Header />}
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
