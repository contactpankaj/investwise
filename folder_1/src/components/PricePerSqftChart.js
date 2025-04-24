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
const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);
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
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
        labels: {
          color: 'white',
          font: {
            size: 12,
            family: 'inherit'
          }
        }
      },
      tooltip: {
        backgroundColor: '#1e293b',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: '#334155',
        borderWidth: 1,
        callbacks: {
          label: (ctx) => `$${ctx.raw}`
        }
      },
      title: {
        display: false
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'USD ($)',
          color: 'white',
          font: {
            size: 12,
            family: 'inherit'
          }
        },
        ticks: {
          color: 'white',
          font: {
            size: 12,
            family: 'inherit'
          }
        },
        grid: {
          color: 'rgba(255,255,255,0.1)'
        }
      },
      x: {
        title: {
          display: true,
          text: 'City',
          color: 'white',
          font: {
            size: 12,
            family: 'inherit'
          }
        },
        ticks: {
          color: 'white',
          font: {
            size: 12,
            family: 'inherit'
          }
        },
        grid: {
          color: 'rgba(255,255,255,0.1)'
        }
      }
    }
  };
  

  return (
    <div>
      <h4 className="text-base font-bold mb-4 text-left">
        Avg Price per Sqft in {capitalize(selectedState)}
      </h4>
      <div style={{ height: '320px' }}>
        <Bar data={data} options={options} />
      </div>
    </div>
  );
};

export default PricePerSqftChart;
