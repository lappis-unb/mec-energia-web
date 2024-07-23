import { Chart } from "react-chartjs-2";
import type { ChartOptions, ChartDataset } from "chart.js";
import { Recommendation } from "@/types/recommendation";
import { findMaxValue } from "../findMaxValue";

const options: ChartOptions = {
  responsive: true,
  interaction: {
    intersect: false,
    mode: "nearest",
    axis: "x",
  },
  plugins: {
    title: {
      display: true,
      text: "Demanda - Contrato Proposto",
      font: {
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
            label = "Demanda " + label + ": ";
          }
          if (context.parsed.y !== null) {
            label +=
              new Intl.NumberFormat("pt-BR").format(context.parsed.y) + " kW";
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
        text: "kW",
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
};

interface Props {
  dates: string[][];
  isGreen?: boolean;
  recommendation: Recommendation;
}

export const RecommendedContractDemandPlot = ({
  dates,
  isGreen,
  recommendation,
}: Props) => {
  const maxValue = findMaxValue([
    recommendation.consumptionHistoryPlot.offPeakMeasuredDemandInKw,
    recommendation.consumptionHistoryPlot.peakMeasuredDemandInKw,
    [recommendation.recommendedContract.peakDemandInKw],
    [recommendation.recommendedContract.offPeakDemandInKw],
  ]);

  const contractPeakDemands = Array(12).fill(
    recommendation.recommendedContract.peakDemandInKw
  );

  const contractOffPeakDemands = Array(12).fill(
    recommendation.recommendedContract.offPeakDemandInKw
  );

  const missingData =
    recommendation.consumptionHistoryPlot.offPeakMeasuredDemandInKw.map((n) =>
      n === null ? maxValue * 1.2 : null
    ) as number[];

  const greenDatasets: ChartDataset[] = [
    {
      label: "Proposta",
      data: contractPeakDemands,
      backgroundColor: "#F2B63D",
      borderColor: "#F2B63D",
      borderWidth: 4,
      pointStyle: "rect",
      pointRadius: 4,
      pointHoverRadius: 7,
    },
    {
      label: "Med. Fora Ponta",
      data: recommendation.consumptionHistoryPlot.offPeakMeasuredDemandInKw,
      backgroundColor: "#0A5C67",
      borderColor: "#0A5C67",
      pointStyle: "circle",
      pointRadius: 3,
      pointHoverRadius: 9,
    },
    {
      label: "Med. Ponta",
      data: recommendation.consumptionHistoryPlot.peakMeasuredDemandInKw,
      backgroundColor: "#0F8999",
      borderColor: "#0F8999",
      pointStyle: "triangle",
      pointRadius: 4,
      pointHoverRadius: 11,
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
      label: "Proposta Fora Ponta",
      data: contractOffPeakDemands,
      backgroundColor: "#D98A0B",
      borderColor: "#D98A0B",
      borderWidth: 4,
      pointStyle: "rect",
      pointRadius: 4,
      pointHoverRadius: 7,
    },
    {
      label: "Proposta Ponta",
      data: contractPeakDemands,
      backgroundColor: "#F2B63D",
      borderColor: "#F2B63D",
      borderWidth: 4,
      pointStyle: "rectRot",
      pointRadius: 4,
      pointHoverRadius: 7,
    },
    {
      label: "Med. Fora Ponta",
      data: recommendation.consumptionHistoryPlot.offPeakMeasuredDemandInKw,
      backgroundColor: "#0E438C",
      borderColor: "#0E438C",
      pointStyle: "circle",
      pointRadius: 3,
      pointHoverRadius: 9,
    },
    {
      label: "Med. Ponta",
      data: recommendation.consumptionHistoryPlot.peakMeasuredDemandInKw,
      backgroundColor: "#296DCC",
      borderColor: "#296DCC",
      pointStyle: "triangle",
      pointRadius: 4,
      pointHoverRadius: 11,
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

  const datasets = isGreen ? greenDatasets : blueDatasets;

  return (
    <Chart
      type="line"
      options={options}
      data={{
        labels: dates,
        datasets,
      }}
    />
  );
};
