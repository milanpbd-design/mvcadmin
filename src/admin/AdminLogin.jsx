import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function AdminLogin() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [adminPassword, setAdminPassword] = useState('Master@47') // default
  const navigate = useNavigate()

  // Load admin password from site-config
  useEffect(() => {
    fetch('/content/site-config.json')
      .then(r => r.json())
      .then(data => {
        if (data.adminPassword) {
          setAdminPassword(data.adminPassword)
        }
      })
      .catch(err => console.error('Failed to load config:', err))
  }, [])

  function submit() {
    if (password === adminPassword) {
      localStorage.setItem('adminToken', 'static-admin-token')
      localStorage.setItem('adminLoggedIn', 'true')
      setError('')
      navigate('/admin', { replace: true })
    } else {
      setError('Invalid credentials')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Admin Login</h2>
        {error && <div className="bg-red-100 text-red-700 rounded p-2 mb-3">{error}</div>}
        <input
          type="password"
          className="w-full border rounded px-3 py-2 mb-3"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') submit() }}
        />
        <button className="w-full bg-blue-700 text-white rounded px-3 py-2" onClick={submit}>Login</button>
      </div>
    </div>
  )
}
