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
import ListingsImageCarausel from './components/ListingsImageCarausel';


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

  const [activeTab, setActiveTab] = useState("visualizations");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImages, setCurrentImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const openModal = (images, index = 0) => {
    setCurrentImages(images);
    setCurrentIndex(index);
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);
  const nextImage = () =>
    setCurrentIndex((prev) => (prev + 1) % currentImages.length);
  const prevImage = () =>
    setCurrentIndex(
      (prev) => (prev - 1 + currentImages.length) % currentImages.length
    );
    const categoryMap = {
      'Hospitals': 'hospital', // Match backend query parameter
      'Groceries': 'grocery'   // Match backend query parameter
    };
  const handleSubmit = async () => {
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
  const dummyContent = (
    <div
      style={{
        height: "200px",
        marginTop: "20px",
        padding: "10px",
        background: "#334155",
        borderRadius: "8px",
      }}
    >
      <h3>Additional Information</h3>
      <p>
        This is some dummy content to ensure we have enough height to test
        scrolling.
      </p>
      <p>
        The right column should scroll if the content exceeds the viewport
        height.
      </p>
    </div>
  );

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
            selectedDataType={selectedDataType}
            setSelectedDataType={setSelectedDataType}
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
        <div className="tab-bar">
          <button
            className={activeTab === "visualizations" ? "active-tab" : ""}
            onClick={() => setActiveTab("visualizations")}
          >
            Visualizations
          </button>
          <button
            className={activeTab === "listings" ? "active-tab" : ""}
            onClick={() => setActiveTab("listings")}
          >
            Listings
          </button>
        </div>

        {activeTab === "visualizations" && (
          <>
            <div className="card graph-container">
              <GraphVisualization
                forecastData={forecastData}
                selectedState={selectedState}
                selectedCity={selectedCity}
              />
            </div>
            <div className="card heatmap-container">
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
            <div className="card histogram-container">
              <HeatmapChart
                heatmapData={heatmapData}
                selectedCity={selectedCity}
                loading={loading}
              />
              {dummyContent}
            </div>
            <div className="card histogram-container">
              <ScatterplotChart
                scatterData={scatterData}
                selectedCity={selectedCity}
                loading={loading}
              />
            </div>
            <div className="card histogram-container">
              <PricePerSqftChart
                chartData={priceSqftData}
                selectedState={selectedState}
                loading={loading}
              />
            </div>
          </>
        )}

        <div
          className="card listings-container"
          style={{ margin: 0, padding: 0 }}
        >
          <h2 style={{ padding: "20px 0px 0px 0px" }}>
            Listings in {selectedCity}, {selectedState}
          </h2>
          <ListingsImageCarausel
            rows={2}
            cols={2}
            folderNames={["home_1", "home_2", "home_3", "home_4"]}
          />
        </div>
        {/* <div className="card histogram-container">
        <ScatterplotChart
          scatterData={scatterData}
          selectedCity={selectedCity}
          loading={loading}
        />
      </div>
      <div className="card histogram-container">
  <PricePerSqftChart
    chartData={priceSqftData}
    selectedState={selectedState}
    loading={loading}
  />
</div> */}


      </div>
      
      {/* Error message display */}
      {error && (
        <div className="error-message">
          <p>{error}</p>
        </div>
      )}
    </div>
  );
};

export default App;
