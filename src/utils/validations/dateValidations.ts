import { CreateAndEditTariffForm } from "@/types/tariffs";
import { isAfter, isFuture, isValid } from "date-fns";

export const isValidDate = (date: CreateAndEditTariffForm["startDate"]) => {
  if (!date || !isValid(date)) {
    return "Insira uma data válida no formato dd/mm/aaaa.";
  }

  if (isFuture(new Date(date))) {
    return "Insira uma data anterior ou igual a data atual no formato dd/mm/aaaa";
  }

  if (!isAfter(new Date(date), new Date("2010"))) {
    return "Insira uma data a partir de 2010";
  }

  return true;
};

export const isValidEndDate = (
  date: CreateAndEditTariffForm["endDate"],
  startDate: Date
) => {
  if (!date || !isValid(date)) {
    return "Insira uma data válida no formato dd/mm/aaaa.";
  }

  if (!isAfter(new Date(date), startDate)) {
    return "Insira uma data posterior à data de início";
  }

  return true;
};
