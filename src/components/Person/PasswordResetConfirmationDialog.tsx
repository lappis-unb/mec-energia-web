import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
  } from "@mui/material";
  
  interface PasswordResetConfirmationDialogProps {
    open: boolean;
    userName: string;
    onClose: () => void;
    onConfirm: () => void;
  }
  
  const PasswordResetConfirmationDialog = ({
    open,
    userName,
    onClose,
    onConfirm,
  }: PasswordResetConfirmationDialogProps) => (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{`Reiniciar senha de ${userName}?`}</DialogTitle>
  
      <DialogContent>
        <DialogContentText>
          A pessoa perderá o acesso ao sistema e receberá um e-mail com instruções para gerar uma nova senha.
        </DialogContentText>
      </DialogContent>
  
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={onConfirm}>Reiniciar</Button>
      </DialogActions>
    </Dialog>
  );
  
  export default PasswordResetConfirmationDialog;
  