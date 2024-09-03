import React, { Fragment, useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { useSession } from "next-auth/react";
import { useCreateConsumerUnitMutation } from "@/api";
import {
  setIsConsumerUnitCreateFormOpen,
  setIsSuccessNotificationOpen,
  setIsErrorNotificationOpen,
  selectIsConsumerUnitCreateFormOpen,
} from "@/store/appSlice";
import DistributorCreateFormDialog from "@/components/Distributor/Form/CreateForm";
import FormDrawerV2 from "@/components/Form/DrawerV2";
import { sendFormattedDate } from "@/utils/date";
import FormWarningDialog from "./WarningDialog";
import { CreateConsumerUnitForm } from "@/types/consumerUnit";
import ConsumerUnitSection from "../CardsFormsSection/ConsumerUnitSection";
import ContractSection from "../CardsFormsSection/ContractSection";
import ContractedDemandSection from "../CardsFormsSection/ContractedDemandSection";
import InstalledPower from "../CardsFormsSection/InstalledPower";

const defaultValues: CreateConsumerUnitForm = {
  name: "",
  code: "",
  distributor: "",
  startDate: null,
  supplyVoltage: "",
  tariffFlag: "G",
  contracted: "",
  peakContractedDemandInKw: "",
  offPeakContractedDemandInKw: "",
  totalInstalledPower: null,
  shouldShowInstalledPower: false,
};

const ConsumerUnitCreateForm = () => {
  const dispatch = useDispatch();
  const isCreateFormOpen = useSelector(selectIsConsumerUnitCreateFormOpen);
  const { data: session } = useSession();

  const [
    createConsumerUnit,
    { isError, isSuccess, isLoading, reset: resetMutation },
  ] = useCreateConsumerUnitMutation();

  const [shouldShowCancelDialog, setShouldShowCancelDialog] = useState(false);
  const [shouldShowDistributorFormDialog, setShouldShowDistributorFormDialog] =
    useState(false);
  const [shouldShowGreenDemand, setShouldShowGreenDemand] = useState(true);

  const form = useForm({ mode: "all", defaultValues });
  const {
    control,
    reset,
    handleSubmit,
    watch,
    setValue,
    getValues,
    formState: { isDirty, errors },
  } = form;

  const tariffFlag = watch("tariffFlag");
  const shouldShowInstalledPower = watch("shouldShowInstalledPower");

  const handleNotification = useCallback(() => {
    if (isSuccess) {
      dispatch(
        setIsSuccessNotificationOpen({
          isOpen: true,
          text: "Unidade consumidora adicionada com sucesso!",
        })
      );
      reset();
      resetMutation();
      dispatch(setIsConsumerUnitCreateFormOpen(false));
    } else if (isError) {
      dispatch(
        setIsErrorNotificationOpen({
          isOpen: true,
          text: "Erro ao adicionar unidade consumidora. Verifique se já existe uma unidade com nome ou código",
        })
      );
      resetMutation();
    }
  }, [dispatch, isError, isSuccess, reset, resetMutation]);

  const handleCloseDialog = () => setShouldShowCancelDialog(false);

  const handleDiscardForm = useCallback(() => {
    handleCloseDialog();
    reset();
    dispatch(setIsConsumerUnitCreateFormOpen(false));
  }, [dispatch, reset]);

  const handleCancelEdition = useCallback(() => {
    if (isDirty) {
      setShouldShowCancelDialog(true);
      return;
    }
    handleDiscardForm();
  }, [handleDiscardForm, isDirty]);

  const onSubmitHandler = useCallback(
    async (data) => {
      if (data.tariffFlag === "G") {
        data.offPeakContractedDemandInKw = data.contracted;
        data.peakContractedDemandInKw = data.contracted;
      }

      const body = createRequestPayload(data);
      await createConsumerUnit(body);
    },
    [createConsumerUnit, session?.user.universityId]
  );

  const createRequestPayload = (data) => ({
    consumerUnit: {
      name: data.name,
      code: data.code,
      isActive: true,
      university: session?.user.universityId || 0,
      totalInstalledPower: data.shouldShowInstalledPower
        ? data.totalInstalledPower
        : null,
    },
    contract: {
      startDate: data.startDate ? sendFormattedDate(data.startDate) : "",
      tariffFlag: data.tariffFlag,
      peakContractedDemandInKw: data.peakContractedDemandInKw,
      offPeakContractedDemandInKw: data.offPeakContractedDemandInKw,
      supplyVoltage: data.supplyVoltage,
      distributor: data.distributor,
    },
  });

  const handleCloseDistributorFormDialog = () =>
    setShouldShowDistributorFormDialog(false);

  useEffect(
    () => handleNotification(),
    [handleNotification, isSuccess, isError]
  );

  useEffect(() => handleGreenDemandChange(), [setValue, tariffFlag]);

  useEffect(() => {
    if (!shouldShowGreenDemand) setValue("tariffFlag", "B");
  }, [shouldShowGreenDemand]);

  const handleGreenDemandChange = useCallback(() => {
    const {
      contracted,
      peakContractedDemandInKw,
      offPeakContractedDemandInKw,
    } = defaultValues;

    if (!shouldShowGreenDemand) {
      setValue("peakContractedDemandInKw", getValues("contracted"));
      setValue("offPeakContractedDemandInKw", getValues("contracted"));
    } else {
      setValue("contracted", contracted);
      setValue("peakContractedDemandInKw", peakContractedDemandInKw);
      setValue("offPeakContractedDemandInKw", offPeakContractedDemandInKw);
    }
  }, [setValue, shouldShowGreenDemand]);

  return (
    <Fragment>
      <FormDrawerV2
        open={isCreateFormOpen}
        title="Adicionar Unidade Consumidora"
        errorsLength={Object.keys(errors).length}
        isLoading={isLoading}
        handleCloseDrawer={handleCancelEdition}
        handleSubmitDrawer={handleSubmit(onSubmitHandler)}
        header={<></>}
        sections={[
          <ConsumerUnitSection key="consumer-unit" control={control} />,
          <ContractSection
            key="contract-distributor"
            control={control}
            setShouldShowDistributorFormDialog={
              setShouldShowDistributorFormDialog
            }
            setShouldShowGreenDemand={setShouldShowGreenDemand}
            session={session}
          />,
          <ContractedDemandSection
            key="contracted-demand-green"
            control={control}
            tariffFlag={tariffFlag}
            shouldShowGreenDemand={shouldShowGreenDemand}
          />,
          <InstalledPower
            key="installed-power-conditional"
            control={control}
            shouldShowInstalledPower={shouldShowInstalledPower}
          />,
        ]}
      />

      <FormWarningDialog
        open={shouldShowCancelDialog}
        entity={"unidade consumidora"}
        onClose={handleCloseDialog}
        onDiscard={handleDiscardForm}
        type="create"
      />

      <DistributorCreateFormDialog
        open={shouldShowDistributorFormDialog}
        onClose={handleCloseDistributorFormDialog}
      />
    </Fragment>
  );
};

export default ConsumerUnitCreateForm;
