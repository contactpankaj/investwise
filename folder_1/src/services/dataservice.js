// import axios from 'axios';
// import { stateGeoJsonUrls } from '../utils/statedata';
// import { getCoordinatesFromGeocoding } from '../utils/maputils';

// // Configure axios defaults
// axios.defaults.baseURL = 'http://localhost:8000';
// axios.defaults.headers.common['Content-Type'] = 'application/json';
// axios.defaults.headers.common['Accept'] = 'application/json';

// // Fetch price data from API
// export const fetchPriceData = async (state, city) => {
//   // console.log('Fetching price data for state before try:', state, 'and city:', city);
//   try {
//     // console.log('Fetching price data for state:', state, 'and city:', city);
//     const response = await fetch(`http://localhost:8000/api/average-prices?state=${state}&city=${city}`);
//     const data = await response.json();
    
//     if (data.error) {
//       throw new Error(data.error);
//     }
    
//     return data.result || [];
//   } catch (error) {
//     throw new Error(`Failed to fetch price data: ${error.message}`);
//   }
// };


// export const fetchPriceForecast = async ({
//   beds,
//   baths,
//   acre_lot,
//   house_size,
//   state,
//   start_year
// }) => {
//   try {
//     const response = await axios.post('/predict', {
//       beds,
//       baths,
//       acre_lot,
//       house_size,
//       state,
//       start_year
//     });

//     return response.data;
//   } catch (error) {
//     throw new Error(
//       `Failed to fetch price forecast: ${error.response?.data?.detail || error.message}`
//     );
//   }
// };

// // Fetch state's ZIP code boundaries from GitHub
// export const fetchStateZipBoundaries = async (state) => {
//   try {
//     //const stateCode = state.toLowerCase();
//     const stateCode = state.toLowerCase();
//     const url = stateGeoJsonUrls[stateCode];
    
//     if (!url) {
//       throw new Error(`No GeoJSON data available for state: ${state}`);
//     }
    
//     const response = await axios.get(url);
//     return response.data;
//   } catch (error) {
//     throw new Error(`Failed to load ZIP code boundaries for ${state.toUpperCase()}: ${error.message}`);
//   }
// };

// // Get city coordinates - try geocoding API first, fall back to default coordinates
// export const getCityLocation = async (city, state) => {
//   return await getCoordinatesFromGeocoding(city, state);
// };

// export const fetchAcresHistogram = async (state, city) => {
//   // console.log('Attempting to fetch histogram data for:', state, city);
//   try {
//     const url = `http://localhost:8000/api/acres-histogram?state=${state}&city=${city}`;
//     // console.log('Fetching from URL:', url);
    
//     const response = await fetch(url);
//     // console.log('Response status:', response.status);
    
//     const data = await response.json();
//     // console.log('Received data:', data);
    
//     if (data.error) {
//       throw new Error(data.error);
//     }
    
//     return data;
//   } catch (error) {
//     console.error('Error fetching histogram data:', error);
//     throw new Error(`Failed to fetch histogram data: ${error.message}`);
//   }
// };  

// export const fetchHeatmapData = async (city) => {
//   try {
//     const url = `http://localhost:8000/api/heatmap?city=${city}`;
//     const response = await fetch(url);
//     const data = await response.json();

//     if (data.error) {
//       throw new Error(data.error);
//     }

//     return data;
//   } catch (error) {
//     console.error('Error fetching heatmap data:', error);
//     throw new Error(`Failed to fetch heatmap data: ${error.message}`);
//   }
// };


import axios from 'axios';
import { stateGeoJsonUrls } from '../utils/statedata';
import { getCoordinatesFromGeocoding } from '../utils/maputils';

const backendBaseURL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';
axios.defaults.baseURL = backendBaseURL;
axios.defaults.headers.common['Content-Type'] = 'application/json';
axios.defaults.headers.common['Accept'] = 'application/json';

export const fetchPriceData = async (state, city) => {
  try {
    const response = await fetch(`${backendBaseURL}/api/average-prices?state=${state}&city=${city}`);
    const data = await response.json();

    if (data.error) {
      throw new Error(data.error);
    }

    return data.result || [];
  } catch (error) {
    throw new Error(`Failed to fetch price data: ${error.message}`);
  }
};

export const fetchPriceForecast = async ({
  beds,
  baths,
  acre_lot,
  house_size,
  state,
  start_year
}) => {
  try {
    const response = await axios.post('/predict', {
      beds,
      baths,
      acre_lot,
      house_size,
      state,
      start_year
    });

    return response.data;
  } catch (error) {
    throw new Error(
      `Failed to fetch price forecast: ${error.response?.data?.detail || error.message}`
    );
  }
};

export const fetchStateZipBoundaries = async (state) => {
  try {
    const stateCode = state.toLowerCase();
    const url = stateGeoJsonUrls[stateCode];

    if (!url) {
      throw new Error(`No GeoJSON data available for state: ${state}`);
    }

    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to load ZIP code boundaries for ${state.toUpperCase()}: ${error.message}`);
  }
};

export const getCityLocation = async (city, state) => {
  return await getCoordinatesFromGeocoding(city, state);
};

export const fetchAcresHistogram = async (state, city) => {
  try {
    const url = `${backendBaseURL}/api/acres-histogram?state=${state}&city=${city}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.error) {
      throw new Error(data.error);
    }

    return data;
  } catch (error) {
    console.error('Error fetching histogram data:', error);
    throw new Error(`Failed to fetch histogram data: ${error.message}`);
  }
};

export const fetchHeatmapData = async (city) => {
  try {
    const url = `${backendBaseURL}/api/heatmap?city=${city}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.error) {
      throw new Error(data.error);
    }

    return data;
  } catch (error) {
    console.error('Error fetching heatmap data:', error);
    throw new Error(`Failed to fetch heatmap data: ${error.message}`);
  }
};

export const fetchScatterData = async (city, state) => {
  try {
    const url = `${backendBaseURL}/api/scatterplot?state=${state}&city=${city}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.error) {
      throw new Error(data.error);
    }

    return data;
  } catch (error) {
    console.error('Error fetching scatterplot data:', error);
    throw new Error(`Failed to fetch scatterplot data: ${error.message}`);
  }
};

export const fetchPricePerSqft = async (state) => {
  try {
    const url = `${backendBaseURL}/api/price-per-sqft?state=${state}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.error) {
      throw new Error(data.error);
    }

    return data;
  } catch (error) {
    console.error('Error fetching price per sqft data:', error);
    throw new Error(`Failed to fetch price-per-sqft data: ${error.message}`);
  }
};





