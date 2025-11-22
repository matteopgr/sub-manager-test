import React from 'react'
import { useSubscriptions } from '../context/SubscriptionContext'
import { useExpenses } from '../context/ExpensesContext'

export default function Home() {
  const { totalCost: subTotal } = useSubscriptions()
  const { expenses } = useExpenses()

  const currentMonth = new Date().getMonth()
  const currentYear = new Date().getFullYear()

  const variableTotal = expenses
    .filter(exp => {
      const d = new Date(exp.date)
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear
    })
    .reduce((acc, exp) => acc + Number(exp.amount), 0)

  const grandTotal = subTotal + variableTotal

  // Group expenses by month for history (simple version)
  const history = {}
  expenses.forEach(exp => {
    const d = new Date(exp.date)
    const key = `${d.getFullYear()}-${d.getMonth()}`
    if (!history[key]) history[key] = 0
    history[key] += Number(exp.amount)
  })

  // Add subscription cost to history (assuming constant for simplicity in this view)
  Object.keys(history).forEach(key => {
    history[key] += subTotal
  })

  // Ensure current month is in history
  const currentKey = `${currentYear}-${currentMonth}`
  if (!history[currentKey]) history[currentKey] = grandTotal

  return (
    <div>
      <div style={{ 
        backgroundColor: 'var(--card-bg)', 
        padding: '2rem', 
        borderRadius: '1rem', 
        marginBottom: '2rem',
        textAlign: 'center',
        border: '1px solid var(--accent-color)',
        boxShadow: '0 0 20px rgba(56, 189, 248, 0.1)'
      }}>
        <h2 style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '1.2rem' }}>Total Expenses (This Month)</h2>
        <p style={{ margin: '1rem 0', fontSize: '3.5rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>
          €{grandTotal.toFixed(2)}
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', color: 'var(--text-secondary)' }}>
          <div>
            <span style={{ display: 'block', fontSize: '0.875rem' }}>Fixed (Subs)</span>
            <span style={{ fontWeight: 'bold', color: 'var(--text-primary)' }}>€{subTotal.toFixed(2)}</span>
          </div>
          <div>
            <span style={{ display: 'block', fontSize: '0.875rem' }}>Variable</span>
            <span style={{ fontWeight: 'bold', color: 'var(--text-primary)' }}>€{variableTotal.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <h3 style={{ marginBottom: '1rem' }}>Expense History</h3>
      <div style={{ display: 'grid', gap: '1rem' }}>
        {Object.entries(history)
          .sort((a, b) => b[0].localeCompare(a[0])) // Sort by date desc
          .map(([key, amount]) => {
            const [year, month] = key.split('-')
            const date = new Date(year, month)
            return (
              <div key={key} style={{
                backgroundColor: 'var(--card-bg)',
                padding: '1rem',
                borderRadius: '0.5rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span style={{ fontWeight: 'bold' }}>
                  {date.toLocaleDateString('default', { month: 'long', year: 'numeric' })}
                </span>
                <span style={{ fontSize: '1.1rem' }}>€{amount.toFixed(2)}</span>
              </div>
            )
          })}
      </div>
    </div>
  )
}
