import React, { Fragment, useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectActiveDistributorId,
  selectIsDistributorEditFormOpen,
  setIsDistributorEditFormOpen,
  setIsErrorNotificationOpen,
  setIsSuccessNotificationOpen,
} from "../../../store/appSlice";
import { EditDistributorForm, EditDistributorRequestPayload } from "../../../types/distributor";
import { useForm, SubmitHandler } from "react-hook-form";
import FormWarningDialog from "../../ConsumerUnit/Form/WarningDialog";
import { useEditDistributorMutation, useGetDistributorQuery } from "@/api";
import { skipToken } from "@reduxjs/toolkit/dist/query";
import FormDrawerV2 from "@/components/Form/DrawerV2";
import DistributorFormSection from "./DistributorFormSection";
import { useSession } from "next-auth/react";

const defaultValues: EditDistributorForm = {
  isActive: true,
  name: "",
  cnpj: "",
};

const DistributorEditForm = () => {
  const user = useSession().data?.user;
  const dispatch = useDispatch();
  const activeDistributor = useSelector(selectActiveDistributorId);
  const isEditFormOpen = useSelector(selectIsDistributorEditFormOpen);
  const [shouldShowCancelDialog, setShouldShowCancelDialog] = useState(false);
  const [cnpjValid, setCnpjValid] = useState(true);
  const [editDistributor, { isError, isSuccess, isLoading, reset: resetMutation }] =
    useEditDistributorMutation();
  const { data: distributor, refetch: refetchDistributor } =
    useGetDistributorQuery(activeDistributor || skipToken);
  const form = useForm({ defaultValues });
  const {
    control,
    reset,
    handleSubmit,
    watch,
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
    if (isEditFormOpen) {
      const fetchData = async () => {
        try {
          const { data: distributor } = await refetchDistributor();
          if (!distributor) return;
          const { name, isActive, cnpj } = distributor;
          setValue("name", name);
          setValue("cnpj", cnpj);
          setValue("isActive", isActive);
        } catch (err) {
          console.error("Failed to refetch:", err);
        }
      };
      fetchData();
    }
  }, [distributor, isEditFormOpen, setValue, refetchDistributor]);

  useEffect(() => {
    setValue("isActive", watch("isActive"));
  }, [watch, setValue]);

  const handleDiscardForm = useCallback(() => {
    setCnpjValid(true);
    handleCloseDialog();
    reset();
    dispatch(setIsDistributorEditFormOpen(false));
  }, [dispatch, reset]);

  const handleCloseDialog = () => {
    setShouldShowCancelDialog(false);
  };

  const onSubmitHandler: SubmitHandler<EditDistributorForm> = async (data) => {
    const cnpjSemMascara = data.cnpj.replace(/[\/.-]/g, "");
    data.cnpj = cnpjSemMascara;
    if (!activeDistributor || !user?.universityId) return;
    const body: EditDistributorRequestPayload = {
      id: activeDistributor,
      name: data.name.trim(),
      cnpj: data.cnpj,
      isActive: data.isActive,
      university: user.universityId,
    };
    await editDistributor(body);
  };

  const handleNotification = useCallback(() => {
    if (isSuccess) {
      dispatch(
        setIsSuccessNotificationOpen({
          isOpen: true,
          text: "Distribuidora modificada com sucesso!",
        })
      );
      reset();
      resetMutation();
      dispatch(setIsDistributorEditFormOpen(false));
    } else if (isError) {
      dispatch(
        setIsErrorNotificationOpen({
          isOpen: true,
          text: "Erro ao editar distribuidora.",
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
        open={isEditFormOpen}
        title={"Editar Distribuidora"}
        errorsLength={Object.keys(errors).length}
        isLoading={isLoading}
        handleCloseDrawer={handleCancelEdition}
        handleSubmitDrawer={handleSubmit(onSubmitHandler)}
        header={<></>}
        sections={[<DistributorFormSection key={0} control={control} cnpjValid={cnpjValid} setCnpjValid={setCnpjValid} distributor={distributor} />]}
      />
      <FormWarningDialog
        open={shouldShowCancelDialog}
        entity={"distribuidora"}
        onClose={handleCloseDialog}
        onDiscard={handleDiscardForm}
        type="update"
      />
    </Fragment>
  );
};

export default DistributorEditForm;
