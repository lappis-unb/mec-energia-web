import { Recommendation } from "@/types/recommendation";
import { ChartDataset } from "chart.js";
import { Chart } from "react-chartjs-2";
import { Box } from "@mui/material";
import theme from "@/theme";

interface Props {
  dates: string[][];
  recommendation: Recommendation;
  isGreen?: boolean;
}

export const MeasuredDemandPlot = ({
  dates,
  recommendation,
  isGreen,
}: Props) => {
  // const maxValue = findMaxValue([
  //   recommendation.consumptionHistoryPlot.offPeakMeasuredDemandInKw,
  //   recommendation.consumptionHistoryPlot.peakMeasuredDemandInKw,
  //   [recommendation.currentContract.peakDemandInKw],
  //   [recommendation.currentContract.offPeakDemandInKw],
  // ]);

  const contractPeakDemands = Array(12).fill(
    recommendation.currentContract.peakDemandInKw
  );
  const contractOffPeakDemands = Array(12).fill(
    recommendation.currentContract.offPeakDemandInKw
  );

  const greenDatasets: ChartDataset[] = [
    {
      type: "line",
      label: "Demanda Contratada",
      data: contractPeakDemands,
      backgroundColor: "#008940",
      borderColor: "#008940",
      pointStyle: "rect",
      pointRadius: 4,
    },
    {
      type: "bar",
      label: "Demanda Medida",
      data: recommendation.consumptionHistoryPlot.peakMeasuredDemandInKw,
      backgroundColor: theme.palette.graph.measuredDemandMain,
      borderColor: theme.palette.graph.measuredDemandMain,
    },
  ];

  const blueDatasets: ChartDataset[] = [
    {
      type: "line",
      label: "Demanda Contratada Ponta",
      data: contractPeakDemands,
      backgroundColor: theme.palette.graph.measuredDemandPeakLine,
      borderColor: theme.palette.graph.measuredDemandPeakLine,
      pointStyle: "rectRot",
      pointRadius: 4,
    },
    {
      type: "line",
      label: "Demanda Contratada Fora Ponta",
      data: contractOffPeakDemands,
      backgroundColor: theme.palette.graph.measuredDemandOffPeakLine,
      borderColor: theme.palette.graph.measuredDemandOffPeakLine,
      pointStyle: "rect",
      pointRadius: 4,
    },
    {
      type: "bar",
      label: "Demanda Medida Ponta",
      data: recommendation.consumptionHistoryPlot.peakMeasuredDemandInKw,
      backgroundColor: "#7C0AC1",
      borderColor: "#7C0AC1",
      pointStyle: "triangle",
    },
    {
      type: "bar",
      label: "Demanda Medida Fora Ponta",
      data: recommendation.consumptionHistoryPlot.offPeakMeasuredDemandInKw,
      backgroundColor: "#CB95EC",
      borderColor: "#CB95EC",
      pointStyle: "circle",
    },
  ];

  return (
    <Box>
      <Chart
        type="line"
        datasetIdKey="measured-demand"
        data={{
          labels: dates,
          datasets: isGreen ? greenDatasets : blueDatasets,
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
              xAlign: "center",
              yAlign: "bottom",
              callbacks: {
                title: function (context) {
                  let title = context[0].label || "";
                  title = title.replace(",", " ");
                  if (context[0].parsed.y == null) {
                    title += " - Indisponível";
                  }
                  return title;
                },
                label: function (context) {
                  const label = context.dataset.label || "";
                  let suffix = "";
                  if (context.parsed.y != null) {
                    suffix =
                      new Intl.NumberFormat("pt-BR").format(context.parsed.y) +
                      " kW";
                  } else {
                    suffix = "Indisponível";
                  }
                  return label + ": " + suffix;
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
              ticks: {
                beginAtZero: true,
              },
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
              barPercentage: 1,
              skipNull: true,
            },
          },
        }}
      />
    </Box>
  );
};
