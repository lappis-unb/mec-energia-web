import { isValid, isFuture, isAfter } from "date-fns";
import Constants, {
  MINIMUM_DATE,
} from "@/domain/consumerUnitForm/ConstantsEnum";
import { CreateConsumerUnitForm } from "@/types/consumerUnit";

export const isValidDate = (date: CreateConsumerUnitForm["startDate"]) => {
  if (!date || !isValid(date)) {
    return Constants.DateErrorMessages.INVALID;
  }

  if (isFuture(date)) {
    return Constants.DateErrorMessages.FUTURE;
  }

  if (!isAfter(date, MINIMUM_DATE)) {
    return Constants.DateErrorMessages.BEFORE_MINIMUM;
  }

  return true;
};
