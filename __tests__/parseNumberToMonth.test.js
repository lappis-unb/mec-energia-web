import {parseNumberToMonth} from "../src/utils/parseNumberToMonth"

describe('parseNumberToMonth', () => {
  it('deve retornar o nome do mês correto para índices válidos', () => {
    expect(parseNumberToMonth(0)).toBe("Janeiro");
    expect(parseNumberToMonth(1)).toBe("Fevereiro");
    expect(parseNumberToMonth(2)).toBe("Março");
    expect(parseNumberToMonth(3)).toBe("Abril");
    expect(parseNumberToMonth(4)).toBe("Maio");
    expect(parseNumberToMonth(5)).toBe("Junho");
    expect(parseNumberToMonth(6)).toBe("Julho");
    expect(parseNumberToMonth(7)).toBe("Agosto");
    expect(parseNumberToMonth(8)).toBe("Setembro");
    expect(parseNumberToMonth(9)).toBe("Outubro");
    expect(parseNumberToMonth(10)).toBe("Novembro");
    expect(parseNumberToMonth(11)).toBe("Dezembro");
  });
});