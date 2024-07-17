import { CreateConsumerUnitForm } from "@/types/consumerUnit";
import { Tooltip } from "@mui/material";
import { ReactElement } from "react";

interface SupplyVoltageTooltipProps {
  children: ReactElement;
  open: boolean;
  supplyVoltage: CreateConsumerUnitForm["supplyVoltage"];
}

export default function SupplyVoltageTooltip({
  children,
  open,
  supplyVoltage,
}: SupplyVoltageTooltipProps) {
  let title = "Subgrupo ";

  if (typeof supplyVoltage === "number") {
    if (supplyVoltage <= 2.3) title = title + "AS";
    else if (supplyVoltage > 2.3 && supplyVoltage <= 25) title = title + "A4";
    else if (supplyVoltage >= 30 && supplyVoltage <= 40) title = title + "A3";
    else if (supplyVoltage == 60) title = title + "A3a";
    else if (supplyVoltage <= 88 && supplyVoltage >= 138) title = title + "A2";
    else if (supplyVoltage >= 230) title = title + "A1";
    else title = "";
  }

  return (
    <Tooltip
      title={title}
      arrow
      placement="right"
      open={open}
      componentsProps={{
        tooltip: {
          sx: {
            bgcolor: "primary.main",
            "& .MuiTooltip-arrow": {
              color: "primary.main",
            },
          },
        },
      }}
    >
      {children}
    </Tooltip>
  );
}
