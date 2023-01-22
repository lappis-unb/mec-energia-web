import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import TungstenRoundedIcon from "@mui/icons-material/TungstenRounded";
import FactoryRoundedIcon from "@mui/icons-material/FactoryRounded";

import {
  AppState,
  ConsumerUnitFilter,
  ConsumerUnitInvoiceFilter,
  ConsumerUnitTab,
  DashboardFilter,
  EnergyBillEdiFormParams,
  NotificationProps,
  RootState,
  STORE_HYDRATE,
} from "@/types/app";
import { InvoiceDataGridRow } from "@/types/consumerUnit";
import { Tariff } from "@/types/tariffs";
import { Routes } from "@/types/router";

const initialState: AppState = {
  isDrawerOpen: true,
  dashboard: {
    activeFilter: "all",
  },
  consumerUnit: {
    activeId: null,
    isCreateFormOpen: false,
    isEditFormOpen: false,
    isRenewContractFormOpen: false,
    activeFilter: "all",
    openedTab: ConsumerUnitTab.INVOICE,
    invoice: {
      activeFilter: "pending",
      dataGridRows: [],
    },
  },
  distributor: {
    activeId: 10,
    isCreateFormOpen: false,
    isEditFormOpen: true,
  },
  tariff: {
    isCreateFormOpen: false,
    isEditFormOpen: false,
    currentTariff: {
      distributor: 1,
      blue: {
        offPeakTeInReaisPerMwh: 0,
        offPeakTusdInReaisPerKw: 0,
        offPeakTusdInReaisPerMwh: 0,
        peakTeInReaisPerMwh: 0,
        peakTusdInReaisPerKw: 0,
        peakTusdInReaisPerMwh: 8,
      },
      endDate: "2010-1-1",
      overdue: false,
      startDate: "2010-1-1",
      subgroup: "A0",
      green: {
        naTusdInReaisPerKw: 9,
        offPeakTeInReaisPerMwh: 2,
        offPeakTusdInReaisPerMwh: 8,
        peakTeInReaisPerMwh: 6,
        peakTusdInReaisPerMwh: 9,
      },
    },
  },
  energyBill: {
    isCreateFormOpen: false,
    isEditFormOpen: false,
    params: {
      month: 0,
      year: 0,
    },
  },
  notifications: {
    sucess: {
      isOpen: false,
      text: "",
    },
    error: {
      isOpen: false,
      text: "",
    },
  },
};

export const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    // App
    setIsDrawerOpen: (state, action: PayloadAction<boolean>) => {
      state.isDrawerOpen = action.payload;
    },

    // Dashboard
    setDashboardActiveFilter: (
      state,
      action: PayloadAction<DashboardFilter>
    ) => {
      state.dashboard.activeFilter = action.payload;
    },

    // Consumer unit
    setActiveConsumerUnitId: (
      state,
      action: PayloadAction<AppState["consumerUnit"]["activeId"]>
    ) => {
      state.consumerUnit.activeId = action.payload;
    },
    setConsumerUnitActiveFilter: (
      state,
      action: PayloadAction<ConsumerUnitFilter>
    ) => {
      state.consumerUnit.activeFilter = action.payload;
    },
    setConsumerUnitInvoiceActiveFilter: (
      state,
      action: PayloadAction<ConsumerUnitInvoiceFilter>
    ) => {
      state.consumerUnit.invoice.activeFilter = action.payload;
    },
    setConsumerUnitInvoiceDataGridRows: (
      state,
      action: PayloadAction<InvoiceDataGridRow[]>
    ) => {
      state.consumerUnit.invoice.dataGridRows = action.payload;
    },
    setConsumerUnitOpenedTab: (
      state,
      action: PayloadAction<ConsumerUnitTab>
    ) => {
      state.consumerUnit.openedTab = action.payload;
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
    setActiveDistributorId: (
      state,
      action: PayloadAction<AppState["distributor"]["activeId"]>
    ) => {
      state.distributor.activeId = action.payload;
    },
    setIsDistributorCreateFormOpen: (state, action: PayloadAction<boolean>) => {
      state.distributor.isCreateFormOpen = action.payload;
    },
    setIsDistributorEditFormOpen: (state, action: PayloadAction<boolean>) => {
      state.distributor.isEditFormOpen = action.payload;
    },
    setIsTariffCreateFormOpen: (state, action: PayloadAction<boolean>) => {
      state.tariff.isCreateFormOpen = action.payload;
      if (action.payload) {
        state.tariff.isEditFormOpen = !action.payload;
      }
    },
    setIsTariffEdiFormOpen: (state, action: PayloadAction<boolean>) => {
      state.tariff.isEditFormOpen = action.payload;
      if (action.payload) {
        state.tariff.isCreateFormOpen = !action.payload;
      }
    },
    setCurrenTariff: (state, action: PayloadAction<Tariff>) => {
      state.tariff.currentTariff = action.payload;
    },
    setIsEnergyBillCreateFormOpen: (state, action: PayloadAction<boolean>) => {
      state.energyBill.isCreateFormOpen = action.payload;
      if (action.payload) {
        state.energyBill.isEditFormOpen = !action.payload;
      }
    },
    setIsEnergyBillEdiFormOpen: (state, action: PayloadAction<boolean>) => {
      state.energyBill.isEditFormOpen = action.payload;
      if (action.payload) {
        state.energyBill.isCreateFormOpen = !action.payload;
      }
    },
    setEnergyBillEdiFormParams: (
      state,
      action: PayloadAction<EnergyBillEdiFormParams>
    ) => {
      state.energyBill.params = action.payload;
    },
    setIsSucessNotificationOpen: (
      state,
      action: PayloadAction<NotificationProps>
    ) => {
      state.notifications.sucess = action.payload;
    },
    setIsErrorNotificationOpen: (
      state,
      action: PayloadAction<NotificationProps>
    ) => {
      state.notifications.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(STORE_HYDRATE, (state, action) => {
      state.consumerUnit.activeId = action.payload.app.consumerUnit.activeId;

      return state;
    });
  },
});

