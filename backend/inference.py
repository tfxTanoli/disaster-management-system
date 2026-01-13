import json
import os
import math

class InferenceEngine:
    def __init__(self, model_path=None):
        if model_path is None:
            model_path = os.path.join(os.path.dirname(__file__), 'model.json')
            
        if os.path.exists(model_path):
            with open(model_path, 'r') as f:
                self.artifacts = json.load(f)
            self.loaded = True
            print(f"Pure Python Model loaded from {model_path}")
        else:
            self.loaded = False
            self.artifacts = None
            print(f"Warning: Model not found at {model_path}")

    def predict_risk(self, latitude, longitude, inputs=None):
        if not self.loaded:
            return None
        
        # 1. Prepare Data
        features = self.artifacts['features']
        
        # Initial Dict
        data = {
            'Latitude': latitude,
            'Longitude': longitude,
            'District': inputs.get('District', 'Unknown'),
            'Attribute 1': 'Unknown',
            'Attribute 2': 'Unknown'
        }
        
        # Heuristics (Re-implemented from fast_server logic)
        encoders = self.artifacts['encoders']
        
        def set_trigger(col, val):
            if col in features and col in encoders:
                if val in encoders[col]:
                    data[col] = val
                    
        rf_val = inputs.get('rainfall', 0) or 0
        rl_val = inputs.get('river_level', 0) or 0
        
        if rf_val > 40:
            set_trigger('Attribute 2', 'Heavy Rainfall') 
            set_trigger('Attribute 3', 'Heavy Rainfall')
            set_trigger('Attribute 4', 'Heavy Rainfall') 
        
        if rl_val > 15:
            set_trigger('Attribute 2', 'Glacier Melting')
            set_trigger('Attribute 3', 'Glacier Melting')
            set_trigger('Attribute 4', 'Glacier Melting')
            set_trigger('Attribute 1', 'River Flood')

        # 2. Vectorize & Scale
        vector = []
        mean = self.artifacts['scaler']['mean']
        scale = self.artifacts['scaler']['scale']
        
        for i, col in enumerate(features):
            val_raw = data.get(col, 0)
            val_num = 0.0
            
            # Encode if needed
            if col in encoders:
                classes = encoders[col]
                val_str = str(val_raw)
                if val_str in classes:
                    val_num = float(classes.index(val_str))
                else:
                    val_num = 0.0 # Default/Unknown
            else:
                val_num = float(val_raw)
                
            # Scale
            val_scaled = (val_num - mean[i]) / scale[i]
            vector.append(val_scaled)
            
        # 3. Predict (Run Trees)
        # Vector is list of floats
        classes = self.artifacts['classes']
        n_classes = len(classes)
        votes = [0.0] * n_classes
        
        forest = self.artifacts['forest']
        
        for tree in forest:
            # Flattened arrays
            left = tree['left']
            right = tree['right']
            feat = tree['feature']
            thresh = tree['threshold']
            values = tree['value']
            
            node = 0
            while left[node] != -1: # While not leaf
                f_idx = feat[node]
                if vector[f_idx] <= thresh[node]:
                    node = left[node]
                else:
                    node = right[node]
            
            # Leaf node
            # values[node] is a list of counts, e.g. [0.0, 1.0, 0.0, ...]
            class_counts = values[node]
            total = sum(class_counts)
            if total > 0:
                for k in range(n_classes):
                    votes[k] += class_counts[k] / total
        
        # Normalize votes
        total_votes = sum(votes)
        probs = [v / total_votes for v in votes]
        
        # Get Max
        max_p = 0.0
        max_idx = -1
        for i, p in enumerate(probs):
            if p > max_p:
                max_p = p
                max_idx = i
                
        return {
            "class": classes[max_idx],
            "confidence": max_p
        }

