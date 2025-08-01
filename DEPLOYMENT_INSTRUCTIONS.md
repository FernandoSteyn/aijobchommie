# Deployment Instructions for AI Job Chommie

## Author: Fernando Steyn
## Date: 2025-08-01

## Step 1: Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `aijobchommie`
3. Description: "AI Job Chommie - Smart job search assistant for South Africa"
4. Set to **Private** initially (you can make it public later)
5. DO NOT initialize with README, .gitignore, or license (we already have these)
6. Click "Create repository"

## Step 2: Push to GitHub

Once the repository is created, run these commands in your terminal:

```bash
# We've already initialized and committed, so just push:
git push -u origin main
```

## Step 3: Deploy Frontend to Netlify

1. Go to https://app.netlify.com
2. Login with sosoterrifying@gmail.com
3. Click "Add new site" > "Import an existing project"
4. Connect to GitHub and select the `aijobchommie` repository
5. Build settings:
   - Base directory: `frontend`
   - Build command: `npm run build`
   - Publish directory: `frontend/build`
6. Environment variables (add these in Netlify):
   ```
   REACT_APP_SUPABASE_URL=https://lukxqkgxayijqlqslabs.supabase.co
   REACT_APP_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx1a3hxa2d4YXlpanFscXNsYWJzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzMzE3NTIsImV4cCI6MjA2ODkwNzc1Mn0.SC9nZEsl1z4E_vvkQIBaWVBqnlOciMgBI5pZy3AopF0
   REACT_APP_API_URL=https://your-railway-backend-url.railway.app
   REACT_APP_PAYSTACK_PUBLIC_KEY=pk_test_eeb7eb6ee2a8699dfc613468651db6699ff095cb
   ```
7. Deploy!

## Step 4: Deploy Backend to Railway

1. Go to https://railway.app
2. Login with sosoterrifying@gmail.com
3. Create new project
4. Deploy from GitHub repo
5. Select the `aijobchommie` repository
6. Configure:
   - Root directory: `backend`
   - Build command: `npm install`
   - Start command: `npm start`
7. Add environment variables (all from backend/.env)
8. Deploy!

## Step 5: Update Frontend API URL

Once Railway provides your backend URL:
1. Update the `REACT_APP_API_URL` in Netlify environment variables
2. Redeploy on Netlify

## Step 6: Connect Custom Domain

1. In Netlify:
   - Go to Domain settings
   - Add custom domain: aijobchommie.co.za
   - Follow DNS configuration instructions
2. Add Facebook domain verification:
   - The meta tag is already in the frontend/public/index.html

## Step 7: Final Checks

- [ ] Test login with admin@aijobchommie.co.za
- [ ] Test manager dashboard access
- [ ] Test payment flow with Paystack
- [ ] Test AI features (CV analysis, job matching)
- [ ] Verify POPI Act compliance page is accessible
- [ ] Test on mobile devices

## Support

For any issues, contact: admin@aijobchommie.co.za

---

Created with ❤️ by Fernando Steyn, South Africa 🇿🇦
