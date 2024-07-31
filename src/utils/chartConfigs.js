// src/utils/chartConfigs.js

export const getSuccessFailChartOptions = (onDataPointSelection, onChartClick) => ({
  labels: ['Success', 'Fail'],
  colors: ['#4caf50', '#f44336'],
  legend: { position: 'bottom' },
  chart: {
    events: {
      dataPointSelection: onDataPointSelection,
      click: onChartClick
    }
  },
  responsive: [{
    breakpoint: 480,
    options: {
      chart: { width: 200 },
      legend: { position: 'bottom' }
    }
  }]
});

export const getStatusCodeChartOptions = (statusCodeCounts, onDataPointSelection, onChartClick) => ({
  labels: Object.keys(statusCodeCounts),
  legend: { position: 'bottom' },
  chart: {
    events: {
      dataPointSelection: onDataPointSelection,
      click: onChartClick
    }
  },
  responsive: [{
    breakpoint: 480,
    options: {
      chart: { width: 200 },
      legend: { position: 'bottom' }
    }
  }]
});

export const responseTimeChartOptions = {
  chart: {
    type: 'bar',
    height: 350
  },
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: '55%',
      endingShape: 'rounded'
    },
  },
  dataLabels: {
    enabled: false
  },
  stroke: {
    show: true,
    width: 2,
    colors: ['transparent']
  },
  xaxis: {
    categories: ['Below 10s', '10s to 30s', 'Above 30s'],
  },
  yaxis: {
    title: {
      text: 'Number of APIs'
    }
  },
  fill: {
    opacity: 1
  },
  tooltip: {
    y: {
      formatter: function (val) {
        return val + " APIs"
      }
    }
  }
};