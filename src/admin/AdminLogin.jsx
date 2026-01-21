import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { apiLoginUser } from '../utils/api'

export default function AdminLogin() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()
  function submit() {
    apiLoginUser(username, password).then(res => {
      if (res && res.token) {
        localStorage.setItem('adminToken', res.token)
        if (res.refreshToken) localStorage.setItem('adminRefreshToken', res.refreshToken)
        localStorage.setItem('adminLoggedIn', 'true')
        setError('')
        navigate('/admin', { replace: true })
      } else {
        setError('Invalid credentials')
      }
    })
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Admin Login</h2>
        {error && <div className="bg-red-100 text-red-700 rounded p-2 mb-3">{error}</div>}
        <input className="w-full border rounded px-3 py-2 mb-3" placeholder="Email" value={username} onChange={e => setUsername(e.target.value)} />
        <input type="password" className="w-full border rounded px-3 py-2 mb-3" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') submit() }} />
        <button className="w-full bg-blue-700 text-white rounded px-3 py-2" onClick={submit}>Login</button>
      </div>
    </div>
  )
}

