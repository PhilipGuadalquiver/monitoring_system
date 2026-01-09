import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

// Get the directory of the current module
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Try to load .env from multiple locations
// 1. Project root (one level up from server directory)
// 2. Current working directory
// 3. Server directory
const envPaths = [
  join(__dirname, '..', '.env'),
  join(process.cwd(), '.env'),
  join(__dirname, '.env')
]

let envLoaded = false
for (const envPath of envPaths) {
  const result = dotenv.config({ path: envPath })
  if (!result.error) {
    envLoaded = true
    console.log(`📁 Loaded .env from: ${envPath}`)
    break
  }
}

if (!envLoaded) {
  console.warn('⚠️  Warning: No .env file found. Using environment variables or defaults.')
}

const app = express()

// Prisma 7 requires an adapter for PostgreSQL
const connectionString = process.env.DATABASE_URL

if (!connectionString) {
  console.error('❌ ERROR: DATABASE_URL environment variable is not set!')
  process.exit(1)
}

console.log('🔄 Connecting to database...')
console.log(`📊 Database URL: ${connectionString.replace(/:[^:@]+@/, ':****@')}`) // Hide password in logs

const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

// Test database connection
async function testConnection() {
  try {
    await prisma.$connect()
    console.log('✅ Database connected successfully!')
    
    // Test query to verify connection
    const userCount = await prisma.user.count()
    console.log(`📈 Database is ready. Current users in database: ${userCount}`)
  } catch (error) {
    console.error('❌ Failed to connect to database:', error.message)
    console.error('Full error:', error)
    process.exit(1)
  }
}

// Test connection on startup
testConnection()

const PORT = process.env.PORT || 5000

// Middleware
app.use(cors())
app.use(express.json())

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' })
})

