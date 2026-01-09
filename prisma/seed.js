import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

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

  console.log('✅ Created 3 users:')
  console.log(`  1. ${user1.firstName} ${user1.lastName} (${user1.email}) - ${user1.role}`)
  console.log(`  2. ${user2.firstName} ${user2.lastName} (${user2.email}) - ${user2.role}`)
  console.log(`  3. ${user3.firstName} ${user3.lastName} (${user3.email}) - ${user3.role}`)

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
      startDate: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      deadline: new Date(Date.now() + 5 * 60 * 60 * 1000), // 5 hours from now
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
      startDate: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      deadline: new Date(Date.now() - 21 * 60 * 60 * 1000), // 21 hours ago
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
      startDate: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
      deadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
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

  console.log('Created tasks:', { task1, task2, task3 })

  // Create system settings
  const settings = await prisma.systemSettings.upsert({
    where: { id: 'default' },
    update: {},
    create: {
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

  console.log('Created system settings:', settings)
  console.log('Seeding completed!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
