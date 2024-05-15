import { SyntheticEvent, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { skipToken } from "@reduxjs/toolkit/dist/query";

import {
  Box,
  Button,
  Container,
  Divider,
  IconButton,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import StarOutlineRoundedIcon from "@mui/icons-material/StarOutlineRounded";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import EditIcon from "@mui/icons-material/Edit";
import ReceiptLongRoundedIcon from "@mui/icons-material/ReceiptLongRounded";
import InsightsRoundedIcon from "@mui/icons-material/InsightsRounded";
import StickyNote2RoundedIcon from "@mui/icons-material/StickyNote2Rounded";
import { useEditPersonFavoritesMutation } from "@/api"

import {
  selectActiveConsumerUnitId,
  selectConsumerUnitOpenedTab,
  setConsumerUnitOpenedTab,
  setIsConsumerUnitEditFormOpen,
} from "@/store/appSlice";
import { useGetConsumerUnitQuery } from "@/api";
import { useSession } from "next-auth/react";

const ConsumerUnitContentHeader = () => {
  const dispatch = useDispatch();
  const consumerUnitId = useSelector(selectActiveConsumerUnitId);
  const { data: consumerUnit } = useGetConsumerUnitQuery(
    consumerUnitId ?? skipToken
  );
  const [editPersonFavorites] = useEditPersonFavoritesMutation();

  const { data: session } = useSession();
  const openedTab = useSelector(selectConsumerUnitOpenedTab);

  const handleEditConsumerUnitClick = () => {
    dispatch(setIsConsumerUnitEditFormOpen(true));
  };
  
  const handleTabChange = (_event: SyntheticEvent, tabIndex: number) => {
    dispatch(setConsumerUnitOpenedTab(tabIndex));
  };

  const handleFavoriteButtonClick = useCallback<
    MouseEventHandler<HTMLButtonElement>
  >(async (event) => {
    event.stopPropagation();
    const body: EditFavoritesRequestPayload = {
      consumerUnitId: consumerUnit?.id,
      personId: session?.user?.id,
      action: consumerUnit?.isFavorite ? "remove" : "add"
    };
    await editPersonFavorites(body);
  });

  return (
    <Box
      position="sticky"
      top={0}
      zIndex={1}
      sx={{ backgroundColor: "background.default" }}
    >
      <Container>
        <Box display="flex">
          <Box mt={-0.5}>
            <IconButton color="primary" edge="start" onClick={handleFavoriteButtonClick}>
              {consumerUnit?.isFavorite ? (
                <StarRoundedIcon fontSize="large" />
              ) : (
                <StarOutlineRoundedIcon fontSize="large" />
              )}
            </IconButton>
          </Box>

          <Box pl={1}>
            <Box display="flex" alignItems="center">
              <Typography variant="h4">{consumerUnit?.name}</Typography>

              <Box pl={2}>
                <Button
                  variant="outlined"
                  startIcon={<EditIcon />}
                  size="small"
                  onClick={handleEditConsumerUnitClick}
                >
                  Editar
                </Button>
              </Box>
            </Box>

            <Typography>
              Unidade consumidora: <strong>{consumerUnit?.code}</strong>
            </Typography>
          </Box>
        </Box>

        <Tabs value={openedTab} variant="fullWidth" onChange={handleTabChange}>
          <Tab
            icon={<ReceiptLongRoundedIcon />}
            label="Faturas"
            iconPosition="start"
          />
          <Tab
            icon={<InsightsRoundedIcon />}
            label="Análise"
            iconPosition="start"
          />
          <Tab
            icon={<StickyNote2RoundedIcon />}
            label="Contrato"
            iconPosition="start"
          />
        </Tabs>

        <Divider />
      </Container>
    </Box>
  );
};

export default ConsumerUnitContentHeader;
