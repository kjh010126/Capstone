# PC 앱 클래스 다이어그램 설명 문서

## 1. 문서 개요
이 문서는 최신 PC 앱 클래스 다이어그램을 기준으로 각 클래스의 기능, 주요 어트리뷰트, 주요 메소드, 역할을 발표용으로 정리한 문서이다.

기준 문서
- PC앱 클래스 다이어그램.pdf
- 요구사항 명세서.pdf
- 유스케이스 시나리오.pdf
- README.md

## 2. 클래스 분류
PC 앱 클래스는 다음 네 영역으로 구분할 수 있다.

- 화면 계층(UI / Boundary)
- 제어 계층(Control / Manager)
- 도메인 계층(Entity / Model)
- 보조 데이터 계층(Value / Request)

---

## 3. 화면 계층(UI / Boundary)

### 3.1 PcLoginScreen
기능: 일반 사용자가 PC 앱에 로그인하는 화면이다.

주요 어트리뷰트
- `userId: String` : 일반 사용자 ID 또는 학번 입력값
- `password: String` : 비밀번호 입력값

주요 메소드
- `inputUserId(): void` : 사용자 ID 입력 처리
- `inputPassword(): void` : 비밀번호 입력 처리
- `requestLogin(): void` : 로그인 요청 수행
- `moveToAdminLogin(): void` : 관리자 로그인 화면으로 이동

역할
- PC 앱의 첫 진입 화면이다.
- 일반 사용자 로그인 흐름과 관리자 로그인 분기점을 제공한다.
- `UserAuthManager`와 연결되어 인증 요청을 전달한다.

### 3.2 PcUserMainScreen
기능: 일반 사용자가 로그인한 뒤 보는 PC 앱 메인 화면이다.

주요 어트리뷰트
- `authCode: String` : 화면에 표시할 인증 코드
- `remainingTime: Number` : 남은 사용 시간
- `notifications: List<Notification>` : 종료 알림 목록

주요 메소드
- `displayAuthCode(): void` : 인증 코드 표시
- `showRemainingTime(): void` : 남은 시간 표시
- `showNotifications(): void` : 알림 표시
- `requestExtension(): void` : 사용 시간 연장 요청

역할
- 인증 코드 표시, 사용 시간 확인, 종료 알림 확인을 담당한다.
- PC 앱에서 일반 사용자가 가장 많이 보게 되는 핵심 화면이다.
- `AuthCodeManager`, `SessionManager`, `ShutdownManager`의 결과를 화면에 반영한다.

### 3.3 AdminLoginScreen
기능: 관리자가 관리자 계정으로 로그인하는 화면이다.

주요 어트리뷰트
- `adminId: String` : 관리자 ID 입력값
- `password: String` : 관리자 비밀번호 입력값

주요 메소드
- `inputAdminId(): void` : 관리자 ID 입력 처리
- `inputPassword(): void` : 비밀번호 입력 처리
- `requestLogin(): void` : 관리자 로그인 요청
- `moveToDashboard(): void` : 관리자 대시보드 화면으로 이동

역할
- 일반 사용자 로그인과 분리된 관리자 전용 인증 화면이다.
- `AdminAuthManager`와 연결되어 관리자 인증을 수행한다.

### 3.4 AdminDashboardScreen
기능: 관리자가 사용자와 세션을 조회하고 제어하는 메인 화면이다.

주요 어트리뷰트
- `selectedUser: User` : 현재 선택된 사용자
- `filterKeyword: String` : 검색 또는 필터 키워드

주요 메소드
- `searchUser(): void` : 사용자 검색
- `selectUser(userId: String): void` : 특정 사용자 선택
- `restrictUser(userId: String): void` : 부정 사용자 제한
- `forceShutdown(pcId: String): void` : 특정 PC 강제 종료

역할
- 관리자 기능의 중심 화면이다.
- 사용자 조회, 현재 세션 조회, 세션 히스토리 조회, 제어 기능을 통합한다.
- `UserListPanel`, `SessionInfoPanel`, `SessionHistoryPanel`을 포함한다.

### 3.5 UserListPanel
기능: 관리자 화면에서 사용자 목록을 표시하는 패널이다.

주요 어트리뷰트
- `users: List<User>` : 표시할 사용자 목록

주요 메소드
- `renderUsers(): void` : 사용자 목록 렌더링
- `selectUser(userId: String): void` : 사용자 선택

