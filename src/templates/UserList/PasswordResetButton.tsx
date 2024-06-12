import { useCallback } from "react";
import { IconButton } from "@mui/material";
import { LockResetRounded } from "@mui/icons-material";
import { useLazyResetPasswordAdminRequestQuery } from "@/api";

interface UserListPasswordResetButtonProps {
  id: string;
}

const UserListPasswordResetButton = ({ id }: UserListPasswordResetButtonProps) => {
  const [triggerResetPasswordRequest, { isLoading }] = useLazyResetPasswordAdminRequestQuery();

  const handleOnPasswordResetButtonClick = useCallback(() => {
    triggerResetPasswordRequest({ id });
  }, [triggerResetPasswordRequest, id]);

  return (
    <IconButton onClick={handleOnPasswordResetButtonClick} disabled={isLoading}>
      <LockResetRounded />
    </IconButton>
  );
};

export default UserListPasswordResetButton;
