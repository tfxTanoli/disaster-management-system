# Backend Deployment - Railway/Render

## Quick Deploy to Railway

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new)

## Configuration

### Build Settings
- **Root Directory:** `backend`
- **Build Command:** `pip install -r requirements.txt`
- **Start Command:** `uvicorn fast_server:app --host 0.0.0.0 --port $PORT`

### Environment Variables Required

```env
FIREBASE_ADMIN_PROJECT_ID=disaster-management-syst-6ab39
FIREBASE_ADMIN_PRIVATE_KEY_ID=691884c5400ffd8e76c5a98f8b6bf39723ea2f01
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk-fbsvc@disaster-management-syst-6ab39.iam.gserviceaccount.com
FIREBASE_ADMIN_CLIENT_ID=102802413522626928676
FIREBASE_ADMIN_CLIENT_CERT_URL=https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40disaster-management-syst-6ab39.iam.gserviceaccount.com
VITE_FIREBASE_DATABASE_URL=https://disaster-management-syst-6ab39-default-rtdb.firebaseio.com/
```

## API Endpoints

- `GET /` - Health check
- `POST /predict` - Risk prediction
- `GET /danger-zones` - Get danger zones
- `GET /safe-zones` - Get safe zones
- `POST /routes` - Calculate evacuation route
- `GET /geocode` - Location search
- `GET /admin/users` - List users (admin)
- `POST /admin/users` - Create user (admin)
- `PUT /admin/users/{uid}` - Update user (admin)
- `DELETE /admin/users/{uid}` - Delete user (admin)

## Testing

After deployment, test the API:

```bash
curl https://your-backend-url.railway.app/
```

Expected response:
```json
{"status":"active","model_loaded":true}
```

## Local Development

```bash
cd backend
pip install -r requirements.txt
uvicorn fast_server:app --reload
```

Access at: http://localhost:8000
