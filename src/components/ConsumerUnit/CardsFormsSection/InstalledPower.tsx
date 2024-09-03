import React from "react";
import {
  Grid,
  Typography,
  TextField,
  InputAdornment,
  Switch,
  FormControl,
  FormControlLabel,
  Alert,
} from "@mui/material";
import { Controller } from "react-hook-form";
import { NumericFormat } from "react-number-format";
import FormFieldError from "@/components/FormFieldError";

export default function InstalledPower({ control, shouldShowInstalledPower }) {
  return (
    <Grid container spacing={2}>
      <Grid
        item
        xs={12}
        display="flex"
        flexDirection={"row"}
        justifyContent={"begin"}
        alignItems={"center"}
      >
        <Typography variant="h5">Geração de energia</Typography>
        {control && (
          <Controller
            name="shouldShowInstalledPower"
            control={control}
            render={({ field: { onChange, value } }) => (
              <FormControl>
                <FormControlLabel
                  sx={{ marginLeft: 0.5 }}
                  control={<Switch checked={value} onChange={onChange} />}
                />
              </FormControl>
            )}
          />
        )}
      </Grid>
      {/*Mas se arrasta o botão, quebra a aplicação*/}
      {shouldShowInstalledPower && (
        <>
          <Grid item xs={12}>
            <Alert severity="info" variant="standard">
              Insira o valor total da potência de geração instalada na Unidade
              Consumidora. Some a potência de todas as plantas fotovoltaicas
              instaladas, se houver mais de uma.
            </Alert>
          </Grid>

          <Grid item xs={12}>
            <Controller
              control={control}
              name="totalInstalledPower"
              rules={{
                required: "Preencha este campo",
                min: {
                  value: 0.01,
                  message: "Insira um valor maior que 0,00",
                },
              }}
              render={({
                field: { onChange, onBlur, value },
                fieldState: { error },
              }) => (
                <NumericFormat
                  value={value}
                  customInput={TextField}
                  label="Potência Instalada *"
                  fullWidth
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">kW</InputAdornment>
                    ),
                  }}
                  type="text"
                  allowNegative={false}
                  isAllowed={({ floatValue }) =>
                    !floatValue || floatValue <= 99999.99
                  }
                  decimalScale={2}
                  decimalSeparator=","
                  thousandSeparator={"."}
                  error={!!error}
                  helperText={FormFieldError(error?.message)}
                  onValueChange={(values) => onChange(values.floatValue)}
                  onBlur={onBlur}
                />
              )}
            />
          </Grid>
        </>
      )}
    </Grid>
  );
}
