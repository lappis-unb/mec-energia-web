import { Chart } from "react-chartjs-2";
import type { ChartOptions, ChartDataset } from "chart.js";
import { Recommendation } from "@/types/recommendation";
import { Subtitle } from "./Subtitle";
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
  isGreen?: boolean;
  recommendation: Recommendation;
}

export const RecommendedContractDemandPlot = ({
  dates,
  isGreen,
}: Props) => {
  // const maxValue = findMaxValue([
  //   recommendation.consumptionHistoryPlot.offPeakMeasuredDemandInKw,
  //   recommendation.consumptionHistoryPlot.peakMeasuredDemandInKw,
  //   [recommendation.recommendedContract.peakDemandInKw],
  //   [recommendation.recommendedContract.offPeakDemandInKw],
  // ]);

  // const contractPeakDemands = Array(12).fill(
  //   recommendation.recommendedContract.peakDemandInKw
  // );

  // const contractOffPeakDemands = Array(12).fill(
  //   recommendation.recommendedContract.offPeakDemandInKw
  // );

  // const missingData =
  //   recommendation.consumptionHistoryPlot.offPeakMeasuredDemandInKw.map((n) =>
  //     n === null ? maxValue * 1.2 : null
  //   ) as number[];

  const greenDatasets: ChartDataset[] = [
    {
      type: 'line',
      label: 'Demanda Proposta',
      data: [220, 220, 220, 220, 220, 220, 220, 220, 220, 220, 220, 220,],
      backgroundColor: '#EE8F84',
      borderColor: '#EE8F84',
      pointStyle: 'rect',
      pointRadius: 4,
    },
    {
      type: 'bar',
      label: 'Demanda Medida',
      data: [152.46, 141.12, 294.89, null, 260.82, 217.98, 153.72, 207.90, 313.74, 309.96, 332.64, 296.10],
      backgroundColor: '#7C0AC1',
      borderColor: '#7C0AC1',
    },
  ];

  const blueDatasets: ChartDataset[] = [
    {
      type: 'line',
      label: 'Demanda Proposta Ponta',
      data: [220, 220, 220, 220, 220, 220, 220, 220, 220, 220, 220, 220,],
      backgroundColor: '#B31B0A',
      borderColor: '#B31B0A',
      pointStyle: 'rectRot',
      pointRadius: 4,
    },
    {
      type: 'line',
      label: 'Demanda Proposta Fora Ponta',
      data: [400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400],
      backgroundColor: '#EE8F84',
      borderColor: '#EE8F84',
      pointStyle: 'rect',
      pointRadius: 4,
    },
    {
      type: 'bar',
      label: 'Demanda Medida Ponta',
      data: [152.46, 141.12, 294.89, null, 260.82, 217.98, 153.72, 207.90, 313.74, 309.96, 332.64, 296.10],
      backgroundColor: '#7C0AC1',
      borderColor: '#7C0AC1',
      pointStyle: 'triangle',
    },
    {
      type: 'bar',
      label: 'Demanda Medida Fora Ponta',
      data: [328.86, 335.16, 419.50, null, 375.48, 349.02, 244.44, 284.76, 454.86, 471.24, 506.52, 454.86],
      backgroundColor: '#CB95EC',
      borderColor: '#CB95EC',
      pointStyle: 'circle',
    },
  ];

  const datasets = isGreen ? greenDatasets : blueDatasets;

  return (
    <Box mt={4}>
      <Subtitle
        id="Figura 4"
        title="Gráfico comparativo entre a demanda proposta - carga e os valores medidos nos horários de ponta e fora de ponta"
      />
      <Chart
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
