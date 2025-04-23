import React, { useState } from "react";
import "./App.css";
import SearchForm from "./components/SearchForm";
import Chatbot from "./components/Chatbot";
import GraphVisualization from "./components/GraphVisualization";
import HeatMapView from "./components/HeatMapView";
import AnimatedHomePage from "./components/AnimatedHomePage";
import HeatmapChart from "./components/Heatmapchart";
import AcresHistogram from "./components/AcresHistogram";
import ListingsImageCarausel from "./components/ListingsImageCarauselWithPopup";

// import React, { useState } from "react";
// import "./App.css";

import {
  fetchPriceData,
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
  const [activeTab, setActiveTab] = useState("visualizations");

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    setHistogramData(null);
    setHeatmapData(null);

    try {
      const cityCoordinates = await getCityLocation(
        selectedCity,
        selectedState
      );
      if (cityCoordinates) {
        setMapCenter(cityCoordinates);
        setMapZoom(11);
      }

      const priceData = await fetchPriceData(selectedState, selectedCity);
      setLocationData(priceData);

      const histData = await fetchAcresHistogram(selectedState, selectedCity);
      setHistogramData(histData);

      const heatData = await fetchHeatmapData(selectedCity);
      setHeatmapData(heatData);

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
          </>
        )}

        {activeTab === "listings" && (
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
        )}
      </div>
    </div>
  );
};

export default App;
