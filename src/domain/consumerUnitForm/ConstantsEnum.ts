export const MINIMUM_DATE = new Date("2010");

const Constants = Object.freeze({
  DateErrorMessages: Object.freeze({
    INVALID: "Insira uma data válida no formato dd/mm/aaaa",
    FUTURE: "Datas futuras não são permitidas",
    BEFORE_MINIMUM: "Datas antes de 2010 não são permitidas",
  }),
  VALUE_ERROR_MESSAGE: "Insira um valor maior que 0",
  MIN_CHARACTER_LENGTH_ERROR:
    "Insira no mínimo 3 caracteres, excluindo espaços em branco.",
  SUCCESS_NOTIFICATION_TEXT: "Unidade consumidora adicionada com sucesso!",
  ERROR_NOTIFICATION_TEXT:
    "Erro ao adicionar unidade consumidora. Verifique se já existe uma unidade com nome ou código.",
});

export default Constants;
