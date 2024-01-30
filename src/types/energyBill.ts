export interface CreateAndEditEnergyBillForm {
  date: Date;
  invoiceInReais?: string;
  isIncludedInAnalysis: boolean;
  peakMeasuredDemandInKw?: number | "";
  offPeakMeasuredDemandInKw?: number | "";
  peakConsumptionInKwh?: number | "";
  offPeakConsumptionInKwh?: number | "";
  annotations?: string;
  address?: string;
}

export interface PostEnergyBillRequestPayload {
  date: string;
  invoiceInReais?: number;
  isAtypical: boolean;
  peakMeasuredDemandInKw?: number;
  offPeakMeasuredDemandInKw: number;
  peakConsumptionInKwh?: number;
  offPeakConsumptionInKwh?: number;
  contract: number;
  consumerUnit: number;
}
export interface EditEnergyBillRequestPayload {
  id: number;
  date: string;
  invoiceInReais?: number;
  isAtypical: boolean;
  peakMeasuredDemandInKw?: number;
  offPeakMeasuredDemandInKw: number;
  peakConsumptionInKwh?: number;
  offPeakConsumptionInKwh?: number;
  contract: number;
  consumerUnit: number;
}

export interface PostEnergyBillResponsePayload {
  id: number;
  date: Date;
  invoiceInReais: number;
  isAtypical: boolean;
  peakConsumptionInKwh: number;
  offPeakConsumptionInKwh: number;
  peakMeasuredDemandInKw: number;
  offPeakMeasuredDemandInKw: number;
  contract: string;
  consumerUnit: string;
}

export interface EditEnergyBillResponsePayload {
  id: number;
  date: Date;
  invoiceInReais: number;
  isAtypical: boolean;
  peakConsumptionInKwh: number;
  offPeakConsumptionInKwh: number;
  peakMeasuredDemandInKw: number;
  offPeakMeasuredDemandInKw: number;
  contract: string;
  consumerUnit: string;
}

export interface CurrentEnergyBillResponsePayload {
  id: number;
  contract: number;
  consumerUnit: number;
  date: Date;
  invoiceInReais: number;
  isAtypical: boolean;
  peakConsumptionInKwh: number;
  offPeakConsumptionInKwh: number;
  peakMeasuredDemandInKw: number;
  offPeakMeasuredDemandInKw: number;
}
