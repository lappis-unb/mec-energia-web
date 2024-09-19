import { Chart } from "react-chartjs-2";
import { Box } from "@mui/material";
import { ChartDataset } from "chart.js";

interface Props {
    dates: string[][];
    data: {
        peakConsumptionInKwh: number[];
        offPeakConsumptionInKwh: number[];
    },
    isGreen: boolean;
}

export const AverageConsumptionPlot = ({
    dates,
    data,
    isGreen,
}: Props) => {
    const { peakConsumptionInKwh, offPeakConsumptionInKwh } = data;

    const greenDatasets: ChartDataset[] = [
        {
            label: 'Consumo',
            data: peakConsumptionInKwh,
            backgroundColor: '#003A7A',
            borderColor: '#003A7A',
            pointStyle: 'triangle',
        },
    ];

    const blueDatasets: ChartDataset[] = [
        {
            label: 'Consumo Ponta',
            data: peakConsumptionInKwh,
            backgroundColor: '#003A7A',
            borderColor: '#003A7A',
            pointStyle: 'triangle',
        },
        {
            label: 'Consumo Fora Ponta',
            data: offPeakConsumptionInKwh,
            backgroundColor: '#729BCA',
            borderColor: '#729BCA',
            pointStyle: 'circle',
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
            <Chart
                style={{
                    maxWidth: "100%",
                    maxHeight: "350px",
                }}
                type="bar"
                data={{
                    labels: dates,
                    datasets: isGreen ? greenDatasets : blueDatasets,
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
                                        label += ': ' + new Intl.NumberFormat('pt-BR').format(context.parsed.y) + " kWh";
                                        return label;
                                    }
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
                                beginAtZero: true
                            },
                            title: {
                                display: true,
                                text: 'kWh',
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
