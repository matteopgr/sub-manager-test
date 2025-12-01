import React, { useState } from 'react'
import { useSubscriptions } from '../context/SubscriptionContext'

export default function AddSubscriptionForm({ onSave, initialData = null, onCancel }) {
  const { addSubscription, updateSubscription } = useSubscriptions()
  const [formData, setFormData] = useState(initialData || {
    name: '',
    cost: '',
    startDate: new Date().toISOString().split('T')[0],
    cycle: 'monthly'
  })

  // Update form data if initialData changes (e.g. when switching between edit/add)
  React.useEffect(() => {
    if (initialData) {
      setFormData(initialData)
    } else {
      setFormData({
        name: '',
        cost: '',
        startDate: new Date().toISOString().split('T')[0],
        cycle: 'monthly'
      })
    }
  }, [initialData])

  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      if (initialData) {
        await updateSubscription(initialData.id, formData)
      } else {
        await addSubscription(formData)
      }
      onSave()
    } catch (error) {
      console.error("Error saving subscription: ", error)
      alert("Failed to save subscription")
    } finally {
      setIsSubmitting(false)
    }
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ margin: 0 }}>{initialData ? 'Edit Subscription' : 'Add New Subscription'}</h2>
        {initialData && (
          <button 
            type="button" 
            onClick={onCancel}
            style={{ 
              background: 'transparent', 
              border: '1px solid var(--text-secondary)', 
              color: 'var(--text-secondary)',
              padding: '0.5rem 1rem',
              borderRadius: '0.5rem',
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>
        )}
      </div>
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
          disabled={isSubmitting}
          style={{
            width: '100%',
            padding: '1rem',
            backgroundColor: 'var(--accent-color)',
            color: '#0f172a',
            border: 'none',
            borderRadius: '0.5rem',
            fontWeight: 'bold',
            fontSize: '1rem',
            marginTop: '1rem',
            opacity: isSubmitting ? 0.7 : 1,
            cursor: isSubmitting ? 'not-allowed' : 'pointer'
          }}
        >
          {isSubmitting ? 'Saving...' : (initialData ? 'Update Subscription' : 'Save Subscription')}
        </button>
      </form>
    </div>
  )
}
