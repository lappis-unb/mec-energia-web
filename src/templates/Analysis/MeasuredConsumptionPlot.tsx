import { Recommendation } from "@/types/recommendation";
import { Chart } from "react-chartjs-2";
import { findMaxValue } from "./findMaxValue";
import theme from "@/theme";

interface Props {
  dates: string[][];
  recommendation: Recommendation;
}

export const MeasuredConsumptionPlot = ({ dates, recommendation }: Props) => {
  const maxValue = findMaxValue([
    recommendation.consumptionHistoryPlot.offPeakConsumptionInKwh,
    recommendation.consumptionHistoryPlot.peakConsumptionInKwh,
  ]);

  const missingData =
    recommendation.consumptionHistoryPlot.offPeakConsumptionInKwh.map((n) =>
      n === null ? maxValue * 1.2 : null
    ) as number[];

  return (
    <Chart
      type="line"
      datasetIdKey="measured-consumption"
      options={{
        responsive: true,
        interaction: {
          intersect: false,
          mode: "nearest",
          axis: "x",
        },
        plugins: {
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
                const title = context[0].label || "";
                return title.replace(",", "/");
              },
              label: function (context) {
                let label = context.dataset.label || "";

                if (label == "Indisponível") {
                  if (context.parsed.y == null) {
                    return;
                  }
                  return "Informações indisponíveis";
                }
                if (label) {
                  label = "Consumo " + label + ": ";
                }
                if (context.parsed.y !== null) {
                  label +=
                    new Intl.NumberFormat("pt-BR").format(context.parsed.y) +
                    " kWh";
                }

                return label;
              },
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
              text: "kWh",
            },
            grid: {
              color: "#C3C3C3",
            },
          },
        },
        datasets: {
          bar: {
            barPercentage: 1.2,
          },
        },
      }}
      data={{
        labels: dates,
        datasets: [
          {
            type: "line" as const,
            label: "Fora ponta",
            data: recommendation.consumptionHistoryPlot.offPeakConsumptionInKwh,
            backgroundColor: theme.palette.graph.measuredConsumptionMain,
            borderColor: theme.palette.graph.measuredConsumptionMain,
            pointStyle: "circle",
            pointRadius: 5,
            pointHoverRadius: 9,
          },
          {
            type: "line" as const,
            label: "Ponta",
            data: recommendation.consumptionHistoryPlot.peakConsumptionInKwh,
            backgroundColor: theme.palette.graph.measuredConsumptionSecondary,
            borderColor: theme.palette.graph.measuredConsumptionSecondary,
            pointStyle: "triangle",
            pointRadius: 7,
            pointHoverRadius: 11,
          },
          {
            label: "Indisponível",
            data: missingData,
            type: "bar" as const,
            backgroundColor: "#F5F5F5",
            borderColor: "#C3C3C3",
            borderWidth: 1,
            pointStyle: "star",
            // FIXME: Essa propriedade cria um segundo eixo Y
            // yAxisID: "y-axis-3",
          },
        ],
      }}
    />
  );
};
