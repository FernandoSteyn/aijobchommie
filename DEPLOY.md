# 🚂 Railway Deployment Instructions

## Step 1: Login to Railway
Open your terminal and run:
```bash
railway login
```
This will open your browser. Login with: sosoterrifying@gmail.com

## Step 2: Create New Project
```bash
railway init
```
Choose "Empty Project" and give it a name like "aijobchommie-backend"

## Step 3: Set Environment Variables
In Railway dashboard, go to Variables tab and add:

```
SUPABASE_URL=https://lukxqkgxayijqlqslabs.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx1a3hxa2d4YXlpanFscXNsYWJzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzMzE3NTIsImV4cCI6MjA2ODkwNzc1Mn0.SC9nZEsl1z4E_vvkQIBaWVBqnlOciMgBI5pZy3AopF0
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
PAYSTACK_SECRET_KEY=your_paystack_secret_key_here
PAYSTACK_PUBLIC_KEY=pk_test_eeb7eb6ee2a8699dfc613468651db6699ff095cb
NODE_ENV=production
PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser
```

## Step 4: Deploy
```bash
railway up
```

## Step 5: Get Your Railway URL
After deployment, Railway will give you a URL like:
`https://your-project-name.railway.app`

## Step 6: Update Frontend
Update the REACT_APP_API_URL in frontend/.env to your Railway URL

## Step 7: Rebuild APK
```bash
cd frontend
npm run build
npx cap sync android
cd android
.\gradlew.bat assembleDebug
```

Your new APK will be at:
`frontend/android/app/build/outputs/apk/debug/app-debug.apk`
