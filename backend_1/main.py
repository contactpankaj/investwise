from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

# Import routers
from app.routes import router  # Your main app routes
from app.routes.histogram import router as histogram_router  # ✅ Histogram router

# Optional: CSV processing if needed
from app.data_processing import process_csv_data

# Initialize FastAPI app
app = FastAPI(title="House Price API")

origins = [
    "https://investwise0001.netlify.app",  # ✅ your Netlify frontend
    "http://localhost:3000",               # for local dev
]

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(router)
app.include_router(histogram_router)  # ✅ Include histogram route

# Optional: preprocess CSV on startup
@app.on_event("startup")
async def startup_event():
    process_csv_data()

# Run the server
if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=False)
