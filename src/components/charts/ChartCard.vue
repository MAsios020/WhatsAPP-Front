<template>
  <div class="chart-card">
    <div class="chart-header">
      <h3 class="chart-title">{{ title }}</h3>
      <div class="chart-actions" v-if="showRefresh">
        <button @click="refresh" class="refresh-btn">
          <font-awesome-icon :icon="['fas', 'sync-alt']" />
        </button>
      </div>
    </div>
    <div class="chart-body" :class="{ 'is-loading': loading }">
      <div v-if="loading" class="chart-loader">
        <font-awesome-icon :icon="['fas', 'spinner']" spin />
      </div>
      <div v-else-if="error" class="chart-error">
        <font-awesome-icon :icon="['fas', 'exclamation-triangle']" />
        <p>{{ error }}</p>
      </div>
      <div v-else class="chart-container">
        <component
          :is="chartComponent"
          v-if="chartData"
          :chart-data="chartData"
          :options="chartOptions"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { DoughnutChart, BarChart, LineChart, PieChart } from 'vue-chart-3';
import { Chart, registerables } from 'chart.js';

// Register Chart.js components
Chart.register(...registerables);

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  chartType: {
    type: String,
    required: true,
    validator: (value: string) => ['pie', 'bar', 'line', 'doughnut'].includes(value)
  },
  chartData: {
    type: Object,
    required: true
  },
  chartOptions: {
    type: Object,
    default: () => ({})
  },
  loading: {
    type: Boolean,
    default: false
  },
  error: {
    type: String,
    default: ''
  },
  showRefresh: {
    type: Boolean,
    default: true
  }
});

const emit = defineEmits(['refresh']);

const refresh = () => {
  emit('refresh');
};

const chartComponent = computed(() => {
  switch (props.chartType) {
    case 'pie':
      return PieChart;
    case 'bar':
      return BarChart;
    case 'line':
      return LineChart;
    case 'doughnut':
      return DoughnutChart;
    default:
      return BarChart;
  }
});
</script>

<style scoped>
.chart-card {
  background-color: var(--card-bg, #ffffff);
  border-radius: 0.75rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  padding: 1.25rem;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: all 0.3s ease;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.chart-title {
  font-size: 1rem;
  font-weight: 600;
  margin: 0;
  color: var(--text-primary, #333333);
}

.chart-actions {
  display: flex;
  gap: 0.5rem;
}

.refresh-btn {
  background: transparent;
  border: none;
  color: var(--text-secondary, #666666);
  cursor: pointer;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.refresh-btn:hover {
  background-color: var(--hover-bg, rgba(0, 0, 0, 0.05));
  color: var(--primary, #4361ee);
}

.chart-body {
  position: relative;
  flex-grow: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 200px;
}

.chart-container {
  width: 100%;
  height: 100%;
}

.chart-loader, .chart-error {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary, #666666);
  gap: 0.5rem;
}

.chart-error {
  color: var(--danger, #ef4444);
}

.is-loading {
  opacity: 0.7;
}

.chart-body canvas {
  width: 100% !important;
  height: auto !important;
}
</style> 