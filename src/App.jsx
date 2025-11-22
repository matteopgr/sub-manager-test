import React from 'react'
import { SubscriptionProvider } from './context/SubscriptionContext'
import { AuthProvider, useAuth } from './context/AuthContext'
import Dashboard from './components/Dashboard'
import AddSubscriptionForm from './components/AddSubscriptionForm'
import Login from './components/Login'
import Signup from './components/Signup'

function AppContent() {
  const [view, setView] = React.useState('dashboard')
  const [authView, setAuthView] = React.useState('login')
  const { currentUser, logout } = useAuth()

  if (!currentUser) {
    return authView === 'login' 
      ? <Login onSwitchToSignup={() => setAuthView('signup')} />
      : <Signup onSwitchToLogin={() => setAuthView('login')} />
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0 }}>SubManager</h1>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button 
            onClick={() => setView(view === 'dashboard' ? 'add' : 'dashboard')}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: 'var(--accent-color, #38bdf8)',
              color: '#0f172a',
              border: 'none',
              borderRadius: '0.5rem',
              fontWeight: '600'
            }}
          >
            {view === 'dashboard' ? 'Add Subscription' : 'Back to Dashboard'}
          </button>
          <button 
            onClick={logout}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: 'transparent',
              color: 'var(--text-secondary)',
              border: '1px solid var(--border-color)',
              borderRadius: '0.5rem',
              fontWeight: '600'
            }}
          >
            Logout
          </button>
        </div>
      </header>
      
      <main>
        {view === 'dashboard' ? <Dashboard /> : <AddSubscriptionForm onSave={() => setView('dashboard')} />}
      </main>
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <SubscriptionProvider>
        <AppContent />
      </SubscriptionProvider>
    </AuthProvider>
  )
}

export default App
