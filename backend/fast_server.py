"""
GBDMS Risk Engine - FastAPI Backend

All predictions come from the trained RandomForest model (Model/output/model.joblib).
There is no mock fallback: if the model is not loaded the /predict endpoint returns HTTP 503.
"""

import json
import math
import os
import sys
from datetime import datetime
from typing import Optional

import joblib
import numpy as np
import pandas as pd
import requests
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# ── Optional Firebase (graceful if credentials not set) ───────────────────────
try:
    import firebase_admin
    from firebase_admin import auth, credentials, db as firebase_db

    load_dotenv()
    if not firebase_admin._apps:
        key = os.getenv("FIREBASE_ADMIN_PRIVATE_KEY", "")
        if key:
            cred = credentials.Certificate(
                {
                    "type": "service_account",
                    "project_id": os.getenv("FIREBASE_ADMIN_PROJECT_ID"),
                    "private_key_id": os.getenv("FIREBASE_ADMIN_PRIVATE_KEY_ID"),
                    "private_key": key.replace("\\n", "\n"),
                    "client_email": os.getenv("FIREBASE_ADMIN_CLIENT_EMAIL"),
                    "client_id": os.getenv("FIREBASE_ADMIN_CLIENT_ID"),
                    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
                    "token_uri": "https://oauth2.googleapis.com/token",
                    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
                    "client_x509_cert_url": os.getenv("FIREBASE_ADMIN_CLIENT_CERT_URL"),
                }
            )
            firebase_admin.initialize_app(
                cred, {"databaseURL": os.getenv("VITE_FIREBASE_DATABASE_URL")}
            )
            print("Firebase Admin SDK initialised.")
        else:
            print("Firebase credentials not set — admin endpoints will be unavailable.")
    FIREBASE_AVAILABLE = bool(firebase_admin._apps)
except Exception as exc:
    print(f"Firebase init skipped: {exc}")
    FIREBASE_AVAILABLE = False

