import React from 'react'
import { useSubscriptions } from '../context/SubscriptionContext'

export default function SubscriptionCard({ subscription }) {
  const { removeSubscription } = useSubscriptions()

  const nextPayment = new Date(subscription.startDate)
  const today = new Date()
  // Simple calculation for next month (imperfect but works for demo)
  while (nextPayment < today) {
    nextPayment.setMonth(nextPayment.getMonth() + 1)
  }
  
  const daysLeft = Math.ceil((nextPayment - today) / (1000 * 60 * 60 * 24))

  return (
    <div style={{
      backgroundColor: 'var(--card-bg)',
      padding: '1.5rem',
      borderRadius: '1rem',
      border: '1px solid var(--border-color)',
      position: 'relative',
      transition: 'transform 0.2s',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
        <h3 style={{ margin: 0, fontSize: '1.25rem' }}>{subscription.name}</h3>
        <span style={{ 
          fontSize: '1.25rem', 
          fontWeight: 'bold', 
          color: 'var(--accent-color)' 
        }}>
          €{Number(subscription.cost).toFixed(2)}
        </span>
      </div>
      
      <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
        <p style={{ margin: '0.25rem 0' }}>Next payment: {nextPayment.toLocaleDateString()}</p>
        <p style={{ margin: '0.25rem 0', color: daysLeft <= 3 ? 'var(--danger-color)' : 'inherit' }}>
          {daysLeft} days remaining
        </p>
      </div>

      <button 
        onClick={async () => {
          if (confirm('Are you sure?')) {
            try {
              await removeSubscription(subscription.id)
            } catch (error) {
              console.error("Error removing subscription: ", error)
              alert("Failed to remove subscription")
            }
          }
        }}
        style={{
          width: '100%',
          padding: '0.5rem',
          backgroundColor: 'transparent',
          border: '1px solid var(--danger-color)',
          color: 'var(--danger-color)',
          borderRadius: '0.5rem',
          fontSize: '0.875rem',
          transition: 'all 0.2s',
          cursor: 'pointer'
        }}
      >
        Remove
      </button>
    </div>
  )
}
