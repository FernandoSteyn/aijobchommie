# Deploy AI Job Chommie Backend to Render.com

## Step 1: Go to Render Dashboard
1. Visit: https://dashboard.render.com/
2. Log into your existing Render account

## Step 2: Create New Web Service
1. Click **"New +"** button
2. Select **"Web Service"**
3. Connect your GitHub repository: `FernandoSteyn/aijobchommie`

## Step 3: Configure the Service
**Basic Settings:**
- **Name:** `aijobchommie-backend`
- **Region:** Oregon (US West) - (free tier available)
- **Branch:** `main`
- **Root Directory:** `backend`
- **Runtime:** `Node`
- **Build Command:** `npm install`
- **Start Command:** `npm start`

## Step 4: Environment Variables
Click **"Advanced"** and add these environment variables:
- `NODE_ENV` = `production`
- `PORT` = `10000` (Render will set this automatically, but good to have)

**You'll also need these (ask user for values):**
- `MONGO_URL` = `your-mongodb-connection-string`
- `JWT_SECRET` = `your-jwt-secret-key`
- `SUPABASE_URL` = `your-supabase-url` (if using Supabase)
- `SUPABASE_ANON_KEY` = `your-supabase-anon-key` (if using Supabase)

## Step 5: Deploy
1. Select **"Free"** plan
2. Click **"Create Web Service"**
3. Wait for deployment (5-10 minutes)

## Step 6: Get Your Backend URL
Once deployed, you'll get a URL like:
`https://aijobchommie-backend.onrender.com`

## Step 7: Test Your Backend
Visit: `https://your-backend-url.onrender.com/api/health`
You should see: `{"status":"OK","message":"AI Job Chommie Backend is running"}`

---

## Next Steps After Deployment:
1. **Update Frontend**: Update frontend environment files with your new backend URL
2. **Rebuild APK**: Rebuild the Android APK with the new backend URL
3. **Test Everything**: Test the full app functionality

## Important Notes:
- Free tier has some limitations (apps sleep after 15 minutes of inactivity)
- First request after sleep might be slow (cold start)
- Monthly build hours are limited on free tier
- For production, consider upgrading to paid plan

## Troubleshooting:
If deployment fails:
1. Check the build logs in Render dashboard
2. Ensure all environment variables are set
3. Make sure `backend/package.json` has correct start script
4. Verify Node.js version compatibility (we're using >=18.0.0)
