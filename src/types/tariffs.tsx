export interface SubGroup {
  subgroup: string;
  pending?: boolean;
}

export interface Tariff {
  startDate: string;
  endDate: string;
  subgroup: string;
  distributor: number;
  overdue: boolean;
  blue: Blue;
  green: Green;
}

export interface GetTariffRequestPayload {
  subgroup: string;
  distributor: number;
}

export interface CreateTariffRequestPayload {
  startDate: string;
  endDate: string;
  subgroup: string;
  distributor: number;
  blue: Blue;
  green: Green;
}
export interface CreateTariffResponsePayload {
  startDate: string;
  endDate: string;
  subgroup: string;
  distributor: number;
  blue: Blue;
  green: Green;
}

export type EditTariffResponsePayload = CreateTariffResponsePayload;

export type EditTariffRequestPayload = CreateTariffResponsePayload;

export interface CreateAndEditTariffForm {
  startDate: Date;
  endDate: Date;
  blue: Blue;
  green: Green;
}

export type TariffFlag = "G" | "B";

export interface Blue {
  peakTusdInReaisPerKw?: number | "";
  peakTusdInReaisPerMwh?: number | "";
  peakTeInReaisPerMwh?: number | "";
  offPeakTusdInReaisPerKw?: number | "";
  offPeakTusdInReaisPerMwh?: number | "";
  offPeakTeInReaisPerMwh?: number | "";
}

export interface Green {
  peakTusdInReaisPerMwh?: number | "";
  peakTeInReaisPerMwh?: number | "";
  offPeakTusdInReaisPerMwh?: number | "";
  offPeakTeInReaisPerMwh?: number | "";
  naTusdInReaisPerKw?: number | "";
}
