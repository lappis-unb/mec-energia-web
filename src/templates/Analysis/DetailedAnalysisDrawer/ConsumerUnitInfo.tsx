import { Box, Typography } from "@mui/material";

interface Props {
  consumerUnitName: string;
  consumerUnitCode: string;
  university: string;
  universityAcronym?: string;
  generatedOn: string;
}

export const ConsumerUnitInfo = ({
  consumerUnitCode,
  consumerUnitName,
  universityAcronym,
  university,
  generatedOn,
}: Props) => {
  return (
    <Box
      sx={{
        bgcolor: "rgba(10, 92, 103, 0.08)",
        border: "1px solid rgba(10, 92, 103, 0.16)",
        borderRadius: 2,
        p: 4,
      }}
    >
      <Typography variant="h4">{consumerUnitName}</Typography>
      <Typography variant="h6">
        Unidade consumidora: {consumerUnitCode}
      </Typography>

      <br />

      <Box display="flex" justifyContent="space-between">
        <Typography variant="subtitle1">
          {universityAcronym && `${universityAcronym} - `} {university}
        </Typography>
        <Typography variant="subtitle1" sx={{ opacity: 0.6 }}>
          Gerada em: {generatedOn}
        </Typography>
      </Box>
    </Box>
  );
};
