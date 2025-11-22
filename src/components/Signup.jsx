import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'

export default function Signup({ onSwitchToLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { signup } = useAuth()

  async function handleSubmit(e) {
    e.preventDefault()

    if (password !== passwordConfirm) {
      return setError('Passwords do not match')
    }

    try {
      setError('')
      setLoading(true)
      await signup(email, password)
    } catch (err) {
      setError('Failed to create an account: ' + err.message)
    }
    setLoading(false)
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
    <div style={{ maxWidth: '400px', margin: '4rem auto', padding: '2rem', backgroundColor: 'var(--card-bg)', borderRadius: '1rem' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Sign Up</h2>
      {error && <div style={{ color: 'var(--danger-color)', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          required
          style={inputStyle}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          required
          style={inputStyle}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="Confirm Password"
          required
          style={inputStyle}
          value={passwordConfirm}
          onChange={(e) => setPasswordConfirm(e.target.value)}
        />
        <button
          disabled={loading}
          type="submit"
          style={{
            width: '100%',
            padding: '0.75rem',
            backgroundColor: 'var(--accent-color)',
            color: '#0f172a',
            border: 'none',
            borderRadius: '0.5rem',
            fontWeight: 'bold',
            marginBottom: '1rem',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          Sign Up
        </button>
      </form>

      <div style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
        Already have an account? <button onClick={onSwitchToLogin} style={{ background: 'none', border: 'none', color: 'var(--accent-color)', textDecoration: 'underline' }}>Log In</button>
      </div>
    </div>
  )
}
