import { useCallback, useState } from "react";
import { IconButton } from "@mui/material";
import { LockResetRounded } from "@mui/icons-material";
import { useLazyResetPasswordAdminRequestQuery } from "@/api";
import PasswordResetConfirmationDialog from "@/components/Person/PasswordResetConfirmationDialog";
import { useDispatch } from "react-redux";
import { setIsSuccessNotificationOpen } from "@/store/appSlice";

interface UserListPasswordResetButtonProps {
  id: string;
  userName: string;
}

const UserListPasswordResetButton = ({ id, userName }: UserListPasswordResetButtonProps) => {
  const [triggerResetPasswordRequest, { isLoading }] = useLazyResetPasswordAdminRequestQuery();
  const [dialogOpen, setDialogOpen] = useState(false);

  const dispatch = useDispatch();

  const handleOnPasswordResetButtonClick = useCallback(() => {
    setDialogOpen(true);
  }, []);

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleConfirmReset = () => {
    dispatch(
      setIsSuccessNotificationOpen({
        isOpen: true,
        text: "Senha reiniciada com sucesso!",
      })
    );
    triggerResetPasswordRequest({ id });
    setDialogOpen(false);
  };

  return (
    <>
      <IconButton style={{ color: '#000000DE' }} onClick={handleOnPasswordResetButtonClick} disabled={isLoading}>
        <LockResetRounded />
      </IconButton>
      <PasswordResetConfirmationDialog
        open={dialogOpen}
        userName={userName}
        onClose={handleDialogClose}
        onConfirm={handleConfirmReset}
      />
    </>
  );
};

export default UserListPasswordResetButton;
