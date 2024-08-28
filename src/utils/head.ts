export const getHeadTitle = (title?: string) => {
  if (!title) {
    return "MEPA - Monitoramento de Energia em Plataforma Aberta";
  }

  return (
    title.trim() + " | MEPA - Monitoramento de Energia em Plataforma Aberta"
  );
};
