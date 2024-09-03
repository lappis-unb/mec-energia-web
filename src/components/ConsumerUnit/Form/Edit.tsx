import React, { Fragment, useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SubmitHandler, useForm } from "react-hook-form";
import { useSession } from "next-auth/react";
import {
  useEditConsumerUnitMutation,
  useGetConsumerUnitQuery,
  useGetContractQuery,
} from "@/api";
import {
  selectIsConsumerUnitEditFormOpen,
  setIsConsumerUnitEditFormOpen,
  selectActiveConsumerUnitId,
  setIsSuccessNotificationOpen,
  setIsErrorNotificationOpen,
} from "@/store/appSlice";
import {
  EditConsumerUnitForm,
  EditConsumerUnitRequestPayload,
} from "@/types/consumerUnit";
import { skipToken } from "@reduxjs/toolkit/query";
import FormWarningDialog from "@/components/ConsumerUnit/Form/WarningDialog";
import DistributorCreateFormDialog from "@/components/Distributor/Form/CreateForm";
import FormDrawerV2 from "@/components/Form/DrawerV2";
import ConsumerUnitSection from "../CardsFormsSection/ConsumerUnitSection";
import ContractSection from "../CardsFormsSection/ContractSection";
import ContractedDemandSection from "../CardsFormsSection/ContractedDemandSection";
import InstalledPower from "../CardsFormsSection/InstalledPower";
import { sendFormattedDate } from "@/utils/date";

const defaultValues: EditConsumerUnitForm = {
  isActive: true,
  name: "",
  code: "",
  distributor: "",
  startDate: new Date(),
  supplyVoltage: "",
  tariffFlag: "B",
  peakContractedDemandInKw: "",
  offPeakContractedDemandInKw: "",
  totalInstalledPower: null,
  shouldShowInstalledPower: true,
};

