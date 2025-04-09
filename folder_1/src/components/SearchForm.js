import React, { useState } from 'react';

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
  const [acre, setAcre] = useState('');
  const [bedroom, setBedroom] = useState('');
  const [bathroom, setBathroom] = useState('');
  const [houseSize, setHouseSize] = useState('');

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

    console.log('Submitted:', formData);

    handleSubmit(); // for heatmap
    handleForecast(formData); // for chart
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">User Form</h2>

      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="State"
          value={selectedState}
          onChange={(e) => setSelectedState(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2"
          required
        />
        <input
          type="text"
          placeholder="City"
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2"
          required
        />
        <input
          type="number"
          placeholder="Acre"
          value={acre}
          onChange={(e) => setAcre(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2"
        />
        <input
          type="number"
          placeholder="Number of Bedrooms"
          value={bedroom}
          onChange={(e) => setBedroom(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2"
        />
        <input
          type="number"
          placeholder="Number of Bathrooms"
          value={bathroom}
          onChange={(e) => setBathroom(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2"
        />
        <input
          type="number"
          placeholder="House Size (sqft)"
          value={houseSize}
          onChange={(e) => setHouseSize(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2"
        />

        <button
          type="submit"
          disabled={loading || geoJsonLoading}
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading || geoJsonLoading ? 'Loading...' : 'Submit'}
        </button>
      </form>
    </div>
  );
};

export default SearchForm;

