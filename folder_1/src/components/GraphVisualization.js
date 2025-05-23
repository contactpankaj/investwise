

import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend
} from 'recharts';

const GraphVisualization = ({ forecastData, selectedCity, selectedState }) => {
  if (!forecastData || forecastData.length === 0) {
    return <div className="text-gray-500">Submit the form to see forecast data here.</div>;
  }

  const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

  const title =
    selectedCity && selectedState
      ? `Price Trend and Prediction for ${capitalize(selectedCity)}, ${capitalize(selectedState)}`
      : 'Price Forecast';
  

  // Split historical and forecast data
  const historical = forecastData
    .filter((d) => d.average_price !== undefined)
    .map((d) => ({
      year: d.year,
      historical: d.average_price
    }));

  const forecast = forecastData
    .filter((d) => d.predicted_price !== undefined)
    .map((d) => ({
      year: d.year,
      forecast: d.predicted_price
    }));

  // Append first forecast point to historical line to create a seamless connection
  const extendedHistorical = [...historical];
  if (forecast.length > 0) {
    extendedHistorical.push({
      year: forecast[0].year,
      historical: forecast[0].forecast,
    });
  }

  // Merge both by year
  const mergedData = [...extendedHistorical, ...forecast].reduce((acc, curr) => {
    const existing = acc.find(item => item.year === curr.year);
    if (existing) {
      Object.assign(existing, curr);
    } else {
      acc.push({ ...curr });
    }
    return acc;
  }, []);

  return (
    <div>
      <h4 className="text-sm font-bold mb-2 text-left">{title}</h4>
      <ResponsiveContainer width="100%" height={180}>
      <LineChart data={mergedData}>
      <CartesianGrid stroke="#334155" strokeDasharray="3 3" />

      <XAxis 
        dataKey="year" 
        tick={{ fill: 'white', fontSize: 12 }} // ✅ x-axis label color
        axisLine={{ stroke: 'white' }}         // ✅ x-axis line color
        tickLine={{ stroke: 'white' }}         // ✅ x-axis tick line color
      />

      <YAxis 
        tick={{ fill: 'white', fontSize: 12 }} // ✅ y-axis label color
        axisLine={{ stroke: 'white' }}         // ✅ y-axis line color
        tickLine={{ stroke: 'white' }}         // ✅ y-axis tick line color
        tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
      />

      <Tooltip 
        contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', color: 'white' }}
        labelStyle={{ color: 'white' }}
        itemStyle={{ color: 'white' }}
        formatter={(value) => `$${value.toLocaleString()}`}
      />

      <Legend 
        wrapperStyle={{ color: 'white' }}  // ✅ legend font color
      />

      <Line
        type="monotone"
        dataKey="historical"
        stroke="#10b981"
        name="Historical"
        strokeWidth={2}
        dot
      />
      <Line
        type="monotone"
        dataKey="forecast"
        stroke="#3b82f6"
        name="Forecast"
        strokeWidth={2}
        dot
      />
    </LineChart>

      </ResponsiveContainer>
    </div>
  );
};

export default GraphVisualization;
