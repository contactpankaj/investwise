import os
import pandas as pd

# Cache for processed data
price_data_cache = {}

def process_csv_data():
    """
    Process the CSV file and cache the results
    """
    try:
        file_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'data', 'house_price.csv')
        print(file_path)
        df = pd.read_csv(file_path)
        
        # Clean data - convert to lowercase and handle missing values
        df['state'] = df['state'].str.lower()
        df['city'] = df['city'].str.lower()
        
        # Filter out rows with missing values
        df = df.dropna(subset=['state', 'city', 'zip_code', 'price'])
        
        # Convert price to numeric
        df['price'] = pd.to_numeric(df['price'], errors='coerce')
        df = df.dropna(subset=['price'])
        
        # Group by state, city, zip and calculate average price
        grouped = df.groupby(['state', 'city', 'zip_code']).agg({'price': 'mean'}).reset_index()
        
        # Format the data for caching
        for _, row in grouped.iterrows():
            state_city_key = f"{row['state']}_{row['city']}"
            if state_city_key not in price_data_cache:
                price_data_cache[state_city_key] = []
            
            price_data_cache[state_city_key].append({
                'zip': row['zip_code'],
                'avgPrice': round(row['price']),
                'normalizedPrice': 1  # This will be calculated when requested
            })
        
        # print("Data processed and cached successfully")
    except Exception as e:
        print(f"Error processing CSV data: {e}")
        raise

def get_price_data(state: str, city: str):
    """
    Get price data for a specific state and city
    """
    state_city_key = f"{state}_{city}"
    return price_data_cache.get(state_city_key)