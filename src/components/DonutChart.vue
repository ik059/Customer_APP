<template>
    <DonutChart
      id="my-chart-id"
      :options="chartOptions"
      :data="chartData"
    />
  </template>
  
  <script>
  import { Donut } from 'vue-chartjs'
  import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale } from 'chart.js'
  
  ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale)
  
  export default {
    name: 'DonutChart',
    components: { Donut },
    data() {
      return {
        chartOptions: {
          responsive: true
        },
        chartData: {
          labels: ['Red', 'Blue', 'Yellow'],
          datasets: [{
            label: 'My Dataset',
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
            data: [300, 50, 100]
          }]
        }
      }
    }
  }
  </script>
  