import theme from "@/theme";
import { Recommendation } from "@/types/recommendation";

import { Chart } from "react-chartjs-2";

interface Props {
  dates: string[][];
  recommendation: Recommendation;
}

export const BaseCostComparisonPlot = ({ dates, recommendation }: Props) => {
  return (
    <Chart
      type="bar"
      data={{
        labels: dates,
        datasets: [
          {
            label: "Consumo + Demanda Atuais",
            data: recommendation?.costsComparisonPlot.totalCostInReaisInCurrent,
            backgroundColor: theme.palette.graph.baseCostMain,
            pointStyle: "rect",
            stack: "Atual",
          },
          {
            label: "Consumo + Demanda propostos",
            data: recommendation?.costsComparisonPlot
              .totalCostInReaisInRecommended,
            backgroundColor: theme.palette.graph.baseCostSecondary,
            pointStyle: "circle",
            stack: "Proposto",
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
          legend: {
            position: "bottom",
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
                  return null;
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
            },
          },
          datalabels: {
            anchor: "end",
            align: "end",
            rotation: 270,
            formatter: function (value) {
              return value == null ? "Indisponível" : null;
            },
          },
        },
        scales: {
          x: {
            grid: {
              display: false,
            },
            ticks: {
              maxRotation: 0,
            },
          },
          y: {
            title: {
              display: true,
              text: "R$",
            },
            grid: {
              color: "#C3C3C3",
            },
          },
        },
        datasets: {
          bar: {
            barPercentage: 1,
            skipNull: true,
          },
        },
      }}
    />
  );
};
