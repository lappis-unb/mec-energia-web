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
        padding="0px"
      >
        <Box paddingLeft="4px" paddingTop="12px" display="flex" minHeight="36px" maxHeight="5px" maxWidth="2" dir="col">
          {shouldShowFavoriteIconButton && (
            <IconButton
              sx={{
                color: isWarning ? "black" : "primary.main",

              }}
              onClick={onFavoriteButtonClick}
            >
              {isFavorite ? <StarRoundedIcon /> : <StarOutlineRoundedIcon />}
            </IconButton>
          )}
        </Box>

        <Box display="flex" flexDirection="column" justifyContent="space-between">
          <Box
            sx={{ overflow: "hidden" }}
            // textOverflow="ellipsis"
            paddingLeft="16px" paddingRight="16px" paddingBottom="8px"
          >
            <Typography
              sx={{ ...(!dense && { overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: "2", WebkitBoxOrient: "vertical" }) }}
              zIndex={1}
              title={name}
              position="relative"
              fontWeight={400}
              display="flex"
              flexDirection="column-reverse"
              fontSize="20px"
              lineHeight="24px"
              minWidth={150}
              minHeight={48}>
              {name}
            </Typography>
            {BackgroundIcon ? <BackgroundIcon style={{ position: "absolute", right: 8, opacity: 0.24, height: 72, width: 72 }} sx={{
              mt: -11,
              color: (isWarning ? "white" : "secondary")
            }} /> : null}
          </Box>

          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            {...(!dense && { minHeight: "48px", paddingLeft: "8px", paddingRight: "4px" })}
          >
            {isDisabled ? (
              <Typography paddingLeft="8px" color="text.secondary">Desativada</Typography>
            ) : (
              action
            )}

            {shouldShowActionIconButton && (
              <Box>
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
