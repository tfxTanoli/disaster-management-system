# ⚡ QUICK FIX REFERENCE CARD

## 🚨 MAIN PROBLEM
**Backend API is NOT deployed** - causing all API calls to fail

---

## ✅ 3-STEP FIX (20 minutes)

### STEP 1: Deploy Backend (15 min)
```
1. Go to https://railway.app
2. Sign in with GitHub
3. New Project → Deploy from GitHub
4. Select your repo
5. Settings:
   - Root Directory: backend
   - Build: pip install -r requirements.txt
   - Start: uvicorn fast_server:app --host 0.0.0.0 --port $PORT
6. Add environment variables (see DEPLOYMENT_GUIDE.md)
7. Copy your Railway URL
```

### STEP 2: Update Vercel (2 min)
```
1. Go to https://vercel.com/dashboard
2. Select project → Settings → Environment Variables
3. Add: VITE_API_URL = https://your-railway-url.railway.app
4. Redeploy
```

### STEP 3: Push Code (1 min)
```bash
git add .
git commit -m "Fix: Add SPA routing and update CORS"
git push
```

---

## 🧪 TEST IT WORKS

1. Go to: https://disaster-management-system-teal.vercel.app/admin/risk-assessment
2. Login: usmantan267@gmail.com / tfxUsman124
3. Click "Calculate Risk Probability"
4. Should see prediction (not error) ✅

---

## 📁 FILES CHANGED

- ✅ `vercel.json` - Fixed SPA routing
- ✅ `backend/fast_server.py` - Fixed CORS
- ✅ `DEPLOYMENT_GUIDE.md` - Step-by-step guide
- ✅ `DEPLOYMENT_FIXES.md` - Detailed errors
- ✅ `AUDIT_SUMMARY.md` - Executive summary

---

## 🆘 IF STUCK

1. **Backend won't start?**
   - Check Railway logs
   - Verify environment variables

2. **Frontend still broken?**
   - Verify VITE_API_URL is set
   - Redeploy Vercel

3. **Still 404 errors?**
   - Push vercel.json changes
   - Clear browser cache

---

## 💡 REMEMBER

- Backend MUST be deployed first
- Environment variables are case-sensitive
- Railway URL has no trailing slash
- Redeploy after adding env vars

---

**Need detailed help?** Read `DEPLOYMENT_GUIDE.md`
