Chart.defaults.font.family = 'Lexend';
Chart.defaults.color = '#000';
var ctx = document.getElementById("demandProposedGreen");
var myChart = new Chart(ctx, {
    plugins: [ChartDataLabels],
    data: {
        labels: [['Jan', '2022'], ['Fev', '2022'], ['Mar', '2022'], ['Abr', '2022'], ['Mai', '2022'], ['Jun', '2022'], ['Jul', '2022'], ['Ago', '2022'], ['Set', '2022'], ['Out', '2022'], ['Nov', '2022'], ['Dez', '2022']],
        datasets: [
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
                position: 'top',
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
                        let label = context.dataset.label || '';                          
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
    },
});
myChart.update()