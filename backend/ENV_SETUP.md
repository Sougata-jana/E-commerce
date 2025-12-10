# Environment Variables Setup for Vercel

## ⚠️ IMPORTANT: You MUST set these environment variables in Vercel Dashboard

Your deployment is live but will show 500 errors until environment variables are set!

## Step-by-Step Instructions:

### 1. Go to Vercel Dashboard
   - Visit: https://vercel.com/sougata-janas-projects/backend
   - Or go to: https://vercel.com/dashboard → Select your project

### 2. Navigate to Environment Variables
   - Click on **Settings** tab
   - Click on **Environment Variables** in the left sidebar

### 3. Add These Required Variables:

#### Required (MUST HAVE):
```
Name: MONGODB_URI
Value: mongodb+srv://username:password@cluster.mongodb.net
Environments: Production, Preview, Development (select all)
```

```
Name: JWT_SECRET
Value: your-secret-jwt-key-here (use a long random string)
Environments: Production, Preview, Development (select all)
```

```
Name: ADMIN_EMAIL
Value: your-admin-email@example.com
Environments: Production, Preview, Development (select all)
```

```
Name: ADMIN_PASSWORD
Value: your-admin-password
Environments: Production, Preview, Development (select all)
```

#### Optional (but recommended):
```
Name: CLOUDINARY_NAME
Value: your-cloudinary-cloud-name
Environments: Production, Preview, Development (select all)
```

```
Name: CLOUDINARY_API_KEY
Value: your-cloudinary-api-key
Environments: Production, Preview, Development (select all)
```

```
Name: CLOUDINARY_API_SECRET
Value: your-cloudinary-api-secret
Environments: Production, Preview, Development (select all)
```

```
Name: STRIPE_SECRET_KEY
Value: sk_test_... or sk_live_... (your Stripe secret key)
Environments: Production, Preview, Development (select all)
```

### 4. After Adding Variables
   - Click **Save** for each variable
   - Go to **Deployments** tab
   - Click the **...** (three dots) on the latest deployment
   - Click **Redeploy** to apply the new environment variables

### 5. Test Your API
   After redeploying, test:
   - GET https://backend-975angbwy-sougata-janas-projects.vercel.app/
   - Should return: "API Working"

## Current Deployment URL:
**Production:** https://backend-975angbwy-sougata-janas-projects.vercel.app

## Troubleshooting:

If you still get 500 errors after setting variables:
1. Check the Function Logs in Vercel Dashboard
2. Verify MongoDB connection string is correct
3. Make sure MongoDB Atlas allows connections from anywhere (0.0.0.0/0) or add Vercel IPs
4. Check that JWT_SECRET is set (this is critical!)

