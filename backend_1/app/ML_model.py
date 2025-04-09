def test_property_price_prediction(beds, baths, acre_lot, house_size, start_year=None):
    """
    Test function that predicts property prices for the next 10 years based on property features.
    
    Args:
        beds (float): Number of bedrooms
        baths (float): Number of bathrooms
        acre_lot (float): Size of the lot in acres
        house_size (float): Size of the house in square feet
        start_year (int): Year to start prediction (defaults to current year)
        
    Returns:
        list: List of dictionaries containing year and predicted price for 10 years
    """
    import pandas as pd
    import numpy as np
    from tensorflow.keras.models import load_model
    import pickle
    from datetime import datetime
    import os
    
    BASE_DIR = os.path.dirname(os.path.abspath(__file__))

    

    # Set default start year if not provided
    if start_year is None:
        start_year = datetime.now().year
    
    # Create property data dictionary
    test_property = {
        'bed': float(beds),
        'bath': float(baths),
        'acre_lot': float(acre_lot),
        'house_size': float(house_size)
    }
    
    try:
        # Load model and model data
        # model = load_model('texas_model.h5')
        model = load_model(os.path.join(BASE_DIR, 'texas_model.h5'))
        
        # with open('texas_model_data.pkl', 'rb') as f:
        #     model_data = pickle.load(f)
        with open(os.path.join(BASE_DIR, 'texas_model_data.pkl'), 'rb') as f:
            model_data = pickle.load(f)
        
        features = model_data['features']
        scaler = model_data['scaler']
        seq_length = model_data['seq_length']
        last_sequence = model_data['last_sequence'].copy()
        
        # Year column index
        year_column_idx = features.index("year_sold") if "year_sold" in features else None
        
        # Set up sequence for first prediction (use last sequence from training)
        current_sequence = last_sequence.copy()
        
        # Update the year in the sequence to match the forecast start
        if year_column_idx is not None:
            # Find the start year in the sequence
            current_year_scaled = scaler.transform(np.array([[start_year - 4, 0, 0, 0, 0, 0]]))[0, 0]
            for i in range(seq_length):
                current_sequence[i, year_column_idx] = current_year_scaled + i * (current_sequence[1, year_column_idx] - current_sequence[0, year_column_idx])
        
        # Initialize results array
        results = []
        forecast_years = list(range(start_year, start_year + 10))
        
        # Forecast for each year
        for year_idx, year in enumerate(forecast_years):
            print(f"Predicting for year: {year}")
            # Create the input sequence for this year
            input_seq = current_sequence.reshape(1, seq_length, len(features))
            
            # Make prediction
            pred_scaled = model.predict(input_seq, verbose=0)[0, 0]
            
            # Create a full row for inverse transform
            pred_row = np.zeros((1, len(features)))
            pred_row[0, 0] = pred_scaled  # Set predicted price (scaled)
            
            # Set other feature values (from the last timestep in our sequence)
            for i in range(1, len(features)):
                pred_row[0, i] = current_sequence[-1, i]
            
            # Inverse transform to get original scale
            pred_original = scaler.inverse_transform(pred_row)[0, 0]
            
            # Add to results
            results.append({
                "year": year,
                "predicted_price": round(pred_original, 2)
            })
            
            # If this isn't the last year, prepare for next prediction
            if year_idx < len(forecast_years) - 1:
                # Prepare new timestep for next prediction
                new_features = []
                for idx, feature in enumerate(features):
                    if feature == 'price':
                        new_features.append(pred_original)  # Use predicted price
                    elif feature == 'year_sold':
                        new_features.append(year + 1)  # Increment year
                    elif feature in test_property:
                        new_features.append(test_property[feature])
                    else:
                        # Keep the previous value for features not in test_property
                        new_features.append(scaler.inverse_transform(pred_row)[0, idx])
                
                # Scale the new features
                new_array = np.array(new_features).reshape(1, -1)
                new_scaled = scaler.transform(new_array)
                
                # Create new sequence by dropping oldest timestep and adding new one
                new_timestep = np.zeros_like(current_sequence[0])
                for i in range(len(features)):
                    new_timestep[i] = new_scaled[0, i]
                
                current_sequence = np.vstack([current_sequence[1:], new_timestep])
        print(results)
        return results
    
    except Exception as e:
        import traceback
        return {
            'error': str(e),
            'traceback': traceback.format_exc()
        }

# # Example usage
# if __name__ == "__main__":
#     # Test with example property in Texas
#     beds = 3.0
#     baths = 2.0
#     acre_lot = 0.15
#     house_size = 1800.0
#     start_year = 2025
    
#     results = test_property_price_prediction(beds, baths, acre_lot, house_size, start_year)
    
#     if isinstance(results, dict) and 'error' in results:
#         print(f"Error making prediction: {results['error']}")
#     else:
#         print("10-Year Price Forecast:")
#         print(results)
#         for result in results:
#             print(f"Year {result['year']}: ${result['predicted_price']:,.2f}")