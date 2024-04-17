import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

interface DeleteDistributorDialogProps {
  open: boolean;
  onClose: () => void;
  onDiscard: () => void;
  titleText: string;
  cancelText: string;
  confirmText: string;
  dataLossMessage: string;
}

const DeleteDistributorDialog = ({
  open,
  onClose,
  onDiscard,
  titleText,
  cancelText,
  confirmText,
  dataLossMessage,
}: DeleteDistributorDialogProps) => (
  <Dialog open={open}>
    <DialogTitle>{titleText}</DialogTitle>

    <DialogContent>
      <DialogContentText>{dataLossMessage}</DialogContentText>
    </DialogContent>

    <DialogActions>
      <Button autoFocus onClick={onClose}>
        {confirmText}
      </Button>

      <Button onClick={onDiscard}>{cancelText}</Button>
    </DialogActions>
  </Dialog>
);

export default DeleteDistributorDialog;
