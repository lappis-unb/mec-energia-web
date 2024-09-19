import { getHeadTitle } from "@/utils/head";
import { Alert, Box, Button, Link, Paper, TextField, Typography } from "@mui/material";
import { NextPage } from "next";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import Head from "next/head";
import Image from "next/image";
import { ResetPasswordRequestPayload } from "@/types/auth";
import { useEffect, useMemo, useState } from "react";
import Footer from "@/components/Footer";
import { useResetPasswordRequestMutation } from "@/api";

const defaultValues: ResetPasswordRequestPayload = {
  email: ""
};

const ForgotPasswordPage: NextPage = () => {
  const [ResetPasswordRequest, { isLoading }] = useResetPasswordRequestMutation();

  const headTitle = useMemo(() => getHeadTitle("Esqueci minha senha"), []);

  const [isSuccessMessageVisible, setIsSuccessMessageVisible] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm({ defaultValues });
  const { control, handleSubmit, setError, clearErrors, watch } = form;

  const handleOnSubmit: SubmitHandler<ResetPasswordRequestPayload> = async ({ email }) => {
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(email)) {
      setError("email", { type: "manual", message: "Insira um e-mail válido" });
      return;
    }

    clearErrors("email");

    try {
      await ResetPasswordRequest({
        email: email,
      }).unwrap();

    } catch (error) {

      console.error('Erro ao redefinir a senha', error);
    } finally {
      setIsSuccessMessageVisible(true);
      setIsSubmitted(true);
    }
  };

  const emailValue = watch("email");

  useEffect(() => {
    setIsSubmitted(false);
    setIsSuccessMessageVisible(false);
  }, [emailValue]);

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
                  src="/icons/logo_mepa_nome.svg"
                  alt="Logo MEPA"
                  height="250px"
                  width="250px"
                />
              </Box>

              {isSuccessMessageVisible && (
                <Alert severity="success" sx={{ width: "100%" }}>
                  Você receberá instruções de como redefinir sua senha se este e-mail estiver cadastrado
                </Alert>
              )}

              <Box mt={4}>
                <Typography variant="h5" mb={1}>Esqueci minha senha</Typography>
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
                      message: "Insira um e-mail válido"
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
              <Box>
                <Button disabled={isLoading || isSubmitted} type="submit" variant="contained" fullWidth size="large">
                  {isLoading ? 'Enviando...' : 'Enviar'}
                </Button>
              </Box>

              <Box mt={5}>
                <Box display="flex" justifyContent="center">
                  <Link href="/">Voltar</Link>
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

export default ForgotPasswordPage;
