import React, { useEffect } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { getColorBasedOnPrice } from '../utils/colorutils';
import { filterGeoJson } from '../utils/maputils';

// Helper to update map center/zoom
const MapUpdater = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    if (center[0] !== 0 && center[1] !== 0) {
      map.setView(center, zoom);
    }
  }, [center, zoom, map]);
  return null;
};

const MapComponent = ({
  mapCenter,
  mapZoom,
  stateGeoJson,
  locationData,
  selectedState,
  selectedCity,
  selectedDataType
}) => {
  // Style for ZIP areas with data
  const zipStyle = (feature) => {
    const zipCode = feature.properties.ZCTA5CE10;
    const zipData = locationData.find(item => String(item.zip) === zipCode);

    if (!zipData) {
      return {
        fillColor: '#CCCCCC',
        weight: 1,
        opacity: 1,
        color: 'white',
        fillOpacity: 0.7
      };
    }

    return {
      fillColor: getColorBasedOnPrice(zipData.value),
      weight: 1,
      opacity: 1,
      color: 'white',
      fillOpacity: 0.7
    };
  };

  // Tooltip per ZIP region
  const onEachFeature = (feature, layer) => {
    const zipCode = feature.properties.ZCTA5CE10;
    const zipData = locationData.find(item => String(item.zip) === zipCode);

    let tooltipContent = `<strong>ZIP: ${zipCode}</strong><br />`;

    if (zipData) {
      if (selectedDataType === 'Price') {
        tooltipContent += `Average Price: $${zipData.raw_value ? zipData.raw_value.toLocaleString() : zipData.value.toLocaleString()}`;
      } else if (selectedDataType === 'Hospitals' || selectedDataType === 'Groceries') {
        const label = selectedDataType === 'Hospitals' ? 'Hospitals' : 'Groceries';
        tooltipContent += `${label} Count: ${zipData.raw_value || 0}`;
      } else {
        tooltipContent += `Value: ${zipData.value.toFixed(2)}`;
      }
    } else {
      tooltipContent += `No data available`;
    }

    layer.bindTooltip(`<div>${tooltipContent}</div>`, { sticky: true });
  };

  const geoJsonKey = `${selectedState}-${selectedCity}-${selectedDataType}-${locationData?.length || 0}`;

  if (!Array.isArray(locationData)) {
    console.error("locationData is not an array:", locationData);
    return <div className="error-message">Error: Invalid map data.</div>;
  }

  // Default style for boundaries when no data is present
  const baseStyle = {
    color: '#888',
    weight: 1,
    fillOpacity: 0
  };

  return (
    <MapContainer
      center={mapCenter}
      zoom={mapZoom}
      style={{ height: '100%', width: '100%' }}
      scrollWheelZoom={false}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      <MapUpdater center={mapCenter} zoom={mapZoom} />

      {stateGeoJson && (
        <GeoJSON
          key={geoJsonKey}
          data={
            locationData.length > 0
              ? filterGeoJson(stateGeoJson, locationData, selectedState, selectedCity) || stateGeoJson
              : stateGeoJson
          }
          style={locationData.length > 0 ? zipStyle : baseStyle}
          onEachFeature={locationData.length > 0 ? onEachFeature : undefined}
        />
      )}
    </MapContainer>
  );
};

export default MapComponent;
