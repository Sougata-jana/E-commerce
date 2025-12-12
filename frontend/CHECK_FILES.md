# Build Error Fix

The error says: "Could not resolve "./p_img5.jpg""

## Solution:

All files exist locally. The issue is likely that:
1. Files need to be committed to git
2. Or there's a case sensitivity issue on Vercel

Make sure ALL image files in `src/assets/` are committed to git:
- p_img1.jpg through p_img40.jpg
- All other image files

## Quick Fix:

1. Commit all asset files to git
2. Push to repository
3. Redeploy on Vercel

## Files that must exist:
- p_img1.jpg through p_img40.jpg
- All Hero images
- All icon files
- PhonePe_Logo_icon.svg (note: capital P and L)

