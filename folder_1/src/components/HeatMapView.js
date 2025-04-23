import React from 'react';
import MapComponent from './MapComponent'; // Assuming MapComponent handles the actual rendering

const HeatMapView = ({
  mapCenter,
  mapZoom,
  stateGeoJson,
  locationData,
  selectedState,
  selectedCity,
  selectedDataType, // Accept selectedDataType prop
  setSelectedDataType, // Add this prop for handling changes
  loading // Accept loading prop
}) => {
  // Determine the title based on the selected data type
  let dataTypeLabel = 'Data'; // Default label
  if (selectedDataType === 'Price') {
    dataTypeLabel = 'Price';
  } else if (selectedDataType === 'Hospitals') {
    dataTypeLabel = 'Hospital Density';
  } else if (selectedDataType === 'Groceries') {
    dataTypeLabel = 'Grocery Density';
  }
  
  const title =
    selectedCity && selectedState
      ? `${dataTypeLabel} Heatmap for ${selectedCity}, ${selectedState}`
      : `${dataTypeLabel} Heatmap`;
      
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-sm font-bold">{title}</h4>
        
        {/* Add the data type selector here */}
        <div className="heatmap-selector">
          <select
            value={selectedDataType}
            onChange={(e) => setSelectedDataType(e.target.value)}
            className="text-sm p-1 border rounded"
            style={{ fontSize: '14px' }}
          >
            <option value="Price">Price</option>
            <option value="Hospitals">Hospitals</option>
            {/* <option value="Groceries">Groceries</option> */}
          </select>
        </div>
      </div>
      
      {loading && <div className="loading-indicator">Loading Map Data...</div>}
      {/* Display loading indicator */}
      
      {/* {!loading && (!locationData || locationData.length === 0) && 
        <div className="no-data-message">No data available for this selection.</div>} */}
      {/* Display no data message */}
     
      <div style={{ height: '230px', opacity: loading ? 0.5 : 1 }}>
        {/* Adjust height and add opacity effect during loading */}
        {!loading && locationData && locationData.length > 0 && (
          // Render MapComponent only when not loading and data exists
          <MapComponent
            mapCenter={mapCenter}
            mapZoom={mapZoom}
            stateGeoJson={stateGeoJson}
            locationData={locationData} // Contains { zip, value } items
            selectedState={selectedState}
            selectedCity={selectedCity}
            selectedDataType={selectedDataType} // Pass selectedDataType down
          />
        )}
      </div>
    </div>
  );
};

export default HeatMapView;