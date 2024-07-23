import { Box } from "@mui/material";
import Image from "next/image";

/**
 * FIXME: Não está no esquema de cores do Sketch. Logos deveriam ser pretas
 * com certe transparência com fundo (Box) totalmente transparente
 */
export const Logos = () => (
  <Box
    display="flex"
    justifyContent="space-between"
    sx={{ p: 2, bgcolor: "primary.main", borderRadius: 2 }}
  >
    <Box>
      <Image
        src="/icons/lappis.svg"
        alt="LAPPIS"
        height="40px"
        width={`${324 / 2.075}px`}
      />
    </Box>
    <Box>
      <Image
        src="/icons/unb-energia.svg"
        alt="LAPPIS"
        height="40px"
        width={`${324 / 2.075}px`}
      />
    </Box>
    <Box>
      <Image
        src="/icons/cgee.svg"
        alt="LAPPIS"
        height="40px"
        width={`${324 / 2.075}px`}
      />
    </Box>
    <Box>
      <Image
        src="/icons/mec.svg"
        alt="LAPPIS"
        height="40px"
        width={`${324 / 2.075}px`}
      />
    </Box>
  </Box>
);
