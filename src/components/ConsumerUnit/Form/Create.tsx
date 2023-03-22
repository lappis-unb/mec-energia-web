import { Fragment, useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Controller,
  SubmitHandler,
  useForm,
} from "react-hook-form";
import {
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
  Radio,
  RadioGroup,
  Select,
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
  const [
    createConsumerUnit,
    { status, isError, isSuccess, isLoading, reset: resetMutation },
  ] = useCreateConsumerUnitMutation();

  //Estados
  const [shouldShowCancelDialog, setShouldShowCancelDialog] = useState(false);
  const [shouldShowDistributorFormDialog, setShouldShowDistributorFormDialog] =
    useState(false);

  //Formulário
  const form = useForm({ mode: "all", defaultValues });
  const {
    control,
    reset,
    handleSubmit,
    watch,
    setValue,
    formState: { isDirty, errors },
  } = form;

  const tariffFlag = watch("tariffFlag");

  useEffect(() => {
    const {
      contracted,
      peakContractedDemandInKw,
      offPeakContractedDemandInKw,
    } = defaultValues;

    setValue("contracted", contracted);
    setValue("peakContractedDemandInKw", peakContractedDemandInKw);
    setValue("offPeakContractedDemandInKw", offPeakContractedDemandInKw);
  }, [setValue, tariffFlag]);

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

  const hasEnoughCaracteresLength = (
    value: CreateConsumerUnitForm["code"] | CreateConsumerUnitForm["name"]
  ) => {
    if (value.length < 3) return "Insira ao menos 3 caracteres";
    return true;
  };

  const isValueGreaterThenZero = (
    value:
      | CreateConsumerUnitForm["peakContractedDemandInKw"]
      | CreateConsumerUnitForm["offPeakContractedDemandInKw"]
  ) => {
    if (value <= 0) return "Insira um valor maior que 0";
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


  const ConsumerUnitSection = useCallback(() => (
    <>
      <Grid item xs={12}>
        <Typography variant="h5">Unidade Consumidora</Typography>
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
            />
          )}
        />
      </Grid>
    </>
  ), [control]);

  const ContractSection = useCallback(() => (
    <>
      <Grid item xs={12}>
        <Typography variant="h5">Contrato</Typography>
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
              onChange={onChange}
              onBlur={onBlur}
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
              bgcolor: "warning.main",
              color: "warning.contrastText",
              "& .MuiTooltip-arrow": {
                color: "warning.main",
              },
            },
          },
        }}
        title={
          <div style={{ whiteSpace: "pre-line" }}>
            {subgroupsList
              ? getSubgroupsText(subgroupsList?.subgroups)
              : ""}
          </div>
        }
        arrow
        placement="right"
        sx={{ color: "red" }}
      >
        <Grid item xs={8} sm={6}>
          <Controller
            control={control}
            name={"supplyVoltage"}
            rules={{
              required: "Preencha este campo",
              validate: (v) =>
                isInSomeSubgroups(v, subgroupsList?.subgroups || []),
            }}
            render={({
              field: { onChange, onBlur, value },
              fieldState: { error },
            }) => (
              <NumericFormat
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
                    <InputAdornment position="end">kV</InputAdornment>
                  ),
                }}
                type="text"
                allowNegative={false}
                isAllowed={({ floatValue }) =>
                  !floatValue || floatValue <= 9999.99
                }
                decimalScale={2}
                decimalSeparator=","
                thousandSeparator={" "}
                onValueChange={(values) => onChange(values.floatValue)}
                onBlur={onBlur}
              />
            )}
          />
        </Grid>
      </Tooltip>
    </>
  ), [control, distributorList, subgroupsList]);

  const ContractedDemandSection = useCallback(() => (
    <>
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
                  !floatValue || floatValue <= 99999.99
                }
                decimalScale={2}
                decimalSeparator=","
                thousandSeparator={" "}
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
                    !floatValue || floatValue <= 99999.99
                  }
                  decimalScale={2}
                  decimalSeparator=","
                  thousandSeparator={" "}
                  error={Boolean(error)}
                  helperText={error?.message ?? " "}
                  onValueChange={(values) => onChange(values.floatValue)}
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
                    !floatValue || floatValue <= 99999.99
                  }
                  decimalScale={2}
                  decimalSeparator=","
                  thousandSeparator={" "}
                  error={Boolean(error)}
                  helperText={error?.message ?? " "}
                  onValueChange={(values) => onChange(values.floatValue)}
                  onBlur={onBlur}
                />
              )}
            />
          </Grid>
        </Box>
      )}
    </>
  ), [control, tariffFlag])

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
        sections={[
          <ConsumerUnitSection key={0} />,
          <ContractSection key={1} />,
          <ContractedDemandSection key={2} />,
        ]}
      />

      <FormWarningDialog
        open={shouldShowCancelDialog}
        entity={"unidade consumidora"}
        onClose={handleCloseDialog}
        onDiscard={handleDiscardForm}
      />

      <DistributorCreateFormDialog
        open={shouldShowDistributorFormDialog}
        onClose={handleCloseDistributorFormDialog}
      />

    </Fragment>
  )
};

export default ConsumerUnitCreateForm;
