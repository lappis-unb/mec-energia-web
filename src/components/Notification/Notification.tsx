import { NotificationProps, RootState } from "@/types/app";
import { Alert, Snackbar } from "@mui/material";
import { PayloadAction } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";

type Props = {
  selectNotification: (state: RootState) => NotificationProps;
  setIsNotificationOpen: (payload: { isOpen: boolean }) => PayloadAction<{ isOpen: boolean }>;
  severity: "success" | "error";
};

const Notification = ({ selectNotification, setIsNotificationOpen, severity }: Props) => {
  const dispatch = useDispatch();
  const notification = useSelector(selectNotification);
  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    dispatch(
      setIsNotificationOpen({
        isOpen: false,
      })
    );
  };

  return (
    <Snackbar
      open={notification.isOpen}
      autoHideDuration={6000}
      onClose={handleClose}
      anchorOrigin={{ horizontal: "center", vertical: "top" }}
    >
      <Alert onClose={handleClose} severity={severity} sx={{ width: "100%" }}>
        {notification.text}
      </Alert>
    </Snackbar>
  );
};
export default Notification;
