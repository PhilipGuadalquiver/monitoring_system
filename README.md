# Task Monitoring System

A comprehensive React-based task monitoring system built with Ant Design, featuring task creation, monitoring, and process tracking capabilities.

## Features

- **Dashboard**: Overview of all tasks with statistics and recent activities
- **Task Creation**: Multi-step form with comprehensive task configuration
- **Task Monitoring**: Real-time monitoring of task status, progress, and metrics
- **Process Tracking**: Detailed view of task execution with logs and metrics
- **Full Ant Design Integration**: Utilizes all major Ant Design components

## Tech Stack

### Frontend
- React 18
- Ant Design 5
- React Router DOM
- Vite
- Day.js

### Backend
- Node.js
- Express
- Prisma ORM
- PostgreSQL

## Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
Create a `.env` file in the root directory:
```env
DATABASE_URL=postgres://your_connection_string_here
VITE_API_URL=http://localhost:5000/api
```

3. Set up the database:
```bash
# Generate Prisma Client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# (Optional) Seed the database with sample data
npm run prisma:seed

# (Optional) Open Prisma Studio to view data
npm run prisma:studio
```

4. Start the backend server:
```bash
npm run server
# or for development with auto-reload
npm run dev:server
```

5. Start the frontend development server (in a new terminal):
```bash
npm run dev
```

6. Build for production:
```bash
npm run build
```

## Project Structure

```
monitoring_system/
├── src/
│   ├── components/
│   │   ├── Dashboard.jsx       # Main dashboard with statistics
│   │   ├── CreateTask.jsx      # Task creation form
│   │   ├── TaskMonitor.jsx     # Task monitoring table
│   │   ├── TaskDetails.jsx     # Detailed task view
│   │   └── Settings.jsx        # Settings page
│   ├── services/
│   │   └── api.js               # API service layer
│   ├── App.jsx                 # Main app component with routing
│   ├── main.jsx                # Entry point
│   └── index.css               # Global styles
├── server/
│   └── index.js                # Express backend server
├── prisma/
│   ├── schema.prisma           # Prisma schema definition
│   ├── migrations/             # Database migrations
│   └── seed.js                 # Database seed script
├── package.json
├── vite.config.js
├── prisma.config.ts            # Prisma configuration
└── index.html
```

## Ant Design Components Used

- Layout (Sider, Header, Content)
- Menu
- Card
- Table
- Form (Input, Select, DatePicker, TimePicker, etc.)
- Button
- Tag
- Progress
- Statistic
- Timeline
- Steps
- Tabs
- Drawer
- Modal
- Alert
- Badge
- Avatar
- List
- Descriptions
- Tree
- Transfer
- Upload
- Rate
- Slider
- ColorPicker
- AutoComplete
- Mentions
- Cascader
- TreeSelect
- Pagination
- Anchor
- BackTop
- Affix
- Result
- Skeleton
- Empty
- Spin
- Divider
- Space
- Row/Col
- Typography
- Popconfirm
- Tooltip
- Switch
- Radio
- Checkbox
- And more...

## API Endpoints

### Tasks
- `GET /api/tasks` - Get all tasks (supports query params: status, assigneeId, priority, category)
- `GET /api/tasks/:id` - Get task by ID
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task
- `POST /api/tasks/:id/logs` - Add log entry to task
- `POST /api/tasks/:id/metrics` - Add metrics to task
- `GET /api/tasks/:id/comments` - Get task comments
- `POST /api/tasks/:id/comments` - Add comment to task

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics

### Settings
- `GET /api/settings` - Get system settings
- `PUT /api/settings` - Update system settings

## Database Schema

The application uses PostgreSQL with the following main tables:
- `users` - User accounts
- `tasks` - Task records
- `task_tags` - Task tags
- `task_files` - Task file attachments
- `task_logs` - Task execution logs
- `task_metrics` - Task performance metrics
- `task_dependencies` - Task dependency relationships
- `comments` - Task comments
- `sessions` - User sessions
- `api_keys` - API keys for users
- `user_permissions` - User permissions
- `notifications` - Notification settings
- `system_settings` - System configuration

## Usage

1. **Dashboard**: View overview of all tasks and system statistics
2. **Create Task**: Use the multi-step form to create new tasks with various configurations
3. **Task Monitor**: Monitor all tasks with filtering, sorting, and search capabilities
4. **Task Details**: View detailed information about a specific task including process monitoring
5. **Settings**: Configure system settings, user profile, notifications, security, and more

## Development

### Running the Application

#### Quick Start:

1. **Set up environment variables:**
   Create a `.env` file:
   ```env
   DATABASE_URL=your_postgres_connection_string
   PORT=5000
   ```

2. **Generate Prisma Client:**
   ```bash
   npm run prisma:generate
   ```

3. **Start the backend server:**
   ```bash
   npm run server
   # or for development with auto-reload:
   npm run dev:server
   ```
   
   The backend will run on `http://localhost:5000`
   You should see: `✅ Database connected successfully!`

4. **Start the frontend (in a new terminal):**
   ```bash
   npm run dev
   ```

5. **Access the application:**
   - Frontend: `http://localhost:3000`
   - Backend API: `http://localhost:5000/api`
   - Health Check: `http://localhost:5000/api/health`

For detailed backend setup instructions, see `BACKEND_SETUP.md`

### Database Management

- View data in Prisma Studio: `npm run prisma:studio`
- Create a new migration: `npm run prisma:migrate`
- Generate Prisma Client: `npm run prisma:generate`
- Seed database: `npm run prisma:seed`

## License

MIT
