import { MouseEventHandler, useCallback, useMemo } from "react";
import { Distributor } from "@/types/distributor";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { Badge } from "@mui/material";
import { CardProps } from "@/types/app";
import AttachMoneyRoundedIcon from "@mui/icons-material/AttachMoneyRounded";
import Card from "@/components/Card";
import { selectActiveDistributorId } from "@/store/appSlice";

interface DistributorCardProps extends CardProps {
  id: number;
  name: string;
  isActive: boolean;
  consumerUnitsCount: number;
  pendingTariffsCount: number;
}

interface DistributorCardActionIcon {
  isActive: Distributor["isActive"];
  pendingTariffsCount: Distributor["pendingTariffsCount"];
}

const DistributorCardActionIcon = ({
  isActive,
  pendingTariffsCount,
}: DistributorCardActionIcon) => {
  if (!isActive) {
    return null;
  }

  if (pendingTariffsCount > 0) {
    return (
      <Badge badgeContent={"!"} color="primary">
        <AttachMoneyRoundedIcon sx={{ color: "black" }} />
      </Badge>
    );
  }

  return <AttachMoneyRoundedIcon />;
};
const DistributorCard = ({
  id,
  isActive,
  name,
  pendingTariffsCount,
  dense,
  selected,
}: DistributorCardProps) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const getDistributorCardVariant = ({
    isActive,
    pendingTariffsCount,
  }: {
    isActive: boolean;
    pendingTariffsCount: number;
  }) => {
    if (!isActive) {
      return "disabled";
    }

    if (pendingTariffsCount > 0) {
      return "warning";
    }

    return "default";
  };

  const activeDistributorId = useSelector(selectActiveDistributorId);

  const handleActionIconClick = useCallback<
    MouseEventHandler<HTMLButtonElement>
  >(
    async (event) => {
      event.stopPropagation();

      router.push(`/distribuidoras/${id ?? activeDistributorId}`);
    },
    [dispatch, id, pendingTariffsCount, router, activeDistributorId]
  );

  const variant = useMemo(
    () =>
      getDistributorCardVariant({
        isActive,
        pendingTariffsCount,
      }),
    [isActive, pendingTariffsCount]
  );

  const handleDistributorClick = useCallback(() => {
    router.push(`/distribuidoras/${id}`);
  }, [router, id]);

  return (
    <Card
      name={name}
      variant={variant}
      dense={dense}
      selected={selected}
      onClick={handleDistributorClick}
      action={"Tarifas pendentes"}
      actionIcon={
        <DistributorCardActionIcon
          isActive={isActive}
          pendingTariffsCount={pendingTariffsCount}
        />
      }
      onActionIconClick={handleActionIconClick}
      isDashboard = {true}
    />
  );
};

export default DistributorCard;
