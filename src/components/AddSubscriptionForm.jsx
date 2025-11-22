import React, { useState } from 'react'
import { useSubscriptions } from '../context/SubscriptionContext'

export default function AddSubscriptionForm({ onSave }) {
  const { addSubscription } = useSubscriptions()
  const [formData, setFormData] = useState({
    name: '',
    cost: '',
    startDate: new Date().toISOString().split('T')[0],
    cycle: 'monthly'
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    addSubscription(formData)
    onSave()
  }

  const inputStyle = {
    width: '100%',
    padding: '0.75rem',
    borderRadius: '0.5rem',
    border: '1px solid var(--border-color)',
    backgroundColor: '#0f172a',
    color: 'white',
    marginBottom: '1rem',
    fontSize: '1rem'
  }

  const labelStyle = {
    display: 'block',
    marginBottom: '0.5rem',
    color: 'var(--text-secondary)',
    fontSize: '0.875rem'
  }

  return (
    <div style={{ maxWidth: '500px', margin: '0 auto' }}>
      <h2 style={{ marginBottom: '2rem' }}>Add New Subscription</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label style={labelStyle}>Service Name</label>
          <input
            required
            style={inputStyle}
            value={formData.name}
            onChange={e => setFormData({...formData, name: e.target.value})}
            placeholder="e.g., Netflix"
          />
        </div>

        <div>
          <label style={labelStyle}>Monthly Cost (€)</label>
          <input
            required
            type="number"
            step="0.01"
            style={inputStyle}
            value={formData.cost}
            onChange={e => setFormData({...formData, cost: e.target.value})}
            placeholder="0.00"
          />
        </div>

        <div>
          <label style={labelStyle}>Start Date</label>
          <input
            required
            type="date"
            style={inputStyle}
            value={formData.startDate}
            onChange={e => setFormData({...formData, startDate: e.target.value})}
          />
        </div>

        <button
          type="submit"
          style={{
            width: '100%',
            padding: '1rem',
            backgroundColor: 'var(--accent-color)',
            color: '#0f172a',
            border: 'none',
            borderRadius: '0.5rem',
            fontWeight: 'bold',
            fontSize: '1rem',
            marginTop: '1rem'
          }}
        >
          Save Subscription
        </button>
      </form>
    </div>
  )
}
