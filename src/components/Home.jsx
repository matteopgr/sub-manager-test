import React from 'react'
import { useSubscriptions } from '../context/SubscriptionContext'
import { useExpenses } from '../context/ExpensesContext'
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, BarChart, Bar } from 'recharts'

const COLORS = ['#38bdf8', '#818cf8', '#c084fc', '#f472b6', '#fb7185', '#34d399', '#fbbf24', '#a78bfa']
const LINE_COLORS = {
  2023: '#38bdf8',
  2024: '#818cf8',
  2025: '#c084fc'
}

export default function Home() {
  const { subscriptions, totalCost: subTotal } = useSubscriptions()
  const { expenses } = useExpenses()

  const currentMonth = new Date().getMonth()
  const currentYear = new Date().getFullYear()

  // --- Current Month Data (Pie Chart) ---
  const variableExpensesThisMonth = expenses.filter(exp => {
    const d = new Date(exp.date)
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear
  })

  const variableTotal = variableExpensesThisMonth.reduce((acc, exp) => acc + Number(exp.amount), 0)
  const grandTotal = subTotal + variableTotal

  const variableByCategory = variableExpensesThisMonth.reduce((acc, exp) => {
    const cat = exp.category || 'General'
    acc[cat] = (acc[cat] || 0) + Number(exp.amount)
    return acc
  }, {})

  const currentMonthData = [
    ...subscriptions.map(sub => ({ name: sub.name, value: Number(sub.cost) })),
    ...Object.entries(variableByCategory).map(([name, value]) => ({ name, value }))
  ].filter(item => item.value > 0)

  // --- Cumulative History Data (Line Chart) ---
  // Structure: [{ month: 'Jan', 2023: 100, 2024: 150 }, ...]
  
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const years = new Set()
  
  // Initialize monthly totals per year
  const monthlyTotals = {} // { 2024: [100, 200, ...], 2023: [...] }

  // Helper to add to monthly totals
  const addToMonth = (year, monthIndex, amount) => {
    years.add(year)
    if (!monthlyTotals[year]) monthlyTotals[year] = new Array(12).fill(0)
    monthlyTotals[year][monthIndex] += amount
  }

  // 1. Add Variable Expenses
  expenses.forEach(exp => {
    const d = new Date(exp.date)
    addToMonth(d.getFullYear(), d.getMonth(), Number(exp.amount))
  })

  // 2. Add Subscriptions (Simulated for history)
  // For simplicity, we assume active subscriptions were active all year for the years present in data
  // Or we could check start date. Let's check start date for better accuracy.
  const activeYears = Array.from(years).sort()
  if (activeYears.length === 0) activeYears.push(currentYear) // Default to current year if no data

  activeYears.forEach(year => {
    subscriptions.forEach(sub => {
      const start = new Date(sub.startDate)
      // If subscription started before or in this year
      if (start.getFullYear() <= year) {
        for (let m = 0; m < 12; m++) {
          // If started this year, only count months after start
          if (start.getFullYear() === year && m < start.getMonth()) continue
          // Don't project into future months of current year
          if (year === currentYear && m > currentMonth) continue
          
          addToMonth(year, m, Number(sub.cost))
        }
      }
    })
  })

  // Transform to Cumulative Data
  const cumulativeData = months.map((month, index) => {
    const dataPoint = { month }
    activeYears.forEach(year => {
      if (!monthlyTotals[year]) return
      
      // Calculate cumulative up to this month
      let sum = 0
      for (let i = 0; i <= index; i++) {
        sum += monthlyTotals[year][i]
      }
      
      // Only show data up to current month for current year
      if (year === currentYear && index > currentMonth) return

      dataPoint[year] = sum
    })
    return dataPoint
  })

  const monthlyNonCumulativeData = months.map((month, index) => {
    const dataPoint = { month }
    activeYears.forEach(year => {
      if (!monthlyTotals[year]) return
      // Only show dat up to current month for current year
      if (year === currentYear && index > currentMonth) return
      dataPoint[year] = monthlyTotals[year][index]
    })
    return dataPoint
  })

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{ backgroundColor: '#1e293b', padding: '0.5rem', border: '1px solid #334155', borderRadius: '0.25rem' }}>
          <p style={{ margin: '0 0 0.5rem 0', color: '#fff', fontWeight: 'bold' }}>{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ margin: 0, color: entry.color }}>
              {entry.name}: €{entry.value.toFixed(2)}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <div className="dashboard-grid">
      
      {/* Left Column: Totals & Pie Chart */}
      <div className="totals-container">
        <div style={{ 
          backgroundColor: 'var(--card-bg)', 
          padding: '2rem', 
          borderRadius: '1rem', 
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
              <span style={{ display: 'block', fontSize: '0.875rem' }}>Fixed</span>
              <span style={{ fontWeight: 'bold', color: 'var(--text-primary)' }}>€{subTotal.toFixed(2)}</span>
            </div>
            <div>
              <span style={{ display: 'block', fontSize: '0.875rem' }}>Variable</span>
              <span style={{ fontWeight: 'bold', color: 'var(--text-primary)' }}>€{variableTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div style={{ backgroundColor: 'var(--card-bg)', padding: '1.5rem', borderRadius: '1rem' }}>
          <h3 style={{ textAlign: 'center', marginBottom: '1rem' }}>This Month's Breakdown</h3>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={currentMonthData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {currentMonthData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

        <div style={{ backgroundColor: 'var(--card-bg)', padding: '1.5rem', borderRadius: '1rem', height: '100%', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ textAlign: 'center', marginBottom: '1rem' }}>Monthly Expenses</h3>
          <div style={{ flex: 1, minHeight: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyNonCumulativeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="month" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                {activeYears.map((year, index) => (
                  <Bar 
                    key={year}
                    dataKey={year} 
                    name={year}
                    fill={Object.values(LINE_COLORS)[index % 3] || COLORS[index % COLORS.length]} 
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>



      {/* Right Column: Cumulative Line Chart */}
      <div style={{ backgroundColor: 'var(--card-bg)', padding: '1.5rem', borderRadius: '1rem', height: '100%', minHeight: '500px', display: 'flex', flexDirection: 'column' }}>
        <h3 style={{ textAlign: 'center', marginBottom: '2rem' }}>Cumulative Spending</h3>
        <div style={{ flex: 1, minHeight: '400px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={cumulativeData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="month" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              {activeYears.map((year, index) => (
                <Line 
                  key={year}
                  type="monotone" 
                  dataKey={year} 
                  name={year}
                  stroke={Object.values(LINE_COLORS)[index % 3] || COLORS[index % COLORS.length]} 
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 8 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  )
}
