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
  entity?: string | null;
  type: "update" | "create";
  onClose: () => void;
  onDiscard: () => void;
}

const FormWarningDialog = ({
  open,
  type,
  entity,
  onClose,
  onDiscard,
}: FormWarningDialogProps) => (
  <Dialog open={open} onClick={onClose}>
    <DialogTitle>{`Descartar ${
      type == "create" ? entity : "modificações"
    }?`}</DialogTitle>

    {type == "create" && (
      <DialogContent>
        <DialogContentText>
          Os dados inseridos serão perdidos.
        </DialogContentText>
      </DialogContent>
    )}

    <DialogActions>
      <Button autoFocus onClick={onClose}>
        Continuar editando
      </Button>
      <Button onClick={onDiscard}>Descartar</Button>
    </DialogActions>
  </Dialog>
);

export default FormWarningDialog;
