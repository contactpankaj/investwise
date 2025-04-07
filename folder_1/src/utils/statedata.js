// State GeoJSON URLs and city coordinates

// Map of state codes to their GeoJSON URLs
export const stateGeoJsonUrls = {
    'texas': 'https://raw.githubusercontent.com/OpenDataDE/State-zip-code-GeoJSON/master/tx_texas_zip_codes_geo.min.json',
    'california': 'https://raw.githubusercontent.com/OpenDataDE/State-zip-code-GeoJSON/master/ca_california_zip_codes_geo.min.json',
    'new york': 'https://raw.githubusercontent.com/OpenDataDE/State-zip-code-GeoJSON/master/ny_new_york_zip_codes_geo.min.json',
    'arizonaz': 'https://raw.githubusercontent.com/OpenDataDE/State-zip-code-GeoJSON/master/az_arizona_zip_codes_geo.min.json',
    'washington': 'https://raw.githubusercontent.com/OpenDataDE/State-zip-code-GeoJSON/master/wa_washington_zip_codes_geo.min.json'
  };
  
  // State display names
  export const stateNames = {
    'texas': 'texas',
    'california': 'california',
    'new york': 'new york',
    'arizona': 'arizona',
    'washington': 'washington'
  };
  
  // Popular cities in each state (used as default options)
  export const popularCities = {
    'texas': ['houston', 'dallas', 'austin', 'san antonio'],
    'california': ['los angeles', 'san francisco', 'san diego', 'sacramento'],
    'new york': ['new york', 'buffalo', 'rochester', 'albany'],
    'arizona': ['phoenix', 'tucson', 'scottsdale', 'flagstaff'],
    'washington': ['seattle', 'spokane', 'tacoma', 'olympia']
  };
  
  // Default city coordinates for initial map view
  // Note: This will be replaced by the geocoding API in production
  export const defaultCityCoordinates = {
    'tx': {
      'houston': [29.7604, -95.3698],
      'dallas': [32.7767, -96.7970],
      'austin': [30.2672, -97.7431],
      'san antonio': [29.4252, -98.4946]
    },
    'ca': {
      'los angeles': [34.0522, -118.2437],
      'san francisco': [37.7749, -122.4194],
      'san diego': [32.7157, -117.1611],
      'sacramento': [38.5816, -121.4944]
    },
    'ny': {
      'new york': [40.7128, -74.0060],
      'buffalo': [42.8864, -78.8784],
      'rochester': [43.1566, -77.6088],
      'albany': [42.6526, -73.7562]
    },
    'az': {
      'phoenix': [33.4484, -112.0740],
      'tucson': [32.2226, -110.9747],
      'scottsdale': [33.4942, -111.9261],
      'flagstaff': [35.1983, -111.6513]
    },
    'wa': {
      'seattle': [47.6062, -122.3321],
      'spokane': [47.6588, -117.4260],
      'tacoma': [47.2529, -122.4443],
      'olympia': [47.0379, -122.9007]
    }
  };