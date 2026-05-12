import { useEffect, useMemo, useState } from 'react'
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

const parseDurationToSeconds = (duration) => {
  const [hours, minutes, seconds] = duration.split(':').map(Number)
  return hours * 3600 + minutes * 60 + seconds
}

const formatDuration = (totalSeconds) => {
  const safeSeconds = Math.max(totalSeconds, 0)
  const hours = Math.floor(safeSeconds / 3600)
  const minutes = Math.floor((safeSeconds % 3600) / 60)
  const seconds = safeSeconds % 60

  return [hours, minutes, seconds].map((value) => String(value).padStart(2, '0')).join(':')
}

const createRemainingTimeMap = (sourceUsers = users) =>
  sourceUsers.reduce((acc, user) => {
    acc[user.id] = parseDurationToSeconds(user.remainingTime)
    return acc
  }, {})

function LoginDraft({ onLoginSuccess }) {
  return (
    <section className="draft-screen draft-large card login-draft">
      <h2 className="panel-title">관리자 로그인 화면 시안</h2>
      <div className="draft-form">
        <label>관리자 ID</label>
        <input className="search-input" placeholder="관리자 ID 입력" />
        <label>비밀번호</label>
        <input className="search-input" type="password" placeholder="비밀번호 입력" />
        <button className="toolbar-button" onClick={onLoginSuccess}>관리자 로그인</button>
      </div>
    </section>
  )
}

