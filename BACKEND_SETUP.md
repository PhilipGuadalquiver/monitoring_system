# Backend Setup & Running Guide

## Prerequisites

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Set Up Environment Variables:**
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL=postgres://c36cae205a58b40f4b7e15686c2b1e226428dc775292fd87cc3647956918838a:sk_3187x8SVFjrS2JmrNidRF@db.prisma.io:5432/postgres?sslmode=require
   PORT=5000
   ```

3. **Generate Prisma Client:**
   ```bash
   npm run prisma:generate
   ```

4. **Run Database Migrations (if needed):**
   ```bash
   npm run prisma:migrate
   ```

5. **Seed Database (optional - for sample data):**
   ```bash
   npm run prisma:seed
   ```

## Running the Backend

### Option 1: Standard Mode (Recommended for Production)
```bash
npm run server
```

This will:
- Start the Express server on port 5000 (or PORT from .env)
- Connect to the database
- Show connection logs
- Make API available at `http://localhost:5000/api`

**Expected Output:**
```
🔄 Connecting to database...
📊 Database URL: postgres://c36cae205a58b40f4b7e15686c2b1e226428dc775292fd87cc3647956918838a:****@db.prisma.io:5432/postgres?sslmode=require
✅ Database connected successfully!
📈 Database is ready. Current users in database: 3
Server is running on port 5000
Health check: http://localhost:5000/api/health
```

### Option 2: Development Mode (Auto-reload)
```bash
npm run dev:server
```

This will:
- Start the server with auto-reload on file changes
- Automatically restart when you modify server files
- Perfect for development

## Verify Backend is Running

1. **Check Health Endpoint:**
   Open your browser or use curl:
   ```bash
   curl http://localhost:5000/api/health
   ```
   
   Should return:
   ```json
   {
     "status": "ok",
     "message": "Server is running"
   }
   ```

2. **Test API Endpoints:**
   ```bash
   # Get all users
   curl http://localhost:5000/api/users
   
   # Get all tasks
   curl http://localhost:5000/api/tasks
   
   # Get dashboard stats
   curl http://localhost:5000/api/dashboard/stats
   ```

## Running Frontend + Backend Together

### Terminal 1 - Backend:
```bash
npm run server
# or
npm run dev:server
```

### Terminal 2 - Frontend:
```bash
npm run dev
```

The frontend will run on `http://localhost:3000` and connect to the backend at `http://localhost:5000/api`

## Troubleshooting

### Error: "DATABASE_URL environment variable is not set"
- **Fix:** Create a `.env` file with `DATABASE_URL` set
- Or set it directly: `export DATABASE_URL="your-connection-string"`

### Error: "Failed to connect to database"
- **Fix:** 
  - Verify your `DATABASE_URL` is correct
  - Check if your database is accessible
  - Ensure SSL mode is set correctly (`?sslmode=require`)

### Error: "Port 5000 already in use"
- **Fix:** 
  - Change PORT in `.env` file
  - Or kill the process using port 5000:
    ```bash
    # Windows
    netstat -ano | findstr :5000
    taskkill /PID <PID> /F
    ```

### Error: "Prisma Client not generated"
- **Fix:** Run `npm run prisma:generate`

## API Endpoints Available

Once the backend is running, these endpoints are available:

- `GET /api/health` - Health check
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create user
- `PUT /api/users/:id` - Update user
- `GET /api/tasks` - Get all tasks (supports query params)
- `GET /api/tasks/:id` - Get task by ID
- `POST /api/tasks` - Create task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task
- `GET /api/dashboard/stats` - Get dashboard statistics
- `GET /api/settings` - Get system settings
- `PUT /api/settings` - Update system settings
- `POST /api/seed` - Seed database (requires SEED_SECRET)

## Stopping the Server

Press `Ctrl + C` in the terminal where the server is running.

The server will:
- Disconnect from database gracefully
- Close all connections
- Exit cleanly
