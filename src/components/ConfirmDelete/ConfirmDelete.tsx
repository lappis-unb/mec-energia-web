import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

interface ConfirmWarningProps {
  title: string;
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmDelete = ({
  title,
  open,
  onConfirm,
  onCancel,
}: ConfirmWarningProps) => (
  <Dialog open={open} >
    <DialogTitle>{title}</DialogTitle>

    <DialogContent>
      <DialogContentText>
        Todos os dados lançados serão perdidos. Essa ação não poderá ser
        desfeita.
      </DialogContentText>
    </DialogContent>

    <DialogActions>
      <Button autoFocus onClick={onCancel}>
        Cancelar
      </Button>

      <Button onClick={onConfirm}>Apagar</Button>
    </DialogActions>
  </Dialog>
);

export default ConfirmDelete;
