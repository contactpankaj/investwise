
// import React from 'react';
// import MapComponent from './MapComponent';

// const HeatMapView = ({
//   mapCenter,
//   mapZoom,
//   stateGeoJson,
//   locationData,
//   selectedState,
//   selectedCity,
// }) => {
//   return (
//     <div>
//       <h3 className="text-xl font-bold mb-4">Heatmap Visualization</h3>
      
//       <div style={{ height: '10px' /* or any value you want */ }}>
//         <MapComponent
//           mapCenter={mapCenter}
//           mapZoom={mapZoom}
//           stateGeoJson={stateGeoJson}
//           locationData={locationData}
//           selectedState={selectedState}
//           selectedCity={selectedCity}
//         />
//       </div>
//     </div>
//   );
// };

// export default HeatMapView;

import React from 'react';
import MapComponent from './MapComponent';

const HeatMapView = ({
  mapCenter,
  mapZoom,
  stateGeoJson,
  locationData,
  selectedState,
  selectedCity,
}) => {
  const title =
    selectedCity && selectedState
      ? `Price Heatmap for ${selectedCity}, ${selectedState}`
      : 'Price Heatmap';

  return (
    <div>
      <h4 className="text-sm font-bold mb-4">{title}</h4>

      <div style={{ height: '230px' }}>
        <MapComponent
          mapCenter={mapCenter}
          mapZoom={mapZoom}
          stateGeoJson={stateGeoJson}
          locationData={locationData}
          selectedState={selectedState}
          selectedCity={selectedCity}
        />
      </div>
    </div>
  );
};

export default HeatMapView;
