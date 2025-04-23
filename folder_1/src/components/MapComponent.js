import React, { useEffect } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { getColorBasedOnPrice } from '../utils/colorutils';
import { filterGeoJson } from '../utils/maputils';

// Map updater component to change view
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
  // Style function for GeoJSON
  const zipStyle = (feature) => {
    // Find the zip code in our data
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
    
    // All data types now use the "value" property for color calculation
    return {
      fillColor: getColorBasedOnPrice(zipData.value),
      weight: 1,
      opacity: 1,
      color: 'white',
      fillOpacity: 0.7
    };
  };
  
  // Add tooltips to each ZIP code area
  const onEachFeature = (feature, layer) => {
    const zipCode = feature.properties.ZCTA5CE10;
    const zipData = locationData.find(item => String(item.zip) === zipCode);
    
    let tooltipContent = `<strong>ZIP: ${zipCode}</strong><br />`;
    
    if (zipData) {
      if (selectedDataType === 'Price') {
        tooltipContent += `Average Price: $${zipData.raw_value ? zipData.raw_value.toLocaleString() : zipData.value.toLocaleString()}`;
      } else if (selectedDataType === 'Hospitals' || selectedDataType === 'Groceries') {
        const categoryName = selectedDataType === 'Hospitals' ? 'Hospitals' : 'Groceries';
        tooltipContent += `${categoryName} Count: ${zipData.raw_value || 0}<br />`;
        
      } else {
        tooltipContent += `Value: ${zipData.value.toFixed(2)}`;
      }
    } else {
      tooltipContent += `No data available`;
    }
    
    layer.bindTooltip(`<div>${tooltipContent}</div>`, { sticky: true });
  };

  // Create a key that changes when relevant data changes to force GeoJSON re-render
  const geoJsonKey = `${selectedState}-${selectedCity}-${selectedDataType}-${locationData ? locationData.length : 0}`;

  // Handle case where locationData is not an array
  if (!Array.isArray(locationData)) {
    console.error("locationData is not an array:", locationData);
    return <div className="error-message">Error: Invalid map data.</div>;
  }

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
      
      {stateGeoJson && locationData && locationData.length > 0 && (
        <GeoJSON 
          key={geoJsonKey}
          data={filterGeoJson(stateGeoJson, locationData, selectedState, selectedCity) || stateGeoJson}
          style={zipStyle}
          onEachFeature={onEachFeature}
        />
      )}
    </MapContainer>
  );
};

export default MapComponent;