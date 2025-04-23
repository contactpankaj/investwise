# file: routers/heatmap.py
from fastapi import APIRouter, HTTPException, Query
import pandas as pd
import os
import traceback
from fastapi.responses import JSONResponse

router = APIRouter()

@router.get("/api/heatmap")
async def get_heatmap(
    city: str = Query(..., description="City name")
):
    try:
        file_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 'data', 'house_price.csv')

        if not os.path.exists(file_path):
            raise HTTPException(status_code=404, detail=f"CSV file not found at {file_path}")

        df = pd.read_csv(file_path)
        df = df.dropna(subset=['bed', 'bath', 'city', 'price'])

        # Convert price to numeric if it's a string with dollar sign/comma
        df['price'] = df['price'].replace('[\$,]', '', regex=True).astype(float)
        df['bed'] = df['bed'].astype(int)
        df['bath'] = df['bath'].astype(int)
        df['city'] = df['city'].str.lower().str.strip()

        # Filter to only include up to 6 beds and 6 baths
        df = df[(df['bed'] <= 6) & (df['bath'] <= 6)]
        
        city = city.lower().strip()
        city_df = df[df['city'] == city]

        if city_df.empty:
            raise HTTPException(status_code=404, detail=f"No data found for city '{city}'")

        pivot_table = city_df.pivot_table(index='bath', columns='bed', values='price', aggfunc='mean', fill_value=0)
        sorted_beds = sorted(pivot_table.columns.tolist())
        sorted_baths = sorted(pivot_table.index.tolist())
        pivot_table = pivot_table.reindex(index=sorted_baths, columns=sorted_beds, fill_value=0)
        pivot_json = pivot_table.reset_index().to_dict(orient='records')

        # Calculate min and max for the color scale
        min_price = pivot_table.values.min()
        max_price = pivot_table.values.max()

        return JSONResponse(content={
            "city": city,
            "matrix": pivot_json,
            "beds": sorted_beds,
            "baths": sorted_baths,
            "metadata": {
                "x_label": "Bedrooms",
                "y_label": "Bathrooms",
                "metric": "average_price",
                "min_price": min_price,
                "max_price": max_price
            }
        })

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing heatmap: {str(e)}")