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
import { selectIsTokenValid, selectPasswordAlreadyCreated, selectUserAlreadyCreatedName } from "@/store/appSlice";
import { TokenStatus } from "@/types/app";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

const defaultValues: SignInRequestPayload = {
  username: "",
  password: "",
};

const SignInTemplate = () => {
  const headTitle = useMemo(() => getHeadTitle("Entrar"), []);

  const tokenStatus = useSelector(selectIsTokenValid);
  const passwordAlreadyCreated = useSelector(selectPasswordAlreadyCreated);
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
    signIn("credentials", { username, password, callbackUrl: "/" });
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
                mt={8}
                height="112px"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Image
                  src="/icons/mec-energia.svg"
                  alt="Logo do MEC Energia"
                  height="144px"
                  width="144px"
                />
              </Box>

              {passwordAlreadyCreated === true && (
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
                    Você receberá um novo link por e-mail em 30 minutos.
                  </Alert>
                </Box>
              )}

              <Box mt={8}>
                <Controller
                  control={control}
                  name="username"
                  rules={{
                    required: "Preencha este campo",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Insira um e-mail válido",
                    },
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
                      helperText={error?.message ?? " "}
                      fullWidth
                      onChange={onChange}
                      onBlur={onBlur}
                    />
                  )}
                />
              </Box>

              <Box mt={3}>
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
                      helperText={error?.message ?? " "}
                      fullWidth
                      onChange={onChange}
                      onBlur={onBlur}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => setShowPassword(!showPassword)}
                              onMouseDown={(e) => e.preventDefault()}
                            >
                              {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  )}
                />
              </Box>

              <Box display="flex" flexDirection="row-reverse">
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
                <Button type="submit" variant="contained" fullWidth>
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
