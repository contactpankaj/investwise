from fastapi import APIRouter, HTTPException, Query
from ..data_processing import get_price_data
from ..utils import normalize_prices

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