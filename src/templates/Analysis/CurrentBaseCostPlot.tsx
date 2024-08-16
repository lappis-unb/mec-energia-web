import { ContractCostsPlot } from "@/types/recommendation";

import { Chart } from "react-chartjs-2";
import { Box } from "@mui/material";

interface Props {
  dates: string[][];
  currentContractCostsPlot: ContractCostsPlot;
}

export const CurrentBaseCostPlot = ({
  dates,
  currentContractCostsPlot,
}: Props) => {
  return (
    <Box>
      <Chart
        type="bar"
        data={{
          labels: dates,
          datasets: [
            {
              label: 'Valor de Demanda',
              data: currentContractCostsPlot.demandCostInReais,
              backgroundColor: '#7C0AC1',
              // backgroundColor: '#CB95EC',
              pointStyle: 'triangle',
            },
            {
              label: 'Valor de Consumo',
              data: currentContractCostsPlot.consumptionCostInReais,
              // backgroundColor: '#003A7A',
              backgroundColor: '#729BCA',
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
                footer: function (tooltipItems) {
                  if (tooltipItems[0].parsed.y == null || tooltipItems.length <= 1) {
                    return null
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
