import React, { useCallback } from "react";
import {
  Grid,
  Typography,
  TextField,
  FormGroup,
  Box,
  FormControlLabel,
  Switch,
  FormHelperText,
} from "@mui/material";
import { Controller } from "react-hook-form";
import FlashOnIcon from "@mui/icons-material/FlashOn";
import { hasEnoughCaracteresLength } from "../Validation/hasEnoughCaracteresLength";
import FormFieldError from "@/components/FormFieldError";

export default function ConsumerUnitSection({
  control,
  consumerUnit,
  showActiveSwitch,
}) {
  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h5" style={{ marginBottom: "16px" }}>
            Unidade Consumidora
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Controller
            control={control}
            name="name"
            rules={{
              required: "Preencha este campo",
              validate: (value) => hasEnoughCaracteresLength(value),
            }}
            render={({
              field: { onChange, onBlur, value, ref },
              fieldState: { error },
            }) => (
              <TextField
                ref={ref}
                value={value}
                label="Nome *"
                placeholder="Ex.: Campus Gama, Biblioteca, Faculdade de Medicina"
                error={Boolean(error)}
                helperText={FormFieldError(error?.message)}
                fullWidth
                onChange={onChange}
                onBlur={onBlur}
                inputProps={{ maxLength: 50 }}
              />
            )}
          />
        </Grid>

        {showActiveSwitch && (
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
                    {consumerUnit && (
                      <FormControlLabel
                        label="Unidade ativa"
                        labelPlacement="start"
                        sx={{ margin: 0.5 }}
                        control={
                          <Box>
                            <Switch
                              value={value}
                              defaultChecked={consumerUnit?.isActive}
                              onChange={onChange}
                            />
                          </Box>
                        }
                      />
                    )}
                  </Box>

                  <FormHelperText>
                    <p>
                      Só unidades ativas geram recomendações e recebem faturas.
                      Não é possível excluir unidades, apenas desativá-las.
                    </p>
                  </FormHelperText>
                </FormGroup>
              )}
            />
          </Grid>
        )}
      </Grid>
    </>
  );
}
