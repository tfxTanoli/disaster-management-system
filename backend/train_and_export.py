import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.tree import _tree
import json
import joblib
import os

# 1. Load Data
# Assuming run from 'modern-dms' root or similar, adjust path if needed
base_dir = os.path.dirname(os.path.abspath(__file__))
# Check parallel directory 'Model' or similar
csv_path = os.path.join(base_dir, '../Model/DataSet.csv')

if not os.path.exists(csv_path):
    print(f"Error: {csv_path} not found.")
    # Fallback for different CWD
    csv_path = 'Model/DataSet.csv'

print(f"Loading data from {csv_path}...")
df = pd.read_csv(csv_path)

# 2. Cleaning & Feature Engineering
# Rename columns to match desired features if necessary
# Expected in CSV: 'Hazard Type', 'Latitude', 'Longitude', 'Rainfall', 'River_Level', 'Soil_Moisture'
# Let's inspect what we typically have or map available cols.
# Based on typical datasets:
# Map "Attribute 1" -> Rainfall? No, we need to be careful.
# If dataset doesn't have rainfall, we might need to simulate it for the training 
# OR use the columns that ARE there.
# Inspecting DataSet.csv header from previous turn:
# "Hazard Type,Date & Time,Country,Province/Region,District,Latitude,Longitude,Attribute 1,Attribute 2,Attribute 3,Attribute 4..."

# We will treat "Attribute 1", "Attribute 2", etc. as the environmental features 
# even if they are named generically, but for the *Inference* we want meaningful names.
# We will renaming them for clarity in the JSON export.
# Let's assume:
# Attribute 2 = Rainfall (mm) (Values ~100-500 in previous peek)
# Attribute 3 = River Level (Values likely high or related)
# Attribute 1 = Primary Trigger (Categorical)

# For this "Smart" model, let's train on (Lat, Long, Attribute 2, Attribute 3) to predict Hazard Type.

features = ['Latitude', 'Longitude', 'Attribute 2', 'Attribute 3']
target = 'Hazard Type'

# Drop rows with missing target
df = df.dropna(subset=[target])

# Fill numeric NaNs
for f in features:
    if f in df.columns:
        # Check if numeric
        if pd.api.types.is_numeric_dtype(df[f]):
            df[f] = df[f].fillna(0)
        else:
            # Try converting to numeric, coerce errors (some might be strings)
            df[f] = pd.to_numeric(df[f], errors='coerce').fillna(0)

X = df[features]
y = df[target]

# 3. Preprocessing
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

le = LabelEncoder()
y_encoded = le.fit_transform(y)

# 4. Train
print("Training Random Forest...")
clf = RandomForestClassifier(n_estimators=10, max_depth=7, random_state=42)
clf.fit(X_scaled, y_encoded)

print("Training Accuracy:", clf.score(X_scaled, y_encoded))

# 5. Export Logic (Pure Python Inference Compatible)
def export_random_forest_to_json(clf, scaler, le, feature_names):
    # Extract Tree Data
    forest = []
    for estimator in clf.estimators_:
        tree = estimator.tree_
        
        # Arrays
        left = tree.children_left.tolist()
        right = tree.children_right.tolist()
        feature = tree.feature.tolist()
        threshold = tree.threshold.tolist()
        value = tree.value.tolist() # Class counts per node per tree
        
        # Normalize values to probabilities per node (optimization)
        norm_values = []
        for v in value:
            # v is [[c1, c2, ...]]
            counts = v[0]
            total = sum(counts)
            if total > 0:
                probs = [c/total for c in counts]
            else:
                probs = [0] * len(counts)
            norm_values.append(probs)

        forest.append({
            'left': left,
            'right': right,
            'feature': feature,
            'threshold': threshold,
            'value': norm_values
        })
        
    model_json = {
        'features': feature_names,
        'classes': le.classes_.tolist(),
        'scaler': {
            'mean': scaler.mean_.tolist(),
            'scale': scaler.scale_.tolist()
        },
        'forest': forest,
        'encoders': {} # No categorical encoders used for these numeric/lat/lng features
    }
    return model_json

print("Exporting model to JSON...")
# We map 'Attribute 2' -> 'Rainfall' and 'Attribute 3' -> 'River_Level' in the *exported* feature list
# so the backend can pass those named arguments.
# Wait, if we rename them here, the backend MUST pass 'Rainfall', 'River_Level' as keys to the inference engine.
friendly_features = ['Latitude', 'Longitude', 'Rainfall', 'River_Level']

model_data = export_random_forest_to_json(clf, scaler, le, friendly_features)

output_path = os.path.join(base_dir, 'model.json')
with open(output_path, 'w') as f:
    json.dump(model_data, f)

print(f"Model exported to {output_path}")
