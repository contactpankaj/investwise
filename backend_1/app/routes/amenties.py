# from fastapi import APIRouter, HTTPException, Query
# import requests
# import pandas as pd
# import os

# router = APIRouter()

# GOOGLE_API_KEY = "AIzaSyBGCIVIN2UpI6M44P3HxQNfZ1p82XeOtGM"


# def fetch_full_results(params):
#     all_results = []
#     url = "https://maps.googleapis.com/maps/api/place/textsearch/json"
    
#     while True:
#         response = requests.get(url, params=params, timeout=5)
#         data = response.json()

#         if "error_message" in data:
#             print(f"Google API error: {data['error_message']}")
#             break

#         results = data.get("results", [])
#         all_results.extend(results)

#         next_page_token = data.get("next_page_token")
#         if not next_page_token:
#             break

#         # Google says next_page_token takes a few seconds to activate
#         import time
#         time.sleep(2)  # wait before the next request
#         params = {
#             'key': GOOGLE_API_KEY,
#             'pagetoken': next_page_token
#         }

#     return all_results


# def get_zip_codes_for_city_state(state: str, city: str):
    
#     file_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 'data', 'house_price.csv')
#     df = pd.read_csv(file_path)
#     df['city'] = df['city'].str.lower()
#     df['state'] = df['state'].str.lower()
#     matched = df[(df['state'] == state.lower()) & (df['city'] == city.lower())]
#     return matched['zip_code'].astype(str).tolist()

# @router.get("/api/places-count")
# async def get_places_count(
#     state: str = Query(..., description="State name"),
#     city: str = Query(..., description="City name"),
#     category: str = Query(..., description="e.g. hospital, grocery, etc.")
# ):
#     try:
#         zip_codes = get_zip_codes_for_city_state(state, city)

#         if not zip_codes:
#             raise HTTPException(status_code=404, detail="No ZIP codes found for this city/state.")

#         results = []
#         max_count = 0 

#         # Limit the number of ZIP codes to avoid hitting API limits
#         # Consider implementing a cache for API responses
#         for zip_code in zip_codes[:15]:  # Process max 10 ZIP codes
#             try:
#                 params = {
#                     'key': GOOGLE_API_KEY,
#                     'query': f'{category} in {zip_code}',
#                 }
#                 response = requests.get(
#                     "https://maps.googleapis.com/maps/api/place/textsearch/json", 
#                     params=params,
#                     timeout=5  # Add a timeout
#                 )
#                 data = response.json()

#                 if "error_message" in data:
#                     print(f"Google API error: {data['error_message']}")
#                     count = 0
#                 else:
#                     #count = len(data.get("results", []))
#                     all_places = fetch_full_results(params)
#                     count = len(all_places)
#                     print(count)
#                     if count > max_count:
#                         max_count = count

#                 results.append({
#                     "zip": zip_code,
#                     "count": count
#                 })
#             except Exception as e:
#                 print(f"Error processing ZIP {zip_code}: {str(e)}")
#                 # Continue with next ZIP code

#         # Normalize the counts
#         results_normalized = []
#         for result in results:
#             normalized_count = 0
#             if max_count > 0:
#                 normalized_count = result["count"] / max_count
            
#             results_normalized.append({
#                 "zip": result["zip"],
#                 "normalized_count": normalized_count, 
#                 "count": result["count"]  # Keep consistent naming with other endpoints
#             })

#         return {"result": results_normalized}  # Wrap in result object like other endpoints
    
#     except Exception as e:
#         print(f"Error in places-count: {str(e)}")
#         raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")



from fastapi import APIRouter, HTTPException, Query
import requests
import pandas as pd
import os
import time
#import dotenv

router = APIRouter()


GOOGLE_API_KEY = "AIzaSyBGCIVIN2UpI6M44P3HxQNfZ1p82XeOtGM"


def get_zip_codes_for_city_state(state: str, city: str):
    # Adjust path to work from any working directory
    file_path = os.path.join("data", "house_price.csv")
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"{file_path} not found.")

    df = pd.read_csv(file_path)
    df['city'] = df['city'].str.lower()
    df['state'] = df['state'].str.lower()
    matched = df[(df['state'] == state.lower()) & (df['city'] == city.lower())]
    return matched['zip_code'].astype(str).tolist()

def get_lat_lng_from_zip(zip_code: str):
    url = "https://maps.googleapis.com/maps/api/geocode/json"
    params = {
        "address": zip_code,
        "key": GOOGLE_API_KEY
    }
    res = requests.get(url, params=params, timeout=5)
    data = res.json()
    if data.get("status") == "OK":
        location = data["results"][0]["geometry"]["location"]
        return location["lat"], location["lng"]
    else:
        print(f"Geocoding failed for {zip_code}: {data.get('status')}")
        return None, None

def get_places_near_location(lat, lng, radius=3000, place_type="hospital"):
    all_results = []
    url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json"
    params = {
        "location": f"{lat},{lng}",
        "radius": radius,
        "type": place_type,
        "key": GOOGLE_API_KEY
    }

    while True:
        response = requests.get(url, params=params, timeout=5)
        data = response.json()

        if "error_message" in data:
            print(f"Google API error: {data['error_message']}")
            break

        all_results.extend(data.get("results", []))

        if "next_page_token" in data:
            time.sleep(2)
            params = {
                "pagetoken": data["next_page_token"],
                "key": GOOGLE_API_KEY
            }
        else:
            break

    return len(all_results)

@router.get("/api/places-count")
async def get_places_count(
    state: str = Query(..., description="State name"),
    city: str = Query(..., description="City name"),
    category: str = Query(..., description="e.g. hospital, grocery, etc.")
):
    try:
        zip_codes = get_zip_codes_for_city_state(state, city)
        if not zip_codes:
            raise HTTPException(status_code=404, detail="No ZIP codes found for this city/state.")

        results = []
        max_count = 0

        for zip_code in zip_codes[:30]:  # limit to 15 for quota safety
            lat, lng = get_lat_lng_from_zip(zip_code)
            if lat is None or lng is None:
                count = 0
            else:
                count = get_places_near_location(lat, lng, radius=3000, place_type=category)

            max_count = max(max_count, count)
            results.append({
                "zip": zip_code,
                "count": count
            })

        results_normalized = []
        for r in results:
            norm = r["count"] / max_count if max_count else 0
            results_normalized.append({
                "zip": r["zip"],
                "count": r["count"],
                "normalized_count": 1-norm
            })

        return {"result": results_normalized}

    except Exception as e:
        print(f"Error in places-count: {e}")
        raise HTTPException(status_code=500, detail=str(e))
