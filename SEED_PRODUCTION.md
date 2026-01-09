# Running Seed Script in Production

There are several ways to run the database seed script in production. Choose the method that best fits your deployment setup.

## Option 1: API Endpoint (Recommended for Vercel)

A secure API endpoint has been created at `/api/seed` that you can call to seed your production database.

### Steps:

1. **Set Environment Variable in Vercel:**
   - Go to Vercel Dashboard → Your Project → Settings → Environment Variables
   - Add: `SEED_SECRET` = `your-secret-token-here` (use a strong random string)
   - Redeploy your project

2. **Call the Seed Endpoint:**
   
   **Using curl:**
   ```bash
   curl -X POST https://your-domain.vercel.app/api/seed \
     -H "x-seed-token: your-secret-token-here"
   ```
   
   **Or using query parameter:**
   ```bash
   curl -X POST "https://your-domain.vercel.app/api/seed?token=your-secret-token-here"
   ```
   
   **Or using GET (for browser):**
   ```
   https://your-domain.vercel.app/api/seed?token=your-secret-token-here
   ```

3. **Response:**
   ```json
   {
     "success": true,
     "message": "Database seeded successfully",
     "users": 3,
     "tasks": 3
   }
   ```

### Security Notes:
- ⚠️ **IMPORTANT:** Always set `SEED_SECRET` in production
- The endpoint will return 401 Unauthorized if the token doesn't match
- Consider adding IP whitelisting for additional security
- Only use this endpoint when you need to seed/reset your database

---

## Option 2: Vercel CLI (Local Execution)

You can run the seed script locally but connect to your production database.

### Steps:

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Pull Environment Variables:**
   ```bash
   vercel env pull .env.production
   ```

3. **Set DATABASE_URL:**
   ```bash
   # In .env.production or directly
   export DATABASE_URL="your-production-database-url"
   ```

4. **Run Seed Script:**
   ```bash
   DATABASE_URL="your-production-database-url" npm run prisma:seed
   ```

---

## Option 3: One-Time Build Script

Add seed to your build process (runs automatically on deployment).

### Steps:

1. **Update `package.json`:**
   ```json
   {
     "scripts": {
       "build": "npm run prisma:generate && npm run prisma:seed && vite build"
     }
   }
   ```

2. **⚠️ Warning:** This will seed on EVERY deployment. Only use if you want fresh data each time.

---

## Option 4: Manual Database Access

If you have direct database access (e.g., via Prisma Studio or database client):

1. **Run Prisma Studio:**
   ```bash
   DATABASE_URL="your-production-database-url" npx prisma studio
   ```

2. **Manually insert data** through the UI

---

## Option 5: Database Migration with Seed Data

Include seed data in your migration files (for initial setup only).

### Steps:

1. Create a migration that includes INSERT statements
2. Run the migration in production
3. This is a one-time setup approach

---

## Recommended Approach for Vercel

**Use Option 1 (API Endpoint)** because:
- ✅ Secure (requires secret token)
- ✅ Can be triggered on-demand
- ✅ Works with serverless functions
- ✅ Easy to call from anywhere
- ✅ Returns clear success/error messages

### Quick Start:

1. Set `SEED_SECRET` in Vercel environment variables
2. Deploy your project
3. Call: `POST https://your-domain.vercel.app/api/seed?token=your-secret-token`
4. Done! Your database is seeded.

---

## Troubleshooting

### Error: "DATABASE_URL environment variable is not set"
- **Fix:** Ensure `DATABASE_URL` is set in Vercel environment variables

### Error: "Unauthorized"
- **Fix:** Check that `SEED_SECRET` matches the token you're sending

### Error: "Connection timeout"
- **Fix:** Verify your database is accessible from Vercel's servers
- Check firewall/network settings

### Error: "Prisma Client not generated"
- **Fix:** Run `npm run prisma:generate` before deploying

---

## Safety Tips

1. **Backup First:** Always backup your production database before seeding
2. **Test Locally:** Test the seed script with production database URL locally first
3. **Use Secrets:** Never commit `SEED_SECRET` to your repository
4. **Monitor:** Check your database after seeding to verify data
5. **Limit Access:** Only allow authorized users to trigger seeding
