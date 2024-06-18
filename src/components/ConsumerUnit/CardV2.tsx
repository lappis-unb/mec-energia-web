import { MouseEventHandler, useCallback, useMemo } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { format } from "date-fns";
import ptBR from "date-fns/locale/pt-BR";
import { Badge, Button, Typography } from "@mui/material";
import InsightsRoundedIcon from "@mui/icons-material/InsightsRounded";
import ReceiptLongRoundedIcon from "@mui/icons-material/ReceiptLongRounded";
import {
  selectActiveConsumerUnitId,
  setActiveConsumerUnitId,
  setConsumerUnitInvoiceActiveFilter,
  setConsumerUnitOpenedTab,
  setEnergyBillEdiFormParams,
  setIsEnergyBillCreateFormOpen,
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
  consumerUnitId: number;
}

interface ConsumerUnitCardActionIcon {
  consumerUnitId: number;
  isActive: ConsumerUnit["isActive"];
  pendingEnergyBillsNumber: ConsumerUnit["pendingEnergyBillsNumber"];
}

const ConsumerUnitCardAction = ({
  dense,
  pendingEnergyBillsNumber,
  isCurrentEnergyBillFilled,
  variant,
  consumerUnitId,
}: ConsumerUnitCardActionProps) => {
  const dispatch = useDispatch();

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
      return "Faturas pendentes";
    }
  }, [pendingEnergyBillsNumber, isCurrentEnergyBillFilled]);

  const handleOpenAddEnergyBillForm = useCallback(
    (month: number, year: number, consumerUnitId: number) => {
      dispatch(setActiveConsumerUnitId(consumerUnitId));
      dispatch(setIsEnergyBillCreateFormOpen(true));
      dispatch(setEnergyBillEdiFormParams({ month, year }));
    },
    [dispatch]
  );

  if (isCurrentEnergyBillFilled || dense) {
    return (
      <Typography color={isWarning ? "text.primary" : "text.secondary"}>
        {pendenciesMessage}
      </Typography>
    );
  }

  const currentDate = new Date();
  const month = currentDate.getMonth();
  const year = currentDate.getFullYear();

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
      onClick={() => handleOpenAddEnergyBillForm(month, year, consumerUnitId)}
    >
      Lançar {format(new Date(), "MMMM", { locale: ptBR })}
    </Button>
  );
};

const ConsumerUnitCardActionIcon = ({
  consumerUnitId,
  isActive,
  pendingEnergyBillsNumber,
}: ConsumerUnitCardActionIcon) => {
  const router = useRouter();
  const dispatch = useDispatch();

  if (!isActive) {
    return null;
  }

  const handleConsumerUnitClick = async (filtro: string = new Date().getUTCFullYear().toString()) => {
    router.push(`/uc/${consumerUnitId}`).then(() => {
      dispatch(setActiveConsumerUnitId(consumerUnitId));
      dispatch(setConsumerUnitInvoiceActiveFilter(filtro));
    });
  };

  if (pendingEnergyBillsNumber > 0) {
    return (
      <Badge
        onClick={() => handleConsumerUnitClick('pending')}
        badgeContent={pendingEnergyBillsNumber}
        color="primary"
      >
        <ReceiptLongRoundedIcon sx={{ color: "black" }} />
      </Badge>
    );
  }

  return (
    <InsightsRoundedIcon
      onClick={() => handleConsumerUnitClick(new Date().getUTCFullYear().toString())}
    />
  );
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
  const activeConsumerUnit = useSelector(selectActiveConsumerUnitId);
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

  const handleConsumerUnitClick = useCallback<
    MouseEventHandler<HTMLButtonElement>
  >(
    async (event) => {
      const consumerUnitCardActionHtmlButton = (event.target as HTMLButtonElement);
      const applyMultipleRedirectOnlyInPanelPage = router.pathname === '/';
      
      // Verifica se o alvo da ação de clique é diferente do botão de Lançar
      if ((applyMultipleRedirectOnlyInPanelPage || id !== activeConsumerUnit) && consumerUnitCardActionHtmlButton.type !== 'button') {
        router.push(`/uc/${id}`);
      }
    },
    [dispatch, router]
  );

  const handleActionIconClick = useCallback<
    MouseEventHandler<HTMLButtonElement>
  >(
    async (event) => {
      event.stopPropagation();

      if (pendingEnergyBillsNumber > 0) {
        router.push(`/uc/${id}`).then(() => {
          dispatch(setConsumerUnitInvoiceActiveFilter("pending"));
          dispatch(setConsumerUnitOpenedTab(ConsumerUnitTab.INVOICE));
        });
      } else {
        router.push(`/uc/${id}`).then(() =>
          dispatch(setConsumerUnitOpenedTab(ConsumerUnitTab.ANALYSIS)));
      }
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
          consumerUnitId={id}
        />
      }
      actionIcon={
        <ConsumerUnitCardActionIcon
          consumerUnitId={id}
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
