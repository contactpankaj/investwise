from fastapi import APIRouter, HTTPException, Query
from fastapi.responses import JSONResponse
import pandas as pd
import os

router = APIRouter()

@router.get("/api/scatterplot")
async def get_scatterplot_data(
    state: str = Query(..., description="State name"),
    city: str = Query(..., description="City name")
):
    try:
        # Normalize input
        state = state.lower()
        city = city.lower()

        # Load CSV
        file_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 'data', 'house_price.csv')
        
        if not os.path.exists(file_path):
            raise HTTPException(status_code=404, detail=f"CSV file not found at {file_path}")

        # Read and clean data
        df = pd.read_csv(file_path)
        df = df.dropna(subset=['price', 'house_size', 'city', 'state'])

        df['price'] = df['price'].replace('[\$,]', '', regex=True).astype(float)
        df['house_size'] = pd.to_numeric(df['house_size'], errors='coerce')
        df['city'] = df['city'].str.lower().str.strip()
        df['state'] = df['state'].str.lower().str.strip()
        df = df.dropna(subset=['house_size'])

        # Filter by city and state
        filtered_df = df[(df['city'] == city) & (df['state'] == state)]

        if filtered_df.empty:
            raise HTTPException(
                status_code=404,
                detail=f"No data found for city '{city.title()}' in state '{state.upper()}'"
            )

        # Optional filter to remove extreme outliers
        filtered_df = filtered_df[filtered_df['house_size'] <= 10000]

        # Prepare scatter data
        scatter_data = filtered_df[['house_size', 'price']].to_dict(orient='records')

        return JSONResponse(content={
            "city": city.title(),
            "state": state.upper(),
            "scatter_data": scatter_data,
            "metadata": {
                "x_label": "House Size (sqft)",
                "y_label": "Price (USD)",
                "total_points": len(scatter_data)
            }
        })

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error processing scatterplot data: {str(e)}"
        )
