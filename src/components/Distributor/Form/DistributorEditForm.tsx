import React, { Fragment, useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectActiveDistributorId,
  selectIsDistributorEditFormOpen,
  setIsDistributorEditFormOpen,
  setIsErrorNotificationOpen,
  setIsSuccessNotificationOpen,
} from "../../../store/appSlice";
import {
  EditDistributorForm,
  EditDistributorRequestPayload,
} from "../../../types/distributor";
import { PatternFormat } from "react-number-format";

import { Controller, SubmitHandler, useForm } from "react-hook-form";
import {
  Box,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  Grid,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import FlashOnIcon from "@mui/icons-material/FlashOn";
import FormWarningDialog from "../../ConsumerUnit/Form/WarningDialog";
import { useEditDistributorMutation, useGetDistributorQuery } from "@/api";
import { useSession } from "next-auth/react";
import { skipToken } from "@reduxjs/toolkit/dist/query";
import FormDrawerV2 from "@/components/Form/DrawerV2";
import isValidCnpj from "@/utils/validations/isValidCnpj";
import FormFieldError from "@/components/FormFieldError";

const defaultValues: EditDistributorForm = {
  isActive: true,
  name: "",
  cnpj: "",
};

const DistributorEditForm = () => {
  const user = useSession().data?.user;
  const dispatch = useDispatch();
  const activeDistributor = useSelector(selectActiveDistributorId);
  const isEditFormOpen = useSelector(selectIsDistributorEditFormOpen);
  const [shouldShowCancelDialog, setShouldShowCancelDialog] = useState(false);
  const [cnpjValid, setCnpjValid] = useState(true);
  const [
    editDistributor,
    { isError, isSuccess, isLoading, reset: resetMutation },
  ] = useEditDistributorMutation();
  const { data: distributor, refetch: refetchDistributor } =
    useGetDistributorQuery(activeDistributor || skipToken);
  const form = useForm({ defaultValues });
  const {
    control,
    reset,
    handleSubmit,
    watch,
    setValue,
    formState: { isDirty, errors },
  } = form;

  const handleCancelEdition = () => {
    if (isDirty) {
      setShouldShowCancelDialog(true);
      return;
    }
    handleDiscardForm();
  };

  const isActive = watch("isActive");

  useEffect(() => {
    if (isEditFormOpen) {
      const fetchData = async () => {
        try {
          const { data: distributor } = await refetchDistributor();

          if (!distributor) return;

          const { name, isActive, cnpj } = distributor;
          setValue("name", name);
          setValue("cnpj", cnpj);
          setValue("isActive", isActive);
        } catch (err) {
          console.error("Failed to refetch:", err);
        }
      };

      fetchData();
    }
  }, [distributor, isEditFormOpen, setValue, refetchDistributor]);

  useEffect(() => {
    setValue("isActive", isActive);
  }, [isActive, setValue]);

  const handleDiscardForm = () => {
    setCnpjValid(true);
    handleCloseDialog();
    reset();
    dispatch(setIsDistributorEditFormOpen(false));
  };

  const handleCloseDialog = () => {
    setShouldShowCancelDialog(false);
  };

  const onSubmitHandler: SubmitHandler<EditDistributorForm> = async (data) => {
    const cnpjSemMascara = data.cnpj.replace(/[\/.-]/g, "");
    data.cnpj = cnpjSemMascara;
    if (!user?.universityId) return;
    if (!activeDistributor) return;
    const body: EditDistributorRequestPayload = {
      id: activeDistributor,
      name: data.name,
      cnpj: data.cnpj,
      isActive: data.isActive,
      university: user?.universityId,
    };
    await editDistributor(body);
  };

  //Notificações
  const handleNotification = useCallback(() => {
    if (isSuccess) {
      dispatch(
        setIsSuccessNotificationOpen({
          isOpen: true,
          text: "Distribuidora modificada com sucesso!",
        })
      );
      reset();
      resetMutation();
      dispatch(setIsDistributorEditFormOpen(false));
    } else if (isError) {
      dispatch(
        setIsErrorNotificationOpen({
          isOpen: true,
          text: "Erro ao editar distribuidora.",
        })
      );
      resetMutation();
    }
  }, [dispatch, isError, isSuccess, reset, resetMutation]);

  useEffect(() => {
    handleNotification();
  }, [handleNotification, isSuccess, isError]);

  //Validações

  const hasEnoughCaracteresLength = (value: EditDistributorForm["name"]) => {
    if (value.length < 3) return "Insira ao menos 3 caracteres";
    if (value.length > 45) return "O máximo permitido é 45 caracteres";
    return true;
  };

  const hasConsecutiveSpaces = (value: EditDistributorForm["name"]) => {
    if (/\s{2,}/.test(value)) return "Não são permitidos espaços consecutivos";
    return true;
  };

  const DistributorSection = useCallback(
    () => (
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <Typography variant="h5" style={{ marginBottom: '10px' }}>Distribuidora</Typography>
        </Grid>
        <Grid item xs={12}>
          <Controller
            control={control}
            name="name"
            rules={{
              required: "Campo obrigatório",
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
                error={Boolean(error)}
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

        <Grid item xs={12}>
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
                value={value}
                customInput={TextField}
                label="CNPJ *"
                format="##.###.###/####-##"
                placeholder="Ex.: 12345678000167"
                error={Boolean(error) || !cnpjValid}
                helperText={
                  FormFieldError(error?.message ?? (cnpjValid ? undefined : "CNPJ inválido"))
                }
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
                  {distributor && (
                    <FormControlLabel
                      label="Distribuidora ativa"
                      labelPlacement="start"
                      sx={{ width: "40%", margin: 0 }}
                      control={
                        <Box>
                          <Switch
                            value={value}
                            defaultChecked={distributor.isActive}
                            onChange={onChange}
                          />
                        </Box>
                      }
                    />
                  )}
                </Box>

                <FormHelperText>
                  <p>
                    Só distribuidoras ativas permitem gerar recomendações para
                    as unidades consumidoras relacionadas.
                  </p>
                  <p>
                    Apenas as distribuidoras que não estão relacionadas à
                    nenhuma unidade consumidora podem ser excluídas.
                  </p>
                </FormHelperText>
              </FormGroup>
            )}
          />
        </Grid>
      </Grid>
    ),
    [cnpjValid, control, distributor]
  );

  return (
    <Fragment>
      <FormDrawerV2
        open={isEditFormOpen}
        title={"Editar Distribuidora"}
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
        type="update"
      />
    </Fragment>
  );
};

export default DistributorEditForm;
