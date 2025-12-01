import React, { useState } from 'react'
import { useSubscriptions } from '../context/SubscriptionContext'
import SubscriptionCard from './SubscriptionCard'
import AddSubscriptionForm from './AddSubscriptionForm'

export default function Dashboard() {
  const { subscriptions, totalCost } = useSubscriptions()
  const [isAdding, setIsAdding] = useState(false)
  const [editingSubscription, setEditingSubscription] = useState(null)

  const handleEdit = (sub) => {
    setEditingSubscription(sub)
    setIsAdding(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleCancel = () => {
    setIsAdding(false)
    setEditingSubscription(null)
  }

  const handleSave = () => {
    setIsAdding(false)
    setEditingSubscription(null)
  }

  return (
    <div>
      <div style={{ 
        backgroundColor: 'var(--card-bg)', 
        padding: '1.5rem', 
        borderRadius: '1rem', 
        marginBottom: '2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
      }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '1rem', color: 'var(--text-secondary)' }}>Total Monthly Cost</h2>
          <p style={{ margin: '0.5rem 0 0', fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>
            €{totalCost.toFixed(2)}
          </p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <p style={{ margin: 0, color: 'var(--text-secondary)' }}>Active Subscriptions</p>
          <p style={{ margin: '0.5rem 0 0', fontSize: '1.5rem', fontWeight: 'bold' }}>{subscriptions.length}</p>
        </div>
      </div>

      {isAdding ? (
        <div style={{ marginBottom: '2rem', backgroundColor: 'var(--card-bg)', padding: '2rem', borderRadius: '1rem' }}>
          <AddSubscriptionForm 
            onSave={handleSave} 
            initialData={editingSubscription}
            onCancel={handleCancel}
          />
        </div>
      ) : (
        <div style={{ marginBottom: '1rem', textAlign: 'right' }}>
          <button 
            onClick={() => setIsAdding(true)}
            style={{
              display: 'inline-block',
              padding: '0.75rem 1.5rem',
              backgroundColor: 'var(--accent-color)',
              color: '#0f172a',
              textDecoration: 'none',
              borderRadius: '0.5rem',
              fontWeight: 'bold',
              border: 'none',
              cursor: 'pointer',
              fontSize: '1rem'
            }}
          >
            + Add Subscription
          </button>
        </div>
      )}

      <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
        {subscriptions.map(sub => (
          <SubscriptionCard 
            key={sub.id} 
            subscription={sub} 
            onEdit={handleEdit}
          />
        ))}
        {subscriptions.length === 0 && !isAdding && (
          <p style={{ gridColumn: '1/-1', textAlign: 'center', color: 'var(--text-secondary)', padding: '2rem' }}>
            No subscriptions yet. Add one to get started!
          </p>
        )}
      </div>
    </div>
  )
}
