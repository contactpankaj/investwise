import React, { useState } from 'react';
import './App.css';
import SearchForm from './components/SearchForm';
import Chatbot from './components/Chatbot';
import GraphVisualization from './components/GraphVisualization';
import HeatMapView from './components/HeatMapView';
import PlaceholderVisualization from './components/PlaceholderVisualization';
import AcresHistogram from './components/AcresHistogram';
import AnimatedHomePage from './components/AnimatedHomePage'; // ✅ Import splash

import {
  fetchPriceData,
  fetchStateZipBoundaries,
  getCityLocation,
  fetchPriceForecast,
  fetchAcresHistogram
} from './services/dataservice';

const App = () => {
  const [showHome, setShowHome] = useState(true); // 🔥

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mapCenter, setMapCenter] = useState([29.7604, -95.3698]); // Houston
  const [mapZoom, setMapZoom] = useState(10);
  const [locationData, setLocationData] = useState([]);
  const [stateGeoJson, setStateGeoJson] = useState(null);
  const [selectedState, setSelectedState] = useState('texas');
  const [selectedCity, setSelectedCity] = useState('houston');
  const [geoJsonLoading, setGeoJsonLoading] = useState(false);
  const [histogramData, setHistogramData] = useState(null);
  const [forecastData, setForecastData] = useState([]);

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    setHistogramData(null);

    try {
      const cityCoordinates = await getCityLocation(selectedCity, selectedState);
      if (cityCoordinates) {
        setMapCenter(cityCoordinates);
        setMapZoom(11);
      }

      const priceData = await fetchPriceData(selectedState, selectedCity);
      setLocationData(priceData);

      const histData = await fetchAcresHistogram(selectedState, selectedCity);
      setHistogramData(histData);

      if (!stateGeoJson || stateGeoJson.state !== selectedState) {
        setGeoJsonLoading(true);
        const geoJsonData = await fetchStateZipBoundaries(selectedState);
        setStateGeoJson({
          ...geoJsonData,
          state: selectedState,
          city: selectedCity,
        });
        setGeoJsonLoading(false);
      } else if (selectedCity !== stateGeoJson.city) {
        setStateGeoJson({
          ...stateGeoJson,
          city: selectedCity,
        });
      }
    } catch (err) {
      setError(err.message || 'An error occurred while fetching data.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // const handleForecast = async ({ acre, bedroom, bathroom, houseSize }) => {
  //   try {
  //     const result = await fetchPriceForecast({
  //       beds: bedroom,
  //       baths: bathroom,
  //       acre_lot: acre,
  //       house_size: houseSize,
  //       start_year: new Date().getFullYear()
  //     });
  //     setForecastData(result);
  //   } catch (error) {
  //     console.error('Error fetching forecast:', error.message);
  //   }
  // };
  const handleForecast = async ({ acre, bedroom, bathroom, houseSize, state }) => {
    try {
      const result = await fetchPriceForecast({
        beds: parseFloat(bedroom),
        baths: parseFloat(bathroom),
        acre_lot: parseFloat(acre),
        house_size: parseFloat(houseSize),
        state: state,
        start_year: new Date().getFullYear()
      });
  
      setForecastData(result.forecast);  // assuming backend returns { forecast: [...] }
    } catch (error) {
      console.error('Error fetching forecast:', error.message);
    }
  };
  
  

  // 👇 Show splash homepage first
  if (showHome) {
    return <AnimatedHomePage onEnter={() => setShowHome(false)} />;
  }

  return (
    <div className="app-container">
      {/* LEFT COLUMN */}
      <div className="left-column">
        <div className="card form-container">
          <SearchForm
            selectedState={selectedState}
            setSelectedState={setSelectedState}
            selectedCity={selectedCity}
            setSelectedCity={setSelectedCity}
            handleSubmit={handleSubmit}
            handleForecast={handleForecast}
            loading={loading}
            geoJsonLoading={geoJsonLoading}
          />
        </div>
        <div className="card chatbot-container">
          <Chatbot />
        </div>
      </div>

      {/* RIGHT COLUMN */}
      <div className="right-column">
        <div className="card graph-container">
          <GraphVisualization forecastData={forecastData} selectedState={selectedState} selectedCity={selectedCity}/>
        </div>
        <div className="card heatmap-container">
          <HeatMapView
            mapCenter={mapCenter}
            mapZoom={mapZoom}
            stateGeoJson={stateGeoJson}
            locationData={locationData}
            selectedState={selectedState}
            selectedCity={selectedCity}
          />
        </div>
        <div className="card histogram-container">
          <AcresHistogram
            histogramData={histogramData}
            selectedState={selectedState}
            selectedCity={selectedCity}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
};

export default App;









