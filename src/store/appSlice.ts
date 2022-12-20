import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { AppState, DashboardFilter, RootState } from "@/types/app";

const initialState: AppState = {
  isDrawerOpen: true,
  dashboard: {
    activeFilter: "all",
  },
  consumerUnit: {
    isCreateFormOpen: false,
    isEditFormOpen: false,
    isRenewContractFormOpen: false,
  },
};

export const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setIsDrawerOpen: (state, action: PayloadAction<boolean>) => {
      state.isDrawerOpen = action.payload;
    },
    setDashboardActiveFilter: (
      state,
      action: PayloadAction<DashboardFilter>
    ) => {
      state.dashboard.activeFilter = action.payload;
    },
    setIsConsumerUnitCreateFormOpen: (
      state,
      action: PayloadAction<boolean>
    ) => {
      state.consumerUnit.isCreateFormOpen = action.payload;
    },
    setIsConsumerUnitEditFormOpen: (state, action: PayloadAction<boolean>) => {
      state.consumerUnit.isEditFormOpen = action.payload;
    },
    setIsConsumerUnitRenewContractFormOpen: (
      state,
      action: PayloadAction<boolean>
    ) => {
      state.consumerUnit.isRenewContractFormOpen = action.payload;
    },
  },
});

export default appSlice.reducer;

export const {
  setIsDrawerOpen,
  setDashboardActiveFilter,
  setIsConsumerUnitCreateFormOpen,
  setIsConsumerUnitEditFormOpen,
  setIsConsumerUnitRenewContractFormOpen,
} = appSlice.actions;

export const selectIsDrawerOpen = (state: RootState) => {
  return state.app.isDrawerOpen;
};

export const selectDashboardActiveFilter = (state: RootState) => {
  return state.app.dashboard.activeFilter;
};

export const selectIsConsumerUnitCreateFormOpen = (state: RootState) => {
  return state.app.consumerUnit.isCreateFormOpen;
};

export const selectIsConsumerUnitEditFormOpen = (state: RootState) => {
  return state.app.consumerUnit.isEditFormOpen;
};

export const selectIsConsumerUnitRenewContractFormOpen = (state: RootState) => {
  return state.app.consumerUnit.isRenewContractFormOpen;
};
