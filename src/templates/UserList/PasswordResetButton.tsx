import { useCallback } from "react";
import { IconButton } from "@mui/material";
import { LockResetRounded } from "@mui/icons-material";
import { useLazyResetPasswordAdminRequestQuery } from "@/api";

interface UserListPasswordResetButtonProps {
  email: string;
}

const UserListPasswordResetButton = ({ email }: UserListPasswordResetButtonProps) => {
  const [triggerResetPasswordRequest, { isLoading }] = useLazyResetPasswordAdminRequestQuery();

  const handleOnPasswordResetButtonClick = useCallback(() => {
    triggerResetPasswordRequest({ email });
  }, [triggerResetPasswordRequest, email]);

  return (
    <IconButton onClick={handleOnPasswordResetButtonClick} disabled={isLoading}>
      <LockResetRounded />
    </IconButton>
  );
};

export default UserListPasswordResetButton;
