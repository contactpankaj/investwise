import React from 'react';
import { stateNames, popularCities } from '../utils/statedata';

const SearchControls = ({ 
  selectedState, 
  setSelectedState, 
  selectedCity, 
  setSelectedCity, 
  handleSubmit, 
  loading, 
  geoJsonLoading 
}) => {
  // Handle state selection change
  const handleStateChange = (e) => {
    const newState = e.target.value.toLowerCase();
    setSelectedState(newState);
  };

  // Handle city input change
  const handleCityChange = (e) => {
    setSelectedCity(e.target.value);
  };

  // Set city from dropdown of suggestions
  const handleCitySelect = (city) => {
    setSelectedCity(city);
  };

  return (
    <div className="flex flex-wrap gap-4 mb-4">
      <div>
        <label className="block mb-1">State:</label>
        <select 
          className="border p-2 rounded"
          value={selectedState}
          onChange={handleStateChange}
        >
          {Object.entries(stateNames).map(([code, name]) => (
            <option key={code} value={code}>{name}</option>
          ))}
        </select>
      </div>
      
      <div>
        <label className="block mb-1">City:</label>
        <input 
          type="text" 
          className="border p-2 rounded"
          value={selectedCity}
          onChange={handleCityChange}
          placeholder="City name"
        />
        {/* Popular cities for quick selection */}
        <div className="mt-1 flex flex-wrap gap-1">
          {popularCities[selectedState]?.map(city => (
            <button 
              key={city}
              onClick={() => handleCitySelect(city)}
              className="text-xs bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded"
            >
              {city}
            </button>
          ))}
        </div>
      </div>
      
      <div className="flex items-end">
        <button 
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          onClick={handleSubmit}
          disabled={loading || geoJsonLoading}
        >
          {loading ? 'Loading Price Data...' : 
           geoJsonLoading ? 'Loading ZIP Boundaries...' : 'Load Heatmap'}
        </button>
      </div>
    </div>
  );
};

export default SearchControls;