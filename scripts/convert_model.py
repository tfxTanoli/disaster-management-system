import joblib
import json
import numpy as np
import os

def convert_model():
    model_path = os.path.join('Model/output/model.joblib')
    output_path = os.path.join('backend/model.json')
    
    print(f"Loading model from {model_path}...")
    artifacts = joblib.load(model_path)
    
    rf = artifacts['model']
    scaler = artifacts['scaler']
    encoders = artifacts['encoders']
    features = artifacts['features']
    
    # 1. Convert Scaler
    scaler_data = {
        'mean': scaler.mean_.tolist(),
        'scale': scaler.scale_.tolist()
    }
    
    # 2. Convert Encoders
    encoders_data = {}
    for col, enc in encoders.items():
        encoders_data[col] = enc.classes_.tolist()
        
    # 3. Convert Forest
    forest_data = []
    print(f"Converting {len(rf.estimators_)} trees...")
    
    for i, estimator in enumerate(rf.estimators_):
        tree = estimator.tree_
        # n_nodes = tree.node_count
        
        # We need to recurse or just dump the arrays
        # Dumping arrays is more efficient for the loader
        tree_dict = {
            'left': tree.children_left.tolist(),
            'right': tree.children_right.tolist(),
            'feature': tree.feature.tolist(),
            'threshold': tree.threshold.tolist(),
            'value': [v[0].tolist() for v in tree.value], # v is usually [[count_class0, count_class1...]]
        }
        forest_data.append(tree_dict)
        
    # 4. Classes
    classes = rf.classes_.tolist() if hasattr(rf, 'classes_') else []
    
    full_model = {
        'features': features,
        'scaler': scaler_data,
        'encoders': encoders_data,
        'classes': classes,
        'forest': forest_data
    }
    
    print(f"Saving to {output_path}...")
    with open(output_path, 'w') as f:
        json.dump(full_model, f)
        
    print(f"Done! JSON size: {os.path.getsize(output_path) / 1024:.2f} KB")

if __name__ == "__main__":
    convert_model()
