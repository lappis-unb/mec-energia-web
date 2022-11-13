import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import {
  Badge,
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Typography,
} from "@mui/material";
import { Receipt, Star, StarOutline, TrendingUp } from "@mui/icons-material";
import DistributorProps from "../../types/distributor";

const DistributorCard = ({
  id,
  title,
  disabled = false,
  linkedUC,
  tariffs,
  currentRoute
}: DistributorProps) => {
  const router = useRouter();
  const DistributorUrl = `/dt/${id}`;
  const [overdue, setOverdue] = useState(false);

  useEffect(() => {
    const isOverdue = tariffs?.find(tariff => tariff.overdue === true)
    if (isOverdue !== undefined) setOverdue(true)
    else setOverdue(false);
  }, [])

  const handleCardClick = () => {
    router.push(DistributorUrl);
  };
  const handleTextBottomCard = () => {
    if (disabled) return "Desativada"
    else if (tariffs?.find(tariff => tariff.end < new Date())) return "Tarifas pendentes"
    else if (linkedUC?.length === 0) return "Nenhuma unidade consumidora"
    else if (linkedUC?.length === 1) return "1 unidade consumidora"
    else if (linkedUC?.length) return `${linkedUC.length} unidades consumidoras`
  }

  return (
    <Card
      sx={{
        height: 120,
        display: "flex",
        flexDirection: "column",
        cursor: "pointer",
        background: overdue ? 'grey' : '',
        color: overdue ? 'white' : ''
      }}
      variant={disabled ? "outlined" : "elevation"}
      onClick={handleCardClick}
    >
      <CardContent
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "end",
          pt: 0,
        }}
      >
        <Typography variant="h5">{title}</Typography>
      </CardContent>

      <Divider sx={{ background: overdue ? 'white' : '' }} />
      <Box ml={1} p={1}>
        <Typography>{handleTextBottomCard()}</Typography>
      </Box>
    </Card >
  );
};

export default DistributorCard;
