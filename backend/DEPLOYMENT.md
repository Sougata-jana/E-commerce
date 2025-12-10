# Vercel Deployment Guide

## Issues Fixed

1. **MongoDB Connection Handling**: Fixed connection handling for serverless functions - now ensures DB connection on each request
2. **Error Handling**: Added comprehensive error handling middleware
3. **Environment Variables**: Added checks for required environment variables
4. **Serverless Compatibility**: Improved compatibility with Vercel serverless architecture

## Required Environment Variables

Make sure to set these in your Vercel project settings:

### Required:
- `MONGODB_URI` - Your MongoDB connection string (e.g., `mongodb+srv://username:password@cluster.mongodb.net`)
- `JWT_SECRET` - Secret key for JWT token signing
- `ADMIN_EMAIL` - Admin email for authentication
- `ADMIN_PASSWORD` - Admin password for authentication

### Optional (but recommended):
- `CLOUDINARY_NAME` - Cloudinary cloud name
- `CLOUDINARY_API_KEY` - Cloudinary API key
- `CLOUDINARY_API_SECRET` - Cloudinary API secret
- `STRIPE_SECRET_KEY` - Stripe secret key (for payment processing)
- `NODE_ENV` - Set to `production` (automatically set by Vercel)

## Deployment Steps

1. Make sure you're logged into Vercel:
   ```bash
   vercel login
   ```

2. Deploy from the backend directory:
   ```bash
   cd backend
   vercel
   ```

3. For production deployment:
   ```bash
   vercel --prod
   ```

4. Set environment variables in Vercel Dashboard:
   - Go to your project on Vercel
   - Settings → Environment Variables
   - Add all required variables listed above

## How to Set Environment Variables in Vercel

1. Go to https://vercel.com/dashboard
2. Select your project
3. Go to Settings → Environment Variables
4. Add each variable with its value
5. Select the environments (Production, Preview, Development)
6. Redeploy after adding variables

## Testing the Deployment

After deployment, test these endpoints:
- `GET /` - Should return "API Working"
- `POST /api/user/register` - User registration
- `POST /api/user/login` - User login

## Troubleshooting

If you still get 500 errors:
1. Check Vercel function logs: Project → Deployments → Select deployment → Functions → View logs
2. Verify all environment variables are set correctly
3. Check MongoDB connection string is valid and accessible
4. Ensure your MongoDB cluster allows connections from Vercel's IP addresses (use 0.0.0.0/0 for MongoDB Atlas)

