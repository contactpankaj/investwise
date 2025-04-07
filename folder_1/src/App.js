import React, { useState } from 'react';
import './App.css';
import MapComponent from './components/MapComponent';
import SearchControls from './components/SearchControls';
import Legend from './components/Legend';
import PriceDataTable from './components/PriceDataTable';
import { fetchPriceData, fetchStateZipBoundaries, getCityLocation } from './services/dataservice';

const App = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mapCenter, setMapCenter] = useState([29.7604, -95.3698]); // Default to Houston
  const [mapZoom, setMapZoom] = useState(10);
  const [locationData, setLocationData] = useState([]);
  const [stateGeoJson, setStateGeoJson] = useState(null);
  const [selectedState, setSelectedState] = useState('texas');
  const [selectedCity, setSelectedCity] = useState('');
  const [geoJsonLoading, setGeoJsonLoading] = useState(false);

  // Function to handle form submission and data loading
  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    
    try {
      // Get city coordinates
      const cityCoordinates = await getCityLocation(selectedCity, selectedState);
      if (cityCoordinates) {
        setMapCenter(cityCoordinates);
        setMapZoom(11);
      }
      
      // Fetch price data
      const priceData = await fetchPriceData(selectedState, selectedCity);
      console.log('Printing price data')
      console.log('Price data:', priceData);
      setLocationData(priceData);
      console.log('Printing location data')
      console.log('Location data:', locationData);
      
      // Fetch state ZIP boundaries if we don't already have them or if state changed
      if (!stateGeoJson || stateGeoJson.state !== selectedState) {
        setGeoJsonLoading(true);
        const geoJsonData = await fetchStateZipBoundaries(selectedState);
        
        setStateGeoJson({
          ...geoJsonData,
          state: selectedState,
          city: selectedCity
        });
        setGeoJsonLoading(false);
      } else if (selectedCity !== stateGeoJson.city) {
        // If only city changed, update the city in stateGeoJson
        setStateGeoJson({
          ...stateGeoJson,
          city: selectedCity
        });
      }
      
    } catch (err) {
      setError(err.message || 'An error occurred while fetching data.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Real Estate Price Visualization</h1>
      
      <SearchControls 
        selectedState={selectedState}
        setSelectedState={setSelectedState}
        selectedCity={selectedCity}
        setSelectedCity={setSelectedCity}
        handleSubmit={handleSubmit}
        loading={loading}
        geoJsonLoading={geoJsonLoading}
      />
      
      {error && <div className="text-red-500 mb-4">{error}</div>}
      
      <MapComponent 
        mapCenter={mapCenter}
        mapZoom={mapZoom}
        stateGeoJson={stateGeoJson}
        locationData={locationData}
        selectedState={selectedState}
        selectedCity={selectedCity}
      />
      
      <Legend />
      
      <PriceDataTable 
        locationData={locationData}
        stateGeoJson={stateGeoJson}
      />
    </div>
  );
};

export default App;