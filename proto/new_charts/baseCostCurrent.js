Chart.defaults.font.family = 'Lexend';
Chart.defaults.color = '#000';
var ctx = document.getElementById("baseCostCurrent");
var myChart = new Chart(ctx, {
    plugins: [ChartDataLabels],
    type: 'bar',
    data: {
        labels: [['Jan', '2022'], ['Fev', '2022'], ['Mar', '2022'], ['Abr', '2022'], ['Mai', '2022'], ['Jun', '2022'], ['Jul', '2022'], ['Ago', '2022'], ['Set', '2022'], ['Out', '2022'], ['Nov', '2022'], ['Dez', '2022'],],
        datasets: [
            {
                label: 'Valor de Demanda',
                data: [25224.00, 25224.00, 27068.51, null, 25224.00, 25224.00, 25224.00, 25224.00, 30413.21, 31962.59, 35299.73, 30413.21],
                backgroundColor: '#7C0AC1',
                // backgroundColor: '#CB95EC',
                pointStyle: 'triangle',
            },
            {
                label: 'Valor de Consumo',
                data: [44528.33, 53256.95, 65511.84, null, 67791.08, 55204.31, 37672.03, 48279.07, 77418.41, 72900.48, 81090.99, 65857.87],
                // backgroundColor: '#003A7A',
                backgroundColor: '#729BCA',
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
                        if (tooltipItems[0].parsed.y == null || tooltipItems.length <= 1){
                            return null
                        }

                        let sum = 0;
                        tooltipItems.forEach(function(tooltipItem) {
                          sum += tooltipItem.parsed.y;
                        });
                        return 'Total: ' + new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(sum);
                    },
                },
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
    },
});