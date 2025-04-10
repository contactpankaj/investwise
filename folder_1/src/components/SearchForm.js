
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

    console.log("Submitted:", formData);

    handleSubmit(); // for heatmap
    handleForecast(formData); // for chart
  };

  return (
    <div className="form-container">
      {/* <h2 className="form-title">User Form</h2> */}

      <form onSubmit={onSubmit} className="form">
        <input
          type="text"
          placeholder="State"
          value={selectedState}
          onChange={(e) => setSelectedState(e.target.value)}
          className="input-field"
          required
        />
        <input
          type="text"
          placeholder="City"
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
          className="input-field"
          required
        />
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

