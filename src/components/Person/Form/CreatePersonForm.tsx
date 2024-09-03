import React, {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSession } from "next-auth/react";
import {
  selectIsPersonCreateFormOpen,
  setIsErrorNotificationOpen,
  setIsPersonCreateFormOpen,
  setIsSuccessNotificationOpen,
} from "../../../store/appSlice";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  CreatePersonForm as CreatePersonFormType,
  CreatePersonRequestPayload,
  UserRole,
} from "@/types/person";
import { useCreatePersonMutation, useGetAllInstitutionQuery } from "@/api";
import FormDrawerV2 from "@/components/Form/DrawerV2";
import FormWarningDialog from "../../ConsumerUnit/Form/WarningDialog";
import {
  PersonalInformationSection,
  PerfilSection,
} from "../Rules/FormCreatePersonSections";

const defaultValues: CreatePersonFormType = {
  email: "",
  firstName: "",
  lastName: "",
  university: null,
  type: UserRole.UNIVERSITY_USER,
};

const CreatePersonForm = () => {
  const dispatch = useDispatch();
  const isCreateFormOpen = useSelector(selectIsPersonCreateFormOpen);
  const [shouldShowCancelDialog, setShouldShowCancelDialog] = useState(false);
  const { data: institutions } = useGetAllInstitutionQuery();
  const [
    createPerson,
    { isError, isSuccess, isLoading, reset: resetMutation },
  ] = useCreatePersonMutation();
  const { data: session } = useSession();
  const {
    control,
    reset,
    handleSubmit,
    formState: { isDirty, errors },
  } = useForm({ defaultValues });

  const institutionsOptions = useMemo(
    () =>
      institutions?.map((institution) => ({
        label: institution.name,
        id: institution.id,
      })),
    [institutions]
  );

  const handleCancelEdition = () => {
    if (isDirty) {
      setShouldShowCancelDialog(true);
    } else {
      handleDiscardForm();
    }
  };

  const handleDiscardForm = useCallback(() => {
    handleCloseDialog();
    reset();
    dispatch(setIsPersonCreateFormOpen(false));
  }, [dispatch, reset]);

  const handleCloseDialog = () => {
    setShouldShowCancelDialog(false);
  };

  const onSubmitHandler: SubmitHandler<CreatePersonFormType> = async (data) => {
    const { email, firstName, lastName, type, university } = data;
    const universityId =
      session?.user?.type !== UserRole.SUPER_USER
        ? session?.user?.universityId ?? 0
        : university?.id ?? 0;

    const body: CreatePersonRequestPayload = {
      email,
      firstName,
      lastName,
      type,
      university: universityId,
    };

    try {
      await createPerson(body).unwrap();
      dispatch(
        setIsSuccessNotificationOpen({
          isOpen: true,
          text: "Pessoa adicionada com sucesso!",
        })
      );
      reset();
      dispatch(setIsPersonCreateFormOpen(false));
    } catch {
      dispatch(
        setIsErrorNotificationOpen({
          isOpen: true,
          text: "Erro ao adicionar pessoa.",
        })
      );
    } finally {
      resetMutation();
    }
  };

  useEffect(() => {
    if (isSuccess || isError) {
      resetMutation(); // Reset mutation state after handling notifications
    }
  }, [isSuccess, isError, resetMutation]);

  return (
    <Fragment>
      <FormDrawerV2
        errorsLength={Object.keys(errors).length}
        open={isCreateFormOpen}
        handleCloseDrawer={handleCancelEdition}
        handleSubmitDrawer={handleSubmit(onSubmitHandler)}
        isLoading={isLoading}
        title="Adicionar Pessoa"
        sections={[
          <PersonalInformationSection
            key={0}
            control={control}
            errors={errors}
            institutionsOptions={institutionsOptions}
            session={session}
          />,
          <PerfilSection key={1} control={control} error={errors.type} />,
        ]}
      />
      <FormWarningDialog
        open={shouldShowCancelDialog}
        entity={"registro"}
        onClose={handleCloseDialog}
        onDiscard={handleDiscardForm}
        type="create"
      />
    </Fragment>
  );
};

export default CreatePersonForm;
