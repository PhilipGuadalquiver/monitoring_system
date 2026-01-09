import React, { useState, useEffect } from 'react'
import {
  Table,
  Tag,
  Button,
  Space,
  Input,
  Select,
  DatePicker,
  Card,
  Row,
  Col,
  Statistic,
  Progress,
  Typography,
  Divider,
  Drawer,
  Descriptions,
  Badge,
  Tooltip,
  Popconfirm,
  Modal,
  Tabs,
  Timeline,
  Empty,
  Spin,
  Alert,
  Pagination,
  Transfer,
  Tree,
  Anchor,
  BackTop,
  Affix
} from 'antd'
import {
  SearchOutlined,
  FilterOutlined,
  ReloadOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  PlayCircleOutlined,
  PauseCircleOutlined,
  StopOutlined,
  DownloadOutlined,
  ExportOutlined,
  SettingOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  SyncOutlined,
  InfoCircleOutlined
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import dayjs from 'dayjs'

const { Title, Text } = Typography
const { Search } = Input
const { Option } = Select
const { RangePicker } = DatePicker

const TaskMonitor = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [drawerVisible, setDrawerVisible] = useState(false)
  const [selectedTask, setSelectedTask] = useState(null)
  const [filterStatus, setFilterStatus] = useState('all')
  const [searchText, setSearchText] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const [tasks, setTasks] = useState([
    {
      id: '1',
      name: 'Data Processing Task',
      status: 'running',
      progress: 65,
      priority: 'high',
      category: 'data',
      assignee: 'John Doe',
      createdAt: dayjs().subtract(2, 'hour'),
      deadline: dayjs().add(5, 'hour'),
      duration: '3h 45m',
      logs: ['Task started', 'Processing data...', '65% complete']
    },
    {
      id: '2',
      name: 'System Backup',
      status: 'completed',
      progress: 100,
      priority: 'medium',
      category: 'backup',
      assignee: 'Jane Smith',
      createdAt: dayjs().subtract(1, 'day'),
      deadline: dayjs().subtract(1, 'day').add(3, 'hour'),
      duration: '2h 15m',
      logs: ['Backup initiated', 'Files copied', 'Verification complete', 'Backup successful']
    },
    {
      id: '3',
      name: 'Report Generation',
      status: 'pending',
      progress: 0,
      priority: 'low',
      category: 'report',
      assignee: 'Bob Wilson',
      createdAt: dayjs().subtract(30, 'minute'),
      deadline: dayjs().add(2, 'day'),
      duration: '-',
      logs: ['Task queued']
    },
    {
      id: '4',
      name: 'Database Migration',
      status: 'failed',
      progress: 45,
      priority: 'high',
      category: 'migration',
      assignee: 'Alice Brown',
      createdAt: dayjs().subtract(3, 'hour'),
      deadline: dayjs().add(1, 'day'),
      duration: '1h 20m',
      logs: ['Migration started', 'Schema updated', 'Data transfer failed', 'Rollback initiated']
    },
    {
      id: '5',
      name: 'Security Scan',
      status: 'running',
      progress: 30,
      priority: 'critical',
      category: 'system',
      assignee: 'Charlie Davis',
      createdAt: dayjs().subtract(1, 'hour'),
      deadline: dayjs().add(4, 'hour'),
      duration: '1h 30m',
      logs: ['Scan initiated', 'Scanning files...', '30% complete']
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
      low: 'green',
      critical: 'purple'
    }
    return colors[priority] || 'default'
  }

  const filteredTasks = tasks.filter(task => {
    const matchesStatus = filterStatus === 'all' || task.status === filterStatus
    const matchesSearch = task.name.toLowerCase().includes(searchText.toLowerCase()) ||
                         task.assignee.toLowerCase().includes(searchText.toLowerCase())
    return matchesStatus && matchesSearch
  })

  const columns = [
    {
      title: 'Task Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
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
      filters: [
        { text: 'Running', value: 'running' },
        { text: 'Completed', value: 'completed' },
        { text: 'Pending', value: 'pending' },
        { text: 'Failed', value: 'failed' }
      ],
      onFilter: (value, record) => record.status === value,
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
      sorter: (a, b) => a.progress - b.progress,
      render: (progress, record) => (
        <Tooltip title={`${progress}%`}>
          <Progress percent={progress} size="small" status={record.status === 'failed' ? 'exception' : 'active'} />
        </Tooltip>
      )
    },
    {
      title: 'Priority',
      dataIndex: 'priority',
      key: 'priority',
      sorter: (a, b) => {
        const order = { critical: 4, high: 3, medium: 2, low: 1 }
        return order[a.priority] - order[b.priority]
      },
      render: (priority) => (
        <Tag color={getPriorityColor(priority)}>{priority.toUpperCase()}</Tag>
      )
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      render: (category) => <Tag>{category}</Tag>
    },
    {
      title: 'Assignee',
      dataIndex: 'assignee',
      key: 'assignee',
      sorter: (a, b) => a.assignee.localeCompare(b.assignee)
    },
    {
      title: 'Created',
      dataIndex: 'createdAt',
      key: 'createdAt',
      sorter: (a, b) => a.createdAt - b.createdAt,
      render: (date) => dayjs(date).format('YYYY-MM-DD HH:mm')
    },
    {
      title: 'Duration',
      dataIndex: 'duration',
      key: 'duration'
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Tooltip title="View Details">
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => {
                setSelectedTask(record)
                setDrawerVisible(true)
              }}
            />
          </Tooltip>
          <Tooltip title="Edit">
            <Button type="text" icon={<EditOutlined />} />
          </Tooltip>
          {record.status === 'running' && (
            <Tooltip title="Pause">
              <Button type="text" icon={<PauseCircleOutlined />} />
            </Tooltip>
          )}
          {record.status === 'pending' && (
            <Tooltip title="Start">
              <Button type="text" icon={<PlayCircleOutlined />} />
            </Tooltip>
          )}
          <Popconfirm
            title="Are you sure you want to delete this task?"
            onConfirm={() => {
              setTasks(tasks.filter(t => t.id !== record.id))
            }}
          >
            <Tooltip title="Delete">
              <Button type="text" danger icon={<DeleteOutlined />} />
            </Tooltip>
          </Popconfirm>
        </Space>
      )
    }
  ]

  const rowSelection = {
    selectedRowKeys,
    onChange: setSelectedRowKeys,
    selections: [
      Table.SELECTION_ALL,
      Table.SELECTION_INVERT,
      Table.SELECTION_NONE
    ]
  }

  const stats = {
    total: tasks.length,
    running: tasks.filter(t => t.status === 'running').length,
    completed: tasks.filter(t => t.status === 'completed').length,
    failed: tasks.filter(t => t.status === 'failed').length,
    pending: tasks.filter(t => t.status === 'pending').length
  }

  return (
    <div>
      <Affix offsetTop={0}>
        <Card style={{ marginBottom: 16, zIndex: 10 }}>
          <Row gutter={[16, 16]} align="middle">
            <Col flex="auto">
              <Title level={2} style={{ margin: 0 }}>Task Monitor</Title>
            </Col>
            <Col>
              <Space>
                <Search
                  placeholder="Search tasks..."
                  allowClear
                  style={{ width: 250 }}
                  onSearch={setSearchText}
                  onChange={(e) => setSearchText(e.target.value)}
                />
                <Select
                  value={filterStatus}
                  onChange={setFilterStatus}
                  style={{ width: 150 }}
                >
                  <Option value="all">All Status</Option>
                  <Option value="running">Running</Option>
                  <Option value="completed">Completed</Option>
                  <Option value="pending">Pending</Option>
                  <Option value="failed">Failed</Option>
                </Select>
                <Button icon={<ReloadOutlined />} onClick={() => setLoading(!loading)}>
                  Refresh
                </Button>
                <Button icon={<ExportOutlined />}>Export</Button>
                {selectedRowKeys.length > 0 && (
                  <Button danger>
                    Delete Selected ({selectedRowKeys.length})
                  </Button>
                )}
              </Space>
            </Col>
          </Row>
        </Card>
      </Affix>

      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Tasks"
              value={stats.total}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Running"
              value={stats.running}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Completed"
              value={stats.completed}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Failed"
              value={stats.failed}
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
      </Row>

      <Card>
        <Table
          rowSelection={rowSelection}
          dataSource={filteredTasks}
          columns={columns}
          rowKey="id"
          loading={loading}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: filteredTasks.length,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} tasks`,
            onChange: (page, size) => {
              setCurrentPage(page)
              setPageSize(size)
            }
          }}
          scroll={{ x: 1200 }}
        />
      </Card>

      <Drawer
        title="Task Details"
        placement="right"
        width={600}
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
        extra={
          <Space>
            <Button icon={<EditOutlined />}>Edit</Button>
            <Button type="primary" onClick={() => {
              if (selectedTask) {
                navigate(`/task/${selectedTask.id}`)
              }
            }}>
              View Full Details
            </Button>
          </Space>
        }
      >
        {selectedTask && (
          <Tabs
            defaultActiveKey="1"
            items={[
              {
                key: '1',
                label: 'Overview',
                children: (
                  <Descriptions column={1} bordered>
                    <Descriptions.Item label="Task Name">{selectedTask.name}</Descriptions.Item>
                    <Descriptions.Item label="Status">
                      <Tag icon={getStatusIcon(selectedTask.status)} color={getStatusColor(selectedTask.status)}>
                        {selectedTask.status.toUpperCase()}
                      </Tag>
                    </Descriptions.Item>
                    <Descriptions.Item label="Progress">
                      <Progress percent={selectedTask.progress} />
                    </Descriptions.Item>
                    <Descriptions.Item label="Priority">
                      <Tag color={getPriorityColor(selectedTask.priority)}>
                        {selectedTask.priority.toUpperCase()}
                      </Tag>
                    </Descriptions.Item>
                    <Descriptions.Item label="Category">{selectedTask.category}</Descriptions.Item>
                    <Descriptions.Item label="Assignee">{selectedTask.assignee}</Descriptions.Item>
                    <Descriptions.Item label="Created">
                      {dayjs(selectedTask.createdAt).format('YYYY-MM-DD HH:mm:ss')}
                    </Descriptions.Item>
                    <Descriptions.Item label="Deadline">
                      {dayjs(selectedTask.deadline).format('YYYY-MM-DD HH:mm:ss')}
                    </Descriptions.Item>
                    <Descriptions.Item label="Duration">{selectedTask.duration}</Descriptions.Item>
                  </Descriptions>
                )
              },
              {
                key: '2',
                label: 'Logs',
                children: (
                  <Timeline
                    items={selectedTask.logs.map((log, index) => ({
                      key: index,
                      children: log
                    }))}
                  />
                )
              }
            ]}
          />
        )}
      </Drawer>

      <BackTop />
    </div>
  )
}

export default TaskMonitor
