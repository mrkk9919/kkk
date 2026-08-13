import { useState } from 'react'
import { api, setToken } from './api'
import './Login.css'

function Login() {
  const [username, setUsername] = useState('admin')
  const [password, setPassword] = useState('admin123')
  const [error, setError] = useState('')

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    try {
      const res = await api.login(username, password)
      setToken(res.accessToken)
      window.location.href = '/'
    } catch (err) {
      setError((err as Error).message)
    }
  }

  return (
    <div className="login">
      <form className="login-card" onSubmit={submit}>
        <h2>BAKONG Settlement Admin</h2>
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="用户名"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="密码"
        />
        {error && <div className="error">{error}</div>}
        <button type="submit">登录</button>
      </form>
    </div>
  )
}

export default Login
