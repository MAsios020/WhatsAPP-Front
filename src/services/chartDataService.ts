import { 
  BarChartData, 
  LineChartData, 
  PieChartData,
  DonutChartData,
  ChartOptions,
  ChartTheme,
  ChartColorPalette
} from '@/types/charts';

// Default color palette
const defaultPalette: ChartColorPalette = {
  primary: ['#4F46E5', '#818CF8', '#A5B4FC', '#C7D2FE', '#E0E7FF'],
  secondary: ['#7C3AED', '#A78BFA', '#C4B5FD', '#DDD6FE', '#EDE9FE'],
  success: ['#10B981', '#34D399', '#6EE7B7', '#A7F3D0', '#D1FAE5'],
  danger: ['#EF4444', '#F87171', '#FCA5A5', '#FECACA', '#FEE2E2'],
  warning: ['#F59E0B', '#FBBF24', '#FCD34D', '#FDE68A', '#FEF3C7'],
  info: ['#3B82F6', '#60A5FA', '#93C5FD', '#BFDBFE', '#DBEAFE'],
  neutral: ['#1F2937', '#4B5563', '#9CA3AF', '#D1D5DB', '#F3F4F6']
};

// Light theme
const lightTheme: ChartTheme = {
  backgroundColor: '#FFFFFF',
  textColor: '#1F2937',
  gridColor: '#E5E7EB',
  borderColor: '#D1D5DB',
  colorPalette: defaultPalette
};

// Dark theme
const darkTheme: ChartTheme = {
  backgroundColor: '#1F2937',
  textColor: '#F9FAFB',
  gridColor: '#374151',
  borderColor: '#4B5563',
  colorPalette: defaultPalette
};

class ChartDataService {
  private activeTheme: ChartTheme = lightTheme;
  
  setTheme(isDark: boolean): void {
    this.activeTheme = isDark ? darkTheme : lightTheme;
  }
  
