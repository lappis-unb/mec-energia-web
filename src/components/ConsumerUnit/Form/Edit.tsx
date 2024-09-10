import { Fragment, useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { NumericFormat } from "react-number-format";
import { isAfter, isFuture, isValid } from "date-fns";
import {
  Alert,
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  FormGroup,
  Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";

import {
  selectIsConsumerUnitEditFormOpen,
  setIsConsumerUnitEditFormOpen,
  selectActiveConsumerUnitId,
  setIsSuccessNotificationOpen,
  setIsErrorNotificationOpen,
} from "@/store/appSlice";
import {
  EditConsumerUnitForm,
  EditConsumerUnitRequestPayload,
} from "@/types/consumerUnit";
import FormWarningDialog from "@/components/ConsumerUnit/Form/WarningDialog";
import {
  useEditConsumerUnitMutation,
  useGetConsumerUnitQuery,
  useGetContractQuery,
  useGetDistributorsQuery,
  useGetSubgroupsQuery,
} from "@/api";
import { useSession } from "next-auth/react";
import { DistributorPropsTariffs } from "@/types/distributor";
import DistributorCreateFormDialog from "@/components/Distributor/Form/CreateForm";
import { skipToken } from "@reduxjs/toolkit/dist/query";
import { sendFormattedDate } from "@/utils/date";
import { isInSomeSubgroups } from "@/utils/validations/form-validations";
import FormDrawerV2 from "@/components/Form/DrawerV2";
import FlashOnIcon from "@mui/icons-material/FlashOn";
import FormFieldError from "@/components/FormFieldError";
import { minimumDemand } from "@/utils/tariff";

const defaultValues: EditConsumerUnitForm = {
  isActive: true,
  name: "",
  code: "",
  distributor: "",
  startDate: new Date(),
  supplyVoltage: "",
  tariffFlag: "B",
  peakContractedDemandInKw: "",
  offPeakContractedDemandInKw: "",
  totalInstalledPower: null,
  shouldShowInstalledPower: true,
};

const ConsumerUnitEditForm = () => {
  const dispatch = useDispatch();
  const isEditFormOpen = useSelector(selectIsConsumerUnitEditFormOpen);
  const activeConsumerUnit = useSelector(selectActiveConsumerUnitId);
  const [shouldShowDistributorFormDialog, setShouldShowDistributorFormDialog] =
    useState(false);
  const [shouldShowCancelDialog, setShouldShowCancelDialog] = useState(false);
  const [shouldShowGreenDemand, setShouldShowGreenDemand] = useState(true);
  // const [shouldShowInstalledPower, setShouldShowInstalledPower] = useState(false);

  const { data: session } = useSession();
  const { data: subgroupsList } = useGetSubgroupsQuery();
  const { data: distributorList } = useGetDistributorsQuery(
    session?.user?.universityId || skipToken
  );
  const [currentDistributor, setCurrentDistributor] = useState();

  const handleDistributorChange = (event) => {
    const selectedDistributor = event.id || event.target.value;
        
    setCurrentDistributor(selectedDistributor);
    setValue("distributor", selectedDistributor);
  };

  const mappedDistributorList = distributorList?.map((distributor) => {
    const idCopy = distributor.id || distributor.value;
    const valueCopy = distributor.value || distributor.id;
  
    return {
      ...distributor,
      id: idCopy,
      value: valueCopy,
    };
  });  
  
  const sortedDistributorList = mappedDistributorList?.slice().sort((a, b) => 
    a.name.localeCompare(b.name)
  );
  const { data: contract } = useGetContractQuery(
    activeConsumerUnit || skipToken
  );
  const { data: consumerUnit, refetch: refetchConsumerUnit } =
    useGetConsumerUnitQuery(activeConsumerUnit || skipToken);
  const [
    editConsumerUnit,
    { isError, isSuccess, isLoading, reset: resetMutation },
  ] = useEditConsumerUnitMutation();

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
  const supplyVoltage = watch("supplyVoltage");
  const peakContractedDemandInKw = watch("peakContractedDemandInKw");
  const offPeakContractedDemandInKw = watch("offPeakContractedDemandInKw");
  const isActive = watch("isActive");
  const shouldShowInstalledPower = watch("shouldShowInstalledPower");

  useEffect(() => {
    if (isEditFormOpen && consumerUnit && contract) {
      const fetchData = async () => {
        try {
          const { data: consumerUnit } = await refetchConsumerUnit();

          if (!consumerUnit || !contract) {
            return;
          }

          setValue("name", consumerUnit?.name ?? "");
          setValue("isActive", true);
          setValue("code", consumerUnit?.code ?? "");
          setValue("distributor", contract?.distributor);
          setValue("supplyVoltage", contract?.supplyVoltage);
          setValue(
            "shouldShowInstalledPower",
            consumerUnit?.totalInstalledPower != null
          );
          setValue("totalInstalledPower", consumerUnit?.totalInstalledPower);

          if (contract?.supplyVoltage === 69) {
            setShouldShowGreenDemand(false);
          } else if (
            contract?.supplyVoltage >= 88 &&
            contract?.supplyVoltage <= 138
          ) {
            setShouldShowGreenDemand(false);
          } else {
            setShouldShowGreenDemand(true);
          }
          setValue(
            "peakContractedDemandInKw",
            contract?.peakContractedDemandInKw
          );
          setValue(
            "offPeakContractedDemandInKw",
            contract?.offPeakContractedDemandInKw
          );

          const currentDate = new Date(contract?.startDate);
          currentDate.setDate(currentDate.getDate() + 1);
          setValue("startDate", currentDate);
        } catch (err) {
          console.error("Failed to refetch:", err);
        }
      };

      // Garante que o refetch não seja executado antes do fetch
      if (isEditFormOpen) {
        fetchData();
      }
    }
  }, [isEditFormOpen, consumerUnit, contract, setValue], refetchConsumerUnit);

  useEffect(() => {
    setValue("isActive", isActive);
    if (supplyVoltage === undefined) {
      setValue("supplyVoltage", "");
      return;
    }
    if (peakContractedDemandInKw === undefined) {
      setValue("peakContractedDemandInKw", "");
      return;
    }
    if (offPeakContractedDemandInKw === undefined) {
      setValue("offPeakContractedDemandInKw", "");
      return;
    }
  }, [
    isActive,
    offPeakContractedDemandInKw,
    peakContractedDemandInKw,
    setValue,
    supplyVoltage,
  ]);

  useEffect(() => {
    // Verifica se shouldShowGreenDemand é false
    if (!shouldShowGreenDemand) {
      // Atualiza o estado tariffFlag para "B" (azul)
      setValue("tariffFlag", "B");
    }
  }, [shouldShowGreenDemand, setValue]);

  useEffect(() => {
    setValue("tariffFlag", contract?.tariffFlag ?? "B");
  }, [isEditFormOpen, contract?.tariffFlag, setValue]);

  // Validações

  const isValidDate = (date: EditConsumerUnitForm["startDate"]) => {
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

  const hasEnoughCaracteresLength = (
    value: EditConsumerUnitForm["code"] | EditConsumerUnitForm["name"]
  ) => {
    if (value.length < 3) return "Insira ao menos 3 caracteres";
    return true;
  };

  const handleCloseDialog = useCallback(() => {
    setShouldShowCancelDialog(false);
  }, []);

  const handleDiscardForm = useCallback(() => {
    handleCloseDialog();
    reset();
    dispatch(setIsConsumerUnitEditFormOpen(false));
  }, [dispatch, handleCloseDialog, reset]);

  const handleCancelEdition = useCallback(() => {
    if (isDirty) {
      setShouldShowCancelDialog(true);
      return;
    }

    handleDiscardForm();
  }, [handleDiscardForm, isDirty]);

  const onSubmitHandler: SubmitHandler<EditConsumerUnitForm> = useCallback(
    async (data) => {
      if (data.tariffFlag === "G") {
        data.offPeakContractedDemandInKw = data.peakContractedDemandInKw;
      }
      const body: EditConsumerUnitRequestPayload = {
        consumerUnit: {
          consumerUnitId: activeConsumerUnit as number,
          name: data.name,
          code: data.code,
          isActive: data.isActive,
          university: session?.user.universityId || 0,
          totalInstalledPower: !data.shouldShowInstalledPower
            ? null
            : data.totalInstalledPower,
        },
        contract: {
          contractId: contract?.id as number,
          startDate: data.startDate ? sendFormattedDate(data.startDate) : "",
          tariffFlag: data.tariffFlag,
          peakContractedDemandInKw: data.peakContractedDemandInKw as number,
          offPeakContractedDemandInKw:
            data.offPeakContractedDemandInKw as number,
          supplyVoltage: data.supplyVoltage as number,
          distributor: data.distributor as number,
        },
      };
      await editConsumerUnit(body);
    },
    [
      activeConsumerUnit,
      contract?.id,
      editConsumerUnit,
      session?.user.universityId,
    ]
  );

  //Notificações

  const handleNotification = useCallback(() => {
    if (isSuccess) {
      dispatch(
        setIsSuccessNotificationOpen({
          isOpen: true,
          text: "Unidade consumidora modificada com sucesso!",
        })
      );
      reset();
      resetMutation();
      dispatch(setIsConsumerUnitEditFormOpen(false));
    } else if (isError) {
      dispatch(
        setIsErrorNotificationOpen({
          isOpen: true,
          text: "Erro ao editar unidade consumidora. Verifique se já existe uma unidade com o mesmo nome ou código",
        })
      );
      resetMutation();
    }
  }, [dispatch, isError, isSuccess, reset, resetMutation]);

  useEffect(() => {
    handleNotification();
  }, [handleNotification]);

  const handleCloseDistributorFormDialog = () => {
    setShouldShowDistributorFormDialog(false);
  };

  const handleNumericInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    onChange: (value: string) => void
  ) => {
    const numericValue = e.target.value.replace(/\D/g, "");
    onChange(numericValue);
  };

  const ConsumerUnitSection = useCallback(
    () => (
      <>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h5">Unidade Consumidora</Typography>
          </Grid>

          <Grid item xs={12}>
            <Controller
              control={control}
              name="name"
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
                  helperText={FormFieldError(error?.message)}
                  fullWidth
                  onChange={onChange}
                  onBlur={onBlur}
                  inputProps={{ maxLength: 50 }}
                />
              )}
            />
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <Controller
            name="isActive"
            control={control}
            render={({ field: { onChange, value } }) => (
              <FormGroup>
                <Box
                  display="flex"
                  justifyContent="flex-start"
                  alignItems="center"
                  marginTop={0}
                  style={{ marginTop: 0, paddingTop: 0 }}
                >
                  <FlashOnIcon color="primary" />
                  {consumerUnit && (
                    <FormControlLabel
                      label="Unidade ativa"
                      labelPlacement="start"
                      sx={{ margin: 0.5 }}
                      control={
                        <Box>
                          <Switch
                            value={value}
                            defaultChecked={consumerUnit?.isActive}
                            onChange={onChange}
                          />
                        </Box>
                      }
                    />
                  )}
                </Box>

                <FormHelperText>
                  <p>
                    Só unidades ativas geram recomendações e recebem faturas. Não é
                    possível excluir unidades, apenas desativá-las.
                  </p>
                </FormHelperText>
              </FormGroup>
            )}
          />
        </Grid>
      </>
    ),
    [consumerUnit?.isActive, control]
  );

  const ContractSection = useCallback(
    () => (
      <>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h5">Contrato</Typography>
          </Grid>

          <Grid item xs={12}>
            <Alert severity="warning" variant="standard">
              Modifique o contrato apenas em caso de erro de digitação. Para
              alterações legais ou novo contrato, use a opção{" "}
              <strong>Renovar</strong> na tela anterior.
            </Alert>
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
                    FormFieldError(
                      error?.message,
                      "Nº ou código da Unidade Consumidora conforme a fatura"
                    )
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
                field: { onBlur, ref },
                fieldState: { error },
              }) => (
                <FormControl
                  sx={{ minWidth: "200px", maxWidth: "100%" }}
                  error={!!error}
                >
                  <InputLabel>Distribuidora *</InputLabel>

                  <Select
                    ref={ref}
                    value={currentDistributor}
                    label="Distribuidora *"
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
                    onChange={handleDistributorChange}
                    onBlur={onBlur}
                  >

                    {sortedDistributorList?.map(
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

                  <FormHelperText>{FormFieldError(error?.message)}</FormHelperText>
                </FormControl>
              )}
            />
          </Grid>

          <Grid item xs={12}>
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
                  label="Início da vigência *"
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
                      helperText={FormFieldError(error?.message)}
                      error={!!error}
                    />
                  )}
                  onChange={onChange}
                />
              )}
            />
          </Grid>

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
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <NumericFormat
                  value={value}
                  customInput={TextField}
                  label="Tensão contratada *"
                  helperText={
                    FormFieldError(
                      error?.message,
                      "Se preciso, converta a tensão de V para kV dividindo o valor por 1.000."
                    )
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
                    } else if (
                      newVoltage !== undefined &&
                      newVoltage >= 88 &&
                      newVoltage <= 138
                    ) {
                      setShouldShowGreenDemand(false);
                    } else {
                      setShouldShowGreenDemand(true);
                    }
                    onChange(values.floatValue);
                  }}
                />
              )}
            />
          </Grid>
        </Grid>
      </>
    ),
    [control, sortedDistributorList, currentDistributor, handleDistributorChange]

  );

  const ContractedDemand = useCallback(
    () => (
      <>
        <Grid item xs={12}>
          <Typography variant="h5">Demanda contratada</Typography>
        </Grid>
        <Grid item xs={12}>
          <Controller
            control={control}
            name="tariffFlag"
            rules={{ required: "Preencha este campo" }}
            render={({ field: { value, onChange }, fieldState: { error } }) => (
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
              name="peakContractedDemandInKw"
              rules={{
                required: "Preencha este campo",
                min: minimumDemand,
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
                  helperText={FormFieldError(error?.message)}
                  onValueChange={(values) => onChange(values.floatValue)}
                  onBlur={onBlur}
                />
              )}
            />
          </Grid>
        ) : (
          <>
            <Grid item xs={7}>
              <Controller
                control={control}
                name="peakContractedDemandInKw"
                rules={{
                  required: "Preencha este campo",
                  min: minimumDemand,
                }}
                render={({
                  field: { onChange, onBlur, value },
                  fieldState: { error },
                }) => (
                  <NumericFormat
                    value={value}
                    customInput={TextField}
                    label="Dem. Ponta *"
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
                    helperText={FormFieldError(error?.message)}
                    onValueChange={(values) => onChange(values.floatValue)}
                    onBlur={onBlur}
                  />
                )}
              />
            </Grid>

            <Grid item xs={7} mt={0.3}>
              <Controller
                control={control}
                name="offPeakContractedDemandInKw"
                rules={{
                  required: "Preencha este campo",
                  min: minimumDemand,
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
                    helperText={FormFieldError(error?.message)}
                    onValueChange={(values) => onChange(values.floatValue)}
                    onBlur={onBlur}
                  />
                )}
              />
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
    [control, tariffFlag, shouldShowGreenDemand, sortedDistributorList]
  );

  const InstalledPower = useCallback(
    () => (
      <>
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
                      helperText={FormFieldError(error?.message)}
                      onValueChange={(values) => onChange(values.floatValue)}
                      onBlur={onBlur}
                    />
                  )}
                />
              </Grid>
            </>
          ) : null}
        </Grid>
      </>
    ),
    [control, shouldShowInstalledPower]
  );

  return (
    <Fragment>
      <FormDrawerV2
        open={isEditFormOpen}
        title={"Editar Unidade Consumidora"}
        errorsLength={Object.keys(errors).length}
        isLoading={isLoading}
        handleCloseDrawer={handleCancelEdition}
        handleSubmitDrawer={handleSubmit(onSubmitHandler)}
        sections={[
          <ConsumerUnitSection key={0} />,
          <ContractSection key={1} />,
          <ContractedDemand key={2} />,
          <InstalledPower key={3} />,
        ]}
        header={<></>}
      />

      <FormWarningDialog
        open={shouldShowCancelDialog}
        onClose={handleCloseDialog}
        onDiscard={handleDiscardForm}
        entity={"unidade consumidora"}
        type="update"
      />

      <DistributorCreateFormDialog
        open={shouldShowDistributorFormDialog}
        onClose={handleCloseDistributorFormDialog}
        handleDistributorChange={handleDistributorChange}
      />
    </Fragment>
  );
};

export default ConsumerUnitEditForm;
