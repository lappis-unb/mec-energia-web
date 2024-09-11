import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { IconButton } from "@mui/material";
import { EditRounded } from "@mui/icons-material";
import EditInstitutionForm from "@/components/Institution/Form/EditInstitutionForm";
import { setActiveInstitutionId, setIsInstitutionEditFormOpen } from "@/store/appSlice";

interface InstitutionEditButtonProps {
  institutionId: number;
}

const InstitutionEditButton = ({
  institutionId,
}: InstitutionEditButtonProps) => {
  const dispatch = useDispatch();

  const handleClick = useCallback(() => {
    dispatch(setActiveInstitutionId(institutionId))
    dispatch(setIsInstitutionEditFormOpen(true));
  }, [dispatch, institutionId]);

  return (
    <>
      <IconButton style={{ color: '#000000DE' }} size="small" onClick={handleClick}>
        <EditRounded />
      </IconButton>

      <EditInstitutionForm />
    </>
  );
};

export default InstitutionEditButton;
