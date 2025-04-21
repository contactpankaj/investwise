def normalize_prices(data):
   
    if not data:
        return [], 0
        
    max_price = max(item['avgPrice'] for item in data)
    
    # Ensure we preserve all fields and add the normalized price
    normalized_data = [
        {
            'zip': int(item['zip']),
            'avgPrice': item['avgPrice'],
            'normalizedPrice': round(item['avgPrice'] / max_price, 2)
        }
        for item in data
    ]
    
    return normalized_data