@echo off
echo Deploying Backend to Vercel...
cd backend
vercel --prod
echo.
echo Backend deployed! Copy the URL shown above.
echo.
echo Next steps:
echo 1. Copy the deployment URL
echo 2. Go to https://vercel.com/dashboard
echo 3. Select your frontend project
echo 4. Go to Settings -^> Environment Variables
echo 5. Add VITE_API_URL with your backend URL
echo 6. Redeploy frontend
pause
