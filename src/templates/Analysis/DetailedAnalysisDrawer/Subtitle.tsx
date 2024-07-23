import { Typography } from "@mui/material";
import { Box } from "@mui/material";

interface SubtitleProps {
  id: string;
  title?: string;
  children?: React.ReactNode;
  width?: number | string;
};

/**
 * @param id Identificação do elemento
 * @param title Título do elemento
 * @param children Caso o título seja mais elaborado (negrito, sublinhado, etc), opte por passar o elemento HTML.
 * @returns Legenda do elemento
 */
export const Subtitle = ({ id, title, children, width = "600px" }: SubtitleProps) => {
  return (
    <Box width={width} mx="auto" display="flex" alignItems="center" justifyContent="center" mb="8px" textAlign="center">
      <Typography variant="caption" color="primary" letterSpacing={0.6}>
        <strong>{id}</strong>: {(title) ? title : children}
      </Typography>
    </Box>
  );
};