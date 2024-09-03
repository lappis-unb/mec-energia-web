import { EditConsumerUnitForm } from "@/types/consumerUnit";
import { Subgroup } from "@/types/subgroups";

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

export const validatePassword = (password: string) => {
  return {
    hasLetter: /[a-zA-Z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    minLength: password.length >= 8,
  };
};
