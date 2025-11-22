import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'

export default function Login({ onSwitchToSignup }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login, googleLogin } = useAuth()

  async function handleSubmit(e) {
    e.preventDefault()
    try {
      setError('')
      setLoading(true)
      await login(email, password)
    } catch (err) {
      setError('Failed to log in: ' + err.message)
    }
    setLoading(false)
  }

  async function handleGoogleLogin() {
    try {
      setError('')
      setLoading(true)
      await googleLogin()
    } catch (err) {
      setError('Failed to log in with Google: ' + err.message)
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
      <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Log In</h2>
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
          Log In
        </button>
      </form>

      <div style={{ display: 'flex', alignItems: 'center', margin: '1rem 0' }}>
        <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-color)' }}></div>
        <span style={{ padding: '0 1rem', color: 'var(--text-secondary)' }}>or</span>
        <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-color)' }}></div>
      </div>

      <button
        onClick={handleGoogleLogin}
        disabled={loading}
        style={{
          width: '100%',
          padding: '0.75rem',
          backgroundColor: 'white',
          color: '#333',
          border: 'none',
          borderRadius: '0.5rem',
          fontWeight: 'bold',
          marginBottom: '1rem',
          cursor: loading ? 'not-allowed' : 'pointer'
        }}
      >
        Sign in with Google
      </button>

      <div style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
        Need an account? <a href="/signup" style={{ color: 'var(--accent-color)', textDecoration: 'underline' }}>Sign Up</a>
      </div>
    </div>
  )
}
