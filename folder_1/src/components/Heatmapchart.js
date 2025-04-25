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
const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);
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
  let minValue = heatmapData.metadata?.min_price || 0;
  let maxValue = heatmapData.metadata?.max_price || 0;

  heatmapData.matrix.forEach((row) => {
    xLabels.forEach((bed) => {
      const value = row[bed];
      if (value !== undefined) {
        matrixData.push({
          x: bed,
          y: row.bath,
          v: value,
        });
      }
    });
  });

  const getHeatmapColor = (value) => {
    // Ensure value is a number and handle edge case
    const numberValue = Number(value);
    if (isNaN(numberValue) || maxValue === minValue) return 'rgba(255, 255, 255, 0.8)';
    
    // Calculate normalized value between 0 and 1
    const normalized = Math.max(0, Math.min(1, (numberValue - minValue) / (maxValue - minValue)));
    
    // Color gradient from light yellow to deep red
    const r = 255;
    const g = Math.floor(255 - normalized * 200);
    const b = Math.floor(200 - normalized * 200);
    
    return `rgba(${r}, ${g}, ${b}, 0.8)`;
  };

  const chartData = {
    datasets: [
      {
        label: 'Average Price',
        data: matrixData,
        backgroundColor: (ctx) => getHeatmapColor(ctx.raw?.v),
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
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: '#1e293b',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: '#334155',
        borderWidth: 1,
        callbacks: {
          title: () => '',
          label: (ctx) => `Bed: ${ctx.raw.x}, Bath: ${ctx.raw.y}, Avg Price: $${Math.round(ctx.raw.v).toLocaleString()}`,
        },
      },
    },
    scales: {
      x: {
        type: 'category',
        labels: xLabels,
        offset: true,
        title: {
          display: true,
          text: 'Bedrooms',
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
          display: false
        }
      },
      y: {
        type: 'category',
        labels: yLabels,
        offset: true,
        reverse: false,
        title: {
          display: true,
          text: 'Bathrooms',
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
          display: false
        }
      }
    }
  };
  
  

  return (
    <div>
      <h4 className="text-base font-bold mb-4 text-left">
        Average Property Price in {capitalize(selectedCity)}
      </h4>
  
      {/* Chart and Legend container */}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {/* Chart container */}
        <div style={{ height: '260px', width: '100%' }}>
          <Chart
            key={`heatmap-${selectedCity}`}
            type="matrix"
            data={chartData}
            options={options}
          />
        </div>
  
        {/* Horizontal legend */}
        <div
          style={{
            marginTop: '12px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          {/* Gradient bar */}
          <div
            style={{
              width: '80%',
              height: '12px',
              background: 'linear-gradient(to right, #ffffcc, #ffaa00, #ff3300)',
              borderRadius: '4px',
              position: 'relative'
            }}
          ></div>
  
          {/* Min and max labels */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              width: '80%',
              fontSize: '10px',
              marginTop: '4px',
              color: 'white'
            }}
          >
            <span>${Math.round(minValue / 1000).toLocaleString()}K</span>
            <span>${Math.round(maxValue / 1000).toLocaleString()}K</span>
          </div>
        </div>
      </div>
    </div>
  );
  };

export default HeatmapChart;