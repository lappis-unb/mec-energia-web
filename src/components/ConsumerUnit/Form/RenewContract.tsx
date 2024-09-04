import { Fragment, useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm, SubmitHandler } from "react-hook-form";
import { useSession } from "next-auth/react";
import {
  useGetConsumerUnitQuery,
  useGetContractQuery,
  useRenewContractMutation,
} from "@/api";
import {
  setIsConsumerUnitRenewContractFormOpen as setIsRenewContractFormOpen,
  setIsErrorNotificationOpen,
  setIsSuccessNotificationOpen,
  selectIsConsumerUnitRenewContractFormOpen,
  selectActiveConsumerUnitId,
} from "@/store/appSlice";
import {
  RenewContractForm,
  RenewContractRequestPayload,
} from "@/types/contract";
import ContractSection from "../CardsFormsSection/ContractSection";
import ContractedDemandRenew from "../CardsFormsSection/ContractedDemandRenew";
import FormDrawerV2 from "@/components/Form/DrawerV2";
import FormWarningDialog from "./WarningDialog";
import FormConfirmDialog from "./WarningDialogConfirm";
import DistributorCreateFormDialog from "@/components/Distributor/Form/CreateForm";
import { sendFormattedDate } from "@/utils/date";
import { skipToken } from "@reduxjs/toolkit/query";

const defaultValues: RenewContractForm = {
  code: "",
  distributor: "",
  startDate: null,
  supplyVoltage: "",
  tariffFlag: "G",
  contracted: "",
  peakContractedDemandInKw: "",
  offPeakContractedDemandInKw: "",
};

const ConsumerUnitRenewContractForm = () => {
  const dispatch = useDispatch();
  const isRenewContractFormOpen = useSelector(
    selectIsConsumerUnitRenewContractFormOpen
  );
  const activeConsumerUnit = useSelector(selectActiveConsumerUnitId);
  const { data: session } = useSession();

  const [
    renewContract,
    { isError, isSuccess, isLoading, reset: resetMutation },
  ] = useRenewContractMutation();
  const { data: contract } = useGetContractQuery(
    activeConsumerUnit || skipToken
  );
  const { data: consumerUnit } = useGetConsumerUnitQuery(
    activeConsumerUnit || skipToken
  );

  const [shouldShowCancelDialog, setShouldShowCancelDialog] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
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

  useEffect(() => {
    if (isRenewContractFormOpen) {
      setValue("code", consumerUnit?.code as string);
      setValue("distributor", contract?.distributor ?? "");
      setValue("supplyVoltage", contract?.supplyVoltage ?? "");

      const supplyVoltage = contract?.supplyVoltage ?? 0;
      setShouldShowGreenDemand(
        supplyVoltage !== 69 && (supplyVoltage < 88 || supplyVoltage > 138)
      );

      if (!shouldShowGreenDemand) {
        setValue("peakContractedDemandInKw", getValues("contracted"));
        setValue("offPeakContractedDemandInKw", getValues("contracted"));
        setValue("contracted", getValues("contracted"));
      } else {
        setValue(
          "peakContractedDemandInKw",
          contract?.peakContractedDemandInKw ?? ""
        );
        setValue(
          "offPeakContractedDemandInKw",
          contract?.offPeakContractedDemandInKw ?? ""
        );
        setValue("contracted", contract?.peakContractedDemandInKw ?? "");
      }
    }
  }, [
    consumerUnit?.code,
    contract?.distributor,
    contract?.offPeakContractedDemandInKw,
    contract?.peakContractedDemandInKw,
    contract?.startDate,
    contract?.supplyVoltage,
    getValues,
    isRenewContractFormOpen,
    setValue,
    shouldShowGreenDemand,
  ]);

  useEffect(() => {
    if (!shouldShowGreenDemand) {
      setValue("tariffFlag", "B");
    }
  }, [setValue, shouldShowGreenDemand]);

  useEffect(() => {
    setValue("tariffFlag", contract?.tariffFlag ?? "B");
  }, [contract?.tariffFlag, isRenewContractFormOpen, setValue]);

  const handleCloseDialog = () => {
    setShouldShowCancelDialog(false);
    setShowConfirmDialog(false);
  };

  const handleCancelEdition = () => {
    if (isDirty) {
      setShouldShowCancelDialog(true);
      return;
    }
    handleDiscardForm();
  };

  const handleDiscardForm = () => {
    handleCloseDialog();
    reset();
    dispatch(setIsRenewContractFormOpen(false));
  };

  const onSubmitHandler: SubmitHandler<RenewContractForm> = async (data) => {
    setShowConfirmDialog(false);
    if (data.tariffFlag === "G") {
      data.offPeakContractedDemandInKw = data.contracted;
      data.peakContractedDemandInKw = data.contracted;
    }
    const formattedDate = sendFormattedDate(data.startDate as Date);
    const body: RenewContractRequestPayload = {
      consumerUnit: activeConsumerUnit as number,
      code: data.code,
      distributor: data.distributor as number,
      startDate: formattedDate,
      tariffFlag: data.tariffFlag,
      peakContractedDemandInKw: data.peakContractedDemandInKw as number,
      offPeakContractedDemandInKw: data.offPeakContractedDemandInKw as number,
      supplyVoltage: data.supplyVoltage as number,
    };
    await renewContract(body);
  };

  const handleNotification = useCallback(() => {
    if (isSuccess) {
      dispatch(
        setIsSuccessNotificationOpen({
          isOpen: true,
          text: "Contrato renovado com sucesso!",
        })
      );
      reset();
      resetMutation();
      dispatch(setIsRenewContractFormOpen(false));
    } else if (isError) {
      dispatch(
        setIsErrorNotificationOpen({
          isOpen: true,
          text: "Erro ao renovar contrato",
        })
      );
      resetMutation();
    }
  }, [dispatch, isError, isSuccess, reset, resetMutation]);

  useEffect(() => {
    handleNotification();
  }, [handleNotification, isSuccess, isError]);

  const handleCloseDistributorFormDialog = () =>
    setShouldShowDistributorFormDialog(false);

  return (
    <Fragment>
      <FormDrawerV2
        open={isRenewContractFormOpen}
        title={"Renovar Contrato"}
        errorsLength={Object.keys(errors).length}
        isLoading={isLoading}
        handleCloseDrawer={handleCancelEdition}
        handleSubmitDrawer={handleSubmit(onSubmitHandler)}
        sections={[
          <ContractSection
            key="contract-section"
            control={control}
            setShouldShowDistributorFormDialog={
              setShouldShowDistributorFormDialog
            }
            setShouldShowGreenDemand={setShouldShowGreenDemand}
            session={session}
          />,
          <ContractedDemandRenew
            key="contracted-demand-renew"
            control={control}
            tariffFlag={tariffFlag}
            shouldShowGreenDemand={shouldShowGreenDemand}
            minimumDemand={0}
          />,
        ]}
      />

      <FormWarningDialog
        entity="contrato"
        open={shouldShowCancelDialog}
        onClose={handleCloseDialog}
        onDiscard={handleDiscardForm}
        type="create"
      />

      <FormConfirmDialog
        open={showConfirmDialog}
        onClose={handleCloseDialog}
        onSave={handleSubmit(onSubmitHandler)}
      />

      <DistributorCreateFormDialog
        open={shouldShowDistributorFormDialog}
        onClose={handleCloseDistributorFormDialog}
      />
    </Fragment>
  );
};

export default ConsumerUnitRenewContractForm;
