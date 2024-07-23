import { Box } from "@mui/material";
import Image from "next/image";

/**
 * FIXME: Não está no esquema de cores do Sketch. Logos deveriam ser pretas
 * com certe transparência com fundo (Box) totalmente transparente
 */
export const Logos = () => (
  <Box
    display="flex"
    justifyContent="center"
    alignItems="center"
    gap="27px"
    sx={{ p: 2, marginBottom: "17px" }}
  >
    <Box>
      <Image
        src="/icons/marca_UnB_colorida.svg"
        alt="Logo UnB Básica Horizontal"
        height="38px"
        width="151px"
      />
    </Box>
    <Box>
      <Image
        src="/icons/marca_governo_colorida.svg"
        alt="Logo Governo Federal - União e Reconstrução"
        height="72px"
        width="161,95px"
      />
    </Box>
  </Box>
);
