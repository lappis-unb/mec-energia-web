import { Chart } from "react-chartjs-2";
import type { ChartOptions, ChartDataset } from "chart.js";
import { Recommendation } from "@/types/recommendation";
import { Box } from "@mui/material";

const options: ChartOptions = {
  responsive: true,
  interaction: {
    intersect: false,
    mode: 'nearest',
    axis: 'x',
  },
  plugins: {
    legend: {
      position: 'bottom',
      labels: {
        usePointStyle: true,
      },
    },
    tooltip: {
      usePointStyle: true,
      xAlign: 'center',
      yAlign: 'bottom',
      callbacks: {
        title: function (context) {
          let title = context[0].label || '';
          title = title.replace(',', ' ');
          if (context[0].parsed.y == null) {
            title += ' - Indisponível';
          }
          return title;
        },
        label: function (context) {
          const label = context.dataset.label || '';
          let suffix = '';
          if (context.parsed.y != null) {
            suffix = new Intl.NumberFormat('pt-BR').format(context.parsed.y) + " kW";
          } else {
            suffix = 'Indisponível';
          }
          return label + ': ' + suffix;
        }
      }
    },
    datalabels: {
      anchor: 'end',
      align: 'end',
      rotation: 270,
      formatter: function (value) {
        return value == null ? 'Indisponível' : null
      }
    }
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
        text: 'kW',
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
};

interface Props {
  dates: string[][];
  recommendation: Recommendation;
  isGreen?: boolean;
}

export const RecommendedContractDemandPlot = ({
  dates,
  recommendation,
  isGreen,
}: Props) => {
  // const maxValue = findMaxValue([
  //   recommendation.consumptionHistoryPlot.offPeakMeasuredDemandInKw,
  //   recommendation.consumptionHistoryPlot.peakMeasuredDemandInKw,
  //   [recommendation.recommendedContract.peakDemandInKw],
  //   [recommendation.recommendedContract.offPeakDemandInKw],
  // ]);

  const contractPeakDemands = Array(12).fill(
    recommendation.recommendedContract.peakDemandInKw
  );

  const contractOffPeakDemands = Array(12).fill(
    recommendation.recommendedContract.offPeakDemandInKw
  );

  // const missingData =
  //   recommendation.consumptionHistoryPlot.offPeakMeasuredDemandInKw.map((n) =>
  //     n === null ? maxValue * 1.2 : null
  //   ) as number[];

  const greenDatasets: ChartDataset[] = [
    {
      type: 'line',
      label: 'Demanda Proposta',
      data: contractPeakDemands,
      backgroundColor: '#EE8F84',
      borderColor: '#EE8F84',
      pointStyle: 'rect',
      pointRadius: 4,
    },
    {
      type: 'bar',
      label: 'Demanda Medida',
      data: recommendation.consumptionHistoryPlot.peakMeasuredDemandInKw,
      backgroundColor: '#7C0AC1',
      borderColor: '#7C0AC1',
    },
  ];

  const blueDatasets: ChartDataset[] = [
    {
      type: 'line',
      label: 'Demanda Proposta Ponta',
      data: contractPeakDemands,
      backgroundColor: '#B31B0A',
      borderColor: '#B31B0A',
      pointStyle: 'rectRot',
      pointRadius: 4,
    },
    {
      type: 'line',
      label: 'Demanda Proposta Fora Ponta',
      data: contractOffPeakDemands,
      backgroundColor: '#EE8F84',
      borderColor: '#EE8F84',
      pointStyle: 'rect',
      pointRadius: 4,
    },
    {
      type: 'bar',
      label: 'Demanda Medida Ponta',
      data: recommendation.consumptionHistoryPlot.peakMeasuredDemandInKw,
      backgroundColor: '#7C0AC1',
      borderColor: '#7C0AC1',
      pointStyle: 'triangle',
    },
    {
      type: 'bar',
      label: 'Demanda Medida Fora Ponta',
      data: recommendation.consumptionHistoryPlot.offPeakMeasuredDemandInKw,
      backgroundColor: '#CB95EC',
      borderColor: '#CB95EC',
      pointStyle: 'circle',
    },
  ];

  const datasets = isGreen ? greenDatasets : blueDatasets;

  return (
    <Box
      sx={{
        "@media print": {
          width: "620px",
          height: "350px",
          marginX: "auto",
        }
      }}
    >
      <Chart
        style={{
          maxWidth: "100%",
          maxHeight: "350px",
        }}
        type="line"
        options={options}
        data={{
          labels: dates,
          datasets,
        }}
      />
    </Box>
  );
};
