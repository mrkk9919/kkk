import { useEffect, useState } from 'react'
import { api, setToken, getToken } from './api'
import KhqrPoster from './KhqrPoster'
import './App.css'

type Tab = 'dashboard' | 'users' | 'orders' | 'settlements'

interface DashboardData {
  totalUsers: number
  newUsersToday: number
  totalQr: number
  todayTxCount: number
  todayTxAmount: string
  pendingSettlementAmount: string
  settledAmount: string
  failedTxCount: number
  openExceptionCount: number
}

function App() {
  const [tab, setTab] = useState<Tab>('dashboard')
  const [dash, setDash] = useState<DashboardData | null>(null)
  const [users, setUsers] = useState<unknown[]>([])
  const [orders, setOrders] = useState<unknown[]>([])
  const [settlements, setSettlements] = useState<unknown[]>([])
  const [pending, setPending] = useState<unknown[]>([])
  const [chain, setChain] = useState<any | null>(null)
  const [master, setMaster] = useState<any | null>(null)
  const [userQr, setUserQr] = useState<any | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!getToken()) {
      window.location.href = '/login'
      return
    }
    refresh(tab)
  }, [tab])

  async function refresh(current: Tab) {
    setError('')
    try {
      const m = await api.masterAccount()
      setMaster(m.master)
      if (current === 'dashboard') {
        const r = await api.dashboard()
        setDash(r as unknown as DashboardData)
      } else if (current === 'users') {
        const r = await api.users()
        setUsers(r.users)
      } else if (current === 'orders') {
        const r = await api.orders()
        setOrders(r.orders)
      } else if (current === 'settlements') {
        const r = await api.settlements()
        setSettlements(r.settlements)
        const p = await api.pendingSettlements()
        setPending(p.users)
      }
    } catch (e) {
      setError((e as Error).message)
    }
  }

  async function showChain(id: string) {
    try {
      const r = await api.orderChain(id)
      setChain(r.chain)
    } catch (e) {
      setError((e as Error).message)
    }
  }

  async function showUserQr(user: any) {
    try {
      const r = await api.userQr(user.id)
      setUserQr({ wingAccount: user.wingAccount, realName: user.realName, ...r.qr })
    } catch (e) {
      setError((e as Error).message)
    }
  }

  function logout() {
    setToken(null)
    window.location.href = '/login'
  }

  return (
    <div className="app">
      <header className="topbar">
        <h1>BAKONG Settlement Admin</h1>
        <div>
          <button onClick={() => refresh(tab)}>刷新</button>
          <button onClick={logout}>退出</button>
        </div>
      </header>

      <nav className="tabs">
        {(['dashboard', 'users', 'orders', 'settlements'] as Tab[]).map((t) => (
          <button
            key={t}
            className={tab === t ? 'active' : ''}
            onClick={() => {
              setTab(t)
              setChain(null)
            }}
          >
            {t}
          </button>
        ))}
      </nav>

      {error && <div className="error">{error}</div>}

      {master && (
        <section className="master-card">
          <div className="master-info">
            <label>Master BAKONG 主账号</label>
            <b>{master.accountIdentifier}</b>
            <span className="muted">{master.phone}</span>
            {master.qrPayload && <code className="qr-payload">{master.qrPayload}</code>}
          </div>
        </section>
      )}

      {tab === 'dashboard' && dash && (
        <section className="grid">
          <div className="card"><label>用户总数</label><b>{dash.totalUsers}</b></div>
          <div className="card"><label>今日新增用户</label><b>{dash.newUsersToday}</b></div>
          <div className="card"><label>QR 总数</label><b>{dash.totalQr}</b></div>
          <div className="card"><label>今日交易数量</label><b>{dash.todayTxCount}</b></div>
          <div className="card"><label>今日交易金额</label><b>${dash.todayTxAmount}</b></div>
          <div className="card"><label>待结算金额</label><b>${dash.pendingSettlementAmount}</b></div>
          <div className="card"><label>已结算金额</label><b>${dash.settledAmount}</b></div>
          <div className="card"><label>失败交易</label><b>{dash.failedTxCount}</b></div>
          <div className="card"><label>异常回调</label><b>{dash.openExceptionCount}</b></div>
        </section>
      )}

      {tab === 'users' && (
        <section className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>ID</th><th>Wing Account</th><th>实名</th><th>电话</th><th>状态</th><th>收款二维码</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u: any) => (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td>{u.wingAccount}</td>
                  <td>{u.realName}</td>
                  <td>{u.phone ?? '-'}</td>
                  <td>{u.status}</td>
                  <td>
                    <button onClick={() => showUserQr(u)}>查看</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {userQr && (
            <KhqrPoster
              wingAccount={userQr.wingAccount}
              realName={userQr.realName}
              qrImage={userQr.qrImage}
              onClose={() => setUserQr(null)}
            />
          )}
        </section>
      )}

      {tab === 'orders' && (
        <section className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>订单号</th><th>付款人</th><th>收款人</th><th>金额</th>
                <th>Transaction ID</th><th>支付状态</th><th>结算状态</th><th>操作</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o: any) => (
                <tr key={String(o.id)}>
                  <td>{o.orderNo}</td>
                  <td>{o.payer?.wingAccount ?? String(o.payerUserId)}</td>
                  <td>{o.receiver?.wingAccount ?? String(o.receiverUserId)}</td>
                  <td>{o.amount} {o.currency}</td>
                  <td>{String(o.transactionId) ?? '-'}</td>
                  <td>{o.paymentStatus}</td>
                  <td>{o.settlementStatus}</td>
                  <td><button onClick={() => showChain(o.id)}>链路</button></td>
                </tr>
              ))}
            </tbody>
          </table>
          {chain && <pre className="chain">{JSON.stringify(chain, null, 2)}</pre>}
        </section>
      )}

      {tab === 'settlements' && (
        <section>
          <h3>待结算用户</h3>
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>用户 ID</th><th>实名</th><th>Wing Account</th><th>待结算金额</th></tr>
              </thead>
              <tbody>
                {pending.map((p: any) => (
                  <tr key={p.userId}>
                    <td>{p.userId}</td>
                    <td>{p.realName}</td>
                    <td>{p.wingAccount}</td>
                    <td>${p.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <h3>结算记录</h3>
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>订单 ID</th><th>金额</th><th>目标</th><th>状态</th><th>完成时间</th></tr>
              </thead>
              <tbody>
                {settlements.map((s: any) => (
                  <tr key={s.id}>
                    <td>{s.orderId}</td>
                    <td>{s.amount}</td>
                    <td>{s.destination}</td>
                    <td>{s.status}</td>
                    <td>{s.completedAt ?? '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  )
}

export default App
