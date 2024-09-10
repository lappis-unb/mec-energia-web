import { Box, Grid } from "@mui/material";
import { ReactNode } from "react";

const DetailedAnalysisHeader = ({ children }: { children?: ReactNode }) => {
  return (
    <Box
      sx={{
        position: "sticky",
        top: 0,
        height: "64px",
        color: "background.paper",
        bgcolor: "primary.main",
        boxShadow: 4,
        display: "flex",
        zIndex: 1100, // Valor para garantir que fique sobre outros elementos, ajuste conforme necessário
      }}
    >
      <Grid
        container
        alignItems="center"
        justifyContent="space-between"
        sx={{ width: "75%", margin: "auto" }}
      >
        {children}
      </Grid>
    </Box>
  );
};

export default DetailedAnalysisHeader;
