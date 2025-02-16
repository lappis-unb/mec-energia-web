import React, { Fragment, useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectIsDistributorCreateFormOpen,
  setActiveDistributorId,
  setIsDistributorCreateFormOpen,
  setIsErrorNotificationOpen,
  setIsSuccessNotificationOpen,
} from "../../../store/appSlice";
import {
  CreateDistributorForm,
  CreateDistributorRequestPayload,
} from "../../../types/distributor";
import { PatternFormat } from "react-number-format";

import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { Grid, TextField, Typography } from "@mui/material";
import FormWarningDialog from "../../ConsumerUnit/Form/WarningDialog";
import { useCreateDistributorMutation } from "@/api";
import { useSession } from "next-auth/react";
import FormDrawerV2 from "@/components/Form/DrawerV2";
import isValidCnpj from "@/utils/validations/isValidCnpj";
import FormFieldError from "@/components/FormFieldError";

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
  const [cnpjValid, setCnpjValid] = useState(true);
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
    setCnpjValid(true);
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
    data.name =
      data.name.charAt(0) === " " ? data.name.substring(1) : data.name;
    const cnpjSemMascara = data.cnpj.replace(/[\/.-]/g, "");
    data.cnpj = cnpjSemMascara;
    const body: CreateDistributorRequestPayload = {
      name: data.name,
      cnpj: data.cnpj,
      isActive: true,
      university: user?.universityId as number,
    };
    const createdDistributor = await createDistributor(body);
    setCnpjValid(true);
    if ("data" in createdDistributor)
      dispatch(setActiveDistributorId(createdDistributor.data.id ?? null));
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

  const hasConsecutiveSpaces = (value: CreateDistributorForm["name"]) => {
    if (/\s{2,}/.test(value)) return "Não são permitidos espaços consecutivos";
    return true;
  };

  const DistributorSection = useCallback(
    () => (
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <Typography variant="h5">Distribuidora</Typography>
        </Grid>

        <Grid item xs={12}>
          <Controller
            control={control}
            name="name"
            rules={{
              required: "Preencha este campo",
              validate: {
                hasEnoughCaracteresLength: hasEnoughCaracteresLength,
                hasConsecutiveSpaces: hasConsecutiveSpaces,
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
                placeholder="Ex.: CEMIG, Enel, Neonergia"
                error={!!error}
                helperText={FormFieldError(error?.message)}
                fullWidth
                onBlur={onBlur}
                onChange={(e) => {
                  // Adicionando a lógica de verificação aqui
                  let { value } = e.target;

                  // Impossibilitando o primeiro caracter de ser um espaço em branco
                  if (value.length === 1 && value.charAt(0) === " ") {
                    value = "";
                    e.target.value = value;
                  } else if (value.charAt(0) === " ") {
                    value = value.substring(1);
                    e.target.value = value;
                  } else {
                    const splitted = value.split(" ");
                    const hasMultipleSpaces = splitted.some(
                      (element, index) =>
                        element === "" && splitted[index + 1] === ""
                    );
                    // Validação e aviso caso existam múltiplos espaços
                    if (hasMultipleSpaces) {
                      // Filtra os elementos vazios do array e junta novamente a string
                      const filtered = splitted.filter((element) => element);
                      let updatedValue = filtered.join(" ");
                      updatedValue = `${updatedValue} `;

                      // Define o novo valor na variável 'value' para remover o segundo espaço
                      e.target.value = updatedValue;
                    }
                  }

                  onChange(e);
                }}
              />
            )}
          />
        </Grid>

        <Grid item xs={12} mt={0.2}>
          <Controller
            control={control}
            name="cnpj"
            rules={{
              required: "Preencha este campo",
              validate: (value) =>
                isValidCnpj(value) || "Insira um CNPJ válido com 14 dígitos",
            }}
            render={({
              field: { onChange, onBlur, value },
              fieldState: { error },
            }) => (
              <PatternFormat
                style={{ width: "12rem" }}
                value={value}
                customInput={TextField}
                label="CNPJ *"
                format="##.###.###/####-##"
                placeholder="Ex.: 12345678000167"
                error={!!error || !cnpjValid}
                helperText={FormFieldError(
                  error?.message ?? (cnpjValid ? undefined : "CNPJ inválido")
                )}
                fullWidth
                onChange={(e) => {
                  const newValue = e.target.value;
                  onChange(newValue);
                  const digitos = newValue.replace(/\D/g, "");
                  digitos.length === 14
                    ? setCnpjValid(isValidCnpj(digitos))
                    : setCnpjValid(true);
                }}
                onBlur={onBlur}
              />
            )}
          />
        </Grid>
      </Grid>
    ),
    [cnpjValid, control]
  );

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
        sections={[<DistributorSection key={0} />]}
      />
      <FormWarningDialog
        open={shouldShowCancelDialog}
        entity={"distribuidora"}
        onClose={handleCloseDialog}
        onDiscard={handleDiscardForm}
        type="create"
      />
    </Fragment>
  );
};

export default DistributorCreateForm;
