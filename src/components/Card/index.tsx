import { Box, IconButton, Typography } from "@mui/material";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import StarOutlineRoundedIcon from "@mui/icons-material/StarOutlineRounded";

import { CardProps } from "@/types/app";
import CardWrapper from "@/components/Card/Wrapper";

const Card = ({
  name,
  selected,
  dense,
  variant,
  isFavorite,
  action,
  actionIcon,
  onClick,
  onActionIconClick,
  onFavoriteButtonClick,
}: CardProps) => {
  const isActive = variant !== "disabled";
  const isDisabled = variant === "disabled";
  const isWarning = variant === "warning";
  const canFavorite = isFavorite !== undefined;
  const shouldShowFavoriteIconButton = canFavorite && isActive;

  const shouldShowActionIconButton = actionIcon && !dense && isActive;

  return (
    <CardWrapper
      selected={selected}
      dense={dense}
      variant={variant}
      onClick={onClick}
    >
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
        height="100%"
      >
        <Box display="flex" minHeight="30px">
          {shouldShowFavoriteIconButton && (
            <IconButton
              edge="start"
              sx={{
                color: isWarning ? "black" : "primary.main",
                mt: -1.5,
              }}
              onClick={onFavoriteButtonClick}
            >
              {isFavorite ? <StarRoundedIcon /> : <StarOutlineRoundedIcon />}
            </IconButton>
          )}
        </Box>


        <Box display="flex" flexDirection="column" justifyContent="end">
          <Box
            textOverflow="ellipsis"
            display="flex"
            mb={1.5}
          >
            <Typography sx={{ ...(!dense && { overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: "2", WebkitBoxOrient: "vertical" }) }}
              title={name}
              position="relative"
              fontWeight={400}
              fontSize="20px"
              lineHeight="24px"
              minWidth={150}
              minHeight={48}
            >
              {name}
            </Typography>
          </Box>

          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="end"
            {...(!dense && { minHeight: "30.75px" })}
          >
            {isDisabled ? (
              <Typography color="text.secondary">Desativada</Typography>
            ) : (
              action
            )}

            {shouldShowActionIconButton && (
              <Box alignSelf="center" m={-1}>
                <IconButton onClick={onActionIconClick}>
                  {actionIcon}
                </IconButton>
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </CardWrapper >
  );
};

export default Card;
