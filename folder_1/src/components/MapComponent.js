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
  selectedCity 
}) => {
  // Style function for GeoJSON
  const zipStyle = (feature) => {

    // Find the zip code in our data
    const zipCode = feature.properties.ZCTA5CE10;
    const zipData = locationData.find(item => String(item.zip) === zipCode);
    

    return {
      fillColor: zipData ? getColorBasedOnPrice(zipData.normalizedPrice) : '#CCCCCC',
      weight: 1,
      opacity: 1,
      color: 'white',
      fillOpacity: 0.7
    };
  };
  
  // Add tooltips to each ZIP code area
  const onEachFeature = (feature, layer) => {
    const zipCode = feature.properties.ZCTA5CE10;
    console.log('Printing location data inside onEachFeature')
    console.log('Zip code:', zipCode);
    const zipData = locationData.find(item => String(item.zip) === zipCode);
    console.log('Zip data:', zipData);
    
    if (zipData) {
      layer.bindTooltip(
        `<div>
          <strong>ZIP: ${zipCode}</strong><br />
          Average Price: $${zipData.avgPrice.toLocaleString()}<br />
          Normalized Price: ${zipData.normalizedPrice.toFixed(2)}
        </div>`,
        { sticky: true }
      );
    } else {
      layer.bindTooltip(
        `<div>
          <strong>ZIP: ${zipCode}</strong><br />
          No price data available
        </div>`,
        { sticky: true }
      );
    }
  };

  return (
    <div className="border rounded overflow-hidden" style={{ height: '500px' }}>
      <MapContainer 
        center={mapCenter} 
        zoom={mapZoom} 
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <MapUpdater center={mapCenter} zoom={mapZoom} />
        
        {stateGeoJson && (
          <GeoJSON 
            key={JSON.stringify(locationData)}
            data={filterGeoJson(stateGeoJson, locationData, selectedState, selectedCity) || stateGeoJson}
            style={zipStyle}
            onEachFeature={onEachFeature}
          />
        )}
      </MapContainer>
    </div>
  );
};

export default MapComponent;