  getCommonOptions(): ChartOptions {
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          labels: {
            color: this.activeTheme.textColor,
            font: {
              size: 12
            }
          }
        },
        tooltip: {
          enabled: true,
          mode: 'index',
          intersect: false
        }
      },
      scales: {
        x: {
          grid: {
            display: true,
            color: this.activeTheme.gridColor
          },
          ticks: {
            color: this.activeTheme.textColor
          }
        },
        y: {
          beginAtZero: true,
          grid: {
            display: true,
            color: this.activeTheme.gridColor
          },
          ticks: {
            color: this.activeTheme.textColor
          }
        }
      },
      animation: {
        duration: 750,
        easing: 'easeOutQuart'
      }
    };
  }
  
  // Message statistics
  getMessagesByStatusData(): PieChartData {
    return {
      labels: ['Sent', 'Delivered', 'Read', 'Failed', 'Pending'],
      datasets: [{
        label: 'Message Status',
        data: [45, 30, 15, 5, 5],
        backgroundColor: [
          this.activeTheme.colorPalette.success[0],
          this.activeTheme.colorPalette.info[0],
          this.activeTheme.colorPalette.primary[0],
          this.activeTheme.colorPalette.danger[0],
          this.activeTheme.colorPalette.warning[0]
        ],
        borderWidth: 1
      }]
    };
  }
  
  // Daily message trends
  getMessageTrendsData(): LineChartData {
    const days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    });
    
    return {
      labels: days,
      datasets: [
        {
          label: 'Sent',
          data: [65, 78, 52, 91, 43, 58, 85],
          borderColor: this.activeTheme.colorPalette.success[0],
          backgroundColor: this.activeTheme.colorPalette.success[0] + '33', // 20% opacity
          tension: 0.3,
          fill: true,
          pointRadius: 3,
          pointHoverRadius: 5
        },
        {
          label: 'Delivered',
          data: [59, 70, 45, 85, 40, 50, 75],
          borderColor: this.activeTheme.colorPalette.info[0],
          backgroundColor: this.activeTheme.colorPalette.info[0] + '33', // 20% opacity
          tension: 0.3,
          fill: true,
          pointRadius: 3,
          pointHoverRadius: 5
        },
        {
          label: 'Read',
          data: [45, 60, 40, 70, 35, 40, 60],
          borderColor: this.activeTheme.colorPalette.primary[0],
          backgroundColor: this.activeTheme.colorPalette.primary[0] + '33', // 20% opacity
          tension: 0.3,
          fill: true,
          pointRadius: 3,
          pointHoverRadius: 5
        }
      ]
    };
  }
  
  // Hourly message distribution
  getMessagesByHourData(): BarChartData {
    const hours = Array.from({ length: 24 }, (_, i) => i + ':00');
    
    // Generate random message counts with a typical daily pattern
    // (lower at night, peaks in morning, afternoon and evening)
    const getPatternData = () => {
      const basePattern = [
        5, 3, 2, 1, 1, 2,           // 0-5 (night)
        10, 25, 40, 35, 30, 25,     // 6-11 (morning)
        35, 40, 30, 25, 20, 15,     // 12-17 (afternoon)
        30, 40, 35, 25, 15, 10      // 18-23 (evening)
      ];
      
      // Add some randomness to the pattern
      return basePattern.map(val => {
        const fluctuation = Math.random() * 10 - 5; // -5 to +5
        return Math.max(0, Math.round(val + fluctuation));
      });
    };
    
    return {
      labels: hours,
      datasets: [{
        label: 'Messages per Hour',
        data: getPatternData(),
        backgroundColor: this.activeTheme.colorPalette.primary[0],
        borderWidth: 1,
        barPercentage: 0.7,
        categoryPercentage: 0.9
      }]
    };
  }
  
  // Top contacts by message count
  getTopContactsData(): BarChartData {
    return {
      labels: ['John Doe', 'Jane Smith', 'Ahmed Mohamed', 'Maria Garcia', 'Raj Patel'],
      datasets: [{
        label: 'Message Count',
        data: [120, 98, 87, 76, 65],
        backgroundColor: this.activeTheme.colorPalette.secondary,
        borderWidth: 1,
        barPercentage: 0.5,
        categoryPercentage: 0.8
      }]
    };
  }
  
  // Instance status data
  getInstanceStatusData(): DonutChartData {
    return {
      labels: ['Active', 'Disconnected', 'Pending'],
      datasets: [{
        label: 'Instance Status',
        data: [8, 2, 1],
        backgroundColor: [
          this.activeTheme.colorPalette.success[0],
          this.activeTheme.colorPalette.danger[0],
          this.activeTheme.colorPalette.warning[0]
        ],
        borderWidth: 1,
        cutout: '60%'
      }]
    };
  }
  
  // Campaign performance
  getCampaignPerformanceData(): BarChartData {
    return {
      labels: ['Campaign A', 'Campaign B', 'Campaign C', 'Campaign D', 'Campaign E'],
      datasets: [
        {
          label: 'Sent',
          data: [250, 320, 180, 420, 150],
          backgroundColor: this.activeTheme.colorPalette.primary[0],
          borderWidth: 1
        },
        {
          label: 'Delivered',
          data: [230, 300, 165, 380, 140],
          backgroundColor: this.activeTheme.colorPalette.info[0],
          borderWidth: 1
        },
        {
          label: 'Read',
          data: [180, 250, 120, 310, 90],
          backgroundColor: this.activeTheme.colorPalette.success[0],
          borderWidth: 1
        },
        {
          label: 'Responded',
          data: [75, 150, 50, 180, 40],
          backgroundColor: this.activeTheme.colorPalette.secondary[0],
          borderWidth: 1
        }
      ]
    };
  }
  
  // Monthly account growth
  getAccountGrowthData(): LineChartData {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentMonth = new Date().getMonth();
    const lastSixMonths = months.slice(Math.max(0, currentMonth - 5), currentMonth + 1);
    
    // Generate sample growth data
    const generateGrowthData = (baseValue: number, growthRate: number) => {
      return Array.from({ length: 6 }, (_, i) => {
        return Math.round(baseValue * Math.pow(1 + growthRate, i));
      });
    };
    
    return {
      labels: lastSixMonths,
      datasets: [{
        label: 'Total Accounts',
        data: generateGrowthData(50, 0.15),
        backgroundColor: 'transparent',
        borderColor: this.activeTheme.colorPalette.primary[0],
        pointBackgroundColor: this.activeTheme.colorPalette.primary[0],
        tension: 0.4,
        fill: false,
        pointRadius: 4,
        pointHoverRadius: 6
      }]
    };
  }
}

export const chartDataService = new ChartDataService();
export default chartDataService; 