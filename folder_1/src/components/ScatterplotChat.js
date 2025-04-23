// file: ScatterplotChart.js
import React from 'react';
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  Tooltip,
  Title
} from 'chart.js';
import { Chart } from 'react-chartjs-2';

ChartJS.register(
  LinearScale,
  PointElement,
  Tooltip,
  Title
);

const ScatterplotChart = ({ scatterData, selectedCity, loading }) => {
  if (loading) {
    return <div>Loading scatterplot data...</div>;
  }

  if (!scatterData || !scatterData.length) {
    return <div>No scatterplot data available for {selectedCity}.</div>;
  }

  const chartData = {
    datasets: [
      {
        label: `Price vs House Size in ${selectedCity}`,
        data: scatterData.map((d) => ({ x: d.house_size, y: d.price })),
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        pointRadius: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      tooltip: {
        callbacks: {
          label: (ctx) => `Size: ${ctx.raw.x} sqft, Price: $${ctx.raw.y.toLocaleString()}`,
        },
      },
    },
    scales: {
      x: {
        title: { display: true, text: 'House Size (sqft)' },
      },
      y: {
        title: { display: true, text: 'Price (USD)' },
      },
    },
  };

  return (
    <div>
      <h4 className="text-base font-bold mb-4 text-left">
        House Size vs Price in {selectedCity}
      </h4>
      <div style={{ height: '300px' }}>
        <Chart type="scatter" data={chartData} options={options} />
      </div>
    </div>
  );
};

export default ScatterplotChart;
