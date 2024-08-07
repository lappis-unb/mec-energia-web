import { DetailedContractCostsComparisonPlot } from "@/types/recommendation";
import { Box } from "@mui/material";
import { Chart } from "react-chartjs-2";

interface Props {
  dates: string[][];
  costs: DetailedContractCostsComparisonPlot;
}

export const ComparativeScenarioCurrentNewContractPlot = ({ dates, costs }: Props) => {
  return (
    <Box>
      <Chart
        type="bar"
        data={{
          labels: dates,
          datasets: [
            {
              label: 'Consumo + Demanda atuais',
              data: costs.totalCostInReaisInCurrent,
              backgroundColor: '#55BF87',
              pointStyle: 'rect',
            },
            {
              label: 'Consumo + Demanda propostos',
              data: costs.consumptionCostInReaisInRecommended.map((num, index) => num + costs.demandCostInReaisInRecommended[index]),
              backgroundColor: '#EE8F84',
              pointStyle: 'circle',
            },
          ]
        }}
        options={{
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
                  if (context.parsed.y == null) {
                    return null;
                  } else {
                    let label = context.dataset.label || '';
                    label += ': ' + new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(context.parsed.y);
                    return label;
                  }
                },
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
              title: {
                display: true,
                text: 'R$',
              },
              grid: {
                color: "#C3C3C3",
              }
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
