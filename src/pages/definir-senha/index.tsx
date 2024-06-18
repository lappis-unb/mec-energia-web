import { getHeadTitle } from "@/utils/head";
import { Alert, Box, Button, Link, Paper, TextField, Typography } from "@mui/material";
import { NextPage } from "next";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import Head from "next/head";
import Image from "next/image";
import { useMemo, useState, useEffect } from "react";
import { ConfirmResetPasswordPayload } from "@/types/auth";
import { useRouter } from "next/router";
import Footer from "@/components/Footer";
import { useConfirmResetPasswordMutation } from "@/api";

const defaultValues: ConfirmResetPasswordPayload = {
  password: "",
  confirmPassword: ""
};

const DefinePasswordPage: NextPage = () => {
  const [confirmResetPassword, { isLoading, error: mutationError }] = useConfirmResetPasswordMutation();
  const headTitle = useMemo(() => getHeadTitle("Definir Senha"), []);
  const [isValidPassword, setIsValidPassword] = useState<{
    hasLetter: boolean | null,
    hasNumber: boolean | null,
    hasSpecialChar: boolean | null,
    minLength: boolean | null
  }>({
    hasLetter: null,
    hasNumber: null,
    hasSpecialChar: null,
    minLength: null
  });
  const [nome, setNome] = useState<string | undefined>();
  const [token, setToken] = useState<string>("");

  const router = useRouter();

  useEffect(() => {
    // Acesso aos parâmetros da rota
    const { nome: nomeParam, token: tokenParam } = router.query;

    if (nomeParam) {
      setNome(nomeParam as string);
    }
    if (tokenParam) {
      setToken(tokenParam as string);
    }
  }, [router.query]);
  
  const {
    query: { error },
  } = useRouter();

  const form = useForm({ defaultValues });
  const { control, handleSubmit, watch, setError, clearErrors } = form;

  const password = watch("password");

  useEffect(() => {
    if (password) {
      setIsValidPassword({
        hasLetter: /[a-zA-Z]/.test(password),
        hasNumber: /[0-9]/.test(password),
        hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
        minLength: password.length >= 8
      });
    } else {
      setIsValidPassword({
        hasLetter: null,
        hasNumber: null,
        hasSpecialChar: null,
        minLength: null
      });
    }
  }, [password]);

  const handleOnSubmit: SubmitHandler<ConfirmResetPasswordPayload> = async ({
    password,
    confirmPassword
  }) => {
    if (password !== confirmPassword) {
      setError("confirmPassword", { type: "manual", message: "As senhas não coincidem" });
      return;
    }

    clearErrors("confirmPassword");

    try {
      await confirmResetPassword({
        user_token: token,
        user_new_password: password,
      }).unwrap();
      
      // Redirect or show a success message
      console.log('Senha redefinida com sucesso');
      router.push('/');
    } catch (error) {
      // Handle error
      console.error('Erro ao redefinir a senha', error);
    }
  };

  const getColor = (criteria: boolean | null) => {
    if (criteria === null) return "text.primary";
    return criteria ? "success.main" : "error";
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

              <Box mt={4}>
                <Typography variant="h5">Olá, {nome}</Typography>
                <Typography variant="subtitle1">Cadastre uma senha para acessar o sistema.</Typography>
                <Typography variant="subtitle1">Todos os campos são obrigatórios.</Typography>
              </Box>

              <Box mt={3}>
                <Controller
                  control={control}
                  name="password"
                  rules={{
                    required: "Preencha este campo",
                    minLength: {
                      value: 8,
                      message: "A senha deve ter no mínimo 8 caracteres"
                    },
                    validate: {
                      hasLetter: value => /[a-zA-Z]/.test(value),
                      hasNumber: value => /[0-9]/.test(value),
                      hasSpecialChar: value => /[!@#$%^&*(),.?":{}|<>]/.test(value)
                    }
                  }}
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
                <Typography variant="subtitle1" color={getColor(isValidPassword.hasLetter)}>
                  - Ao menos 1 letra
                </Typography>
                <Typography variant="subtitle1" color={getColor(isValidPassword.hasNumber)}>
                  - Ao menos 1 número
                </Typography>
                <Typography variant="subtitle1" color={getColor(isValidPassword.hasSpecialChar)}>
                  - Ao menos 1 caractere especial (exs.: !?*-_.#$)
                </Typography>
                <Typography variant="subtitle1" color={getColor(isValidPassword.minLength)}>
                  - Mínimo de 8 caracteres
                </Typography>
              </Box>

              <Box mt={3}>
                <Controller
                  control={control}
                  name="confirmPassword"
                  rules={{
                    required: "Preencha este campo",
                    validate: value => value === password || "As senhas não coincidem"
                  }}
                  render={({
                    field: { onChange, onBlur, value, ref },
                    fieldState: { error },
                  }) => (
                    <TextField
                      ref={ref}
                      value={value}
                      label="Repetir Senha"
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

              {error && (
                <Box mt={2}>
                  <Alert severity="error" variant="filled">
                    E-mail não cadastrado e/ou senha inválida
                  </Alert>
                </Box>
              )}

              {mutationError && (
                <Box mt={2}>
                  <Alert severity="error" variant="filled">
                    {mutationError.message}
                  </Alert>
                </Box>
              )}

              <Box mt={2}>
                <Button type="submit" variant="contained" fullWidth disabled={isLoading}>
                  {isLoading ? 'Gravando...' : 'Gravar'}
                </Button>
              </Box>

              <Box mt={5}>
                <Box display="flex" justifyContent="center">
                  <Link href="/">Cancelar</Link>
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

export default DefinePasswordPage;
