import React, { Fragment, useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectIsDistributorCreateFormOpen,
  setActiveDistributorId,
  setIsDistributorCreateFormOpen,
  setIsErrorNotificationOpen,
  setIsSuccessNotificationOpen,
} from "../../../store/appSlice";
import { CreateDistributorForm, CreateDistributorRequestPayload } from "../../../types/distributor";
import { useForm, SubmitHandler } from "react-hook-form";
import FormWarningDialog from "../../ConsumerUnit/Form/WarningDialog";
import { useCreateDistributorMutation } from "@/api";
import { useSession } from "next-auth/react";
import FormDrawerV2 from "@/components/Form/DrawerV2";
import DistributorFormSection from "./DistributorFormSection";

const defaultValues: CreateDistributorForm = {
  name: "",
  cnpj: "",
};

const DistributorCreateForm = () => {
  const dispatch = useDispatch();
  const { data: session } = useSession();
  const user = session?.user;
  const isCreateFormOpen = useSelector(selectIsDistributorCreateFormOpen);
  const [shouldShowCancelDialog, setShouldShowCancelDialog] = useState(false);
  const [cnpjValid, setCnpjValid] = useState(true);
  const [createDistributor, { isError, isSuccess, isLoading, reset: resetMutation }] =
    useCreateDistributorMutation();
  const form = useForm({ defaultValues });
  const {
    control,
    reset,
    handleSubmit,
    formState: { isDirty, errors },
  } = form;

  const handleCancelEdition = () => {
    if (isDirty) {
      setShouldShowCancelDialog(true);
      return;
    }
    handleDiscardForm();
  };

  const handleDiscardForm = useCallback(() => {
    setCnpjValid(true);
    handleCloseDialog();
    reset();
    dispatch(setIsDistributorCreateFormOpen(false));
  }, [dispatch, reset]);

  const handleCloseDialog = () => {
    setShouldShowCancelDialog(false);
  };

  const onSubmitHandler: SubmitHandler<CreateDistributorForm> = async (data) => {
    const cnpjSemMascara = data.cnpj.replace(/[\/.-]/g, "");
    data.cnpj = cnpjSemMascara;
    const body: CreateDistributorRequestPayload = {
      name: data.name.trim(),
      cnpj: data.cnpj,
      isActive: true,
      university: user?.universityId as number,
    };
    const createdDistributor = await createDistributor(body);
    if ("data" in createdDistributor) {
      dispatch(setActiveDistributorId(createdDistributor.data.id ?? null));
    }
  };

  const handleNotification = useCallback(() => {
    if (isSuccess) {
      dispatch(
        setIsSuccessNotificationOpen({
          isOpen: true,
          text: "Distribuidora adicionada com sucesso!",
        })
      );
      reset();
      resetMutation();
      dispatch(setIsDistributorCreateFormOpen(false));
    } else if (isError) {
      dispatch(
        setIsErrorNotificationOpen({
          isOpen: true,
          text: "Erro ao adicionar distribuidora.",
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
        open={isCreateFormOpen}
        title={"Adicionar Distribuidora"}
        errorsLength={Object.keys(errors).length}
        isLoading={isLoading}
        handleCloseDrawer={handleCancelEdition}
        handleSubmitDrawer={handleSubmit(onSubmitHandler)}
        header={<></>}
        sections={[<DistributorFormSection key={0} control={control} cnpjValid={cnpjValid} setCnpjValid={setCnpjValid} />]}
      />
      <FormWarningDialog
        open={shouldShowCancelDialog}
        entity={"distribuidora"}
        onClose={handleCloseDialog}
        onDiscard={handleDiscardForm}
        type="create"
      />
    </Fragment>
  );
};

export default DistributorCreateForm;