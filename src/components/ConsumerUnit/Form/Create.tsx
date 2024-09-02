import React, { Fragment, useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import {
  Alert,
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  Select,
  Switch,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { NumericFormat } from "react-number-format";

import {
  selectIsConsumerUnitCreateFormOpen,
  setIsConsumerUnitCreateFormOpen,
  setIsErrorNotificationOpen,
  setIsSuccessNotificationOpen,
} from "../../../store/appSlice";
import {
  CreateConsumerUnitForm,
  CreateConsumerUnitRequestPayload,
} from "../../../types/consumerUnit";
import FormWarningDialog from "./WarningDialog";
import { isAfter, isFuture, isValid } from "date-fns";
import {
  useCreateConsumerUnitMutation,
  useGetDistributorsQuery,
  useGetSubgroupsQuery,
} from "@/api";
import { useSession } from "next-auth/react";
import DistributorCreateFormDialog from "@/components/Distributor/Form/CreateForm";
import { DistributorPropsTariffs } from "@/types/distributor";
import { skipToken } from "@reduxjs/toolkit/dist/query";
import { sendFormattedDate } from "@/utils/date";
import { getSubgroupsText } from "@/utils/get-subgroup-text";
import { isInSomeSubgroups } from "@/utils/validations/form-validations";
import FormDrawerV2 from "@/components/Form/DrawerV2";
import SupplyVoltageTooltip from "@/components/SupplyVoltageTooltip";

const defaultValues: CreateConsumerUnitForm = {
  name: "",
  code: "",
  distributor: "",
  startDate: null,
  supplyVoltage: "",
  tariffFlag: "G",
  contracted: "",
  peakContractedDemandInKw: "",
  offPeakContractedDemandInKw: "",
  totalInstalledPower: null,
  shouldShowInstalledPower: false,
};

const ConsumerUnitCreateForm = () => {
  //Sessão
  const { data: session } = useSession();

  //Redux
  const dispatch = useDispatch();
  const isCreateFormOpen = useSelector(selectIsConsumerUnitCreateFormOpen);

  //Requisições Redux Query
  const { data: subgroupsList } = useGetSubgroupsQuery();
  const { data: distributorList } = useGetDistributorsQuery(
    session?.user?.universityId || skipToken
  );

  const sortedDistributorList = distributorList
    ?.slice()
    .sort((a, b) => a.name.localeCompare(b.name));

  const [
    createConsumerUnit,
    { status, isError, isSuccess, isLoading, reset: resetMutation },
  ] = useCreateConsumerUnitMutation();

  //Estados
  const [shouldShowCancelDialog, setShouldShowCancelDialog] = useState(false);
  const [shouldShowDistributorFormDialog, setShouldShowDistributorFormDialog] =
    useState(false);
  // const [shouldShowGreenDemand, setShouldShowGreenDemand] = useState(true);
  const shouldShowGreenDemand = true;
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);

  //Formulário
  const form = useForm({ mode: "all", defaultValues });
  const {
    control,
    reset,
    handleSubmit,
    watch,
    setValue,
    getValues,
    formState: { isDirty, errors },
  } = form;

  const tariffFlag = watch("tariffFlag");
  const shouldShowInstalledPower = watch("shouldShowInstalledPower");
  const supplyVoltage = watch("supplyVoltage");

  useEffect(() => {
    const {
      contracted,
      peakContractedDemandInKw,
      offPeakContractedDemandInKw,
    } = defaultValues;

    if (!shouldShowGreenDemand) {
      setValue("peakContractedDemandInKw", getValues("contracted"));
      setValue("offPeakContractedDemandInKw", getValues("contracted"));
    } else {
      setValue("contracted", contracted);
      setValue("peakContractedDemandInKw", peakContractedDemandInKw);
      setValue("offPeakContractedDemandInKw", offPeakContractedDemandInKw);
    }
  }, [setValue, tariffFlag]);

  useEffect(() => {
    // Verifica se shouldShowGreenDemand é false
    if (!shouldShowGreenDemand) {
      // Atualiza o estado tariffFlag para "B" (azul)
      setValue("tariffFlag", "B");
    }
  }, [shouldShowGreenDemand]);

  // Validações de Formulário
  const isValidDate = (date: CreateConsumerUnitForm["startDate"]) => {
    if (!date || !isValid(date)) {
      return "Insira uma data válida no formato dd/mm/aaaa";
    }

    if (isFuture(date)) {
      return "Datas futuras não são permitidas";
    }

    if (!isAfter(date, new Date("2010"))) {
      return "Datas antes de 2010 não são permitidas";
    }

    return true;
  };

  const isValueGreaterThenZero = (
    value:
      | CreateConsumerUnitForm["peakContractedDemandInKw"]
      | CreateConsumerUnitForm["offPeakContractedDemandInKw"]
  ) => {
    if (value <= 0) return "Insira um valor maior que 0";
  };

  const shouldHideTooltip = (value) => {
    if (value === undefined) return false;
    return (
      value <= 2.3 ||
      (value > 2.3 && value <= 25) ||
      (value >= 30 && value <= 44) ||
      value === 69 ||
      (value >= 88 && value <= 138) ||
      value >= 230
    );
  };

  // Modal
  const handleCloseDialog = () => {
    setShouldShowCancelDialog(false);
  };

  const handleDiscardForm = useCallback(() => {
    handleCloseDialog();
    reset();
    dispatch(setIsConsumerUnitCreateFormOpen(false));
  }, [dispatch, reset]);

  const handleCancelEdition = useCallback(() => {
    if (isDirty) {
      setShouldShowCancelDialog(true);
      return;
    }

    handleDiscardForm();
  }, [handleDiscardForm, isDirty]);

  // Submissão de Formulário
  const onSubmitHandler: SubmitHandler<CreateConsumerUnitForm> = useCallback(
    async (data) => {
      if (data.tariffFlag === "G") {
        data.offPeakContractedDemandInKw = data.contracted;
        data.peakContractedDemandInKw = data.contracted;
      }

      const body: CreateConsumerUnitRequestPayload = {
        consumerUnit: {
          name: data.name,
          code: data.code,
          isActive: true,
          university: session?.user.universityId || 0,
          totalInstalledPower: !data.shouldShowInstalledPower
            ? null
            : data.totalInstalledPower,
        },
        contract: {
          startDate: data.startDate ? sendFormattedDate(data.startDate) : "",
          tariffFlag: data.tariffFlag,
          peakContractedDemandInKw: data.peakContractedDemandInKw as number,
          offPeakContractedDemandInKw:
            data.offPeakContractedDemandInKw as number,
          supplyVoltage: data.supplyVoltage as number,
          distributor: data.distributor as number,
        },
      };

      await createConsumerUnit(body);
    },
    [createConsumerUnit, session?.user.universityId]
  );

  // Notificações

  const handleNotification = useCallback(() => {
    if (isSuccess) {
      dispatch(
        setIsSuccessNotificationOpen({
          isOpen: true,
          text: "Unidade consumidora adicionada com sucesso!",
        })
      );
      reset();
      resetMutation();
      dispatch(setIsConsumerUnitCreateFormOpen(false));
    } else if (isError) {
      dispatch(
        setIsErrorNotificationOpen({
          isOpen: true,
          text: "Erro ao adicionar unidade consumidora. Verifique se já existe uma unidade com  nome ou código",
        })
      );
      resetMutation();
    }
  }, [dispatch, isError, isSuccess, reset, resetMutation]);

  useEffect(() => {
    handleNotification();
  }, [handleNotification, isSuccess, isError, status]);

  const handleCloseDistributorFormDialog = () => {
    setShouldShowDistributorFormDialog(false);
  };

  const hasEnoughCaracteresLength = (value: string) => {
    const withoutSpacesInStartAndEnd = value.trim(); // Remove espaços em branco do início e do final
    return (
      withoutSpacesInStartAndEnd.length >= 3 ||
      "Insira no ínimo de 3 caracteres, excluindo espaços em branco."
    );
  };

  const handleNumericInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    onChange: (value: string) => void
  ) => {
    const numericValue = e.target.value.replace(/\D/g, "");
    onChange(numericValue);
  };

  return (
    <Fragment>
      <FormDrawerV2
        open={isCreateFormOpen}
        title={"Adicionar Unidade Consumidora"}
        errorsLength={Object.keys(errors).length}
        isLoading={isLoading}
        handleCloseDrawer={handleCancelEdition}
        handleSubmitDrawer={handleSubmit(onSubmitHandler)}
        header={<></>}
        sections={[]}
      >
        <>
          <Paper>
            <Box p={2} mb={4}>
              <Grid item xs={12}>
                <Typography variant="h5" style={{ marginBottom: "16px" }}>
                  Unidade Consumidora
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Controller
                  control={control}
                  name="name"
                  key={0}
                  rules={{
                    required: "Preencha este campo",
                    validate: hasEnoughCaracteresLength,
                  }}
                  render={({
                    field: { onChange, onBlur, value, ref },
                    fieldState: { error },
                  }) => (
                    <TextField
                      ref={ref}
                      value={value}
                      label="Nome *"
                      placeholder="Ex.: Campus Gama, Biblioteca, Faculdade de Medicina"
                      error={Boolean(error)}
                      helperText={error?.message ?? " "}
                      fullWidth
                      onChange={onChange}
                      onBlur={onBlur}
                      inputProps={{ maxLength: 50 }}
                    />
                  )}
                />
              </Grid>
            </Box>
          </Paper>
          <Paper>
            <Box p={2} mb={4}>
              <Grid item xs={12}>
                <Typography variant="h5" style={{ marginBottom: "13px" }}>
                  Contrato
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <Controller
                  control={control}
                  name="code"
                  rules={{
                    required: "Preencha este campo",
                    validate: hasEnoughCaracteresLength,
                  }}
                  render={({
                    field: { onChange, onBlur, value, ref },
                    fieldState: { error },
                  }) => (
                    <TextField
                      ref={ref}
                      value={value}
                      label="Número da Unidade *"
                      placeholder="Número da Unidade Consumidora conforme a fatura"
                      error={Boolean(error)}
                      helperText={
                        error?.message ??
                        "Nº ou código da Unidade Consumidora conforme a fatura"
                      }
                      fullWidth
                      onChange={(e) => handleNumericInputChange(e, onChange)}
                      onBlur={onBlur}
                      inputProps={{ maxLength: 30 }}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12}>
                <Controller
                  control={control}
                  name="distributor"
                  rules={{ required: "Preencha este campo" }}
                  render={({
                    field: { onChange, onBlur, value, ref },
                    fieldState: { error },
                  }) => (
                    <FormControl
                      sx={{ minWidth: "200px", maxWidth: "100%" }}
                      error={!!error}
                      style={{ marginTop: "20px" }}
                    >
                      <InputLabel>Distribuidora *</InputLabel>

                      <Select
                        ref={ref}
                        value={value}
                        label="Distribuidora *"
                        autoWidth
                        MenuProps={{
                          anchorOrigin: {
                            vertical: "bottom",
                            horizontal: "left",
                          },
                          transformOrigin: {
                            vertical: "top",
                            horizontal: "left",
                          },
                        }}
                        onChange={onChange}
                        onBlur={onBlur}
                      >
                        {distributorList?.map(
                          (distributor: DistributorPropsTariffs) => {
                            return (
                              <MenuItem
                                key={distributor.id}
                                value={distributor.id}
                              >
                                {distributor.name}
                              </MenuItem>
                            );
                          }
                        )}
                        <MenuItem>
                          <Button
                            onClick={() =>
                              setShouldShowDistributorFormDialog(true)
                            }
                          >
                            Adicionar
                          </Button>
                        </MenuItem>
                      </Select>

                      <FormHelperText>{error?.message ?? " "}</FormHelperText>
                    </FormControl>
                  )}
                />
              </Grid>

              <Grid item xs={12}>
                <Controller
                  control={control}
                  name="startDate"
                  rules={{
                    required: "Insira uma data válida no formato dd/mm/aaaa",
                    validate: isValidDate,
                  }}
                  render={({
                    field: { value, onChange },
                    fieldState: { error },
                  }) => (
                    <DatePicker
                      value={value}
                      label="Início da vigência *"
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
              <Tooltip
                componentsProps={{
                  tooltip: {
                    sx: {
                      bgcolor: "#B21B0A",
                      color: "#FFFFFF",
                      "& .MuiTooltip-arrow": {
                        color: "#B21B0A",
                      },
                    },
                  },
                }}
                title={
                  <div style={{ whiteSpace: "pre-line" }}>
                    {subgroupsList
                      ? getSubgroupsText(subgroupsList.subgroups)
                      : ""}
                  </div>
                }
                arrow
                placement="right"
                open={isTooltipOpen}
              >
                <Box>
                  <SupplyVoltageTooltip
                    open={!!supplyVoltage && !shouldHideTooltip(supplyVoltage)}
                    supplyVoltage={supplyVoltage}
                  >
                    <Grid item xs={8} sm={6}>
                      <Controller
                        control={control}
                        name="supplyVoltage"
                        rules={{
                          required: "Preencha este campo",
                          validate: (v) =>
                            isInSomeSubgroups(
                              v,
                              subgroupsList?.subgroups || []
                            ),
                        }}
                        render={({
                          field: { onChange, onBlur, value },
                          fieldState: { error },
                        }) => (
                          <NumericFormat
                            key="supplyVoltageInput"
                            value={value}
                            customInput={TextField}
                            label="Tensão contratada *"
                            helperText={
                              error?.message ??
                              "Se preciso, converta a tensão de V para kV dividindo o valor por 1.000."
                            }
                            error={!!error}
                            fullWidth
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position="end">
                                  kV
                                </InputAdornment>
                              ),
                            }}
                            type="text"
                            allowNegative={false}
                            isAllowed={({ floatValue }) =>
                              !floatValue || floatValue <= 9999.99
                            }
                            decimalScale={2}
                            decimalSeparator=","
                            thousandSeparator="."
                            onValueChange={(values) => {
                              const newVoltage = values?.floatValue || 0;
                              setIsTooltipOpen(!shouldHideTooltip(newVoltage));
                              onChange(values.floatValue);
                            }}
                            onBlur={(event) => {
                              if (error?.message === "Preencha este campo") {
                                setIsTooltipOpen(true);
                              } else {
                                setIsTooltipOpen(false);
                              }
                              onBlur(event);
                            }}
                          />
                        )}
                      />
                    </Grid>
                  </SupplyVoltageTooltip>
                </Box>
              </Tooltip>
            </Box>
          </Paper>

          <Paper>
            <Box p={2} mb={4}>
              <Grid item xs={12}>
                <Typography variant="h5">Demanda Contratada</Typography>
              </Grid>

              <Grid item xs={12}>
                <Controller
                  control={control}
                  name="tariffFlag"
                  rules={{ required: "Preencha este campo" }}
                  render={({
                    field: { onChange, value },
                    fieldState: { error },
                  }) => (
                    <FormControl error={!!error}>
                      <FormLabel>Modalidade tarifária *</FormLabel>

                      <RadioGroup value={value} onChange={onChange}>
                        <Box
                          display={"flex"}
                          justifyContent="flex-start"
                          alignItems="center"
                        >
                          <FormControlLabel
                            value="G"
                            control={<Radio />}
                            label="Verde"
                            disabled={!shouldShowGreenDemand}
                          />
                          <FormHelperText>(Demanda única)</FormHelperText>
                        </Box>
                        <Box
                          display={"flex"}
                          justifyContent="flex-start"
                          alignItems="center"
                        >
                          <FormControlLabel
                            value="B"
                            control={<Radio />}
                            label="Azul"
                          />
                          <FormHelperText>
                            (Demanda de ponta e fora ponta)
                          </FormHelperText>
                        </Box>
                      </RadioGroup>

                      <FormHelperText>{error?.message ?? " "}</FormHelperText>
                    </FormControl>
                  )}
                />
              </Grid>

              {tariffFlag === "G" ? (
                <Grid item xs={7}>
                  <Controller
                    control={control}
                    name="contracted"
                    rules={{
                      required: "Preencha este campo",
                      validate: isValueGreaterThenZero,
                    }}
                    render={({
                      field: { onChange, onBlur, value },
                      fieldState: { error },
                    }) => (
                      <NumericFormat
                        value={value}
                        customInput={TextField}
                        label="Demanda *"
                        fullWidth
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">kW</InputAdornment>
                          ),
                        }}
                        type="text"
                        allowNegative={false}
                        isAllowed={({ floatValue }) =>
                          !floatValue || floatValue <= 9999999.99
                        }
                        decimalScale={2}
                        decimalSeparator=","
                        thousandSeparator={"."}
                        error={Boolean(error)}
                        helperText={error?.message ?? " "}
                        onValueChange={(values) => onChange(values.floatValue)}
                        onBlur={onBlur}
                      />
                    )}
                  />
                </Grid>
              ) : (
                <Box>
                  <Grid item xs={8}>
                    <Controller
                      control={control}
                      name="peakContractedDemandInKw"
                      rules={{
                        required: "Preencha este campo",
                        validate: isValueGreaterThenZero,
                      }}
                      render={({
                        field: { onChange, onBlur, value },
                        fieldState: { error },
                      }) => (
                        <NumericFormat
                          value={value}
                          customInput={TextField}
                          label="Dema. Ponta *"
                          fullWidth
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">kW</InputAdornment>
                            ),
                          }}
                          type="text"
                          allowNegative={false}
                          isAllowed={({ floatValue }) =>
                            !floatValue || floatValue <= 9999999.99
                          }
                          decimalScale={2}
                          decimalSeparator=","
                          thousandSeparator={"."}
                          error={Boolean(error)}
                          helperText={error?.message ?? " "}
                          onValueChange={(values) =>
                            onChange(values.floatValue)
                          }
                          onBlur={onBlur}
                        />
                      )}
                    />
                  </Grid>

                  <Grid item xs={8}>
                    <Controller
                      control={control}
                      name="offPeakContractedDemandInKw"
                      rules={{
                        required: "Preencha este campo",
                        validate: isValueGreaterThenZero,
                      }}
                      render={({
                        field: { onChange, onBlur, value },
                        fieldState: { error },
                      }) => (
                        <NumericFormat
                          value={value}
                          customInput={TextField}
                          label="Dem. Fora Ponta *"
                          fullWidth
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">kW</InputAdornment>
                            ),
                          }}
                          type="text"
                          allowNegative={false}
                          isAllowed={({ floatValue }) =>
                            !floatValue || floatValue <= 9999999.99
                          }
                          decimalScale={2}
                          decimalSeparator=","
                          thousandSeparator={"."}
                          error={Boolean(error)}
                          helperText={error?.message ?? " "}
                          onValueChange={(values) =>
                            onChange(values.floatValue)
                          }
                          onBlur={onBlur}
                        />
                      )}
                    />
                  </Grid>
                  {!shouldShowGreenDemand && (
                    <Typography variant="body2" sx={{ px: 2 }}>
                      O valor de tensão contratada inserido é compatível apenas
                      com a modalidade azul
                    </Typography>
                  )}
                </Box>
              )}
            </Box>
          </Paper>

          <Paper>
            <Box mb={4} p={2}>
              <Grid container spacing={2}>
                <Grid
                  item
                  xs={12}
                  display="flex"
                  flexDirection={"row"}
                  justifyContent={"begin"}
                  alignItems={"center"}
                >
                  <Typography variant="h5">Geração de energia</Typography>
                  <Controller
                    name="shouldShowInstalledPower"
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <FormControl>
                        <FormControlLabel
                          sx={{ marginLeft: 0.5 }}
                          control={
                            <Switch
                              value={value}
                              defaultChecked={shouldShowInstalledPower}
                              onChange={onChange}
                            />
                          }
                        />
                      </FormControl>
                    )}
                  />
                </Grid>
                {shouldShowInstalledPower ? (
                  <>
                    <Grid item xs={12}>
                      <Alert severity="info" variant="standard">
                        Insira o valor total da potência de geração instalada na
                        Unidade Consumidora. Some a potência de todas as plantas
                        fotovoltaicas instaladas, se houver mais de uma.
                      </Alert>
                    </Grid>

                    <Grid item xs={12}>
                      <Controller
                        control={control}
                        name="totalInstalledPower"
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
                            value={value}
                            customInput={TextField}
                            label="Potência Instalada *"
                            fullWidth
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position="end">
                                  kW
                                </InputAdornment>
                              ),
                            }}
                            type="text"
                            allowNegative={false}
                            isAllowed={({ floatValue }) =>
                              !floatValue || floatValue <= 99999.99
                            }
                            decimalScale={2}
                            decimalSeparator=","
                            thousandSeparator={"."}
                            error={Boolean(error)}
                            helperText={error?.message ?? " "}
                            onValueChange={(values) =>
                              onChange(values.floatValue)
                            }
                            onBlur={onBlur}
                          />
                        )}
                      />
                    </Grid>
                  </>
                ) : null}
              </Grid>
            </Box>
          </Paper>
        </>
      </FormDrawerV2>
      <FormWarningDialog
        open={shouldShowCancelDialog}
        entity={"unidade consumidora"}
        onClose={handleCloseDialog}
        onDiscard={handleDiscardForm}
        type="create"
      />

      <DistributorCreateFormDialog
        open={shouldShowDistributorFormDialog}
        onClose={handleCloseDistributorFormDialog}
      />
    </Fragment>
  );
};

export default ConsumerUnitCreateForm;
