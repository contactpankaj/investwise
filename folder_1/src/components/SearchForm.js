import React, { useState } from "react";

const SearchForm = ({
  selectedState,
  setSelectedState,
  selectedCity,
  setSelectedCity,
  selectedDataType,
  setSelectedDataType,
  handleSubmit,
  loading,
  handleForecast,
  geoJsonLoading,
}) => {
  const [acre, setAcre] = useState("0.15");
  const [bedroom, setBedroom] = useState("4");
  const [bathroom, setBathroom] = useState("2");
  const [houseSize, setHouseSize] = useState("1800");

  const stateCityMap = {
    arizona: ["Flagstaff", "Mesa", "Tucson", "Tempe", "Scottsdale"],
    california: [
      "Los Angeles",
      "Sacramento",
      "San Diego",
      "San Francisco",
      "San Jose",
    ],
    texas: ["Austin", "Dallas", "Houston", "Fort Worth", "San Antonio"],
    "new york": [
      "Brooklyn",
      "Buffalo",
      "Manhattan",
      "New York City",
      "Rochester",
    ],
    washington: ["Bellevue", "Olympia", "Seattle", "Spokane", "Tacoma"],
  };

  const onSubmit = (e) => {
    e.preventDefault();

    const payload = {
      acre,
      bedroom,
      bathroom,
      houseSize,
      state: selectedState,
      city: selectedCity,
    };

    handleSubmit(); // for heatmap
    handleForecast(payload); // if using forecast
  };
  
  return (
    <div className="form-container">
      <form onSubmit={onSubmit} className="form">
        {/* State Dropdown */}
        <div>
          <label htmlFor="state-select" className="form-label">State:</label>
          <select
            id="state-select"
            value={selectedState}
            onChange={(e) => {
              setSelectedState(e.target.value);
              setSelectedCity(""); // reset city on state change
            }}
            className="input-field"
            required
          >
            <option value="">Select State</option>
            {Object.keys(stateCityMap).map((stateKey) => (
              <option key={stateKey} value={stateKey}>
                {stateKey.charAt(0).toUpperCase() + stateKey.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* City Dropdown */}
        <div>
          <label htmlFor="city-select" className="form-label">City:</label>
          <select
            id="city-select"
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="input-field"
            required
            disabled={!selectedState} // disable until a state is selected
          >
            <option value="">Select City</option>
            {selectedState &&
              stateCityMap[selectedState].map((city) => (
                <option key={city} value={city.toLowerCase()}>
                  {city}
                </option>
              ))}
          </select>
        </div>


        <div>
          <label htmlFor="datatype-select" className="form-label">Heatmap Data:</label>
          <select
            id="datatype-select"
            value={selectedDataType}
            onChange={(e) => setSelectedDataType(e.target.value)}
            className="input-field"
            required
          >
            <option value="Price">Price</option>
            <option value="Hospitals">Hospitals</option>
            <option value="Groceries">Groceries</option>
          </select>
        </div>

        <div>
          <label htmlFor="acre-input" className="form-label">Acre:</label>
          <input
            id="acre-input"
            type="number"
            step="0.5"
            placeholder="Acre"
            value={acre}
            onChange={(e) => setAcre(e.target.value)}
            className="input-field"
          />
        </div>
          
        <div>
          <label htmlFor="bedroom-input" className="form-label">Bedrooms:</label>
          <input
            id="bedroom-input"
            type="number"
            step="1"
            placeholder="Bedrooms"
            value={bedroom}
            onChange={(e) => setBedroom(e.target.value)}
            className="input-field"
          />
        </div>
          
        <div>
          <label htmlFor="bathroom-input" className="form-label">Bathrooms:</label>
          <input
            id="bathroom-input"
            type="number"
            step="0.5"
            placeholder="Bathrooms"
            value={bathroom}
            onChange={(e) => setBathroom(e.target.value)}
            className="input-field"
          />
        </div>
          
        <div>
          <label htmlFor="size-input" className="form-label">House Size (sqft):</label>
          <input
            id="size-input"
            type="number"
            step="10"
            placeholder="House Size (sqft)"
            value={houseSize}
            onChange={(e) => setHouseSize(e.target.value)}
            className="input-field"
          />
        </div>

        <button
          type="submit"
          disabled={loading || geoJsonLoading || !selectedState || !selectedCity}
          className="submit-button"
        >
          {loading || geoJsonLoading ? "Loading..." : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default SearchForm;