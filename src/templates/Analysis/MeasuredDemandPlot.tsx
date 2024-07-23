import theme from "@/theme";
import { Recommendation } from "@/types/recommendation";
import { ChartDataset } from "chart.js";
import { Chart } from "react-chartjs-2";
import { findMaxValue } from "./findMaxValue";

interface Props {
  dates: string[][];
  recommendation: Recommendation;
  displayTitle?: boolean;
  isGreen?: boolean;
}

export const MeasuredDemandPlot = ({
  dates,
  recommendation,
  displayTitle,
  isGreen,
}: Props) => {
  const maxValue = findMaxValue([
    recommendation.consumptionHistoryPlot.offPeakMeasuredDemandInKw,
    recommendation.consumptionHistoryPlot.peakMeasuredDemandInKw,
    [recommendation.currentContract.peakDemandInKw],
    [recommendation.currentContract.offPeakDemandInKw],
  ]);

  const missingData =
    recommendation.consumptionHistoryPlot.offPeakMeasuredDemandInKw.map((n) =>
      n === null ? maxValue * 1.2 : null
    ) as number[];

  const contractPeakDemands = Array(12).fill(
    recommendation.currentContract.peakDemandInKw
  );
  const contractOffPeakDemands = Array(12).fill(
    recommendation.currentContract.offPeakDemandInKw
  );

  const greenDatasets: ChartDataset[] = [
    {
      label: "Med. Fora Ponta",
      data: recommendation.consumptionHistoryPlot.offPeakMeasuredDemandInKw,
      backgroundColor: "#0A5C67",
      borderColor: "#0A5C67",
      pointStyle: "circle",
      pointRadius: 5,
      pointHoverRadius: 9,
    },
    {
      label: "Med. Ponta",
      data: recommendation.consumptionHistoryPlot.peakMeasuredDemandInKw,
      backgroundColor: "#0F8999",
      borderColor: "#0F8999",
      pointStyle: "triangle",
      pointRadius: 7,
      pointHoverRadius: 11,
    },
    {
      label: "Contratada",
      data: contractPeakDemands,
      backgroundColor: "#FB736C",
      borderColor: "#FB736C",
      pointStyle: "rect",
      pointRadius: 4,
      pointHoverRadius: 7,
    },
    {
      label: "Indisponível",
      data: missingData,
      type: "bar",
      backgroundColor: "#F5F5F5",
      borderColor: "#C3C3C3",
      borderWidth: 1,
      pointStyle: "star",
    },
  ];

  const blueDatasets: ChartDataset[] = [
    {
      label: "Med. Fora Ponta",
      data: recommendation.consumptionHistoryPlot.offPeakMeasuredDemandInKw,
      backgroundColor: "#0E438C",
      borderColor: "#0E438C",
      pointStyle: "circle",
      pointRadius: 5,
      pointHoverRadius: 9,
      type: "line" as const,
    },
    {
      label: "Med. Fora Ponta",
      data: recommendation.consumptionHistoryPlot.peakMeasuredDemandInKw,
      backgroundColor: "#296DCC",
      borderColor: "#296DCC",
      pointStyle: "triangle",
      pointRadius: 7,
      pointHoverRadius: 11,
      type: "line" as const,
    },
    {
      label: "Contrat. Fora Ponta",
      data: contractOffPeakDemands,
      backgroundColor: "#CC443D",
      borderColor: "#CC443D",
      pointStyle: "rect",
      pointRadius: 4,
      pointHoverRadius: 7,
    },
    {
      label: "Contrat. Ponta",
      data: contractPeakDemands,
      backgroundColor: "#FB736C",
      borderColor: "#FB736C",
      pointStyle: "rectRot",
      pointRadius: 4,
      pointHoverRadius: 7,
    },
    {
      label: "Indisponível",
      data: missingData,
      type: "bar" as const,
      backgroundColor: "#F5F5F5",
      borderColor: "#C3C3C3",
      borderWidth: 1,
      pointStyle: "star",
    },
  ];

  return (
    <Chart
      type="line"
      datasetIdKey="measured-demand"
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
            text: "Demanda - Contrato atual",
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
        datasets: isGreen ? greenDatasets : blueDatasets,
      }}
    />
  );
};
