import React, { useState } from "react";

const SearchForm = ({
  selectedState,
  setSelectedState,
  selectedCity,
  setSelectedCity,
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
        <label>State</label>
        <select
          value={selectedState}
          onChange={(e) => {
            setSelectedState(e.target.value);
            setSelectedCity("");
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

        <label>City</label>
        <select
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
          className="input-field"
          required
          disabled={!selectedState}
        >
          <option value="">Select City</option>
          {selectedState &&
            stateCityMap[selectedState].map((city) => (
              <option key={city} value={city.toLowerCase()}>
                {city}
              </option>
            ))}
        </select>

        <label>Acre Lot</label>
        <input
          type="number"
          placeholder="Acre"
          value={acre}
          onChange={(e) => setAcre(e.target.value)}
          className="input-field"
        />

        <label>Bedrooms</label>
        <input
          type="number"
          placeholder="Number of Bedrooms"
          value={bedroom}
          onChange={(e) => setBedroom(e.target.value)}
          className="input-field"
        />

        <label>Bathrooms</label>
        <input
          type="number"
          placeholder="Number of Bathrooms"
          value={bathroom}
          onChange={(e) => setBathroom(e.target.value)}
          className="input-field"
        />

        <label>House Size (sqft)</label>
        <input
          type="number"
          placeholder="House Size (sqft)"
          value={houseSize}
          onChange={(e) => setHouseSize(e.target.value)}
          className="input-field"
        />

        <button
          type="submit"
          disabled={loading || geoJsonLoading}
          className="submit-button"
        >
          {loading || geoJsonLoading ? "Loading..." : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default SearchForm;
