import React, { useState } from 'react';

const SearchForm = ({
  selectedState,
  setSelectedState,
  selectedCity,
  setSelectedCity,
  handleSubmit,
  loading,
  geoJsonLoading,
}) => {
  const [acre, setAcre] = useState('');
  const [bedroom, setBedroom] = useState('');

  const onSubmit = (e) => {
    e.preventDefault();
    // You can log or use acre and bedroom for future features
    console.log('Submitted:', { selectedState, selectedCity, acre, bedroom });
    handleSubmit(); // Trigger heatmap fetch using city and state
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
