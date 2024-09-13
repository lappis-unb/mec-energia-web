import { Typography } from "@mui/material";
import { Box } from "@mui/material";

interface SubtitleProps {
  id: string;
  title?: string;
  children?: React.ReactNode;
  minWidth?: number | string;
};

/**
 * @param id Identificação do elemento
 * @param title Título do elemento
 * @param children Caso o título seja mais elaborado (negrito, sublinhado, etc), opte por passar o elemento HTML.
 * @returns Legenda do elemento
 */
export const Subtitle = ({ id, title, children, minWidth = "200px" }: SubtitleProps) => {
  return (
    <Box
      mt={4}
      minWidth={minWidth}
      mx="auto"
      display="flex"
      alignItems="center"
      justifyContent="center"
      mb="8px"
      textAlign="center"
      sx={{
        "@media print": {
          width: "520px",
          marginX: "auto",
        }
      }}
    >
      <Typography variant="caption" color="primary" letterSpacing={0.6}>
        <strong>{id}</strong>: {(title) ? title : children}
      </Typography>
    </Box>
  );
};