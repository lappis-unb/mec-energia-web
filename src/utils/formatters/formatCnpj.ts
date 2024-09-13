export const formatCnpj = (value: string | undefined | null) => {
    if (!value) return '';
  
    return value.substring(0, 14).split('').map((char, index) => {
      if (index === 2 || index === 5) return `.${char}`;
      if (index === 8) return `/${char}`;
      if (index === 12) return `-${char}`;
      return char;
    }).join('');
  }
  