import React, { useState } from 'react'
import { useExpenses } from '../context/ExpensesContext'

export default function VariableExpenses() {
  const { expenses, addExpense, updateExpense, removeExpense } = useExpenses()
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    category: 'General'
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [editingId, setEditingId] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      if (editingId) {
        await updateExpense(editingId, formData)
        setEditingId(null)
      } else {
        await addExpense(formData)
      }
      setFormData({
        description: '',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        category: 'General'
      })
    } catch (error) {
      console.error("Error saving expense:", error)
      alert("Failed to save expense")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (expense) => {
    setEditingId(expense.id)
    setFormData({
      description: expense.description,
      amount: expense.amount,
      date: expense.date,
      category: expense.category || 'General'
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setFormData({
      description: '',
      amount: '',
      date: new Date().toISOString().split('T')[0],
      category: 'General'
    })
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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 style={{ margin: 0 }}>{editingId ? 'Edit Expense' : 'Add Variable Expense'}</h2>
          {editingId && (
            <button 
              onClick={handleCancelEdit}
              style={{
                background: 'transparent',
                border: '1px solid var(--text-secondary)',
                color: 'var(--text-secondary)',
                padding: '0.25rem 0.75rem',
                borderRadius: '0.25rem',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
          )}
        </div>
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
            {isSubmitting ? 'Saving...' : (editingId ? 'Update Expense' : 'Add Expense')}
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
            border: '1px solid var(--border-color)',
            opacity: editingId === expense.id ? 0.5 : 1
          }}>
            <div>
              <h3 style={{ margin: '0 0 0.25rem 0', fontSize: '1rem' }}>{expense.description}</h3>
              <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                {new Date(expense.date).toLocaleDateString()}
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>€{Number(expense.amount).toFixed(2)}</span>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={() => handleEdit(expense)}
                  disabled={editingId !== null}
                  style={{
                    background: 'none',
                    border: '1px solid var(--accent-color)',
                    color: 'var(--accent-color)',
                    cursor: editingId !== null ? 'not-allowed' : 'pointer',
                    padding: '0.25rem 0.5rem',
                    borderRadius: '0.25rem',
                    fontSize: '0.875rem',
                    opacity: editingId !== null ? 0.5 : 1
                  }}
                >
                  Edit
                </button>
                <button
                  onClick={() => {
                    if(confirm('Delete this expense?')) removeExpense(expense.id)
                  }}
                  disabled={editingId !== null}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--danger-color)',
                    cursor: editingId !== null ? 'not-allowed' : 'pointer',
                    padding: '0.5rem',
                    opacity: editingId !== null ? 0.5 : 1
                  }}
                >
                  ✕
                </button>
              </div>
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
