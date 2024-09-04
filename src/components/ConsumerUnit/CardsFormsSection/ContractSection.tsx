import React from "react";
import {
  Grid,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Button,
  Tooltip,
  InputAdornment,
  Alert,
} from "@mui/material";
import { Controller } from "react-hook-form";
import { NumericFormat } from "react-number-format";
import { DatePicker } from "@mui/x-date-pickers";
import { isValidDate } from "../Validation/isValidDate";
import { hasEnoughCaracteresLength } from "../Validation/hasEnoughCaracteresLength";
import FormFieldError from "@/components/FormFieldError";
import { getSubgroupsText } from "@/utils/get-subgroup-text";
import { isInSomeSubgroups } from "@/utils/validations/form-validations";
import { useGetDistributorsQuery, useGetSubgroupsQuery } from "@/api";
import { skipToken } from "@reduxjs/toolkit/query";
import { DistributorPropsTariffs } from "@/types/distributor";

export default function ContractSection({
  control,
  setShouldShowDistributorFormDialog,
  setShouldShowGreenDemand,
  session,
  isEditContract,
}) {
  const { data: subgroupsList } = useGetSubgroupsQuery();
  const { data: distributorList } = useGetDistributorsQuery(
    session?.user?.universityId || skipToken
  );

  const sortedDistributorList = distributorList
    ?.slice()
    .sort((a, b) => a.name.localeCompare(b.name));

  const handleNumericInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    onChange: (value: string) => void
  ) => {
    const numericValue = e.target.value.replace(/\D/g, "");
    onChange(numericValue);
  };

  return (
    <>
      <Grid item xs={12}>
        <Typography variant="h5">Contrato</Typography>
      </Grid>
      {isEditContract && (
        <Grid item xs={12} marginTop={"10px"} marginBottom={"15px"}>
          <Alert severity="warning" variant="standard">
            Modifique o contrato apenas em caso de erro de digitação. Para
            alterações legais ou novo contrato, use a opção{" "}
            <strong>Renovar</strong> na tela anterior.
          </Alert>
        </Grid>
      )}

      <Grid item xs={12}>
        <Controller
          control={control}
          name="code"
          rules={{
            required: "Preencha este campo",
            validate: hasEnoughCaracteresLength,
          }}
          render={({
            field: { onChange, onBlur, value, ref },
            fieldState: { error },
          }) => (
            <TextField
              ref={ref}
              value={value}
              label="Número da Unidade *"
              placeholder="Número da Unidade Consumidora conforme a fatura"
              error={Boolean(error)}
              helperText={FormFieldError(
                error?.message,
                "Nº ou código da Unidade Consumidora conforme a fatura"
              )}
              fullWidth
              onChange={(e) => handleNumericInputChange(e, onChange)}
              onBlur={onBlur}
            />
          )}
        />
      </Grid>

      <Grid item xs={12} mt={2.5}>
        <Controller
          control={control}
          name="distributor"
          rules={{ required: "Preencha este campo" }}
          render={({
            field: { onChange, onBlur, value, ref },
            fieldState: { error },
          }) => (
            <FormControl
              sx={{ minWidth: "200px", maxWidth: "100%" }}
              error={!!error}
            >
              <InputLabel>Distribuidora *</InputLabel>
              <Select
                ref={ref}
                value={value}
                label="Distribuidora *"
                autoWidth
                MenuProps={{
                  anchorOrigin: {
                    vertical: "bottom",
                    horizontal: "left",
                  },
                  transformOrigin: {
                    vertical: "top",
                    horizontal: "left",
                  },
                }}
                onChange={onChange}
                onBlur={onBlur}
              >
                {sortedDistributorList?.map(
                  (distributor: DistributorPropsTariffs) => (
                    <MenuItem key={distributor.id} value={distributor.id}>
                      {distributor.name}
                    </MenuItem>
                  )
                )}
                <MenuItem>
                  <Button
                    onClick={() => setShouldShowDistributorFormDialog(true)}
                  >
                    Adicionar
                  </Button>
                </MenuItem>
              </Select>
              <FormHelperText>{FormFieldError(error?.message)}</FormHelperText>
            </FormControl>
          )}
        />
      </Grid>

      <Grid item xs={12}>
        <Controller
          control={control}
          name="startDate"
          rules={{
            required: "Insira uma data válida no formato dd/mm/aaaa",
            validate: isValidDate,
          }}
          render={({ field: { value, onChange }, fieldState: { error } }) => (
            <DatePicker
              value={value}
              label="Início da vigência *"
              views={["month", "year"]}
              minDate={new Date("2010")}
              disableFuture
              renderInput={(params) => (
                <TextField
                  {...params}
                  inputProps={{
                    ...params.inputProps,
                    placeholder: "dd/mm/aaaa",
                  }}
                  helperText={FormFieldError(error?.message)}
                  error={!!error}
                />
              )}
              onChange={onChange}
            />
          )}
        />
      </Grid>

      <Tooltip
        componentsProps={{
          tooltip: {
            sx: {
              bgcolor: "warning.main",
              color: "warning.contrastText",
              "& .MuiTooltip-arrow": {
                color: "warning.main",
              },
            },
          },
        }}
        title={
          <div style={{ whiteSpace: "pre-line" }}>
            {subgroupsList ? getSubgroupsText(subgroupsList?.subgroups) : ""}
          </div>
        }
        arrow
        placement="right"
        sx={{ color: "red" }}
      >
        <Grid item xs={8} sm={6}>
          <Controller
            control={control}
            name={"supplyVoltage"}
            rules={{
              required: "Preencha este campo",
              validate: (v) =>
                isInSomeSubgroups(v, subgroupsList?.subgroups || []),
            }}
            render={({
              field: { onChange, onBlur, value },
              fieldState: { error },
            }) => (
              <NumericFormat
                value={value}
                customInput={TextField}
                label="Tensão contratada *"
                helperText={FormFieldError(
                  error?.message,
                  "Se preciso, converta a tensão de V para kV dividindo o valor por 1.000."
                )}
                error={!!error}
                fullWidth
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">kV</InputAdornment>
                  ),
                }}
                type="text"
                allowNegative={false}
                isAllowed={({ floatValue }) =>
                  !floatValue || floatValue <= 9999.99
                }
                decimalScale={2}
                decimalSeparator=","
                thousandSeparator={"."}
                onValueChange={(values) => {
                  const newVoltage = values ? values.floatValue : 0;
                  if (newVoltage === 69) {
                    setShouldShowGreenDemand(false);
                  } else if (
                    newVoltage !== undefined &&
                    newVoltage >= 88 &&
                    newVoltage <= 138
                  ) {
                    setShouldShowGreenDemand(false);
                  } else {
                    setShouldShowGreenDemand(true);
                  }
                  onChange(values.floatValue);
                }}
                onBlur={onBlur}
              />
            )}
          />
        </Grid>
      </Tooltip>
    </>
  );
}
