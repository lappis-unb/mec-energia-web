import { Box } from "@mui/material";
import ReportRoundedIcon from "@mui/icons-material/ReportRounded";

const FormFieldError = (
  errorMessage: string | undefined = undefined,
  helperMessage: string | undefined = " "
) => {
  return (
    errorMessage ? (
      <Box display="flex" alignItems="start">
        <ReportRoundedIcon color="error" fontSize="small" />
        <Box ml={0.3}>{errorMessage}</Box>
      </Box>
    ) : (
      helperMessage
    )
  );
};

export default FormFieldError;
