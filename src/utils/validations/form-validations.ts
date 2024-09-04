import { EditConsumerUnitForm } from "@/types/consumerUnit";
import { Subgroup } from "@/types/subgroups";
import { isAfter, isFuture, isValid } from "date-fns";

export const isInSomeSubgroups = (
  supplied: EditConsumerUnitForm["supplyVoltage"],
  subgroups: Subgroup[]
) => {
  if (!subgroups) return true;
  const isValidValue = subgroups?.some(
    (subgroup: Subgroup) => supplied >= subgroup.min && supplied <= subgroup.max
  );
  const isGreaterMax = supplied >= subgroups[subgroups?.length - 1].min;
  if (!isValidValue && !isGreaterMax) {
    return "Insira um valor conforme os intervalos ao lado";
  }
  return true;
};

export const isValidEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return "Insira um e-mail válido";
  return true;
};

export const isValidDate = (date: Date | null) => {
  if (!date || !isValid(date)) {
    return "Insira uma data válida no formato dd/mm/aaaa";
  }

  if (isFuture(date)) {
    return "Datas futuras não são permitidas";
  }

  if (!isAfter(date, new Date("2010"))) {
    return "Datas antes de 2010 não são permitidas";
  }

  return true;
};
