import React from 'react';
import {
  Box,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  Grid,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { Controller, Control } from "react-hook-form";
import { PatternFormat } from "react-number-format";
import FlashOnIcon from "@mui/icons-material/FlashOn";
import FormFieldError from "@/components/FormFieldError";
import isValidCnpj from "@/utils/validations/isValidCnpj";
import { hasEnoughCaracteresLength, hasConsecutiveSpaces, formatCnpj, removeLeadingSpaces } from './Utils';
import { CreateDistributorForm, EditDistributorForm } from "@/types/distributor";

interface DistributorFormSectionProps<T> {
  control: Control<T>;
  cnpjValid: boolean;
  setCnpjValid: (valid: boolean) => void;
  distributor?: EditDistributorForm;
}

const DistributorFormSection = <T extends CreateDistributorForm | EditDistributorForm>({
  control,
  cnpjValid,
  setCnpjValid,
  distributor,
}: DistributorFormSectionProps<T>) => {
  return (
    <Grid container spacing={1}>
      <Grid item xs={12}>
        <Typography variant="h5" style={{ marginBottom: '10px' }}>
          Distribuidora
        </Typography>
      </Grid>

      <Grid item xs={12}>
        <Controller
          control={control}
          name="name"
          rules={{
            required: 'Preencha este campo',
            validate: {
              hasEnoughCaracteresLength,
              hasConsecutiveSpaces,
            },
          }}
          render={({ field: { onChange, onBlur, value, ref }, fieldState: { error } }) => (
            <TextField
              ref={ref}
              value={value}
              label="Nome *"
              placeholder="Ex.: CEMIG, Enel, Neonergia"
              error={!!error}
              helperText={FormFieldError(error?.message)}
              fullWidth
              onBlur={onBlur}
              onChange={(e) => {
                const { value } = e.target;
                const updatedValue = removeLeadingSpaces(value).replace(/\s{2,}/g, ' ');
                e.target.value = updatedValue;
                onChange(e);
              }}
            />
          )}
        />
      </Grid>

      <Grid item xs={12}>
        <Controller
          control={control}
          name="cnpj"
          rules={{
            required: 'Preencha este campo',
            validate: (value) =>
              isValidCnpj(value) || 'Insira um CNPJ válido com 14 dígitos',
          }}
          render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
            <PatternFormat
              value={value}
              customInput={TextField}
              label="CNPJ *"
              format="##.###.###/####-##"
              placeholder="Ex.: 12345678000167"
              error={!!error || !cnpjValid}
              helperText={
                FormFieldError(error?.message ?? (cnpjValid ? undefined : 'CNPJ inválido'))
              }
              fullWidth
              onChange={(e) => {
                const newValue = e.target.value;
                onChange(newValue);
                const digits = formatCnpj(newValue);
                digits.length === 14
                  ? setCnpjValid(isValidCnpj(digits))
                  : setCnpjValid(true);
              }}
              onBlur={onBlur}
            />
          )}
        />
      </Grid>

      {distributor && (
        <Grid item xs={12}>
          <Controller
            name="isActive"
            control={control}
            render={({ field: { onChange, value } }) => (
              <FormGroup>
                <Box
                  display="flex"
                  justifyContent="flex-start"
                  alignItems="center"
                  marginTop={0}
                  style={{ marginTop: 0, paddingTop: 0 }}
                >
                  <FlashOnIcon color="primary" />
                  <FormControlLabel
                    label="Distribuidora ativa"
                    labelPlacement="start"
                    sx={{ width: '40%', margin: 0 }}
                    control={
                      <Box>
                        <Switch
                          checked={value}
                          defaultChecked={distributor.isActive}
                          onChange={onChange}
                        />
                      </Box>
                    }
                  />
                </Box>
                <FormHelperText>
                  <p>
                    Só distribuidoras ativas permitem gerar recomendações para as unidades consumidoras relacionadas.
                  </p>
                  <p>
                    Apenas as distribuidoras que não estão relacionadas à nenhuma unidade consumidora podem ser excluídas.
                  </p>
                </FormHelperText>
              </FormGroup>
            )}
          />
        </Grid>
      )}
    </Grid>
  );
};

export default DistributorFormSection;