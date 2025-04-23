from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel
from ..data_processing import get_price_data
from ..utils import normalize_prices
from ..ML_model import test_property_price_prediction
import pandas as pd
import numpy as np
import os

router = APIRouter()

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
        acres = acres[(acres > 0) & (acres <= 10000)]  # Only keep values in (0, 10]

        
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
