import { useMemo } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Image from "next/image";
import { signIn } from "next-auth/react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { Alert, Box, Button, Link, Paper, TextField } from "@mui/material";
import { SignInRequestPayload } from "@/types/auth";
import { getHeadTitle } from "@/utils/head";
import Footer from "@/components/Footer";

const defaultValues: SignInRequestPayload = {
  username: "",
  password: "",
};

const SignInTemplate = () => {
  const headTitle = useMemo(() => getHeadTitle("Entrar"), []);

  const router = useRouter();

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
                      type="password"
                      error={Boolean(error)}
                      helperText={error?.message ?? " "}
                      fullWidth
                      onChange={onChange}
                      onBlur={onBlur}
                    />
                  )}
                />
              </Box>

              <Box display="flex" flexDirection="row-reverse">
                <Link variant="caption" onClick={() => router.push("/esqueci-senha")}>Esqueci minha senha</Link>
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

              <Box mt={5}>
                <Box display="flex" justifyContent="center">
                  <Link>Não tenho cadastro</Link>
                </Box>
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
