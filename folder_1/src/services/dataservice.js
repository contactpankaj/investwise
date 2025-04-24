
import axios from 'axios';
import { stateGeoJsonUrls } from '../utils/statedata';
import { getCoordinatesFromGeocoding } from '../utils/maputils';

const backendBaseURL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';
axios.defaults.baseURL = backendBaseURL;
axios.defaults.headers.common['Content-Type'] = 'application/json';
axios.defaults.headers.common['Accept'] = 'application/json';

export const fetchPriceData = async (state, city) => {
  try {
    // const response = await fetch(`${backendBaseURL}/api/average-prices?state=${state}&city=${city}`);
    // const data = await response.json();

    // if (data.error) {
    //   throw new Error(data.error);
    // }

    // return data.result || [];
    //const response = await fetch(`http://localhost:8000/api/average-prices?state=${state}&city=${city}`);
    const response = await fetch(`${backendBaseURL}/api/average-prices?state=${state}&city=${city}`);
    
    if (!response.ok) {
      throw new Error(`Server responded with status: ${response.status}`);
    }
    
    const responseData = await response.json();
    console.log('API Response:', responseData); // Log the full response
    
    if (responseData.error) {
      throw new Error(responseData.error);
    }
    
    // Extract the data array from the response
    const data = responseData.result || [];
    
    if (!Array.isArray(data)) {
      console.error('API returned non-array data:', data);
      return [];
    }
    
    // Find maximum price for normalization if not provided
    let maxPrice = 0;
    data.forEach(item => {
      if (item.avgPrice > maxPrice) {
        maxPrice = item.avgPrice;
      }
    });
    
    // Return formatted data with both normalized and raw values
    return data.map(item => ({
      zip: String(item.zip), // Ensure it's a string
      value: item.normalizedPrice !== undefined ? item.normalizedPrice : (maxPrice > 0 ? item.avgPrice / maxPrice : 0),
      raw_value: item.avgPrice
    }));
  } catch (error) {
    console.error('Error fetching price data:', error);
    throw new Error(`Failed to fetch price data: ${error.message}`);
  }
};

// Fetch price forecast from API
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
      beds: parseFloat(beds),
      baths: parseFloat(baths),
      acre_lot: parseFloat(acre_lot),
      house_size: parseFloat(house_size),
      state,
      start_year: parseInt(start_year)
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

// Fetch histogram data for acres
export const fetchAcresHistogram = async (state, city) => {
  try {
    // const url = `${backendBaseURL}/api/acres-histogram?state=${state}&city=${city}`;
    // const response = await fetch(url);
    // const data = await response.json();

    const url = `${backendBaseURL}/api/acres-histogram?state=${state}&city=${city}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Server responded with status: ${response.status}`);
    }
    
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





// Fetch places count (hospitals, groceries) from API
export const fetchPlacesCount = async (state, city, category) => {
  try {
    console.log(`Fetching ${category} data for ${city}, ${state}`);
    
    const url = `${backendBaseURL}/api/places-count?state=${state}&city=${city}&category=${category}`;
    console.log('Request URL:', url);
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Server responded with status: ${response.status}`);
    }
    
    const responseData = await response.json();
    console.log('API Response:', responseData);
    
    // Handle both formats - direct array or wrapped in result property
    const data = responseData.result || responseData || [];
    
    if (!Array.isArray(data)) {
      console.error('API returned non-array data:', data);
      return [];
    }
    
    // Return formatted data
    return data.map(item => ({ 
      zip: String(item.zip).replace('.0', ''),
      value: item.normalized_count, 
      raw_value: item.count // 
    }));
  } catch (error) {
    console.error(`Error fetching places count for ${category}:`, error);
    // Return empty array to prevent app from crashing
    return [];
  }
};
