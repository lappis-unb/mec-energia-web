import { Fragment, useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { isAfter, isFuture, isValid } from "date-fns";

import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { NumericFormat } from "react-number-format";

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

import {
  selectActiveConsumerUnitId,
  selectIsConsumerUnitRenewContractFormOpen,
  setIsConsumerUnitRenewContractFormOpen as setIsRenewContractFormOpen,
  setIsErrorNotificationOpen,
  setIsSuccessNotificationOpen,
} from "@/store/appSlice";
import {
  RenewContractForm,
  RenewContractRequestPayload,
} from "@/types/contract";
import FormWarningDialog from "@/components/ConsumerUnit/Form/WarningDialog";
import {
  useGetConsumerUnitQuery,
  useGetDistributorsQuery,
  useGetSubgroupsQuery,
  useRenewContractMutation,
} from "@/api";
import { useSession } from "next-auth/react";
import { DistributorPropsTariffs } from "@/types/distributor";
import DistributorCreateFormDialog from "@/components/Distributor/Form/CreateForm";
import { skipToken } from "@reduxjs/toolkit/dist/query";
import { sendFormattedDate } from "@/utils/date";
import { getSubgroupsText } from "@/utils/get-subgroup-text";
import { isInSomeSubgroups } from "@/utils/validations/form-validations";
import FormDrawerV2 from "@/components/Form/DrawerV2";
import FormConfirmDialog from "./WarningDialogConfirm";

const defaultValues: RenewContractForm = {
  code: "",
  distributor: "",
  startDate: null,
  supplyVoltage: "",
  tariffFlag: "G",
  contracted: "",
  peakContractedDemandInKw: "",
  offPeakContractedDemandInKw: "",
};

const ConsumerUnitRenewContractForm = () => {
  //Sessão
  const { data: session } = useSession();

  // Redux
  const dispatch = useDispatch();
  const isRenewContractFormOpen = useSelector(
    selectIsConsumerUnitRenewContractFormOpen
  );
  const activeConsumerUnit = useSelector(selectActiveConsumerUnitId);

  //Requisições Redux Query
  const { data: subgroupsList } = useGetSubgroupsQuery();
  const { data: distributorList } = useGetDistributorsQuery(
    session?.user?.universityId || skipToken
  );
  const [
    renewContract,
    { isError, isSuccess, isLoading, reset: resetMutation },
  ] = useRenewContractMutation();
  const { data: consumerUnit } = useGetConsumerUnitQuery(
    activeConsumerUnit || skipToken
  );

  //Estados
  const [shouldShowCancelDialog, setShouldShowCancelDialog] = useState(false);
  const [showShowConfirmDialog, setShouldShowConfirmDialog] = useState(false);
  const [shouldShowDistributorFormDialog, setShouldShowDistributorFormDialog] =
    useState(false);
  const [shouldShowGreenDemand, setShouldShowGreenDemand] = useState(true);

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

  useEffect(() => {
    if (isRenewContractFormOpen) {
      const {
        contracted,
        peakContractedDemandInKw,
        offPeakContractedDemandInKw,
      } = defaultValues;
      setValue("code", consumerUnit?.code as string);

      if (!shouldShowGreenDemand) {
        setValue("peakContractedDemandInKw", getValues("contracted"));
        setValue("offPeakContractedDemandInKw", getValues("contracted"));
      } else {
        setValue("contracted", contracted);
        setValue("peakContractedDemandInKw", peakContractedDemandInKw);
        setValue("offPeakContractedDemandInKw", offPeakContractedDemandInKw);
      }
    }
  }, [consumerUnit?.code, isRenewContractFormOpen, setValue, tariffFlag]);

  useEffect(() => {
    // Verifica se shouldShowGreenDemand é false
    if (!shouldShowGreenDemand) {
      // Atualiza o estado tariffFlag para "B" (azul)
      setValue("tariffFlag", "B");
    }

  }, [shouldShowGreenDemand]);

  // Validações de Formulário
  const isValidDate = (date: RenewContractForm["startDate"]) => {
    if (!date || !isValid(date)) {
      return "Data inválida";
    }

    if (isFuture(date)) {
      return "Datas futuras não são permitidas";
    }

    if (!isAfter(date, new Date("2010"))) {
      return "Datas antes de 2010 não são permitidas";
    }

    return true;
  };

  const hasEnoughCaracteresLength = (value: RenewContractForm["code"]) => {
    if (value.length < 3) return "Insira ao menos 3 caracteres";
    return true;
  };

  const isValueGreaterThenZero = (
    value:
      | RenewContractForm["peakContractedDemandInKw"]
      | RenewContractForm["offPeakContractedDemandInKw"]
  ) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (value <= 0) return "Insira um valor maior que 0";
  };

  const handleCloseDialog = () => {
    setShouldShowCancelDialog(false);
    setShouldShowConfirmDialog(false);
  };

  const handleCancelEdition = () => {
    if (isDirty) {
      setShouldShowCancelDialog(true);
      return;
    }

    handleDiscardForm();
  };
  const handleDiscardForm = () => {
    handleCloseDialog();
    reset();
    dispatch(setIsRenewContractFormOpen(false));
  };

  const onSubmitHandler: SubmitHandler<RenewContractForm> = async (data) => {
    setShouldShowConfirmDialog(false);
    if (data.tariffFlag === "G") {
      data.offPeakContractedDemandInKw = data.contracted;
      data.peakContractedDemandInKw = data.contracted;
    }
    const formattedDate = sendFormattedDate(data.startDate as Date);
    const body: RenewContractRequestPayload = {
      consumerUnit: activeConsumerUnit as number,
      code: data.code,
      distributor: data.distributor as number,
      startDate: formattedDate,
      tariffFlag: data.tariffFlag,
      peakContractedDemandInKw: data.peakContractedDemandInKw as number,
      offPeakContractedDemandInKw: data.offPeakContractedDemandInKw as number,
      supplyVoltage: data.supplyVoltage as number,
    };
    await renewContract(body);
  };

  // Notificações
  const handleNotification = useCallback(() => {
    if (isSuccess) {
      dispatch(
        setIsSuccessNotificationOpen({
          isOpen: true,
          text: "Contrato renovado com sucesso!",
        })
      );
      reset();
      resetMutation();
      dispatch(setIsRenewContractFormOpen(false));
    } else if (isError) {
      dispatch(
        setIsErrorNotificationOpen({
          isOpen: true,
          text: "Erro ao renovar contrato",
        })
      );
      resetMutation();
    }
  }, [dispatch, isError, isSuccess, reset, resetMutation]);

  useEffect(() => {
    handleNotification();
  }, [handleNotification, isSuccess, isError]);

  const handleCloseDistributorFormDialog = () => {
    setShouldShowDistributorFormDialog(false);
  };

  const handleNumericInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    onChange: (value: string) => void
  ) => {
    const numericValue = e.target.value.replace(/\D/g, '');
    onChange(numericValue);
  };

  const Contract = useCallback(
    () => (
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
                onChange={(e) => handleNumericInputChange(e, onChange)}
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
                        <MenuItem key={distributor.id} value={distributor.id}>
                          {distributor.name}
                        </MenuItem>
                      );
                    }
                  )}
                  <MenuItem>
                    <Button
                      onClick={() => setShouldShowDistributorFormDialog(true)}
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
            render={({ field: { value, onChange }, fieldState: { error } }) => (
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
              {subgroupsList ? getSubgroupsText(subgroupsList?.subgroups) : ""}
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
                  thousandSeparator={"."}
                  onValueChange={(values) => {
                    const newVoltage = values ? values.floatValue : 0;
                    if (newVoltage === 69) {
                      setShouldShowGreenDemand(false);
                    } else if (newVoltage !== undefined && newVoltage >= 88 && newVoltage <= 138) {
                      setShouldShowGreenDemand(false);
                    } else {
                      setShouldShowGreenDemand(true);
                    }
                    onChange(values.floatValue);
                  }}
                  onBlur={onBlur}
                />
              )}
            />
          </Grid>
        </Tooltip>
      </>
    ),
    [control, distributorList, subgroupsList]
  );

  const ContractedDemand = useCallback(
    () => (
      <>
        <Grid item xs={12}>
          <Typography variant="h5">Demanda Contratada</Typography>
        </Grid>

        <Grid item xs={12}>
          <Controller
            control={control}
            name="tariffFlag"
            rules={{ required: "Preencha este campo" }}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
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
                    !floatValue || floatValue <= 99999.99
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
          <>
          <Grid item xs={12} container spacing={2}>
          <Grid item xs={6}>
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
              thousandSeparator={"."}
              error={Boolean(error)}
              helperText={error?.message ?? " "}
              onValueChange={(values) => onChange(values.floatValue)}
              onBlur={onBlur}
            />
          )}
        />
      </Grid>
      <Grid item xs={6}>
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
              label="De. Ponta *"
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
              thousandSeparator={"."}
              error={Boolean(error)}
              helperText={error?.message ?? " "}
              onValueChange={(values) => onChange(values.floatValue)}
              onBlur={onBlur}
            />
          )}
        />
      </Grid>
    </Grid>
              {!shouldShowGreenDemand && (
                <Typography variant="body2" sx={{ px: 2 }}>
                  O valor de tensão contratada inserido é compatível apenas com a
                  modalidade azul
                </Typography>
              )}
            </>
          )}
        </>
    ),
    [control, tariffFlag, shouldShowGreenDemand]
  );

  return (
    <Fragment>
      <FormDrawerV2
        open={isRenewContractFormOpen}
        title={"Renovar Contrato"}
        errorsLength={Object.keys(errors).length}
        isLoading={isLoading}
        handleCloseDrawer={handleCancelEdition}
        handleSubmitDrawer={handleSubmit(onSubmitHandler)}
        header={<></>}
        sections={[<Contract key={0} />, <ContractedDemand key={1} />]}
      />

      <FormWarningDialog
        entity="contrato"
        open={shouldShowCancelDialog}
        onClose={handleCloseDialog}
        onDiscard={handleDiscardForm}
        type="create"
      />

      <FormConfirmDialog
        open={showShowConfirmDialog}
        onClose={handleCloseDialog}
        onSave={handleSubmit(onSubmitHandler)}
      />

      <DistributorCreateFormDialog
        open={shouldShowDistributorFormDialog}
        onClose={handleCloseDistributorFormDialog}
      />
    </Fragment>
  );
};

export default ConsumerUnitRenewContractForm;