역할
- 관리자 화면의 좌측 목록 영역을 담당한다.
- 선택된 사용자 정보를 상위 화면에 전달한다.

### 3.6 SessionInfoPanel
기능: 선택한 사용자의 현재 세션 정보를 표시하는 패널이다.

주요 어트리뷰트
- `session: Session` : 현재 세션 정보

주요 메소드
- `renderSessionInfo(): void` : 세션 정보 렌더링

역할
- 관리자 화면에서 현재 사용 현황을 구체적으로 보여준다.
- 선택한 사용자의 시작 시간, 종료 예정 시간, 남은 시간 등을 표현한다.

### 3.7 SessionHistoryPanel
기능: 선택한 사용자의 과거 사용 이력을 표시하는 패널이다.

주요 어트리뷰트
- `histories: List<SessionHistory>` : 세션 이력 목록

주요 메소드
- `renderHistory(): void` : 세션 이력 렌더링

역할
- 관리자 화면에서 과거 사용 이력을 시간순으로 보여준다.
- 현재 세션 정보와 함께 사용자 이용 패턴을 확인할 수 있게 한다.

---

## 4. 제어 계층(Control / Manager)

### 4.1 UserAuthManager
기능: 일반 사용자 로그인, 로그아웃, 현재 로그인 상태 유지를 담당한다.

주요 어트리뷰트
- `currentSession: UserSession` : 현재 로그인한 일반 사용자 세션
- `isAuthenticated: Boolean` : 로그인 여부

주요 메소드
- `login(userId: String, password: String): Boolean` : 일반 사용자 로그인 수행
- `logout(): void` : 로그아웃 수행
- `validateUser(): Boolean` : 로그인 상태 유효성 확인

역할
- 일반 사용자 인증 책임을 화면 계층에서 분리한 클래스다.
- `PcLoginScreen`과 `PcUserMainScreen` 사이의 인증 상태를 관리한다.

### 4.2 AuthCodeManager
기능: 인증 코드 발급, 재발급, 유효성 상태 관리를 담당한다.

주요 어트리뷰트
- `currentCode: AuthCode` : 현재 활성화된 인증 코드

주요 메소드
- `issueCode(): AuthCode` : 새 인증 코드 발급
- `reissueCode(): AuthCode` : 인증 코드 재발급
- `validateCodeState(): Boolean` : 현재 인증 코드 상태 검증

역할
- 일반 사용자 메인 화면에 표시할 인증 코드를 관리한다.
- PC 사용 인증의 출발점이 되는 코드를 다루는 핵심 클래스다.

### 4.3 SessionManager
기능: 사용 시간 조회, 세션 관리, 연장 요청을 담당한다.

주요 어트리뷰트
- `currentSession: Session` : 현재 진행 중인 PC 사용 세션
- `histories: List<SessionHistory>` : 세션 히스토리 목록

주요 메소드
- `getCurrentSession(): Session` : 현재 세션 조회
- `updateRemainingTime(): Number` : 남은 시간 계산 또는 갱신
- `getSessionHistory(userId: String): List<SessionHistory>` : 특정 사용자의 세션 이력 조회
- `requestExtension(): ExtensionRequest` : 연장 요청 생성
- `closeSession(): void` : 세션 종료

역할
- 실제 PC 사용 상태를 관리하는 핵심 클래스다.
- 사용 시간, 종료 예정 시간, 세션 이력 관리 역할을 맡는다.

### 4.4 AdminAuthManager
기능: 관리자 로그인, 로그아웃, 관리자 로그인 상태 유지를 담당한다.

주요 어트리뷰트
- `currentSession: AdminSession` : 현재 로그인한 관리자 세션
- `isAuthenticated: Boolean` : 관리자 인증 여부

주요 메소드
- `login(adminId: String, password: String): Boolean` : 관리자 로그인 수행
- `logout(): void` : 관리자 로그아웃 수행
- `validateAdmin(): Boolean` : 관리자 세션 유효성 확인

역할
- 관리자 인증 책임을 전담한다.
- `AdminLoginScreen`과 `AdminDashboardScreen`의 접근 제어를 담당한다.

### 4.5 AdminManager
기능: 관리자 조회 기능과 제어 기능을 담당한다.

주요 어트리뷰트
- `users: List<User>` : 관리 대상 사용자 목록
- `sessions: List<Session>` : 관리 대상 세션 목록

