import React from "react";
import { Grid, TextField, Typography } from "@mui/material";
import { Controller } from "react-hook-form";
import { EditPersonForm } from "@/types/person";
import FormFieldError from "@/components/FormFieldError";
import { isValidEmail } from "@/utils/validations/form-validations";

interface FormEditPersonSectionsProps {
  control: any;
}

const FormEditPersonSections: React.FC<FormEditPersonSectionsProps> = ({
  control,
}) => {
  const hasEnoughCharactersLength = (
    value: EditPersonForm["firstName"] | EditPersonForm["lastName"]
  ) => {
    if (value.length < 3) return "Insira ao menos 3 caracteres";
    return true;
  };

  return (
    <>
      <Grid item xs={12}>
        <Typography variant="h5" style={{ marginBottom: "16px" }}>
          Informações pessoais
        </Typography>
      </Grid>

      <Grid item xs={12}>
        <Controller
          control={control}
          name="firstName"
          rules={{
            required: "Preencha este campo",
            validate: hasEnoughCharactersLength,
          }}
          render={({
            field: { onChange, onBlur, value, ref },
            fieldState: { error },
          }) => (
            <TextField
              style={{ marginBottom: "15px" }}
              ref={ref}
              value={value}
              label="Nome *"
              error={Boolean(error)}
              helperText={FormFieldError(error?.message)}
              fullWidth
              onChange={onChange}
              onBlur={onBlur}
            />
          )}
        />
      </Grid>

      <Grid item xs={12} mt={0.3}>
        <Controller
          control={control}
          name="lastName"
          rules={{
            required: "Preencha este campo",
            validate: hasEnoughCharactersLength,
          }}
          render={({
            field: { onChange, onBlur, value, ref },
            fieldState: { error },
          }) => (
            <TextField
              style={{ marginBottom: "15px" }}
              ref={ref}
              value={value}
              label="Sobrenome *"
              error={Boolean(error)}
              helperText={FormFieldError(error?.message)}
              fullWidth
              onChange={onChange}
              onBlur={onBlur}
            />
          )}
        />
      </Grid>

      <Grid item xs={12} mt={0.3}>
        <Controller
          control={control}
          name="email"
          rules={{
            required: "Preencha este campo",
            validate: isValidEmail,
          }}
          render={({
            field: { onChange, onBlur, value, ref },
            fieldState: { error },
          }) => (
            <TextField
              ref={ref}
              value={value}
              label="E-mail institucional *"
              placeholder="Ex.: voce@universidade.br"
              error={Boolean(error)}
              helperText={FormFieldError(error?.message)}
              fullWidth
              onChange={onChange}
              onBlur={onBlur}
            />
          )}
        />
      </Grid>
    </>
  );
};

export default FormEditPersonSections;
