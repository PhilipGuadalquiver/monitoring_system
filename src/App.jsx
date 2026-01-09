import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Layout, Menu, theme } from 'antd'
import {
  DashboardOutlined,
  PlusCircleOutlined,
  MonitorOutlined,
  SettingOutlined,
  BellOutlined,
  UserOutlined
} from '@ant-design/icons'
import Dashboard from './components/Dashboard'
import CreateTask from './components/CreateTask'
import TaskMonitor from './components/TaskMonitor'
import TaskDetails from './components/TaskDetails'
import './App.css'

const { Header, Sider, Content } = Layout

function App() {
  const [collapsed, setCollapsed] = useState(false)
  const {
    token: { colorBgContainer },
  } = theme.useToken()

  return (
    <Router>
      <Layout style={{ minHeight: '100vh' }}>
        <Sider 
          trigger={null} 
          collapsible 
          collapsed={collapsed}
          style={{
            overflow: 'auto',
            height: '100vh',
            position: 'fixed',
            left: 0,
            top: 0,
            bottom: 0,
          }}
        >
          <div className="logo" style={{ 
            height: 64, 
            margin: 16, 
            background: 'rgba(255, 255, 255, 0.3)',
            borderRadius: 8,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: collapsed ? 16 : 20,
            fontWeight: 'bold'
          }}>
            {collapsed ? 'MS' : 'Monitor'}
          </div>
          <Menu
            theme="dark"
            mode="inline"
            defaultSelectedKeys={['1']}
            items={[
              {
                key: '1',
                icon: <DashboardOutlined />,
                label: 'Dashboard',
              },
              {
                key: '2',
                icon: <PlusCircleOutlined />,
                label: 'Create Task',
              },
              {
                key: '3',
                icon: <MonitorOutlined />,
                label: 'Task Monitor',
              },
              {
                key: '4',
                icon: <SettingOutlined />,
                label: 'Settings',
              },
            ]}
            onClick={({ key }) => {
              const routes = {
                '1': '/',
                '2': '/create',
                '3': '/monitor',
                '4': '/settings'
              }
              window.location.href = routes[key]
            }}
          />
        </Sider>
        <Layout style={{ marginLeft: collapsed ? 80 : 200, transition: 'all 0.2s' }}>
          <Header
            style={{
              padding: '0 24px',
              background: colorBgContainer,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}
          >
            <span
              style={{
                fontSize: 18,
                cursor: 'pointer',
                padding: '0 12px'
              }}
              onClick={() => setCollapsed(!collapsed)}
            >
              {collapsed ? '☰' : '☰'}
            </span>
            <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
              <BellOutlined style={{ fontSize: 18, cursor: 'pointer' }} />
              <UserOutlined style={{ fontSize: 18, cursor: 'pointer' }} />
            </div>
          </Header>
          <Content
            style={{
              margin: '24px 16px',
              padding: 24,
              minHeight: 280,
              background: colorBgContainer,
              borderRadius: 8,
            }}
          >
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/create" element={<CreateTask />} />
              <Route path="/monitor" element={<TaskMonitor />} />
              <Route path="/task/:id" element={<TaskDetails />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Content>
        </Layout>
      </Layout>
    </Router>
  )
}

export default App
