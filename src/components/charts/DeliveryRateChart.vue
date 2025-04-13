<template>
  <div class="delivery-rate-chart">
    <div v-if="loading" class="chart-loader">
      <div class="spinner"></div>
      <p>{{ $t('dashboard.loadingChart') }}</p>
    </div>
    <div v-else-if="error" class="chart-error">
      <font-awesome-icon icon="exclamation-circle" />
      <p>{{ $t('dashboard.errorLoadingChart') }}</p>
      <button @click="fetchData" class="retry-btn">
        <font-awesome-icon icon="sync" />
        {{ $t('dashboard.retry') }}
      </button>
    </div>
    <div v-else-if="isEmpty" class="no-data">
      <font-awesome-icon icon="chart-pie" />
      <p>{{ $t('dashboard.noDeliveryData') }}</p>
    </div>
    <div v-else class="chart-container">
      <h3 class="chart-title">{{ $t('dashboard.deliveryRate') }}</h3>
      <div class="chart-wrapper">
        <div class="chart-center-stats">
          <div class="total-messages">
            <span class="total-value">{{ totalMessages }}</span>
            <span class="total-label">{{ $t('dashboard.totalMessages') }}</span>
          </div>
        </div>
        <div class="doughnut-chart-container">
          <Doughnut 
            :data="chartData"
            :options="chartOptions"
          />
        </div>
      </div>
      <div class="status-legend">
        <div v-for="(item, index) in statusItems" :key="index" class="status-item">
          <div class="status-color" :style="{ backgroundColor: item.color }"></div>
          <div class="status-info">
            <div class="status-label">{{ item.label }}</div>
            <div class="status-count">
              <span class="count-value">{{ item.count }}</span>
              <span class="count-percentage">({{ item.percentage }}%)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { Doughnut } from 'vue-chartjs';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { useI18n } from 'vue-i18n';

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend);

export default {
  name: 'DeliveryRateChart',
  components: { Doughnut },
  props: {
    campaignId: {
      type: [String, Number],
      default: null
    }
  },
  setup(props) {
    const { t } = useI18n();
    const loading = ref(true);
    const error = ref(false);
    const deliveryData = ref({});
    
    // Status colors
    const statusColors = {
      delivered: '#4CAF50',  // green
      read: '#2196F3',       // blue
      failed: '#F44336',     // red
      pending: '#FFC107'     // amber
    };
    
    // Chart data
    const chartData = ref({
      labels: [],
      datasets: [{
        data: [],
        backgroundColor: [],
        borderColor: [],
        borderWidth: 1,
        hoverOffset: 4
      }]
    });
    
    // Chart options
    const chartOptions = ref({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          titleFont: {
            size: 13
          },
          bodyFont: {
            size: 12
          },
          callbacks: {
            label: function(context) {
              const label = context.label || '';
              const value = context.raw || 0;
              const dataset = context.dataset;
              const total = dataset.data.reduce((acc, data) => acc + data, 0);
              const percentage = Math.round((value / total) * 100);
              return `${label}: ${value} (${percentage}%)`;
            }
          }
        }
      },
      cutout: '70%',
      animation: {
        animateRotate: true,
        animateScale: true
      }
    });
    
    // Check if data is empty
    const isEmpty = computed(() => {
      return chartData.value.datasets[0].data.length === 0 || 
        chartData.value.datasets[0].data.every(value => value === 0);
    });
    
    // Calculate total messages
    const totalMessages = computed(() => {
      return chartData.value.datasets[0].data.reduce((acc, val) => acc + val, 0);
    });
    
    // Format status items for display
    const statusItems = computed(() => {
      if (isEmpty.value) return [];
      
      return chartData.value.labels.map((label, index) => {
        const count = chartData.value.datasets[0].data[index];
        const percentage = totalMessages.value > 0 
          ? Math.round((count / totalMessages.value) * 100) 
          : 0;
        
        return {
          label,
          count,
          percentage,
          color: chartData.value.datasets[0].backgroundColor[index]
        };
      });
    });
    
    // Fetch data from API
    const fetchData = async () => {
      loading.value = true;
      error.value = false;
      
      try {
        // For demonstration, we'll use dummy data
        // In real implementation, use axios.get with proper endpoint
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data
        const mockData = {
          delivered: 850,
          read: 520,
          failed: 120,
          pending: 210
        };
        
        // Prepare chart data
        const labels = [
          t('messages.statuses.delivered'),
          t('messages.statuses.read'),
          t('messages.statuses.failed'),
          t('messages.statuses.pending')
        ];
        
        const values = [
          mockData.delivered,
          mockData.read,
          mockData.failed,
          mockData.pending
        ];
        
        const backgroundColors = [
          statusColors.delivered,
          statusColors.read,
          statusColors.failed,
          statusColors.pending
        ];
        
        const borderColors = backgroundColors.map(color => color);
        
        // Update chart data
        chartData.value.labels = labels;
        chartData.value.datasets[0].data = values;
        chartData.value.datasets[0].backgroundColor = backgroundColors;
        chartData.value.datasets[0].borderColor = borderColors;
        
        deliveryData.value = mockData;
        
      } catch (err) {
        console.error('Error fetching delivery rate data:', err);
        error.value = true;
      } finally {
        loading.value = false;
      }
    };
    
    // Fetch data on component mount
    onMounted(() => {
      fetchData();
    });
    
    return {
      loading,
      error,
      chartData,
      chartOptions,
      isEmpty,
      totalMessages,
      statusItems,
      fetchData
    };
  }
};
</script>

