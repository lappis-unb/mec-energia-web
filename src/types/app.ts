import { ComponentType, ReactNode } from "react";
import { createAction } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";
import { makeStore } from "@/store";
import { IconButtonProps, SvgIconProps } from "@mui/material";
import { InvoiceDataGridRow } from "./consumerUnit";

export const STORE_HYDRATE = createAction<RootState>(HYDRATE);

export type DashboardFilter = "all" | "active" | "pending";

export type ConsumerUnitFilter = "all" | "pending";

export enum ConsumerUnitTab {
  INVOICE,
  ANALYSIS,
  CONTRACT,
}

export enum TokenStatus {
  RESET_PASSWORD_INVALID = "reset_password_invalid",
  RESET_PASSWORD = "reset_password",
  FIRST_TIME_CREATION_INVALID = "first_time_creation_invalid",
  FIRST_TIME_CREATION = "first_time_creation"
}

export type ConsumerUnitInvoiceFilter = "pending" | string;

export type AppState = {
  isDrawerOpen: boolean;
  dashboard: {
    activeFilter: DashboardFilter;
  };
  consumerUnit: {
    activeId: number | null;
    isCreateFormOpen: boolean;
    isEditFormOpen: boolean;
    isCsvFormOpen: boolean;
    isRenewContractFormOpen: boolean;
    activeFilter: ConsumerUnitFilter;
    openedTab: ConsumerUnitTab;
    invoice: {
      activeFilter: ConsumerUnitInvoiceFilter;
      dataGridRows: InvoiceDataGridRow[];
    };
  };
  distributor: {
    activeId: number | null;
    activeSubgroup: string | null;
    isCreateFormOpen: boolean;
    isEditFormOpen: boolean;
  };
  tariff: {
    isCreateFormOpen: boolean;
    isEditFormOpen: boolean;
  };
  energyBill: {
    isCreateFormOpen: boolean;
    isEditFormOpen: boolean;
    params: EnergyBillEdiFormParams;
  };
  institution: {
    activeId: number | null;
    isCreateFormOpen: boolean;
    isEditFormOpen: boolean;
  };
  person: {
    activeId: number | null;
    isCreateFormOpen: boolean;
    isEditFormOpen: boolean;
  };
  notifications: {
    success: NotificationProps;
    error: NotificationProps;
  };
  token: {
    status: TokenStatus | null;
    passwordAlreadyCreated: boolean | null;
    userName: string;
  };
};

type Store = ReturnType<typeof makeStore>;
export type RootState = ReturnType<Store["getState"]>;

export type CardWrapperProps = {
  dense?: boolean;
  variant?: "default" | "warning" | "disabled";
  selected?: boolean;
  children?: ReactNode;
  onClick?: () => void;
};

export interface CardProps extends CardWrapperProps {
  name: string;
  isFavorite?: boolean;
  BackgroundIcon?: ComponentType<SvgIconProps>;
  action?: ReactNode;
  actionIcon?: ReactNode;
  onActionIconClick?: IconButtonProps["onClick"];
  onFavoriteButtonClick?: IconButtonProps["onClick"];
  addFavorites?: () => void; 
}

export interface NotificationProps {
  isOpen: boolean;
  text?: string;
}

export interface EnergyBillEdiFormParams {
  month?: number | null;
  year?: number | null;
  id?: number | null;
}
