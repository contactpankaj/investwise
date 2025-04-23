import React from 'react';
import MapComponent from './MapComponent';

const HeatMapView = ({
  mapCenter,
  mapZoom,
  stateGeoJson,
  locationData,
  selectedState,
  selectedCity,
  selectedDataType,
  setSelectedDataType,
  loading,
  hasSubmitted // ✅ new prop
}) => {
  let dataTypeLabel = 'Data';
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
      {/* Title and Selector */}
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-sm font-bold">
          {hasSubmitted ? title : "Submit form to see heatmap"}
        </h4>

        {/* Only show selector after submit */}
        {hasSubmitted && (
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
        )}
      </div>

      {loading && (
        <div className="text-sm text-slate-400 mb-2">Loading map data...</div>
      )}

      <div style={{ height: '230px', opacity: loading ? 0.5 : 1 }}>
        {!loading && (
          <MapComponent
            mapCenter={mapCenter}
            mapZoom={mapZoom}
            stateGeoJson={stateGeoJson}
            locationData={
              locationData && locationData.length > 0 ? locationData : []
            }
            selectedState={selectedState}
            selectedCity={selectedCity}
            selectedDataType={selectedDataType}
          />
        )}
      </div>

      {!loading && (!locationData || locationData.length === 0) && hasSubmitted && (
        <div className="text-sm text-slate-400 mt-2 italic">
          Showing base map. Submit to load heatmap data.
        </div>
      )}
    </div>
  );
};

export default HeatMapView;
