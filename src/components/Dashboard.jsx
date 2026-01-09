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

const { Title, Text } = Typography

const Dashboard = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [tasks, setTasks] = useState([
    {
      id: '1',
      name: 'Data Processing Task',
      status: 'running',
      progress: 65,
      priority: 'high',
      assignee: 'John Doe',
      createdAt: dayjs().subtract(2, 'hour'),
      deadline: dayjs().add(5, 'hour')
    },
    {
      id: '2',
      name: 'System Backup',
      status: 'completed',
      progress: 100,
      priority: 'medium',
      assignee: 'Jane Smith',
      createdAt: dayjs().subtract(1, 'day'),
      deadline: dayjs().subtract(1, 'day').add(3, 'hour')
    },
    {
      id: '3',
      name: 'Report Generation',
      status: 'pending',
      progress: 0,
      priority: 'low',
      assignee: 'Bob Wilson',
      createdAt: dayjs().subtract(30, 'minute'),
      deadline: dayjs().add(2, 'day')
    },
    {
      id: '4',
      name: 'Database Migration',
      status: 'failed',
      progress: 45,
      priority: 'high',
      assignee: 'Alice Brown',
      createdAt: dayjs().subtract(3, 'hour'),
      deadline: dayjs().add(1, 'day')
    }
  ])

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

  const stats = {
    total: tasks.length,
    running: tasks.filter(t => t.status === 'running').length,
    completed: tasks.filter(t => t.status === 'completed').length,
    failed: tasks.filter(t => t.status === 'failed').length
  }

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
      
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Tasks"
              value={stats.total}
              prefix={<TeamOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Running"
              value={stats.running}
              prefix={<SyncOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Completed"
              value={stats.completed}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Failed"
              value={stats.failed}
              prefix={<CloseCircleOutlined />}
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          <Card title="Recent Tasks" extra={<Button type="link">View All</Button>}>
            <Table
              dataSource={tasks}
              columns={columns}
              rowKey="id"
              pagination={{ pageSize: 5 }}
              size="middle"
            />
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
    </div>
  )
}

export default Dashboard
