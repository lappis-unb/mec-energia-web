import { CreateConsumerUnitForm } from "@/types/consumerUnit";

export const isValueGreaterThenZero = (
  value:
    | CreateConsumerUnitForm["peakContractedDemandInKw"]
    | CreateConsumerUnitForm["offPeakContractedDemandInKw"]
) => {
  if (value <= 0) return "Insira um valor maior que 0";
};
