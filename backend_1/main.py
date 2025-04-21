from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

from app.routes import router
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
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include router
app.include_router(router)

# Process the CSV file on server startup
@app.on_event("startup")
async def startup_event():
    process_csv_data()

# Run the server if this file is executed directly
if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)