import React from 'react';
import { legendItems } from '../utils/colorutils';

const Legend = () => {
  return (
    <div className="mt-4 p-3 border rounded">
      <h3 className="font-bold mb-2">Price Legend (Normalized)</h3>
      <div className="flex flex-wrap gap-4">
        {legendItems.map((item, index) => (
          <div key={index} className="flex items-center">
            <div className="w-4 h-4 mr-1" style={{ backgroundColor: item.color }}></div>
            <span>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Legend;