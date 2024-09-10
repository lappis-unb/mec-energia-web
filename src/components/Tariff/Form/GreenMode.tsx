import FormFieldError from "@/components/FormFieldError";
import { CreateAndEditTariffForm } from "@/types/tariffs";
import { Grid, InputAdornment, TextField, Typography } from "@mui/material";
import React from "react";
import { Control, Controller } from "react-hook-form";
import { NumericFormat } from "react-number-format";

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<CreateAndEditTariffForm, any>;
}

export default function GreenMode({ control }: Props) {
  const maxTariffValue = 9999.99;
  return (
    <>
      <Grid item xs={12}>
        <Typography variant="h5">Modalidade Verde</Typography>
      </Grid>

      <Grid item xs={12} style={{ marginBottom: "20px", marginTop: "20px" }}>
        <Typography variant="inherit" color="primary">
          NA
        </Typography>
      </Grid>

      <Grid item xs={4}>
        <Controller
          control={control}
          name={"green.naTusdInReaisPerKw"}
          rules={{
            required: "Preencha este campo",
            min: {
              value: 0.01,
              message: "Insira um valor maior que R$ 0,00",
            },
          }}
          render={({
            field: { onChange, onBlur, value },
            fieldState: { error },
          }) => (
            <NumericFormat
              value={value !== 0 ? value : null}
              customInput={TextField}
              label="TUSD R$/kW  *"
              helperText={FormFieldError(error?.message)}
              error={!!error}
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">R$</InputAdornment>
                ),
                placeholder: "0,00",
                style: { maxWidth: "31.5%" },
              }}
              type="text"
              allowNegative={false}
              isAllowed={({ floatValue }) =>
                !floatValue || floatValue <= maxTariffValue
              }
              decimalScale={2}
              decimalSeparator=","
              thousandSeparator={"."}
              onValueChange={(values) => onChange(values.floatValue ?? null)}
              onBlur={onBlur}
            />
          )}
        />
      </Grid>

      <Grid item xs={12} style={{ marginBottom: "20px", marginTop: "10px" }}>
        <Typography variant="inherit" color="primary">
          Ponta
        </Typography>
      </Grid>
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <Controller
            control={control}
            name={"green.peakTusdInReaisPerMwh"}
            rules={{
              required: "Preencha este campo",
              min: {
                value: 0.01,
                message: "Insira um valor maior que R$ 0,00",
              },
            }}
            render={({
              field: { onChange, onBlur, value },
              fieldState: { error },
            }) => (
              <NumericFormat
                value={value !== 0 ? value : null}
                customInput={TextField}
                label="TUSD R$/MWh *"
                helperText={FormFieldError(error?.message)}
                error={!!error}
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">R$</InputAdornment>
                  ),
                  placeholder: "0,00",
                }}
                type="text"
                allowNegative={false}
                isAllowed={({ floatValue }) =>
                  !floatValue || floatValue <= maxTariffValue
                }
                decimalScale={2}
                decimalSeparator=","
                thousandSeparator={"."}
                onValueChange={(values) => onChange(values.floatValue ?? null)}
                onBlur={onBlur}
              />
            )}
          />
        </Grid>

        <Grid item xs={4}>
          <Controller
            control={control}
            name={"green.peakTeInReaisPerMwh"}
            rules={{
              required: "Preencha este campo",
              min: {
                value: 0.01,
                message: "Insira um valor maior que R$ 0,00",
              },
            }}
            render={({
              field: { onChange, onBlur, value },
              fieldState: { error },
            }) => (
              <NumericFormat
                value={value !== 0 ? value : null}
                customInput={TextField}
                label="TE R$/MWh  *"
                helperText={FormFieldError(error?.message)}
                error={!!error}
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">R$</InputAdornment>
                  ),
                  placeholder: "0,00",
                }}
                type="text"
                allowNegative={false}
                isAllowed={({ floatValue }) =>
                  !floatValue || floatValue <= maxTariffValue
                }
                decimalScale={2}
                decimalSeparator=","
                thousandSeparator={"."}
                onValueChange={(values) => onChange(values.floatValue ?? null)}
                onBlur={onBlur}
              />
            )}
          />
        </Grid>
      </Grid>
      <Grid item xs={12} style={{ marginBottom: "20px", marginTop: "10px" }}>
        <Typography variant="inherit" color="primary">
          Fora Ponta
        </Typography>
      </Grid>
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <Controller
            control={control}
            name={"green.offPeakTusdInReaisPerMwh"}
            rules={{
              required: "Preencha este campo",
              min: {
                value: 0.01,
                message: "Insira um valor maior que R$ 0,00",
              },
            }}
            render={({
              field: { onChange, onBlur, value },
              fieldState: { error },
            }) => (
              <NumericFormat
                value={value !== 0 ? value : null}
                customInput={TextField}
                label="TUSD R$/MWh *"
                helperText={FormFieldError(error?.message)}
                error={!!error}
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">R$</InputAdornment>
                  ),
                  placeholder: "0,00",
                }}
                type="text"
                allowNegative={false}
                isAllowed={({ floatValue }) =>
                  !floatValue || floatValue <= maxTariffValue
                }
                decimalScale={2}
                decimalSeparator=","
                thousandSeparator={"."}
                onValueChange={(values) => onChange(values.floatValue ?? null)}
                onBlur={onBlur}
              />
            )}
          />
        </Grid>

        <Grid item xs={4}>
          <Controller
            control={control}
            name={"green.offPeakTeInReaisPerMwh"}
            rules={{
              required: "Preencha este campo",
              min: {
                value: 0.01,
                message: "Insira um valor maior que R$ 0,00",
              },
            }}
            render={({
              field: { onChange, onBlur, value },
              fieldState: { error },
            }) => (
              <NumericFormat
                value={value !== 0 ? value : null}
                customInput={TextField}
                label="TE R$/MWh  *"
                helperText={FormFieldError(error?.message)}
                error={!!error}
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">R$</InputAdornment>
                  ),
                  placeholder: "0,00",
                }}
                type="text"
                allowNegative={false}
                isAllowed={({ floatValue }) =>
                  !floatValue || floatValue <= maxTariffValue
                }
                decimalScale={2}
                decimalSeparator=","
                thousandSeparator={"."}
                onValueChange={(values) => onChange(values.floatValue ?? null)}
                onBlur={onBlur}
              />
            )}
          />
        </Grid>
      </Grid>
    </>
  );
}
