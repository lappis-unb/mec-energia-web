import React, { useCallback, useEffect, useState } from "react";
import {
  CreateDistributorForm,
  CreateDistributorRequestPayload,
} from "../../../types/distributor";
import { PatternFormat } from "react-number-format";

import {
  Controller,
  FormProvider,
  SubmitHandler,
  useForm,
} from "react-hook-form";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import FormWarningDialog from "../../ConsumerUnit/Form/WarningDialog";
import { useCreateDistributorMutation } from "@/api";
import { useSession } from "next-auth/react";
import {
  setIsErrorNotificationOpen,
  setIsSuccessNotificationOpen,
} from "@/store/appSlice";
import { useDispatch } from "react-redux";
import { SubmitButton } from "@/components/Form/SubmitButton";
import { FormErrorsAlert } from "@/components/Form/FormErrorsAlert";
import isValidCnpj from "@/utils/validations/isValidCnpj";

const defaultValues: CreateDistributorForm = {
  name: "",
  cnpj: "",
};

type DistributorCreateFormDialogProps = {
  open: boolean;
  onClose: () => void;
  handleDistributorChange: (value) => void;
};

const DistributorCreateFormDialog = (
  props: DistributorCreateFormDialogProps
) => {
  const { open, onClose, handleDistributorChange } = props;

  // Redux
  const dispatch = useDispatch();

  //SESSÃO
  const { data: session } = useSession();
  const user = session?.user;

  // REQUISIÇÕES
  const [
    createDistributor,
    { isError, isSuccess, isLoading, reset: resetMutation },
  ] = useCreateDistributorMutation();

  // ESTADOS
  const [shouldShowCancelDialog, setShouldShowCancelDialog] = useState(false);

  //FORMULÁRIO
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
    onClose();
  }, [onClose, reset]);

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
    const response = await createDistributor(body).unwrap();
    if (response) {
      handleDistributorChange(response);
    }
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
      handleDiscardForm();
    } else if (isError) {
      dispatch(
        setIsErrorNotificationOpen({
          isOpen: true,
          text: "Erro ao adicionar distribuidora.",
        })
      );
      resetMutation();
    }
  }, [dispatch, handleDiscardForm, isError, isSuccess, reset, resetMutation]);

  useEffect(() => {
    handleNotification();
  }, [handleNotification, isSuccess, isError]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth={"xs"}>
      <Box m={4}>
        <DialogTitle>Adicionar Distribuidora</DialogTitle>
        <FormProvider {...form}>
          <Box component="form" onSubmit={handleSubmit(onSubmitHandler)}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography>* campos obrigatórios</Typography>
              </Grid>

              <Grid item xs={12}>
                <Controller
                  control={control}
                  name="name"
                  rules={{
                    required: "Preencha este campo",
                    minLength: {
                      value: 3,
                      message: "Insira ao menos 3 caracteres",
                    },
                  }}
                  render={({
                    field: { onChange, onBlur, value, ref },
                    fieldState: { error },
                  }) => (
                    <TextField
                      ref={ref}
                      value={value}
                      label="Nome *"
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
                    validate: (value) =>
                      isValidCnpj(value) ||
                      "Insira um CNPJ válido com 14 dígitos",
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
                      error={Boolean(error)}
                      helperText={error?.message ?? " "}
                      fullWidth
                      onChange={onChange}
                      onBlur={onBlur}
                    />
                  )}
                />
              </Grid>

              <FormErrorsAlert
                hasErrors={Object.keys(errors).length > 0 ? true : false}
              />

              <Grid
                item
                xs={12}
                display="flex"
                justifyContent="flex-end"
                alignItems="center"
              >
                <Box pr={3}>
                  <SubmitButton isLoading={isLoading} />
                </Box>

                <Button
                  variant="text"
                  onClick={handleCancelEdition}
                  size="large"
                >
                  Cancelar
                </Button>
              </Grid>
            </Grid>

            <FormWarningDialog
              open={shouldShowCancelDialog}
              entity={"distribuidora"}
              onClose={handleCloseDialog}
              onDiscard={handleDiscardForm}
              type="create"
            />
          </Box>
        </FormProvider>
      </Box>
    </Dialog>
  );
};
export default DistributorCreateFormDialog;
