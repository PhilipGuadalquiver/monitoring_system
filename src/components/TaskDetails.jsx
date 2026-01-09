import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Card,
  Row,
  Col,
  Typography,
  Descriptions,
  Tag,
  Progress,
  Button,
  Space,
  Timeline,
  Tabs,
  Table,
  Statistic,
  Alert,
  Divider,
  Badge,
  Avatar,
  List,
  Empty,
  Spin,
  Tooltip,
  Modal,
  Form,
  Input,
  message,
  Steps,
  Collapse,
  Tree,
  Anchor,
  BackTop,
  Result,
  Skeleton
} from 'antd'
import {
  ArrowLeftOutlined,
  EditOutlined,
  PlayCircleOutlined,
  PauseCircleOutlined,
  StopOutlined,
  ReloadOutlined,
  DownloadOutlined,
  ShareAltOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  SyncOutlined,
  UserOutlined,
  CalendarOutlined,
  FlagOutlined,
  FileTextOutlined,
  BarChartOutlined,
  SettingOutlined,
  InfoCircleOutlined
} from '@ant-design/icons'
import dayjs from 'dayjs'
import { tasksAPI, usersAPI } from '../services/api'

const { Title, Text, Paragraph } = Typography
const { Panel } = Collapse
const { TextArea } = Input

const TaskDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [task, setTask] = useState(null)
  const [activeTab, setActiveTab] = useState('overview')
  const [commentModalVisible, setCommentModalVisible] = useState(false)
  const [users, setUsers] = useState([])
  const [form] = Form.useForm()

  useEffect(() => {
    fetchTask()
    fetchUsers()
  }, [id])

  const fetchTask = async () => {
    setLoading(true)
    try {
      const taskData = await tasksAPI.getById(id)
      setTask(taskData)
    } catch (error) {
      console.error('Error fetching task:', error)
      message.error('Failed to load task')
    } finally {
      setLoading(false)
    }
  }

  const fetchUsers = async () => {
    try {
      const usersData = await usersAPI.getAll()
      setUsers(usersData)
    } catch (error) {
      console.error('Error fetching users:', error)
    }
  }

  const handleAddComment = async (values) => {
    try {
      // Get current user ID (in real app, get from auth context)
      const currentUserId = users[0]?.id
      if (!currentUserId) {
        message.error('User not found')
        return
      }
      
      await tasksAPI.addComment(id, currentUserId, values.comment)
      message.success('Comment added successfully')
      form.resetFields()
      setCommentModalVisible(false)
      fetchTask() // Refresh task data
    } catch (error) {
      message.error('Failed to add comment')
    }
  }

  // Format task data for display
  const formatTask = (taskData) => {
    if (!taskData) return null
    
    // Determine steps based on status and progress
    const steps = [
      { title: 'Initialization', status: 'finish', description: 'Task setup completed' },
      { title: 'Data Collection', status: taskData.progress > 10 ? 'finish' : 'wait', description: 'All sources connected' },
      { title: 'Data Processing', status: taskData.status === 'running' ? 'process' : taskData.progress > 50 ? 'finish' : 'wait', description: 'Currently processing' },
      { title: 'Data Validation', status: taskData.progress > 75 ? 'process' : 'wait', description: 'Pending' },
      { title: 'Report Generation', status: taskData.progress > 90 ? 'process' : 'wait', description: 'Pending' },
      { title: 'Completion', status: taskData.status === 'completed' ? 'finish' : 'wait', description: 'Pending' }
    ]

    return {
      ...taskData,
      assignee: taskData.assignee ? `${taskData.assignee.firstName} ${taskData.assignee.lastName}` : 'Unassigned',
      createdAt: taskData.createdAt ? dayjs(taskData.createdAt) : dayjs(),
      deadline: taskData.deadline ? dayjs(taskData.deadline) : null,
      estimatedDuration: taskData.estimatedDuration ? `${taskData.estimatedDuration} hours` : 'N/A',
      steps,
      metrics: taskData.metrics && taskData.metrics.length > 0 ? taskData.metrics[0] : {
        cpuUsage: 0,
        memoryUsage: 0,
        diskIO: 0,
        networkIO: 0,
        throughput: 0
      },
      dependencies: taskData.dependencies || [],
      comments: taskData.comments || []
    }
  }

  const displayTask = formatTask(task)

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
      low: 'green',
      critical: 'purple'
    }
    return colors[priority] || 'default'
  }

  const getLogIcon = (type) => {
    const icons = {
      info: <InfoCircleOutlined style={{ color: '#1890ff' }} />,
      success: <CheckCircleOutlined style={{ color: '#52c41a' }} />,
      warning: <ClockCircleOutlined style={{ color: '#faad14' }} />,
      error: <CloseCircleOutlined style={{ color: '#ff4d4f' }} />
    }
    return icons[type] || icons.info
  }

  const metricColumns = [
    {
      title: 'Metric',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: 'Value',
      dataIndex: 'value',
      key: 'value',
      render: (value, record) => {
        if (record.unit === '%') {
          return <Progress percent={value} size="small" />
        }
        return `${value} ${record.unit || ''}`
      }
    }
  ]

  const fileColumns = [
    {
      title: 'File Name',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <Text copyable>{text}</Text>
    },
    {
      title: 'Size',
      dataIndex: 'size',
      key: 'size'
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type) => <Tag>{type}</Tag>
    },
    {
      title: 'Uploaded',
      dataIndex: 'uploaded',
      key: 'uploaded',
      render: (date) => dayjs(date).format('YYYY-MM-DD HH:mm')
    },
    {
      title: 'Actions',
      key: 'actions',
      render: () => (
        <Button type="link" icon={<DownloadOutlined />}>Download</Button>
      )
    }
  ]

  if (loading) {
    return (
      <Card>
        <Skeleton active paragraph={{ rows: 8 }} />
      </Card>
    )
  }

  if (!displayTask) {
    return (
      <Result
        status="404"
        title="Task Not Found"
        subTitle="The task you are looking for does not exist."
        extra={
          <Button type="primary" onClick={() => navigate('/monitor')}>
            Back to Monitor
          </Button>
        }
      />
    )
  }

  const metricData = displayTask ? [
    { key: '1', name: 'CPU Usage', value: displayTask.metrics.cpuUsage, unit: '%' },
    { key: '2', name: 'Memory Usage', value: displayTask.metrics.memoryUsage, unit: '%' },
    { key: '3', name: 'Disk I/O', value: displayTask.metrics.diskIO, unit: 'MB/s' },
    { key: '4', name: 'Network I/O', value: displayTask.metrics.networkIO, unit: 'MB/s' },
    { key: '5', name: 'Throughput', value: displayTask.metrics.throughput, unit: 'records/sec' }
  ] : []

  return (
    <div>
      <Card style={{ marginBottom: 16 }}>
        <Row justify="space-between" align="middle">
          <Col>
            <Space>
              <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/monitor')}>
                Back
              </Button>
              <Divider type="vertical" />
              <Title level={3} style={{ margin: 0 }}>{displayTask.name}</Title>
            </Space>
          </Col>
          <Col>
            <Space>
              {displayTask.status === 'running' && (
                <Button icon={<PauseCircleOutlined />}>Pause</Button>
              )}
              {displayTask.status === 'pending' && (
                <Button type="primary" icon={<PlayCircleOutlined />}>Start</Button>
              )}
              <Button icon={<ReloadOutlined />}>Refresh</Button>
              <Button icon={<EditOutlined />}>Edit</Button>
              <Button icon={<ShareAltOutlined />}>Share</Button>
            </Space>
          </Col>
        </Row>
      </Card>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={18}>
          <Card>
            <Tabs
              activeKey={activeTab}
              onChange={setActiveTab}
              items={[
                {
                  key: 'overview',
                  label: 'Overview',
                  children: (
                    <>
                      <Descriptions column={2} bordered>
                        <Descriptions.Item label="Status" span={2}>
                          <Tag icon={getStatusIcon(displayTask.status || 'pending')} color={getStatusColor(displayTask.status || 'pending')} size="large">
                            {(displayTask.status || 'pending').toString().toUpperCase()}
                          </Tag>
                        </Descriptions.Item>
                        <Descriptions.Item label="Progress">
                          <Progress percent={displayTask.progress} status={displayTask.status === 'failed' ? 'exception' : 'active'} />
                        </Descriptions.Item>
                        <Descriptions.Item label="Priority">
                          <Tag color={getPriorityColor(displayTask.priority || 'medium')} icon={<FlagOutlined />}>
                            {(displayTask.priority || 'medium').toString().toUpperCase()}
                          </Tag>
                        </Descriptions.Item>
                        <Descriptions.Item label="Category">
                          <Tag>{displayTask.category}</Tag>
                        </Descriptions.Item>
                        <Descriptions.Item label="Assignee">
                          <Space>
                            <Avatar icon={<UserOutlined />} />
                            {displayTask.assignee}
                          </Space>
                        </Descriptions.Item>
                        <Descriptions.Item label="Created" span={2}>
                          <Space>
                            <CalendarOutlined />
                            {displayTask.createdAt.format('YYYY-MM-DD HH:mm:ss')}
                          </Space>
                        </Descriptions.Item>
                        <Descriptions.Item label="Deadline" span={2}>
                          <Space>
                            <CalendarOutlined />
                            {displayTask.deadline ? displayTask.deadline.format('YYYY-MM-DD HH:mm:ss') : 'N/A'}
                          </Space>
                        </Descriptions.Item>
                        <Descriptions.Item label="Duration">{displayTask.duration || 'N/A'}</Descriptions.Item>
                        <Descriptions.Item label="Estimated Duration">{displayTask.estimatedDuration}</Descriptions.Item>
                        <Descriptions.Item label="Description" span={2}>
                          <Paragraph>{displayTask.description || 'No description'}</Paragraph>
                        </Descriptions.Item>
                      </Descriptions>

                      <Divider>Process Steps</Divider>
                      <Steps
                        current={displayTask.steps.findIndex(s => s.status === 'process')}
                        items={displayTask.steps}
                      />
                    </>
                  )
                },
                {
                  key: 'monitor',
                  label: 'Process Monitor',
                  children: (
                    <Row gutter={[16, 16]}>
                      <Col span={24}>
                        <Card title="Real-time Metrics">
                          <Table
                            dataSource={metricData}
                            columns={metricColumns}
                            pagination={false}
                            size="small"
                          />
                        </Card>
                      </Col>
                      <Col span={24}>
                        <Card title="Activity Timeline">
                          <Timeline
                            items={(displayTask.logs || []).map((log, index) => ({
                              key: index,
                              dot: getLogIcon(log.type),
                              children: (
                                <div>
                                  <Text strong>{log.message}</Text>
                                  <br />
                                  <Text type="secondary" style={{ fontSize: 12 }}>
                                    {dayjs(log.time).format('YYYY-MM-DD HH:mm:ss')}
                                  </Text>
                                </div>
                              )
                            }))}
                          />
                        </Card>
                      </Col>
                    </Row>
                  )
                },
                {
                  key: 'files',
                  label: 'Files',
                  children: (
                    <Table
                      dataSource={displayTask.files || []}
                      columns={fileColumns}
                      rowKey="name"
                      pagination={false}
                    />
                  )
                },
                {
                  key: 'dependencies',
                  label: 'Dependencies',
                  children: (
                    <List
                      dataSource={displayTask.dependencies || []}
                      renderItem={item => (
                        <List.Item
                          actions={[
                            <Button type="link" onClick={() => navigate(`/task/${item.dependencyTask?.id || item.id}`)}>
                              View
                            </Button>
                          ]}
                        >
                          <List.Item.Meta
                            title={item.dependencyTask?.name || item.name}
                            description={
                              <Tag color={getStatusColor(item.dependencyTask?.status || item.status)}>
                                {item.dependencyTask?.status || item.status}
                              </Tag>
                            }
                          />
                        </List.Item>
                      )}
                    />
                  )
                },
                {
                  key: 'comments',
                  label: 'Comments',
                  children: (
                    <>
                      <List
                        dataSource={displayTask.comments || []}
                        renderItem={item => (
                          <List.Item>
                            <List.Item.Meta
                              avatar={<Avatar icon={<UserOutlined />} />}
                              title={item.user ? `${item.user.firstName} ${item.user.lastName}` : 'Unknown User'}
                              description={
                                <div>
                                  <Paragraph>{item.text}</Paragraph>
                                  <Text type="secondary" style={{ fontSize: 12 }}>
                                    {dayjs(item.createdAt).format('YYYY-MM-DD HH:mm')}
                                  </Text>
                                </div>
                              }
                            />
                          </List.Item>
                        )}
                      />
                      <Divider />
                      <Button type="primary" onClick={() => setCommentModalVisible(true)}>
                        Add Comment
                      </Button>
                    </>
                  )
                }
              ]}
            />
          </Card>
        </Col>

        <Col xs={24} lg={6}>
          <Space direction="vertical" style={{ width: '100%' }} size="large">
            <Card title="Quick Stats">
              <Statistic
                title="Progress"
                value={displayTask.progress}
                suffix="%"
                valueStyle={{ color: '#1890ff' }}
              />
              <Divider />
              <Statistic
                title="Time Remaining"
                value={displayTask.deadline ? displayTask.deadline.diff(dayjs(), 'hour') : 0}
                suffix="hours"
                valueStyle={{ color: '#3f8600' }}
              />
            </Card>

            <Card title="Actions">
              <Space direction="vertical" style={{ width: '100%' }}>
                {displayTask.status === 'running' && (
                  <>
                    <Button block icon={<PauseCircleOutlined />}>Pause Task</Button>
                    <Button block danger icon={<StopOutlined />}>Stop Task</Button>
                  </>
                )}
                {displayTask.status === 'pending' && (
                  <Button block type="primary" icon={<PlayCircleOutlined />}>Start Task</Button>
                )}
                <Button block icon={<ReloadOutlined />}>Restart Task</Button>
                <Button block icon={<DownloadOutlined />}>Export Logs</Button>
                <Button block icon={<SettingOutlined />}>Settings</Button>
              </Space>
            </Card>

            <Card title="Related Tasks">
              <List
                size="small"
                dataSource={displayTask.dependencies || []}
                renderItem={item => (
                  <List.Item>
                    <Button type="link" onClick={() => navigate(`/task/${item.dependencyTask?.id || item.id}`)}>
                      {item.dependencyTask?.name || item.name}
                    </Button>
                  </List.Item>
                )}
              />
            </Card>
          </Space>
        </Col>
      </Row>

      <Modal
        title="Add Comment"
        open={commentModalVisible}
        onOk={() => {
          form.validateFields().then(handleAddComment)
        }}
        onCancel={() => {
          form.resetFields()
          setCommentModalVisible(false)
        }}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="comment"
            rules={[{ required: true, message: 'Please enter a comment' }]}
          >
            <TextArea rows={4} placeholder="Enter your comment..." />
          </Form.Item>
        </Form>
      </Modal>

      <BackTop />
    </div>
  )
}

export default TaskDetails
