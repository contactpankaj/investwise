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
    maintainAspectRatio: false,
    plugins: {
      tooltip: {
        backgroundColor: '#1e293b',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: '#334155',
        borderWidth: 1,
        callbacks: {
          label: (ctx) => `Size: ${ctx.raw.x} sqft, Price: $${ctx.raw.y.toLocaleString()}`,
        },
      },
      legend: {
        labels: {
          color: 'white',
          font: {
            size: 12,
            family: 'inherit',
          }
        }
      },
      title: {
        display: false
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'House Size (sqft)',
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
          color: 'rgba(255,255,255,0.1)',
        }
      },
      y: {
        title: {
          display: true,
          text: 'Price (USD)',
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
          color: 'rgba(255,255,255,0.1)',
        }
      }
    }
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
