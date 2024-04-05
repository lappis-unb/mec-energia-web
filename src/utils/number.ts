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

export const formatToPtBrCurrency = (n: number | null, defaultOutput = 0) => {
  if (n == null) 
    return defaultOutput;
  return Number(n).toLocaleString('pt-BR', { maximumFractionDigits: 2 });
};
