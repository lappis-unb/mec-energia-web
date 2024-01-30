import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

interface FormWarningDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: () => void;
}

const FormConfirmDialog = ({
  open,
  onClose,
  onSave,
}: FormWarningDialogProps) => (
  <Dialog id="DialogConfirm" open={open} onClick={onClose}>
    <DialogTitle>{`Deseja gravar?`}</DialogTitle>

    <DialogContent>
      <DialogContentText>Os dados inseridos serão gravado.</DialogContentText>
    </DialogContent>

    <DialogActions>
      <Button onClick={onSave}>Gravar Agora</Button>
      <Button autoFocus onClick={onClose}>
        Continuar editando
      </Button>
    </DialogActions>
  </Dialog>
);

export default FormConfirmDialog;
