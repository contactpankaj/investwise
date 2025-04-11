def test_property_price_prediction(beds, baths, acre_lot, house_size, state, start_year=None):
    """
    Predicts property prices for the next 10 years and provides historical average prices from 1990 to start_year - 1.

    Args:
        beds (float): Number of bedrooms
        baths (float): Number of bathrooms
        acre_lot (float): Size of the lot in acres
        house_size (float): Size of the house in square feet
        state (str): State to analyze historical sale data
        start_year (int): Year to start prediction (defaults to current year)

    Returns:
        list: List of dictionaries with 'year' and 'average_price' or 'predicted_price' keys
    """
    import pandas as pd
    import numpy as np
    from tensorflow.keras.models import load_model
    import pickle
    from datetime import datetime
    import os

    BASE_DIR = os.path.dirname(os.path.abspath(__file__))

    if start_year is None:
        start_year = datetime.now().year

    test_property = {
        'bed': float(beds),
        'bath': float(baths),
        'acre_lot': float(acre_lot),
        'house_size': float(house_size)
    }

    try:
        # Load model and metadata
        model = load_model(os.path.join(BASE_DIR, 'texas_model.h5'))
        with open(os.path.join(BASE_DIR, 'texas_model_data.pkl'), 'rb') as f:
            model_data = pickle.load(f)

        features = model_data['features']
        scaler = model_data['scaler']
        seq_length = model_data['seq_length']
        last_sequence = model_data['last_sequence'].copy()

        year_column_idx = features.index("year_sold") if "year_sold" in features else None

        current_sequence = last_sequence.copy()
        if year_column_idx is not None:
            current_year_scaled = scaler.transform(np.array([[start_year - 4, 0, 0, 0, 0, 0]]))[0, 0]
            for i in range(seq_length):
                current_sequence[i, year_column_idx] = current_year_scaled + i * (
                    current_sequence[1, year_column_idx] - current_sequence[0, year_column_idx]
                )

        # === Historical Data Processing ===
        df_path = os.path.abspath(os.path.join(BASE_DIR, '..', 'data', 'house_price.csv'))
        if not os.path.exists(df_path):
            raise FileNotFoundError("house_price.csv not found in 'data' directory.")

        df = pd.read_csv(df_path)
        df = df[df['state'].str.lower() == state.lower()]
        df = df.dropna(subset=['price', 'prev_sold_date'])

        # Convert prev_sold_date to datetime and extract year
        df['prev_sold_date'] = pd.to_datetime(df['prev_sold_date'], errors='coerce')
        df = df[df['prev_sold_date'].notnull()]
        df['sold_year'] = df['prev_sold_date'].dt.year
        df = df[df['sold_year'] >= 1990]

        # Group by year and calculate average
        historical_avg = df.groupby('sold_year')['price'].mean().to_dict()

        # Convert to list of dicts, round prices
        historical_results = [
            {"year": year, "average_price": int(avg)}
            for year, avg in sorted(historical_avg.items()) if year < start_year
        ]

        # === Forecast for future years ===
        forecast_results = []
        forecast_years = list(range(start_year, start_year + 10))

        for year_idx, year in enumerate(forecast_years):
            input_seq = current_sequence.reshape(1, seq_length, len(features))
            pred_scaled = model.predict(input_seq, verbose=0)[0, 0]

            pred_row = np.zeros((1, len(features)))
            pred_row[0, 0] = pred_scaled
            for i in range(1, len(features)):
                pred_row[0, i] = current_sequence[-1, i]

            pred_original = scaler.inverse_transform(pred_row)[0, 0]
            forecast_results.append({
                "year": year,
                "predicted_price": int(pred_original)
            })

            if year_idx < len(forecast_years) - 1:
                new_features = []
                for idx, feature in enumerate(features):
                    if feature == 'price':
                        new_features.append(pred_original)
                    elif feature == 'year_sold':
                        new_features.append(year + 1)
                    elif feature in test_property:
                        new_features.append(test_property[feature])
                    else:
                        new_features.append(scaler.inverse_transform(pred_row)[0, idx])

                new_array = np.array(new_features).reshape(1, -1)
                new_scaled = scaler.transform(new_array)

                new_timestep = np.zeros_like(current_sequence[0])
                for i in range(len(features)):
                    new_timestep[i] = new_scaled[0, i]

                current_sequence = np.vstack([current_sequence[1:], new_timestep])

        # Combine historical and forecast into one list
        final_combined = historical_results + forecast_results

        print(final_combined)

        return final_combined

    except Exception as e:
        import traceback
        return {
            'error': str(e),
            'traceback': traceback.format_exc()
        }



# Example usage
if __name__ == "__main__":
    # Test with example property in Texas
    beds = 3.0
    baths = 2.0
    acre_lot = 0.15
    house_size = 1800.0
    start_year = 2025
    state =  'texas'
    
    results = test_property_price_prediction(beds, baths, acre_lot, house_size, state, start_year)
    
    if isinstance(results, dict) and 'error' in results:
        print(f"Error making prediction: {results['error']}")
    else:
        print("10-Year Price Forecast:")
        print(results)
        # for result in results:
        #     print(f"Year {result['year']}: ${result['predicted_price']:,.2f}")
        # print("Historical Averages:")
        # for item in results["historical"]:
        #     print(f"Year {item['year']}: ${item['average_price']:,.2f}")

        # print("\n10-Year Price Forecast:")
        # for item in results["forecast"]:
        #     print(f"Year {item['year']}: ${item['predicted_price']:,.2f}")












