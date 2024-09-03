// funcoes de validacao

export const hasEnoughCaracteresLength = (value: string): string | true => {
  if (value.length < 3) return "Insira ao menos 3 caracteres";
  if (value.length > 45) return "O máximo permitido é 45 caracteres";
  return true;
};

export const hasConsecutiveSpaces = (value: string): string | true => {
  if (/\s{2,}/.test(value)) return "Não são permitidos espaços consecutivos";
  return true;
};

//funcoes de formatacao

export const formatCnpj = (value: string): string => {
  // Remove any non-digit characters and format CNPJ
  const digits = value.replace(/\D/g, "");
  return digits.length === 14 ? digits : "";
};

export const removeLeadingSpaces = (value: string): string => {
  return value.replace(/^\s+/, '');
};