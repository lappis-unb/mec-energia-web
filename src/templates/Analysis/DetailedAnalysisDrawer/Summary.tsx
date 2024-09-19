import { Box, Link, Typography } from "@mui/material";

/**
 * FIXME: Não está no esquema de cores do Sketch. Logos deveriam ser pretas
 * com certe transparência com fundo (Box) totalmente transparente
 */
export const Summary = () => (
  <Box
    display="flex"
    flexDirection="column"
    justifyContent="flex-start"
    alignItems="flex-start"
    gap="8px"
    sx={{ p: 2, marginBottom: "17px" }}
  >
    <Typography variant="h5">Sumário</Typography>

    <ul style={{
      margin: 0,
      padding: 0,
      marginLeft: "24px",
      display: "flex",
      flexDirection: "column",
      gap: "8px"
    }}>
      <li>
        <Link href="#goal" color="primary">
          Objetivo
        </Link>
      </li>
      <li>
        <Link href="#assumptionsOfContractAnalytics" color="primary">
          Premissas para análise do contrato
        </Link>
      </li>
      <li>
        <Link href="#characteristicsOfConsumerUnity" color="primary">
          Características de fornecimento da Unidade Consumidora
        </Link>
      </li>
      <li>
        <Link href="#actualContract" color="primary">
          Contrato atual
        </Link>
      </li>
      <li>
        <Link href="#proposedContract" color="primary">
          Contrato proposto
        </Link>
      </li>
      <li>
        <Link href="#conclusions" color="primary">
          Conclusões
        </Link>
      </li>
      <li>
        <Link href="#glossary" color="primary">
          Glossário
        </Link>
      </li>
    </ul>
  </Box>
);
