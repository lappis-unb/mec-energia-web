import { Controller } from "react-hook-form";
import {
  Autocomplete,
  Box,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import {
  CreatePersonForm as CreatePersonFormType,
  UserRole,
} from "@/types/person";
import { isValidEmail } from "@/utils/validations/form-validations";
import FormFieldError from "@/components/FormFieldError";
import { FormInfoAlert } from "@/components/Form/FormInfoAlert";

interface PersonalInformationSectionProps {
  control: any;
  errors: any;
  institutionsOptions: { label: string; id: number }[];
  session: any;
}

export const PersonalInformationSection = ({
  control,
  errors,
  institutionsOptions,
  session,
}: PersonalInformationSectionProps) => {
  const hasEnoughCaracteresLength = (
    value: CreatePersonFormType["firstName"] | CreatePersonFormType["lastName"]
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
            validate: hasEnoughCaracteresLength,
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
      <Grid item xs={12}>
        <Controller
          control={control}
          name="lastName"
          rules={{
            required: "Preencha este campo",
            validate: hasEnoughCaracteresLength,
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
      <Grid item xs={12}>
        <Controller
          control={control}
          name="email"
          rules={{ required: "Preencha este campo", validate: isValidEmail }}
          render={({
            field: { onChange, onBlur, value, ref },
            fieldState: { error },
          }) => (
            <TextField
              style={{ marginBottom: "15px" }}
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
      {session?.user?.type === UserRole.SUPER_USER && (
        <Grid item xs={12}>
          <Controller
            control={control}
            name="university"
            rules={{ required: "Selecione alguma universidade" }}
            render={({
              field: { onChange, onBlur, value },
              fieldState: { error },
            }) => (
              <>
                <Autocomplete
                  id="university-select"
                  options={institutionsOptions || []}
                  getOptionLabel={(option) => option.label}
                  sx={{ width: 450 }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Instituição *"
                      placeholder="Selecione uma instituição"
                      error={Boolean(error)}
                      helperText={FormFieldError(error?.message)}
                      fullWidth
                      onChange={onChange}
                      onBlur={onBlur}
                    />
                  )}
                  value={value}
                  onBlur={onBlur}
                  onChange={(_, data) => onChange(data)}
                />
              </>
            )}
          />
        </Grid>
      )}
    </>
  );
};

interface PerfilSectionProps {
  control: any;
  error: any;
}

export const PerfilSection = ({ control, error }: PerfilSectionProps) => (
  <>
    <Grid item xs={12}>
      <Typography variant="h5">Perfil</Typography>
    </Grid>
    <Grid item xs={8}>
      <Controller
        control={control}
        name="type"
        rules={{ required: "Preencha este campo" }}
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <FormControl error={!!error}>
            <RadioGroup value={value} onChange={onChange}>
              <Box
                display="flex"
                flexDirection="column"
                justifyContent="flex-start"
                alignItems="self-start"
              >
                <FormControlLabel
                  value="university_user"
                  control={<Radio />}
                  label="Operacional"
                />
                <FormHelperText>
                  Acesso às tarefas básicas do sistema como: gerenciar unidades
                  consumidoras e distribuidoras, lançar faturas e tarifas, além
                  de gerar recomendações.
                </FormHelperText>
              </Box>
              <Box
                display="flex"
                flexDirection="column"
                justifyContent="flex-start"
                alignItems="self-start"
              >
                <FormControlLabel
                  value="university_admin"
                  control={<Radio />}
                  label="Gestão"
                />
                <FormHelperText>
                  Permite gerenciar o perfil das outras pessoas que usam o
                  sistema, além das tarefas operacionais.
                </FormHelperText>
              </Box>
            </RadioGroup>
            <FormInfoAlert infoText="A pessoa receberá um e-mail com instruções para gerar uma senha e realizar o primeiro acesso ao sistema." />
            <FormHelperText>{error?.message ?? " "}</FormHelperText>
          </FormControl>
        )}
      />
    </Grid>
  </>
);
