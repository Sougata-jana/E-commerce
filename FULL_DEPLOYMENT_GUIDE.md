# 🚀 Complete Deployment Guide - E-commerce App

## ✅ Current Status

- ✅ **Backend**: Deployed and working
- ⏳ **Frontend**: Needs deployment with environment variable
- ⏳ **Admin**: Needs deployment with environment variable

---

## 🔗 Deployment URLs

### Backend (Already Deployed)
**Production URL:** `https://backend-qou9xpwb5-sougata-janas-projects.vercel.app`

**Health Check:** `https://backend-qou9xpwb5-sougata-janas-projects.vercel.app/`

---

## 📋 Step-by-Step Deployment

### Step 1: Deploy Frontend

1. **Go to Frontend Directory:**
   ```bash
   cd frontend
   ```

2. **Deploy to Vercel:**
   ```bash
   vercel --prod
   ```

3. **Set Environment Variable in Vercel Dashboard:**
   - Go to: https://vercel.com/sougata-janas-projects/frontend/settings/environment-variables
   - Click **Add New**
   - Key: `VITE_BACKEND_URL`
   - Value: `https://backend-qou9xpwb5-sougata-janas-projects.vercel.app`
   - Environments: ✅ Production ✅ Preview ✅ Development
   - Click **Save**

4. **Redeploy Frontend:**
   - Go to **Deployments** tab
   - Click **...** (three dots) on latest deployment
   - Click **Redeploy**

### Step 2: Deploy Admin Panel

1. **Go to Admin Directory:**
   ```bash
   cd ../admin
   ```

2. **Deploy to Vercel:**
   ```bash
   vercel --prod
   ```

3. **Set Environment Variable in Vercel Dashboard:**
   - Go to: https://vercel.com/sougata-janas-projects/admin/settings/environment-variables
   - Click **Add New**
   - Key: `VITE_BACKEND_URL`
   - Value: `https://backend-qou9xpwb5-sougata-janas-projects.vercel.app`
   - Environments: ✅ Production ✅ Preview ✅ Development
   - Click **Save**

4. **Redeploy Admin:**
   - Go to **Deployments** tab
   - Click **...** (three dots) on latest deployment
   - Click **Redeploy**

---

## 🎯 Quick Deployment Commands

### Using Terminal (After setting env vars in dashboard):

```bash
# Deploy Frontend
cd frontend
vercel --prod --yes

# Deploy Admin
cd ../admin
vercel --prod --yes
```

---

## ✅ Verification

After deployment, test these URLs:

1. **Backend Health Check:**
   ```
   https://backend-qou9xpwb5-sougata-janas-projects.vercel.app/
   ```
   Should return: `{"message":"API Working","status":"ok","database":"connected"}`

2. **Frontend URL:** (Will be provided after deployment)
   ```
   https://frontend-XXXXX.vercel.app
   ```

3. **Admin URL:** (Will be provided after deployment)
   ```
   https://admin-XXXXX.vercel.app
   ```

---

## 🔧 Environment Variables Summary

### Backend (Already Set ✅)
- `MONGODB_URI`
- `JWT_SECRET`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`
- `CLOUDINARY_NAME` (optional)
- `CLOUDINARY_API_KEY` (optional)
- `CLOUDINARY_API_SECRET` (optional)
- `STRIPE_SECRET_KEY` (optional)

### Frontend (Need to Set ⚠️)
- `VITE_BACKEND_URL` = `https://backend-qou9xpwb5-sougata-janas-projects.vercel.app`

### Admin (Need to Set ⚠️)
- `VITE_BACKEND_URL` = `https://backend-qou9xpwb5-sougata-janas-projects.vercel.app`

---

## 🐛 Troubleshooting

### Build Fails on Vercel

1. **Check Node.js Version:**
   - Vercel should auto-detect, but if issues:
   - Go to Project Settings → Build & Development Settings
   - Set Node.js version to 20.x or 22.x

2. **Check Build Logs:**
   - Go to Deployment → Functions tab
   - View build logs for errors

3. **Verify Environment Variables:**
   - Make sure `VITE_BACKEND_URL` is set correctly
   - No trailing slashes in the URL

### Frontend/Admin Can't Connect to Backend

1. **Verify Environment Variable:**
   - Check that `VITE_BACKEND_URL` is set correctly
   - Must match the backend production URL exactly

2. **Check CORS:**
   - Backend should already have CORS enabled
   - If issues, check backend/server.js CORS settings

3. **Check Browser Console:**
   - Open browser DevTools → Console
   - Look for CORS or network errors

---

## 📝 Notes

- **Environment Variables**: Vite requires variables to start with `VITE_` to be exposed to the client
- **Build Time**: Environment variables are baked into the build at build time
- **Redeploy**: Always redeploy after adding/changing environment variables
- **Custom Domains**: You can add custom domains in Vercel project settings

---

## 🎉 After Successful Deployment

You'll have:
1. ✅ **Backend API** - Running on Vercel
2. ✅ **Frontend Store** - Customer-facing e-commerce site
3. ✅ **Admin Panel** - For managing products and orders

All three applications will be live and connected!

