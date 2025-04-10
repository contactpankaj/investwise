
import React from 'react';
import MapComponent from './MapComponent';

const HeatMapView = ({
  mapCenter,
  mapZoom,
  stateGeoJson,
  locationData,
  selectedState,
  selectedCity,
}) => {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Heatmap Visualization</h2>
      
      <div style={{ height: '100px' /* or any value you want */ }}>
        <MapComponent
          mapCenter={mapCenter}
          mapZoom={mapZoom}
          stateGeoJson={stateGeoJson}
          locationData={locationData}
          selectedState={selectedState}
          selectedCity={selectedCity}
        />
      </div>
    </div>
  );
};

export default HeatMapView;
