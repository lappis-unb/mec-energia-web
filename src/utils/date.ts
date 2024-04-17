import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

export const monthYearForPlot = (date: string) => {
  const formatted = format(parseISO(date), "MMMM'-'yyyy", { locale: ptBR });
  const [month, year] = formatted.split("-");
  // MMM retorna o nome do mês com todas as letras em minúsculo. Capitalize
  // a 1ª letra:
  const monthFirstLetter = month[0].toUpperCase();
  return [monthFirstLetter + month.slice(1, 3), year];
};


export const monthYear = (date: string) => {
  const d = parseISO(date);
  const shortMonth = d.toLocaleString("pt-br", { month: "short" });
  const month =
    shortMonth[0].toUpperCase() + shortMonth.slice(1).replace(".", "");
  const year = d.toLocaleString("pt-br", { year: "numeric" });
  return `${month} ${year}`;
};

export const getFormattedDate = (stringDate: string) => {
  if (!stringDate)
    return null;
  
  return format(parseISO(stringDate), "dd/MM/yyyy");
};

/**
 * @param stringDate Data no padrão yyyy-MM-dd (ano-mês-dia)
 * @returns Data interpretada corretamente, sem depender do fuso horário local.
 */
export const getFormattedDateUTC = (stringDate: string) => {
  if (!stringDate)
    return null;

  const day = Number(stringDate.slice(8, 10));
  const month = (Number(stringDate.slice(5, 7)) - 1); // O mês começa em zero: 0 - Janeiro ... 11 - Dezembro
  const year = Number(stringDate.slice(0, 4));

  return new Date(year, month, day);
};

export const getFormattedDateAndTime = (stringDate: string) => {
  return format(parseISO(stringDate), "dd/MM/YYY hh'h'mm");

};

export const sendFormattedDate = (stringDate: Date) => {
  return format(stringDate, "yyyy-MM-dd");
};
