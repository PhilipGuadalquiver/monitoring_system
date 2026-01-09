import React, { useState, useEffect } from 'react'
import {
  Form,
  Input,
  Button,
  Select,
  DatePicker,
  TimePicker,
  InputNumber,
  Switch,
  Radio,
  Checkbox,
  Upload,
  Rate,
  Slider,
  ColorPicker,
  Typography,
  Card,
  Space,
  Divider,
  Alert,
  Steps,
  Cascader,
  TreeSelect,
  AutoComplete,
  Mentions,
  Row,
  Col,
  message
} from 'antd'
import {
  UploadOutlined,
  PlusOutlined,
  MinusCircleOutlined,
  SaveOutlined,
  SendOutlined
} from '@ant-design/icons'
import dayjs from 'dayjs'
import { useNavigate } from 'react-router-dom'
import { tasksAPI, usersAPI } from '../services/api'

const { Title, Text } = Typography
const { TextArea } = Input
const { Option } = Select
const { Step } = Steps

const CreateTask = () => {
  const [form] = Form.useForm()
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [users, setUsers] = useState([])
  const [loadingUsers, setLoadingUsers] = useState(false)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    setLoadingUsers(true)
    try {
      const usersData = await usersAPI.getAll()
      setUsers(usersData)
    } catch (error) {
      console.error('Error fetching users:', error)
      message.error('Failed to load users')
    } finally {
      setLoadingUsers(false)
    }
  }

  const priorityOptions = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
    { value: 'critical', label: 'Critical' }
  ]

  const categoryOptions = [
    { value: 'data', label: 'Data Processing' },
    { value: 'system', label: 'System Maintenance' },
    { value: 'report', label: 'Report Generation' },
    { value: 'backup', label: 'Backup & Recovery' },
    { value: 'migration', label: 'Migration' }
  ]

  const assigneeOptions = users.map(user => ({
    value: user.id,
    label: `${user.firstName} ${user.lastName}`,
    text: `${user.firstName} ${user.lastName}`
  }))

  const onFinish = async (values) => {
    setLoading(true)
    try {
      // Get ALL form values including those from previous steps
      // This is necessary because Ant Design only includes values from currently visible fields
      const allValues = form.getFieldsValue(true)
      
      // Merge with the values passed to onFinish (which may only include current step)
      const mergedValues = { ...allValues, ...values }
      
      // Validate required fields
      if (!mergedValues.name || (typeof mergedValues.name === 'string' && mergedValues.name.trim() === '')) {
        message.error('Task name is required')
        setLoading(false)
        return
      }

      if (!mergedValues.assignee) {
        message.error('Please select an assignee')
        setLoading(false)
        return
      }

      // Get current user ID (in real app, get from auth context)
      const currentUserId = users[0]?.id || mergedValues.assignee
      
      if (!currentUserId) {
        message.error('Unable to determine current user. Please ensure users are loaded.')
        setLoading(false)
        return
      }
      
      const taskData = {
        name: typeof mergedValues.name === 'string' ? mergedValues.name.trim() : String(mergedValues.name || '').trim(),
        description: mergedValues.description ? (typeof mergedValues.description === 'string' ? mergedValues.description.trim() : String(mergedValues.description)) : null,
        priority: mergedValues.priority || 'medium',
        category: mergedValues.category || 'data',
        assigneeId: mergedValues.assignee,
        createdById: currentUserId,
        startDate: mergedValues.startDate ? mergedValues.startDate.toISOString() : null,
        deadline: mergedValues.deadline ? mergedValues.deadline.toISOString() : null,
        estimatedDuration: mergedValues.duration || null,
        color: mergedValues.color?.toHexString?.() || mergedValues.color || null,
        executionMode: mergedValues.executionMode || null,
        autoRetry: mergedValues.autoRetry || false,
        retryCount: mergedValues.retryCount || 0,
        timeout: mergedValues.timeout || null,
        tags: mergedValues.tags && mergedValues.tags.length > 0 ? mergedValues.tags.map(tag => {
          const tagValue = typeof tag === 'string' ? tag.trim() : (tag.tag || tag).toString().trim()
          return { tag: tagValue }
        }).filter(t => t.tag) : []
      }

      await tasksAPI.create(taskData)
      message.success('Task created successfully!')
      setTimeout(() => {
        navigate('/monitor')
      }, 1500)
    } catch (error) {
      console.error('Error creating task:', error)
      message.error(error.message || 'Failed to create task')
    } finally {
      setLoading(false)
    }
  }

  const steps = [
    {
      title: 'Basic Info',
      content: 'First-content',
    },
    {
      title: 'Details',
      content: 'Second-content',
    },
    {
      title: 'Settings',
      content: 'Third-content',
    },
  ]

  return (
    <div>
      <Title level={2}>Create New Task</Title>
      <Divider />
      
      <Card>
        <Steps current={currentStep} style={{ marginBottom: 32 }}>
          {steps.map(item => (
            <Step key={item.title} title={item.title} />
          ))}
        </Steps>

        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          preserve={true}
          initialValues={{
            priority: 'medium',
            category: 'data',
            notifications: true,
            autoRetry: false,
            retryCount: 3,
            timeout: 3600,
            rating: 3,
            progress: 50
          }}
        >
          {currentStep === 0 && (
            <>
              <Form.Item
                label="Task Name"
                name="name"
                rules={[{ required: true, message: 'Please enter task name' }]}
              >
                <Input placeholder="Enter task name" size="large" />
              </Form.Item>

              <Form.Item
                label="Description"
                name="description"
                rules={[{ required: true, message: 'Please enter description' }]}
              >
                <TextArea rows={4} placeholder="Enter task description" />
              </Form.Item>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label="Category"
                    name="category"
                    rules={[{ required: true }]}
                  >
                    <Select placeholder="Select category" size="large">
                      {categoryOptions.map(opt => (
                        <Option key={opt.value} value={opt.value}>
                          {opt.label}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Priority"
                    name="priority"
                    rules={[{ required: true }]}
                  >
                    <Select placeholder="Select priority" size="large">
                      {priorityOptions.map(opt => (
                        <Option key={opt.value} value={opt.value}>
                          {opt.label}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                label="Assignee"
                name="assignee"
                rules={[{ required: true, message: 'Please select assignee' }]}
              >
                <Select
                  placeholder="Select assignee"
                  size="large"
                  loading={loadingUsers}
                  showSearch
                  filterOption={(input, option) =>
                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                  }
                >
                  {assigneeOptions.map(option => (
                    <Option key={option.value} value={option.value}>
                      {option.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </>
          )}

          {currentStep === 1 && (
            <>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label="Start Date"
                    name="startDate"
                    rules={[{ required: true }]}
                  >
                    <DatePicker style={{ width: '100%' }} size="large" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Deadline"
                    name="deadline"
                    rules={[{ required: true }]}
                  >
                    <DatePicker style={{ width: '100%' }} size="large" />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label="Start Time"
                    name="startTime"
                  >
                    <TimePicker style={{ width: '100%' }} size="large" format="HH:mm" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Estimated Duration (hours)"
                    name="duration"
                  >
                    <InputNumber min={1} max={168} style={{ width: '100%' }} size="large" />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                label="Tags"
                name="tags"
              >
                <Select
                  mode="tags"
                  style={{ width: '100%' }}
                  placeholder="Add tags (press Enter to add)"
                  tokenSeparators={[',']}
                />
              </Form.Item>

              <Form.Item
                label="Dependencies"
                name="dependencies"
                tooltip="Select tasks that must complete before this task starts"
              >
                <TreeSelect
                  placeholder="Select dependent tasks (optional)"
                  allowClear
                  treeCheckable
                  showCheckedStrategy="SHOW_PARENT"
                />
              </Form.Item>

              <Form.Item
                label="Attachments"
                name="attachments"
              >
                <Upload
                  beforeUpload={() => false}
                  multiple
                  listType="text"
                >
                  <Button icon={<UploadOutlined />}>Upload Files</Button>
                </Upload>
              </Form.Item>
            </>
          )}

          {currentStep === 2 && (
            <>
              <Form.Item
                label="Enable Notifications"
                name="notifications"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>

              <Form.Item
                label="Auto Retry on Failure"
                name="autoRetry"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>

              <Form.Item
                noStyle
                shouldUpdate={(prevValues, currentValues) => prevValues.autoRetry !== currentValues.autoRetry}
              >
                {({ getFieldValue }) =>
                  getFieldValue('autoRetry') ? (
                    <Form.Item
                      label="Retry Count"
                      name="retryCount"
                    >
                      <InputNumber min={1} max={10} style={{ width: '100%' }} />
                    </Form.Item>
                  ) : null
                }
              </Form.Item>

              <Form.Item
                label="Timeout (seconds)"
                name="timeout"
              >
                <Slider
                  min={60}
                  max={7200}
                  marks={{
                    60: '1m',
                    3600: '1h',
                    7200: '2h'
                  }}
                />
              </Form.Item>

              <Form.Item
                label="Task Color"
                name="color"
              >
                <ColorPicker showText />
              </Form.Item>

              <Form.Item
                label="Task Rating"
                name="rating"
              >
                <Rate />
              </Form.Item>

              <Form.Item
                label="Initial Progress"
                name="progress"
              >
                <Slider />
              </Form.Item>

              <Form.Item
                label="Execution Mode"
                name="executionMode"
              >
                <Radio.Group>
                  <Radio value="sequential">Sequential</Radio>
                  <Radio value="parallel">Parallel</Radio>
                  <Radio value="scheduled">Scheduled</Radio>
                </Radio.Group>
              </Form.Item>

              <Form.Item
                label="Additional Options"
                name="options"
              >
                <Checkbox.Group>
                  <Checkbox value="log">Enable Logging</Checkbox>
                  <Checkbox value="monitor">Real-time Monitoring</Checkbox>
                  <Checkbox value="alert">Alert on Completion</Checkbox>
                  <Checkbox value="backup">Create Backup</Checkbox>
                </Checkbox.Group>
              </Form.Item>

              <Form.Item
                label="Notes"
                name="notes"
              >
                <Mentions
                  rows={3}
                  placeholder="Add notes or mention team members with @"
                  options={assigneeOptions.map(option => ({ 
                    value: typeof option === 'string' ? option : (option.value || option.label || option.text || '').toString(),
                    label: typeof option === 'string' ? option : (option.label || option.text || option.value || '').toString()
                  }))}
                  filterOption={(input, option) => {
                    const value = (option?.value || '').toString().toLowerCase()
                    const label = (option?.label || '').toString().toLowerCase()
                    const search = (input || '').toString().toLowerCase()
                    return value.includes(search) || label.includes(search)
                  }}
                />
              </Form.Item>
            </>
          )}

          <Divider />

          <Form.Item>
            <Space>
              {currentStep > 0 && (
                <Button onClick={() => setCurrentStep(currentStep - 1)}>
                  Previous
                </Button>
              )}
              {currentStep < steps.length - 1 && (
                <Button type="primary" onClick={() => setCurrentStep(currentStep + 1)}>
                  Next
                </Button>
              )}
              {currentStep === steps.length - 1 && (
                <>
                  <Button onClick={() => form.resetFields()}>
                    Reset
                  </Button>
                  <Button type="default" icon={<SaveOutlined />} onClick={() => message.info('Draft saved')}>
                    Save Draft
                  </Button>
                  <Button type="primary" htmlType="submit" icon={<SendOutlined />} loading={loading}>
                    Create Task
                  </Button>
                </>
              )}
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}

export default CreateTask
