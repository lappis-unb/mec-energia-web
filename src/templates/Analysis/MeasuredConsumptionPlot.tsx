import { Recommendation } from "@/types/recommendation";
import { Chart } from "react-chartjs-2";
import { Box } from "@mui/material";

import theme from "@/theme";

interface Props {
  dates: string[][];
  recommendation: Recommendation;
}

export const MeasuredConsumptionPlot = ({ dates, recommendation }: Props) => {
  const peakData =
    recommendation.consumptionHistoryPlot.peakConsumptionInKwh.map((n) =>
      n === null ? null : n
    ) as number[];

  const offPeakData =
    recommendation.consumptionHistoryPlot.offPeakConsumptionInKwh.map((n) =>
      n === null ? null : n
    ) as number[];

  return (
    <Box mt={2}>
      <Chart
        type="bar"
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
              position: "bottom",
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
              barPercentage: 1,
            },
          },
        }}
        data={{
          labels: dates,
          datasets: [
            {
              label: "Consumo Ponta",
              data: peakData,
              backgroundColor: theme.palette.graph.measuredConsumptionMain,
              borderColor: theme.palette.graph.measuredConsumptionMain,
              borderWidth: 1,
              pointStyle: "triangle",
            },
            {
              label: "Consumo Fora ponta",
              data: offPeakData,
              backgroundColor: theme.palette.graph.measuredConsumptionSecondary,
              borderColor: theme.palette.graph.measuredConsumptionSecondary,
              borderWidth: 1,
            },
          ],
        }}
      />
    </Box>
  );
};
