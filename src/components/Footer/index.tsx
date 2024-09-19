import Image from "next/image";
import { Box, Typography } from "@mui/material";

const Footer = () => {
  return (
    <Box
      sx={{ backgroundColor: "primary.main" }}
      height="72px"
      minHeight="72px"
      display="flex"
      flexDirection="row"
      justifyContent="space-between"
      alignItems="center"
      padding="16px 32px"
      gap="16px"
    >
      <Box display="flex" alignItems="center">
        <Image
          src="/icons/logo-mepa.svg"
          alt="MEPA"
          width="124px"
          height="40px"
        />
      </Box>

      <Box display="flex" alignItems="center" gap="4px" textAlign="center">
        <Typography display="flex" gap="16px" alignItems="center" fontFamily="Lexend" color="white" fontSize="14px" letterSpacing="0.15px">
          Monitoramento de Energia em Plataforma Aberta 2024
          {/* <Image
              src="/icons/star-of-life.svg"
              alt="Star of life"
              width="16px"
              height="16px"
            />
            Consumo de energia com sabedoria */}
        </Typography>
      </Box>

      <Box display="flex" alignItems="center" gap="16px">
        <Box display="flex" alignItems="center">
          <Image
            src="/icons/logo-unb.svg"
            alt="UnB"
            width="115px"
            height="22px"
          />
        </Box>

        <Box display="flex" alignItems="center">
          <Image
            src="/icons/governo-federal.svg"
            alt="Governo Federal"
            width="89.5px"
            height="40px"
          />
        </Box>
      </Box>
    </Box>
  );
};
export default Footer;