주요 메소드
- `getUsers(): List<User>` : 전체 사용자 조회
- `getSessionInfo(userId: String): Session` : 특정 사용자의 현재 세션 조회
- `getSessionHistory(userId: String): List<SessionHistory>` : 특정 사용자의 과거 이력 조회
- `restrictUser(userId: String): void` : 부정 사용자 제한
- `forceShutdown(pcId: String): void` : 특정 PC 강제 종료 명령

역할
- 관리자 기능 전체를 실제로 수행하는 핵심 로직 클래스다.
- 대시보드 화면에서 요청한 조회·제어 기능을 처리한다.

### 4.6 ShutdownManager
기능: 자동 종료와 강제 종료를 담당한다.

주요 어트리뷰트
- `targetPc: PC` : 종료 대상 PC

주요 메소드
- `scheduleAutoShutdown(): void` : 자동 종료 예약
- `cancelAutoShutdown(): void` : 자동 종료 취소
- `forceShutdown(pcId: String): void` : 특정 PC 강제 종료 수행

역할
- 요구사항의 자동 종료 기능을 실제로 반영하는 클래스다.
- 일반 사용자 종료 시점 처리와 관리자 강제 종료 처리를 함께 맡는다.

---

## 5. 도메인 계층(Entity / Model)

### 5.1 User
기능: 일반 사용자 계정 정보를 표현한다.

주요 어트리뷰트
- `userId: String` : 내부 사용자 식별자
- `studentId: String` : 학번
- `name: String` : 이름
- `email: String` : 이메일
- `password: String` : 비밀번호
- `restricted: Boolean` : 제한 여부

주요 메소드
- 별도 메소드 없음

역할
- 일반 사용자에 대한 기본 데이터 모델이다.
- 로그인, 세션, 관리자 제어 기능의 기준 데이터로 사용된다.

### 5.2 UserSession
기능: 현재 로그인한 일반 사용자의 세션 정보를 표현한다.

주요 어트리뷰트
- `userSessionId: String` : 일반 사용자 로그인 세션 식별자
- `loginTime: DateTime` : 로그인 시각
- `logoutTime: DateTime` : 로그아웃 시각
- `status: SessionStatus` : 세션 상태

주요 메소드
- `startSession(): void` : 사용자 세션 시작
- `endSession(): void` : 사용자 세션 종료
- `validateSession(): Boolean` : 세션 유효성 확인

역할
- 일반 사용자 로그인 상태를 관리하는 데이터 모델이다.
- 실제 PC 사용 세션인 `Session`과는 구분되는 로그인 세션이다.

### 5.3 Admin
기능: 관리자 계정 정보를 표현한다.

주요 어트리뷰트
- `adminId: String` : 관리자 계정 식별자
- `name: String` : 관리자 이름
- `email: String` : 관리자 이메일
- `password: String` : 관리자 비밀번호

주요 메소드
- 별도 메소드 없음

역할
- 관리자 인증과 관리자 세션의 기준이 되는 데이터 모델이다.

### 5.4 AdminSession
기능: 현재 로그인한 관리자 세션 정보를 표현한다.

주요 어트리뷰트
- `adminSessionId: String` : 관리자 세션 식별자
- `loginTime: DateTime` : 로그인 시각
- `logoutTime: DateTime` : 로그아웃 시각
- `status: SessionStatus` : 세션 상태

주요 메소드
- `startSession(): void` : 관리자 세션 시작
- `endSession(): void` : 관리자 세션 종료
- `validateSession(): Boolean` : 세션 유효성 확인

역할
- 관리자 로그인 상태를 관리하는 데이터 모델이다.
- 대시보드 접근 가능 여부를 판단하는 기준이 된다.

### 5.5 PC
기능: 실습실 PC 자체의 정보를 표현한다.

주요 어트리뷰트
- `pcId: String` : PC 식별자
- `location: String` : 설치 위치
- `status: PCStatus` : 현재 상태
- `ipAddress: String` : IP 주소

주요 메소드
- `displayCode(): void` : 인증 코드 표시
- `autoShutdown(): void` : 자동 종료 수행
- `forceShutdown(): void` : 강제 종료 수행

역할
- 관리 대상 하드웨어를 표현하는 핵심 엔티티다.
- 인증 코드 표시, 자동 종료, 강제 종료의 대상이 된다.

