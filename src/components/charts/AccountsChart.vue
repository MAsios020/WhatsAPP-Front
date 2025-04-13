<template>
  <div class="chart-container">
    <h3 class="chart-title">{{ $t('dashboard.accountDistribution') }}</h3>
    <div class="chart-wrapper">
      <DoughnutChart
        :chartData="chartData"
        :options="options"
        :plugins="plugins"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { DoughnutChart } from 'vue-chart-3';
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
  datasets: [{
    data: [],
    backgroundColor: [
      '#4CAF50',
      '#2196F3',
      '#FFC107',
      '#9C27B0',
      '#FF5722'
    ],
    hoverBackgroundColor: [
      '#66BB6A',
      '#42A5F5',
      '#FFCA28',
      '#AB47BC',
      '#FF7043'
    ],
    borderWidth: 0
  }]
});

const options = ref({
  responsive: true,
  maintainAspectRatio: false,
  cutout: '70%',
  plugins: {
    legend: {
      position: 'right',
      labels: {
        usePointStyle: true,
        padding: 20,
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
      cornerRadius: 4
    }
  }
});

const plugins = ref([{
  id: 'centerText',
  beforeDraw: (chart) => {
    const ctx = chart.ctx;
    const { width, height } = chart;
    
    ctx.save();
    ctx.font = 'bold 16px Arial';
    ctx.fillStyle = '#333';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    const total = chartData.value.datasets[0].data.reduce((a, b) => a + b, 0);
    ctx.fillText(total.toString(), width / 2, height / 2);
    
    ctx.font = '12px Arial';
    ctx.fillStyle = '#666';
    ctx.fillText('Total', width / 2, height / 2 + 20);
    
    ctx.restore();
  }
}]);

const fetchData = async () => {
  try {
    const data = await dashboardService.getAccountDistribution(props.period);
    chartData.value.labels = data.labels;
    chartData.value.datasets[0].data = data.values;
  } catch (error) {
    console.error('Error fetching account distribution:', error);
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