<template>
  <div class="chart-container">
    <div class="chart-header">
      <h3>{{ title || $t('dashboard.deliveryStats') }}</h3>
      <div v-if="isLoading" class="loading-indicator">
        <font-awesome-icon icon="spinner" spin />
      </div>
    </div>
    <div class="chart-body">
      <Doughnut v-if="chartData" :data="chartData" :options="chartOptions" />
      <div v-else-if="!isLoading" class="no-data">
        {{ $t('common.noDataAvailable') }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { Doughnut } from 'vue-chartjs';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import dashboardService from '@/services/dashboardService';

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend);

// Define props
interface Props {
  title?: string;
  period?: string;
}

const props = defineProps<Props>();

// Reactive data
const isLoading = ref(false);
const chartData = ref(null);

// Chart options
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: '70%',
  plugins: {
    legend: {
      position: 'bottom' as const,
      labels: {
        boxWidth: 12,
        usePointStyle: true,
        pointStyle: 'circle'
      }
    },
    tooltip: {
      callbacks: {
        label: function(context) {
          const label = context.label || '';
          const value = context.raw || 0;
          const dataset = context.dataset;
          const total = dataset.data.reduce((acc, data) => acc + data, 0);
          const percentage = Math.round((value / total) * 100);
          return `${label}: ${percentage}% (${value})`;
        }
      }
    }
  }
};

// Fetch delivery stats data from the service
const fetchDeliveryStats = async () => {
  isLoading.value = true;
  try {
    const data = await dashboardService.getDeliveryStats(props.period || 'month');
    
    chartData.value = {
      labels: ['Delivered', 'Read', 'Failed', 'Pending'],
      datasets: [
        {
          data: [data.delivered, data.read, data.failed, data.pending],
          backgroundColor: [
            '#4ade80', // green for delivered
            '#3b82f6', // blue for read
            '#ef4444', // red for failed
            '#9ca3af'  // gray for pending
          ],
          borderWidth: 0
        }
      ]
    };
  } catch (error) {
    console.error('Failed to fetch delivery stats data:', error);
    chartData.value = null;
  } finally {
    isLoading.value = false;
  }
};

// Watch for period changes
watch(() => props.period, () => {
  fetchDeliveryStats();
});

// Fetch data on component mount
onMounted(() => {
  fetchDeliveryStats();
});
</script>

<style scoped>
.chart-container {
  background-color: var(--card-bg);
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 1rem;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.chart-header h3 {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-color);
}

.chart-body {
  flex: 1;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 250px;
}

.loading-indicator {
  color: var(--primary-color);
}

.no-data {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  color: var(--text-secondary);
  font-style: italic;
}
</style>