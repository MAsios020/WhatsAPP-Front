<template>
  <div class="message-activity-chart">
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
    <div v-else-if="!chartData.datasets[0].data.length" class="no-data">
      <font-awesome-icon icon="chart-line" />
      <p>{{ $t('dashboard.noMessageData') }}</p>
    </div>
    <div v-else class="chart-container">
      <h3 class="chart-title">{{ $t('dashboard.messageActivity') }}</h3>
      <Line 
        :data="chartData"
        :options="chartOptions"
      />
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed, watch } from 'vue';
import { Line } from 'vue-chartjs';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import axios from 'axios';
import { useI18n } from 'vue-i18n';

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default {
  name: 'MessageActivityChart',
  components: { Line },
  props: {
    period: {
      type: String,
      default: 'week', // 'day', 'week', 'month', 'year'
      validator: (value) => ['day', 'week', 'month', 'year'].includes(value)
    },
    campaignId: {
      type: [String, Number],
      default: null
    }
  },
  setup(props) {
    const { t } = useI18n();
    const loading = ref(true);
    const error = ref(false);
    const messageData = ref([]);
    
    // Chart data
    const chartData = ref({
      labels: [],
      datasets: [
        {
          label: t('dashboard.messages'),
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 2,
          pointBackgroundColor: 'rgba(75, 192, 192, 1)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgba(75, 192, 192, 1)',
          tension: 0.4,
          data: []
        }
      ]
    });
    
    // Chart options
    const chartOptions = ref({
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            precision: 0
          }
        }
      },
      plugins: {
        legend: {
          display: true,
          position: 'top'
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
              return `${context.dataset.label}: ${context.raw}`;
            }
          }
        }
      },
      interaction: {
        intersect: false,
        mode: 'index'
      }
    });
    
    // Function to format dates based on period
    const formatDate = (date, period) => {
      const options = {};
      
      switch(period) {
        case 'day':
          options.hour = '2-digit';
          options.minute = '2-digit';
          break;
        case 'week':
          options.weekday = 'short';
          break;
        case 'month':
          options.day = 'numeric';
          break;
        case 'year':
          options.month = 'short';
          break;
      }
      
      return new Date(date).toLocaleDateString(undefined, options);
    };
    
    // Generate API endpoint based on props
    const getEndpoint = computed(() => {
      let endpoint = `/api/message-activity?period=${props.period}`;
      if (props.campaignId) {
        endpoint += `&campaignId=${props.campaignId}`;
      }
      return endpoint;
    });
    
    // Fetch data from the API
    const fetchData = async () => {
      loading.value = true;
      error.value = false;
      
      try {
        // For demonstration, we'll use dummy data
        // In real implementation, you would use axios.get(getEndpoint.value)
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Generate dummy data based on period
        const now = new Date();
        let data = [];
        let labels = [];
        
        switch(props.period) {
          case 'day':
            // 24 hours data
            for (let i = 0; i < 24; i++) {
              const hour = new Date(now);
              hour.setHours(now.getHours() - (23 - i));
              labels.push(formatDate(hour, 'day'));
              data.push(Math.floor(Math.random() * 50));
            }
            break;
          case 'week':
            // 7 days data
            for (let i = 0; i < 7; i++) {
              const day = new Date(now);
              day.setDate(now.getDate() - (6 - i));
              labels.push(formatDate(day, 'week'));
              data.push(Math.floor(Math.random() * 200));
            }
            break;
          case 'month':
            // 30 days data
            for (let i = 0; i < 30; i++) {
              const day = new Date(now);
              day.setDate(now.getDate() - (29 - i));
              labels.push(formatDate(day, 'month'));
              data.push(Math.floor(Math.random() * 500));
            }
            break;
          case 'year':
            // 12 months data
            for (let i = 0; i < 12; i++) {
              const month = new Date(now);
              month.setMonth(now.getMonth() - (11 - i));
              labels.push(formatDate(month, 'year'));
              data.push(Math.floor(Math.random() * 2000));
            }
            break;
        }
        
        // Update chart data
        chartData.value.labels = labels;
        chartData.value.datasets[0].data = data;
        messageData.value = data;
        
      } catch (err) {
        console.error('Error fetching message activity data:', err);
        error.value = true;
      } finally {
        loading.value = false;
      }
    };
    
    // Watch for changes in props to refetch data
    watch(() => [props.period, props.campaignId], () => {
      fetchData();
    }, { immediate: false });
    
    // Initial data fetch
    onMounted(() => {
      fetchData();
    });
    
    return {
      loading,
      error,
      chartData,
      chartOptions,
      messageData,
      fetchData
    };
  }
};
</script>

<style scoped>
.message-activity-chart {
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

.message-activity-chart:hover {
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