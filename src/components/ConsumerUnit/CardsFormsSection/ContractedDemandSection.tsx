import React from "react";
import {
  Grid,
  Box,
  Typography,
  FormControl,
  FormControlLabel,
  RadioGroup,
  Radio,
  FormLabel,
  FormHelperText,
  InputAdornment,
  TextField,
} from "@mui/material";
import { Controller } from "react-hook-form";
import { NumericFormat } from "react-number-format";
import FormFieldError from "@/components/FormFieldError";
import { isValueGreaterThenZero } from "../Validation/isValueGreaterThenZero";

export default function ContractedDemandSection({
  control,
  tariffFlag,
  shouldShowGreenDemand,
}) {
  return (
    <>
      <Grid item xs={12}>
        <Typography variant="h5">Demanda Contratada</Typography>
      </Grid>

      <Grid item xs={12}>
        <Controller
          control={control}
          name="tariffFlag"
          rules={{ required: "Preencha este campo" }}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <FormControl error={!!error}>
              <FormLabel>Modalidade tarifária *</FormLabel>
              <RadioGroup value={value} onChange={onChange}>
                <Box
                  display={"flex"}
                  justifyContent="flex-start"
                  alignItems="center"
                >
                  <FormControlLabel
                    value="G"
                    control={<Radio />}
                    label="Verde"
                    disabled={!shouldShowGreenDemand}
                  />
                  <FormHelperText>(Demanda única)</FormHelperText>
                </Box>
                <Box
                  display={"flex"}
                  justifyContent="flex-start"
                  alignItems="center"
                >
                  <FormControlLabel
                    value="B"
                    control={<Radio />}
                    label="Azul"
                  />
                  <FormHelperText>
                    (Demanda de ponta e fora ponta)
                  </FormHelperText>
                </Box>
              </RadioGroup>
              <FormHelperText>{FormFieldError(error?.message)}</FormHelperText>
            </FormControl>
          )}
        />
      </Grid>

      {tariffFlag === "G" ? (
        <Grid item xs={7}>
          <Controller
            control={control}
            name="contracted"
            rules={{
              required: "Preencha este campo",
              validate: (value) => isValueGreaterThenZero(value),
            }}
            render={({
              field: { onChange, onBlur, value },
              fieldState: { error },
            }) => (
              <NumericFormat
                value={value}
                customInput={TextField}
                label="Demanda *"
                fullWidth
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">kW</InputAdornment>
                  ),
                }}
                type="text"
                allowNegative={false}
                isAllowed={({ floatValue }) =>
                  !floatValue || floatValue <= 9999999.99
                }
                decimalScale={2}
                decimalSeparator=","
                thousandSeparator={"."}
                error={Boolean(error)}
                helperText={FormFieldError(error?.message)}
                onValueChange={(values) => onChange(values.floatValue)}
                onBlur={onBlur}
              />
            )}
          />
        </Grid>
      ) : (
        <Box>
          <Grid item xs={8}>
            <Controller
              control={control}
              name="peakContractedDemandInKw"
              rules={{
                required: "Preencha este campo",
                validate: (value) => isValueGreaterThenZero(value),
              }}
              render={({
                field: { onChange, onBlur, value },
                fieldState: { error },
              }) => (
                <NumericFormat
                  value={value}
                  customInput={TextField}
                  label="Dema. Ponta *"
                  fullWidth
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">kW</InputAdornment>
                    ),
                  }}
                  type="text"
                  allowNegative={false}
                  isAllowed={({ floatValue }) =>
                    !floatValue || floatValue <= 9999999.99
                  }
                  decimalScale={2}
                  decimalSeparator=","
                  thousandSeparator={"."}
                  error={Boolean(error)}
                  helperText={FormFieldError(error?.message)}
                  onValueChange={(values) => onChange(values.floatValue)}
                  onBlur={onBlur}
                />
              )}
            />
          </Grid>

          <Grid item xs={8}>
            {control && (
              <Controller
                control={control}
                name="offPeakContractedDemandInKw"
                rules={{
                  required: "Preencha este campo",
                  validate: (value) => isValueGreaterThenZero(value),
                }}
                render={({
                  field: { onChange, onBlur, value },
                  fieldState: { error },
                }) => (
                  <NumericFormat
                    value={value}
                    customInput={TextField}
                    label="Dem. Fora Ponta *"
                    fullWidth
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">kW</InputAdornment>
                      ),
                    }}
                    type="text"
                    allowNegative={false}
                    isAllowed={({ floatValue }) =>
                      !floatValue || floatValue <= 9999999.99
                    }
                    decimalScale={2}
                    decimalSeparator=","
                    thousandSeparator={"."}
                    error={Boolean(error)}
                    helperText={FormFieldError(error?.message)}
                    onValueChange={(values) => onChange(values.floatValue)}
                    onBlur={onBlur}
                  />
                )}
              />
            )}
          </Grid>
          {!shouldShowGreenDemand && (
            <Typography variant="body2" sx={{ px: 2 }}>
              O valor de tensão contratada inserido é compatível apenas com a
              modalidade azul
            </Typography>
          )}
        </Box>
      )}
    </>
  );
}
