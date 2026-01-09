# Deployment Guide

## Problem: "Failed to load tasks" in Production

This error occurs because the backend API server is not deployed or not accessible in production.

## Solutions

### Option 1: Deploy Backend as Vercel Serverless Functions (Recommended)

The project includes serverless function support in the `api/` directory.

1. **Set Environment Variables in Vercel:**
   - Go to your Vercel project settings
   - Navigate to "Environment Variables"
   - Add: `DATABASE_URL` with your PostgreSQL connection string
   - The API will be available at `/api/*` routes automatically

2. **Deploy:**
   - Push your code to GitHub
   - Vercel will automatically detect and deploy both frontend and API functions

3. **Update Frontend API URL:**
   - In Vercel, add environment variable: `VITE_API_URL` = `/api`
   - Or leave it unset to use the default relative path

### Option 2: Deploy Backend Separately (Railway, Render, etc.)

1. **Deploy Backend to Railway/Render:**
   ```bash
   # On Railway or Render, set these environment variables:
   DATABASE_URL=your_postgres_connection_string
   PORT=5000 (or let the platform assign)
   ```

2. **Get Backend URL:**
   - After deployment, you'll get a URL like: `https://your-backend.railway.app`

3. **Set Frontend Environment Variable:**
   - In Vercel, add: `VITE_API_URL` = `https://your-backend.railway.app/api`

### Option 3: Use Vercel API Routes (Current Setup)

The `api/index.js` file is configured for Vercel serverless functions.

**Steps:**
1. Ensure `vercel.json` is configured correctly (already done)
2. Set `DATABASE_URL` in Vercel environment variables
3. Deploy - Vercel will automatically handle the API routes

## Environment Variables Needed

### For Frontend (Vercel):
- `VITE_API_URL` (optional) - If backend is on different domain, set this to full URL

### For Backend (Vercel Functions or Separate Deployment):
- `DATABASE_URL` - Your PostgreSQL connection string

## Testing After Deployment

1. Check API health: `https://your-domain.vercel.app/api/health`
2. Should return: `{"status":"ok","message":"Server is running"}`

## Troubleshooting

### Error: "Backend server is not available"
- **Cause:** Backend not deployed or DATABASE_URL not set
- **Fix:** Deploy backend and set environment variables

### Error: "CORS error"
- **Cause:** Backend CORS not configured for your domain
- **Fix:** Update CORS settings in `server/index.js` or `api/index.js`

### Error: "Database connection failed"
- **Cause:** DATABASE_URL incorrect or database not accessible
- **Fix:** Verify DATABASE_URL and database connectivity

## Quick Fix for Current Deployment

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add: `DATABASE_URL` = `postgres://c36cae205a58b40f4b7e15686c2b1e226428dc775292fd87cc3647956918838a:sk_3187x8SVFjrS2JmrNidRF@db.prisma.io:5432/postgres?sslmode=require`
3. Add: `VITE_API_URL` = `/api` (for same-domain API) or your backend URL
4. Redeploy the project

The API routes in `api/index.js` will be automatically available at `/api/*` when deployed to Vercel.

## Database Seeding in Production

See `SEED_PRODUCTION.md` for detailed instructions on how to seed your production database.

**Quick Method (Recommended):**
1. Set `SEED_SECRET` environment variable in Vercel
2. Call: `POST https://your-domain.vercel.app/api/seed?token=your-secret-token`
3. Your database will be seeded with 3 sample users and tasks
