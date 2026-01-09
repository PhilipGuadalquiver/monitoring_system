// Vercel Serverless Function for API
// This allows you to deploy the backend as serverless functions on Vercel
import express from 'express'
import cors from 'cors'
import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

const app = express()

// Prisma 7 requires an adapter for PostgreSQL
const connectionString = process.env.DATABASE_URL

if (!connectionString) {
  console.error('❌ ERROR: DATABASE_URL environment variable is not set!')
} else {
  console.log('🔄 Initializing database connection...')
  console.log(`📊 Database URL: ${connectionString.replace(/:[^:@]+@/, ':****@')}`) // Hide password in logs
}

const pool = connectionString ? new Pool({ connectionString }) : null
const adapter = pool ? new PrismaPg(pool) : null
const prisma = connectionString ? new PrismaClient({ adapter }) : null

// Test database connection on module load (for serverless functions)
if (prisma) {
  prisma.$connect()
    .then(() => {
      console.log('✅ Database connected successfully!')
      // Test query
      return prisma.user.count()
    })
    .then((count) => {
      console.log(`📈 Database is ready. Current users: ${count}`)
    })
    .catch((error) => {
      console.error('❌ Failed to connect to database:', error.message)
    })
}

// Middleware
app.use(cors())
app.use(express.json())

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' })
})

// Import routes from server/index.js
// For now, we'll include the essential routes here
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

    // Validate required fields
    if (!name || name.trim() === '') {
      return res.status(400).json({ error: 'Task name is required' })
    }

    if (!assigneeId) {
      return res.status(400).json({ error: 'Assignee is required' })
    }

    if (!createdById) {
      return res.status(400).json({ error: 'Created by user ID is required' })
    }

    const task = await prisma.task.create({
      data: {
        name: name.trim(),
        description: description?.trim() || null,
        status: status || 'pending',
        priority: priority || 'medium',
        category: category || 'data',
        assigneeId,
        createdById: createdById || assigneeId,
        startDate: startDate ? new Date(startDate) : null,
        deadline: deadline ? new Date(deadline) : null,
        estimatedDuration: estimatedDuration || null,
        color: color || null,
        executionMode: executionMode || null,
        autoRetry: autoRetry || false,
        retryCount: retryCount || 0,
        timeout: timeout || null,
        tags: tags && tags.length > 0 ? {
          create: tags.map(tag => ({ 
            tag: typeof tag === 'string' ? tag.trim() : (tag.tag || tag).toString().trim()
          })).filter(t => t.tag)
        } : undefined
      },
      include: {
        assignee: true,
        tags: true
      }
    })
    res.status(201).json(task)
  } catch (error) {
    console.error('Error creating task:', error)
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

// Export for Vercel
export default app

// Graceful cleanup for serverless functions
if (prisma) {
  process.on('beforeExit', async () => {
    console.log('🔄 Disconnecting from database...')
    await prisma.$disconnect().catch(() => {})
    if (pool) await pool.end().catch(() => {})
  })
}
