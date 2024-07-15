Chart.defaults.font.family = 'Lexend';
Chart.defaults.color = '#000';
var ctx = document.getElementById("consumptionGreen");
var myChart = new Chart(ctx, {
    plugins: [ChartDataLabels],
    type: 'bar',
    data: {
        labels: [['Jan', '2022'], ['Fev', '2022'], ['Mar', '2022'], ['Abr', '2022'], ['Mai', '2022'], ['Jun', '2022'], ['Jul', '2022'], ['Ago', '2022'], ['Set', '2022'], ['Out', '2022'], ['Nov', '2022'], ['Dez', '2022'],],
        datasets: [
            {
                label: 'Consumo',
                data: [152.46, 141.12, 294.89, null, 260.82, 217.98, 153.72, 207.90, 313.74, 309.96, 332.64, 296.10],
                backgroundColor: '#003A7A',
                borderColor: '#003A7A',
            }
        ]
    },
    options: {
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
                            label = label + ': '  + new Intl.NumberFormat('pt-BR').format(context.parsed.y) + " kWh";
                            return label;
                        }
                    }

                }
            },
            datalabels: {
                anchor: 'end',
                align: 'end',          
                rotation: 270,    
                formatter: function(value, context) {
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
    },
});