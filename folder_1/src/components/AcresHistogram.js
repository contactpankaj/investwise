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

const AcresHistogram = ({ histogramData, selectedState, selectedCity, loading }) => {
  if (loading) {
    return (
      <div>
        <h4 className="text-base font-bold mb-4 text-left">
          House size Distribution in {capitalize(selectedCity)}, {capitalize(selectedState)}
        </h4>
        <div className="text-gray-500">Loading histogram data...</div>
      </div>
    );
  }

  if (!histogramData) {
    return (
      <div>
        <h4 className="text-base font-bold mb-4 text-left">
          House size Distribution in {capitalize(selectedCity)}, {capitalize(selectedState)}
        </h4>
        <div className="text-gray-500">
          Submit a search to view the acres distribution.
        </div>
      </div>
    );
  }

  const formatLabels = () => {
    if (!histogramData?.metadata?.bin_edges) return histogramData?.labels || [];

    const binEdges = histogramData.metadata.bin_edges;
    return binEdges.slice(0, -1).map((edge, i) => {
      const precision = (binEdges[i + 1] - edge) < 1 ? 2 : 1;
      return `${edge.toFixed(precision)}`;
    });
  };

  const chartData = {
    labels: formatLabels(),
    datasets: [
      {
        label: 'Number of Properties',
        data: histogramData?.frequencies || [],
        backgroundColor: 'rgba(216, 191, 255, 0.6)', // ✅ light orange-yellow
        borderColor: 'rgba(153, 102, 255, 1)',        // ✅ medium orange
        borderWidth: 1,
      },
    ],
    
  };

  const maxFrequency = Math.max(...(histogramData?.frequencies || [0]));
  const yStepSize = Math.max(1, Math.ceil(maxFrequency / 10));

  const calculateTickSettings = () => {
    if (!histogramData?.metadata) return {};
    const range = histogramData.metadata.max_acres - histogramData.metadata.min_acres;

    if (range <= 1) return { maxTicksLimit: 15, precision: 2 };
    if (range <= 5) return { maxTicksLimit: 10, precision: 1 };
    return { maxTicksLimit: 8, precision: 0 };
  };

  const tickSettings = calculateTickSettings();

  const options = {
    responsive: true,
    // maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: 'white',      // ✅ Legend font color
          font: {
            size: 12,
            family: 'inherit', // Match default site font
          },
        },
      },
      title: {
        display: false,
      },
      tooltip: {
        backgroundColor: '#1e293b',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: '#334155',
        borderWidth: 1,
        callbacks: {
          label: (ctx) => `Properties: ${ctx.parsed.y}`,
          title: (ctx) => {
            if (histogramData?.metadata?.bin_edges) {
              const i = ctx[0].dataIndex;
              const edges = histogramData.metadata.bin_edges;
              const precision = (edges[i + 1] - edges[i]) < 1 ? 2 : 2;
              const start = (edges[i] / 1000).toFixed(precision);
              const end = (edges[i + 1] / 1000).toFixed(precision);
              return `${start} - ${end} acres`;
            }
            return ctx[0].label;
          }
          
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Number of Properties',
          color: 'white',
          font: {
            size: 40,
            family: 'inherit',
          },
        },
        ticks: {
          color: 'white',
          precision: 0,
          stepSize: yStepSize,
          font: {
            size: 12,
            family: 'inherit',
          },
        },
        grid: {
          color: 'rgba(255,255,255,0.1)',
        },
      },
      x: {
        title: {
          display: true,
          text: 'Acres',
          color: 'white',
          font: {
            size: 50,
            family: 'inherit',
          },
        },
        ticks: {
          color: 'white',
          maxRotation: 45,
          minRotation: 45,
          autoSkip: true,
          maxTicksLimit: tickSettings.maxTicksLimit || 10,
          precision: tickSettings.precision || 1,
          font: {
            size: 12,
            family: 'inherit',
          },
          callback: function (value, index) {
            const originalLabel = this.getLabelForValue(value);
            const numericValue = parseFloat(originalLabel);
            if (histogramData?.frequencies?.length > 20) {
              if (index % 2 !== 0 && index !== histogramData.frequencies.length - 1) return null;
            }
            return (numericValue / 1000).toFixed(2);
          }
        },
        afterTickToLabelConversion: (data) => {
          if (histogramData?.metadata?.bin_edges && data.ticks && data.labels) {
            const lastEdge = histogramData.metadata.bin_edges.at(-1);
            const precision = tickSettings.precision || 1;
            const lastTick = lastEdge.toFixed(precision);
            if (!data.ticks.includes(lastTick)) {
              data.ticks.push(lastTick);
              data.labels.push(lastTick);
            }
          }
        },
        grid: {
          color: 'rgba(255,255,255,0.1)',
        },
      }
    }
  };
  

  return (
    <div>
      <h4 className="text-base font-bold mb-4 text-left">
        House size Distribution in {capitalize(selectedCity)}, {capitalize(selectedState)}
      </h4>
      <div style={{ height: '400px' }}>
        <Bar
          key={`histogram-${selectedState}-${selectedCity}`}
          options={options}
          data={chartData}
        />
      </div>
    </div>
  );
};

export default AcresHistogram;
