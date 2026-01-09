# Troubleshooting Production Errors

## "Server error. Please try again later."

This error typically occurs when the backend API is not working correctly in production. Follow these steps to diagnose and fix:

### Step 1: Check Vercel Environment Variables

1. Go to your Vercel Dashboard
2. Navigate to: **Project Settings → Environment Variables**
3. Verify that `DATABASE_URL` is set:
   - Should be your PostgreSQL connection string
   - Format: `postgres://user:password@host:port/database?sslmode=require`
   - Make sure it's available for **Production** environment

### Step 2: Test the API Endpoints

#### Test Health Endpoint
Visit: `https://your-app.vercel.app/api/health`

Expected response:
```json
{
  "status": "ok",
  "message": "Server is running",
  "database": "available" or "not configured",
  "hasDatabaseUrl": true or false,
  "timestamp": "..."
}
```

#### Test Database Connection
Visit: `https://your-app.vercel.app/api/test`

Expected response (if database is working):
```json
{
  "status": "ok",
  "message": "API and database are working",
  "userCount": 0,
  "timestamp": "..."
}
```

If you see "Database not configured" or "Database connection failed", the issue is with your DATABASE_URL.

### Step 3: Check Vercel Function Logs

1. Go to Vercel Dashboard → Your Project → **Deployments**
2. Click on the latest deployment
3. Go to **Functions** tab
4. Click on `/api/index.js`
5. Check the **Logs** tab for errors

Look for:
- `❌ ERROR: DATABASE_URL environment variable is not set!`
- `❌ Failed to connect to database: ...`
- Any Prisma errors

### Step 4: Verify Prisma Client is Generated

The build process should automatically generate Prisma Client. Check:

1. In Vercel build logs, look for: `Running "prisma generate"`
2. If not found, Prisma Client might not be generated

**Fix:** The `postinstall` script in `package.json` should run `prisma generate` automatically.

### Step 5: Common Issues and Solutions

#### Issue: DATABASE_URL not set
**Solution:**
1. Add `DATABASE_URL` in Vercel Environment Variables
2. Redeploy the application

#### Issue: Database connection timeout
**Solution:**
- Check if your database allows connections from Vercel's IPs
- Verify SSL mode is set correctly (`?sslmode=require`)
- Check database firewall settings

#### Issue: Prisma Client not found
**Solution:**
- Ensure `prisma generate` runs during build
- Check that `@prisma/client` is in dependencies
- Verify `postinstall` script in package.json

#### Issue: CORS errors
**Solution:**
- CORS is already configured in `api/index.js`
- If still having issues, check browser console for specific CORS errors

### Step 6: Check Browser Console

1. Open your production site
2. Open Browser DevTools (F12)
3. Go to **Console** tab
4. Look for API errors
5. Go to **Network** tab
6. Check failed API requests and their response

### Step 7: Verify API Routes

Test these endpoints in production:

- `GET /api/health` - Should always work
- `GET /api/test` - Tests database connection
- `GET /api/users` - Should return users or error message
- `GET /api/tasks` - Should return tasks or error message

### Debugging Tips

1. **Check Vercel Logs First**: Most errors will be logged there
2. **Use Health Endpoint**: `/api/health` works without database
3. **Test Endpoint**: `/api/test` specifically tests database
4. **Check Environment Variables**: Make sure DATABASE_URL is set for Production
5. **Redeploy After Changes**: Always redeploy after changing environment variables

### Getting More Detailed Errors

The improved error handling will now show:
- Specific error messages instead of generic "Server error"
- Database connection status
- More context about what failed

Check the browser console and Vercel logs for these detailed messages.

### Still Having Issues?

1. Check Vercel Function logs for the actual error
2. Verify DATABASE_URL is correct and accessible
3. Ensure Prisma migrations have been run
4. Check that the database has the required tables
5. Verify network connectivity between Vercel and your database
