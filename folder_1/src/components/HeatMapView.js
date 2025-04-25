



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
  hasSubmitted
}) => {
  let dataTypeLabel = 'Data';
  if (selectedDataType === 'Price') {
    dataTypeLabel = 'Price';
  } else if (selectedDataType === 'Hospitals') {
    dataTypeLabel = 'Hospital Density';
  } else if (selectedDataType === 'Groceries') {
    dataTypeLabel = 'Grocery Density';
  }
  const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);
  const title =
    selectedCity && selectedState
      ? `${dataTypeLabel} Heatmap for ${capitalize(selectedCity)}, ${capitalize(selectedState)}`
      : `${dataTypeLabel} Heatmap`;

  // Compute min and max price values for legend
  const priceValues =
    selectedDataType === 'Price' && Array.isArray(locationData)
      ? locationData.map((d) => d.value)
      : [];
  const minValue = 100000;
  const maxValue = 1500000;

  return (
    <div>
      {/* Title and Selector */}
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-sm font-bold">
          {hasSubmitted ? title : 'Submit form to see heatmap'}
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

      {/* Map container */}
      <div style={{ height: '300px', opacity: loading ? 0.5 : 1 }}>
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

      {/* Horizontal Price Legend */}
      {/* Horizontal Price Legend */}
{/* Price Legend */}
{!loading &&
  hasSubmitted &&
  selectedDataType === 'Price' &&
  locationData &&
  locationData.length > 0 && (
    <div
      style={{
        marginTop: '12px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}
    >
      <p style={{ color: 'white', fontSize: '12px', marginBottom: '4px' }}>
        Price Range
      </p>
      <div
        style={{
          width: '80%',
          height: '12px',
          background:
            'linear-gradient(to right, hsl(120, 100%, 50%), hsl(60, 100%, 50%), hsl(30, 100%, 50%), hsl(0, 100%, 50%))',
          borderRadius: '4px',
          position: 'relative'
        }}
      ></div>
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
)}

{/* Hospital Count Legend */}
{!loading &&
  hasSubmitted &&
  selectedDataType === 'Hospitals' &&
  locationData &&
  locationData.length > 0 && (
    <div
      style={{
        marginTop: '12px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}
    >
      <p style={{ color: 'white', fontSize: '12px', marginBottom: '4px' }}>
        Hospital Count
      </p>
      <div
        style={{
          width: '80%',
          height: '12px',
          background:
            'linear-gradient(to left, hsl(120, 100%, 50%), hsl(60, 100%, 50%), hsl(30, 100%, 50%), hsl(0, 100%, 50%))',
          borderRadius: '4px',
          position: 'relative'
        }}
      ></div>
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
        <span>0</span>
        <span>8+</span>
      </div>
    </div>
)}



      {/* Fallback message */}
      {!loading &&
        (!locationData || locationData.length === 0) &&
        hasSubmitted && (
          <div className="text-sm text-slate-400 mt-2 italic">
            Showing base map. Submit to load heatmap data.
          </div>
        )}
    </div>
  );
};

export default HeatMapView;



