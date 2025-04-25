import React, { useState } from 'react';
import './App.css';
import SearchForm from './components/SearchForm';
import Chatbot from './components/Chatbot';
import GraphVisualization from './components/GraphVisualization';
import HeatMapView from './components/HeatMapView';
import AnimatedHomePage from './components/AnimatedHomePage';
import HeatmapChart from './components/Heatmapchart';
import AcresHistogram from './components/AcresHistogram';
// import AnimatedHomePage from './components/AnimatedHomePage';
import ScatterplotChart from './components/ScatterplotChat';
import { fetchScatterData } from './services/dataservice';
import PricePerSqftChart from './components/PricePerSqftChart';
import { fetchPricePerSqft } from './services/dataservice';
import ListingsImageCarausel from "./components/ListingsImageCarauselWithPopup";

// import React, { useState } from "react";
// import "./App.css";

import {
  fetchPriceData,
  fetchPlacesCount,
  fetchStateZipBoundaries,
  getCityLocation,
  fetchAcresHistogram,
  fetchHeatmapData,
  fetchPriceForecast,
} from "./services/dataservice";

const App = () => {
  const [showHome, setShowHome] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mapCenter, setMapCenter] = useState([29.7604, -95.3698]);
  const [mapZoom, setMapZoom] = useState(10);
  const [locationData, setLocationData] = useState([]);
  const [stateGeoJson, setStateGeoJson] = useState(null);
  const [selectedState, setSelectedState] = useState("texas");
  const [selectedCity, setSelectedCity] = useState("houston");
  const [geoJsonLoading, setGeoJsonLoading] = useState(false);
  const [histogramData, setHistogramData] = useState(null);
  const [forecastData, setForecastData] = useState([]);
  const [heatmapData, setHeatmapData] = useState(null);
  const [selectedDataType, setSelectedDataType] = useState('Price');
  const [scatterData, setScatterData] = useState([]);
  const [priceSqftData, setPriceSqftData] = useState([]);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const [activeTab, setActiveTab] = useState("heatmap"); 
  const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);
  const handleSubmit = async () => {
    setHasSubmitted(true);
    const categoryMap = {
      'Hospitals': 'hospital',
      'Groceries': 'grocery_or_supermarket',
    };
  
    setLoading(true);
    setError("");
    setHistogramData(null);
    setHeatmapData(null);

    setLocationData([]);
    
    try {
      // Get city coordinates and update map center
      const cityCoordinates = await getCityLocation(selectedCity, selectedState);
      if (cityCoordinates) {
        setMapCenter(cityCoordinates);
        setMapZoom(11);
      }
      
      // Fetch data based on selected data type
      let heatmapData = [];
      
      if (selectedDataType === 'Price') {
        heatmapData = await fetchPriceData(selectedState, selectedCity);
      } else if (selectedDataType === 'Hospitals' || selectedDataType === 'Groceries') {
        const category = categoryMap[selectedDataType]; // Get backend category name
        heatmapData = await fetchPlacesCount(selectedState, selectedCity, category);
      }
      
      setLocationData(heatmapData);
      
      // Always fetch histogram data
      const histData = await fetchAcresHistogram(selectedState, selectedCity);
      setHistogramData(histData);

      const heatData = await fetchHeatmapData(selectedCity);
      setHeatmapData(heatData);

      const scatterPlot = await fetchScatterData(selectedCity, selectedState);
      setScatterData(scatterPlot.scatter_data);

      const sqftData = await fetchPricePerSqft(selectedState);
      setPriceSqftData(sqftData.chart_data);



      
      // Load or update GeoJSON data for the state
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
      setError(err.message || "An error occurred while fetching data.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleForecast = async ({
    acre,
    bedroom,
    bathroom,
    houseSize,
    state,
  }) => {
    try {
      const result = await fetchPriceForecast({
        beds: parseFloat(bedroom),
        baths: parseFloat(bathroom),
        acre_lot: parseFloat(acre),
        house_size: parseFloat(houseSize),
        state: state,
        start_year: new Date().getFullYear(),
      });

      setForecastData(result.forecast); // assuming backend returns { forecast: [...] }
    } catch (error) {
      console.error("Error fetching forecast:", error.message);
    }
  };

  if (showHome) {
    return <AnimatedHomePage onEnter={() => setShowHome(false)} />;
  }

  // Adding some dummy content to ensure we have enough to scroll


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
          />
        </div>
        <div className="card chatbot-container">
          <Chatbot />
        </div>
      </div>

      {/* RIGHT COLUMN */}
      <div className="right-column">
      {/* Always show graph at the top */}
      <div className="card graph-container">
        <GraphVisualization
          forecastData={forecastData}
          selectedState={selectedState}
          selectedCity={selectedCity}
        />
      </div>

      {/* Tab controls for switching visual content */}
      <div className="card visualization-container">
      {/* Ribbon Tabs (Top Border Tabs) */}
      <div className="ribbon-tabs">
        <button
          className={activeTab === "heatmap" ? "active-tab" : ""}
          onClick={() => setActiveTab("heatmap")}
        >
          Heatmap
        </button>
        <button
          className={activeTab === "histogram" ? "active-tab" : ""}
          onClick={() => setActiveTab("histogram")}
        >
          House Size Distribution
        </button>
        <button
          className={activeTab === "forecast-heatmap" ? "active-tab" : ""}
          onClick={() => setActiveTab("forecast-heatmap")}
        >
          Features Correlation
        </button>
        <button
          className={activeTab === "scatter" ? "active-tab" : ""}
          onClick={() => setActiveTab("scatter")}
        >
          Price vs Size
        </button>
        <button
          className={activeTab === "priceSqft" ? "active-tab" : ""}
          onClick={() => setActiveTab("priceSqft")}
        >
          Price per Sqft
        </button>
        <button
          className={activeTab === "listings" ? "active-tab" : ""}
          onClick={() => setActiveTab("listings")}
        >
          Propery Images
        </button>
      </div>

      {/* Visualization content below ribbon */}
      <div className="visualization-content">
        {activeTab === "heatmap" && (
          <HeatMapView
            mapCenter={mapCenter}
            mapZoom={mapZoom}
            stateGeoJson={stateGeoJson}
            locationData={locationData}
            selectedState={selectedState}
            selectedCity={selectedCity}
            selectedDataType={selectedDataType}
            setSelectedDataType={setSelectedDataType}
            loading={loading || geoJsonLoading}
            hasSubmitted={hasSubmitted}
          />
        )}

        {activeTab === "histogram" && (
          <AcresHistogram
            histogramData={histogramData}
            selectedState={selectedState}
            selectedCity={selectedCity}
            loading={loading}
          />
        )}

        {activeTab === "forecast-heatmap" && (
          <>
            <HeatmapChart
              heatmapData={heatmapData}
              selectedCity={selectedCity}
              loading={loading}
            />
          </>
        )}

        {activeTab === "scatter" && (
          <ScatterplotChart
            scatterData={scatterData}
            selectedCity={selectedCity}
            loading={loading}
          />
        )}

        {activeTab === "priceSqft" && (
          <PricePerSqftChart
            chartData={priceSqftData}
            selectedState={selectedState}
            loading={loading}
          />
        )}

        {activeTab === "listings" && (
          <div className="listings-container" style={{ margin: 0, padding: 0 }}>
            <h2 style={{ padding: "20px 0px 0px 0px" }}>
              Listings in {capitalize(selectedCity)}, {capitalize(selectedState)}
            </h2>
            <ListingsImageCarausel
              rows={2}
              cols={2}
              basePath={selectedState.toLowerCase()} // assuming lowercase folder names
              folderNames={["home_1", "home_2", "home_3", "home_4"]}
            />

          </div>
        )}
      </div>
    </div>

    </div>

    </div>
      );



};

export default App;



