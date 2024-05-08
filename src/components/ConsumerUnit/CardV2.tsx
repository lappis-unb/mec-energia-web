import { MouseEventHandler, useCallback, useMemo } from "react";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { format } from "date-fns";
import ptBR from "date-fns/locale/pt-BR";
import { Badge, Button, Typography } from "@mui/material";
import InsightsRoundedIcon from "@mui/icons-material/InsightsRounded";
import ReceiptLongRoundedIcon from "@mui/icons-material/ReceiptLongRounded";
import {
  setConsumerUnitInvoiceActiveFilter,
  setConsumerUnitOpenedTab,
} from "@/store/appSlice";
import { CardProps, ConsumerUnitTab } from "@/types/app";
import { ConsumerUnit } from "@/types/consumerUnit";
import Card from "@/components/Card";
import { getMonthFromNumber } from "@/utils/date";
import { EditFavoritesRequestPayload } from "@/types/person";
import { useEditPersonFavoritesMutation } from "@/api"
import { useSession } from "next-auth/react";

interface ConsumerUnitCardProps extends CardProps {
  id: ConsumerUnit["id"];
  isActive: ConsumerUnit["isActive"];
  isFavorite: ConsumerUnit["isFavorite"];
  pendingEnergyBillsNumber: ConsumerUnit["pendingEnergyBillsNumber"];
  isCurrentEnergyBillFilled: ConsumerUnit["isCurrentEnergyBillFilled"];
}

interface ConsumerUnitCardActionProps {
  dense: CardProps["dense"];
  pendingEnergyBillsNumber: ConsumerUnit["pendingEnergyBillsNumber"];
  isCurrentEnergyBillFilled: ConsumerUnit["isCurrentEnergyBillFilled"];
  variant: CardProps["variant"];
}

interface ConsumerUnitCardActionIcon {
  isActive: ConsumerUnit["isActive"];
  pendingEnergyBillsNumber: ConsumerUnit["pendingEnergyBillsNumber"];
}

const ConsumerUnitCardAction = ({
  dense,
  pendingEnergyBillsNumber,
  isCurrentEnergyBillFilled,
  variant,
}: ConsumerUnitCardActionProps) => {
  const isWarning = variant === "warning";

  const pendenciesMessage = useMemo(() => {
    // Caso a conta de energia atual não esteja preenchida
    if (!isCurrentEnergyBillFilled) {
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      const currentMonth = currentDate.getMonth();
      return `Lançar ${getMonthFromNumber(currentMonth, currentYear)}`;
    }

    if (pendingEnergyBillsNumber === 0) {
      return "Em dia";
    }

    if (pendingEnergyBillsNumber === 1) {
      return "1 fatura pendente";
    }

    if (pendingEnergyBillsNumber > 1) {
      return `${pendingEnergyBillsNumber} faturas pendentes`;
    }
  }, [pendingEnergyBillsNumber, isCurrentEnergyBillFilled]);

  const handleActionButtonClick = useCallback<
    MouseEventHandler<HTMLButtonElement>
  >((event) => {
    event.stopPropagation();
  }, []);

  if (isCurrentEnergyBillFilled || dense) {
    return (
      <Typography color={isWarning ? "text.primary" : "text.secondary"}>
        {pendenciesMessage}
      </Typography>
    );
  }

  return (
    <Button
      sx={{
        ...(isWarning && {
          color: "black",
          borderColor: "black",
          ":hover": {
            borderColor: "black",
          },
        }),
      }}
      variant={isWarning ? "outlined" : "contained"}
      size="small"
      disableElevation
      onClick={handleActionButtonClick}
    >
      Lançar {format(new Date(), "MMMM", { locale: ptBR })}
    </Button>
  );
};

const ConsumerUnitCardActionIcon = ({
  isActive,
  pendingEnergyBillsNumber,
}: ConsumerUnitCardActionIcon) => {
  if (!isActive) {
    return null;
  }

  if (pendingEnergyBillsNumber > 0) {
    return (
      <Badge badgeContent={pendingEnergyBillsNumber} color="primary">
        <ReceiptLongRoundedIcon sx={{ color: "black" }} />
      </Badge>
    );
  }

  return <InsightsRoundedIcon />;
};

const ConsumerUnitCard = ({
  isActive,
  isFavorite,
  id,
  pendingEnergyBillsNumber,
  isCurrentEnergyBillFilled,
  name,
  dense,
  selected,
}: ConsumerUnitCardProps) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [editPersonFavorites] = useEditPersonFavoritesMutation();
  const { data: session } = useSession();
  const variant = useMemo(() => {
    if (!isActive) {
      return "disabled";
    }

    if (pendingEnergyBillsNumber > 0) {
      return "warning";
    }

    return "default";
  }, [isActive, pendingEnergyBillsNumber]);

  const handleConsumerUnitClick = () => {
    router.push(`/uc/${id}`);
  };

  const handleActionIconClick = useCallback<
    MouseEventHandler<HTMLButtonElement>
  >(
    async (event) => {
      event.stopPropagation();

      if (pendingEnergyBillsNumber > 0) {
        dispatch(setConsumerUnitOpenedTab(ConsumerUnitTab.INVOICE));
        dispatch(setConsumerUnitInvoiceActiveFilter("pending"));
      } else {
        dispatch(setConsumerUnitOpenedTab(ConsumerUnitTab.ANALYSIS));
      }

      router.push(`/uc/${id}`);
    },
    [dispatch, id, pendingEnergyBillsNumber, router]
  );


  const handleFavoriteButtonClick = useCallback<
    MouseEventHandler<HTMLButtonElement>
  >(async (event) => {
    event.stopPropagation();
    const body: EditFavoritesRequestPayload = {
      consumerUnitId: id,
      personId: session?.user?.id,
      action: isFavorite ? "remove" : "add"
    };
    await editPersonFavorites(body);
  }, [isFavorite]);

  return (
    <Card
      name={name}
      variant={variant}
      isFavorite={isFavorite}
      dense={dense}
      selected={selected}
      onClick={handleConsumerUnitClick}
      action={
        <ConsumerUnitCardAction
          dense={dense}
          pendingEnergyBillsNumber={pendingEnergyBillsNumber}
          isCurrentEnergyBillFilled={isCurrentEnergyBillFilled}
          variant={variant}
        />
      }
      actionIcon={
        <ConsumerUnitCardActionIcon
          isActive={isActive}
          pendingEnergyBillsNumber={pendingEnergyBillsNumber}
        />
      }
      onActionIconClick={handleActionIconClick}
      onFavoriteButtonClick={handleFavoriteButtonClick}
    />
  );
};

export default ConsumerUnitCard;
