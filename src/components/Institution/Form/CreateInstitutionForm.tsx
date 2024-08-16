import React, { Fragment, useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectIsInstitutionCreateFormOpen,
  setIsErrorNotificationOpen,
  setIsInstitutionCreateFormOpen,
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
import { useCreateInstitutionMutation } from "@/api";
import {
  CreateInstitutionForm,
  CreateInstitutionRequestPayload,
} from "@/types/institution";
import FormDrawerV2 from "@/components/Form/DrawerV2";

const defaultValues: CreateInstitutionForm = {
  acronym: "",
  name: "",
  cnpj: "",
};

const CreateInstitutionForm = () => {
  const dispatch = useDispatch();
  const isCreateFormOpen = useSelector(selectIsInstitutionCreateFormOpen);
  const [shouldShowCancelDialog, setShouldShowCancelDialog] = useState(false);
  const [
    createInstitution,
    { isError, isSuccess, isLoading, reset: resetMutation },
  ] = useCreateInstitutionMutation();
  const form = useForm({ defaultValues });
  const {
    control,
    reset,
    handleSubmit,
    formState: { isDirty, errors },
  } = form;
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
    dispatch(setIsInstitutionCreateFormOpen(false));
  }, [dispatch, reset]);

  const handleCloseDialog = () => {
    setShouldShowCancelDialog(false);
  };

  const onSubmitHandler: SubmitHandler<CreateInstitutionForm> = async (
    data
  ) => {
    const cnpjSemMascara = data.cnpj.replace(/[\/.-]/g, "");
    data.cnpj = cnpjSemMascara;
    const body: CreateInstitutionRequestPayload = {
      name: data.name,
      cnpj: data.cnpj,
      acronym: data.acronym,
    };
    await createInstitution(body);
  };

  //Notificações
  const handleNotification = useCallback(() => {
    if (isSuccess) {
      dispatch(
        setIsSuccessNotificationOpen({
          isOpen: true,
          text: "Instituição adicionada com sucesso!",
        })
      );
      reset();
      resetMutation();
      dispatch(setIsInstitutionCreateFormOpen(false));
    } else if (isError) {
      dispatch(
        setIsErrorNotificationOpen({
          isOpen: true,
          text: "Erro ao adicionar instituição.",
        })
      );
      resetMutation();
    }
  }, [dispatch, isError, isSuccess, reset, resetMutation]);

  useEffect(() => {
    handleNotification();
  }, [handleNotification, isSuccess, isError]);

  //Validações

  const hasEnoughCaracteresLength = (value: CreateInstitutionForm["name"]) => {
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
              helperText={error?.message ?? " "}
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
              helperText={error?.message ?? " "}
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
              helperText={error?.message ?? " "}
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
        open={isCreateFormOpen}
        handleCloseDrawer={handleCancelEdition}
        handleSubmitDrawer={handleSubmit(onSubmitHandler)}
        isLoading={isLoading}
        title="Adicionar Instituição"
        header={<></>}
        sections={[<InstitutionSection key={0} />]}

      />
      <FormWarningDialog
        open={shouldShowCancelDialog}
        entity={"instituição"}
        onClose={handleCloseDialog}
        onDiscard={handleDiscardForm}
        type="create"
      />
    </Fragment>
  )
};

export default CreateInstitutionForm;
