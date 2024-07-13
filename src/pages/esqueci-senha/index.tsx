import { getHeadTitle } from "@/utils/head";
import { Alert, Box, Button, Link, Paper, TextField, Typography } from "@mui/material";
import { NextPage } from "next";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import Head from "next/head";
import Image from "next/image";
import { ResetPasswordRequestPayload } from "@/types/auth";
import { useMemo, useState } from "react";
import { useRouter } from "next/router";
import Footer from "@/components/Footer";
import { useResetPasswordRequestMutation } from "@/api";
import SuccessNotification from "@/components/Notification/SuccessNotification";

const defaultValues: ResetPasswordRequestPayload = {
  email: ""
};

const ForgotPasswordPage: NextPage = () => {
  const [ResetPasswordRequest, { isLoading }] = useResetPasswordRequestMutation();

  const headTitle = useMemo(() => getHeadTitle("Esqueci minha senha"), []);

  const [isSuccessMessageVisible, setIsSuccessMessageVisible] = useState(false);

  const {
    query: { error },
  } = useRouter();

  const form = useForm({ defaultValues });
  const { control, handleSubmit, setError, clearErrors } = form;

  const handleOnSubmit: SubmitHandler<ResetPasswordRequestPayload> = async ({ email }) => {
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(email)) {
      setError("email", { type: "manual", message: "Formato de e-mail inválido" });
      return;
    }

    clearErrors("email");


    try {
      await ResetPasswordRequest({
        email: email,
      }).unwrap();

      setIsSuccessMessageVisible(true)
    } catch (error) {
      setIsSuccessMessageVisible(false)

      console.error('Erro ao redefinir a senha', error);
    }
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
                mt={4}
                mb={4}
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

              {isSuccessMessageVisible && (
                <Alert severity="success" sx={{ width: "100%" }}>
                  Você receberá instruções de como redefinir sua senha se este e-mail estiver cadastrado
                </Alert>
              )}

              <Box mt={4}>
                <Typography variant="h5">Esqueci minha senha</Typography>
                <Typography variant="subtitle1">Insira seu e-mail institucional para receber instruções de como redefinir sua senha.</Typography>
              </Box>

              <Box mt={3}>
                <Controller
                  control={control}
                  name="email"
                  rules={{
                    required: "Preencha este campo",
                    pattern: {
                      value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                      message: "Formato de e-mail inválido"
                    }
                  }}
                  render={({
                    field: { onChange, onBlur, value, ref },
                    fieldState: { error },
                  }) => (
                    <TextField
                      ref={ref}
                      value={value}
                      label="E-mail institucional"
                      type="email"
                      error={Boolean(error)}
                      helperText={error?.message ?? " "}
                      fullWidth
                      onChange={onChange}
                      onBlur={onBlur}
                    />
                  )}
                />
              </Box>

              {error && (
                <Box mt={2}>
                  <Alert severity="error" variant="filled">
                    E-mail não cadastrado
                  </Alert>
                </Box>
              )}

              <Box mt={2}>
                <Button disabled={isLoading} type="submit" variant="contained" fullWidth>
                  {isLoading ? 'Enviando...' : 'Enviar'}
                </Button>
              </Box>

              <Box mt={5}>
                <Box display="flex" justifyContent="center">
                  <Link href="/">Voltar</Link>
                </Box>
              </Box>
              <SuccessNotification />
            </Box>
          </Paper>
        </Box>

        <Footer />
      </Box>
    </>
  );
};

export default ForgotPasswordPage;
