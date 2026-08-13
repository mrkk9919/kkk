const API_BASE = '/api/v1'

let token: string | null = localStorage.getItem('admin_token')

export function setToken(t: string | null) {
  token = t
  if (t) localStorage.setItem('admin_token', t)
  else localStorage.removeItem('admin_token')
}

export function getToken() {
  return token
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  }
  if (token) headers['Authorization'] = `Bearer ${token}`

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers })
  if (res.status === 401) {
    setToken(null)
    window.location.href = '/login'
    throw new Error('Unauthorized')
  }
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.message || `Request failed: ${res.status}`)
  }
  return res.json()
}

export const api = {
  login: (username: string, password: string) =>
    request<{ accessToken: string; admin: unknown }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    }),
  dashboard: () => request<Record<string, unknown>>('/admin/dashboard'),
  users: () => request<{ users: unknown[] }>('/users'),
  userQr: (id: string) =>
    request<{ qr: Record<string, unknown> }>(`/users/${id}/qr`),
  orders: () => request<{ orders: unknown[] }>('/payments'),
  settlements: () => request<{ settlements: unknown[] }>('/settlements'),
  orderChain: (id: string) =>
    request<{ chain: unknown }>(`/admin/orders/${id}/chain`),
  pendingSettlements: () =>
    request<{ users: unknown[] }>('/admin/pending-settlements'),
  masterAccount: () =>
    request<{ master: unknown | null }>('/master-account/active'),
}
