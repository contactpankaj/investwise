from fastapi import APIRouter, HTTPException, Query
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import pandas as pd
import numpy as np
import os
import requests
import time
from fastapi.responses import JSONResponse
from ..data_processing import get_price_data
from ..utils import normalize_prices
from ..ML_model import test_property_price_prediction

router = APIRouter()

GOOGLE_API_KEY = "AIzaSyBGCIVIN2UpI6M44P3HxQNfZ1p82XeOtGM"

@router.get("/api/average-prices")
async def get_average_prices(
    state: str = Query(..., description="State name"),
    city: str = Query(..., description="City name")
):
    state = state.lower()
    city = city.lower()
    
    data = get_price_data(state, city)
    
    if not data:
        raise HTTPException(status_code=404, detail="No data available for this city/state combination")
    
    normalized_data = normalize_prices(data)
    
    return {
        "result": normalized_data
        }




@router.get("/")
async def root():
    """
    Root endpoint
    """
    return {"message": "Server is running on http://localhost:8000"}

# ---------- New Prediction Route ----------

class PredictionRequest(BaseModel):
    beds: float
    baths: float
    acre_lot: float
    house_size: float
    state: str
    start_year: int | None = None

@router.post("/predict")
async def predict_price(req: PredictionRequest):
    result = test_property_price_prediction(
        beds=req.beds,
        baths=req.baths,
        acre_lot=req.acre_lot,
        house_size=req.house_size,
        state = req.state,
        start_year=req.start_year
    )
    
    if isinstance(result, dict) and 'error' in result:
        raise HTTPException(status_code=500, detail=result["error"])
    
    return {"forecast": result}

# ---------- histogram Route ----------
@router.get("/api/acres-histogram")
async def get_acres_histogram(
    state: str = Query(..., description="State name"),
    city: str = Query(..., description="City name")
):
    try:
        # Load CSV
        file_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 'data', 'house_price.csv')
        # print(f"Loading CSV from: {file_path}")
        
        if not os.path.exists(file_path):
            print(f"File not found: {file_path}")
            raise HTTPException(status_code=404, detail=f"CSV file not found at {file_path}")

        # Load and clean data
        df = pd.read_csv(file_path)
        # print(f"CSV loaded. Shape: {df.shape}")
        
        # Clean state and city
        df['state'] = df['state'].str.lower().str.strip()
        df['city'] = df['city'].str.lower().str.strip()
        
        # Convert acre_lot to numeric, replacing any non-numeric values with NaN
        df['acre_lot'] = pd.to_numeric(df['acre_lot'], errors='coerce')
        
        # Print unique states and cities for debugging
        # print(f"States in dataset: {df['state'].unique().tolist()}")
        # print(f"Looking for state: {state.lower()}, city: {city.lower()}")

        # Filter by state and city
        filtered = df[
            (df['state'].str.lower() == state.lower()) & 
            (df['city'].str.lower() == city.lower())
        ]
        
        # print(f"Found {len(filtered)} properties for {city}, {state}")

        if filtered.empty:
            # print(f"No data found for {state}, {city}")
            raise HTTPException(
                status_code=404, 
                detail=f"No data found for state '{state}' and city '{city}'"
            )

        # Process acres data
        acres = filtered['house_size'].dropna()
        acres = acres[(acres > 0) & (acres <= 5000)]  # Only keep values in (0, 10]

        
        if acres.empty:
            # print(f"No valid acre data for {city}, {state}")
            raise HTTPException(
                status_code=404,
                detail=f"No valid acre data for {city}, {state}"
            )

        # Sort acres for better understanding of distribution
        sorted_acres = sorted(acres.tolist())
        # print(f"Sorted acre values: {sorted_acres}")
        
        # Calculate statistics
        min_acres = acres.min()
        max_acres = acres.max()
        mean_acres = acres.mean()
        median_acres = np.median(acres)
        
        # print(f"Acre stats - Min: {min_acres:.4f}, Max: {max_acres:.4f}, Mean: {mean_acres:.4f}, Median: {median_acres:.4f}")
        # print(f"Number of valid acre values: {len(acres)}")

        # Use automatic binning ('auto' often uses Sturges or FD)
        # Ensure at least 10 bins if possible, but cap at 50 for readability
        num_bins = 'auto'
        hist, bin_edges = np.histogram(acres, bins=num_bins)

        # If 'auto' results in too few bins, increase it (e.g., min 10, max 50)
        min_desired_bins = 50
        max_allowed_bins = 100
        if len(bin_edges) -1 < min_desired_bins and len(acres) > min_desired_bins:
            #  print(f"Automatic bins ({len(bin_edges)-1}) too few, recalculating with {min_desired_bins} bins.")
             hist, bin_edges = np.histogram(acres, bins=min(min_desired_bins, len(acres))) # Use min_desired_bins, but no more bins than data points
        elif len(bin_edges) -1 > max_allowed_bins:
            #  print(f"Automatic bins ({len(bin_edges)-1}) too many, recalculating with {max_allowed_bins} bins.")
             hist, bin_edges = np.histogram(acres, bins=max_allowed_bins)

        # print(f"Using {len(bin_edges)-1} bins.")
        # print(f"Bin edges: {bin_edges.tolist()}")
        # print(f"Histogram frequencies: {hist.tolist()}")

        # Create formatted bin labels (handle potentially non-uniform widths)
        bin_labels = [f"{bin_edges[i]:.3f}-{bin_edges[i+1]:.3f}" for i in range(len(bin_edges)-1)]
        
        # Prepare response data
        response_data = {
            "labels": bin_labels,
            "frequencies": hist.tolist(),
            "metadata": {
                "total_properties": int(len(acres)),
                "min_acres": float(min_acres),
                "max_acres": float(max_acres),
                "avg_acres": float(mean_acres),
                "median_acres": float(median_acres),
                "bin_edges": bin_edges.tolist(),
                "number_of_bins": len(hist),
                "bin_size": float(bin_edges[1] - bin_edges[0])
            }
        }
        
        # print("Successfully created histogram data")
        # print(f"Response data: {response_data}")
        
        return response_data

    except Exception as e:
        # print(f"Error processing request: {str(e)}")
        # print("Full traceback:")
        # print(traceback.format_exc())
        raise HTTPException(
            status_code=500, 
            detail=f"Error processing histogram data: {str(e)}"
        )
    


    # ---------- Acres Histogram ----------

