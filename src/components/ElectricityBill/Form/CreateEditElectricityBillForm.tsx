import {
  Box,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  Grid,
  InputAdornment,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import React, { Fragment, useCallback, useEffect, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import {
  selectActiveConsumerUnitId,
  selectEnergyBillParams,
  selectIsEnergyBillCreateFormOpen,
  selectIsEnergyBillEditFormOpen,
  setIsEnergyBillCreateFormOpen,
  setIsEnergyBillEdiFormOpen,
  setIsErrorNotificationOpen,
  setIsSuccessNotificationOpen,
  setEnergyBillEdiFormParams,
} from "../../../store/appSlice";
import { DatePicker } from "@mui/x-date-pickers";
import { NumericFormat } from "react-number-format";
import FormWarningDialog from "../../ConsumerUnit/Form/WarningDialog";
import {
  CreateAndEditEnergyBillForm,
  EditEnergyBillRequestPayload,
  PostEnergyBillRequestPayload,
} from "@/types/energyBill";
import InsightsIcon from "@mui/icons-material/Insights";
import {
  useEditInvoiceMutation,
  useGetConsumerUnitQuery,
  useGetContractQuery,
  useGetCurrentInvoiceQuery,
  useGetDistributorsQuery,
  usePostInvoiceMutation,
} from "@/api";
import { skipToken } from "@reduxjs/toolkit/dist/query";
import { useSession } from "next-auth/react";
import { DistributorPropsTariffs } from "@/types/distributor";
import { sendFormattedDate } from "@/utils/date";
import FormDrawerV2 from "@/components/Form/DrawerV2";

import CloudUploadIcon from '@mui/icons-material/CloudUpload'; // Importe o ícone do Material-UI
import Button from '@mui/material/Button';


const defaultValues: CreateAndEditEnergyBillForm = {
  date: new Date(),
  invoiceInReais: "",
  isIncludedInAnalysis: true,
  peakMeasuredDemandInKw: "",
  peakConsumptionInKwh: "",
  offPeakConsumptionInKwh: "",
};

const CreateEditEnergyBillForm = () => {
  const session = useSession();
  const dispatch = useDispatch();
  const isCreateEnergyBillFormOpen = useSelector(
    selectIsEnergyBillCreateFormOpen
  );
  const isEditEnergyBillFormOpen = useSelector(selectIsEnergyBillEditFormOpen);
  const {
    month,
    year,
    id: currentInvoiceId,
  } = useSelector(selectEnergyBillParams);
  const activeConsumerUnitId = useSelector(selectActiveConsumerUnitId);
  const [shouldShowCancelDialog, setShouldShowCancelDialog] = useState(false);
  const [
    postInvoice,
    {
      isError: isPostInvoiceError,
      isSuccess: isPostInvoiceSuccess,
      isLoading: isPostInvoiceLoading,
      reset: resetPostMutation,
    },
  ] = usePostInvoiceMutation();
  const [
    editInvoice,
    {
      isError: isEditInvoiceError,
      isSuccess: isEditInvoiceSuccess,
      isLoading: isEditInvoiceLoading,
      reset: resetEditMutation,
    },
  ] = useEditInvoiceMutation();
  const { data: consumerUnit } = useGetConsumerUnitQuery(
    activeConsumerUnitId || skipToken
  );
  const { data: contract } = useGetContractQuery(
    activeConsumerUnitId || skipToken
  );
  const { data: distributors } = useGetDistributorsQuery(
    session.data?.user.universityId || skipToken
  );
  const { data: currentInvoice } = useGetCurrentInvoiceQuery(
    currentInvoiceId || skipToken
  );

  const [currentDistributor, setCurrentDistributor] =
    useState<DistributorPropsTariffs>();

  const form = useForm({ defaultValues });
  const {
    control,
    reset,
    handleSubmit,
    setValue,
    watch,
    formState: { isDirty, errors },
  } = form;

  //const date = watch("date");
  //const isIncludedInAnalysis = watch("isIncludedInAnalysis");
  const invoiceInReais = watch("invoiceInReais");
  const peakConsumptionInKwh = watch("peakConsumptionInKwh");
  const offPeakConsumptionInKwh = watch("offPeakConsumptionInKwh");
  const peakMeasuredDemandInKw = watch("peakMeasuredDemandInKw");
  const offPeakMeasuredDemandInKw = watch("offPeakMeasuredDemandInKw");

  useEffect(() => {
    if (month != null || month != undefined) {
      const date = new Date(`${year}/${month + 1}`);
      setValue("date", date);
    }
  }, [month, isCreateEnergyBillFormOpen, isEditEnergyBillFormOpen, setValue, year]);

  useEffect(() => {
    if (isCreateEnergyBillFormOpen) {
      setValue("invoiceInReais", "");
      setValue("peakConsumptionInKwh", "");
      setValue("offPeakConsumptionInKwh", "");
      setValue("peakMeasuredDemandInKw", "");
      setValue("offPeakMeasuredDemandInKw", "");
    } else if (isEditEnergyBillFormOpen) {
      setValue("invoiceInReais", currentInvoice?.invoiceInReais.toString());
      setValue("peakConsumptionInKwh", currentInvoice?.peakConsumptionInKwh);
      setValue(
        "offPeakConsumptionInKwh",
        currentInvoice?.offPeakConsumptionInKwh
      );
      setValue(
        "peakMeasuredDemandInKw",
        currentInvoice?.peakMeasuredDemandInKw
      );
      setValue(
        "offPeakMeasuredDemandInKw",
        currentInvoice?.offPeakMeasuredDemandInKw
      );
    }
  }, [
    currentInvoice?.invoiceInReais,
    currentInvoice?.offPeakConsumptionInKwh,
    currentInvoice?.offPeakMeasuredDemandInKw,
    currentInvoice?.peakConsumptionInKwh,
    currentInvoice?.peakMeasuredDemandInKw,
    isCreateEnergyBillFormOpen,
    isEditEnergyBillFormOpen,
    setValue,
  ]);

  useEffect(() => {
    if (isEditEnergyBillFormOpen) {
      if (invoiceInReais === undefined) {
        setValue("invoiceInReais", "");
        return;
      }
      if (peakConsumptionInKwh === undefined) {
        setValue("peakConsumptionInKwh", "");
        return;
      }
      if (offPeakConsumptionInKwh === undefined) {
        setValue("offPeakConsumptionInKwh", "");
        return;
      }
      if (peakMeasuredDemandInKw === undefined) {
        setValue("peakMeasuredDemandInKw", "");
        return;
      }
      if (offPeakMeasuredDemandInKw === undefined) {
        setValue("offPeakMeasuredDemandInKw", "");
        return;
      }
    }
  }, [
    invoiceInReais,
    isEditEnergyBillFormOpen,
    offPeakConsumptionInKwh,
    offPeakMeasuredDemandInKw,
    peakConsumptionInKwh,
    peakMeasuredDemandInKw,
    setValue,
  ]);

  useEffect(() => {
    const distributor = distributors?.find(
      (distributor) => distributor.id === contract?.distributor
    );
    if (distributor) setCurrentDistributor(distributor);
  }, [contract?.distributor, distributors]);

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
    handleCloseFaturaTab();
    if (isCreateEnergyBillFormOpen) {
      dispatch(
        setEnergyBillEdiFormParams({ month: null, year: null, id: null })
      );
      dispatch(setIsEnergyBillCreateFormOpen(false));
    } else {
      dispatch(setIsEnergyBillEdiFormOpen(false));
    }
  };

  const handleCloseDialog = () => {
    setShouldShowCancelDialog(false);
  };

  const onSubmitHandler: SubmitHandler<CreateAndEditEnergyBillForm> = async (
    data
  ) => {
    const {
      date,
      isIncludedInAnalysis,
      invoiceInReais,
      offPeakConsumptionInKwh,
      offPeakMeasuredDemandInKw,
      peakConsumptionInKwh,
      peakMeasuredDemandInKw,
    } = data;

    let body: PostEnergyBillRequestPayload | EditEnergyBillRequestPayload = {
      consumerUnit: consumerUnit?.id ?? 0,
      contract: contract?.id ?? 0,
      date: date ? sendFormattedDate(date) : "",
      isAtypical: !isIncludedInAnalysis,
      invoiceInReais: Number(invoiceInReais),
      offPeakConsumptionInKwh: offPeakConsumptionInKwh as number,
      peakConsumptionInKwh: peakConsumptionInKwh as number,
      peakMeasuredDemandInKw: peakMeasuredDemandInKw as number,
      offPeakMeasuredDemandInKw: offPeakMeasuredDemandInKw as number,
    };

    if (selectedPdfFile) {
      body.pdfBase64 = await convertPdfToBase64(selectedPdfFile);
    }

    if (isEditEnergyBillFormOpen) body = { ...body, id: currentInvoice?.id };

    if (isCreateEnergyBillFormOpen) await postInvoice(body);
    if (isEditEnergyBillFormOpen)
      await editInvoice(body as EditEnergyBillRequestPayload);
  };

  const handleNotification = useCallback(() => {
    if (isCreateEnergyBillFormOpen) {
      if (isPostInvoiceSuccess) {
        dispatch(
          setIsSuccessNotificationOpen({
            isOpen: true,
            text: "Fatura lançada com sucesso!",
          })
        );
        reset();
        resetPostMutation();
        dispatch(setIsEnergyBillCreateFormOpen(false));
      } else if (isPostInvoiceError) {
        dispatch(
          setIsErrorNotificationOpen({
            isOpen: true,
            text: "Erro ao lançar fatura!",
          })
        );
        resetPostMutation();
      }
    } else if (isEditEnergyBillFormOpen) {
      if (isEditInvoiceSuccess) {
        dispatch(
          setIsSuccessNotificationOpen({
            isOpen: true,
            text: "Fatura modificada com sucesso!",
          })
        );
        reset();
        resetEditMutation();
        dispatch(setIsEnergyBillEdiFormOpen(false));
      } else if (isEditInvoiceError) {
        dispatch(
          setIsErrorNotificationOpen({
            isOpen: true,
            text: "Erro ao modificar fatura!",
          })
        );
        resetEditMutation();
      }
    }
  }, [
    dispatch,
    isCreateEnergyBillFormOpen,
    isEditEnergyBillFormOpen,
    isEditInvoiceError,
    isEditInvoiceSuccess,
    isPostInvoiceError,
    isPostInvoiceSuccess,
    reset,
    resetEditMutation,
    resetPostMutation,
  ]);

  useEffect(() => {
    handleNotification();
  }, [handleNotification, isPostInvoiceSuccess, isPostInvoiceError]);

  const Header = useCallback(
    () => (
      <>
        <Typography variant="h4">{consumerUnit?.name}</Typography>
        <Typography>Un. Consumidora: {consumerUnit?.code}</Typography>
        <Typography>Distribuidora: {currentDistributor?.name}</Typography>
      </>
    ),
    [consumerUnit?.code, consumerUnit?.name, currentDistributor?.name]
  );

  const InvoiceSection = useCallback(
    () => (
      <>
        <Grid item xs={8}>
          <Typography variant="h5">Fatura</Typography>
        </Grid>
        <Grid item xs={12}>
          <Controller
            control={control}
            name="date"
            rules={{
              required: "Já existe uma fatura lançada neste mês",
              validate: () => true,
            }}
            render={({ field: { value, onChange }, fieldState: { error } }) => (
              <DatePicker
                inputFormat="MMMM/yyyy"
                value={value}
                label="Mês de referência *"
                minDate={new Date("2010")}
                disableFuture
                renderInput={(params) => (
                  <TextField
                    {...params}
                    inputProps={{
                      ...params.inputProps,
                      placeholder: "mm/aaaa",
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

        <Grid item xs={4}>
          <Controller
            control={control}
            name={"invoiceInReais"}
            rules={{
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
                width="20%"
                customInput={TextField}
                label="Valor total"
                helperText={error?.message ?? "Campo opcional"}
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
                  !floatValue || floatValue <= 99999999.99
                }
                decimalScale={2}
                decimalSeparator=","
                thousandSeparator={"."}
                onValueChange={(values) => onChange(values.floatValue)}
                onBlur={onBlur}
              />
            )}
          />
        </Grid>

        <Grid container mt={2}>
          <Grid item xs={8}>
            <Controller
              name="isIncludedInAnalysis"
              control={control}
              render={({ field: { onChange, value } }) => (
                <FormGroup>
                  <Box>
                    {isCreateEnergyBillFormOpen && (
                      <Box
                        display="flex"
                        justifyContent="flex-start"
                        alignItems="center"
                      >
                        <InsightsIcon color="primary" />
                        <FormControlLabel
                          value="start"
                          label="Incluir na análise"
                          labelPlacement="start"
                          control={
                            <Switch
                              value={value}
                              defaultChecked
                              onChange={onChange}
                            />
                          }
                        />
                      </Box>
                    )}
                    {isEditEnergyBillFormOpen && currentInvoice && (
                      <Box
                        display="flex"
                        justifyContent="flex-start"
                        alignItems="center"
                      >
                        <InsightsIcon color="primary" />
                        <FormControlLabel
                          value="start"
                          label="Incluir na análise"
                          labelPlacement="start"
                          control={
                            <Switch
                              value={value}
                              defaultChecked={!currentInvoice?.isAtypical}
                              onChange={onChange}
                            />
                          }
                        />
                      </Box>
                    )}
                    <FormHelperText>
                      <p>
                        Inclua todas as faturas, exceto casos radicalmente
                        excepcionais como greves ou a pandemia
                      </p>
                    </FormHelperText>
                  </Box>
                </FormGroup>
              )}
            />
          </Grid>
        </Grid>
      </>
    ),
    [
      control,
      currentInvoice,
      isCreateEnergyBillFormOpen,
      isEditEnergyBillFormOpen,
    ]
  );

  const MeasuredDemandSection = useCallback(
    () => (
      <>
        <Grid item xs={8} mb={2}>
          <Typography variant="h5">Demanda medida</Typography>
        </Grid>

        <Grid container spacing={2}>
          <Grid item xs={4}>
            <Controller
              control={control}
              name="peakMeasuredDemandInKw"
              rules={{
                required: "Preencha este campo",
                min: {
                  value: 0.1,
                  message: "Insira um valor maior que 0",
                },
              }}
              render={({
                field: { onChange, onBlur, value },
                fieldState: { error },
              }) => (
                <NumericFormat
                  value={value}
                  customInput={TextField}
                  label="Ponta *"
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
                  placeholder="0"
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
          <Grid item xs={4}>
            <Controller
              control={control}
              name="offPeakMeasuredDemandInKw"
              rules={{
                required: "Preencha este campo",
                min: {
                  value: 0.1,
                  message: "Insira um valor maior que 0",
                },
              }}
              render={({
                field: { onChange, onBlur, value },
                fieldState: { error },
              }) => (
                <NumericFormat
                  value={value}
                  customInput={TextField}
                  label="Fora Ponta *"
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
                  placeholder="0"
                  decimalScale={2}
                  decimalSeparator=","
                  thousandSeparator={"."}
                  error={!!error}
                  helperText={error?.message ?? " "}
                  onValueChange={(values) => onChange(values.floatValue)}
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

  const MeasuredConsumption = useCallback(
    () => (
      <>
        <Grid item xs={10}>
          <Typography variant="h5">Consumo medido</Typography>
        </Grid>

        <Grid container spacing={2}>
          <Grid item xs={4}>
            <Controller
              control={control}
              name="peakConsumptionInKwh"
              rules={{
                required: "Preencha este campo",
                min: {
                  value: 0.1,
                  message: "Insira um valor maior que 0",
                },
              }}
              render={({
                field: { onChange, onBlur, value },
                fieldState: { error },
              }) => (
                <NumericFormat
                  value={value}
                  customInput={TextField}
                  label="Ponta *"
                  fullWidth
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">kWh</InputAdornment>
                    ),
                  }}
                  type="text"
                  allowNegative={false}
                  isAllowed={({ floatValue }) =>
                    !floatValue || floatValue <= 99999.99
                  }
                  decimalScale={2}
                  placeholder="0"
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
          <Grid item xs={4}>
            <Controller
              control={control}
              name="offPeakConsumptionInKwh"
              rules={{
                required: "Preencha este campo",
                min: {
                  value: 0.1,
                  message: "Insira um valor maior que 0",
                },
              }}
              render={({
                field: { onChange, onBlur, value },
                fieldState: { error },
              }) => (
                <NumericFormat
                  value={value}
                  customInput={TextField}
                  label="Fora Ponta *"
                  fullWidth
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">kWh</InputAdornment>
                    ),
                  }}
                  type="text"
                  allowNegative={false}
                  isAllowed={({ floatValue }) =>
                    !floatValue || floatValue <= 99999.99
                  }
                  placeholder="0"
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
      </>
    ),
    [control]
  );

  // Novo estado para rastrear o arquivo PDF selecionado
  const [selectedPdfFile, setSelectedPdfFile] = useState<File | null>(null);


  // Novo manipulador de upload de arquivo PDF
  const handlePdfFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      if (file && file.type === "application/pdf") {
        // Arquivo PDF válido, atualize o estado com o arquivo selecionado
        setSelectedPdfFile(file);
      } else {
        // Arquivo inválido, você pode exibir uma mensagem de erro se desejar
        setSelectedPdfFile(null);
      }
    }
  };

  // Função auxiliar para converter o PDF em base64
  const convertPdfToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  //Lidar com o armazernamento inadequado ao fechar aba da fatura

  const handleCloseFaturaTab = () => {
    setSelectedPdfFile(null); // Isso limpa o PDF selecionado
  };

  return (
    <Fragment>
      <FormDrawerV2
        open={isCreateEnergyBillFormOpen || isEditEnergyBillFormOpen}
        title={`${isCreateEnergyBillFormOpen ? "Lançar" : "Editar"} fatura`}
        errorsLength={Object.keys(errors).length}
        isLoading={isPostInvoiceLoading || isEditInvoiceLoading}
        handleCloseDrawer={handleCancelEdition}
        handleSubmitDrawer={handleSubmit(onSubmitHandler)}
        header={<Header />}
        sections={[
          <InvoiceSection key={0} />,
          <MeasuredDemandSection key={1} />,
          <MeasuredConsumption key={2} />,
          // Adicione a seção de upload de PDF como parte do FormDrawerV2
          <Grid item xs={4} key={3}>
            <Grid item xs={8} mb={2}>
              <Typography variant="h5">Anexo PDF</Typography>
            </Grid>
            <input
              type="file"
              accept=".pdf"
              style={{ display: 'none' }}
              onChange={handlePdfFileUpload}
              id="pdfFile" // Adicionei o ID para associá-lo ao label
            />
            <label htmlFor="pdfFile">
              <Button
                variant="contained"
                color="primary"
                component="span"
                startIcon={<CloudUploadIcon />}
              >
                Upload de PDF
              </Button>
            </label>
            {selectedPdfFile && (
              <p>Arquivo PDF selecionado: {selectedPdfFile.name}</p>
            )}
          </Grid>
        ]}
      />
      <FormWarningDialog
        entity="fatura"
        open={shouldShowCancelDialog}
        onClose={handleCloseDialog}
        onDiscard={handleDiscardForm}
      />
    </Fragment>
  );
};

export default CreateEditEnergyBillForm;
