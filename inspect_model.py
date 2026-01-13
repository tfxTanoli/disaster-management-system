import joblib
import os
import sys

# Path to model
model_path = os.path.join(os.getcwd(), 'Model/output/model.joblib')

try:
    if not os.path.exists(model_path):
        print(f"Error: Model not found at {model_path}")
        sys.exit(1)
        
    artifacts = joblib.load(model_path)
    print("KEYS:", artifacts.keys())
    if 'features' in artifacts:
        print("\n--- MODEL FEATURES ---")
        for f in artifacts['features']:
            print(f)
    else:
        print("No 'features' key found.")
        
except Exception as e:
    print(f"Error: {e}")
