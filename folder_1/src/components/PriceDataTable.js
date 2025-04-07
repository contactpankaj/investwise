import React from 'react';
import { getPriceCategory } from '../utils/colorutils';

const PriceDataTable = ({ locationData, stateGeoJson }) => {
  if (!locationData || locationData.length === 0) {
    return null;
  }

  return (
    <div className="mt-4">
      <h2 className="text-xl font-bold mb-2">Price Data by Zip Code</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border">
          <thead>
            <tr>
              <th className="border p-2">Zip Code</th>
              <th className="border p-2">Average Price</th>
              <th className="border p-2">Normalized Price</th>
              <th className="border p-2">Price Category</th>
              <th className="border p-2">Boundary Status</th>
            </tr>
          </thead>
          <tbody>
            {locationData.map((item) => {
              const hasGeoData = stateGeoJson && 
                stateGeoJson.features.some(f => f.properties.ZCTA5CE10 === item.zip);
              
              return (
                <tr key={item.zip}>
                  <td className="border p-2">{item.zip}</td>
                  <td className="border p-2">${item.avgPrice.toLocaleString()}</td>
                  <td className="border p-2">{item.normalizedPrice.toFixed(2)}</td>
                  <td className="border p-2">{getPriceCategory(item.normalizedPrice)}</td>
                  <td className="border p-2">
                    {hasGeoData ? 
                      <span className="text-green-600">Loaded</span> : 
                      <span className="text-red-600">Not Found</span>
                    }
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PriceDataTable;