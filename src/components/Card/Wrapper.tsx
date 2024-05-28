import { Paper } from "@mui/material";
import { CardWrapperProps } from "@/types/app";

const CardWrapper = ({
  selected,
  dense,
  variant = "default",
  children,
  onClick,
}: CardWrapperProps) => (
  <Paper
    sx={{
      padding: 2,
      position: "relative",
      boxShadow: "24dp",

      ...(dense
        ? {
          minWidth: "208px",
        }
        : {
          width: "240px",
          height: "152px",
        }),

      ...(variant === "warning" && {
        backgroundColor: "warning.main",
      }),

      ...(variant === "disabled" && {
        backgroundColor: "background.default",
      }),

      ...(onClick && {
        cursor: "pointer",
      }),
    }}
    {...(variant === "disabled" && {
      variant: "outlined",
    })}
    {...(selected && {
      variant: "elevation",
      elevation: 8,
    })}
    onClick={onClick}
  >
    {children}
  </Paper>
);

export default CardWrapper;
