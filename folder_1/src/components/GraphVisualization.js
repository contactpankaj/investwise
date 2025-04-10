import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer
} from 'recharts';

const GraphVisualization = ({ forecastData }) => {
  if (!forecastData || forecastData.length === 0) {
    return <div className="text-gray-500">Submit the form to see forecast data here.</div>;
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-2">10-Year Price Forecast</h2>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={forecastData}>
          <CartesianGrid stroke="#ccc" />
          <XAxis dataKey="year" />
          <YAxis dataKey="predicted_price" />
          <Tooltip />
          <Line type="monotone" dataKey="predicted_price" stroke="#3b82f6" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GraphVisualization;

