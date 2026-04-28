import { useMemo, useState } from 'react'
import './App.css'

const users = [
  {
    id: 1,
    name: '홍길동',
    studentId: '20240001',
    status: '사용 중',
    restricted: false,
    pcId: 'PC-03',
    startTime: '2026-04-07 14:20',
    endTime: '2026-04-07 15:20',
    remainingTime: '00:32:15',
    history: [
      { date: '2026-04-07', pcId: 'PC-03', start: '14:20', end: '15:20' },
      { date: '2026-04-04', pcId: 'PC-01', start: '10:10', end: '11:40' },
      { date: '2026-04-02', pcId: 'PC-05', start: '13:30', end: '15:00' },
    ],
  },
  {
    id: 2,
    name: '김현수',
    studentId: '20240002',
    status: '종료',
    restricted: false,
    pcId: 'PC-07',
    startTime: '2026-04-07 12:00',
    endTime: '2026-04-07 13:00',
    remainingTime: '00:00:00',
    history: [
      { date: '2026-04-07', pcId: 'PC-07', start: '12:00', end: '13:00' },
      { date: '2026-04-01', pcId: 'PC-04', start: '09:00', end: '10:00' },
    ],
  },
  {
    id: 3,
    name: '이영희',
    studentId: '20240003',
    status: '사용 중',
    restricted: true,
    pcId: 'PC-02',
    startTime: '2026-04-07 14:05',
    endTime: '2026-04-07 15:05',
    remainingTime: '00:17:42',
    history: [
      { date: '2026-04-07', pcId: 'PC-02', start: '14:05', end: '15:05' },
      { date: '2026-04-03', pcId: 'PC-02', start: '16:00', end: '17:10' },
    ],
  },
  {
    id: 4,
    name: '박민수',
    studentId: '20240004',
    status: '종료',
    restricted: false,
    pcId: 'PC-06',
    startTime: '2026-04-07 11:00',
    endTime: '2026-04-07 12:00',
    remainingTime: '00:00:00',
    history: [
      { date: '2026-04-07', pcId: 'PC-06', start: '11:00', end: '12:00' },
      { date: '2026-04-05', pcId: 'PC-01', start: '13:20', end: '14:10' },
    ],
  },
  {
    id: 5,
    name: '최지영',
    studentId: '20240005',
    status: '사용 중',
    restricted: false,
    pcId: 'PC-09',
    startTime: '2026-04-07 14:40',
    endTime: '2026-04-07 15:40',
    remainingTime: '00:40:13',
    history: [
      { date: '2026-04-07', pcId: 'PC-09', start: '14:40', end: '15:40' },
      { date: '2026-04-02', pcId: 'PC-03', start: '10:00', end: '11:30' },
    ],
  },
]