const ConsumerUnitEditForm = () => {
  const dispatch = useDispatch();
  const isEditFormOpen = useSelector(selectIsConsumerUnitEditFormOpen);
  const activeConsumerUnit = useSelector(selectActiveConsumerUnitId);
  const [shouldShowDistributorFormDialog, setShouldShowDistributorFormDialog] =
    useState(false);
  const [shouldShowCancelDialog, setShouldShowCancelDialog] = useState(false);
  const [shouldShowGreenDemand, setShouldShowGreenDemand] = useState(true);

  const { data: session } = useSession();

  const { data: contract } = useGetContractQuery(
    activeConsumerUnit || skipToken
  );
  const { data: consumerUnit, refetch: refetchConsumerUnit } =
    useGetConsumerUnitQuery(activeConsumerUnit || skipToken);
  const [
    editConsumerUnit,
    { isError, isSuccess, isLoading, reset: resetMutation },
  ] = useEditConsumerUnitMutation();

  const form = useForm({ mode: "all", defaultValues });
  const {
    control,
    reset,
    handleSubmit,
    watch,
    setValue,
    formState: { isDirty, errors },
  } = form;

  const supplyVoltage = watch("supplyVoltage");
  const peakContractedDemandInKw = watch("peakContractedDemandInKw");
  const offPeakContractedDemandInKw = watch("offPeakContractedDemandInKw");
  const isActive = watch("isActive");

  useEffect(() => {
    if (isEditFormOpen && consumerUnit && contract) {
      const fetchData = async () => {
        try {
          const { data: consumerUnit } = await refetchConsumerUnit();

          if (!consumerUnit || !contract) {
            return;
          }

          reset({
            name: consumerUnit?.name ?? "",
            isActive: true,
            code: consumerUnit?.code ?? "",
            distributor: contract?.distributor,
            supplyVoltage: contract?.supplyVoltage,
            shouldShowInstalledPower: consumerUnit?.totalInstalledPower != null,
            totalInstalledPower: consumerUnit?.totalInstalledPower,
            peakContractedDemandInKw: contract?.peakContractedDemandInKw,
            offPeakContractedDemandInKw: contract?.offPeakContractedDemandInKw,
            startDate: new Date(contract?.startDate).setDate(
              new Date(contract?.startDate).getDate() + 1
            ),
            tariffFlag: contract?.tariffFlag ?? "B",
          });

          setShouldShowGreenDemand(
            !(
              contract?.supplyVoltage === 69 ||
              (contract?.supplyVoltage >= 88 && contract?.supplyVoltage <= 138)
            )
          );
        } catch (err) {
          console.error("Failed to refetch:", err);
        }
      };

      if (isEditFormOpen) {
        fetchData();
      }
    }
  }, [isEditFormOpen, consumerUnit, contract, refetchConsumerUnit, reset]);

  useEffect(() => {
    setValue("isActive", isActive);
    setValue("supplyVoltage", supplyVoltage ?? "");
    setValue("peakContractedDemandInKw", peakContractedDemandInKw ?? "");
    setValue("offPeakContractedDemandInKw", offPeakContractedDemandInKw ?? "");
  }, [
    isActive,
    offPeakContractedDemandInKw,
    peakContractedDemandInKw,
    setValue,
    supplyVoltage,
  ]);

  useEffect(() => {
    if (!shouldShowGreenDemand) {
      setValue("tariffFlag", "B");
    }
  }, [shouldShowGreenDemand]);

  useEffect(() => {
    setValue("tariffFlag", contract?.tariffFlag ?? "B");
  }, [isEditFormOpen]);

  const handleCloseDialog = useCallback(
    () => setShouldShowCancelDialog(false),
    []
  );

  const handleDiscardForm = useCallback(() => {
    handleCloseDialog();
    reset(defaultValues);
    dispatch(setIsConsumerUnitEditFormOpen(false));
  }, [dispatch, handleCloseDialog, reset]);

  const handleCancelEdition = useCallback(() => {
    if (isDirty) {
      setShouldShowCancelDialog(true);
      return;
    }
    handleDiscardForm();
  }, [handleDiscardForm, isDirty]);

  const onSubmitHandler: SubmitHandler<EditConsumerUnitForm> = useCallback(
    async (data) => {
      if (data.tariffFlag === "G") {
        data.offPeakContractedDemandInKw = data.peakContractedDemandInKw;
      }
      const body: EditConsumerUnitRequestPayload = {
        consumerUnit: {
          consumerUnitId: activeConsumerUnit as number,
          name: data.name,
          code: data.code,
          isActive: data.isActive,
          university: session?.user.universityId || 0,
          totalInstalledPower: !data.shouldShowInstalledPower
            ? null
            : data.totalInstalledPower,
        },
        contract: {
          contractId: contract?.id as number,
          startDate: data.startDate ? sendFormattedDate(data.startDate) : "",
          tariffFlag: data.tariffFlag,
          peakContractedDemandInKw: data.peakContractedDemandInKw as number,
          offPeakContractedDemandInKw:
            data.offPeakContractedDemandInKw as number,
          supplyVoltage: data.supplyVoltage as number,
          distributor: data.distributor as number,
        },
      };
      await editConsumerUnit(body);
    },
    [
      activeConsumerUnit,
      contract?.id,
      editConsumerUnit,
      session?.user.universityId,
    ]
  );

  const handleNotification = useCallback(() => {
    if (isSuccess) {
      dispatch(
        setIsSuccessNotificationOpen({
          isOpen: true,
          text: "Unidade consumidora modificada com sucesso!",
        })
      );
      reset();
      resetMutation();
      dispatch(setIsConsumerUnitEditFormOpen(false));
    } else if (isError) {
      dispatch(
        setIsErrorNotificationOpen({
          isOpen: true,
          text: "Erro ao editar unidade consumidora. Verifique se já existe uma unidade com o mesmo nome ou código",
        })
      );
      resetMutation();
    }
  }, [dispatch, isError, isSuccess, reset, resetMutation]);

  useEffect(() => handleNotification(), [handleNotification]);

  const handleCloseDistributorFormDialog = () =>
    setShouldShowDistributorFormDialog(false);

  return (
    <Fragment>
      <FormDrawerV2
        open={isEditFormOpen}
        title={"Editar Unidade Consumidora"}
        errorsLength={Object.keys(errors).length}
        isLoading={isLoading}
        handleCloseDrawer={handleCancelEdition}
        handleSubmitDrawer={handleSubmit(onSubmitHandler)}
        sections={[
          <ConsumerUnitSection key="consumer-unit" control={control} />,
          <ContractSection
            key="contract"
            control={control}
            setShouldShowDistributorFormDialog={
              setShouldShowDistributorFormDialog
            }
            setShouldShowGreenDemand={setShouldShowGreenDemand}
            session={session}
          />,
          <ContractedDemandSection
            key="contracted-demand"
            control={control}
            shouldShowGreenDemand={shouldShowGreenDemand}
          />,
          <InstalledPower key="installed-power" control={control} />,
        ]}
      />
      {shouldShowCancelDialog && (
        <FormWarningDialog
          open={shouldShowCancelDialog}
          onClose={handleCloseDialog}
          onDiscard={handleDiscardForm}
        />
      )}
      {shouldShowDistributorFormDialog && (
        <DistributorCreateFormDialog
          open={shouldShowDistributorFormDialog}
          onClose={handleCloseDistributorFormDialog}
          handleSave={() => setShouldShowDistributorFormDialog(false)}
        />
      )}
    </Fragment>
  );
};

export default ConsumerUnitEditForm;
