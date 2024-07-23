import { DetailedContractCostsComparisonPlot } from "@/types/recommendation";
import { Chart } from "react-chartjs-2";

interface Props {
  dates: string[][];
  costs: DetailedContractCostsComparisonPlot;
}

export const DetailedBaseCostsComparisonPlot = ({ dates, costs }: Props) => (
  <Chart
    type="bar"
    datasetIdKey="DetailedBaseCostsComparisonPlot"
    options={{
      responsive: true,
      interaction: {
        intersect: false,
        mode: "nearest",
        axis: "x",
      },
      plugins: {
        title: {
          display: true,
          text: "Custo-base atual vs. estimado",
          font: {
            size: 16,
            weight: "normal",
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
    data={{
      labels: dates,
      datasets: [
        {
          label: "Valor Dem. + Cons. atuais",
          data: costs.totalCostInReaisInCurrent,
          backgroundColor: "#CC443D",
          pointStyle: "circle",
          stack: "Atual",
          barPercentage: 0.5,
        },
        {
          label: "Valor Dem. proposta",
          data: costs.demandCostInReaisInRecommended,
          backgroundColor: "#0E438C",
          pointStyle: "rect",
          stack: "Proposto",
          barPercentage: 1.1,
        },
        {
          label: "Valor Cons. proposto",
          data: costs.consumptionCostInReaisInRecommended,
          backgroundColor: "#F2B63D",
          pointStyle: "triangle",
          stack: "Proposto",
          barPercentage: 1.1,
        },
      ],
    }}
  />
);
