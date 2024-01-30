import React, { Fragment, useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectIsDistributorCreateFormOpen,
  setIsDistributorCreateFormOpen,
  setIsErrorNotificationOpen,
  setIsSuccessNotificationOpen,
} from "../../../store/appSlice";
import {
  CreateDistributorForm,
  CreateDistributorRequestPayload,
} from "../../../types/distributor";
import { PatternFormat } from "react-number-format";

import {
  Controller,
  SubmitHandler,
  useForm,
} from "react-hook-form";
import { Grid, TextField, Typography } from "@mui/material";
import FormWarningDialog from "../../ConsumerUnit/Form/WarningDialog";
import { useCreateDistributorMutation } from "@/api";
import { useSession } from "next-auth/react";
import FormDrawerV2 from "@/components/Form/DrawerV2";

const defaultValues: CreateDistributorForm = {
  name: "",
  cnpj: "",
};

const DistributorCreateForm = () => {
  const dispatch = useDispatch();
  const { data: session } = useSession();
  const user = session?.user;
  const isCreateFormOpen = useSelector(selectIsDistributorCreateFormOpen);
  const [shouldShowCancelDialog, setShouldShowCancelDialog] = useState(false);
  const [
    createDistributor,
    { isError, isSuccess, isLoading, reset: resetMutation },
  ] = useCreateDistributorMutation();
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
    dispatch(setIsDistributorCreateFormOpen(false));
  }, [dispatch, reset]);

  const handleCloseDialog = () => {
    setShouldShowCancelDialog(false);
  };

  const onSubmitHandler: SubmitHandler<CreateDistributorForm> = async (
    data
  ) => {
    const cnpjSemMascara = data.cnpj.replace(/[\/.-]/g, "");
    data.cnpj = cnpjSemMascara;
    const body: CreateDistributorRequestPayload = {
      name: data.name,
      cnpj: data.cnpj,
      isActive: true,
      university: user?.universityId as number,
    };
    await createDistributor(body);
  };

  //Notificações
  const handleNotification = useCallback(() => {
    if (isSuccess) {
      dispatch(
        setIsSuccessNotificationOpen({
          isOpen: true,
          text: "Distribuidora adicionada com sucesso!",
        })
      );
      reset();
      resetMutation();
      dispatch(setIsDistributorCreateFormOpen(false));
    } else if (isError) {
      dispatch(
        setIsErrorNotificationOpen({
          isOpen: true,
          text: "Erro ao adicionar distribuidora.",
        })
      );
      resetMutation();
    }
  }, [dispatch, isError, isSuccess, reset, resetMutation]);

  useEffect(() => {
    handleNotification();
  }, [handleNotification, isSuccess, isError]);

  //Validações

  const hasEnoughCaracteresLength = (value: CreateDistributorForm["name"]) => {
    if (value.length < 3) return "Insira ao menos 3 caracteres";
    if (value.length > 45) return "O máximo permitido é 45 caracteres";
    return true;
  };

  const DistributorSection = useCallback(() => (
    <>
      <Grid item xs={12}>
        <Typography variant="h5">Distribuidora</Typography>
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
              label="Nome * (ao menos 3 caracteres)"
              placeholder="Ex.: CEMIG, Enel, Neonergia"
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
              label="CNPJ * (14 dígitos)"
              format="##.###.###/####-##"
              placeholder="Ex.: 12345678000167"
              error={Boolean(error)}
              helperText={error?.message ?? " "}
              fullWidth
              onChange={(e) => {
                onChange(e);
                // Adicionando a lógica de verificação aqui
                const digitos = e.target.value.replace(/\D/g, ''); // Remove caracteres não numéricos
                if (digitos.length === 14) {
                  alert('Limite de 14 dígitos atingido');
                }
              }}
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
        open={isCreateFormOpen}
        title={"Adicionar Distribuidora"}
        errorsLength={Object.keys(errors).length}
        isLoading={isLoading}
        handleCloseDrawer={handleCancelEdition}
        handleSubmitDrawer={handleSubmit(onSubmitHandler)}
        header={<></>}
        sections={[
          <DistributorSection key={0} />,
        ]}
      />
      <FormWarningDialog
        open={shouldShowCancelDialog}
        entity={"distribuidora"}
        onClose={handleCloseDialog}
        onDiscard={handleDiscardForm}
      />
    </Fragment>
  )
};

export default DistributorCreateForm;
