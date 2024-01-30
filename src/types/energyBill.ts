export interface CreateAndEditEnergyBillForm {
  date: Date;
  invoiceInReais?: string;
  isIncludedInAnalysis: boolean;
  peakMeasuredDemandInKw?: number | "";
  offPeakMeasuredDemandInKw?: number | "";
  peakConsumptionInKwh?: number | "";
  offPeakConsumptionInKwh?: number | "";
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
  pdfBase64?: string;
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
  pdfBase64?: string;
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
  pdfBase64?: string;
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
  pdfBase64?: string;
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
  pdfBase64?: string;
}
