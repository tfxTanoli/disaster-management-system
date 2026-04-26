"""
Export the trained model to JSON for optional client-side inference.
The FastAPI server (fast_server.py) is the primary inference path;
this export is provided for offline / embedded browser use cases.

Must be run AFTER run_model.py has produced Model/output/model.joblib.
"""

import json
import os
import sys

import joblib
import numpy as np

BASE_DIR   = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "../Model/output/model.joblib")
OUT_PATH   = os.path.join(BASE_DIR, "model.json")


def export_rf_to_json(artifacts: dict) -> dict:
    """
    Serialise the RandomForest, scaler, and metadata into a pure-JSON structure
    suitable for in-browser inference (no Python required).
    """
    clf    = artifacts["model"]
    scaler = artifacts["scaler"]

    forest = []
    for estimator in clf.estimators_:
        tree = estimator.tree_
        # Normalise leaf node values to class probabilities
        norm_values = []
        for v in tree.value.tolist():
            counts = v[0]
            total  = sum(counts)
            norm_values.append([c / total for c in counts] if total > 0 else [0] * len(counts))

        forest.append({
            "left":      tree.children_left.tolist(),
            "right":     tree.children_right.tolist(),
            "feature":   tree.feature.tolist(),
            "threshold": tree.threshold.tolist(),
            "value":     norm_values,
        })

    return {
        "features":              artifacts["features"],
        "classes":               artifacts["classes"],
        "district_classes":      artifacts.get("district_classes", []),
        "river_discharge_scale": artifacts.get("river_discharge_scale", 167.0),
        "terrain_map":           artifacts.get("terrain_map", {}),
        "scaler": {
            "mean":  scaler.mean_.tolist(),
            "scale": scaler.scale_.tolist(),
        },
        "forest":    forest,
        "test_accuracy": artifacts.get("test_accuracy"),
        "trained_at":    artifacts.get("trained_at"),
    }


if __name__ == "__main__":
    if not os.path.exists(MODEL_PATH):
        print(f"ERROR: model not found at {MODEL_PATH}")
        print("Run 'python Model/scripts/run_model.py' first.")
        sys.exit(1)

    print(f"Loading model from {MODEL_PATH} ...")
    artifacts = joblib.load(MODEL_PATH)

    print("Exporting to JSON ...")
    model_json = export_rf_to_json(artifacts)

    with open(OUT_PATH, "w") as f:
        json.dump(model_json, f)

    size_kb = os.path.getsize(OUT_PATH) / 1024
    print(f"Exported to {OUT_PATH}  ({size_kb:.0f} KB)")
    print(f"  Features : {model_json['features']}")
    print(f"  Classes  : {model_json['classes']}")
    print(f"  Trees    : {len(model_json['forest'])}")