# ── App ───────────────────────────────────────────────────────────────────────
app = FastAPI(title="GBDMS Risk Engine", version="2.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # restrict to frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Model loading ─────────────────────────────────────────────────────────────
_HERE = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(_HERE, "../Model/output/model.joblib")
DZ_PATH    = os.path.join(_HERE, "../Model/output/danger_zones.json")

model_artifacts: dict | None = None
precomputed_danger_zones: list = []

try:
    if os.path.exists(MODEL_PATH):
        model_artifacts = joblib.load(MODEL_PATH)
        print(f"Model loaded from {MODEL_PATH}")
        print(f"  Features : {model_artifacts['features']}")
        print(f"  Classes  : {model_artifacts['classes']}")
        print(f"  Test acc : {model_artifacts.get('test_accuracy', 'n/a')}")
    else:
        print(f"WARNING: model not found at {MODEL_PATH}")
        print("  Run: python Model/scripts/run_model.py  to train first.")
except Exception as exc:
    print(f"ERROR loading model: {exc}")

try:
    if os.path.exists(DZ_PATH):
        with open(DZ_PATH) as f:
            precomputed_danger_zones = json.load(f)
        print(f"Danger zones loaded: {len(precomputed_danger_zones)} zones")
except Exception as exc:
    print(f"WARNING: could not load danger zones: {exc}")


# ── Constants ─────────────────────────────────────────────────────────────────

# Scaling factor: user river_level (m) -> discharge proxy used in training
# Training Flood Attribute 3 range: ~200-5000  /  user river_level max: 30 m
RIVER_DISCHARGE_SCALE = 167.0

TERRAIN_MAP = {"Valley": 1, "Hilly": 2, "Mountainous": 3}

RISK_COLORS = {
    "Critical": "#ef4444",
    "Moderate": "#f97316",
    "Low":      "#10b981",
}

SAFETY_RECOMMENDATIONS = {
    "GLOF": [
        "Move to higher ground immediately.",
        "Avoid river valleys and downstream areas.",
        "Follow early warning alerts from GBDMS.",
        "Evacuate vulnerable infrastructure near glaciers.",
    ],
    "Landslide": [
        "Evacuate areas with loose soil or visible cracks.",
        "Avoid driving on mountain roads during rain.",
        "Stay away from steep slopes and cliff faces.",
        "Monitor local news for road blockages.",
    ],
    "Flood": [
        "Move to elevated safe zones.",
        "Disconnect all electrical appliances.",
        "Do not walk or drive through flood water.",
        "Stockpile emergency food and clean water.",
    ],
    "Earthquake": [
        "Drop, Cover, and Hold On.",
        "Stay away from windows and heavy furniture.",
        "If outdoors, stay in open areas away from buildings.",
        "Prepare for aftershocks — they can be severe.",
    ],
}

SAFE_ZONES = [
    {"lat": 35.9220, "lng": 74.3120, "name": "DHQ Hospital Gilgit",         "type": "Hospital",     "capacity": 200},
    {"lat": 35.9300, "lng": 74.3200, "name": "City Park Shelter Gilgit",     "type": "Shelter",      "capacity": 500},
    {"lat": 35.9100, "lng": 74.2900, "name": "Army Helipad Ground Gilgit",   "type": "Open Ground",  "capacity": 1000},
    {"lat": 36.3200, "lng": 74.8600, "name": "Civil Hospital Hunza",         "type": "Hospital",     "capacity": 50},
    {"lat": 36.3100, "lng": 74.8500, "name": "Karimabad Community Hall",     "type": "Shelter",      "capacity": 300},
    {"lat": 35.3000, "lng": 75.6400, "name": "CMH Skardu",                   "type": "Hospital",     "capacity": 150},
    {"lat": 35.3100, "lng": 75.6500, "name": "Municipal Stadium Skardu",     "type": "Open Ground",  "capacity": 2000},
    {"lat": 35.4200, "lng": 74.1100, "name": "Chilas Scout Hospital",        "type": "Hospital",     "capacity": 80},
    {"lat": 34.9390, "lng": 76.2230, "name": "Kharmang DHQ Hospital",        "type": "Hospital",     "capacity": 60},
    {"lat": 36.2167, "lng": 74.5167, "name": "Nagar Valley Shelter",         "type": "Shelter",      "capacity": 150},
    {"lat": 35.6608, "lng": 74.6924, "name": "Ghizer District Hospital",     "type": "Hospital",     "capacity": 100},
    {"lat": 35.5222, "lng": 74.9350, "name": "Astore District HQ Hospital",  "type": "Hospital",     "capacity": 80},
    {"lat": 35.4190, "lng": 75.9870, "name": "Shigar Emergency Ground",      "type": "Open Ground",  "capacity": 800},
]


# ── Helpers ───────────────────────────────────────────────────────────────────

def get_risk_level(prob: float) -> str:
    if prob > 0.8:
        return "Critical"
    if prob > 0.5:
        return "Moderate"
    return "Low"


def haversine_km(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Great-circle distance in km between two lat/lon points."""
    R = 6371.0
    phi1, phi2 = math.radians(lat1), math.radians(lat2)
    dphi  = math.radians(lat2 - lat1)
    dlam  = math.radians(lon2 - lon1)
    a = math.sin(dphi / 2) ** 2 + math.cos(phi1) * math.cos(phi2) * math.sin(dlam / 2) ** 2
    return 2 * R * math.asin(math.sqrt(a))


def encode_district(district_name: str) -> int:
    """Encode district name to integer using the saved LabelEncoder."""
    if model_artifacts is None:
        return 0
    dist_le = model_artifacts.get("district_le")
    if dist_le is None:
        return 0
    if district_name in dist_le.classes_:
        return int(dist_le.transform([district_name])[0])
    # Unknown district: use middle index as a neutral fallback
    return len(dist_le.classes_) // 2


def build_feature_row(
    latitude: float,
    longitude: float,
    district_enc: int,
    month: int,
    rainfall_mm: float,
    river_level_m: float,
    temperature_elevated: bool,
    terrain: str,
    seismic_activity: bool,
) -> dict:
    """
    Map user-provided environmental inputs to the trained model's feature space.

    Feature semantics match the training engineering in run_model.py:
      rainfall_mm        — direct mm input (Flood Attribute 2 range: 50-500)
      river_discharge    — river_level_m * 167  (training range ~200-5000 for Flood)
      temperature_elevated — 1 if user reports elevated temperature (GLOF trigger)
      terrain_code       — Valley=1, Hilly=2, Mountainous=3, Unknown=0
      seismic_trigger    — 1 if seismic activity detected
      glacial_trigger    — 1 if temperature elevated (glacier melt) OR seismic near glacier
      rainfall_trigger   — 1 if rainfall > 20 mm
    """
    river_discharge   = river_level_m * RIVER_DISCHARGE_SCALE
    temp_elev_int     = 1 if temperature_elevated else 0
    terrain_code      = TERRAIN_MAP.get(terrain, 0)
    seismic_int       = 1 if seismic_activity else 0
    # Glacial trigger: driven by temperature only (high temp melts glaciers → GLOF risk)
    # Seismic activity does NOT set this flag; seismic_trigger alone routes to Earthquake/Landslide
    glacial_int       = 1 if temperature_elevated else 0
    rainfall_trig_int = 1 if rainfall_mm > 20 else 0

    return {
        "latitude":             latitude,
        "longitude":            longitude,
        "district_enc":         district_enc,
        "month":                month,
        "rainfall_mm":          rainfall_mm,
        "river_discharge":      river_discharge,
        "temperature_elevated": temp_elev_int,
        "terrain_code":         terrain_code,
        "seismic_trigger":      seismic_int,
        "glacial_trigger":      glacial_int,
        "rainfall_trigger":     rainfall_trig_int,
    }


# ── Request / Response Schemas ────────────────────────────────────────────────

class Location(BaseModel):
    latitude: float
    longitude: float


class PredictionRequest(BaseModel):
    latitude:             float
    longitude:            float
    district:             Optional[str]   = "Unknown"
    rainfall:             Optional[float] = 0.0   # mm/24h
    river_level:          Optional[float] = 0.0   # meters above normal
    soil_moisture:        Optional[float] = 0.0   # % (accepted for UI compatibility, not used in model)
    temperature_elevated: Optional[bool]  = False  # True if temperature notably above seasonal average
    terrain:              Optional[str]   = "Unknown"  # Valley / Hilly / Mountainous
    seismic_activity:     Optional[bool]  = False  # True if tremors / seismic alerts present


class RouteRequest(BaseModel):
    start: Location
    end:   Optional[Location] = None


class UserCreate(BaseModel):
    email:        str
    password:     str
    display_name: str
    role:         Optional[str] = "user"


class UserUpdate(BaseModel):
    display_name: Optional[str]  = None
    role:         Optional[str]  = None
    disabled:     Optional[bool] = None


# ── Endpoints ─────────────────────────────────────────────────────────────────

@app.get("/")
def health_check():
    return {
        "status":       "active",
        "model_loaded": model_artifacts is not None,
        "model_version": model_artifacts.get("trained_at") if model_artifacts else None,
    }


@app.post("/predict")
def predict_risk(req: PredictionRequest):
    """
    Predict disaster risk for a given location and environmental conditions.
    Returns prediction, risk level, confidence, and safety recommendations.
    Raises HTTP 503 if the model is not loaded.
    """
    if model_artifacts is None:
        raise HTTPException(
            status_code=503,
            detail=(
                "Model not loaded. "
                "Run 'python Model/scripts/run_model.py' to train and save the model."
            ),
        )

    try:
        month        = datetime.now().month
        district_enc = encode_district(req.district or "Unknown")

        feature_row = build_feature_row(
            latitude             = req.latitude,
            longitude            = req.longitude,
            district_enc         = district_enc,
            month                = month,
            rainfall_mm          = req.rainfall or 0.0,
            river_level_m        = req.river_level or 0.0,
            temperature_elevated = req.temperature_elevated or False,
            terrain              = req.terrain or "Unknown",
            seismic_activity     = req.seismic_activity or False,
        )

        features = model_artifacts["features"]
        input_df = pd.DataFrame([feature_row])[features]

        X_scaled = model_artifacts["scaler"].transform(input_df)

        clf   = model_artifacts["model"]
        probs = clf.predict_proba(X_scaled)[0]
        max_i = int(np.argmax(probs))
        pred  = clf.classes_[max_i]
        conf  = float(probs[max_i])

        risk  = get_risk_level(conf)
        recs  = SAFETY_RECOMMENDATIONS.get(pred, ["Stay alert and follow local authority instructions."])

        # All class probabilities for transparency
        class_probs = {
            cls: round(float(p), 3)
            for cls, p in zip(clf.classes_, probs)
        }

        return {
            "prediction":         pred,
            "risk_level":         risk,
            "confidence":         round(conf * 100, 1),
            "visual_color":       RISK_COLORS.get(risk, "#94a3b8"),
            "recommendations":    recs,
            "class_probabilities": class_probs,
        }

    except Exception as exc:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Prediction failed: {exc}")


@app.get("/danger-zones")
def get_danger_zones():
    """
    Return high-risk zones derived from historical dataset.
    Loaded from danger_zones.json generated during model training.
    """
    if not precomputed_danger_zones:
        raise HTTPException(
            status_code=503,
            detail="Danger zones not available. Run 'python Model/scripts/run_model.py' first.",
        )
    return precomputed_danger_zones


@app.get("/safe-zones")
def get_safe_zones():
    """Return known safe zones (hospitals, shelters, open grounds) in Gilgit-Baltistan."""
    return SAFE_ZONES


@app.post("/routes")
def get_evacuation_route(req: RouteRequest):
    """
    Calculate evacuation route to the nearest safe zone.
    Uses OSRM public routing API for real road geometry (OpenStreetMap data).
    Falls back to straight-line estimate if OSRM is unreachable.
    """
    start_lat = req.start.latitude
    start_lng = req.start.longitude

    # Find nearest safe zone by great-circle distance
    closest_zone = min(
        SAFE_ZONES,
        key=lambda z: haversine_km(start_lat, start_lng, z["lat"], z["lng"]),
    )

    straight_dist = haversine_km(start_lat, start_lng, closest_zone["lat"], closest_zone["lng"])

    # Defaults used if OSRM fails
    path      = None
    dist_km   = straight_dist
    time_mins = max(1, int((straight_dist / 30.0) * 60))  # 30 km/h mountain road estimate
    note      = "Straight-line estimate — follow local road signs."

    # ── OSRM road-based routing ───────────────────────────────────────────────
    # OSRM coordinate order is lng,lat (opposite of Leaflet)
    try:
        osrm_url = (
            "https://router.project-osrm.org/route/v1/driving/"
            f"{start_lng},{start_lat};{closest_zone['lng']},{closest_zone['lat']}"
            "?geometries=geojson&overview=full"
        )
        resp = requests.get(
            osrm_url,
            timeout=8,
            headers={"User-Agent": "GBDMS-RiskEngine/2.0"},
        )
        if resp.status_code == 200:
            data = resp.json()
            if data.get("code") == "Ok" and data.get("routes"):
                osrm_route = data["routes"][0]
                # GeoJSON coords are [lng, lat] — convert to Leaflet [lat, lng]
                path      = [[round(c[1], 6), round(c[0], 6)]
                             for c in osrm_route["geometry"]["coordinates"]]
                dist_km   = round(osrm_route["distance"] / 1000, 1)
                time_mins = max(1, int(osrm_route["duration"] / 60))
                note      = "Road route via OpenStreetMap. Obey local road conditions."
    except Exception as exc:
        print(f"OSRM routing failed (using straight-line fallback): {exc}")

    # ── Straight-line fallback (11 interpolated waypoints) ───────────────────
    if path is None:
        path = [
            [
                round(start_lat + (closest_zone["lat"] - start_lat) * i / 10, 6),
                round(start_lng + (closest_zone["lng"] - start_lng) * i / 10, 6),
            ]
            for i in range(11)
        ]

    return {
        "safe_zone":      closest_zone,
        "path":           path,
        "distance":       f"{dist_km:.1f} km",
        "estimated_time": f"{time_mins} mins",
        "note":           note,
    }


@app.get("/geocode")
def geocode_location(q: str):
    """Proxy geocoding to Nominatim to avoid browser CORS restrictions."""
    if not q:
        return []
    try:
        response = requests.get(
            "https://nominatim.openstreetmap.org/search",
            params={"q": q, "format": "json", "limit": 5},
            headers={"User-Agent": "GBDMS-RiskEngine/2.0"},
            timeout=10,
        )
        response.raise_for_status()
        return response.json()
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))


# ── Admin Endpoints (Firebase required) ──────────────────────────────────────

def _require_firebase():
    if not FIREBASE_AVAILABLE:
        raise HTTPException(
            status_code=503,
            detail="Firebase Admin SDK not configured. Set FIREBASE_ADMIN_* environment variables.",
        )


@app.get("/admin/users")
def list_users():
    _require_firebase()
    try:
        page  = auth.list_users()
        return [
            {
                "uid":           u.uid,
                "email":         u.email,
                "display_name":  u.display_name,
                "disabled":      u.disabled,
                "custom_claims": u.custom_claims,
            }
            for u in page.users
        ]
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))


@app.post("/admin/users")
def create_user(user: UserCreate):
    _require_firebase()
    try:
        u = auth.create_user(
            email=user.email,
            password=user.password,
            display_name=user.display_name,
        )
        auth.set_custom_user_claims(u.uid, {"role": user.role})
        firebase_db.reference(f"users/{u.uid}").set(
            {
                "name":      user.display_name,
                "email":     user.email,
                "role":      user.role,
                "createdAt": getattr(u.user_metadata, "creation_timestamp", None),
            }
        )
        return {"uid": u.uid, "message": "User created successfully"}
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))


@app.put("/admin/users/{uid}")
def update_user(uid: str, user: UserUpdate):
    _require_firebase()
    try:
        updates = {}
        if user.display_name:
            updates["display_name"] = user.display_name
        if user.disabled is not None:
            updates["disabled"] = user.disabled
        if updates:
            auth.update_user(uid, **updates)
        if user.role:
            auth.set_custom_user_claims(uid, {"role": user.role})
            firebase_db.reference(f"users/{uid}").update({"role": user.role})
        if user.display_name:
            firebase_db.reference(f"users/{uid}").update({"name": user.display_name})
        return {"message": "User updated successfully"}
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))


@app.delete("/admin/users/{uid}")
def delete_user(uid: str):
    _require_firebase()
    try:
        auth.delete_user(uid)
        firebase_db.reference(f"users/{uid}").delete()
        return {"message": "User deleted successfully"}
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
