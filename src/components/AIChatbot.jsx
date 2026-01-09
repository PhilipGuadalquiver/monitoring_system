import React, { useState, useRef, useEffect } from 'react'
import {
  FloatButton,
  Drawer,
  Input,
  Button,
  Avatar,
  Typography,
  Space,
  message,
  Dropdown,
  Modal,
  List,
  Badge,
  Tooltip,
  Empty
} from 'antd'
import {
  RobotOutlined,
  UserOutlined,
  SendOutlined,
  MessageOutlined,
  DownloadOutlined,
  DeleteOutlined,
  ThunderboltOutlined,
  HistoryOutlined,
  SearchOutlined,
  CopyOutlined,
  CheckOutlined,
  FileTextOutlined,
  PlusOutlined
} from '@ant-design/icons'
import { tasksAPI, usersAPI, dashboardAPI } from '../services/api'
import ReactMarkdown from 'react-markdown'
import './AIChatbot.css'

const { TextArea, Search } = Input
const { Text } = Typography

const CHAT_STORAGE_KEY = 'ai_chatbot_messages'
const CHAT_SESSIONS_KEY = 'ai_chatbot_sessions'
const MAX_SESSIONS = 20

const quickActions = [
  { label: 'Show all tasks', query: 'Show me all tasks' },
  { label: 'Pending tasks', query: 'What tasks are pending?' },
  { label: 'Task statistics', query: 'Show me task statistics' },
  { label: 'How to create task?', query: 'How do I create a new task?' },
  { label: 'Dashboard overview', query: 'Tell me about the dashboard' }
]

