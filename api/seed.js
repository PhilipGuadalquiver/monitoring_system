// Vercel Serverless Function for Database Seeding
// Access this endpoint to seed your production database
// IMPORTANT: Add authentication/authorization before using in production!

import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

const connectionString = process.env.DATABASE_URL

if (!connectionString) {
  console.error('❌ ERROR: DATABASE_URL environment variable is not set!')
  throw new Error('DATABASE_URL environment variable is not set')
}

console.log('🔄 Connecting to database for seeding...')
console.log(`📊 Database URL: ${connectionString.replace(/:[^:@]+@/, ':****@')}`) // Hide password in logs

const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

// Test connection before seeding
async function testConnection() {
  try {
    await prisma.$connect()
    console.log('✅ Database connected successfully!')
    
    // Test query
    const userCount = await prisma.user.count()
    console.log(`📈 Current users in database: ${userCount}`)
    return true
  } catch (error) {
    console.error('❌ Failed to connect to database:', error.message)
    throw error
  }
}

async function seed() {
  // Test connection first
  await testConnection()
  
  console.log('🌱 Starting database seeding...')

  // Clear existing data (optional - comment out if you want to keep existing data)
  console.log('Clearing existing data...')
  await prisma.taskDependency.deleteMany()
  await prisma.taskMetric.deleteMany()
  await prisma.taskLog.deleteMany()
  await prisma.taskFile.deleteMany()
  await prisma.taskTag.deleteMany()
  await prisma.comment.deleteMany()
  await prisma.task.deleteMany()
  await prisma.userPermission.deleteMany()
  await prisma.apiKey.deleteMany()
  await prisma.session.deleteMany()
  await prisma.user.deleteMany()
  await prisma.systemSettings.deleteMany()
  await prisma.notification.deleteMany()

  console.log('Creating sample users...')

  // Create 3 sample users
  const user1 = await prisma.user.create({
    data: {
      email: 'john.doe@example.com',
      firstName: 'John',
      lastName: 'Doe',
      phone: '+1 234 567 8900',
      bio: 'Senior System Administrator with 10+ years of experience in infrastructure management and task monitoring systems.',
      role: 'admin',
      avatar: null
    }
  })

  const user2 = await prisma.user.create({
    data: {
      email: 'jane.smith@example.com',
      firstName: 'Jane',
      lastName: 'Smith',
      phone: '+1 234 567 8901',
      bio: 'Full-stack Developer specializing in React and Node.js. Passionate about building scalable applications.',
      role: 'user',
      avatar: null
    }
  })

  const user3 = await prisma.user.create({
    data: {
      email: 'bob.wilson@example.com',
      firstName: 'Bob',
      lastName: 'Wilson',
      phone: '+1 234 567 8902',
      bio: 'Data Analyst and Business Intelligence Specialist. Expert in data processing and report generation.',
      role: 'user',
      avatar: null
    }
  })

  console.log('✅ Created 3 users')

  // Create tasks
  const task1 = await prisma.task.create({
    data: {
      name: 'Data Processing Task',
      description: 'Process large amounts of data from multiple sources',
      status: 'running',
      progress: 65,
      priority: 'high',
      category: 'data',
      assigneeId: user1.id,
      createdById: user1.id,
      startDate: new Date(Date.now() - 2 * 60 * 60 * 1000),
      deadline: new Date(Date.now() + 5 * 60 * 60 * 1000),
      estimatedDuration: 6,
      tags: {
        create: [
          { tag: 'data-processing' },
          { tag: 'urgent' }
        ]
      },
      logs: {
        create: [
          { message: 'Task initialized', type: 'info' },
          { message: 'Data source connected', type: 'success' },
          { message: 'Processing started', type: 'info' },
          { message: '65% complete', type: 'info' }
        ]
      },
      metrics: {
        create: {
          cpuUsage: 45,
          memoryUsage: 68,
          diskIO: 120,
          networkIO: 85,
          throughput: 1250
        }
      }
    }
  })

  const task2 = await prisma.task.create({
    data: {
      name: 'System Backup',
      description: 'Backup system files and databases',
      status: 'completed',
      progress: 100,
      priority: 'medium',
      category: 'backup',
      assigneeId: user2.id,
      createdById: user1.id,
      startDate: new Date(Date.now() - 24 * 60 * 60 * 1000),
      deadline: new Date(Date.now() - 21 * 60 * 60 * 1000),
      estimatedDuration: 3,
      duration: '2h 15m',
      tags: {
        create: [
          { tag: 'backup' },
          { tag: 'system' }
        ]
      },
      logs: {
        create: [
          { message: 'Backup initiated', type: 'info' },
          { message: 'Files copied', type: 'success' },
          { message: 'Verification complete', type: 'success' },
          { message: 'Backup successful', type: 'success' }
        ]
      }
    }
  })

  const task3 = await prisma.task.create({
    data: {
      name: 'Report Generation',
      description: 'Generate monthly reports',
      status: 'pending',
      progress: 0,
      priority: 'low',
      category: 'report',
      assigneeId: user3.id,
      createdById: user2.id,
      startDate: new Date(Date.now() - 30 * 60 * 1000),
      deadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      estimatedDuration: 4,
      tags: {
        create: [
          { tag: 'report' },
          { tag: 'monthly' }
        ]
      },
      logs: {
        create: [
          { message: 'Task queued', type: 'info' }
        ]
      }
    }
  })

  console.log('✅ Created 3 tasks')

  // Create system settings
  await prisma.systemSettings.create({
    data: {
      appName: 'Monitoring System',
      language: 'en',
      timezone: 'UTC',
      dateFormat: 'YYYY-MM-DD',
      timeFormat: '24h',
      theme: 'light',
      primaryColor: '#1890ff',
      autoSave: true,
      refreshInterval: 30
    }
  })

  console.log('✅ Created system settings')
  
  return {
    success: true,
    message: 'Database seeded successfully',
    users: 3,
    tasks: 3
  }
}

// Vercel serverless function handler
export default async function handler(req, res) {
  // Security: Add authentication check here
  // Example: Check for a secret token
  const secretToken = req.headers['x-seed-token'] || req.query.token
  
  // IMPORTANT: Set SEED_SECRET in Vercel environment variables
  if (process.env.SEED_SECRET && secretToken !== process.env.SEED_SECRET) {
    return res.status(401).json({ 
      error: 'Unauthorized. Provide valid seed token in x-seed-token header or ?token= query parameter.' 
    })
  }

  // Only allow POST requests
  if (req.method !== 'POST' && req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed. Use POST or GET.' })
  }

  try {
    const result = await seed()
    
    console.log('✅ Seeding completed successfully')
    console.log('🔄 Disconnecting from database...')
    
    await prisma.$disconnect()
    await pool.end()
    
    console.log('✅ Database disconnected')
    
    return res.status(200).json(result)
  } catch (error) {
    console.error('❌ Seeding error:', error.message)
    console.error('Full error:', error)
    
    try {
      await prisma.$disconnect()
      await pool.end()
    } catch (disconnectError) {
      console.error('Error disconnecting:', disconnectError.message)
    }
    
    return res.status(500).json({ 
      error: 'Seeding failed', 
      message: error.message 
    })
  }
}
