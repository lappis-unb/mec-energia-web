const moneyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export const formatMoney = (money: number) => {
  return moneyFormatter.format(money)
}

const numberFormatter = new Intl.NumberFormat('pt-BR', {
  maximumFractionDigits: 2,
  minimumFractionDigits: 2,
})

export const formatNumber = (n: number | null, defaultOutput = "") => {
  if (n === null)
    return defaultOutput
  return numberFormatter.format(n)
}

export const formatToPtBrCurrency = (
  n: number | null | undefined,
  decimalPlaces = 0,
  defaultOutput = 0
) => {
  if (n === null || n === undefined) {
    return defaultOutput;
  }
  return Number(n).toLocaleString('pt-BR', {
    maximumFractionDigits: 2,
    minimumFractionDigits: decimalPlaces,
  });
};


export const formatNumberConditional = (n: number | null | undefined | "") => {
  if (n === null || n === undefined || n === "") return "";

  const hasNonZeroDecimal = n % 1 !== 0;

  return hasNonZeroDecimal
    ? n.toLocaleString('pt-BR', { maximumFractionDigits: 2, minimumFractionDigits: 2 })
    : n.toLocaleString('pt-BR', { maximumFractionDigits: 0 });
};
