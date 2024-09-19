import { useCallback } from "react";
import LockRoundedIcon from "@mui/icons-material/LockRounded";
import { Button } from "@mui/material";
import { useDispatch } from "react-redux";
import { setActivePersonId, setIsEditPasswordFormOpen } from "@/store/appSlice";
import EditPasswordForm from "@/components/Person/Form/EditPasswordForm";

interface ProfileEditPasswordButtonProps {
  personId: number;
}

const ProfileResetPasswordButton = (props: ProfileEditPasswordButtonProps) => {
  const dispatch = useDispatch();

  const handleClick = useCallback(() => {
    dispatch(setActivePersonId(props.personId))
    dispatch(setIsEditPasswordFormOpen(true));
  }, [dispatch, props.personId]);

  return (
    <>
      <Button
        variant="outlined"
        color="primary"
        startIcon={<LockRoundedIcon />}
        size="small"
        onClick={handleClick}
      >
        Alterar senha
      </Button>
      <EditPasswordForm />
    </>
  );
};

export default ProfileResetPasswordButton;
