<template>
  <Doughnut
    id="my-pie-chart-id"
    :options="chartOptions"
  />
</template>

<script>
import { Doughnut } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale } from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale)

export default {
  name: 'PieChart',
  components: { Doughnut },
  data() {
    return {
      chartOptions: {
        responsive: true
      }
    }
  }
}
</script>
