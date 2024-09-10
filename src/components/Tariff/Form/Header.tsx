import { Alert, Box, Link, Typography } from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

interface Props {
  activeSubgroup: string | null;
  distributor: any;
  handleDownloadClick: Function;
}
export default function Header({
  activeSubgroup,
  distributor,
  handleDownloadClick,
}: Props) {
  return (
    <>
      <Typography variant="h4">Subgrupo {activeSubgroup}</Typography>
      <Typography>Distribuidora: {distributor.data?.name}</Typography>
      <Box mt={3} mb={3}>
        <Alert icon={<ErrorOutlineIcon />} severity="info" variant="filled">
          Siga este{" "}
          <Link
            component="button"
            onClick={handleDownloadClick}
            style={{
              cursor: "pointer",
              color: "white",
              textDecoration: "underline",
            }}
          >
            passo-a-passo
          </Link>{" "}
          a seguir para encontrar as informações de tarifa no site da ANEEL.
        </Alert>
      </Box>
    </>
  );
}
