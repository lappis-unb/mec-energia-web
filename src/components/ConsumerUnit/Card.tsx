import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  Badge,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Divider,
  IconButton,
  Typography,
} from "@mui/material";
import {
  Receipt as ReceiptIcon,
  Star as StarIcon,
  StarOutline as StarOutlineIcon,
  TrendingUp as TrendingUpIcon,
} from "@mui/icons-material";

interface Pendency {
  month: number;
  year: number;
}

interface ConsumerUnitCardProps {
  id: number;
  title: string;
  disabled?: boolean;
  favorite?: boolean;
  pendencies?: Pendency[];
  currentRoute?: string;
}

const ConsumerUnitCard = ({
  id,
  title,
  disabled = false,
  favorite = false,
  pendencies = [],
}: ConsumerUnitCardProps) => {
  const router = useRouter();
  const [longMonth, setLongMonth] = useState("");
  const [badgeCount, setBadgeCount] = useState(0);
  const [bottomCardText, setBottomCardText] = useState("");
  const consumerUnitUrl = `/uc/${id}`;

  useEffect(() => {
    if (pendencies.length == 0) {
      setBadgeCount(0);
      return;
    }

    const { year, month } = pendencies[pendencies.length - 1];
    const date = new Date(year, month - 1);
    const longMonth = date.toLocaleString("pt-br", { month: "long" });

    setLongMonth(longMonth);
    setBadgeCount(pendencies.length - 1);
  }, [pendencies]);

  useEffect(() => {
    if (favorite) {
      router.prefetch(consumerUnitUrl);
    }
  }, [consumerUnitUrl, favorite, router]);

  useEffect(() => {
    handleTextBottomCard();
  });

  const handleCardClick = () => {
    router.push(consumerUnitUrl);
  };

  const handleTextBottomCard = () => {
    let text = "";
    if (disabled) text = "Desativado";
    else if (pendencies.length === 0) text = "Em dia";
    else if (pendencies.length === 1) {
      const today = new Date();
      if (
        pendencies[0].year === today.getFullYear() &&
        pendencies[0].month === today.getMonth() + 1
      ) {
        text = `${longMonth.charAt(0).toUpperCase() + longMonth.slice(1)
          } disponível`;
      } else text = "1 lançamento pendente";
    } else if (pendencies.length > 1)
      text = `${pendencies.length} lançamentos pendentes`;
    setBottomCardText(text);
  };

  return (
    <Card
      sx={{
        height: 196,
        display: "flex",
        flexDirection: "column",
        cursor: "pointer",
      }}
      variant={disabled ? "outlined" : "elevation"}
      onClick={handleCardClick}
    >
      {!disabled && (
        <CardActions>
          <IconButton color="inherit">
            {favorite ? <StarIcon /> : <StarOutlineIcon />}
          </IconButton>
        </CardActions>
      )}

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

      <Divider />

      {router.pathname === "/uc/[id]" ? (
        <Box ml={1} p={1}>
          <Typography>{bottomCardText}</Typography>
        </Box>
      ) : (
        <CardActions
          sx={{ justifyContent: "space-between", minHeight: "56px" }}
        >
          {disabled ? (
            <Box ml={1}>
              <Typography>Desativado</Typography>
            </Box>
          ) : (
            <>
              {pendencies.length == 0 ? (
                <Box ml={1}>
                  <Typography>Em dia</Typography>
                </Box>
              ) : (
                <Button variant="outlined" size="small">
                  Lançar {longMonth}
                </Button>
              )}

              <Box>
                <IconButton color="inherit">
                  <Badge badgeContent={badgeCount} color="warning">
                    <ReceiptIcon />
                  </Badge>
                </IconButton>

                <IconButton color="inherit">
                  <TrendingUpIcon />
                </IconButton>
              </Box>
            </>
          )}
        </CardActions>
      )}
    </Card>
  );
};

export default ConsumerUnitCard;
