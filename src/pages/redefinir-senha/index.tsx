import { NextPage } from "next";
import { Alert, Box, Button, Grid, Paper, TextField, Typography, IconButton, InputAdornment } from "@mui/material";
import Image from "next/image";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState, useEffect, useMemo } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { ConfirmResetPasswordPayload, SignInRequestPayload } from "@/types/auth";
import { getHeadTitle } from "@/utils/head";
import Footer from "@/components/Footer";
import FormWarningDialog from "@/components/ConsumerUnit/Form/WarningDialog";
import { useConfirmResetPasswordMutation, useValidateResetPasswordTokenQuery } from "@/api";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ReportIcon from '@mui/icons-material/Report';
import { setIsTokenValid, setUserAlreadyCreatedName } from "@/store/appSlice";
import { useDispatch } from "react-redux";
import { TokenStatus } from "@/types/app";
import { signIn } from "next-auth/react";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Tooltip from '@mui/material/Tooltip';

const defaultValues: ConfirmResetPasswordPayload = {
    newPassword: "",
    confirmPassword: ""
};

const RedefinePasswordPage: NextPage = () => {
    const [confirmResetPassword, { isLoading, error: mutationError }] = useConfirmResetPasswordMutation();
    const headTitle = useMemo(() => getHeadTitle("Redefinir Senha"), []);
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
    const [nome, setNome] = useState<string | undefined>("");
    const [email, setEmail] = useState<undefined | string>("");
    const [token, setToken] = useState<string>("");
    const [shouldShowCancelDialog, setShouldShowCancelDialog] = useState(false);
    const [isTokenVerified, setIsTokenVerified] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const dispatch = useDispatch();
    const router = useRouter();
    const { query: { nome: nomeParam, token: tokenParam } } = router;

    useEffect(() => {
        if (nomeParam) {
            setNome(nomeParam as string);
        }
        if (tokenParam) {
            setToken(tokenParam as string);
        }
    }, [nomeParam, tokenParam]);

    const { data: tokenStatus, error: validationError, status } = useValidateResetPasswordTokenQuery(token, {
        skip: !token,
    });

    useEffect(() => {
        if (status === 'fulfilled') {
            if (tokenStatus?.code === 1) {
                setEmail(tokenStatus?.email)
                dispatch(setIsTokenValid(TokenStatus.RESET_PASSWORD));
                setIsTokenVerified(true);
            } else if (tokenStatus?.code === 2) {
                dispatch(setIsTokenValid(TokenStatus.RESET_PASSWORD_INVALID));
                router.push('/');
            }
        } else if (status === 'rejected' || validationError) {
            dispatch(setIsTokenValid(TokenStatus.TOKEN_ALREADY_USED));
            dispatch(setUserAlreadyCreatedName(nome))
            router.push('/');
        }
    }, [tokenStatus, validationError, status]);


    useEffect(() => {
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

    const form = useForm({ defaultValues: defaultValues });
    const {
        control,
        handleSubmit,
        watch,
        setError,
        clearErrors,
    } = form;

    const password = watch("newPassword");

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

    const handleOnSubmitNewPassword: SubmitHandler<ConfirmResetPasswordPayload> = async ({
        newPassword,
        confirmPassword
    }) => {
        if (newPassword !== confirmPassword) {
            setError("confirmPassword", { type: "manual", message: "Insira uma senha idêntica à \"Nova senha\"" });
            return;
        }

        clearErrors("confirmPassword");

        try {
            await confirmResetPassword({
                user_token: token,
                user_new_password: password,
            }).unwrap();

            if (email !== undefined) {
                handleOnSubmit({ username: email, password: password });
            }
        } catch (error) {
            console.error('Erro ao redefinir a senha', error);
        }
    };

    const getColor = (criteria: boolean | null) => {
        if (criteria === null) return "text.secondary";
        return criteria ? "primary.main" : "error";
    };

    const renderValidationIcon = (isValid: boolean | null) => {
        if (isValid === null) return "-";
        return isValid ? (
            <CheckCircleIcon color="primary.main" sx={{ verticalAlign: "middle", fontSize: 19 }} />
        ) : (
            <ReportIcon color="error" sx={{ verticalAlign: "middle", fontSize: 19 }} />
        );
    };

    const handleCancelEdition = () => {
        setShouldShowCancelDialog(true);
    };

    const handleDiscardForm = () => {
        router.push('/');
    };

    const handleCloseDialog = () => {
        setShouldShowCancelDialog(false);
    };

    if (!isTokenVerified) {
        return (
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                minHeight="100vh"
            >
                <Grid container justifyContent="center">
                    <Grid item>
                        <Typography sx={{ color: "gray" }}>Carregando...</Typography>
                    </Grid>
                </Grid>
            </Box>
        );
    }

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
                            onSubmit={handleSubmit(handleOnSubmitNewPassword)}
                        >
                            <Box
                                mt={4}
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
                            <Box mt={4}>
                                <Typography variant="h5">Olá, {nome}</Typography>
                                <Typography variant="subtitle1">Cadastre uma nova senha de acesso. Sua senha atual foi desativada.</Typography>
                                <Typography variant="subtitle1">Todos os campos são obrigatórios.</Typography>
                            </Box>

                            <Box mt={3}>
                                <Controller
                                    control={control}
                                    name="newPassword"
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
                                            label="Nova senha"
                                            type={showNewPassword ? "text" : "password"}
                                            error={Boolean(error)}
                                            fullWidth
                                            onChange={onChange}
                                            onBlur={onBlur}
                                            InputProps={{
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <Tooltip title={showNewPassword ? "Ocultar senha" : "Exibir senha"}>
                                                            <IconButton
                                                                onClick={() => setShowNewPassword(!showNewPassword)}
                                                                onMouseDown={(e) => e.preventDefault()}
                                                                sx={{ color: showNewPassword ? 'primary.main' : 'action.active' }}
                                                            >
                                                                {showNewPassword ? <VisibilityOff /> : <Visibility />}
                                                            </IconButton>
                                                        </Tooltip>
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                    )}
                                />
                                <Box mt={1} sx={{ display: "grid" }}>
                                    <Typography variant="caption" color={getColor(isValidPassword.hasLetter)}>
                                        {renderValidationIcon(isValidPassword.hasLetter)} Ao menos 1 letra
                                    </Typography>
                                    <Typography variant="caption" color={getColor(isValidPassword.hasNumber)}>
                                        {renderValidationIcon(isValidPassword.hasNumber)} Ao menos 1 número
                                    </Typography>
                                    <Typography variant="caption" color={getColor(isValidPassword.hasSpecialChar)}>
                                        {renderValidationIcon(isValidPassword.hasSpecialChar)} Ao menos 1 caractere especial (exs.: !?*-_.#$)
                                    </Typography>
                                    <Typography alignContent={"center"} variant="caption" color={getColor(isValidPassword.minLength)}>
                                        {renderValidationIcon(isValidPassword.minLength)} Mínimo de 8 caracteres
                                    </Typography>
                                </Box>
                            </Box>
                            <Box mt={3}>
                                <Controller
                                    control={control}
                                    name="confirmPassword"
                                    rules={{
                                        required: "Preencha este campo",
                                        validate: value => value === password || "Insira uma senha idêntica à \"Nova senha\""
                                    }}
                                    render={({
                                        field: { onChange, onBlur, value, ref },
                                        fieldState: { error },
                                    }) => (
                                        <TextField
                                            ref={ref}
                                            value={value}
                                            label="Repetir senha"
                                            type={showConfirmPassword ? "text" : "password"}
                                            error={Boolean(error)}
                                            helperText={error ? (
                                                <Box display="flex" alignItems="center">
                                                    <ReportIcon color="error" sx={{ mr: 1 }} />
                                                    {error.message}
                                                </Box>
                                            ) : " "}
                                            fullWidth
                                            onChange={onChange}
                                            onBlur={onBlur}
                                            InputProps={{
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <Tooltip title={showConfirmPassword ? "Ocultar senha" : "Exibir senha"}>
                                                            <IconButton
                                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                                onMouseDown={(e) => e.preventDefault()}
                                                                sx={{ color: showConfirmPassword ? 'primary.main' : 'action.active' }}
                                                            >
                                                                {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                                            </IconButton>
                                                        </Tooltip>
                                                    </InputAdornment>
                                                ),
                                            }}
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
                                <Box mb={2}>
                                    <Alert severity="error" variant="filled">
                                        O limite de tempo para cadastrar a senha foi atingido.
                                        <br />
                                        Por segurança, você reberá um novo link por e-mail em 1 hora.
                                    </Alert>
                                </Box>
                            )}

                            <Box>
                                <Button size="large" type="submit" variant="contained" fullWidth disabled={isLoading}>
                                    {isLoading ? 'Gravando...' : 'Gravar'}
                                </Button>
                            </Box>

                            <Box mt={3}>
                                <Box display="flex" justifyContent="center">
                                    <Button sx={{ textDecoration: 'underline' }} href="#" onClick={handleCancelEdition}>Cancelar</Button>
                                </Box>
                            </Box>
                        </Box>
                        <FormWarningDialog
                            entity="cadastro de nova senha"
                            open={shouldShowCancelDialog}
                            onClose={handleCloseDialog}
                            onDiscard={handleDiscardForm}
                        />
                    </Paper>
                </Box >

                <Footer />
            </Box >
        </>
    );
};

export default RedefinePasswordPage;