function App() {
  const [search, setSearch] = useState('')
  const [selectedUserId, setSelectedUserId] = useState(users[0].id)

  const filteredUsers = useMemo(() => {
    const keyword = search.trim().toLowerCase()
    if (!keyword) return users

    return users.filter(
      (user) =>
        user.name.toLowerCase().includes(keyword) ||
        user.studentId.includes(keyword) ||
        user.pcId.toLowerCase().includes(keyword),
    )
  }, [search])

  const selectedUser =
    filteredUsers.find((user) => user.id === selectedUserId) ?? filteredUsers[0] ?? null

  const handleRestrictUser = () => {
    if (!selectedUser) return
    const ok = window.confirm(`${selectedUser.name} 사용자를 제한하시겠습니까?`)
    if (ok) window.alert('임시 처리: 사용자 제한 요청을 보냈습니다.')
  }

  const handleForceShutdown = () => {
    if (!selectedUser) return
    const ok = window.confirm(`${selectedUser.pcId} PC를 강제 종료하시겠습니까?`)
    if (ok) window.alert('임시 처리: PC 강제 종료 요청을 보냈습니다.')
  }

  return (
    <div className="admin-page">
      <header className="admin-header">
        <h1>관리자 화면</h1>
        <p>실습실 PC 사용 관리 시스템</p>
      </header>

      <main className="admin-content">
        <aside className="user-panel card">
          <div className="panel-top">
            <input
              type="text"
              placeholder="학번 / 이름 / PC 검색"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-input"
            />
          </div>

          <h2 className="panel-title">사용자 목록</h2>

          <div className="user-list">
            {filteredUsers.length === 0 ? (
              <div className="empty-box">검색 결과가 없습니다.</div>
            ) : (
              filteredUsers.map((user) => (
                <button
                  key={user.id}
                  className={`user-item ${selectedUser?.id === user.id ? 'active' : ''}`}
                  onClick={() => setSelectedUserId(user.id)}
                >
                  <div className="user-avatar">{user.name[0]}</div>

                  <div className="user-text">
                    <strong>{user.name}</strong>
                    <span>{user.studentId}</span>
                    <span className="pc-label">{user.pcId}</span>
                  </div>

                  <div className="user-badges">
                    <span className={`status-badge ${user.status === '사용 중' ? 'using' : 'ended'}`}>
                      {user.status}
                    </span>
                    {user.restricted && <span className="restricted-badge">제한됨</span>}
                  </div>
                </button>
              ))
            )}
          </div>
        </aside>

        <section className="detail-panel">
          <div className="toolbar card">
            <div className="toolbar-left">
              <button className="toolbar-chip active">최근 7일</button>
              <button className="toolbar-chip">전체</button>
            </div>
            <div className="toolbar-right">
              <button className="toolbar-button">필터</button>
            </div>
          </div>

          {selectedUser ? (
            <>
              <section className="card session-card">
                <h2 className="panel-title">현재 세션 정보</h2>

                <div className="session-grid">
                  <div className="info-box">
                    <span className="info-label">이름</span>
                    <strong>{selectedUser.name}</strong>
                  </div>

                  <div className="info-box">
                    <span className="info-label">학번</span>
                    <strong>{selectedUser.studentId}</strong>
                  </div>

                  <div className="info-box">
                    <span className="info-label">PC 번호</span>
                    <strong>{selectedUser.pcId}</strong>
                  </div>

                  <div className="info-box">
                    <span className="info-label">상태</span>
                    <strong>{selectedUser.status}</strong>
                  </div>

                  <div className="info-box">
                    <span className="info-label">시작 시간</span>
                    <strong>{selectedUser.startTime}</strong>
                  </div>

                  <div className="info-box">
                    <span className="info-label">종료 예정 시간</span>
                    <strong>{selectedUser.endTime}</strong>
                  </div>
                </div>

                <div className="remaining-box">
                  <div>
                    <span className="info-label">남은 시간</span>
                    <strong className="remaining-time">{selectedUser.remainingTime}</strong>
                  </div>

                  <div className="session-tags">
                    <span className={`status-badge ${selectedUser.status === '사용 중' ? 'using' : 'ended'}`}>
                      {selectedUser.status}
                    </span>
                    {selectedUser.restricted && <span className="restricted-badge">제한 상태</span>}
                  </div>
                </div>
              </section>

              <section className="card history-card">
                <h2 className="panel-title">세션 히스토리</h2>

                <div className="table-wrapper">
                  <table>
                    <thead>
                      <tr>
                        <th>날짜</th>
                        <th>PC ID</th>
                        <th>시작 시간</th>
                        <th>종료 시간</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedUser.history.map((item, index) => (
                        <tr key={`${item.date}-${item.pcId}-${index}`}>
                          <td>{item.date}</td>
                          <td>{item.pcId}</td>
                          <td>{item.start}</td>
                          <td>{item.end}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              <div className="action-row">
                <button className="danger-button" onClick={handleRestrictUser}>
                  사용자 제한
                </button>
                <button className="dark-button" onClick={handleForceShutdown}>
                  PC 강제 종료
                </button>
              </div>
            </>
          ) : (
            <section className="card empty-state">
              <h2 className="panel-title">선택된 사용자가 없습니다</h2>
              <p>왼쪽 목록에서 사용자를 선택하세요.</p>
            </section>
          )}
        </section>
      </main>
    </div>
  )
}

export default App
