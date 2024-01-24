import { ConsumerUnitInvoiceFilter } from "./app";
import { TariffFlag } from "./supplier";

export interface CreateConsumerUnitForm {
  name: string;
  code: string;
  distributor: number | "";
  startDate: Date | null;
  supplyVoltage: number | "";
  tariffFlag: TariffFlag;
  contracted: number | "";
  peakContractedDemandInKw: number | "";
  offPeakContractedDemandInKw: number | "";
}

export interface EditConsumerUnitForm {
  name: string;
  code: string;
  isActive: boolean;
  startDate: Date | null;
  tariffFlag: TariffFlag;
  peakContractedDemandInKw: number | "";
  offPeakContractedDemandInKw: number | "";
  supplyVoltage: number | "";
  distributor: number | "";
}

export type ConsumerUnit = {
  id: number;
  name: string;
  code: string;
  isActive: boolean;
  isFavorite: boolean;
  isCurrentEnergyBillFilled: boolean;
  pendingEnergyBillsNumber: number;
};

export type ConsumerUnitsPayload = ConsumerUnit[];

export interface ConsumerUnitRequestPayload {
  name: string;
  code: string;
  isActive: boolean;
  university: number;
}

export interface ConsumerUnitRequestPayloadEdit {
  consumerUnitId: number;
  name: string;
  code: string;
  isActive: boolean;
  university: number;
}

export interface ContractRequestPayload {
  startDate: string;
  tariffFlag: string;
  peakContractedDemandInKw: number;
  offPeakContractedDemandInKw: number;
  supplyVoltage: number;
  distributor: number;
}

export interface EditContractRequestPayload {
  contractId: number;
  startDate: string;
  tariffFlag: string;
  peakContractedDemandInKw: number;
  offPeakContractedDemandInKw: number;
  supplyVoltage: number;
  distributor: number;
}

export interface CreateConsumerUnitRequestPayload {
  consumerUnit: ConsumerUnitRequestPayload;
  contract: ContractRequestPayload;
}

export interface EditConsumerUnitRequestPayload {
  consumerUnit: ConsumerUnitRequestPayloadEdit;
  contract: EditContractRequestPayload;
}

export type EnergyBill = {
  id: number;
  date: string;
  invoiceInReais: number;
  isAtypical: boolean;
  peakConsumptionInKwh: number;
  offPeakConsumptionInKwh: number;
  offPeakContractedDemandInKw: number;
  peakMeasuredDemandInKw: number;
  offPeakMeasuredDemandInKw: number;
};

export type InvoicePayload = {
  month: number;
  year: number;
  isEnergyBillPending: boolean;
  energyBill: EnergyBill | null;
};

export type InvoicesPayload = {
  [year: string]: InvoicePayload[];
};

export type InvoiceDataGridRow = {
  id: number;
  month: number;
  year: number;

  isEnergyBillPending: boolean;
  activeFilter: ConsumerUnitInvoiceFilter;

  energyBillId?: number;
  date?: string;
  invoiceInReais?: string;
  isAtypical?: boolean;
  peakConsumptionInKwh?: string;
  offPeakConsumptionInKwh?: string;
  offPeakContractedDemandInKw?: number;
  peakMeasuredDemandInKw?: string;
  offPeakMeasuredDemandInKw?: string;
};
