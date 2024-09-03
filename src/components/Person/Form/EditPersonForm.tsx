import React, { Fragment, useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectActivePersonId,
  selectIsPersonEditFormOpen,
  setIsErrorNotificationOpen,
  setIsPersonEditFormOpen,
  setIsSuccessNotificationOpen,
} from "../../../store/appSlice";
import { SubmitHandler, useForm } from "react-hook-form";
import FormWarningDialog from "../../ConsumerUnit/Form/WarningDialog";
import {
  EditPersonForm,
  EditPersonRequestPayload,
  UserRole,
} from "@/types/person";
import {
  useEditPersonMutation,
  useGetPersonQuery,
  useGetUniversityPersonQuery,
} from "@/api";
import { skipToken } from "@reduxjs/toolkit/dist/query";
import FormDrawerV2 from "@/components/Form/DrawerV2";
import PersonalInformationSection from "../Rules/FormEditPersonSections";

const defaultValues: EditPersonForm = {
  email: "",
  firstName: "",
  lastName: "",
  university: null,
  type: UserRole.UNIVERSITY_USER,
};

const EditPersonForm = () => {
  const dispatch = useDispatch();
  const isEditFormOpen = useSelector(selectIsPersonEditFormOpen);
  const [shouldShowCancelDialog, setShouldShowCancelDialog] = useState(false);
  const currentPersonId = useSelector(selectActivePersonId);
  const { data: currentPerson, refetch: refetchPerson } = useGetPersonQuery(
    currentPersonId || skipToken
  );
  const { data: universityPerson } = useGetUniversityPersonQuery(
    currentPersonId || skipToken
  );
  const [editPerson, { isError, isSuccess, isLoading, reset: resetMutation }] =
    useEditPersonMutation();
  const form = useForm({ defaultValues });
  const {
    control,
    reset,
    handleSubmit,
    setValue,
    formState: { isDirty, errors },
  } = form;

  const handleCancelEdition = () => {
    if (isDirty) {
      setShouldShowCancelDialog(true);
      return;
    }
    handleDiscardForm();
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: currentPerson } = await refetchPerson();
        if (!currentPerson) return;
        setValue("firstName", currentPerson.firstName);
        setValue("lastName", currentPerson.lastName);
        setValue("email", currentPerson.email);
      } catch (err) {
        console.error("Failed to refetch:", err);
      }
    };

    if (isEditFormOpen) {
      fetchData();
    }
  }, [currentPerson, isEditFormOpen, setValue]);

  const handleDiscardForm = useCallback(() => {
    handleCloseDialog();
    reset();
    dispatch(setIsPersonEditFormOpen(false));
  }, [dispatch, reset]);

  const handleCloseDialog = () => {
    setShouldShowCancelDialog(false);
  };

  const onSubmitHandler: SubmitHandler<EditPersonForm> = async (data) => {
    const { email, firstName, lastName } = data;

    if (!currentPerson || !universityPerson) return;

    const body: EditPersonRequestPayload = {
      email,
      firstName,
      lastName,
      type: currentPerson.type,
      university: universityPerson.university,
      id: currentPerson.id,
    };

    await editPerson(body);
  };

  const handleNotification = useCallback(() => {
    if (isSuccess) {
      dispatch(
        setIsSuccessNotificationOpen({
          isOpen: true,
          text: "Pessoa editada com sucesso!",
        })
      );
      reset();
      resetMutation();
      dispatch(setIsPersonEditFormOpen(false));
    } else if (isError) {
      dispatch(
        setIsErrorNotificationOpen({
          isOpen: true,
          text: "Erro ao editar pessoa.",
        })
      );
      resetMutation();
    }
  }, [dispatch, isError, isSuccess, reset, resetMutation]);

  useEffect(() => {
    handleNotification();
  }, [handleNotification, isSuccess, isError]);

  return (
    <Fragment>
      <FormDrawerV2
        errorsLength={Object.keys(errors).length}
        open={isEditFormOpen}
        handleCloseDrawer={handleCancelEdition}
        handleSubmitDrawer={handleSubmit(onSubmitHandler)}
        isLoading={isLoading}
        title="Editar Pessoa"
        header={<></>}
        sections={[<PersonalInformationSection key={0} control={control} />]}
      />

      <FormWarningDialog
        open={shouldShowCancelDialog}
        entity={"registro"}
        onClose={handleCloseDialog}
        onDiscard={handleDiscardForm}
        type="update"
      />
    </Fragment>
  );
};

export default EditPersonForm;
