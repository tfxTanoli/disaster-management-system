from inference import InferenceEngine
import json

def test_predictions():
    print("Initializing Inference Engine...")
    engine = InferenceEngine()
    
    if not engine.loaded:
        print("Failed to load model.")
        return

    test_cases = [
        {"name": "Gilgit (Normal)", "lat": 35.9208, "lng": 74.3089, "inputs": {"rainfall": 10, "river_level": 5}},
        {"name": "Gilgit (High Rain)", "lat": 35.9208, "lng": 74.3089, "inputs": {"rainfall": 100, "river_level": 8}},
        {"name": "Skardu (Glacial)", "lat": 35.3247, "lng": 75.5510, "inputs": {"rainfall": 5, "river_level": 20}},
        {"name": "Hunza (Landslide Risk)", "lat": 36.3165, "lng": 74.65, "inputs": {"rainfall": 50, "river_level": 10}},
    ]

    print("\n--- Running Prediction Tests ---")
    for case in test_cases:
        print(f"\nTesting: {case['name']}")
        result = engine.predict_risk(case['lat'], case['lng'], case['inputs'])
        print(json.dumps(result, indent=2))
        
        if result['confidence'] > 0:
            print("Status: OK")
        else:
            print("Status: FAILED (No confidence)")

if __name__ == "__main__":
    test_predictions()
