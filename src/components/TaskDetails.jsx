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
  const [form] = Form.useForm()

  useEffect(() => {
    // Simulate loading task data
    setTimeout(() => {
      setTask({
        id: id,
        name: 'Data Processing Task',
        description: 'This task involves processing large amounts of data from multiple sources, cleaning and transforming it, and generating comprehensive reports.',
        status: 'running',
        progress: 65,
        priority: 'high',
        category: 'data',
        assignee: 'John Doe',
        createdAt: dayjs().subtract(2, 'hour'),
        deadline: dayjs().add(5, 'hour'),
        duration: '3h 45m',
        estimatedDuration: '6 hours',
        logs: [
          { time: dayjs().subtract(2, 'hour'), message: 'Task initialized', type: 'info' },
          { time: dayjs().subtract(1, 'hour', 50, 'minute'), message: 'Data source connected', type: 'success' },
          { time: dayjs().subtract(1, 'hour', 30, 'minute'), message: 'Processing started', type: 'info' },
          { time: dayjs().subtract(45, 'minute'), message: '25% complete', type: 'info' },
          { time: dayjs().subtract(30, 'minute'), message: '50% complete', type: 'info' },
          { time: dayjs().subtract(15, 'minute'), message: '65% complete', type: 'info' },
          { time: dayjs().subtract(5, 'minute'), message: 'Processing batch 3 of 5', type: 'info' }
        ],
        metrics: {
          cpuUsage: 45,
          memoryUsage: 68,
          diskIO: 120,
          networkIO: 85,
          throughput: 1250
        },
        steps: [
          { title: 'Initialization', status: 'finish', description: 'Task setup completed' },
          { title: 'Data Collection', status: 'finish', description: 'All sources connected' },
          { title: 'Data Processing', status: 'process', description: 'Currently processing' },
          { title: 'Data Validation', status: 'wait', description: 'Pending' },
          { title: 'Report Generation', status: 'wait', description: 'Pending' },
          { title: 'Completion', status: 'wait', description: 'Pending' }
        ],
        files: [
          { name: 'input_data.csv', size: '2.5 MB', type: 'input', uploaded: dayjs().subtract(2, 'hour') },
          { name: 'config.json', size: '15 KB', type: 'config', uploaded: dayjs().subtract(2, 'hour') },
          { name: 'output_report.pdf', size: '1.2 MB', type: 'output', uploaded: dayjs().subtract(30, 'minute') }
        ],
        comments: [
          { user: 'John Doe', time: dayjs().subtract(1, 'hour'), text: 'Processing is going smoothly' },
          { user: 'Jane Smith', time: dayjs().subtract(45, 'minute'), text: 'Great progress!' }
        ],
        dependencies: [
          { id: '2', name: 'System Backup', status: 'completed' },
          { id: '5', name: 'Security Scan', status: 'running' }
        ]
      })
      setLoading(false)
    }, 1000)
  }, [id])

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

  if (!task) {
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

  const metricData = [
    { key: '1', name: 'CPU Usage', value: task.metrics.cpuUsage, unit: '%' },
    { key: '2', name: 'Memory Usage', value: task.metrics.memoryUsage, unit: '%' },
    { key: '3', name: 'Disk I/O', value: task.metrics.diskIO, unit: 'MB/s' },
    { key: '4', name: 'Network I/O', value: task.metrics.networkIO, unit: 'MB/s' },
    { key: '5', name: 'Throughput', value: task.metrics.throughput, unit: 'records/sec' }
  ]

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
              <Title level={3} style={{ margin: 0 }}>{task.name}</Title>
            </Space>
          </Col>
          <Col>
            <Space>
              {task.status === 'running' && (
                <Button icon={<PauseCircleOutlined />}>Pause</Button>
              )}
              {task.status === 'pending' && (
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
                          <Tag icon={getStatusIcon(task.status)} color={getStatusColor(task.status)} size="large">
                            {task.status.toUpperCase()}
                          </Tag>
                        </Descriptions.Item>
                        <Descriptions.Item label="Progress">
                          <Progress percent={task.progress} status={task.status === 'failed' ? 'exception' : 'active'} />
                        </Descriptions.Item>
                        <Descriptions.Item label="Priority">
                          <Tag color={getPriorityColor(task.priority)} icon={<FlagOutlined />}>
                            {task.priority.toUpperCase()}
                          </Tag>
                        </Descriptions.Item>
                        <Descriptions.Item label="Category">
                          <Tag>{task.category}</Tag>
                        </Descriptions.Item>
                        <Descriptions.Item label="Assignee">
                          <Space>
                            <Avatar icon={<UserOutlined />} />
                            {task.assignee}
                          </Space>
                        </Descriptions.Item>
                        <Descriptions.Item label="Created" span={2}>
                          <Space>
                            <CalendarOutlined />
                            {dayjs(task.createdAt).format('YYYY-MM-DD HH:mm:ss')}
                          </Space>
                        </Descriptions.Item>
                        <Descriptions.Item label="Deadline" span={2}>
                          <Space>
                            <CalendarOutlined />
                            {dayjs(task.deadline).format('YYYY-MM-DD HH:mm:ss')}
                          </Space>
                        </Descriptions.Item>
                        <Descriptions.Item label="Duration">{task.duration}</Descriptions.Item>
                        <Descriptions.Item label="Estimated Duration">{task.estimatedDuration}</Descriptions.Item>
                        <Descriptions.Item label="Description" span={2}>
                          <Paragraph>{task.description}</Paragraph>
                        </Descriptions.Item>
                      </Descriptions>

                      <Divider>Process Steps</Divider>
                      <Steps
                        current={task.steps.findIndex(s => s.status === 'process')}
                        items={task.steps}
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
                            items={task.logs.map((log, index) => ({
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
                      dataSource={task.files}
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
                      dataSource={task.dependencies}
                      renderItem={item => (
                        <List.Item
                          actions={[
                            <Button type="link" onClick={() => navigate(`/task/${item.id}`)}>
                              View
                            </Button>
                          ]}
                        >
                          <List.Item.Meta
                            title={item.name}
                            description={
                              <Tag color={getStatusColor(item.status)}>
                                {item.status}
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
                        dataSource={task.comments}
                        renderItem={item => (
                          <List.Item>
                            <List.Item.Meta
                              avatar={<Avatar icon={<UserOutlined />} />}
                              title={item.user}
                              description={
                                <div>
                                  <Paragraph>{item.text}</Paragraph>
                                  <Text type="secondary" style={{ fontSize: 12 }}>
                                    {dayjs(item.time).format('YYYY-MM-DD HH:mm')}
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
                value={task.progress}
                suffix="%"
                valueStyle={{ color: '#1890ff' }}
              />
              <Divider />
              <Statistic
                title="Time Remaining"
                value={dayjs(task.deadline).diff(dayjs(), 'hour')}
                suffix="hours"
                valueStyle={{ color: '#3f8600' }}
              />
            </Card>

            <Card title="Actions">
              <Space direction="vertical" style={{ width: '100%' }}>
                {task.status === 'running' && (
                  <>
                    <Button block icon={<PauseCircleOutlined />}>Pause Task</Button>
                    <Button block danger icon={<StopOutlined />}>Stop Task</Button>
                  </>
                )}
                {task.status === 'pending' && (
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
                dataSource={task.dependencies}
                renderItem={item => (
                  <List.Item>
                    <Button type="link" onClick={() => navigate(`/task/${item.id}`)}>
                      {item.name}
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
          form.validateFields().then(() => {
            message.success('Comment added')
            form.resetFields()
            setCommentModalVisible(false)
          })
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
