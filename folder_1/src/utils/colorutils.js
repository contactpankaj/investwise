// Color utils for price visualization

// Function to map normalized price to color with improved gradient
export const getColorBasedOnPrice = (normalizedPrice) => {
    // Using an improved gradient for better visualization
    if (normalizedPrice === undefined || normalizedPrice === null) {
      return '#CCCCCC'; // Gray for missing data
    } else if (normalizedPrice < 0.7) {
      return '#00CC00'; // Dark green for very low prices
    } else if (normalizedPrice < 0.8) {
      return '#66FF66'; // Medium green
    } else if (normalizedPrice < 0.9) {
      return '#BBFF88'; // Light green-yellow
    } else if (normalizedPrice < 1.0) {
      return '#FFFF00'; // Yellow for average
    } else if (normalizedPrice < 1.1) {
      return '#FFBB33'; // Light orange
    } else if (normalizedPrice < 1.2) {
      return '#FF6600'; // Dark orange
    } else {
      return '#FF0000'; // Red for very high prices
    }
  };
  
  // Get price category based on normalized price
export const getPriceCategory = (normalizedPrice) => {
    if (normalizedPrice === undefined || normalizedPrice === null) {
      return "N/A";
    } else if (normalizedPrice < 0.7) {
      return "Very Low";
    } else if (normalizedPrice < 0.8) {
      return "Low";
    } else if (normalizedPrice < 0.9) {
      return "Below Average";
    } else if (normalizedPrice < 1.0) {
      return "Average";
    } else if (normalizedPrice < 1.1) {
      return "Above Average";
    } else if (normalizedPrice < 1.2) {
      return "High";
    } else {
      return "Very High";
    }
  };
  
  // Price legend data
export const legendItems = [
    { color: '#00CC00', label: 'Very Low (<0.7)' },
    { color: '#66FF66', label: 'Low (0.7-0.8)' },
    { color: '#BBFF88', label: 'Below Average (0.8-0.9)' },
    { color: '#FFFF00', label: 'Average (0.9-1.0)' },
    { color: '#FFBB33', label: 'Above Average (1.0-1.1)' },
    { color: '#FF6600', label: 'High (1.1-1.2)' },
    { color: '#FF0000', label: 'Very High (>1.2)' },
    { color: '#CCCCCC', label: 'No Data' }
  ];