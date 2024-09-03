import React, {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSession } from "next-auth/react";
import {
  selectIsPersonCreateFormOpen,
  setIsErrorNotificationOpen,
  setIsPersonCreateFormOpen,
  setIsSuccessNotificationOpen,
} from "../../../store/appSlice";

import { Controller, SubmitHandler, useForm } from "react-hook-form";
import {
  Autocomplete,
  Box,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import FormWarningDialog from "../../ConsumerUnit/Form/WarningDialog";

import {
  CreatePersonForm,
  CreatePersonRequestPayload,
  UserRole,
} from "@/types/person";
import { useCreatePersonMutation, useGetAllInstitutionQuery } from "@/api";
import { isValidEmail } from "@/utils/validations/form-validations";
import { FormInfoAlert } from "@/components/Form/FormInfoAlert";
import FormDrawerV2 from "@/components/Form/DrawerV2";

const defaultValues: CreatePersonForm = {
  email: "",
  firstName: "",
  lastName: "",
  university: null,
  type: UserRole.UNIVERSITY_USER,
};

const CreatePersonForm = () => {
  const dispatch = useDispatch();
  const isCreateFormOpen = useSelector(selectIsPersonCreateFormOpen);
  const [shouldShowCancelDialog, setShouldShowCancelDialog] = useState(false);
  const { data: institutions } = useGetAllInstitutionQuery();
  const [
    createPerson,
    { isError, isSuccess, isLoading, reset: resetMutation },
  ] = useCreatePersonMutation();
  const { data: session } = useSession();
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

  const cardTitleStyles: CardTitleStyle = {
    marginBottom: "15px",
  };

  const institutionsOptions = useMemo(() => {
    return institutions?.map((institution) => ({
      label: institution.name,
      id: institution.id,
    }));
  }, [institutions]);

  const handleDiscardForm = useCallback(() => {
    handleCloseDialog();
    reset();
    dispatch(setIsPersonCreateFormOpen(false));
  }, [dispatch, reset]);

  const handleCloseDialog = () => {
    setShouldShowCancelDialog(false);
  };

  const onSubmitHandler: SubmitHandler<CreatePersonForm> = async (data) => {
    const { email, firstName, lastName, type, university } = data;

    // Verifica se o usuário não é um super usuário e define o ID da universidade com base na sessão do usuário
    const universityId =
      session?.user?.type !== UserRole.SUPER_USER
        ? session?.user?.universityId ?? 0
        : university?.id ?? 0;

    const body: CreatePersonRequestPayload = {
      email,
      firstName,
      lastName,
      type,
      university: universityId,
    };

    await createPerson(body);
  };

  //Notificações
  const handleNotification = useCallback(() => {
    if (isSuccess) {
      dispatch(
        setIsSuccessNotificationOpen({
          isOpen: true,
          text: "Pessoa adicionada com sucesso!",
        })
      );
      reset();
      resetMutation();
      dispatch(setIsPersonCreateFormOpen(false));
    } else if (isError) {
      dispatch(
        setIsErrorNotificationOpen({
          isOpen: true,
          text: "Erro ao adicionar pessoa.",
        })
      );
      resetMutation();
    }
  }, [dispatch, isError, isSuccess, reset, resetMutation]);

  useEffect(() => {
    handleNotification();
  }, [handleNotification, isSuccess, isError]);

  //Validações

  const hasEnoughCaracteresLength = (
    value: CreatePersonForm["firstName"] | CreatePersonForm["lastName"]
  ) => {
    if (value.length < 3) return "Insira ao menos 3 caracteres";
    return true;
  };

  const PersonalInformationSection = useCallback(
    () => (
      <>
        <Grid item xs={12}>
          <Typography variant="h5" style={cardTitleStyles}>
            Informações pessoais
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <Controller
            control={control}
            name="firstName"
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
            name="lastName"
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
                label="Sobrenome *"
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
            name="email"
            rules={{
              required: "Preencha este campo",

              validate: (e) => isValidEmail(e),
            }}
            render={({
              field: { onChange, onBlur, value, ref },
              fieldState: { error },
            }) => (
              <TextField
                ref={ref}
                value={value}
                label="E-mail institucional *"
                placeholder="Ex.: voce@universidade.br"
                error={Boolean(error)}
                helperText={error?.message ?? " "}
                fullWidth
                onChange={onChange}
                onBlur={onBlur}
              />
            )}
          />
        </Grid>

        {session?.user?.type === UserRole.SUPER_USER && (
          <Grid item xs={12}>
            <Controller
              control={control}
              name={"university"}
              rules={{ required: "Selecione alguma universidade" }}
              render={({
                field: { onChange, onBlur, value },
                fieldState: { error },
              }) => (
                <>
                  <Autocomplete
                    id="university-select"
                    options={institutionsOptions || []}
                    getOptionLabel={(option) => option.label}
                    sx={{ width: 450 }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Instituição *"
                        placeholder="Selecione uma instituição"
                        error={!!error}
                      />
                    )}
                    value={value}
                    onBlur={onBlur}
                    onChange={(_, data) => {
                      onChange(data);
                      return data;
                    }}
                  />
                  {errors.university !== undefined && (
                    <Typography
                      mt={0.4}
                      ml={2}
                      sx={{ color: "error.main", fontSize: 13 }}
                    >
                      {errors.university.message}
                    </Typography>
                  )}
                </>
              )}
            />
          </Grid>
        )}
      </>
    ),
    [control, errors.university, institutionsOptions]
  );

  const PerfilSection = useCallback(
    () => (
      <>
        <Grid item xs={12}>
          <Typography variant="h5">Perfil</Typography>
        </Grid>

        <Grid item xs={8}>
          <Controller
            control={control}
            name="type"
            rules={{ required: "Preencha este campo" }}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <FormControl error={!!error}>
                <RadioGroup value={value} onChange={onChange}>
                  <Box
                    display={"flex"}
                    flexDirection="column"
                    justifyContent="flex-start"
                    alignItems="self-start"
                  >
                    <FormControlLabel
                      value="university_user"
                      control={<Radio />}
                      label="Operacional"
                    />
                    <FormHelperText>
                      Acesso às tarefas básicas do sistema como: gerenciar
                      unidades consumidoras e distribuidoras, lançar faturas e
                      tarifas, além de gerar recomendações.
                    </FormHelperText>
                  </Box>
                  <Box
                    display={"flex"}
                    flexDirection="column"
                    justifyContent="flex-start"
                    alignItems="self-start"
                  >
                    <FormControlLabel
                      value="university_admin"
                      control={<Radio />}
                      label="Gestão"
                    />
                    <FormHelperText>
                      Permite gerenciar o perfil das outras pessoas que usam o
                      sistema, além das tarefas operacionais.
                    </FormHelperText>
                  </Box>
                </RadioGroup>
                <FormInfoAlert infoText="A pessoa receberá um e-mail com instruções para gerar uma senha e realizar o primeiro acesso ao sistema." />
                <FormHelperText>{error?.message ?? " "}</FormHelperText>
              </FormControl>
            )}
          />
        </Grid>
      </>
    ),
    [control]
  );

  return (
    <Fragment>
      <FormDrawerV2
        errorsLength={Object.keys(errors).length}
        open={isCreateFormOpen}
        handleCloseDrawer={handleCancelEdition}
        handleSubmitDrawer={handleSubmit(onSubmitHandler)}
        isLoading={isLoading}
        title="Adicionar Pessoa"
        header={<></>}
        sections={[
          <PersonalInformationSection key={0} />,
          <PerfilSection key={1} />,
        ]}
      />

      <FormWarningDialog
        open={shouldShowCancelDialog}
        entity={"registro"}
        onClose={handleCloseDialog}
        onDiscard={handleDiscardForm}
        type="create"
      />
    </Fragment>
  );
};

export default CreatePersonForm;
