from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel
from ..data_processing import get_price_data
from ..utils import normalize_prices
from ..ML_model import test_property_price_prediction

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