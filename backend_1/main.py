from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

from app.routes import router
from app.data_processing import process_csv_data

app = FastAPI(title="House Price API")

# ✅ Allow all origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 🔓 Allow all domains
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)

@app.on_event("startup")
async def startup_event():
    process_csv_data()

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=False)