// Users routes
app.get('/api/users', async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      include: {
        assignedTasks: true,
        createdTasks: true
      }
    })
    res.json(users)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.get('/api/users/:id', async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
      include: {
        assignedTasks: {
          include: {
            tags: true,
            files: true,
            logs: true
          }
        },
        createdTasks: true,
        comments: true
      }
    })
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }
    res.json(user)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.post('/api/users', async (req, res) => {
  try {
    const { email, firstName, lastName, phone, bio, role } = req.body
    const user = await prisma.user.create({
      data: {
        email,
        firstName,
        lastName,
        phone,
        bio,
        role: role || 'user'
      }
    })
    res.status(201).json(user)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

app.put('/api/users/:id', async (req, res) => {
  try {
    const { email, firstName, lastName, phone, bio, role } = req.body
    const user = await prisma.user.update({
      where: { id: req.params.id },
      data: {
        email,
        firstName,
        lastName,
        phone,
        bio,
        role
      }
    })
    res.json(user)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

// Tasks routes
app.get('/api/tasks', async (req, res) => {
  try {
    const { status, assigneeId, priority, category } = req.query
    const where = {}
    
    if (status) where.status = status
    if (assigneeId) where.assigneeId = assigneeId
    if (priority) where.priority = priority
    if (category) where.category = category

    const tasks = await prisma.task.findMany({
      where,
      include: {
        assignee: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        },
        createdBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true
          }
        },
        tags: true,
        files: true,
        logs: {
          orderBy: { createdAt: 'desc' },
          take: 10
        },
        metrics: {
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      },
      orderBy: { createdAt: 'desc' }
    })
    res.json(tasks)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.get('/api/tasks/:id', async (req, res) => {
  try {
    const task = await prisma.task.findUnique({
      where: { id: req.params.id },
      include: {
        assignee: true,
        createdBy: true,
        tags: true,
        files: true,
        logs: {
          orderBy: { createdAt: 'desc' }
        },
        comments: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true
              }
            }
          },
          orderBy: { createdAt: 'desc' }
        },
        dependencies: {
          include: {
            dependencyTask: {
              select: {
                id: true,
                name: true,
                status: true
              }
            }
          }
        },
        dependents: {
          include: {
            dependentTask: {
              select: {
                id: true,
                name: true,
                status: true
              }
            }
          }
        },
        metrics: {
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      }
    })
    if (!task) {
      return res.status(404).json({ error: 'Task not found' })
    }
    res.json(task)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.post('/api/tasks', async (req, res) => {
  try {
    const {
      name,
      description,
      status,
      priority,
      category,
      assigneeId,
      createdById,
      startDate,
      deadline,
      estimatedDuration,
      color,
      executionMode,
      autoRetry,
      retryCount,
      timeout,
      tags
    } = req.body

    const task = await prisma.task.create({
      data: {
        name,
        description,
        status: status || 'pending',
        priority: priority || 'medium',
        category: category || 'data',
        assigneeId,
        createdById: createdById || assigneeId,
        startDate: startDate ? new Date(startDate) : null,
        deadline: deadline ? new Date(deadline) : null,
        estimatedDuration,
        color,
        executionMode,
        autoRetry: autoRetry || false,
        retryCount: retryCount || 0,
        timeout,
        tags: tags ? {
          create: tags.map(tag => ({ tag }))
        } : undefined
      },
      include: {
        assignee: true,
        tags: true
      }
    })
    res.status(201).json(task)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

app.put('/api/tasks/:id', async (req, res) => {
  try {
    const {
      name,
      description,
      status,
      progress,
      priority,
      category,
      assigneeId,
      startDate,
      deadline,
      duration,
      color,
      executionMode,
      autoRetry,
      retryCount,
      timeout
    } = req.body

    const task = await prisma.task.update({
      where: { id: req.params.id },
      data: {
        name,
        description,
        status,
        progress,
        priority,
        category,
        assigneeId,
        startDate: startDate ? new Date(startDate) : undefined,
        deadline: deadline ? new Date(deadline) : undefined,
        duration,
        color,
        executionMode,
        autoRetry,
        retryCount,
        timeout
      },
      include: {
        assignee: true,
        tags: true
      }
    })
    res.json(task)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

app.delete('/api/tasks/:id', async (req, res) => {
  try {
    await prisma.task.delete({
      where: { id: req.params.id }
    })
    res.json({ message: 'Task deleted successfully' })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

// Task Logs
app.post('/api/tasks/:id/logs', async (req, res) => {
  try {
    const { message, type } = req.body
    const log = await prisma.taskLog.create({
      data: {
        taskId: req.params.id,
        message,
        type: type || 'info'
      }
    })
    res.status(201).json(log)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

// Task Metrics
app.post('/api/tasks/:id/metrics', async (req, res) => {
  try {
    const { cpuUsage, memoryUsage, diskIO, networkIO, throughput } = req.body
    const metric = await prisma.taskMetric.create({
      data: {
        taskId: req.params.id,
        cpuUsage,
        memoryUsage,
        diskIO,
        networkIO,
        throughput
      }
    })
    res.status(201).json(metric)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

// Comments
app.get('/api/tasks/:id/comments', async (req, res) => {
  try {
    const comments = await prisma.comment.findMany({
      where: { taskId: req.params.id },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })
    res.json(comments)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.post('/api/tasks/:id/comments', async (req, res) => {
  try {
    const { userId, text } = req.body
    const comment = await prisma.comment.create({
      data: {
        taskId: req.params.id,
        userId,
        text
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    })
    res.status(201).json(comment)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

// Dashboard stats
app.get('/api/dashboard/stats', async (req, res) => {
  try {
    const [total, running, completed, failed, pending] = await Promise.all([
      prisma.task.count(),
      prisma.task.count({ where: { status: 'running' } }),
      prisma.task.count({ where: { status: 'completed' } }),
      prisma.task.count({ where: { status: 'failed' } }),
      prisma.task.count({ where: { status: 'pending' } })
    ])

    res.json({
      total,
      running,
      completed,
      failed,
      pending
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// System Settings
app.get('/api/settings', async (req, res) => {
  try {
    let settings = await prisma.systemSettings.findFirst()
    if (!settings) {
      settings = await prisma.systemSettings.create({
        data: {}
      })
    }
    res.json(settings)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.put('/api/settings', async (req, res) => {
  try {
    let settings = await prisma.systemSettings.findFirst()
    if (settings) {
      settings = await prisma.systemSettings.update({
        where: { id: settings.id },
        data: req.body
      })
    } else {
      settings = await prisma.systemSettings.create({
        data: req.body
      })
    }
    res.json(settings)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
  console.log(`Health check: http://localhost:${PORT}/api/health`)
})

// Graceful shutdown
process.on('beforeExit', async () => {
  console.log('🔄 Disconnecting from database...')
  await prisma.$disconnect()
  await pool.end()
  console.log('✅ Database disconnected')
})

process.on('SIGINT', async () => {
  console.log('\n🔄 Shutting down gracefully...')
  await prisma.$disconnect()
  await pool.end()
  process.exit(0)
})

process.on('SIGTERM', async () => {
  console.log('\n🔄 Shutting down gracefully...')
  await prisma.$disconnect()
  await pool.end()
  process.exit(0)
})
