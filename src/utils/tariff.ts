import { TariffFlag } from "@/types/tariffs";
import { ValidationRule } from "react-hook-form";

/**
 * Essa solução é **mais** restritiva que usar Map. Só podem ser indexados
 * G ou B.
 */
export const tariffFlags = {
  G: "Verde",
  B: "Azul",
} as const;

/**
 * Em forma de função poderia ficar assim. `getTariffFlagLabel` apenas aceita
 * as strings que são campos de `tariffFlags.`
 */
export const getTariffFlagLabel = (flag: keyof typeof tariffFlags) =>
  tariffFlags[flag]

const tariffFlagMap = new Map([
  ["B", "Azul"],
  ["G", "Verde"],
]);

export const getTariffFlagName = (tariffFlag: TariffFlag) => {
  return tariffFlagMap.get(tariffFlag);
};

/**
 * @description A demanda contratada deve ser de no mínimo 30kW.
 * @link https://gitlab.com/lappis-unb/projetos-energia/mec-energia/mec-energia-web/-/issues/396
 */
export const minimumDemand: ValidationRule<string | number> | undefined = {
  value: 30,
  message: "Insira um valor maior ou igual a 30",
};
