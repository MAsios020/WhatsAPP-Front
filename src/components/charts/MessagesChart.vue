<template>
  <div class="chart-container">
    <h3 class="chart-title">{{ $t('dashboard.messageActivity') }}</h3>
    <div class="chart-wrapper">
      <LineChart
        :chartData="chartData"
        :options="options"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { LineChart } from 'vue-chart-3';
import { Chart, registerables } from 'chart.js';
import dashboardService from '@/services/dashboardService';

Chart.register(...registerables);

const props = defineProps({
  period: {
    type: String,
    default: 'month'
  }
});

const chartData = ref({
  labels: [],
  datasets: [
    {
      label: 'Sent',
      data: [],
      borderColor: '#2196F3',
      backgroundColor: 'rgba(33, 150, 243, 0.1)',
      tension: 0.4,
      fill: true,
      borderWidth: 2,
      pointBackgroundColor: '#2196F3',
      pointBorderColor: '#fff',
      pointBorderWidth: 1,
      pointRadius: 3,
      pointHoverRadius: 5
    },
    {
      label: 'Delivered',
      data: [],
      borderColor: '#4CAF50',
      backgroundColor: 'rgba(76, 175, 80, 0.1)',
      tension: 0.4,
      fill: true,
      borderWidth: 2,
      pointBackgroundColor: '#4CAF50',
      pointBorderColor: '#fff',
      pointBorderWidth: 1,
      pointRadius: 3,
      pointHoverRadius: 5
    },
    {
      label: 'Read',
      data: [],
      borderColor: '#9C27B0',
      backgroundColor: 'rgba(156, 39, 176, 0.1)',
      tension: 0.4,
      fill: true,
      borderWidth: 2,
      pointBackgroundColor: '#9C27B0',
      pointBorderColor: '#fff',
      pointBorderWidth: 1,
      pointRadius: 3,
      pointHoverRadius: 5
    }
  ]
});

const options = ref({
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    x: {
      grid: {
        color: 'rgba(0, 0, 0, 0.05)',
        drawBorder: false
      },
      ticks: {
        maxRotation: 0,
        padding: 10,
        font: {
          size: 11
        }
      }
    },
    y: {
      beginAtZero: true,
      grid: {
        color: 'rgba(0, 0, 0, 0.05)',
        drawBorder: false
      },
      ticks: {
        padding: 10,
        font: {
          size: 11
        },
        stepSize: 10
      }
    }
  },
  plugins: {
    legend: {
      position: 'top',
      align: 'end',
      labels: {
        usePointStyle: true,
        padding: 15,
        boxWidth: 8,
        font: {
          size: 12
        }
      }
    },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      padding: 10,
      titleFont: {
        size: 14
      },
      bodyFont: {
        size: 13
      },
      cornerRadius: 4,
      intersect: false,
      mode: 'index'
    }
  },
  interaction: {
    intersect: false,
    mode: 'index'
  }
});

const fetchData = async () => {
  try {
    const data = await dashboardService.getMessageActivity(props.period);
    chartData.value.labels = data.labels;
    chartData.value.datasets[0].data = data.sent;
    chartData.value.datasets[1].data = data.delivered;
    chartData.value.datasets[2].data = data.read;
  } catch (error) {
    console.error('Error fetching message activity:', error);
  }
};

onMounted(fetchData);

watch(() => props.period, fetchData);
</script>

<style scoped>
.chart-container {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  padding: 20px;
  margin-bottom: 20px;
  height: 350px;
}

.chart-title {
  margin-top: 0;
  margin-bottom: 15px;
  font-size: 16px;
  color: #333;
  font-weight: 600;
}

.chart-wrapper {
  height: 285px;
  position: relative;
}
</style> 