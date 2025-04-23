# file: routers/price_per_sqft.py
from fastapi import APIRouter, HTTPException, Query
from fastapi.responses import JSONResponse
import pandas as pd
import os

router = APIRouter()

STATE_CITIES = {
    "arizona": ["flagstaff", "mesa", "tucson", "tempe", "scottsdale"],
    "california": ["los angeles", "sacramento", "san diego", "san francisco", "san jose"],
    "texas": ["austin", "dallas", "houston", "fort worth", "san antonio"],
    "new york": ["brooklyn", "buffalo", "manhattan", "new york city", "rochester"],
    "washington": ["bellevue", "olympia", "seattle", "spokane", "tacoma"]
}

@router.get("/api/price-per-sqft")
async def get_avg_price_per_sqft(state: str = Query(..., description="State name")):
    try:
        state = state.lower().strip()
        if state not in STATE_CITIES:
            raise HTTPException(status_code=400, detail=f"State '{state}' is not supported.")

        # Load CSV
        file_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 'data', 'house_price.csv')
        if not os.path.exists(file_path):
            raise HTTPException(status_code=404, detail="CSV file not found")

        df = pd.read_csv(file_path)
        df = df.dropna(subset=['price', 'house_size', 'city', 'state'])

        # Clean columns
        df['price'] = df['price'].replace('[\$,]', '', regex=True).astype(float)
        df['house_size'] = pd.to_numeric(df['house_size'], errors='coerce')
        df['city'] = df['city'].str.lower().str.strip()
        df['state'] = df['state'].str.lower().str.strip()
        df = df.dropna(subset=['house_size'])

        # Filter rows for the given state and its 5 cities
        selected_cities = STATE_CITIES[state]
        df_filtered = df[(df['state'] == state) & (df['city'].isin(selected_cities))]

        if df_filtered.empty:
            raise HTTPException(status_code=404, detail=f"No data found for state '{state}'.")

        # Calculate price per square foot
        # df_filtered['price_per_sqft'] = df_filtered['price'] / df_filtered['house_size']
        df_filtered = df[(df['state'] == state) & (df['city'].isin(selected_cities))].copy()
        df_filtered['price_per_sqft'] = df_filtered['price'] / df_filtered['house_size']

        result = df_filtered.groupby('city')['price_per_sqft'].mean().reset_index()
        result['price_per_sqft'] = result['price_per_sqft'].round(2)

        chart_data = result.to_dict(orient='records')

        return JSONResponse(content={
            "state": state,
            "chart_data": chart_data,
            "metadata": {
                "x_label": "City",
                "y_label": "Avg Price per Sqft (USD)",
                "num_cities": len(chart_data)
            }
        })

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing price-per-sqft chart: {str(e)}")
