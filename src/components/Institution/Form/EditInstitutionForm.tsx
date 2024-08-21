import React, { Fragment, useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectActiveInstitutionId,
  selectIsInstitutionEditFormOpen,
  setIsErrorNotificationOpen,
  setIsInstitutionEditFormOpen,
  setIsSuccessNotificationOpen,
} from "../../../store/appSlice";
import { PatternFormat } from "react-number-format";

import {
  Controller,
  SubmitHandler,
  useForm,
} from "react-hook-form";
import { Grid, TextField, Typography } from "@mui/material";
import FormWarningDialog from "../../ConsumerUnit/Form/WarningDialog";
import { useEditInstitutionMutation, useGetInstitutionQuery } from "@/api";

import {
  EditInstitutionForm,
  EditInstitutionRequestPayload,
} from "@/types/institution";
import { skipToken } from "@reduxjs/toolkit/dist/query";
import FormDrawerV2 from "@/components/Form/DrawerV2";
import FormFieldError from "@/components/FormFieldError";

const defaultValues: EditInstitutionForm = {
  acronym: "",
  name: "",
  cnpj: "",
};

const EditInstitutionForm = () => {
  const dispatch = useDispatch();
  const isEditFormOpen = useSelector(selectIsInstitutionEditFormOpen);
  const [shouldShowCancelDialog, setShouldShowCancelDialog] = useState(false);
  const currentInstitutionId = useSelector(selectActiveInstitutionId);
  const { data: currentInstitution, refetch: refetchInstitution } = useGetInstitutionQuery(
    currentInstitutionId || skipToken
  );
  const [
    editInstitution,
    { isError, isSuccess, isLoading, reset: resetMutation },
  ] = useEditInstitutionMutation();
  const form = useForm({ defaultValues });
  const {
    control,
    reset,
    handleSubmit,
    setValue,
    formState: { isDirty, errors },
  } = form;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: currentInstitution } = await refetchInstitution();
        if (!currentInstitution) return;

        setValue("acronym", currentInstitution.acronym ?? "");
        setValue("name", currentInstitution.name ?? "");
        setValue("cnpj", currentInstitution.cnpj ?? "");
      } catch (err) {
        console.error('Failed to refetch:', err);
      }
    };

    // Garante que o refetch não seja executado antes do fetch
    if (isEditFormOpen) {
      fetchData();
    }
  }, [currentInstitution, isEditFormOpen, setValue]);

  const handleCancelEdition = () => {
    if (isDirty) {
      setShouldShowCancelDialog(true);
      return;
    }
    handleDiscardForm();
  };

  const handleDiscardForm = useCallback(() => {
    handleCloseDialog();
    reset();
    dispatch(setIsInstitutionEditFormOpen(false));
  }, [dispatch, reset]);

  const handleCloseDialog = () => {
    setShouldShowCancelDialog(false);
  };

  const onSubmitHandler: SubmitHandler<EditInstitutionForm> = async (data) => {
    const cnpjSemMascara = data.cnpj.replace(/[\/.-]/g, "");
    data.cnpj = cnpjSemMascara;
    if (!currentInstitutionId) return;
    const body: EditInstitutionRequestPayload = {
      name: data.name,
      cnpj: data.cnpj,
      acronym: data.acronym,
      id: currentInstitutionId,
    };
    await editInstitution(body);
  };

  //Notificações
  const handleNotification = useCallback(() => {
    if (isSuccess) {
      dispatch(
        setIsSuccessNotificationOpen({
          isOpen: true,
          text: "Instituição editada com sucesso!",
        })
      );
      reset();
      resetMutation();
      dispatch(setIsInstitutionEditFormOpen(false));
    } else if (isError) {
      dispatch(
        setIsErrorNotificationOpen({
          isOpen: true,
          text: "Erro ao editada instituição.",
        })
      );
      resetMutation();
    }
  }, [dispatch, isError, isSuccess, reset, resetMutation]);

  useEffect(() => {
    handleNotification();
  }, [handleNotification, isSuccess, isError]);

  //Validações

  const hasEnoughCaracteresLength = (value: EditInstitutionForm["name"]) => {
    if (value.length < 3) return "Insira ao menos 3 caracteres";
    return true;
  };

  const InstitutionSection = useCallback(() => (
    <>
      <Grid item xs={12}>
        <Typography variant="h5">Instituição</Typography>
      </Grid>

      <Grid item xs={12}>
        <Controller
          control={control}
          name="acronym"
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
              label="Sigla *"
              placeholder="Ex.: UFX"
              error={Boolean(error)}
              helperText={FormFieldError(error?.message)}
              fullWidth
              onChange={onChange}
              onBlur={onBlur}
            />
          )}
        />
      </Grid>

      <Grid item xs={12} mt={0.3}>
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
              placeholder="Ex.: Universidade Federal de ..."
              error={Boolean(error)}
              helperText={FormFieldError(error?.message)}
              fullWidth
              onChange={onChange}
              onBlur={onBlur}
            />
          )}
        />
      </Grid>

      <Grid item xs={12} mt={0.3}>
        <Controller
          control={control}
          name="cnpj"
          rules={{
            required: "Preencha este campo",
            pattern: {
              value:
                /([0-9]{2}[\.]?[0-9]{3}[\.]?[0-9]{3}[\/]?[0-9]{4}[-]?[0-9]{2})/,
              message: "Insira um CNPJ válido com 14 dígitos",
            },
          }}
          render={({
            field: { onChange, onBlur, value },
            fieldState: { error },
          }) => (
            <PatternFormat
              value={value}
              customInput={TextField}
              label="CNPJ *"
              format="##.###.###/####-##"
              placeholder="Ex.: 12345678000167"
              error={Boolean(error)}
              helperText={FormFieldError(error?.message)}
              fullWidth
              onChange={onChange}
              onBlur={onBlur}
            />
          )}
        />
      </Grid>
    </>
  ), [control])


  return (
    <Fragment>
      <FormDrawerV2
        errorsLength={Object.keys(errors).length}
        open={isEditFormOpen}
        handleCloseDrawer={handleCancelEdition}
        handleSubmitDrawer={handleSubmit(onSubmitHandler)}
        isLoading={isLoading}
        title="Editar Instituição"
        header={<></>}
        sections={[<InstitutionSection key={0} />]}

      />
      <FormWarningDialog
        open={shouldShowCancelDialog}
        entity={"instituição"}
        onClose={handleCloseDialog}
        onDiscard={handleDiscardForm}
        type="update"
      />


    </Fragment>
  )
};

export default EditInstitutionForm;
