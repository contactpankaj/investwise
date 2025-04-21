import { defaultCityCoordinates } from './statedata';

// Get city coordinates from the default city coordinates
// In a production app, this would use Google Maps Geocoding API
export const getCityCoordinates = (city, state) => {
  const stateData = defaultCityCoordinates[state];
  if (stateData) {
    const normalizedCity = city.toLowerCase();
    return stateData[normalizedCity] || null;
  }
  return null;
};

// Get city coordinates from Google Maps Geocoding API
// Note: This requires a Google Maps API key
export const getCoordinatesFromGeocoding = async (city, state) => {
  try {
    const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      console.error('Google Maps API key is not configured');
      return getCityCoordinates(city, state);
    }

    const address = `${city}, ${state}, USA`;
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`
    );
    
    const data = await response.json();
    
    if (data.status === 'OK' && data.results && data.results.length > 0) {
      const location = data.results[0].geometry.location;
      return [location.lat, location.lng];
    } else {
      console.warn('Geocoding failed:', data.status);
      return getCityCoordinates(city, state);
    }
  } catch (error) {
    console.error('Error geocoding city:', error);
    return getCityCoordinates(city, state);
  }
};

// Filter GeoJSON to only show features that are relevant to selected city
export const filterGeoJson = (stateGeoJson, locationData, selectedState, selectedCity) => {
  if (!stateGeoJson || !locationData.length) return null;
  
  const zipCodes = locationData.map(item => item.zip);
  
  // Filter features that match our ZIP codes
  const filteredFeatures = stateGeoJson.features.filter(feature => 
    zipCodes.includes(feature.properties.ZCTA5CE10)
  );
  
  // Return filtered GeoJSON
  return {
    type: "FeatureCollection",
    features: filteredFeatures.length > 0 ? filteredFeatures : stateGeoJson.features,
    state: selectedState,
    city: selectedCity
  };
};