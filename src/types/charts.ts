// Chart data type definitions for dashboard visualizations

export interface ChartDataset {
  label: string;
  data: number[];
  backgroundColor?: string | string[];
  borderColor?: string | string[];
  borderWidth?: number;
  pointBackgroundColor?: string | string[];
  pointBorderColor?: string | string[];
  pointHoverBackgroundColor?: string | string[];
  pointHoverBorderColor?: string | string[];
  fill?: boolean;
  tension?: number;
}

export interface ChartData {
  labels: string[];
  datasets: ChartDataset[];
}

export interface ChartOptions {
  responsive?: boolean;
  maintainAspectRatio?: boolean;
  plugins?: {
    legend?: {
      display?: boolean;
      position?: 'top' | 'left' | 'bottom' | 'right';
      labels?: {
        color?: string;
        font?: {
          size?: number;
          family?: string;
        };
      };
    };
    title?: {
      display?: boolean;
      text?: string;
      color?: string;
      font?: {
        size?: number;
        family?: string;
      };
    };
    tooltip?: {
      enabled?: boolean;
      mode?: 'index' | 'point' | 'nearest' | 'dataset';
      intersect?: boolean;
    };
  };
  scales?: {
    x?: {
      grid?: {
        display?: boolean;
        color?: string;
        borderColor?: string;
        tickColor?: string;
      };
      ticks?: {
        color?: string;
        font?: {
          size?: number;
          family?: string;
        };
      };
      title?: {
        display?: boolean;
        text?: string;
        color?: string;
        font?: {
          size?: number;
          family?: string;
        };
      };
    };
    y?: {
      grid?: {
        display?: boolean;
        color?: string;
        borderColor?: string;
        tickColor?: string;
      };
      ticks?: {
        color?: string;
        font?: {
          size?: number;
          family?: string;
        };
      };
      title?: {
        display?: boolean;
        text?: string;
        color?: string;
        font?: {
          size?: number;
          family?: string;
        };
      };
      beginAtZero?: boolean;
    };
  };
  animation?: {
    duration?: number;
    easing?: string;
  };
}

export interface BarChartData extends ChartData {
  datasets: (ChartDataset & {
    barPercentage?: number;
    categoryPercentage?: number;
    barThickness?: number | 'flex';
    maxBarThickness?: number;
    minBarLength?: number;
  })[];
}

export interface LineChartData extends ChartData {
  datasets: (ChartDataset & {
    cubicInterpolationMode?: 'default' | 'monotone';
    stepped?: boolean | 'before' | 'after' | 'middle';
    pointRadius?: number;
    pointHoverRadius?: number;
  })[];
}

export interface PieChartData extends ChartData {
  datasets: (ChartDataset & {
    hoverOffset?: number;
    circumference?: number;
    rotation?: number;
  })[];
}

export interface DonutChartData extends PieChartData {
  datasets: (ChartDataset & {
    cutout?: string | number;
  })[];
}

export interface ChartColorPalette {
  primary: string[];
  secondary: string[];
  success: string[];
  danger: string[];
  warning: string[];
  info: string[];
  neutral: string[];
}

export interface ChartTheme {
  backgroundColor: string;
  textColor: string;
  gridColor: string;
  borderColor: string;
  colorPalette: ChartColorPalette;
} 