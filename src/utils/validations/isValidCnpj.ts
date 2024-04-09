const isValidCnpj = (cnpj: string): boolean => {
  const cnpjClean = cnpj.replace(/[^\d]+/g, ""); // Remove caracteres não numéricos
  if (cnpjClean.length !== 14) return false; // CNPJ deve ter 14 dígitos

  let tamanho = cnpjClean.length - 2;
  let numeros = cnpjClean.substring(0, tamanho);
  const digitos = cnpjClean.substring(tamanho);
  let soma = 0;
  let pos = tamanho - 7;

  for (let i = tamanho; i >= 1; i--) {
    soma += +numeros.charAt(tamanho - i) * pos--;
    if (pos < 2) pos = 9;
  }

  let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
  if (resultado !== +digitos.charAt(0)) return false;

  tamanho += 1;
  numeros = cnpjClean.substring(0, tamanho);
  soma = 0;
  pos = tamanho - 7;

  for (let i = tamanho; i >= 1; i--) {
    soma += +numeros.charAt(tamanho - i) * pos--;
    if (pos < 2) pos = 9;
  }

  resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
  if (resultado !== +digitos.charAt(1)) return false;

  return true;
};

export default isValidCnpj;
