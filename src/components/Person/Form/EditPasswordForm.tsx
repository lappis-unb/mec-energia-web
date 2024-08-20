import React, { Fragment, useCallback, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectIsPasswordEditFormOpen,
  setIsEditPasswordFormOpen,
  setIsSuccessNotificationOpen,
} from "../../../store/appSlice";
import { Controller, useForm, SubmitHandler } from "react-hook-form";
import {
  Grid,
  TextField,
  Typography,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { EditPasswordRequestPayload } from "@/types/person";
import { useChangeUserPasswordMutation } from "@/api";
import FormDrawerV2 from "@/components/Form/DrawerV2";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ReportIcon from "@mui/icons-material/Report";
import FormWarningDialog from "@/components/ConsumerUnit/Form/WarningDialog";

const defaultValues: EditPasswordRequestPayload = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

const EditPasswordForm = () => {
  const [changeUserPassword] = useChangeUserPasswordMutation();
  const dispatch = useDispatch();
  const isEditPasswordFormOpen = useSelector(selectIsPasswordEditFormOpen);

  const [shouldShowCancelDialog, setShouldShowCancelDialog] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isValidPassword, setIsValidPassword] = useState<{
    hasLetter: boolean | null;
    hasNumber: boolean | null;
    hasSpecialChar: boolean | null;
    minLength: boolean | null;
  }>({
    hasLetter: null,
    hasNumber: null,
    hasSpecialChar: null,
    minLength: null,
  });

  const form = useForm({ defaultValues: defaultValues });
  const { control, handleSubmit, watch, setError, reset } = form;
  const password = watch("newPassword");
  const currentPassword = watch("currentPassword");
  const confirmPassword = watch("confirmPassword");

  useEffect(() => {
    if (password) {
      setIsValidPassword({
        hasLetter: /[a-zA-Z]/.test(password),
        hasNumber: /[0-9]/.test(password),
        hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
        minLength: password.length >= 8,
      });
    } else {
      setIsValidPassword({
        hasLetter: null,
        hasNumber: null,
        hasSpecialChar: null,
        minLength: null,
      });
    }
  }, [password]);

  const getColor = (criteria: boolean | null) => {
    if (criteria === null) return "text.primary";
    return criteria ? "primary.main" : "error";
  };

  const renderValidationIcon = (isValid: boolean | null) => {
    if (isValid === null) return "-";
    return isValid ? (
      <CheckCircleIcon color="primary.main" sx={{ verticalAlign: "middle" }} />
    ) : (
      <ReportIcon color="error" sx={{ verticalAlign: "middle" }} />
    );
  };

  const handleCancelEdition = () => {
    if (currentPassword || password || confirmPassword) {
      setShouldShowCancelDialog(true);
      return;
    }
    dispatch(setIsEditPasswordFormOpen(false));
  };

  const handleDiscardForm = useCallback(() => {
    handleCloseDialog();
    reset();
    dispatch(setIsEditPasswordFormOpen(false));
  }, [dispatch, reset]);

  const handleCloseDialog = () => {
    setShouldShowCancelDialog(false);
  };

  const onSubmitHandler: SubmitHandler<EditPasswordRequestPayload> = async ({
    currentPassword,
    newPassword,
    confirmPassword,
  }) => {
    // Verifica se a nova senha e a confirmação da nova senha são iguais
    if (newPassword !== confirmPassword || !currentPassword) {
      return;
    }

    try {
      await changeUserPassword({
        current_password: currentPassword,
        new_password: newPassword,
      }).unwrap();

      dispatch(
        setIsSuccessNotificationOpen({
          isOpen: true,
          text: "Senha alterada com sucesso!",
        })
      );
      reset();
      dispatch(setIsEditPasswordFormOpen(false));
    } catch (error) {
      setError("currentPassword", {
        type: "manual",
        message: "Senha incorreta",
      });
      console.error("Erro ao trocar a senha", error);
    }
  };

  const CurrentPasswordSection = useCallback(
    () => (
      <>
        <Grid item xs={12} sx={{ marginBottom: "10px" }}>
          <Typography variant="h5">Senha atual</Typography>
        </Grid>

        <Grid item xs={12}>
          <Controller
            control={control}
            name="currentPassword"
            rules={{
              required: "Preencha este campo",
            }}
            render={({
              field: { onChange, onBlur, value, ref },
              fieldState: { error },
            }) => (
              <TextField
                ref={ref}
                value={value}
                label="Senha Atual *"
                type={showCurrentPassword ? "text" : "password"}
                error={Boolean(error)}
                helperText={error?.message ?? " "}
                fullWidth
                onChange={onChange}
                onBlur={onBlur}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() =>
                          setShowCurrentPassword(!showCurrentPassword)
                        }
                        onMouseDown={(e) => e.preventDefault()}
                      >
                        {showCurrentPassword ? (
                          <VisibilityOff />
                        ) : (
                          <Visibility />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            )}
          />
        </Grid>
      </>
    ),
    [control, showCurrentPassword]
  );

  const NewPasswordSection = useCallback(
    () => (
      <>
        <Grid item xs={12} sx={{ marginBottom: "10px" }}>
          <Typography variant="h5">Nova senha</Typography>
        </Grid>

        <Grid item xs={12}>
          <Controller
            control={control}
            name="newPassword"
            rules={{
              required: "Preencha este campo",
              minLength: {
                value: 8,
                message: "A senha deve ter no mínimo 8 caracteres",
              },
              validate: {
                hasLetter: (value) => /[a-zA-Z]/.test(value),
                hasNumber: (value) => /[0-9]/.test(value),
                hasSpecialChar: (value) => /[!@#$%^&*(),.?":{}|<>]/.test(value),
              },
            }}
            render={({
              field: { onChange, onBlur, value, ref },
              fieldState: { error },
            }) => (
              <TextField
                autoFocus
                ref={ref}
                value={value}
                label="Nova Senha *"
                type={showNewPassword ? "text" : "password"}
                error={Boolean(error)}
                helperText={error?.message ?? " "}
                fullWidth
                onChange={onChange}
                onBlur={onBlur}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        onMouseDown={(e) => e.preventDefault()}
                      >
                        {showNewPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            )}
          />
          <Typography
            variant="subtitle1"
            color={getColor(isValidPassword.hasLetter)}
          >
            {renderValidationIcon(isValidPassword.hasLetter)} Ao menos 1 letra
          </Typography>
          <Typography
            variant="subtitle1"
            color={getColor(isValidPassword.hasNumber)}
          >
            {renderValidationIcon(isValidPassword.hasNumber)} Ao menos 1 número
          </Typography>
          <Typography
            lineHeight={"1rem"}
            variant="subtitle1"
            color={getColor(isValidPassword.hasSpecialChar)}
          >
            {renderValidationIcon(isValidPassword.hasSpecialChar)} Ao menos 1
            caractere especial (exs.: !?*-_.#$)
          </Typography>
          <Typography
            alignContent={"center"}
            variant="subtitle1"
            color={getColor(isValidPassword.minLength)}
          >
            {renderValidationIcon(isValidPassword.minLength)} Mínimo de 8
            caracteres
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <Controller
            control={control}
            name="confirmPassword"
            rules={{
              required: "Preencha este campo",
              validate: (value) =>
                value === password ||
                'Insira uma senha idêntica à "Nova senha"',
            }}
            render={({
              field: { onChange, onBlur, value, ref },
              fieldState: { error },
            }) => (
              <TextField
                sx={{ marginTop: "20px" }}
                ref={ref}
                value={value}
                label="Repetir nova Senha *"
                type={showConfirmPassword ? "text" : "password"}
                error={Boolean(error)}
                helperText={error?.message ?? " "}
                fullWidth
                onChange={onChange}
                onBlur={onBlur}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        onMouseDown={(e) => e.preventDefault()}
                      >
                        {showConfirmPassword ? (
                          <VisibilityOff />
                        ) : (
                          <Visibility />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            )}
          />
        </Grid>
      </>
    ),
    [
      control,
      showCurrentPassword,
      showNewPassword,
      showConfirmPassword,
      isValidPassword,
    ]
  );

  return (
    <Fragment>
      <FormDrawerV2
        errorsLength={Object.keys(form.formState.errors).length}
        open={isEditPasswordFormOpen}
        handleCloseDrawer={handleCancelEdition}
        handleSubmitDrawer={handleSubmit(onSubmitHandler)}
        isLoading={false} // replace with actual loading state
        title="Editar Pessoa"
        header={<></>}
        sections={[
          <CurrentPasswordSection key={"CurrentPasswordSection"} />,
          <NewPasswordSection key={"NewPasswordSection"} />,
        ]}
      />

      <FormWarningDialog
        open={shouldShowCancelDialog}
        entity={"senha"}
        onClose={handleCloseDialog}
        onDiscard={handleDiscardForm}
      />
    </Fragment>
  );
};

export default EditPasswordForm;