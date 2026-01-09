# Quick Start Guide

## Running the Backend

### Important: Always run from the project root directory!

```bash
# Make sure you're in the project root
cd "D:\React.js Project\monitoring_system"

# Then run the server
npm run server
```

### If you get "DATABASE_URL not set" error:

1. **Check you're in the right directory:**
   ```bash
   # Should show: D:\React.js Project\monitoring_system
   pwd
   ```

2. **Verify .env file exists:**
   ```bash
   # Windows PowerShell
   Test-Path .env
   # Should return: True
   ```

3. **Check .env file content:**
   ```bash
   # Windows PowerShell
   Get-Content .env
   ```

4. **If .env is missing, create it:**
   ```env
   DATABASE_URL=postgres://c36cae205a58b40f4b7e15686c2b1e226428dc775292fd87cc3647956918838a:sk_3187x8SVFjrS2JmrNidRF@db.prisma.io:5432/postgres?sslmode=require
   PORT=5000
   ```

## Complete Setup Steps

1. **Navigate to project root:**
   ```bash
   cd "D:\React.js Project\monitoring_system"
   ```

2. **Install dependencies (if not done):**
   ```bash
   npm install
   ```

3. **Generate Prisma Client:**
   ```bash
   npm run prisma:generate
   ```

4. **Run database migrations:**
   ```bash
   npm run prisma:migrate
   ```

5. **Seed database (optional):**
   ```bash
   npm run prisma:seed
   ```

6. **Start the backend:**
   ```bash
   npm run server
   ```

7. **In a new terminal, start the frontend:**
   ```bash
   cd "D:\React.js Project\monitoring_system"
   npm run dev
   ```

## Expected Output

When the backend starts successfully, you should see:

```
📁 Loaded .env from: D:\React.js Project\monitoring_system\.env
🔄 Connecting to database...
📊 Database URL: postgres://c36cae205a58b40f4b7e15686c2b1e226428dc775292fd87cc3647956918838a:****@db.prisma.io:5432/postgres?sslmode=require
✅ Database connected successfully!
📈 Database is ready. Current users in database: 3
Server is running on port 5000
Health check: http://localhost:5000/api/health
```

## Troubleshooting

### Error: "DATABASE_URL environment variable is not set"

**Solution:**
- Make sure you're running from the project root directory
- Verify `.env` file exists in the root
- Check that `.env` file has `DATABASE_URL=` on the first line (no spaces before)

### Error: "Failed to connect to database"

**Solution:**
- Verify your `DATABASE_URL` is correct
- Check if your database is accessible
- Ensure SSL mode is set: `?sslmode=require`

### Server won't start

**Solution:**
- Make sure port 5000 is not already in use
- Check if Prisma Client is generated: `npm run prisma:generate`
- Verify all dependencies are installed: `npm install`