### 5.6 Session
기능: 실제 PC 사용 세션을 표현한다.

주요 어트리뷰트
- `sessionId: String` : 사용 세션 식별자
- `userId: String` : 사용자 식별자
- `pcId: String` : PC 식별자
- `startTime: DateTime` : 사용 시작 시각
- `endTime: DateTime` : 종료 예정 시각 또는 종료 시각
- `remainingTime: Number` : 남은 시간
- `status: SessionStatus` : 세션 상태

주요 메소드
- `extend(): void` : 사용 시간 연장
- `close(): void` : 세션 종료
- `getRemainingTime(): Number` : 남은 시간 계산 또는 반환

역할
- 로그인 세션과 구분되는 실제 PC 사용 세션이다.
- 사용 시간 확인, 연장, 종료, 관리자 조회의 중심 데이터다.

### 5.7 SessionHistory
기능: 과거 사용 이력을 표현한다.

주요 어트리뷰트
- `historyId: String` : 이력 식별자
- `userId: String` : 사용자 식별자
- `pcId: String` : PC 식별자
- `usedAt: DateTime` : 사용 날짜
- `startTime: DateTime` : 시작 시각
- `endTime: DateTime` : 종료 시각

주요 메소드
- `getHistory(): List<SessionHistory>` : 이력 조회

역할
- 과거 사용 기록을 데이터로 유지하는 클래스다.
- 관리자 화면의 세션 히스토리 패널에서 활용된다.

### 5.8 AuthCode
기능: PC 인증 코드를 표현한다.

주요 어트리뷰트
- `codeId: String` : 인증 코드 식별자
- `pcId: String` : 해당 PC 식별자
- `code: String` : 실제 인증 코드 값
- `expiresAt: DateTime` : 만료 시각

주요 메소드
- 별도 메소드 없음

역할
- PC 사용 인증의 핵심 데이터 모델이다.
- `AuthCodeManager`가 발급하고 `PcUserMainScreen`이 표시한다.

### 5.9 Notification
기능: 종료 시간 알림 정보를 표현한다.

주요 어트리뷰트
- `notifyId: String` : 알림 식별자
- `sessionId: String` : 연관 세션 식별자
- `type: NotifyType` : 알림 유형
- `sentAt: DateTime` : 알림 전송 시각
- `message: String` : 알림 메시지

주요 메소드
- 별도 메소드 없음

역할
- 종료 10분 전 알림과 같은 시스템 알림 정보를 저장한다.
- 일반 사용자 메인 화면과 모바일 앱에 함께 표시되는 대상 데이터다.

### 5.10 ExtensionRequest
기능: 사용 시간 연장 요청 정보를 표현한다.

주요 어트리뷰트
- `requestId: String` : 연장 요청 식별자
- `sessionId: String` : 대상 세션 식별자
- `requestedAt: DateTime` : 요청 시각
- `status: RequestStatus` : 요청 상태

주요 메소드
- `request(): void` : 연장 요청 생성
- `validate(): Boolean` : 연장 가능 여부 검증

역할
- 연장 신청 기능을 데이터로 표현하는 클래스다.
- 사용자가 PC 앱 또는 모바일 앱에서 요청한 연장 정보를 관리한다.

---

## 6. 발표용 정리 포인트
1. `PcLoginScreen`과 `AdminLoginScreen`을 분리해서 일반 사용자와 관리자의 로그인 흐름을 구분했다.
2. `UserSession`과 `AdminSession`을 분리해서 로그인 상태를 명확히 모델링했다.
3. `Session`은 로그인 세션이 아니라 실제 PC 사용 세션이라는 점이 핵심이다.
4. `PcUserMainScreen`은 인증 코드 표시, 사용 시간 확인, 알림 확인, 연장 요청을 담당한다.
5. `AdminDashboardScreen`은 조회와 제어 기능을 통합한 관리자 중심 화면이다.
6. `AuthCodeManager`, `SessionManager`, `AdminManager`, `ShutdownManager`로 제어 책임을 분리했다.

## 7. 한 줄 결론
이 클래스 다이어그램은 PC 앱을 일반 사용자 기능과 관리자 기능이 공존하는 구조로 보고, 로그인, 인증 코드, 사용 세션, 관리자 제어를 각 계층별 클래스로 나누어 설계한 것이다.
