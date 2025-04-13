<template>
  <div class="campaign-status-chart">
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
      <p>{{ $t('dashboard.noCampaignData') }}</p>
    </div>
    <div v-else class="chart-container">
      <h3 class="chart-title">{{ $t('dashboard.campaignStatus') }}</h3>
      <div class="chart-stats">
        <div v-for="(stat, index) in statusStats" :key="index" class="stat-item">
          <div class="stat-color" :style="{ backgroundColor: chartColors[index] }"></div>
          <div class="stat-label">{{ stat.label }}</div>
          <div class="stat-value">{{ stat.value }}</div>
          <div class="stat-percentage">{{ stat.percentage }}%</div>
        </div>
      </div>
      <div class="pie-chart-container">
        <Pie 
          :data="chartData"
          :options="chartOptions"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { Pie } from 'vue-chartjs';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { useI18n } from 'vue-i18n';

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend);

export default {
  name: 'CampaignStatusChart',
  components: { Pie },
  setup() {
    const { t } = useI18n();
    const loading = ref(true);
    const error = ref(false);
    const campaignData = ref([]);
    
    // Chart colors
    const chartColors = [
      '#4CAF50', // Active
      '#FFC107', // Scheduled
      '#F44336', // Failed
      '#9E9E9E', // Draft
      '#2196F3'  // Completed
    ];
    
    const colorOpacity = 0.8;
    
    // Chart data
    const chartData = ref({
      labels: [],
      datasets: [{
        data: [],
        backgroundColor: [],
        borderColor: [],
        borderWidth: 2
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
      cutout: '60%',
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
    
    // Prepare stats for display
    const statusStats = computed(() => {
      if (isEmpty.value) return [];
      
      const total = chartData.value.datasets[0].data.reduce((acc, val) => acc + val, 0);
      
      return chartData.value.labels.map((label, index) => {
        const value = chartData.value.datasets[0].data[index];
        const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
        
        return {
          label,
          value,
          percentage
        };
      });
    });
    
    // Fetch data from API
    const fetchData = async () => {
      loading.value = true;
      error.value = false;
      
      try {
        // For demonstration, we'll use dummy data
        // In real implementation, you would use axios.get('/api/campaign-stats')
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data
        const mockData = {
          labels: [
            t('campaigns.statuses.active'),
            t('campaigns.statuses.scheduled'),
            t('campaigns.statuses.failed'),
            t('campaigns.statuses.draft'),
            t('campaigns.statuses.completed')
          ],
          data: [15, 8, 3, 6, 12]
        };
        
        // Update chart data
        chartData.value.labels = mockData.labels;
        chartData.value.datasets[0].data = mockData.data;
        chartData.value.datasets[0].backgroundColor = chartColors.map(color => {
          const rgbColor = hexToRgb(color);
          return `rgba(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b}, ${colorOpacity})`;
        });
        chartData.value.datasets[0].borderColor = chartColors;
        
        campaignData.value = mockData.data;
        
      } catch (err) {
        console.error('Error fetching campaign status data:', err);
        error.value = true;
      } finally {
        loading.value = false;
      }
    };
    
    // Helper function to convert hex to rgb
    function hexToRgb(hex) {
      // Remove # if present
      hex = hex.replace('#', '');
      
      // Parse the hex values
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);
      
      return { r, g, b };
    }
    
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
      statusStats,
      chartColors,
      fetchData
    };
  }
};
</script>

<style scoped>
.campaign-status-chart {
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

.campaign-status-chart:hover {
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

.pie-chart-container {
  flex: 1;
  position: relative;
}

.chart-stats {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 16px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.85rem;
}

.stat-color {
  width: 12px;
  height: 12px;
  border-radius: 2px;
}

.stat-label {
  color: var(--text-color);
  font-weight: 500;
}

.stat-value {
  color: var(--text-muted);
  margin-left: 4px;
}

.stat-percentage {
  color: var(--primary-color);
  font-weight: 600;
  margin-left: 2px;
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
</style> 