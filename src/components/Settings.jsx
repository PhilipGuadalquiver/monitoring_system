import React, { useState } from 'react'
import {
  Card,
  Row,
  Col,
  Typography,
  Form,
  Input,
  Button,
  Switch,
  Select,
  Slider,
  ColorPicker,
  Radio,
  Checkbox,
  Divider,
  Space,
  Tabs,
  Upload,
  Avatar,
  Badge,
  Alert,
  message,
  Modal,
  InputNumber,
  TimePicker,
  DatePicker,
  Segmented,
  Rate,
  Tag,
  List,
  Descriptions,
  Tooltip,
  Popconfirm,
  Progress,
  Statistic,
  Collapse,
  Tree,
  Transfer,
  Table,
  Empty
} from 'antd'
import {
  UserOutlined,
  BellOutlined,
  SecurityScanOutlined,
  GlobalOutlined,
  DatabaseOutlined,
  ApiOutlined,
  CloudUploadOutlined,
  DownloadOutlined,
  SaveOutlined,
  ReloadOutlined,
  DeleteOutlined,
  EditOutlined,
  CheckCircleOutlined,
  WarningOutlined,
  InfoCircleOutlined,
  SettingOutlined,
  MailOutlined,
  MobileOutlined,
  LockOutlined,
  TeamOutlined,
  FileTextOutlined,
  PlusOutlined
} from '@ant-design/icons'
import dayjs from 'dayjs'

const { Title, Text, Paragraph } = Typography
const { TextArea } = Input
const { Option } = Select
const { Panel } = Collapse
const { RangePicker } = DatePicker

