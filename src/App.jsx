import React from 'react'
import { SubscriptionProvider } from './context/SubscriptionContext'
import Dashboard from './components/Dashboard'
import AddSubscriptionForm from './components/AddSubscriptionForm'

function App() {
  const [view, setView] = React.useState('dashboard')

  return (
    <SubscriptionProvider>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0 }}>SubManager</h1>
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
        </header>
        
        <main>
          {view === 'dashboard' ? <Dashboard /> : <AddSubscriptionForm onSave={() => setView('dashboard')} />}
        </main>
      </div>
    </SubscriptionProvider>
  )
}

export default App
