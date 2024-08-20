import { TariffFlag } from "./tariffs"

export interface RecommendationSettings {
  MINIMUM_PERCENTAGE_DIFFERENCE_FOR_CONTRACT_RENOVATION: number
  MINIMUM_ENERGY_BILLS_FOR_RECOMMENDATION: number
  IDEAL_ENERGY_BILLS_FOR_RECOMMENDATION: number
}

export interface Recommendation {
  generatedOn: string,
  errors: [[number, string]],
  warnings: [[number, string]],
  dates: string[],
  currentContract: RecommendationContract,
  energyBillsCount: number,
  shouldRenewContract: boolean,
  nominalSavingsPercentage: number,
  consumptionHistoryPlot: {
    peakConsumptionInKwh: number[],
    offPeakConsumptionInKwh: number[],
    peakMeasuredDemandInKw: number[],
    offPeakMeasuredDemandInKw: number[],
    contractPeakDemandInKw?: number[],
    contractOffPeakDemandInKw?: number[],
  }
  consumptionHistoryTable: ConsumptionHistoryTableRow[],
  currentContractCostsPlot: ContractCostsPlot,
  detailedContractsCostsComparisonPlot: DetailedContractCostsComparisonPlot,
  costsComparisonPlot: {
    totalCostInReaisInCurrent: number[],
    totalCostInReaisInRecommended: number[],
    totalTotalCostInReaisInCurrent: number,
    totalTotalCostInReaisInRecommended: number,
  },
  recommendedContract: RecommendationContract,
  tariffDates: {
    startDate: string,
    endDate: string,
  },
  tariffsTable: TariffsTableRow[],
  contractsComparisonTable: ContractComparisonTableRow[],
  contractsComparisonTotals: ContractsComparisonTotals,
  currentTotalCost: number,
}

export interface ContractCostsPlot {
  consumptionCostInReais: number[],
  demandCostInReais: number[],
}

export interface DetailedContractCostsComparisonPlot {
  consumptionCostInReaisInRecommended: number[]
  demandCostInReaisInRecommended: number[]
  totalCostInReaisInCurrent: number[]

}

export interface ConsumptionHistoryTableRow {
  date: string,
  peakConsumptionInKwh: number | null,
  offPeakConsumptionInKwh: number | null,
  peakMeasuredDemandInKw: number | null,
  offPeakMeasuredDemandInKw: number | null,
}

export interface ContractComparisonTableRow {
  date: string
  totalCostInReaisInCurrent: number | null
  demandCostInReaisInCurrent: number | null
  consumptionCostInReaisInCurrent: number | null
  totalCostInReaisInRecommended: number | null
  demandCostInReaisInRecommended: number | null
  consumptionCostInReaisInRecommended: number | null
  absoluteDifference: number | null
}

export interface ContractsComparisonTotals {
  absoluteDifference: number
  consumptionCostInReaisInRecommended: number
  demandCostInReaisInRecommended: number
  totalCostInReaisInRecommended: number
  consumptionCostInReaisInCurrent: number
  demandCostInReaisInCurrent: number
  totalCostInReaisInCurrent: number
}

/**
 * Essa interface deveria ser quase igual ao type `Contract`, mas não é 
 * por design. A diferença é que um objeto `RecommendationContract` vem do endpoint 
 * `api/recommendation/`. Aqui, `Recommendation` se refere à origem desse objeto,
 * ao endpoint mencionado.
 * 
 * Essa interface é usada duas vezes: 
 * - `currentContract: RecommendationContract`
 * - `recommendedContract: RecommendationContract`
 */
export interface RecommendationContract {
  university: string,
  distributor: string,
  consumerUnit: string,
  consumerUnitCode: string,
  supplyVoltage: number,
  tariffFlag: TariffFlag,
  subgroup: string,
  peakDemandInKw: number,
  offPeakDemandInKw: number,
}

export const tariffLabelToPtBr = {
  // Por algum motivo a API não transforma esses campos em camel case
  peak_te_in_reais_per_mwh: 'Tarifa de energia (TE) ponta (R$/MWh)',
  off_peak_te_in_reais_per_mwh: 'Tarifa de energia (TE) fora ponta (R$/MWh)',
  peak_tusd_in_reais_per_mwh: 'Tarifa de uso do sistema de distribuição (TUSD) ponta (R$/MWh)',
  off_peak_tusd_in_reais_per_mwh: 'Tarifa de uso do sistema de distribuição (TUSD) fora ponta (R$/MWh)',
  peak_tusd_in_reais_per_kw: 'Tarifa de uso do sistema de distribuição (TUSD) ponta (R$/kW)',
  off_peak_tusd_in_reais_per_kw: 'Tarifa de uso do sistema de distribuição (TUSD) fora ponta (R$/kW)',
  na_tusd_in_reais_per_kw: 'Tarifa de uso do sistema de distribuição (TUSD) (R$/kW)',
}

export interface TariffsTableRow {
  label: keyof typeof tariffLabelToPtBr
  blue: number | null
  green: number | null
  billingTime: 'Ponta' | 'Fora Ponta' | 'NA'
}