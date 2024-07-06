Chart.defaults.font.family = 'Lexend';
Chart.defaults.color = '#000';
var ctx = document.getElementById("demandProposedBlueFixed");
var myChart = new Chart(ctx, {
    plugins: [ChartDataLabels],
    data: {
        labels: [['Jan', '2022'], ['Fev', '2022'], ['Mar', '2022'], ['Abr', '2022'], ['Mai', '2022'], ['Jun', '2022'], ['Jul', '2022'], ['Ago', '2022'], ['Set', '2022'], ['Out', '2022'], ['Nov', '2022'], ['Dez', '2022']],
        datasets: [
            {
                type: 'line',
                label: 'Demanda Proposta Ponta',
                data: [220, 220, 220, 220, 220, 220, 220, 220, 220, 220, 220, 220,],
                backgroundColor: '#B31B0A', 
                borderColor: '#B31B0A',
                pointStyle: 'rectRot',
                pointRadius: 4,
                datalabels: {
                    color:'#FFFFFF',
                    backgroundColor: '#B31B0A', 
                    borderColor: '#B31B0A',
                    borderRadius: 3,
                    padding: {
                        right: 8,
                        left: 8,
                    },
                    display: function(context) {
                        return context.dataIndex == 2;
                    },
                    formatter: function(value, context) {
                        return 'Prop. P: ' + new Intl.NumberFormat('pt-BR').format(value);  
                    }
                }
            },
            {
                type: 'line',
                label: 'Demanda Proposta Fora Ponta',
                data: [400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400],
                backgroundColor: '#EE8F84', 
                borderColor: '#EE8F84',
                pointStyle: 'rect',
                pointRadius: 4,
                datalabels: {
                    backgroundColor: '#EE8F84', 
                    borderColor: '#EE8F84',
                    borderRadius: 3,
                    padding: {
                        right: 8,
                        left: 8,
                    },
                    display: function(context) {
                        return context.dataIndex == context.dataset.data.length - 3;
                    },
                    formatter: function(value, context) {
                        return 'Prop. FP: ' + new Intl.NumberFormat('pt-BR').format(value);  
                    }
                }
            },
            {
                type: 'bar',
                label: 'Demanda Medida Ponta',
                data: [152.46, 141.12, 294.89, null, 260.82, 217.98, 153.72, 207.90, 313.74, 309.96, 332.64, 296.10],
                backgroundColor: '#7C0AC1',
                borderColor: '#7C0AC1',
                pointStyle: 'triangle',
                datalabels: {
                    anchor: 'end',
                    align: 'end',
                    rotation: 270,
                    formatter: function(value, context) {
                        if(value == null) {
                            return "Indisponível"
                        } else {
                            let prefix = '';
                            if(context.dataset.label == 'Demanda Medida Ponta'){
                                prefix = 'P: ';
                            } else if(context.dataset.label == 'Demanda Medida Fora Ponta') {
                                prefix = 'FP: ';
                            }
                            return prefix + new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2 }).format(value);
                        }    
                    }
                }
            },
            {
                type: 'bar',
                label: 'Demanda Medida Fora Ponta',
                data: [328.86, 335.16, 419.50, null, 375.48, 349.02, 244.44, 284.76, 454.86, 471.24, 506.52, 454.86],
                backgroundColor: '#CB95EC', 
                borderColor: '#CB95EC', 
                pointStyle: 'circle',
                datalabels: {
                    anchor: 'end',
                    align: 'end',
                    rotation: 270,
                    formatter: function(value, context) {
                        if(value == null) {
                            return "Indisponível"
                        } else {
                            let prefix = '';
                            if(context.dataset.label == 'Demanda Medida Ponta'){
                                prefix = 'P: ';
                            } else if(context.dataset.label == 'Demanda Medida Fora Ponta') {
                                prefix = 'FP: ';
                            }
                            return prefix + new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2 }).format(value);
                        }    
                    }
                }
            },

        ]
    },
    options: {
        responsive: true,
        aspectRatio: 1,
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
                grace:'25%',
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