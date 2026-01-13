# Deploy Backend to Vercel

## Quick Steps:

1. **Go to Vercel Dashboard**
   - https://vercel.com/dashboard

2. **Create New Project**
   - Click "Add New" → "Project"
   - Import same GitHub repository
   - Name it: `disaster-management-backend`

3. **Configure Project**
   - **Root Directory:** `backend`
   - **Framework Preset:** Other
   - **Build Command:** (leave empty)
   - **Output Directory:** (leave empty)

4. **Add Environment Variables**
   ```
   FIREBASE_ADMIN_PROJECT_ID=disaster-management-syst-6ab39
   FIREBASE_ADMIN_PRIVATE_KEY_ID=691884c5400ffd8e76c5a98f8b6bf39723ea2f01
   FIREBASE_ADMIN_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----
MIIEuwIBADANBgkqhkiG9w0BAQEFAASCBKUwggShAgEAAoIBAQC6/pAD9noSZL4G
6CvrMLQ62ycSM4La4tp6stlnjbk1aj1Ft1+y8bcQg5lgTO26DQMhKfLMf9T+x68H
idk3JGFtm/9Tq4Nrd9cHRKzzz1RrXlLcE7B2Q1zNu52Ck4sOcCkz5aA8w0vw+TQP
eeHtsxgBB3Q4INKKpC3GLexYRkYZkZEd9C7OgpU3w2N4f8hz6os1RwnQ+ZcJjqwx
C4bJRFLXbJ7b+22o1TJBbolnSNl2AwuEXaTVnTi1UjWYGJiGM/xLYxOy4looTLHI
oY+RqF+EQlasCVkyqjAudQJvoqc97GSilchAHW8XZu3vgHVeryRhBv9l/02sFWJ1
fQiNOGk1AgMBAAECgf8Dtl1J/DJmZXLl1TCqGCL281yDLVtTt8sARBiQBHkyp1NW
S/RmIJQEI5lG+uw1fymHyUdYLbVFKRSHGQJcPOZ8hnJrJu73Thm7hpWqBDfniLNg
nUVVIZiitZyal1o3O7u70KZy1N+Vr6NdSaE8vZAvJLieZKWbLYP+KRDNMCIVg6j/
N2vXr6P7pmpdd0m3/6EdjY5yfwd+pHTrzpnNO2HlY4h1OhrPYhorYvfY06559ZIf
ZoZEL/kLOTirjeXE+ZWSo75ax07CjxBDykw2gSx29uBN7ISENFARpw9tDYV0aDc/
RxuPjTIOMAPht10Z3+tL6E172d4ChFNem8K5SLECgYEA68mwKalg78ie4Q5Bnrtg
z2Qt33+nsyotbdVqUa60MtXV/ZagJ0kJFp2N3TvqW6OOBUJZNA74eo9RPwaqOcpI
ykfdgrwIpHki6IrGpOfrIww6AfLPbR+fjq71yyeW8ik3rS2SAOvJX+vSGBIGgvyc
4dETe7PlVSbM5sLosezYRe0CgYEAywYc4HW9TbkT9kCvt1sycZHLCThTad+oXdZG
ZJzRqwo2mU0CrCWQZZB8cpUW1/KI7s1ic5JbS8V5CKjIpuNt7lf7OtdvTFS6uCTC
ZFY8GQF6/2JAU/2vAZFjVN25UCHOdx6kBQRkiuQYleMLk27LmZ6LB39hJeca0VlY
ZZ27R2kCgYAVRDiuWUeT+P1TgSyr+2yM6BU3HlVq1HgKewA+48n+98h4OdiyEmVO
c+Fyvc+yejr6AHT5PAxvSXPjgl9iHPuZuwegngMNipt6a+Hkx8IuhBDLUjIhPoPu
o5spuqVjrBIIfZ64lIuyKhvl7eJGeDBSMcBXHO+nUXuTqKrCOYF8NQKBgEml+Ae8
7mUphIJKSPP80zm7p6m6kxfPGKahunt5H94qIFBQTW3hWpZdaaevSdAgnWfzfYlr
SE8eXZ+0isVvr0tNA0f/KtLH0cxHGXWIitiPXu0R2UAewMOS2DPLExRsjxdLODjR
tR9lSz3kVSiwgo9BojGgFb/ILERRYu3J4EwxAoGBAJUlUDkFSA/mQQ/3mWDJ22Hd
pb37tLlW1wPoETSAg8s5TNSTLZntALGvIL5IZeN+FQJwuAOARK67thw7Zv8F+0zA
+wvzH65VSWYteRmErJ9twxFB520yWAHOMXhOj0GnHFcbR9fSRBqahr2Xygb8aEu9
gtrI5wKvB6PMtsPM4OwQ
-----END PRIVATE KEY-----
   FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk-fbsvc@disaster-management-syst-6ab39.iam.gserviceaccount.com
   FIREBASE_ADMIN_CLIENT_ID=102802413522626928676
   FIREBASE_ADMIN_CLIENT_CERT_URL=https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40disaster-management-syst-6ab39.iam.gserviceaccount.com
   VITE_FIREBASE_DATABASE_URL=https://disaster-management-syst-6ab39-default-rtdb.firebaseio.com/
   ```

5. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes
   - Copy backend URL (e.g., `https://disaster-management-backend.vercel.app`)

6. **Update Frontend**
   - Go to frontend project settings
   - Add environment variable:
     - Name: `VITE_API_URL`
     - Value: `https://disaster-management-backend.vercel.app`
   - Redeploy frontend

7. **Test**
   - Visit: `https://disaster-management-backend.vercel.app/`
   - Should see: `{"status":"active","model_loaded":true}`

## Files Created:
- ✅ `backend/vercel.json` - Vercel configuration
- ✅ `backend/requirements.txt` - Python dependencies
- ✅ Updated `backend/fast_server.py` - Added Vercel handler

## Push Changes:
```bash
git add backend/
git commit -m "Add Vercel backend deployment configuration"
git push
```

Then follow steps above to deploy on Vercel dashboard.