@router.get("/api/acres-histogram")
async def get_acres_histogram(state: str, city: str):
    file_path = os.path.join("data", "house_price.csv")
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="CSV file not found")

    df = pd.read_csv(file_path)
    df['state'] = df['state'].str.lower().str.strip()
    df['city'] = df['city'].str.lower().str.strip()
    df['acre_lot'] = pd.to_numeric(df['acre_lot'], errors='coerce')

    filtered = df[(df['state'] == state.lower()) & (df['city'] == city.lower())]
    acres = filtered['house_size'].dropna()
    acres = acres[(acres > 0) & (acres <= 5000)]

    if acres.empty:
        raise HTTPException(status_code=404, detail="No valid acre data")

    hist, bin_edges = np.histogram(acres, bins='auto')
    bin_labels = [f"{bin_edges[i]:.3f}-{bin_edges[i+1]:.3f}" for i in range(len(bin_edges)-1)]

    return {
        "labels": bin_labels,
        "frequencies": hist.tolist(),
        "metadata": {
            "min_acres": float(acres.min()),
            "max_acres": float(acres.max()),
            "avg_acres": float(acres.mean()),
            "bin_edges": bin_edges.tolist()
        }
    }

# ---------- Heatmap Chart ----------

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

# ---------- Price per Sqft ----------

@router.get("/api/price-per-sqft")
async def get_price_per_sqft(state: str):
    STATE_CITIES = {
        "arizona": ["flagstaff", "mesa", "tucson", "tempe", "scottsdale"],
        "california": ["los angeles", "sacramento", "san diego", "san francisco", "san jose"],
        "texas": ["austin", "dallas", "houston", "fort worth", "san antonio"],
        "new york": ["brooklyn", "buffalo", "manhattan", "new york city", "rochester"],
        "washington": ["bellevue", "olympia", "seattle", "spokane", "tacoma"]
    }

    file_path = os.path.join("data", "house_price.csv")
    df = pd.read_csv(file_path)
    df = df.dropna(subset=['price', 'house_size'])

    df['price'] = df['price'].replace('[\$,]', '', regex=True).astype(float)
    df['house_size'] = pd.to_numeric(df['house_size'], errors='coerce')
    df['city'] = df['city'].str.lower()
    df['state'] = df['state'].str.lower()

    cities = STATE_CITIES.get(state.lower())
    df_filtered = df[(df['state'] == state.lower()) & (df['city'].isin(cities))]

    df_filtered['price_per_sqft'] = df_filtered['price'] / df_filtered['house_size']
    result = df_filtered.groupby('city')['price_per_sqft'].mean().reset_index()
    result['price_per_sqft'] = result['price_per_sqft'].round(2)

    return {"chart_data": result.to_dict(orient='records')}

# ---------- Scatterplot ----------

@router.get("/api/scatterplot")
async def get_scatterplot(state: str, city: str):
    file_path = os.path.join("data", "house_price.csv")
    df = pd.read_csv(file_path).dropna(subset=['price', 'house_size', 'state', 'city'])

    df['price'] = df['price'].replace('[\$,]', '', regex=True).astype(float)
    df['house_size'] = pd.to_numeric(df['house_size'], errors='coerce')
    df = df[(df['state'].str.lower() == state.lower()) & (df['city'].str.lower() == city.lower())]
    df = df[df['house_size'] <= 10000]

    return {
        "scatter_data": df[['house_size', 'price']].to_dict(orient='records')
    }

# ---------- Places Count ----------

def get_zip_codes_for_city_state(state: str, city: str):
    file_path = os.path.join("data", "house_price.csv")
    df = pd.read_csv(file_path)
    df['city'] = df['city'].str.lower()
    df['state'] = df['state'].str.lower()
    matched = df[(df['state'] == state.lower()) & (df['city'] == city.lower())]
    return matched['zip_code'].astype(str).tolist()

def get_lat_lng(zip_code: str):
    url = f"https://maps.googleapis.com/maps/api/geocode/json?address={zip_code}&key={GOOGLE_API_KEY}"
    res = requests.get(url)
    if res.ok and res.json().get("status") == "OK":
        loc = res.json()["results"][0]["geometry"]["location"]
        return loc["lat"], loc["lng"]
    return None, None

def get_places(lat, lng, category="hospital", radius=3000):
    url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json"
    params = {"location": f"{lat},{lng}", "radius": radius, "type": category, "key": GOOGLE_API_KEY}
    res = requests.get(url, params=params)
    return len(res.json().get("results", []))

@router.get("/api/places-count")
async def get_places_count(state: str, city: str, category: str):
    zip_codes = get_zip_codes_for_city_state(state, city)
    results = []
    max_count = 0

    for zip_code in zip_codes[:30]:
        lat, lng = get_lat_lng(zip_code)
        count = get_places(lat, lng, category) if lat and lng else 0
        max_count = max(max_count, count)
        results.append({"zip": zip_code, "count": count})

    return {
        "result": [
            {
                "zip": r["zip"],
                "count": r["count"],
                "normalized_count": 1 - r["count"] / max_count if max_count else 0
            } for r in results
        ]
    }