const Settings = () => {
  const [form] = Form.useForm()
  const [profileForm] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('general')
  const [themeColor, setThemeColor] = useState('#1890ff')
  const [notificationSettings, setNotificationSettings] = useState({
    email: true,
    push: true,
    sms: false
  })

  const onFinish = (values) => {
    setLoading(true)
    setTimeout(() => {
      message.success('Settings saved successfully!')
      setLoading(false)
    }, 1000)
  }

  const notificationColumns = [
    {
      title: 'Event',
      dataIndex: 'event',
      key: 'event'
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      render: (checked) => <Switch checked={checked} size="small" />
    },
    {
      title: 'Push',
      dataIndex: 'push',
      key: 'push',
      render: (checked) => <Switch checked={checked} size="small" />
    },
    {
      title: 'SMS',
      dataIndex: 'sms',
      key: 'sms',
      render: (checked) => <Switch checked={checked} size="small" />
    }
  ]

  const notificationData = [
    { key: '1', event: 'Task Completed', email: true, push: true, sms: false },
    { key: '2', event: 'Task Failed', email: true, push: true, sms: true },
    { key: '3', event: 'Task Started', email: false, push: true, sms: false },
    { key: '4', event: 'Deadline Approaching', email: true, push: true, sms: false },
    { key: '5', event: 'New Task Assigned', email: true, push: true, sms: false }
  ]

  const apiKeys = [
    { id: 1, name: 'Production API Key', key: 'sk_live_...', created: '2024-01-15', status: 'active' },
    { id: 2, name: 'Development API Key', key: 'sk_test_...', created: '2024-01-10', status: 'active' },
    { id: 3, name: 'Legacy API Key', key: 'sk_old_...', created: '2023-12-01', status: 'revoked' }
  ]

  const apiColumns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: 'Key',
      dataIndex: 'key',
      key: 'key',
      render: (text) => <Text code>{text}</Text>
    },
    {
      title: 'Created',
      dataIndex: 'created',
      key: 'created'
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'active' ? 'green' : 'red'}>
          {status.toUpperCase()}
        </Tag>
      )
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button type="link" icon={<EditOutlined />}>Edit</Button>
          <Popconfirm
            title="Are you sure you want to revoke this key?"
            onConfirm={() => message.success('API key revoked')}
          >
            <Button type="link" danger icon={<DeleteOutlined />}>Revoke</Button>
          </Popconfirm>
        </Space>
      )
    }
  ]

  const permissions = [
    { key: '1', title: 'Create Tasks', description: 'Allow user to create new tasks', checked: true },
    { key: '2', title: 'Edit Tasks', description: 'Allow user to edit existing tasks', checked: true },
    { key: '3', title: 'Delete Tasks', description: 'Allow user to delete tasks', checked: false },
    { key: '4', title: 'Manage Users', description: 'Allow user to manage other users', checked: false },
    { key: '5', title: 'View Reports', description: 'Allow user to view system reports', checked: true },
    { key: '6', title: 'Export Data', description: 'Allow user to export data', checked: true }
  ]

  const transferData = [
    { key: '1', title: 'Admin' },
    { key: '2', title: 'Manager' },
    { key: '3', title: 'Developer' },
    { key: '4', title: 'Viewer' },
    { key: '5', title: 'Guest' }
  ]

  return (
    <div>
      <Title level={2}>
        <SettingOutlined /> Settings
      </Title>
      <Divider />

      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={[
          {
            key: 'general',
            label: (
              <span>
                <SettingOutlined /> General
              </span>
            ),
            children: (
              <Card>
                <Form
                  form={form}
                  layout="vertical"
                  onFinish={onFinish}
                  initialValues={{
                    language: 'en',
                    timezone: 'UTC',
                    dateFormat: 'YYYY-MM-DD',
                    timeFormat: '24h',
                    theme: 'light',
                    autoSave: true,
                    refreshInterval: 30
                  }}
                >
                  <Row gutter={[24, 24]}>
                    <Col xs={24} lg={12}>
                      <Form.Item label="Application Name" name="appName">
                        <Input placeholder="Monitoring System" />
                      </Form.Item>
                    </Col>
                    <Col xs={24} lg={12}>
                      <Form.Item label="Language" name="language">
                        <Select>
                          <Option value="en">English</Option>
                          <Option value="es">Spanish</Option>
                          <Option value="fr">French</Option>
                          <Option value="de">German</Option>
                          <Option value="zh">Chinese</Option>
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col xs={24} lg={12}>
                      <Form.Item label="Timezone" name="timezone">
                        <Select showSearch>
                          <Option value="UTC">UTC</Option>
                          <Option value="America/New_York">Eastern Time</Option>
                          <Option value="America/Los_Angeles">Pacific Time</Option>
                          <Option value="Europe/London">London</Option>
                          <Option value="Asia/Tokyo">Tokyo</Option>
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col xs={24} lg={12}>
                      <Form.Item label="Date Format" name="dateFormat">
                        <Select>
                          <Option value="YYYY-MM-DD">YYYY-MM-DD</Option>
                          <Option value="MM/DD/YYYY">MM/DD/YYYY</Option>
                          <Option value="DD/MM/YYYY">DD/MM/YYYY</Option>
                          <Option value="DD-MM-YYYY">DD-MM-YYYY</Option>
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col xs={24} lg={12}>
                      <Form.Item label="Time Format" name="timeFormat">
                        <Radio.Group>
                          <Radio value="12h">12 Hour</Radio>
                          <Radio value="24h">24 Hour</Radio>
                        </Radio.Group>
                      </Form.Item>
                    </Col>
                    <Col xs={24} lg={12}>
                      <Form.Item label="Theme" name="theme">
                        <Segmented
                          options={[
                            { label: 'Light', value: 'light' },
                            { label: 'Dark', value: 'dark' },
                            { label: 'Auto', value: 'auto' }
                          ]}
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={24}>
                      <Form.Item label="Primary Color" name="primaryColor">
                        <Space>
                          <ColorPicker
                            value={themeColor}
                            onChange={(color) => setThemeColor(color.toHexString())}
                            showText
                          />
                          <Text type="secondary">Choose your primary theme color</Text>
                        </Space>
                      </Form.Item>
                    </Col>
                    <Col xs={24}>
                      <Form.Item label="Auto Save Interval (seconds)" name="refreshInterval">
                        <Slider
                          min={10}
                          max={300}
                          marks={{
                            10: '10s',
                            60: '1m',
                            180: '3m',
                            300: '5m'
                          }}
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={24}>
                      <Form.Item name="autoSave" valuePropName="checked">
                        <Checkbox>Enable Auto Save</Checkbox>
                      </Form.Item>
                    </Col>
                    <Col xs={24}>
                      <Form.Item>
                        <Space>
                          <Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={loading}>
                            Save Changes
                          </Button>
                          <Button icon={<ReloadOutlined />} onClick={() => form.resetFields()}>
                            Reset
                          </Button>
                        </Space>
                      </Form.Item>
                    </Col>
                  </Row>
                </Form>
              </Card>
            )
          },
          {
            key: 'profile',
            label: (
              <span>
                <UserOutlined /> Profile
              </span>
            ),
            children: (
              <Card>
                <Row gutter={[24, 24]}>
                  <Col xs={24} md={8}>
                    <Space direction="vertical" align="center" style={{ width: '100%' }}>
                      <Badge dot>
                        <Avatar size={120} icon={<UserOutlined />} />
                      </Badge>
                      <Upload
                        name="avatar"
                        listType="text"
                        showUploadList={false}
                        beforeUpload={() => false}
                      >
                        <Button icon={<CloudUploadOutlined />}>Upload Avatar</Button>
                      </Upload>
                      <Text type="secondary">JPG, PNG or GIF. Max size 2MB</Text>
                    </Space>
                  </Col>
                  <Col xs={24} md={16}>
                    <Form
                      form={profileForm}
                      layout="vertical"
                      onFinish={onFinish}
                      initialValues={{
                        firstName: 'John',
                        lastName: 'Doe',
                        email: 'john.doe@example.com',
                        phone: '+1 234 567 8900',
                        bio: 'System Administrator'
                      }}
                    >
                      <Row gutter={16}>
                        <Col xs={24} sm={12}>
                          <Form.Item label="First Name" name="firstName" rules={[{ required: true }]}>
                            <Input prefix={<UserOutlined />} />
                          </Form.Item>
                        </Col>
                        <Col xs={24} sm={12}>
                          <Form.Item label="Last Name" name="lastName" rules={[{ required: true }]}>
                            <Input prefix={<UserOutlined />} />
                          </Form.Item>
                        </Col>
                      </Row>
                      <Form.Item label="Email" name="email" rules={[{ required: true, type: 'email' }]}>
                        <Input prefix={<MailOutlined />} />
                      </Form.Item>
                      <Form.Item label="Phone" name="phone">
                        <Input prefix={<MobileOutlined />} />
                      </Form.Item>
                      <Form.Item label="Bio" name="bio">
                        <TextArea rows={4} placeholder="Tell us about yourself" />
                      </Form.Item>
                      <Form.Item>
                        <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>
                          Update Profile
                        </Button>
                      </Form.Item>
                    </Form>
                  </Col>
                </Row>
              </Card>
            )
          },
          {
            key: 'notifications',
            label: (
              <span>
                <BellOutlined /> Notifications
              </span>
            ),
            children: (
              <Card>
                <Alert
                  message="Notification Settings"
                  description="Configure how you receive notifications for different events."
                  type="info"
                  icon={<InfoCircleOutlined />}
                  style={{ marginBottom: 24 }}
                />
                <Table
                  dataSource={notificationData}
                  columns={notificationColumns}
                  pagination={false}
                  style={{ marginBottom: 24 }}
                />
                <Divider>Notification Channels</Divider>
                <Space direction="vertical" style={{ width: '100%' }}>
                  <div>
                    <Space>
                      <Switch
                        checked={notificationSettings.email}
                        onChange={(checked) =>
                          setNotificationSettings({ ...notificationSettings, email: checked })
                        }
                      />
                      <Text strong>Email Notifications</Text>
                    </Space>
                    <Text type="secondary" style={{ display: 'block', marginLeft: 32 }}>
                      Receive notifications via email
                    </Text>
                  </div>
                  <div>
                    <Space>
                      <Switch
                        checked={notificationSettings.push}
                        onChange={(checked) =>
                          setNotificationSettings({ ...notificationSettings, push: checked })
                        }
                      />
                      <Text strong>Push Notifications</Text>
                    </Space>
                    <Text type="secondary" style={{ display: 'block', marginLeft: 32 }}>
                      Receive browser push notifications
                    </Text>
                  </div>
                  <div>
                    <Space>
                      <Switch
                        checked={notificationSettings.sms}
                        onChange={(checked) =>
                          setNotificationSettings({ ...notificationSettings, sms: checked })
                        }
                      />
                      <Text strong>SMS Notifications</Text>
                    </Space>
                    <Text type="secondary" style={{ display: 'block', marginLeft: 32 }}>
                      Receive SMS notifications (premium feature)
                    </Text>
                  </div>
                </Space>
                <Divider />
                <Form.Item label="Quiet Hours">
                  <RangePicker
                    picker="time"
                    format="HH:mm"
                    style={{ width: '100%' }}
                  />
                </Form.Item>
                <Button type="primary" icon={<SaveOutlined />}>
                  Save Notification Settings
                </Button>
              </Card>
            )
          },
          {
            key: 'security',
            label: (
              <span>
                <SecurityScanOutlined /> Security
              </span>
            ),
            children: (
              <Card>
                <Alert
                  message="Security Settings"
                  description="Manage your account security and authentication settings."
                  type="warning"
                  icon={<WarningOutlined />}
                  style={{ marginBottom: 24 }}
                />
                <Collapse>
                  <Panel header="Change Password" key="1">
                    <Form layout="vertical" style={{ maxWidth: 500 }}>
                      <Form.Item label="Current Password" name="currentPassword">
                        <Input.Password prefix={<LockOutlined />} />
                      </Form.Item>
                      <Form.Item label="New Password" name="newPassword" rules={[{ required: true, min: 8 }]}>
                        <Input.Password prefix={<LockOutlined />} />
                      </Form.Item>
                      <Form.Item label="Confirm New Password" name="confirmPassword" dependencies={['newPassword']}>
                        <Input.Password prefix={<LockOutlined />} />
                      </Form.Item>
                      <Form.Item>
                        <Button type="primary">Update Password</Button>
                      </Form.Item>
                    </Form>
                  </Panel>
                  <Panel header="Two-Factor Authentication" key="2">
                    <Space direction="vertical" style={{ width: '100%' }}>
                      <div>
                        <Text strong>Status: </Text>
                        <Tag color="red">Disabled</Tag>
                      </div>
                      <Paragraph>
                        Two-factor authentication adds an extra layer of security to your account.
                      </Paragraph>
                      <Button type="primary">Enable 2FA</Button>
                    </Space>
                  </Panel>
                  <Panel header="API Keys" key="3">
                    <Table
                      dataSource={apiKeys}
                      columns={apiColumns}
                      rowKey="id"
                      pagination={false}
                      style={{ marginBottom: 16 }}
                    />
                    <Button type="primary" icon={<PlusOutlined />}>
                      Generate New API Key
                    </Button>
                  </Panel>
                  <Panel header="Active Sessions" key="4">
                    <List
                      dataSource={[
                        { device: 'Windows PC', location: 'New York, USA', lastActive: '2 hours ago', current: true },
                        { device: 'iPhone', location: 'New York, USA', lastActive: '1 day ago', current: false },
                        { device: 'MacBook Pro', location: 'San Francisco, USA', lastActive: '3 days ago', current: false }
                      ]}
                      renderItem={(item) => (
                        <List.Item
                          actions={[
                            item.current ? (
                              <Tag color="green">Current Session</Tag>
                            ) : (
                              <Button type="link" danger>Revoke</Button>
                            )
                          ]}
                        >
                          <List.Item.Meta
                            title={item.device}
                            description={`${item.location} • ${item.lastActive}`}
                          />
                        </List.Item>
                      )}
                    />
                  </Panel>
                </Collapse>
              </Card>
            )
          },
          {
            key: 'permissions',
            label: (
              <span>
                <TeamOutlined /> Permissions
              </span>
            ),
            children: (
              <Card>
                <Alert
                  message="Role-Based Access Control"
                  description="Manage user permissions and roles for the system."
                  type="info"
                  style={{ marginBottom: 24 }}
                />
                <Row gutter={[24, 24]}>
                  <Col xs={24} lg={12}>
                    <Card title="User Permissions" size="small">
                      <Checkbox.Group style={{ width: '100%' }}>
                        <Space direction="vertical" style={{ width: '100%' }}>
                          {permissions.map(perm => (
                            <div key={perm.key}>
                              <Checkbox value={perm.key} defaultChecked={perm.checked}>
                                <Text strong>{perm.title}</Text>
                              </Checkbox>
                              <div style={{ marginLeft: 24, marginTop: 4 }}>
                                <Text type="secondary" style={{ fontSize: 12 }}>
                                  {perm.description}
                                </Text>
                              </div>
                            </div>
                          ))}
                        </Space>
                      </Checkbox.Group>
                    </Card>
                  </Col>
                  <Col xs={24} lg={12}>
                    <Card title="Role Assignment" size="small">
                      <Transfer
                        dataSource={transferData}
                        titles={['Available Roles', 'Assigned Roles']}
                        targetKeys={['1', '2']}
                        render={(item) => item.title}
                      />
                    </Card>
                  </Col>
                </Row>
                <Divider />
                <Button type="primary" icon={<SaveOutlined />}>
                  Save Permissions
                </Button>
              </Card>
            )
          },
          {
            key: 'integrations',
            label: (
              <span>
                <ApiOutlined /> Integrations
              </span>
            ),
            children: (
              <Card>
                <Row gutter={[16, 16]}>
                  <Col xs={24} md={12}>
                    <Card
                      hoverable
                      actions={[
                        <Button type="link" key="connect">Connect</Button>
                      ]}
                    >
                      <Card.Meta
                        avatar={<Avatar icon={<DatabaseOutlined />} />}
                        title="Database Integration"
                        description="Connect to external databases"
                      />
                    </Card>
                  </Col>
                  <Col xs={24} md={12}>
                    <Card
                      hoverable
                      actions={[
                        <Button type="link" key="connect">Connect</Button>
                      ]}
                    >
                      <Card.Meta
                        avatar={<Avatar icon={<GlobalOutlined />} />}
                        title="Webhook Integration"
                        description="Configure webhook endpoints"
                      />
                    </Card>
                  </Col>
                  <Col xs={24} md={12}>
                    <Card
                      hoverable
                      actions={[
                        <Button type="link" key="connect">Connect</Button>
                      ]}
                    >
                      <Card.Meta
                        avatar={<Avatar icon={<FileTextOutlined />} />}
                        title="File Storage"
                        description="Connect cloud storage services"
                      />
                    </Card>
                  </Col>
                  <Col xs={24} md={12}>
                    <Card
                      hoverable
                      actions={[
                        <Button type="link" key="connect">Connect</Button>
                      ]}
                    >
                      <Card.Meta
                        avatar={<Avatar icon={<ApiOutlined />} />}
                        title="API Integration"
                        description="Connect third-party APIs"
                      />
                    </Card>
                  </Col>
                </Row>
              </Card>
            )
          },
          {
            key: 'data',
            label: (
              <span>
                <DatabaseOutlined /> Data Management
              </span>
            ),
            children: (
              <Card>
                <Alert
                  message="Data Export & Import"
                  description="Export your data or import from backup files."
                  type="info"
                  style={{ marginBottom: 24 }}
                />
                <Row gutter={[16, 16]}>
                  <Col xs={24} md={12}>
                    <Card title="Export Data" size="small">
                      <Space direction="vertical" style={{ width: '100%' }}>
                        <Form.Item label="Export Format">
                          <Select defaultValue="json">
                            <Option value="json">JSON</Option>
                            <Option value="csv">CSV</Option>
                            <Option value="xlsx">Excel</Option>
                          </Select>
                        </Form.Item>
                        <Form.Item label="Date Range">
                          <RangePicker style={{ width: '100%' }} />
                        </Form.Item>
                        <Button type="primary" block icon={<DownloadOutlined />}>
                          Export Data
                        </Button>
                      </Space>
                    </Card>
                  </Col>
                  <Col xs={24} md={12}>
                    <Card title="Import Data" size="small">
                      <Space direction="vertical" style={{ width: '100%' }}>
                        <Upload.Dragger
                          name="file"
                          multiple
                          beforeUpload={() => false}
                        >
                          <p className="ant-upload-drag-icon">
                            <CloudUploadOutlined />
                          </p>
                          <p className="ant-upload-text">Click or drag file to this area to upload</p>
                          <p className="ant-upload-hint">
                            Support for JSON, CSV, and Excel files
                          </p>
                        </Upload.Dragger>
                        <Button type="primary" block>
                          Import Data
                        </Button>
                      </Space>
                    </Card>
                  </Col>
                </Row>
                <Divider />
                <Card title="Storage Statistics" size="small">
                  <Row gutter={16}>
                    <Col span={8}>
                      <Statistic title="Total Data" value={1250} suffix="MB" />
                    </Col>
                    <Col span={8}>
                      <Statistic title="Used" value={850} suffix="MB" />
                    </Col>
                    <Col span={8}>
                      <Statistic title="Available" value={400} suffix="MB" />
                    </Col>
                  </Row>
                  <Progress percent={68} status="active" style={{ marginTop: 16 }} />
                </Card>
                <Divider />
                <Popconfirm
                  title="Are you sure you want to delete all data?"
                  description="This action cannot be undone."
                  onConfirm={() => message.error('Data deletion cancelled for safety')}
                  okText="Yes, Delete"
                  okType="danger"
                >
                  <Button danger icon={<DeleteOutlined />}>
                    Delete All Data
                  </Button>
                </Popconfirm>
              </Card>
            )
          }
        ]}
      />
    </div>
  )
}

export default Settings
