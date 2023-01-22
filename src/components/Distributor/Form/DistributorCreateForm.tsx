import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { selectIsDistributorCreateFormOpen, setIsDistributorCreateFormOpen, setIsErrorNotificationOpen, setIsSucessNotificationOpen } from '../../../store/appSlice';
import { CreateDistributorForm, CreateDistributorRequestPayload } from '../../../types/distributor';
import FormDrawer from '../../Form/Drawer';
import { PatternFormat } from 'react-number-format';

import {
  Controller, FormProvider, SubmitHandler, useForm,
} from "react-hook-form";
import { Box, Button, Grid, TextField, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab'
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import FormWarningDialog from '../../ConsumerUnit/Form/WarningDialog';
import { useCreateDistributorMutation } from '@/api';
import { useSession } from 'next-auth/react';

const defaultValues: CreateDistributorForm = {
  name: "",
  cnpj: "",
};

const DistributorCreateForm = () => {
  const dispatch = useDispatch();
  const { data: session } = useSession()
  const user = session?.user
  const isCreateFormOpen = useSelector(selectIsDistributorCreateFormOpen);
  const [shouldShowCancelDialog, setShouldShowCancelDialog] = useState(false);
  const [createDistributor, { isError, isSuccess, isLoading }] = useCreateDistributorMutation()
  const form = useForm({ defaultValues });
  const {
    control,
    reset,
    handleSubmit,
    formState: { isDirty },
  } = form;
  const handleCancelEdition = () => {
    if (isDirty) {
      setShouldShowCancelDialog(true);
      return;
    }
    handleDiscardForm();
  };

  const handleDiscardForm = useCallback(() => {
    handleCloseDialog();
    reset();
    dispatch(setIsDistributorCreateFormOpen(false));
  }, [dispatch, reset]);

  const handleCloseDialog = () => {
    setShouldShowCancelDialog(false);
  };

  const onSubmitHandler: SubmitHandler<CreateDistributorForm> = async (data) => {
    const cnpjSemMascara = data.cnpj.replace(/[\/.-]/g, '');
    data.cnpj = cnpjSemMascara
    const body: CreateDistributorRequestPayload = {
      name: data.name,
      cnpj: data.cnpj,
      isActive: true,
      university: user?.universityId as number
    }
    await createDistributor(body)
  };

  //Notificações
  const handleNotification = useCallback(() => {
    if (isSuccess) {
      dispatch(setIsSucessNotificationOpen({
        isOpen: true,
        text: "Distribuidora adicionada com sucesso!"
      }))
      reset();
      dispatch(setIsDistributorCreateFormOpen(false))
    }
    else if (isError)
      dispatch(setIsErrorNotificationOpen({
        isOpen: true,
        text: "Erro ao adicionar distribuidora."
      }))
  }, [dispatch, isError, isSuccess, reset])

  useEffect(() => {
    handleNotification()
  }, [handleNotification, isSuccess, isError])

  return (
    <FormDrawer open={isCreateFormOpen} handleCloseDrawer={handleCancelEdition}>
      <FormProvider {...form}>
        <Box component="form" onSubmit={handleSubmit(onSubmitHandler)}>
          <Grid container spacing={2}>

            <Grid item xs={12}>
              <Typography variant="h4">
                Adicionar Distribuidora
              </Typography>
              <Typography>
                * campos obrigatórios
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h5">
                Distribuidora
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Controller
                control={control}
                name="name"
                rules={{ required: "Preencha este campo" }}
                render={({
                  field: { onChange, onBlur, value, ref },
                  fieldState: { error },
                }) => (
                  <TextField
                    ref={ref}
                    value={value}
                    label="Nome *"
                    placeholder='Ex.: CEMIG, Enel, Neonergia'
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
                name="cnpj"
                rules={{
                  required: "Preencha este campo",
                  pattern: {
                    value: /([0-9]{2}[\.]?[0-9]{3}[\.]?[0-9]{3}[\/]?[0-9]{4}[-]?[0-9]{2})/,
                    message: "Insira um CNPJ válido com 14 dígitos"
                  }
                }}
                render={({
                  field: { onChange, onBlur, value },
                  fieldState: { error },
                }) => (
                  <PatternFormat
                    value={value}
                    customInput={TextField}
                    label="CNPJ *"
                    format='##.###.###/####-##'
                    placeholder='Ex.: 12345678000167'
                    error={Boolean(error)}
                    helperText={error?.message ?? " "}
                    fullWidth
                    onChange={onChange}
                    onBlur={onBlur}
                  />
                )}
              />
            </Grid>


            <Grid item xs={3}>
              <LoadingButton
                type="submit"
                variant="contained"
                size='large'
                loading={isLoading}
                startIcon={<TaskAltIcon />}
                loadingPosition="start"
              >
                {isLoading ? 'Gravando' : 'Gravar'}
              </LoadingButton>
            </Grid>

            <Grid item xs={2}>
              <Button variant="text" onClick={handleCancelEdition} size='large'>
                <Typography pl={3} pr={3}>Cancelar</Typography>
              </Button>
            </Grid>

          </Grid>

          <FormWarningDialog
            open={shouldShowCancelDialog}
            entity={"distribuidora"}
            onClose={handleCloseDialog}
            onDiscard={handleDiscardForm}
          />

        </Box>
      </FormProvider>
    </FormDrawer>
  )
}

export default DistributorCreateForm;
