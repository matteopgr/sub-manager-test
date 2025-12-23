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
  const [isAdding, setIsAdding] = useState(false)

  const [months, setMonths] = useState(1) // Number of months to repeat

  // --- Calculations for Total Card ---
  const currentMonthIndices = { month: new Date().getMonth(), year: new Date().getFullYear() }
  
  const currentMonthTotal = expenses.reduce((acc, expense) => {
    const d = new Date(expense.date)
    if (d.getMonth() === currentMonthIndices.month && d.getFullYear() === currentMonthIndices.year) {
      return acc + Number(expense.amount)
    }
    return acc
  }, 0)

  // --- Group Expenses by Month ---
  const groupedExpenses = expenses.reduce((acc, expense) => {
    const d = new Date(expense.date)
    const key = d.toLocaleString('default', { month: 'long', year: 'numeric' })
    if (!acc[key]) acc[key] = []
    acc[key].push(expense)
    return acc
  }, {})

  // Sort months (newest first)
  const sortedMonths = Object.keys(groupedExpenses).sort((a, b) => {
    const dateA = new Date(a)
    const dateB = new Date(b)
    return dateB - dateA
  })

  // --- Handlers ---

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      if (editingId) {
        await updateExpense(editingId, formData)
        setEditingId(null)
      } else {
        // Handle recurring expenses
        const startDate = new Date(formData.date)
        const repeatCount = parseInt(months) || 1

        for (let i = 0; i < repeatCount; i++) {
          const currentDate = new Date(startDate)
          currentDate.setMonth(startDate.getMonth() + i)
          
          const expenseData = {
            ...formData,
            date: currentDate.toISOString().split('T')[0]
          }
          await addExpense(expenseData)
        }
      }
      setFormData({
        description: '',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        category: 'General'
      })
      setMonths(1)
      setIsAdding(false) // Close form after save
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
    setIsAdding(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleCancel = () => {
    setEditingId(null)
    setFormData({
      description: '',
      amount: '',
      date: new Date().toISOString().split('T')[0],
      category: 'General'
    })
    setMonths(1)
    setIsAdding(false)
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
      {/* Total Card */}
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
          <h2 style={{ margin: 0, fontSize: '1rem', color: 'var(--text-secondary)' }}>Total Variable Costs (This Month)</h2>
          <p style={{ margin: '0.5rem 0 0', fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>
            €{currentMonthTotal.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Add/Edit Section */}
      {isAdding ? (
        <div style={{ backgroundColor: 'var(--card-bg)', padding: '1.5rem', borderRadius: '1rem', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 style={{ margin: 0 }}>{editingId ? 'Edit Expense' : 'Add Variable Expense'}</h2>
            <button 
              onClick={handleCancel}
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
            
            {!editingId && (
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', color: 'var(--text-secondary)', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                  Repeat for (months):
                </label>
                <input
                  type="number"
                  min="1"
                  max="36"
                  style={inputStyle}
                  value={months}
                  onChange={e => setMonths(Math.max(1, parseInt(e.target.value) || 1))}
                  placeholder="1"
                />
              </div>
            )}

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
              {isSubmitting ? 'Saving...' : (editingId ? 'Update Expense' : (months > 1 ? `Add ${months} Expenses` : 'Add Expense'))}
            </button>
          </form>
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
            + Add Expense
          </button>
        </div>
      )}

      {/* Expense List Grouped by Month */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {expenses.length === 0 ? (
          <p style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>No variable expenses recorded.</p>
        ) : (
          sortedMonths.map(month => (
            <div key={month}>
              <h3 style={{ color: 'var(--text-secondary)', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
                {month}
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {groupedExpenses[month].sort((a,b) => new Date(b.date) - new Date(a.date)).map(expense => (
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
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
