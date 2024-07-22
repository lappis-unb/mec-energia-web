import theme from "@/theme";
import { ContractCostsPlot } from "@/types/recommendation";

import { Chart } from "react-chartjs-2";

interface Props {
  dates: string[][];
  currentContractCostsPlot: ContractCostsPlot;
  displayTitle?: boolean;
}

export const CurrentBaseCostPlot = ({
  dates,
  currentContractCostsPlot,
  displayTitle,
}: Props) => {
  return (
    <Chart
      type="bar"
      data={{
        labels: dates,
        datasets: [
          {
            label: "Valor de Demanda",
            data: currentContractCostsPlot.demandCostInReais,
            backgroundColor: theme.palette.graph.baseCostMain,
            pointStyle: "rect",
          },
          {
            label: "Valor de Consumo",
            data: currentContractCostsPlot.consumptionCostInReais,
            backgroundColor: theme.palette.graph.baseCostSecondary,
            pointStyle: "triangle",
          },
        ],
      }}
      options={{
        responsive: true,
        interaction: {
          intersect: false,
          mode: "nearest",
          axis: "x",
        },
        plugins: {
          title: {
            display: displayTitle,
            text: "Custo-base atual",
            font: {
              family: theme.typography.fontFamily,
              size: 16,
            },
          },
          legend: {
            position: "top",
            labels: {
              usePointStyle: true,
            },
          },
          tooltip: {
            usePointStyle: true,
            callbacks: {
              title: function (context) {
                let title = context[0].label || "";
                title = title.replace(",", "/");
                if (context[0].parsed.y == null) {
                  title += " - Indisponível";
                }
                return title;
              },
              label: function (context) {
                if (context.parsed.y == null) {
                  return;
                } else {
                  let label = context.dataset.label || "";
                  label +=
                    ": " +
                    new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(context.parsed.y);
                  return label;
                }
              },
              footer: function (tooltipItems) {
                if (
                  tooltipItems[0].parsed.y == null ||
                  tooltipItems.length <= 1
                ) {
                  return;
                }

                let sum = 0;
                tooltipItems.forEach(function (tooltipItem) {
                  sum += tooltipItem.parsed.y;
                });
                return (
                  "Total: " +
                  new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(sum)
                );
              },
            },
          },
        },
        scales: {
          x: {
            stacked: true,
            grid: {
              display: false,
            },
            ticks: {
              maxRotation: 0,
            },
          },
          y: {
            stacked: true,
            title: {
              display: true,
              text: "R$",
            },
            grid: {
              color: "#C3C3C3",
            },
          },
        },
      }}
    />
  );
};
