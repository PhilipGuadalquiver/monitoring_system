import React, { useState, useEffect } from 'react'
import {
  Row,
  Col,
  Card,
  Statistic,
  Progress,
  Table,
  Tag,
  Button,
  Space,
  Timeline,
  Avatar,
  List,
  Badge,
  Alert,
  Divider,
  Typography,
  Empty,
  Spin
} from 'antd'
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  SyncOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  UserOutlined,
  TeamOutlined
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import dayjs from 'dayjs'
import { tasksAPI, dashboardAPI } from '../services/api'

const { Title, Text } = Typography

const Dashboard = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [tasks, setTasks] = useState([])
  const [stats, setStats] = useState({
    total: 0,
    running: 0,
    completed: 0,
    failed: 0,
    pending: 0
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [tasksData, statsData] = await Promise.all([
        tasksAPI.getAll(),
        dashboardAPI.getStats()
      ])
      setTasks(tasksData)
      setStats(statsData)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  // Use stats from API or calculate from tasks
  const displayStats = stats.total > 0 ? stats : {
    total: tasks.length,
    running: tasks.filter(t => t.status === 'running').length,
    completed: tasks.filter(t => t.status === 'completed').length,
    failed: tasks.filter(t => t.status === 'failed').length,
    pending: tasks.filter(t => t.status === 'pending').length
  }

  const getStatusColor = (status) => {
    const colors = {
      running: 'processing',
      completed: 'success',
      pending: 'default',
      failed: 'error'
    }
    return colors[status] || 'default'
  }

  const getStatusIcon = (status) => {
    const icons = {
      running: <SyncOutlined spin />,
      completed: <CheckCircleOutlined />,
      pending: <ClockCircleOutlined />,
      failed: <CloseCircleOutlined />
    }
    return icons[status]
  }

  const getPriorityColor = (priority) => {
    const colors = {
      high: 'red',
      medium: 'orange',
      low: 'green'
    }
    return colors[priority] || 'default'
  }

  // Format task data for display
  const formatTask = (task) => {
    if (!task) return null
    return {
      ...task,
      assignee: task.assignee ? `${task.assignee.firstName} ${task.assignee.lastName}` : 'Unassigned',
      createdAt: task.createdAt ? dayjs(task.createdAt) : dayjs(),
      deadline: task.deadline ? dayjs(task.deadline) : null
    }
  }

  const displayTasks = tasks.map(formatTask).filter(Boolean)

  const columns = [
    {
      title: 'Task Name',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <Button type="link" onClick={() => navigate(`/task/${record.id}`)}>
          {text}
        </Button>
      )
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag icon={getStatusIcon(status)} color={getStatusColor(status)}>
          {status.toUpperCase()}
        </Tag>
      )
    },
    {
      title: 'Progress',
      dataIndex: 'progress',
      key: 'progress',
      render: (progress) => <Progress percent={progress} size="small" />
    },
    {
      title: 'Priority',
      dataIndex: 'priority',
      key: 'priority',
      render: (priority) => (
        <Tag color={getPriorityColor(priority)}>{priority.toUpperCase()}</Tag>
      )
    },
    {
      title: 'Assignee',
      dataIndex: 'assignee',
      key: 'assignee',
      render: (assignee) => (
        <Space>
          <Avatar size="small" icon={<UserOutlined />} />
          {assignee}
        </Space>
      )
    },
    {
      title: 'Created',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => dayjs(date).format('YYYY-MM-DD HH:mm')
    }
  ]

  const recentActivities = [
    { time: '2 hours ago', action: 'Task "Data Processing" started', user: 'System' },
    { time: '3 hours ago', action: 'Task "Database Migration" failed', user: 'Alice Brown' },
    { time: '1 day ago', action: 'Task "System Backup" completed', user: 'Jane Smith' },
    { time: '2 days ago', action: 'New task "Report Generation" created', user: 'Bob Wilson' }
  ]

  return (
    <div>
      <Title level={2}>Dashboard</Title>
      <Divider />
      
      {loading ? (
        <Spin size="large" style={{ display: 'block', textAlign: 'center', padding: '50px' }} />
      ) : (
        <>
          <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Total Tasks"
                  value={displayStats.total}
                  prefix={<TeamOutlined />}
                  valueStyle={{ color: '#1890ff' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Running"
                  value={displayStats.running}
                  prefix={<SyncOutlined />}
                  valueStyle={{ color: '#1890ff' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Completed"
                  value={displayStats.completed}
                  prefix={<CheckCircleOutlined />}
                  valueStyle={{ color: '#3f8600' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Failed"
                  value={displayStats.failed}
                  prefix={<CloseCircleOutlined />}
                  valueStyle={{ color: '#cf1322' }}
                />
              </Card>
            </Col>
          </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          <Card title="Recent Tasks" extra={<Button type="link">View All</Button>}>
            {displayTasks.length > 0 ? (
              <Table
                dataSource={displayTasks}
                columns={columns}
                rowKey="id"
                pagination={{ pageSize: 5 }}
                size="middle"
              />
            ) : (
              <Empty description="No tasks found" />
            )}
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="Recent Activities">
            <Timeline
              items={recentActivities.map((activity, index) => ({
                key: index,
                children: (
                  <div>
                    <Text strong>{activity.action}</Text>
                    <br />
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      {activity.time} by {activity.user}
                    </Text>
                  </div>
                )
              }))}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} lg={12}>
          <Card title="System Status">
            <Space direction="vertical" style={{ width: '100%' }}>
              <div>
                <Text>CPU Usage</Text>
                <Progress percent={45} status="active" />
              </div>
              <div>
                <Text>Memory Usage</Text>
                <Progress percent={68} />
              </div>
              <div>
                <Text>Disk Usage</Text>
                <Progress percent={32} />
              </div>
            </Space>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Quick Actions">
            <Space direction="vertical" style={{ width: '100%' }}>
              <Button type="primary" block onClick={() => navigate('/create')}>
                Create New Task
              </Button>
              <Button block onClick={() => navigate('/monitor')}>
                View All Tasks
              </Button>
              <Button block>Export Report</Button>
            </Space>
          </Card>
        </Col>
      </Row>
        </>
      )}
    </div>
  )
}

export default Dashboard
