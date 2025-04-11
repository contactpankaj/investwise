import React, { useState } from "react";

const SearchForm = ({
  selectedState,
  setSelectedState,
  selectedCity,
  setSelectedCity,
  handleSubmit,
  handleForecast,
  loading,
  geoJsonLoading,
}) => {
  const [acre, setAcre] = useState("");
  const [bedroom, setBedroom] = useState("");
  const [bathroom, setBathroom] = useState("");
  const [houseSize, setHouseSize] = useState("");

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

    const formData = {
      state: selectedState,
      city: selectedCity,
      acre: parseFloat(acre),
      bedroom: parseFloat(bedroom),
      bathroom: parseFloat(bathroom),
      houseSize: parseFloat(houseSize),
    };
    // console.log("state - ", formData.state);
    // console.log("city - ", formData.city);
    console.log("Submitted:", formData);

    handleSubmit(); // for heatmap
    handleForecast(formData); // for chart
  };

  return (
    <div className="form-container">
      {/* <h2 className="form-title">User Form</h2> */}

      <form onSubmit={onSubmit} className="form">
        {/* State Dropdown */}
        <select
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

        {/* City Dropdown */}
        <select
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

        <input
          type="number"
          placeholder="Acre"
          value={acre}
          onChange={(e) => setAcre(e.target.value)}
          className="input-field"
        />
        <input
          type="number"
          placeholder="Number of Bedrooms"
          value={bedroom}
          onChange={(e) => setBedroom(e.target.value)}
          className="input-field"
        />
        <input
          type="number"
          placeholder="Number of Bathrooms"
          value={bathroom}
          onChange={(e) => setBathroom(e.target.value)}
          className="input-field"
        />
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
