import { useDispatch } from "react-redux";
import { Button } from "@mui/material";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import EditPersonForm from "@/components/Person/Form/EditPersonForm";
import { setActivePersonId, setIsPersonEditFormOpen } from "@/store/appSlice";

interface ProfileEditButtonProps {
  personId: number;
}

const ProfileEditButton = ({ personId }: ProfileEditButtonProps) => {
  const dispatch = useDispatch();

  const handleClick = () => {
    dispatch(setActivePersonId(personId));
    dispatch(setIsPersonEditFormOpen(true));
  };

  return (
    <>
      <Button
        variant="outlined"
        color="primary"
        startIcon={<EditRoundedIcon />}
        size="small"
        onClick={handleClick}
      >
        Editar
      </Button>

      <EditPersonForm />
    </>
  );
};

export default ProfileEditButton;

