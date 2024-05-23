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
  BackgroundIcon,
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
        <Box display="flex" minHeight="30px" maxHeight="5px" maxWidth="2" dir="col">
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


        <Box display="flex" flexDirection="column" justifyContent="space-between">
          <Box
            sx={{ WebkitLineClamp: "2", WebkitBoxOrient: "vertical" }}
            textOverflow="ellipsis"
            display="flex"
            mb={1.5}
          >
            <Typography zIndex={1} title={name} position="relative" fontWeight={400} fontSize="20px" lineHeight="24px" minWidth={150} minHeight={48} maxWidth={190}>
              {name.substring(0, 30)}{name.length > 30 ? '...' : ''}
            </Typography>
            {BackgroundIcon ? <BackgroundIcon style={{ position: "absolute", marginLeft: shouldShowFavoriteIconButton ? "72%" : "60%", opacity: 0.24, height: 72, width: 72 }} sx={{
              mt: -5,
              color: (isWarning ? "white" : "secondary")
            }} /> : null}
          </Box>

          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            {...(!dense && { minHeight: "30.75px" })}
          >
            {isDisabled ? (
              <Typography color="text.secondary">Desativada</Typography>
            ) : (
              action
            )}

            {shouldShowActionIconButton && (
              <Box m={-1}>
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
