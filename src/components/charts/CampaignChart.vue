<template>
  <div class="chart-container">
    <div class="chart-header">
      <h3>{{ title || $t('dashboard.campaignPerformance') }}</h3>
      <div v-if="isLoading" class="loading-indicator">
        <font-awesome-icon icon="spinner" spin />
      </div>
    </div>
    <div class="chart-body">
      <Bar v-if="chartData" :data="chartData" :options="chartOptions" />
      <div v-else-if="!isLoading" class="no-data">
        {{ $t('common.noDataAvailable') }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { Bar } from 'vue-chartjs';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import dashboardService from '@/services/dashboardService';

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

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
  plugins: {
    legend: {
      position: 'top' as const,
      labels: {
        boxWidth: 15,
        usePointStyle: true,
        pointStyle: 'circle'
      }
    },
    tooltip: {
      callbacks: {
        label: function(context) {
          return `${context.dataset.label}: ${context.raw}%`;
        }
      }
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      max: 100,
      ticks: {
        callback: function(value) {
          return value + '%';
        }
      }
    }
  }
};

// Fetch campaign performance data from the service
const fetchCampaignData = async () => {
  isLoading.value = true;
  try {
    const data = await dashboardService.getCampaignPerformance(props.period || 'month');
    
    chartData.value = {
      labels: data.campaigns,
      datasets: [
        {
          label: 'Response Rate',
          backgroundColor: '#4ade80',
          data: data.responseRates
        },
        {
          label: 'Delivery Rate',
          backgroundColor: '#3b82f6',
          data: data.deliveryRates
        },
        {
          label: 'Click Rate',
          backgroundColor: '#f97316',
          data: data.clickRates
        }
      ]
    };
  } catch (error) {
    console.error('Failed to fetch campaign data:', error);
    chartData.value = null;
  } finally {
    isLoading.value = false;
  }
};

// Watch for period changes
watch(() => props.period, () => {
  fetchCampaignData();
});

// Fetch data on component mount
onMounted(() => {
  fetchCampaignData();
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
  height: 300px;
  position: relative;
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