export default appSlice.reducer;

export const {
  setIsDrawerOpen,

  setDashboardActiveFilter,

  setActiveConsumerUnitId,
  setConsumerUnitActiveFilter,
  setConsumerUnitInvoiceActiveFilter,
  setConsumerUnitInvoiceDataGridRows,
  setConsumerUnitOpenedTab,
  setIsConsumerUnitCreateFormOpen,
  setIsConsumerUnitEditFormOpen,
  setIsConsumerUnitRenewContractFormOpen,

  setActiveDistributorId,
  setIsDistributorCreateFormOpen,
  setIsDistributorEditFormOpen,
  setIsTariffCreateFormOpen,
  setIsTariffEdiFormOpen,
  setCurrenTariff,
  setIsEnergyBillCreateFormOpen,
  setIsEnergyBillEdiFormOpen,
  setEnergyBillEdiFormParams,
  setIsSucessNotificationOpen,
  setIsErrorNotificationOpen,
} = appSlice.actions;

// App
export const selectIsDrawerOpen = (state: RootState) => {
  return state.app.isDrawerOpen;
};

export const selectRoutes = (state: RootState) => {
  const {
    consumerUnit: { activeId },
  } = state.app;

  const routes: Routes = {
    "/": {
      title: "Painel",
      Icon: DashboardRoundedIcon,
      href: "/",
    },
    "/uc/[id]": {
      title: "Unidades Consumidoras",
      Icon: TungstenRoundedIcon,
      ...(activeId && { href: `/uc/${activeId}` }),
    },
    "/distribuidoras/[id]": {
      title: "Distribuidoras",
      Icon: FactoryRoundedIcon,
      href: "/distribuidoras/1",
    },
  };

  return routes;
};

// Dashboard
export const selectDashboardActiveFilter = (state: RootState) => {
  return state.app.dashboard.activeFilter;
};

// Consumer unit
export const selectActiveConsumerUnitId = (state: RootState) => {
  return state.app.consumerUnit.activeId;
};

export const selectConsumerUnitActiveFilter = (state: RootState) => {
  return state.app.consumerUnit.activeFilter;
};

export const selectConsumerUnitInvoiceActiveFilter = (state: RootState) => {
  return state.app.consumerUnit.invoice.activeFilter;
};

export const selectConsumerUnitInvoiceDataGridRows = (state: RootState) => {
  return state.app.consumerUnit.invoice.dataGridRows;
};

export const selectConsumerUnitOpenedTab = (state: RootState) => {
  return state.app.consumerUnit.openedTab;
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

export const selectActiveDistributorId = (state: RootState) => {
  return state.app.distributor.activeId;
};

export const selectIsDistributorCreateFormOpen = (state: RootState) => {
  return state.app.distributor.isCreateFormOpen;
};

export const selectIsDistributorEditFormOpen = (state: RootState) => {
  return state.app.distributor.isEditFormOpen;
};

export const selectIsTariffCreateFormOpen = (state: RootState) => {
  return state.app.tariff.isCreateFormOpen;
};

export const selectIsTariffEditFormOpen = (state: RootState) => {
  return state.app.tariff.isEditFormOpen;
};
export const selectCurrentTariff = (state: RootState) => {
  return state.app.tariff.currentTariff;
};

export const selectIsEnergyBillCreateFormOpen = (state: RootState) => {
  return state.app.energyBill.isCreateFormOpen;
};

export const selectIsEnergyBillEditFormOpen = (state: RootState) => {
  return state.app.energyBill.isEditFormOpen;
};

export const selectEnergyBillParams = (state: RootState) => {
  return state.app.energyBill.params;
};

export const selectSucessNotification = (state: RootState) => {
  return state.app.notifications.sucess;
};

export const selectErrorNotification = (state: RootState) => {
  return state.app.notifications.error;
};
