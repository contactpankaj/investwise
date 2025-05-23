from fastapi import APIRouter, HTTPException, Query
from ..data_processing import get_price_data
from ..utils import normalize_prices
from .average_price import router as avg_price_router
from .histogram import router as histogram_router
from .heatmapbed import router as heapmap_router
from .amenties import router as amenities_router
from .scatterplotvis import router as scatter_router
from .pricepersqfoot import router as price_router

router = APIRouter()
router.include_router(avg_price_router)
router.include_router(histogram_router)
router.include_router(heapmap_router)
router.include_router(amenities_router)
router.include_router(scatter_router)
router.include_router(price_router)




