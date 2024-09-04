import { RenewContractForm } from "@/types/contract";

export const hasEnoughCaracteresLength = (value: RenewContractForm["code"]) => {
  if (value.length < 3) return "Insira ao menos 3 caracteres";
  return true;
};
