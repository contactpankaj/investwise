// file: PricePerSqftChart.js
import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const PricePerSqftChart = ({ chartData, selectedState, loading }) => {
  if (loading) return <div>Loading price per square foot data...</div>;
  if (!chartData || !chartData.length) return <div>No data available for {selectedState}</div>;

  const data = {
    labels: chartData.map((d) => d.city.toUpperCase()),
    datasets: [
      {
        label: 'Avg Price per Sqft (USD)',
        data: chartData.map((d) => d.price_per_sqft),
        backgroundColor: 'rgba(75, 192, 192, 0.7)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => `$${ctx.raw}`
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'USD ($)',
        }
      },
      x: {
        title: {
          display: true,
          text: 'City',
        }
      }
    }
  };

  return (
    <div>
      <h4 className="text-base font-bold mb-4 text-left">
        Avg Price per Sqft in {selectedState}
      </h4>
      <div style={{ height: '320px' }}>
        <Bar data={data} options={options} />
      </div>
    </div>
  );
};

export default PricePerSqftChart;
