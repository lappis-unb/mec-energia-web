import LockRoundedIcon from "@mui/icons-material/LockRounded";
import { Button } from "@mui/material";
import { useDispatch } from "react-redux";
import { setActivePersonId, setIsEditPasswordFormOpen } from "@/store/appSlice";
import EditPasswordForm from "@/components/Person/Form/EditPasswordForm";

interface ProfileEditPasswordButtonProps {
  personId: number;
}

const ProfileResetPasswordButton = ({ personId }: ProfileEditPasswordButtonProps) => {
  const dispatch = useDispatch();

  const handleClick = () => {
    dispatch(setActivePersonId(personId));
    dispatch(setIsEditPasswordFormOpen(true));
  };

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

