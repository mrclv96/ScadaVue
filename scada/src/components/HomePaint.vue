<template>
  <v-container>
    <v-row class="text-center">
      <v-col cols="12">
        <v-img
          src="~@/assets/logoPO.svg"
          class="my-3"
          contain
          height="200"
        />
      </v-col>
      <v-col class="mb-4">
        
        <h1 class="display-2 font-weight-bold mb-3">
          Bienvenido al SCADA de Pintura PO Puebla
        </h1>
      </v-col>
      <v-col
        class="mb-5"
        cols="12"
      >
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import axios from 'axios';
  import Chart from 'chart.js/auto';
  //import ApexCharts from 'apexcharts'
  export default {

    methods:{
      myChart1(){
        const ctx = document.getElementById('myChart');
        const myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
                datasets: [{
                    label: '# of Votes',
                    data: [12, 19, 3, 5, 2, 3],
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)'
                    ],
                    borderWidth: 1
                }],

            series: [
              {
                name: 'OEE',
                data: [
                  {
                    x: 'OEE',
                    y: [
                      new Date(1789, 3, 30).getTime(),
                      new Date(1797, 2, 4).getTime()
                    ]
                  },
                ]
              }
            ],
            chartOptions: {
            chart: {
              height: 350,
              type: 'rangeBar'
            },
            plotOptions: {
              bar: {
                horizontal: true,
                barHeight: '50%',
                rangeBarGroupRows: true
              }
            },
            colors: [
              "#008FFB", "#00E396", "#FEB019", "#FF4560", "#775DD0",
              "#3F51B5", "#546E7A", "#D4526E", "#8D5B4C", "#F86624",
              "#D7263D", "#1B998B", "#2E294E", "#F46036", "#E2C044"
            ],
            fill: {
              type: 'solid'
            },
            xaxis: {
              type: 'datetime'
            },
            legend: {
              position: 'right'
            },
            tooltip: {
              custom: function(opts) {
                const fromYear = new Date(opts.y1).getFullYear()
                const toYear = new Date(opts.y2).getFullYear()
                const values = opts.ctx.rangeBar.getTooltipValues(opts)
            
                return (
                      ''
                    )
                  }
                }
              },
            }
        });
      },
    },
    mounted(){
      //this.myChart1();
    },
  }
</script>
