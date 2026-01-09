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
import { tasksAPI } from '../services/api'
import { message } from 'antd'

const { Title, Text } = Typography
const { Search } = Input
const { Option } = Select
const { RangePicker } = DatePicker

const TaskMonitor = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [drawerVisible, setDrawerVisible] = useState(false)
  const [selectedTask, setSelectedTask] = useState(null)
  const [filterStatus, setFilterStatus] = useState('all')
  const [searchText, setSearchText] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [tasks, setTasks] = useState([])
  const [stats, setStats] = useState({
    total: 0,
    running: 0,
    completed: 0,
    failed: 0,
    pending: 0
  })

  useEffect(() => {
    fetchTasks()
  }, [filterStatus])

  const fetchTasks = async () => {
    setLoading(true)
    try {
      const filters = filterStatus !== 'all' ? { status: filterStatus } : {}
      const tasksData = await tasksAPI.getAll(filters)
      setTasks(tasksData)
      
      // Calculate stats
      setStats({
        total: tasksData.length,
        running: tasksData.filter(t => t.status === 'running').length,
        completed: tasksData.filter(t => t.status === 'completed').length,
        failed: tasksData.filter(t => t.status === 'failed').length,
        pending: tasksData.filter(t => t.status === 'pending').length
      })
    } catch (error) {
      console.error('Error fetching tasks:', error)
      message.error('Failed to load tasks')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      await tasksAPI.delete(id)
      message.success('Task deleted successfully')
      fetchTasks()
    } catch (error) {
      message.error('Failed to delete task')
    }
  }

  const handleRefresh = () => {
    fetchTasks()
  }

  // Format task for display
  const formatTask = (task) => {
    if (!task) return null
    return {
      ...task,
      assignee: task.assignee ? `${task.assignee.firstName} ${task.assignee.lastName}` : 'Unassigned',
      createdAt: task.createdAt ? dayjs(task.createdAt) : dayjs(),
      deadline: task.deadline ? dayjs(task.deadline) : null,
      logs: task.logs ? task.logs.map(log => log.message) : []
    }
  }

  const displayTasks = tasks.map(formatTask).filter(Boolean)

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

  const filteredTasks = displayTasks.filter(task => {
    const matchesSearch = task.name.toLowerCase().includes(searchText.toLowerCase()) ||
                         (task.assignee && task.assignee.toLowerCase().includes(searchText.toLowerCase()))
    return matchesSearch
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
            onConfirm={() => handleDelete(record.id)}
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
                <Button icon={<ReloadOutlined />} onClick={handleRefresh} loading={loading}>
                  Refresh
                </Button>
                <Button icon={<ExportOutlined />}>Export</Button>
                {selectedRowKeys.length > 0 && (
                  <Popconfirm
                    title={`Are you sure you want to delete ${selectedRowKeys.length} task(s)?`}
                    onConfirm={async () => {
                      try {
                        await Promise.all(selectedRowKeys.map(id => tasksAPI.delete(id)))
                        message.success(`${selectedRowKeys.length} task(s) deleted successfully`)
                        setSelectedRowKeys([])
                        fetchTasks()
                      } catch (error) {
                        message.error('Failed to delete tasks')
                      }
                    }}
                  >
                    <Button danger>
                      Delete Selected ({selectedRowKeys.length})
                    </Button>
                  </Popconfirm>
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

      {loading && tasks.length === 0 ? (
        <Spin size="large" style={{ display: 'block', textAlign: 'center', padding: '50px' }} />
      ) : (

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
      )}

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
                  selectedTask.logs && selectedTask.logs.length > 0 ? (
                    <Timeline
                      items={selectedTask.logs.map((log, index) => ({
                        key: index,
                        children: typeof log === 'string' ? log : log.message
                      }))}
                    />
                  ) : (
                    <Empty description="No logs available" />
                  )
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
