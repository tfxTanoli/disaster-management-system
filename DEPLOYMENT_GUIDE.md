# 🚀 STEP-BY-STEP DEPLOYMENT GUIDE

## Current Status
- ✅ Frontend deployed on Vercel
- ❌ Backend NOT deployed (causing all API errors)

---

## STEP 1: Deploy Backend to Railway

### 1.1 Create Railway Account
1. Go to https://railway.app
2. Sign up with GitHub
3. Click "New Project"

### 1.2 Deploy from GitHub
1. Click "Deploy from GitHub repo"
2. Select your repository: `Gilgit-Baltistan-Disaster-Management-System`
3. Click "Deploy Now"

### 1.3 Configure Build Settings
1. After deployment starts, click on the service
2. Go to "Settings" tab
3. Set **Root Directory:** `backend`
4. Set **Build Command:** `pip install -r requirements.txt`
5. Set **Start Command:** `uvicorn fast_server:app --host 0.0.0.0 --port $PORT`

### 1.4 Add Environment Variables
1. Go to "Variables" tab
2. Click "New Variable" and add each of these:

```
FIREBASE_ADMIN_PROJECT_ID
disaster-management-syst-6ab39

FIREBASE_ADMIN_PRIVATE_KEY_ID
691884c5400ffd8e76c5a98f8b6bf39723ea2f01

FIREBASE_ADMIN_PRIVATE_KEY
-----BEGIN PRIVATE KEY-----
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

FIREBASE_ADMIN_CLIENT_EMAIL
firebase-adminsdk-fbsvc@disaster-management-syst-6ab39.iam.gserviceaccount.com

FIREBASE_ADMIN_CLIENT_ID
102802413522626928676

FIREBASE_ADMIN_CLIENT_CERT_URL
https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40disaster-management-syst-6ab39.iam.gserviceaccount.com

VITE_FIREBASE_DATABASE_URL
https://disaster-management-syst-6ab39-default-rtdb.firebaseio.com/
```

### 1.5 Get Backend URL
1. Go to "Settings" tab
2. Find "Domains" section
3. Copy the Railway domain (e.g., `gbdms-backend-production.up.railway.app`)
4. Your backend URL will be: `https://gbdms-backend-production.up.railway.app`

---

## STEP 2: Update Frontend on Vercel

### 2.1 Add Backend URL
1. Go to https://vercel.com/dashboard
2. Select your project: `disaster-management-system`
3. Go to "Settings" → "Environment Variables"
4. Click "Add New"
5. Add:
   - **Name:** `VITE_API_URL`
   - **Value:** `https://your-railway-url.railway.app` (from Step 1.5)
   - **Environment:** Production, Preview, Development (select all)
6. Click "Save"

### 2.2 Redeploy Frontend
1. Go to "Deployments" tab
2. Click "..." on latest deployment
3. Click "Redeploy"
4. Wait for deployment to complete

---

## STEP 3: Push Code Changes

### 3.1 Commit Fixed Files
```bash
cd modern-dms

# Add fixed files
git add vercel.json
git add backend/fast_server.py
git add DEPLOYMENT_FIXES.md
git add DEPLOYMENT_GUIDE.md

# Commit
git commit -m "Fix: Add SPA routing and update CORS for production"

# Push
git push origin main
```

### 3.2 Verify Auto-Deploy
- Vercel will auto-deploy on push
- Railway will auto-deploy on push
- Wait 2-3 minutes for both to complete

---

## STEP 4: Test Everything

### 4.1 Test Backend API
1. Open browser
2. Go to: `https://your-railway-url.railway.app/`
3. Should see: `{"status":"active","model_loaded":true}`

### 4.2 Test Frontend
1. Go to: https://disaster-management-system-teal.vercel.app
2. Login with admin credentials:
   - Email: `usmantan267@gmail.com`
   - Password: `tfxUsman124`
3. Go to Admin → Risk Assessment
4. Click "Calculate Risk Probability"
5. Should see prediction result (not error) ✅

### 4.3 Test All Pages
- [ ] Home page loads
- [ ] Login works
- [ ] Admin Dashboard shows
- [ ] Risk Assessment calculates
- [ ] Live Map shows markers
- [ ] Alerts page loads
- [ ] Direct URL access works (refresh page)

---

## STEP 5: Monitor & Debug

### 5.1 Check Railway Logs
1. Go to Railway dashboard
2. Click on your service
3. Go to "Logs" tab
4. Look for errors

### 5.2 Check Vercel Logs
1. Go to Vercel dashboard
2. Click on your project
3. Go to "Logs" tab
4. Look for errors

### 5.3 Check Browser Console
1. Open DevTools (F12)
2. Go to Console tab
3. Should see no errors
4. Network tab should show successful API calls

---

## 🎉 SUCCESS CHECKLIST

- [ ] Backend deployed on Railway
- [ ] Backend URL added to Vercel
- [ ] Frontend redeployed
- [ ] Code changes pushed
- [ ] Backend API responds
- [ ] Risk Assessment works
- [ ] Maps load correctly
- [ ] No 404 errors on refresh
- [ ] No CORS errors
- [ ] No connection refused errors

---

## 🆘 TROUBLESHOOTING

### Backend won't start
- Check Railway logs for Python errors
- Verify all environment variables are set
- Check `requirements.txt` has all dependencies

### Frontend still shows localhost
- Verify `VITE_API_URL` is set in Vercel
- Redeploy frontend after adding variable
- Clear browser cache

### CORS errors
- Verify Vercel URL is in `allow_origins` list
- Redeploy backend after CORS fix
- Check browser console for exact error

### 404 on page refresh
- Verify `vercel.json` has SPA routing
- Redeploy frontend
- Clear browser cache

---

## 📞 NEED HELP?

1. Check Railway docs: https://docs.railway.app
2. Check Vercel docs: https://vercel.com/docs
3. Check browser console for specific errors
4. Check Railway/Vercel logs for server errors
