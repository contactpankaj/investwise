import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement
} from 'chart.js';
import { MatrixController, MatrixElement } from 'chartjs-chart-matrix';
import { Chart } from 'react-chartjs-2';
import 'chartjs-adapter-date-fns';

ChartJS.register(
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  MatrixController,
  MatrixElement
);

const HeatmapChart = ({ heatmapData, selectedCity, loading }) => {
  if (loading) {
    return (
      <div>
        <h4 className="text-base font-bold mb-4 text-left">
          Property Bed-Bath Matrix in {selectedCity}
        </h4>
        <div className="text-gray-500">Loading heatmap data...</div>
      </div>
    );
  }

  if (!heatmapData || !heatmapData.matrix?.length) {
    return (
      <div>
        <h4 className="text-base font-bold mb-4 text-left">
          Property Bed-Bath Matrix in {selectedCity}
        </h4>
        <div className="text-gray-500">No data available for this city.</div>
      </div>
    );
  }

  const xLabels = heatmapData.beds.map(Number);
  const yLabels = heatmapData.baths.map(Number);

  const matrixData = [];
  let maxValue = 0;

  heatmapData.matrix.forEach((row) => {
    xLabels.forEach((bed) => {
      const value = row[bed];
      if (value && value > 0) {
        matrixData.push({
          x: bed,
          y: row.bath,
          v: value,
        });
        if (value > maxValue) maxValue = value;
      }
    });
  });

  const getHeatmapColor = (value) => {
    const ratio = value / maxValue;
    const r = 255;
    const g = Math.floor(200 - ratio * 150); // fade green
    const b = Math.floor(200 - ratio * 200); // fade blue
    return `rgba(${r}, ${g}, ${b}, 0.8)`;
  };

  const chartData = {
    datasets: [
      {
        label: 'Average Price',
        data: matrixData,
        backgroundColor: (ctx) => getHeatmapColor(ctx.raw.v),
        borderWidth: 1,
        width: ({ chart }) => {
          if (!chart.chartArea) return 10;
          return chart.chartArea.width / xLabels.length - 2;
        },
        height: ({ chart }) => {
          if (!chart.chartArea) return 10;
          return chart.chartArea.height / yLabels.length - 2;
        },
      },
    ],
  };

  const options = {
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          title: () => '',
          label: (ctx) => `Bed: ${ctx.raw.x}, Bath: ${ctx.raw.y}, Avg Price: $${ctx.raw.v.toLocaleString()}`,
        },
      },
    },
    scales: {
      x: {
        type: 'category',
        labels: xLabels,
        title: { display: true, text: 'Bedrooms' },
        offset: true,
        grid: { display: false },
      },
      y: {
        type: 'category',
        labels: yLabels,
        title: { display: true, text: 'Bathrooms' },
        offset: true,
        grid: { display: false },
        reverse: false,
      },
    },
  };

  return (
    <div>
      <h4 className="text-base font-bold mb-4 text-left">
        Average Property Price in {selectedCity}
      </h4>
      <div style={{ height: '280px' }}>
        <Chart
          key={`heatmap-${selectedCity}`}
          type="matrix"
          data={chartData}
          options={options}
        />
      </div>
    </div>
  );
};

export default HeatmapChart;
