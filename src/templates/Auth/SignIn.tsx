import { useMemo, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Image from "next/image";
import { signIn } from "next-auth/react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { Alert, Box, Button, IconButton, InputAdornment, Link, Paper, TextField, Typography } from "@mui/material";
import { SignInRequestPayload } from "@/types/auth";
import { getHeadTitle } from "@/utils/head";
import Footer from "@/components/Footer";
import { useSelector } from "react-redux";
import { selectIsTokenValid, selectUserAlreadyCreatedName } from "@/store/appSlice";
import { TokenStatus } from "@/types/app";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import ReportRounded from '@mui/icons-material/Error';
import { isValidEmail } from "@/utils/validations/form-validations";

const defaultValues: SignInRequestPayload = {
  username: "",
  password: "",
};

const SignInTemplate = () => {
  const headTitle = useMemo(() => getHeadTitle("Entrar"), []);

  const tokenStatus = useSelector(selectIsTokenValid);
  const userAlreadyCreatedName = useSelector(selectUserAlreadyCreatedName);

  const [showPassword, setShowPassword] = useState(false);

  const {
    query: { error },
  } = useRouter();

  const form = useForm({ defaultValues });
  const { control, handleSubmit } = form;

  const handleOnSubmit: SubmitHandler<SignInRequestPayload> = ({
    username,
    password,
  }) => {
    const normalizedEmail = username.toLowerCase();
    signIn("credentials", { username: normalizedEmail, password, callbackUrl: "/" });
  };

  return (
    <>
      <Head>
        <title>{headTitle}</title>
      </Head>

      <Box minHeight="100vh" display="flex" flexDirection="column">
        <Box
          flexGrow={1}
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <Paper sx={{ width: "471px", my: 9 }}>
            <Box
              component="form"
              display="flex"
              flexDirection="column"
              padding={3}
              onSubmit={handleSubmit(handleOnSubmit)}
            >
              <Box
                mt={3}
                height="112px"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Image
                  src="/icons/logo_mepa_nome.svg"
                  alt="Logo MEPA"
                  height="250px"
                  width="250px"
                />
              </Box>

              {tokenStatus === TokenStatus.TOKEN_ALREADY_USED && (
                <Box mt={4}>
                  <Typography variant="h5">Olá, {userAlreadyCreatedName}</Typography>
                  <Typography variant="subtitle1">Você já tem uma senha de acesso ao sistema.</Typography>
                  <Typography variant="subtitle1">Preencha os campos abaixo para entrar ou clique em</Typography>
                  <Typography variant="subtitle1">&quot;Esqueci minha senha&quot; para criar uma nova senha.</Typography>
                </Box>
              )}

              {tokenStatus === TokenStatus.RESET_PASSWORD_INVALID && (
                <Box mt={4}>
                  <Alert severity="error" variant="filled">
                    O link clicado para cadastrar a senha de acesso está vencido.
                    Você receberá um novo link por e-mail em 1 hora.
                  </Alert>
                </Box>
              )}

              {tokenStatus === TokenStatus.FIRST_TIME_CREATION_INVALID && (
                <Box mt={4}>
                  <Alert severity="error" variant="filled">
                    O link clicado para cadastrar a senha de acesso está vencido.
                    Você receberá um novo link por e-mail em 1 hora.
                  </Alert>
                </Box>
              )}

              <Box mt={8}>
                <Controller
                  control={control}
                  name="username"
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
                      label="E-mail institucional"
                      error={Boolean(error)}
                      fullWidth
                      onChange={onChange}
                      onBlur={onBlur}
                      helperText={
                        error ? (
                          <Box display="flex" alignItems="center" gap={0.5} ml={-2}>
                            <ReportRounded color="error" fontSize="small"/>
                            {error.message}
                          </Box>
                        ) : (
                          " "
                        )
                      }
                    />
                  )}
                />
              </Box>

              <Box mt={1}>
                <Controller
                  control={control}
                  name="password"
                  rules={{ required: "Preencha este campo" }}
                  render={({
                    field: { onChange, onBlur, value, ref },
                    fieldState: { error },
                  }) => (
                    <TextField
                      ref={ref}
                      value={value}
                      label="Senha"
                      type={showPassword ? "text" : "password"}
                      error={Boolean(error)}
                      fullWidth
                      onChange={onChange}
                      onBlur={onBlur}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              style={{ color: '#000000DE' }}
                              onClick={() => setShowPassword(!showPassword)}
                              onMouseDown={(e) => e.preventDefault()}
                              >
                              {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      helperText={
                        error ? (
                          <Box display="flex" alignItems="center" gap={0.5} ml={-2}>
                            <ReportRounded color="error" fontSize="small"/>
                            {error.message}
                          </Box>
                        ) : (
                          " "
                        )
                      }
                    />
                  )}
                />
              </Box>

              <Box display="flex" mt={-2} flexDirection="row-reverse">
                <Link variant="caption" href="/esqueci-senha">Esqueci minha senha</Link>
              </Box>

              {error && (
                <Box mt={2}>
                  <Alert severity="error" variant="filled">
                    E-mail não cadastrado e/ou senha inválida
                  </Alert>
                </Box>
              )}

              <Box mt={2}>
                <Button type="submit" variant="contained" fullWidth size="large">
                  Entrar
                </Button>
              </Box>
            </Box>
          </Paper>
        </Box>

        <Footer />
      </Box>
    </>
  );
};

export default SignInTemplate;
