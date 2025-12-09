import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { SubscriptionProvider } from './context/SubscriptionContext'
import { AuthProvider, useAuth } from './context/AuthContext'
import { ExpensesProvider } from './context/ExpensesContext'
import Dashboard from './components/Dashboard'
import AddSubscriptionForm from './components/AddSubscriptionForm'
import Login from './components/Login'
import Signup from './components/Signup'
import Navigation from './components/Navigation'
import VariableExpenses from './components/VariableExpenses'
import Home from './components/Home'

function AppContent() {
  const { currentUser, loading } = useAuth()
  const [isSidebarCollapsed, setIsSidebarCollapsed] = React.useState(false)

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed)
  }

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Loading...</div>
  }

  if (!currentUser) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    )
  }

  return (
    <div style={{ display: 'flex' }}>
      <Navigation isCollapsed={isSidebarCollapsed} toggleSidebar={toggleSidebar} />
      <div style={{ 
        flex: 1, 
        marginLeft: isSidebarCollapsed ? '80px' : '250px', 
        padding: '2rem',
        transition: 'margin-left 0.3s ease'
      }}>
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/subscriptions" element={<Dashboard />} />
            <Route path="/subscriptions/add" element={<AddSubscriptionForm onSave={() => window.history.back()} />} />
            <Route path="/expenses" element={<VariableExpenses />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <SubscriptionProvider>
          <ExpensesProvider>
            <AppContent />
          </ExpensesProvider>
        </SubscriptionProvider>
      </AuthProvider>
    </Router>
  )
}

export default App