<style scoped>
.delivery-rate-chart {
  background-color: var(--card-bg-color);
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 16px;
  margin-bottom: 20px;
  height: 350px;
  position: relative;
  overflow: hidden;
  transition: box-shadow 0.3s ease, transform 0.3s ease;
}

.delivery-rate-chart:hover {
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

.chart-container {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.chart-title {
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 16px;
  color: var(--text-color);
}

.chart-wrapper {
  position: relative;
  height: 180px;
  margin-bottom: 16px;
}

.doughnut-chart-container {
  position: relative;
  height: 100%;
}

.chart-center-stats {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1;
  text-align: center;
  width: 100px;
}

.total-messages {
  display: flex;
  flex-direction: column;
}

.total-value {
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--text-color);
}

.total-label {
  font-size: 0.75rem;
  color: var(--text-muted);
  margin-top: 4px;
}

.status-legend {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.status-item {
  display: flex;
  align-items: center;
  padding: 8px;
  border-radius: 6px;
  background-color: rgba(0, 0, 0, 0.03);
  transition: background-color 0.2s;
}

.status-item:hover {
  background-color: rgba(0, 0, 0, 0.06);
}

.status-color {
  width: 12px;
  height: 12px;
  border-radius: 3px;
  margin-right: 10px;
}

.status-info {
  flex: 1;
  display: flex;
  justify-content: space-between;
}

.status-label {
  font-size: 0.85rem;
  color: var(--text-color);
}

.status-count {
  display: flex;
  align-items: center;
  gap: 4px;
}

.count-value {
  font-weight: 600;
  color: var(--text-color);
}

.count-percentage {
  font-size: 0.75rem;
  color: var(--text-muted);
}

.chart-loader, .chart-error, .no-data {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: var(--text-muted);
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-left-color: var(--primary-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.chart-error svg, .no-data svg {
  font-size: 2rem;
  margin-bottom: 16px;
  color: var(--danger-color);
}

.no-data svg {
  color: var(--text-muted);
}

.retry-btn {
  margin-top: 12px;
  padding: 6px 12px;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: background-color 0.3s;
}

.retry-btn:hover {
  background-color: var(--primary-color-dark);
}

@media (max-width: 768px) {
  .status-legend {
    grid-template-columns: 1fr;
  }
}
</style> 