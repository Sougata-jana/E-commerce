# 🔧 Setup MongoDB Connection on Vercel

## Current Status
✅ API is working  
❌ Database is disconnected (needs MONGODB_URI environment variable)

## Quick Fix - Add Environment Variables

### Option 1: Using Vercel Dashboard (Recommended)

1. **Go to your Vercel project**:
   ```
   https://vercel.com/sougata-janas-projects/backend/settings/environment-variables
   ```

2. **Click "Add New"** and add these variables:

   #### Required Variables:
   
   **MONGODB_URI** (MOST IMPORTANT!)
   - Key: `MONGODB_URI`
   - Value: Your MongoDB connection string
     - Format: `mongodb+srv://username:password@cluster.mongodb.net/ecommerce`
     - Or: `mongodb+srv://username:password@cluster.mongodb.net` (we'll add /ecommerce automatically)
   - Environments: ✅ Production ✅ Preview ✅ Development
   
   **JWT_SECRET**
   - Key: `JWT_SECRET`
   - Value: Any long random string (e.g., `my-super-secret-jwt-key-2024`)
   - Environments: ✅ Production ✅ Preview ✅ Development
   
   **ADMIN_EMAIL**
   - Key: `ADMIN_EMAIL`
   - Value: Your admin email (e.g., `admin@example.com`)
   - Environments: ✅ Production ✅ Preview ✅ Development
   
   **ADMIN_PASSWORD**
   - Key: `ADMIN_PASSWORD`
   - Value: Your admin password
   - Environments: ✅ Production ✅ Preview ✅ Development

3. **After adding all variables**, go to **Deployments** tab

4. **Redeploy**:
   - Click **...** (three dots) on the latest deployment
   - Click **Redeploy**
   - Wait for deployment to complete

5. **Test again**:
   - Visit: `https://backend-7j6odf49h-sougata-janas-projects.vercel.app/`
   - Database should now show: `"database": "connected"`

---

### Option 2: Using Vercel CLI

If you have your MongoDB connection string ready:

```bash
cd backend

# Add MONGODB_URI
vercel env add MONGODB_URI production

# Add JWT_SECRET
vercel env add JWT_SECRET production

# Add ADMIN_EMAIL
vercel env add ADMIN_EMAIL production

# Add ADMIN_PASSWORD
vercel env add ADMIN_PASSWORD production

# Then redeploy
vercel --prod
```

---

## Getting Your MongoDB Connection String

### If using MongoDB Atlas:

1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Click **Connect** on your cluster
3. Choose **Connect your application**
4. Copy the connection string
5. Replace `<password>` with your database password
6. Format should be: `mongodb+srv://username:password@cluster.mongodb.net`

### Important MongoDB Atlas Settings:

1. **Network Access**:
   - Go to Network Access in MongoDB Atlas
   - Add IP Address: `0.0.0.0/0` (allows all IPs)
   - Or add Vercel's IP ranges

2. **Database User**:
   - Go to Database Access
   - Make sure you have a user with password
   - User needs read/write permissions

---

## Verify Connection

After setting environment variables and redeploying:

1. **Check health endpoint**:
   ```
   GET https://backend-7j6odf49h-sougata-janas-projects.vercel.app/
   ```
   
   Should return:
   ```json
   {
     "message": "API Working",
     "status": "ok",
     "database": "connected",  ← Should be "connected" now!
     "timestamp": "..."
   }
   ```

2. **Test API endpoint**:
   ```
   POST https://backend-7j6odf49h-sougata-janas-projects.vercel.app/api/user/register
   Content-Type: application/json
   
   {
     "name": "Test User",
     "email": "test@example.com",
     "password": "password123"
   }
   ```

---

## Troubleshooting

### Still seeing "disconnected"?

1. **Check Vercel Logs**:
   - Go to your deployment
   - Click **Functions** tab
   - View logs for errors

2. **Verify Environment Variables**:
   - Make sure MONGODB_URI is set correctly
   - No extra spaces or quotes in the value
   - Connection string format is correct

3. **Check MongoDB Atlas**:
   - Network Access allows connections (0.0.0.0/0)
   - Database user password is correct
   - Cluster is not paused

4. **Test Connection String Locally**:
   - Try connecting with MongoDB Compass
   - Verify the connection string works

---

## Current Deployment URL

**Production:** `https://backend-7j6odf49h-sougata-janas-projects.vercel.app`