const AIChatbot = () => {
  const [open, setOpen] = useState(false)
  const [currentSessionId, setCurrentSessionId] = useState(() => {
    return `session-${Date.now()}`
  })
  const [sessions, setSessions] = useState(() => {
    const saved = localStorage.getItem(CHAT_SESSIONS_KEY)
    return saved ? JSON.parse(saved) : []
  })
  const [messages, setMessages] = useState(() => {
    return [
      {
        id: 1,
        type: 'ai',
        content: "Hello! I'm your AI assistant. I can help you with:\n\n• **Task Management** - View, create, and monitor tasks\n• **Statistics** - Get insights about your tasks\n• **System Help** - Learn how to use features\n• **Quick Actions** - Use the buttons below for common queries\n\nHow can I assist you today?",
        timestamp: new Date()
      }
    ]
  })
  const [inputValue, setInputValue] = useState('')
  const [loading, setLoading] = useState(false)
  const [typing, setTyping] = useState(false)
  const [appData, setAppData] = useState({ tasks: [], users: [], stats: null })
  const [showHistory, setShowHistory] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [copiedId, setCopiedId] = useState(null)
  const [suggestedQuestions, setSuggestedQuestions] = useState([])
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  // Load app data for context
  useEffect(() => {
    if (open) {
      loadAppData()
    }
  }, [open])

  // Save current session
  useEffect(() => {
    if (messages.length > 1) {
      saveSession()
    }
  }, [messages, currentSessionId])

  const loadAppData = async () => {
    try {
      const [tasks, users, stats] = await Promise.all([
        tasksAPI.getAll().catch(() => []),
        usersAPI.getAll().catch(() => []),
        dashboardAPI.getStats().catch(() => null)
      ])
      setAppData({ tasks, users, stats })
    } catch (error) {
      console.error('Error loading app data:', error)
    }
  }

  const saveSession = () => {
    const session = {
      id: currentSessionId,
      title: generateSessionTitle(),
      messages: messages,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    setSessions(prev => {
      const filtered = prev.filter(s => s.id !== currentSessionId)
      const updated = [session, ...filtered].slice(0, MAX_SESSIONS)
      localStorage.setItem(CHAT_SESSIONS_KEY, JSON.stringify(updated))
      return updated
    })
  }

  const generateSessionTitle = () => {
    const firstUserMessage = messages.find(m => m.type === 'user')
    if (firstUserMessage) {
      const text = firstUserMessage.content.substring(0, 50)
      return text.length < firstUserMessage.content.length ? text + '...' : text
    }
    return `Chat ${new Date().toLocaleDateString()}`
  }

  const loadSession = (sessionId) => {
    const session = sessions.find(s => s.id === sessionId)
    if (session) {
      setMessages(session.messages.map(msg => ({
        ...msg,
        timestamp: new Date(msg.timestamp)
      })))
      setCurrentSessionId(sessionId)
      setShowHistory(false)
      message.success('Session loaded')
    }
  }

  const createNewSession = () => {
    const newSessionId = `session-${Date.now()}`
    setCurrentSessionId(newSessionId)
    setMessages([
      {
        id: 1,
        type: 'ai',
        content: "Hello! I'm your AI assistant. I can help you with:\n\n• **Task Management** - View, create, and monitor tasks\n• **Statistics** - Get insights about your tasks\n• **System Help** - Learn how to use features\n• **Quick Actions** - Use the buttons below for common queries\n\nHow can I assist you today?",
        timestamp: new Date()
      }
    ])
    setShowHistory(false)
    message.success('New conversation started')
  }

  const deleteSession = (sessionId, e) => {
    e.stopPropagation()
    Modal.confirm({
      title: 'Delete Conversation',
      content: 'Are you sure you want to delete this conversation?',
      onOk: () => {
        const updated = sessions.filter(s => s.id !== sessionId)
        setSessions(updated)
        localStorage.setItem(CHAT_SESSIONS_KEY, JSON.stringify(updated))
        if (sessionId === currentSessionId) {
          createNewSession()
        }
        message.success('Conversation deleted')
      }
    })
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, typing])

  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus()
      }, 300)
    }
  }, [open])

  // Generate suggested follow-up questions
  const generateSuggestions = (lastMessage) => {
    const suggestions = []
    const lowerMessage = lastMessage?.content?.toLowerCase() || ''

    if (lowerMessage.includes('task') || lowerMessage.includes('pending')) {
      suggestions.push('Show me completed tasks', 'What tasks are in progress?', 'Show task statistics')
    } else if (lowerMessage.includes('statistics') || lowerMessage.includes('stats')) {
      suggestions.push('Show me all tasks', 'What tasks are pending?', 'Tell me about the dashboard')
    } else if (lowerMessage.includes('create') || lowerMessage.includes('how')) {
      suggestions.push('Show me all tasks', 'What tasks are pending?', 'Show task statistics')
    } else {
      suggestions.push('Show me all tasks', 'What tasks are pending?', 'Show task statistics', 'How do I create a task?')
    }

    return suggestions.slice(0, 3)
  }

  // Enhanced AI response with real data
  const generateAIResponse = async (userMessage) => {
    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 700))

    const lowerMessage = userMessage.toLowerCase()
    const { tasks, users, stats } = appData

    // Generate suggestions based on context
    const suggestions = generateSuggestions({ content: userMessage })
    setSuggestedQuestions(suggestions)

    if (lowerMessage.includes('all tasks') || lowerMessage.includes('show tasks') || lowerMessage.includes('list tasks')) {
      if (tasks.length === 0) {
        return "You don't have any tasks yet. Would you like to create one? You can do so from the **Create Task** page."
      }
      const taskList = tasks.slice(0, 10).map(t => 
        `• **${t.name}** - ${t.status} (${t.priority} priority)`
      ).join('\n')
      return `Here are your tasks:\n\n${taskList}\n\n${tasks.length > 10 ? `*Showing 10 of ${tasks.length} tasks*` : ''}\n\nYou can view all tasks in the **Task Monitor** page.`
    }

    if (lowerMessage.includes('pending') || lowerMessage.includes('not started')) {
      const pending = tasks.filter(t => t.status === 'pending')
      if (pending.length === 0) {
        return "Great! You don't have any pending tasks. All tasks are either in progress or completed."
      }
      const list = pending.slice(0, 5).map(t => 
        `• **${t.name}** - ${t.priority} priority`
      ).join('\n')
      return `You have **${pending.length}** pending task${pending.length > 1 ? 's' : ''}:\n\n${list}\n\n${pending.length > 5 ? `*Showing 5 of ${pending.length}*` : ''}`
    }

    if (lowerMessage.includes('completed')) {
      const completed = tasks.filter(t => t.status === 'completed')
      if (completed.length === 0) {
        return "You don't have any completed tasks yet."
      }
      const list = completed.slice(0, 5).map(t => 
        `• **${t.name}** - Completed`
      ).join('\n')
      return `You have **${completed.length}** completed task${completed.length > 1 ? 's' : ''}:\n\n${list}\n\n${completed.length > 5 ? `*Showing 5 of ${completed.length}*` : ''}`
    }

    if (lowerMessage.includes('statistics') || lowerMessage.includes('stats') || lowerMessage.includes('overview')) {
      if (!stats && tasks.length === 0) {
        return "I don't have statistics data yet. Once you create some tasks, I'll be able to provide detailed insights."
      }
      
      const totalTasks = tasks.length
      const byStatus = tasks.reduce((acc, t) => {
        acc[t.status] = (acc[t.status] || 0) + 1
        return acc
      }, {})
      const byPriority = tasks.reduce((acc, t) => {
        acc[t.priority] = (acc[t.priority] || 0) + 1
        return acc
      }, {})

      let response = `## Task Statistics\n\n`
      response += `**Total Tasks:** ${totalTasks}\n\n`
      
      if (Object.keys(byStatus).length > 0) {
        response += `**By Status:**\n`
        Object.entries(byStatus).forEach(([status, count]) => {
          response += `• ${status}: ${count}\n`
        })
        response += `\n`
      }

      if (Object.keys(byPriority).length > 0) {
        response += `**By Priority:**\n`
        Object.entries(byPriority).forEach(([priority, count]) => {
          response += `• ${priority}: ${count}\n`
        })
      }

      if (stats) {
        response += `\n**Dashboard Stats:**\n`
        if (stats.totalTasks) response += `• Total: ${stats.totalTasks}\n`
        if (stats.completedTasks) response += `• Completed: ${stats.completedTasks}\n`
        if (stats.inProgressTasks) response += `• In Progress: ${stats.inProgressTasks}\n`
      }

      return response
    }

    if (lowerMessage.includes('create') && lowerMessage.includes('task')) {
      return `## How to Create a Task\n\n1. Navigate to **Create Task** from the sidebar\n2. Fill in the task details:\n   - **Task Name** (required)\n   - **Description**\n   - **Priority** (low, medium, high, critical)\n   - **Category** (data, system, report, etc.)\n   - **Assignee** (select a team member)\n   - **Deadline** (optional)\n3. Configure advanced options if needed\n4. Click **Create Task**\n\nYou can also ask me to help you with specific task creation questions!`
    }

    if (lowerMessage.includes('dashboard')) {
      return `## Dashboard Overview\n\nThe dashboard provides:\n\n• **Statistics Cards** - Quick overview of task counts and progress\n• **Task Status Distribution** - Visual breakdown by status\n• **Recent Activity** - Latest task updates and changes\n• **Priority Overview** - Tasks grouped by priority level\n• **Quick Filters** - Filter tasks by status, priority, or category\n\nYou can access it from the sidebar menu. The dashboard updates in real-time as tasks change.`
    }

    if (lowerMessage.includes('how many') || lowerMessage.includes('count')) {
      const total = tasks.length
      const completed = tasks.filter(t => t.status === 'completed').length
      const inProgress = tasks.filter(t => t.status === 'in-progress').length
      const pending = tasks.filter(t => t.status === 'pending').length
      
      return `## Task Counts\n\n• **Total Tasks:** ${total}\n• **Completed:** ${completed}\n• **In Progress:** ${inProgress}\n• **Pending:** ${pending}\n\n${total === 0 ? 'Start by creating your first task!' : 'Great progress!'}`
    }

    if (lowerMessage.includes('users') || lowerMessage.includes('team')) {
      if (users.length === 0) {
        return "No users found in the system."
      }
      const userList = users.map(u => 
        `• **${u.firstName} ${u.lastName}** (${u.email})`
      ).join('\n')
      return `## Team Members\n\n${userList}\n\nTotal: ${users.length} user${users.length > 1 ? 's' : ''}`
    }

    if (lowerMessage.includes('help') || lowerMessage.includes('what can you')) {
      return `## I Can Help You With:\n\n### 📋 Task Management\n• View all tasks\n• Check task status and progress\n• Get task statistics\n• Learn how to create tasks\n\n### 📊 Analytics\n• Dashboard overview\n• Task counts by status\n• Priority distribution\n• Progress tracking\n\n### 💡 General Help\n• System features explanation\n• Navigation guidance\n• Best practices\n\n**Try asking:**\n• "Show me all tasks"\n• "What tasks are pending?"\n• "Show me task statistics"\n• "How do I create a task?"\n\nOr use the quick action buttons below!`
    }

    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
      return `Hello! 👋 I'm your AI assistant for the monitoring system.\n\nI can help you with:\n• Task management and monitoring\n• Statistics and analytics\n• System navigation and features\n• Answering questions about your tasks\n\nWhat would you like to know?`
    }

    // Default intelligent response
    return `I understand you're asking about "${userMessage}". Let me help you with that.\n\nI can assist with:\n• **Task queries** - "Show me all tasks", "What tasks are pending?"\n• **Statistics** - "Show me task statistics", "How many tasks do I have?"\n• **Help** - "How do I create a task?", "Tell me about the dashboard"\n• **General questions** about the monitoring system\n\nCould you rephrase your question or use one of the quick action buttons below?`
  }

  const handleSend = async (customMessage = null) => {
    const messageToSend = customMessage || inputValue.trim()
    if (!messageToSend) {
      return
    }

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: messageToSend,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    if (!customMessage) setInputValue('')
    setLoading(true)
    setTyping(true)

    try {
      const aiResponse = await generateAIResponse(userMessage.content)
      
      const aiMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: aiResponse,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, aiMessage])
    } catch (error) {
      message.error('Failed to get AI response. Please try again.')
      console.error('AI response error:', error)
    } finally {
      setLoading(false)
      setTyping(false)
    }
  }

  const handleQuickAction = (query) => {
    handleSend(query)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleClearChat = () => {
    Modal.confirm({
      title: 'Clear Current Conversation',
      content: 'Are you sure you want to clear this conversation?',
      onOk: () => {
        createNewSession()
        message.success('Conversation cleared')
      }
    })
  }

  const handleExportChat = () => {
    const chatText = messages.map(msg => {
      const time = msg.timestamp.toLocaleString()
      const sender = msg.type === 'user' ? 'You' : 'AI Assistant'
      return `[${time}] ${sender}:\n${msg.content}\n`
    }).join('\n---\n\n')

    const blob = new Blob([chatText], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `chat-export-${new Date().toISOString().split('T')[0]}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    message.success('Chat exported successfully!')
  }

  const handleCopyMessage = (content, id) => {
    navigator.clipboard.writeText(content).then(() => {
      setCopiedId(id)
      message.success('Message copied!')
      setTimeout(() => setCopiedId(null), 2000)
    })
  }

  const filteredSessions = sessions.filter(session => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return session.title.toLowerCase().includes(query) ||
           session.messages.some(msg => msg.content.toLowerCase().includes(query))
  })

  const menuItems = [
    {
      key: 'history',
      label: 'Conversation History',
      icon: <HistoryOutlined />,
      onClick: () => setShowHistory(true)
    },
    {
      key: 'new',
      label: 'New Conversation',
      icon: <PlusOutlined />,
      onClick: createNewSession
    },
    {
      key: 'export',
      label: 'Export Chat',
      icon: <DownloadOutlined />,
      onClick: handleExportChat
    },
    {
      key: 'clear',
      label: 'Clear Chat',
      icon: <DeleteOutlined />,
      onClick: handleClearChat
    }
  ]

  return (
    <>
      <FloatButton
        icon={<MessageOutlined />}
        type="primary"
        style={{
          right: 24,
          bottom: 24,
        }}
        onClick={() => setOpen(true)}
        tooltip={<div>AI Assistant</div>}
        badge={{ count: sessions.length, overflowCount: 99 }}
      />

      <Drawer
        title={
          <Space>
            <Avatar icon={<RobotOutlined />} style={{ backgroundColor: '#1890ff' }} />
            <div>
              <Text strong>AI Assistant</Text>
              <br />
              <Text type="secondary" style={{ fontSize: 12 }}>Your monitoring system helper</Text>
            </div>
          </Space>
        }
        placement="right"
        onClose={() => {
          setOpen(false)
          setShowHistory(false)
        }}
        open={open}
        width={420}
        extra={
          <Dropdown menu={{ items: menuItems }} placement="bottomRight">
            <Button type="text" size="small" icon={<ThunderboltOutlined />} />
          </Dropdown>
        }
        styles={{
          body: {
            padding: 0,
            display: 'flex',
            flexDirection: 'column',
            height: '100%'
          }
        }}
      >
        {showHistory ? (
          <div className="chatbot-history">
            <div className="history-header">
              <Space style={{ width: '100%', justifyContent: 'space-between', marginBottom: 16 }}>
                <Text strong>Conversation History</Text>
                <Button type="primary" icon={<PlusOutlined />} onClick={createNewSession} size="small">
                  New
                </Button>
              </Space>
              <Search
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                allowClear
                style={{ marginBottom: 16 }}
              />
            </div>
            <div className="history-list">
              {filteredSessions.length === 0 ? (
                <Empty description="No conversation history" />
              ) : (
                <List
                  dataSource={filteredSessions}
                  renderItem={(session) => (
                    <List.Item
                      className={session.id === currentSessionId ? 'active-session' : ''}
                      onClick={() => loadSession(session.id)}
                      style={{ cursor: 'pointer' }}
                    >
                      <List.Item.Meta
                        avatar={<Avatar icon={<FileTextOutlined />} />}
                        title={
                          <Space>
                            <Text ellipsis style={{ maxWidth: 200 }}>
                              {session.title}
                            </Text>
                            {session.id === currentSessionId && (
                              <Badge status="processing" text="Current" />
                            )}
                          </Space>
                        }
                        description={
                          <Text type="secondary" style={{ fontSize: 12 }}>
                            {new Date(session.updatedAt).toLocaleString()} • {session.messages.length} messages
                          </Text>
                        }
                      />
                      <Button
                        type="text"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={(e) => deleteSession(session.id, e)}
                        size="small"
                      />
                    </List.Item>
                  )}
                />
              )}
            </div>
          </div>
        ) : (
          <>
            {/* Quick Actions */}
            {messages.length <= 1 && (
              <div className="chatbot-quick-actions">
                <Text type="secondary" style={{ fontSize: 12, marginBottom: 8, display: 'block' }}>
                  Quick Actions:
                </Text>
                <Space wrap size={[8, 8]}>
                  {quickActions.map((action, idx) => (
                    <Button
                      key={idx}
                      size="small"
                      type="default"
                      onClick={() => handleQuickAction(action.query)}
                      disabled={loading}
                    >
                      {action.label}
                    </Button>
                  ))}
                </Space>
              </div>
            )}

            <div className="chatbot-messages">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`chatbot-message ${msg.type === 'user' ? 'user-message' : 'ai-message'}`}
                >
                  <Avatar
                    icon={msg.type === 'user' ? <UserOutlined /> : <RobotOutlined />}
                    style={{
                      backgroundColor: msg.type === 'user' ? '#87d068' : '#1890ff',
                      flexShrink: 0
                    }}
                  />
                  <div className="message-content">
                    <div className="message-bubble">
                      <div className="message-header">
                        {msg.type === 'ai' ? (
                          <div className="markdown-content">
                            <ReactMarkdown>{msg.content}</ReactMarkdown>
                          </div>
                        ) : (
                          <Text>{msg.content}</Text>
                        )}
                        <Tooltip title={copiedId === msg.id ? 'Copied!' : 'Copy message'}>
                          <Button
                            type="text"
                            size="small"
                            icon={copiedId === msg.id ? <CheckOutlined /> : <CopyOutlined />}
                            onClick={() => handleCopyMessage(msg.content, msg.id)}
                            className="copy-button"
                          />
                        </Tooltip>
                      </div>
                    </div>
                    <Text type="secondary" style={{ fontSize: 11, marginTop: 4 }}>
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Text>
                  </div>
                </div>
              ))}
              {typing && (
                <div className="chatbot-message ai-message">
                  <Avatar icon={<RobotOutlined />} style={{ backgroundColor: '#1890ff', flexShrink: 0 }} />
                  <div className="message-content">
                    <div className="message-bubble typing-indicator">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Suggested Follow-up Questions */}
            {suggestedQuestions.length > 0 && !loading && messages.length > 2 && (
              <div className="chatbot-suggestions">
                <Text type="secondary" style={{ fontSize: 12, marginBottom: 8, display: 'block' }}>
                  Suggested questions:
                </Text>
                <Space wrap size={[8, 8]}>
                  {suggestedQuestions.map((question, idx) => (
                    <Button
                      key={idx}
                      size="small"
                      type="dashed"
                      onClick={() => handleSend(question)}
                      disabled={loading}
                    >
                      {question}
                    </Button>
                  ))}
                </Space>
              </div>
            )}

            <div className="chatbot-input">
              <Space.Compact style={{ width: '100%' }}>
                <TextArea
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message... (Press Enter to send)"
                  autoSize={{ minRows: 1, maxRows: 4}}
                  disabled={loading}
                  style={{ resize: 'none' }}
                />
                <Button
                  type="primary"
                  icon={<SendOutlined />}
                  onClick={() => handleSend()}
                  loading={loading}
                  disabled={!inputValue.trim()}
                  style={{ height: 'auto' }}
                >
                  Send
                </Button>
              </Space.Compact>
            </div>
          </>
        )}
      </Drawer>
    </>
  )
}

export default AIChatbot
