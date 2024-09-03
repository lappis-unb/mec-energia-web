import React from "react";
import { Grid, Typography, TextField } from "@mui/material";
import { Controller } from "react-hook-form";
import { hasEnoughCaracteresLength } from "../Validation/hasEnoughCaracteresLength";
import FormFieldError from "@/components/FormFieldError";

export default function ConsumerUnitSection({ control }) {
  return (
    <>
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
    </>
  );
}
