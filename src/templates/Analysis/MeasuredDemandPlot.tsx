import { Recommendation } from "@/types/recommendation";
import { ChartDataset } from "chart.js";
import { Chart } from "react-chartjs-2";
import { Box } from "@mui/material";
import theme from "@/theme";
import { Subtitle } from "./DetailedAnalysisDrawer/Subtitle";

interface Props {
  dates: string[][];
  recommendation: Recommendation;
  isGreen?: boolean;
  isDetailedAnalysis: boolean;
}

export const MeasuredDemandPlot = ({
  dates,
  recommendation,
  isGreen,
  isDetailedAnalysis,
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
      backgroundColor: theme.palette.graph.measuredDemandMain,
      borderColor: theme.palette.graph.measuredDemandMain,
      pointStyle: "triangle",
    },
    {
      type: "bar",
      label: "Demanda Medida Fora Ponta",
      data: recommendation.consumptionHistoryPlot.offPeakMeasuredDemandInKw,
      backgroundColor: theme.palette.graph.measuredDemandSecondary,
      borderColor: theme.palette.graph.measuredDemandSecondary,
      pointStyle: "circle",
    },
  ];

  return (
    <Box
      mt={4}
      sx={{
        "@media print": {
          width: "620px",
          height: "350px",
          marginX: "auto",
        }
      }}
    >
      {isDetailedAnalysis ? (
        <Subtitle
          id="Figura 3"
          title="Gráfico comparativo entre a demanda contratada - carga e os 
          valores de demanda medidas - carga nos horários de ponta e fora 
          de ponta"
        />
      ) : null}
      <Chart
        style={{
          maxWidth: "100%",
          maxHeight: "350px",
        }}
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