function UserMainDraft({ onLogout }) {
  const [authCode, setAuthCode] = useState('')
  const [sessionStarted, setSessionStarted] = useState(false)
  const [sessionTimeLeft, setSessionTimeLeft] = useState(parseDurationToSeconds('00:32:15'))
  const [codeTimeLeft, setCodeTimeLeft] = useState(180)

  useEffect(() => {
    if (sessionStarted || codeTimeLeft <= 0) return undefined

    const timerId = window.setInterval(() => {
      setCodeTimeLeft((prev) => Math.max(prev - 1, 0))
    }, 1000)

    return () => window.clearInterval(timerId)
  }, [sessionStarted, codeTimeLeft])

  useEffect(() => {
    if (!sessionStarted || sessionTimeLeft <= 0) return undefined

    const timerId = window.setInterval(() => {
      setSessionTimeLeft((prev) => Math.max(prev - 1, 0))
    }, 1000)

    return () => window.clearInterval(timerId)
  }, [sessionStarted, sessionTimeLeft])

  const formattedSessionTime = formatDuration(sessionTimeLeft)
  const shouldShowEndWarning = sessionStarted && sessionTimeLeft <= 600 && sessionTimeLeft > 0

  const handleExtensionRequest = () => {
    setSessionTimeLeft((prev) => prev + 1800)
    window.alert('시안 처리: 사용 시간이 30분 연장되었습니다.')
  }

  const formattedCodeTime = `${String(Math.floor(codeTimeLeft / 60)).padStart(2, '0')}:${String(
    codeTimeLeft % 60,
  ).padStart(2, '0')}`

  const resetAuthCode = () => {
    setAuthCode('')
    setCodeTimeLeft(180)
  }

  const handleCodeSubmit = () => {
    if (codeTimeLeft === 0) {
      window.alert('인증코드 유효시간이 만료되었습니다. 다시 입력해주세요.')
      resetAuthCode()
      return
    }

    if (authCode.trim().length === 6) {
      setSessionTimeLeft(parseDurationToSeconds('00:32:15'))
      setSessionStarted(true)
      return
    }

    window.alert('6자리 인증코드를 입력해주세요.')
  }

  return (
    <section className="draft-screen draft-large card user-draft">
      <h2 className="panel-title">
        {sessionStarted ? '일반 사용자 메인 화면 시안' : '인증코드 입력 화면 시안'}
      </h2>

      {!sessionStarted ? (
        <>
          <div className="waiting-box code-input-box">
            <span className="info-label">모바일 앱에 표시된 인증코드를 입력하세요</span>
            <input
              className="auth-code-input"
              value={authCode}
              onChange={(e) => setAuthCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="인증코드 6자리"
              inputMode="numeric"
            />
            <p>유효시간 <strong className="countdown-time">{formattedCodeTime}</strong> 안에 입력하면 PC 사용이 시작됩니다.</p>
            {codeTimeLeft === 0 && <p className="expired-message">유효시간이 만료되었습니다. 다시 입력해주세요.</p>}
          </div>
          <div className="action-row draft-actions">
            <button className="toolbar-button draft-cta" onClick={handleCodeSubmit}>
              인증코드 확인
            </button>
            <button className="dark-button draft-cta" onClick={resetAuthCode}>
              다시 입력
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="session-grid">
            <div className="info-box">
              <span className="info-label">남은 시간</span>
              <strong className="remaining-time">{formattedSessionTime}</strong>
            </div>
            <div className="info-box">
              <span className="info-label">PC 상태</span>
              <strong>사용 중</strong>
            </div>
          </div>
          <div className="remaining-box">
            <div>
              <span className="info-label">종료 예정 시간</span>
              <strong>2026-05-09 15:20</strong>
            </div>
            <div className="session-tags">
              <span className="status-badge using">사용 중</span>
            </div>
          </div>
          {shouldShowEndWarning && (
            <div className="end-warning-box">
              사용 종료 10분 전입니다. 필요한 경우 사용 시간 연장 신청을 진행해주세요.
            </div>
          )}
          <div className="action-row draft-actions">
            <button className="toolbar-button draft-cta" onClick={handleExtensionRequest}>사용 시간 연장 신청</button>
            <button
              className="dark-button draft-cta"
              onClick={() => {
                setSessionStarted(false)
                setSessionTimeLeft(parseDurationToSeconds('00:32:15'))
                resetAuthCode()
                onLogout?.()
              }}
            >
              로그아웃
            </button>
          </div>
        </>
      )}
    </section>
  )
}

function AdminDashboard() {
  const [adminUsers, setAdminUsers] = useState(users)
  const [search, setSearch] = useState('')
  const [selectedUserId, setSelectedUserId] = useState(users[0].id)
  const [rangeMode, setRangeMode] = useState('recent')
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [statusFilter, setStatusFilter] = useState('all')
  const [restrictedOnly, setRestrictedOnly] = useState(false)
  const [adminRemainingTimes, setAdminRemainingTimes] = useState(createRemainingTimeMap)

  useEffect(() => {
    const timerId = window.setInterval(() => {
      setAdminRemainingTimes((prev) => {
        const next = { ...prev }
        adminUsers.forEach((user) => {
          if (user.status === '사용 중' && !user.restricted) {
            next[user.id] = Math.max((next[user.id] ?? 0) - 1, 0)
          }
        })
        return next
      })
    }, 1000)

    return () => window.clearInterval(timerId)
  }, [adminUsers])

  const filteredUsers = useMemo(() => {
    const keyword = search.trim().toLowerCase()

    return adminUsers.filter((user) => {
      const keywordMatch =
        !keyword ||
        user.name.toLowerCase().includes(keyword) ||
        user.studentId.includes(keyword) ||
        user.pcId.toLowerCase().includes(keyword)

      const statusMatch = statusFilter === 'all' || user.status === statusFilter
      const restrictedMatch = !restrictedOnly || user.restricted

      return keywordMatch && statusMatch && restrictedMatch
    })
  }, [adminUsers, search, statusFilter, restrictedOnly])

  const selectedUser =
    filteredUsers.find((user) => user.id === selectedUserId) ?? filteredUsers[0] ?? null

  const selectedHistory = useMemo(() => {
    if (!selectedUser) return []
    if (rangeMode === 'all') return selectedUser.history
    return selectedUser.history.slice(0, 2)
  }, [selectedUser, rangeMode])

  const handleToggleRestriction = () => {
    if (!selectedUser) return

    const nextRestricted = !selectedUser.restricted
    const actionLabel = nextRestricted ? '제한' : '제한 해제'
    const ok = window.confirm(`${selectedUser.name} 사용자를 ${actionLabel}하시겠습니까?`)

    if (ok) {
      setAdminUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === selectedUser.id ? { ...user, restricted: nextRestricted } : user,
        ),
      )
      window.alert(`${selectedUser.name} 사용자가 ${nextRestricted ? '제한' : '제한 해제'} 상태로 변경되었습니다.`)
    }
  }

  const handleForceShutdown = () => {
    if (!selectedUser) return
    const ok = window.confirm(`${selectedUser.pcId} PC를 강제 종료하시겠습니까?`)

    if (ok) {
      setAdminUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === selectedUser.id ? { ...user, status: '종료', remainingTime: '00:00:00' } : user,
        ),
      )
      setAdminRemainingTimes((prevTimes) => ({ ...prevTimes, [selectedUser.id]: 0 }))
      window.alert(`${selectedUser.pcId} 강제 종료가 반영되었습니다.`)
    }
  }

  return (
    <>
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
                    <span className="remain-label">남은 시간 {formatDuration(adminRemainingTimes[user.id] ?? 0)}</span>
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
              <button className={`toolbar-chip ${rangeMode === 'recent' ? 'active' : ''}`} onClick={() => setRangeMode('recent')}>최근 7일</button>
              <button className={`toolbar-chip ${rangeMode === 'all' ? 'active' : ''}`} onClick={() => setRangeMode('all')}>전체</button>
            </div>
            <div className="toolbar-right">
              <button className="toolbar-button" onClick={() => setIsFilterOpen((prev) => !prev)}>
                필터 {isFilterOpen ? '닫기' : '열기'}
              </button>
            </div>
          </div>

          {isFilterOpen && (
            <section className="card filter-panel">
              <h3>필터</h3>
              <div className="filter-grid">
                <label>
                  상태
                  <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                    <option value="all">전체</option>
                    <option value="사용 중">사용 중</option>
                    <option value="종료">종료</option>
                  </select>
                </label>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={restrictedOnly}
                    onChange={(e) => setRestrictedOnly(e.target.checked)}
                  />
                  제한 사용자만 보기
                </label>
              </div>
            </section>
          )}

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
                    <strong className="remaining-time">{formatDuration(adminRemainingTimes[selectedUser.id] ?? 0)}</strong>
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
                      {selectedHistory.map((item, index) => (
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
                <button className="danger-button" onClick={handleToggleRestriction}>
                  {selectedUser.restricted ? '사용자 제한 해제' : '사용자 제한'}
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
    </>
  )
}

function StartScreen({ onSelectAdminLogin, onSelectUserAuth }) {
  return (
    <section className="draft-screen draft-large card start-screen">
      <h1>실습실 PC 사용 관리 시스템</h1>
      <p>사용 목적을 선택해주세요.</p>

      <div className="start-option-grid">
        <button className="start-option" onClick={onSelectAdminLogin}>
          <span>관리자</span>
          <strong>관리자 로그인</strong>
          <small>사용자 목록, 세션 조회, 사용자 제한, PC 강제 종료</small>
        </button>
        <button className="start-option" onClick={onSelectUserAuth}>
          <span>일반 사용자</span>
          <strong>인증코드 입력</strong>
          <small>모바일 앱에 표시된 코드를 입력하고 PC 사용 시작</small>
        </button>
      </div>
    </section>
  )
}

function App() {
  const [screen, setScreen] = useState('start')

  return (
    <div className="admin-page">
      {screen !== 'start' && (
        <div className="screen-tabs">
          <button onClick={() => setScreen('start')}>처음 화면</button>
          {screen === 'admin' && <button className="active">관리자 화면</button>}
          {screen === 'login' && <button className="active">관리자 로그인</button>}
          {screen === 'user' && <button className="active">인증코드 입력</button>}
        </div>
      )}

      {screen === 'start' && (
        <StartScreen
          onSelectAdminLogin={() => setScreen('login')}
          onSelectUserAuth={() => setScreen('user')}
        />
      )}
      {screen === 'login' && <LoginDraft onLoginSuccess={() => setScreen('admin')} />}
      {screen === 'user' && <UserMainDraft onLogout={() => setScreen('start')} />}
      {screen === 'admin' && <AdminDashboard />}
    </div>
  )
}

export default App
