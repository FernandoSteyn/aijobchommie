# EXACT Render Dashboard Settings

## In your Render Dashboard, update these settings:

### Build & Deploy Section:
- **Root Directory**: (LEAVE EMPTY - delete "backend")
- **Build Command**: 
```bash
cd backend && export PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true && export PUPPETEER_SKIP_DOWNLOAD=true && export PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable && npm ci --only=production --no-audit --no-fund
```

- **Start Command**: 
```bash
node start.js
```

### Environment Variables:
Make sure these are set in your Environment section:

1. `NODE_ENV` = `production`
2. `PUPPETEER_SKIP_CHROMIUM_DOWNLOAD` = `true`
3. `PUPPETEER_SKIP_DOWNLOAD` = `true`
4. `PUPPETEER_EXECUTABLE_PATH` = `/usr/bin/google-chrome-stable`
5. `RENDER` = `true`
6. `PORT` = `10000`
7. `SUPABASE_URL` = (your supabase url)
8. `SUPABASE_SERVICE_ROLE_KEY` = (your supabase service role key)
9. `SUPABASE_ANON_KEY` = (your supabase anon key)
10. `PAYSTACK_SECRET_KEY` = (your paystack secret key)
11. `PAYSTACK_PUBLIC_KEY` = (your paystack public key)
12. `JWT_SECRET_SIGNATURE` = (your jwt secret)

### Build Filters:
**Included Paths:**
- `backend/**`
- `render.yaml`
- `start.js`

**Ignored Paths:**
- `frontend/**`
- `*.md`
- `.gitignore`

## Steps to Update:
1. Go to your Render service settings
2. Clear the "Root Directory" field (make it empty)
3. Update the Build Command and Start Command as shown above
4. Verify all environment variables are set
5. Save and redeploy

The new `start.js` script will handle finding the correct paths automatically.
