import React, { useState } from 'react'
import { useExpenses } from '../context/ExpensesContext'

export default function VariableExpenses() {
  const { expenses, addExpense, removeExpense } = useExpenses()
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    category: 'General'
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      await addExpense(formData)
      setFormData(prev => ({ ...prev, description: '', amount: '' }))
    } catch (error) {
      console.error("Error adding expense:", error)
      alert("Failed to add expense")
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

  return (
    <div>
      <div style={{ backgroundColor: 'var(--card-bg)', padding: '1.5rem', borderRadius: '1rem', marginBottom: '2rem' }}>
        <h2 style={{ marginTop: 0 }}>Add Variable Expense</h2>
        <form onSubmit={handleSubmit}>
          <input
            required
            style={inputStyle}
            value={formData.description}
            onChange={e => setFormData({...formData, description: e.target.value})}
            placeholder="Description (e.g., Groceries)"
          />
          <div style={{ display: 'flex', gap: '1rem' }}>
            <input
              required
              type="number"
              step="0.01"
              style={inputStyle}
              value={formData.amount}
              onChange={e => setFormData({...formData, amount: e.target.value})}
              placeholder="Amount (€)"
            />
            <input
              required
              type="date"
              style={inputStyle}
              value={formData.date}
              onChange={e => setFormData({...formData, date: e.target.value})}
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              width: '100%',
              padding: '0.75rem',
              backgroundColor: 'var(--accent-color)',
              color: '#0f172a',
              border: 'none',
              borderRadius: '0.5rem',
              fontWeight: 'bold',
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              opacity: isSubmitting ? 0.7 : 1
            }}
          >
            {isSubmitting ? 'Adding...' : 'Add Expense'}
          </button>
        </form>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {expenses.map(expense => (
          <div key={expense.id} style={{
            backgroundColor: 'var(--card-bg)',
            padding: '1rem',
            borderRadius: '0.5rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            border: '1px solid var(--border-color)'
          }}>
            <div>
              <h3 style={{ margin: '0 0 0.25rem 0', fontSize: '1rem' }}>{expense.description}</h3>
              <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                {new Date(expense.date).toLocaleDateString()}
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>€{Number(expense.amount).toFixed(2)}</span>
              <button
                onClick={() => {
                  if(confirm('Delete this expense?')) removeExpense(expense.id)
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--danger-color)',
                  cursor: 'pointer',
                  padding: '0.5rem'
                }}
              >
                ✕
              </button>
            </div>
          </div>
        ))}
        {expenses.length === 0 && (
          <p style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>No variable expenses recorded.</p>
        )}
      </div>
    </div>
  )
}
