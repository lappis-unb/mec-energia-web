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

/**
 * @param stringDate yyyy-MM-dd HH:mm:ss
 * @returns Data convertida em milissegundos para uma comparação mais precisa
 */
export const getTimeFromDateUTC = (stringDate: string) => {
  const date = new Date(stringDate);

  const day = date.getUTCDate();
  const month = date.getUTCMonth();
  const year = date.getUTCFullYear();

  const hour = date.getUTCHours();
  const minutes = date.getUTCMinutes();
  const seconds = date.getUTCSeconds();

  return new Date(year, month, day, hour, minutes, seconds).getTime();
}

export const sendFormattedDate = (stringDate: Date) => {
  return format(stringDate, "yyyy-MM-dd");
};

export const getMonthFromNumber = (
  month: number,
  year: number,
  shouldCapitalize?: boolean
) => {
  const date = new Date(year, month, 1);
  const monthFullName = format(date, "MMMM", { locale: ptBR });

  if (!shouldCapitalize) {
    return monthFullName;
  }

  return monthFullName.charAt(0).toUpperCase() + monthFullName.slice(1);
};
