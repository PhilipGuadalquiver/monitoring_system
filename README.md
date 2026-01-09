# Task Monitoring System

A comprehensive React-based task monitoring system built with Ant Design, featuring task creation, monitoring, and process tracking capabilities.

## Features

- **Dashboard**: Overview of all tasks with statistics and recent activities
- **Task Creation**: Multi-step form with comprehensive task configuration
- **Task Monitoring**: Real-time monitoring of task status, progress, and metrics
- **Process Tracking**: Detailed view of task execution with logs and metrics
- **Full Ant Design Integration**: Utilizes all major Ant Design components

## Tech Stack

- React 18
- Ant Design 5
- React Router DOM
- Vite
- Day.js

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Build for production:
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
│   │   └── TaskDetails.jsx     # Detailed task view
│   ├── App.jsx                 # Main app component with routing
│   ├── main.jsx                # Entry point
│   └── index.css               # Global styles
├── package.json
├── vite.config.js
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

## Usage

1. **Dashboard**: View overview of all tasks and system statistics
2. **Create Task**: Use the multi-step form to create new tasks with various configurations
3. **Task Monitor**: Monitor all tasks with filtering, sorting, and search capabilities
4. **Task Details**: View detailed information about a specific task including process monitoring

## License

MIT
