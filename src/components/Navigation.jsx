import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Home, CreditCard, Receipt, LogOut, ChevronLeft, ChevronRight } from 'lucide-react'

export default function Navigation({ isCollapsed, toggleSidebar }) {
  const location = useLocation()
  const { currentUser, logout } = useAuth()

  const sidebarStyle = {
    width: isCollapsed ? '80px' : '250px',
    height: '100vh',
    backgroundColor: 'var(--card-bg)',
    padding: '2rem 1rem',
    position: 'fixed',
    top: 0,
    left: 0,
    borderRight: '1px solid var(--border-color)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    transition: 'width 0.3s ease',
    zIndex: 100
  }

  const linkStyle = (isActive) => ({
    color: isActive ? 'var(--accent-color)' : 'var(--text-secondary)',
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: isCollapsed ? 'center' : 'flex-start',
    padding: '0.75rem',
    borderRadius: '0.5rem',
    backgroundColor: isActive ? 'rgba(56, 189, 248, 0.1)' : 'transparent',
    marginBottom: '0.5rem',
    fontWeight: isActive ? 'bold' : 'normal',
    transition: 'all 0.2s',
    gap: '1rem'
  })

  return (
    <nav style={sidebarStyle}>
      <div>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: isCollapsed ? 'center' : 'space-between', 
          marginBottom: '2rem' 
        }}>
          {!isCollapsed && (
            <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text-primary)', margin: 0 }}>
              SubManager
            </h1>
          )}
          <button 
            onClick={toggleSidebar}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              padding: '0.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <Link to="/" style={linkStyle(location.pathname === '/')}>
            <Home size={20} />
            {!isCollapsed && <span>Home</span>}
          </Link>
          <Link to="/subscriptions" style={linkStyle(location.pathname.startsWith('/subscriptions'))}>
            <CreditCard size={20} />
            {!isCollapsed && <span>Subscriptions</span>}
          </Link>
          <Link to="/expenses" style={linkStyle(location.pathname === '/expenses')}>
            <Receipt size={20} />
            {!isCollapsed && <span>Variable Expenses</span>}
          </Link>
        </div>
      </div>

      <div>
        {currentUser && (
          <div style={{ 
            padding: '1rem', 
            backgroundColor: 'rgba(255,255,255,0.05)', 
            borderRadius: '0.5rem',
            marginBottom: '1rem',
            display: isCollapsed ? 'none' : 'block'
          }}>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
              Logged in as:
            </div>
            <div style={{ fontWeight: 'bold', wordBreak: 'break-all' }}>
              {currentUser.email}
            </div>
          </div>
        )}
        
        <button 
          onClick={logout}
          style={{
            width: '100%',
            padding: '0.75rem',
            backgroundColor: 'transparent',
            color: 'var(--danger-color)',
            border: '1px solid var(--border-color)',
            borderRadius: '0.5rem',
            cursor: 'pointer',
            transition: 'all 0.2s',
            display: 'flex',
            alignItems: 'center',
            justifyContent: isCollapsed ? 'center' : 'center',
            gap: '0.5rem'
          }}
          title="Logout"
        >
          <LogOut size={20} />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </nav>
  )
}
