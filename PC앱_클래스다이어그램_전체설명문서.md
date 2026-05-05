# PC 앱 클래스 다이어그램 설명 문서

## 1. 문서 개요
본 문서는 실습실 PC 사용 관리 시스템의 **PC 앱 클래스 다이어그램**에 대한 설명 문서이다.  
현재 PC 앱 클래스 다이어그램은 변경된 요구사항을 반영하여, 일반 사용자 PC 로그인 기능을 제거하고 **모바일 앱에서 표시한 인증 코드를 PC 앱에서 입력하는 구조**로 수정되었다.

또한 일반 사용자 흐름과 관리자 흐름을 분리하되, 클래스 수를 불필요하게 늘리지 않고 책임을 명확하게 구분하는 방향으로 정리하였다.

본 다이어그램은 다음 PC 앱 기능을 반영한다.

- 인증 코드 입력 및 검증
- 인증 완료 후 일반 사용자 메인 화면 전환
- 사용 시간 표시
- 종료 알림 표시
- 사용 시간 연장 신청
- 연장 신청 미수행 시 자동 로그아웃
- 자동 종료
- 관리자 로그인
- 사용자 계정 조회 및 제한
- 사용자 세션 조회
- 특정 PC 강제 종료

## 2. 설계 원칙
이번 클래스 다이어그램은 다음 원칙에 따라 구성하였다.

### 2.1 화면 클래스는 입력과 표시를 담당한다
화면 클래스는 사용자의 입력을 받고 결과를 보여주는 역할만 담당한다.  
실제 코드 검증, 세션 조회, 연장 신청 처리, 자동 로그아웃, 자동 종료, 관리자 제어 같은 비즈니스 로직은 화면이 직접 수행하지 않는다.

### 2.2 매니저 클래스는 처리 로직을 담당한다
관리자 로그인, 인증 코드 검증, 세션 관리, 연장 신청, 자동 로그아웃, 자동 종료, 관리자 제어 같은 실제 기능 수행은 매니저 클래스가 담당한다.

### 2.3 엔티티 클래스는 데이터 보관을 담당한다
계정 정보, PC 정보, 세션 정보처럼 시스템이 유지해야 하는 핵심 데이터는 엔티티 클래스가 담당한다.

### 2.4 변경된 요구사항을 최소 수정으로 반영하였다
기존 구조에서는 일반 사용자 PC 로그인과 인증 코드 표시가 PC 앱 중심으로 설계되어 있었지만, 현재는 다음과 같이 바뀌었다.

- 일반 사용자 로그인은 모바일 앱에서 수행한다.
- 모바일 앱이 인증 코드를 표시한다.
- PC 앱은 인증 코드를 입력받아 검증한다.
- 연장 신청이 없으면 자동 로그아웃된다.

이 요구사항을 반영하기 위해 기존 구조를 크게 늘리지 않고, 기존 클래스의 역할과 속성, 메소드를 조정하는 방식으로 수정하였다.

## 3. 전체 클래스 구성
최종 클래스 구성은 다음과 같다.

### 3.1 화면 클래스
- AdminLoginScreen
- PcMainScreen
- AdminDashboardScreen

### 3.2 매니저 클래스
- AdminAuthManager
- PcUsageManager
- AdminManager

### 3.3 엔티티 클래스
- Account
- PC
- Session

## 4. 단순화 및 수정 내역
기존 구조에서 클래스 수를 유지하거나 줄이는 방향으로 다음과 같이 정리하였다.

- 일반 사용자 PC 로그인 화면은 제거하고, 관리자 전용 로그인 화면만 유지하였다.
- 기존 `LoginScreen`은 **AdminLoginScreen** 역할로 정리하였다.
- 일반 사용자의 코드 인증은 **PcMainScreen 내부에서 처리**하도록 정리하였다.
- 기존 인증 코드 발급 중심 구조를 제거하고, **인증 코드 검증 중심 구조**로 변경하였다.
- `PcUsageManager`는 인증 코드 발급이 아니라 **인증 코드 검증, 세션 관리, 연장 신청, 자동 로그아웃, 자동 종료**를 담당하도록 수정하였다.
- 관리자 기능은 기존처럼 `AdminDashboardScreen`과 `AdminManager`를 중심으로 유지하였다.

즉, 관리자 로그인 흐름은 `AdminLoginScreen`과 `AdminAuthManager`로,  
일반 사용자 PC 사용 흐름은 `PcMainScreen`과 `PcUsageManager`로,  
관리자 조회 및 제어 흐름은 `AdminDashboardScreen`과 `AdminManager`로 정리하였다.

## 5. 클래스별 상세 설명

### 5.1 AdminLoginScreen
#### 역할
관리자 계정 로그인 화면이다.  
관리자가 관리자 ID와 비밀번호를 입력하여 관리자 기능에 진입할 수 있도록 한다.

#### 어트리뷰트
- `inputId: String`  
  입력한 관리자 ID를 저장한다.
- `password: String`  
  입력한 관리자 비밀번호를 저장한다.

#### 메소드
- `submitLogin(): void`  
  현재 입력된 관리자 ID와 비밀번호를 기반으로 로그인 요청을 보낸다.

#### 설명
이 클래스는 관리자 로그인 화면 자체만 담당한다.  
실제 관리자 인증 여부 판단은 `AdminAuthManager`가 수행한다.

### 5.2 PcMainScreen
#### 역할
일반 사용자가 PC 앱에서 사용하는 메인 화면이다.  
처음에는 **인증 코드 입력 화면**으로 동작하고, 인증이 완료되면 사용 시간, 종료 예정 시간, 종료 알림을 표시하며 연장 신청과 로그아웃 기능을 사용할 수 있도록 한다.

#### 어트리뷰트
- `inputCode: String`  
  사용자가 입력한 인증 코드를 저장한다.
- `isVerified: Boolean`  
  현재 인증이 완료되었는지 여부를 나타낸다.
- `currentSession: Session`  
  인증 완료 후 현재 사용 중인 세션 정보를 참조한다.

#### 메소드
- `submitCode(): void`  
  사용자가 입력한 인증 코드를 검증 요청으로 전달한다.
- `renderMainInfo(): void`  
  인증 완료 후 사용 시간, 종료 예정 시간, 알림 등 메인 화면 정보를 표시한다.
- `submitExtension(): void`  
  사용 시간 연장 신청 요청을 전달한다.
- `submitLogout(): void`  
  로그아웃 요청을 전달한다.

#### 설명
이 클래스는 인증 전에는 코드 입력 UI를, 인증 후에는 일반 사용자 메인 화면 UI를 담당한다.  
실제 코드 검증, 세션 조회, 연장 처리, 자동 로그아웃, 자동 종료는 `PcUsageManager`가 담당한다.

### 5.3 AdminDashboardScreen
#### 역할
관리자가 사용하는 관리자 메인 화면이다.  
사용자 계정 목록, 현재 세션 정보, 세션 히스토리를 확인하고 사용자 제한 및 강제 종료 요청을 보낼 수 있다.

#### 어트리뷰트
- `selectedAccount: Account`  
  현재 관리자 화면에서 선택된 계정이다.
- `filterKeyword: String`  
  검색 또는 필터링에 사용하는 키워드이다.

#### 메소드
- `selectAccount(): void`  
  특정 계정을 선택한다.
- `applyFilter(): void`  
  검색 및 필터를 적용한다.
- `renderAdminInfo(): void`  
  계정 정보, 세션 정보, 세션 히스토리 등 관리자 화면 정보를 표시한다.
- `submitRestriction(): void`  
  사용자 제한 요청을 전달한다.
- `submitForceShutdown(): void`  
  특정 PC 강제 종료 요청을 전달한다.

#### 설명
이 클래스는 관리자용 UI를 담당한다.  
실제 계정 제한, 세션 조회, 강제 종료 처리는 `AdminManager`가 담당한다.

### 5.4 AdminAuthManager
#### 역할
관리자 로그인, 로그아웃, 현재 인증 상태 관리를 담당한다.

#### 어트리뷰트
- `currentAccount: Account`  
  현재 로그인한 관리자 계정을 저장한다.
- `isAuthenticated: Boolean`  
  현재 관리자 로그인 상태 여부를 나타낸다.

#### 메소드
- `login(accountId: String, password: String): Boolean`  
  관리자 ID와 비밀번호를 받아 로그인 처리를 수행한다.
- `logout(): void`  
  현재 관리자 로그인 상태를 종료한다.

#### 설명
이 클래스는 관리자 인증 흐름만 담당한다.  
일반 사용자 인증은 로그인 방식이 아니라 코드 인증 방식이므로, 관리자 인증과 분리하였다.

### 5.5 PcUsageManager
#### 역할
PC 사용 흐름 전체를 담당하는 핵심 제어 클래스이다.  
인증 코드 검증, 세션 관리, 연장 신청, 자동 로그아웃, 자동 종료를 수행한다.

#### 어트리뷰트
- `currentSession: Session`  
  현재 활성화된 세션이다.

#### 메소드
- `verifyCode(inputCode: String): Boolean`  
  사용자가 입력한 인증 코드를 검증한다.
- `fetchCurrentSession(): Session`  
  현재 세션 정보를 조회한다.
- `requestExtension(): void`  
  사용 시간 연장 요청을 처리한다.
- `autoLogout(): void`  
  연장 신청이 없을 경우 자동 로그아웃 처리를 수행한다.
- `shutdownPc(): void`  
  종료 시점에 PC 종료 처리를 수행한다.

#### 설명
기존 구조에서는 인증 코드 발급 기능이 PC 앱에 있었지만, 현재는 모바일 앱이 인증 코드를 표시하므로 PC 앱은 이를 입력받아 검증하는 역할만 가진다.  
따라서 `PcUsageManager`는 인증 코드 **발급**이 아니라 인증 코드 **검증**과 세션 관리 중심으로 수정되었다.

### 5.6 AdminManager
#### 역할
관리자 기능을 실제로 처리하는 클래스이다.  
계정 조회, 세션 조회, 제한 처리, 강제 종료 요청을 담당한다.

#### 어트리뷰트
- `accounts: List<Account>`  
  관리 대상 계정 목록이다.
- `sessions: List<Session>`  
  세션 정보 목록이다.

#### 메소드
- `fetchAccounts(): List<Account>`  
  계정 목록을 조회한다.
- `fetchSessionInfo(accountId: String): Session`  
  특정 계정의 현재 세션 정보를 조회한다.
- `fetchSessionHistory(accountId: String): List<Session>`  
  특정 계정의 세션 이력을 조회한다.
- `restrictAccount(accountId: String): void`  
  특정 계정을 제한 상태로 변경한다.
- `forceShutdown(pcId: String): void`  
  특정 PC에 대해 강제 종료 요청을 보낸다.

#### 설명
관리자 화면에서 수행하는 실제 기능은 모두 `AdminManager`가 처리한다.  
또한 관리자 기능은 일반 사용자 세션 흐름과 연결되므로 `PcUsageManager`와 연계된다.

### 5.7 Account
#### 역할
시스템의 계정 정보를 표현하는 엔티티 클래스이다.  
일반 사용자와 관리자 계정을 하나의 공통 클래스로 통합하였다.

#### 어트리뷰트
- `accountId: String`  
  계정 식별자이다. 일반 사용자의 경우 학번, 관리자의 경우 관리자 ID로 사용할 수 있다.
- `name: String`  
  계정 소유자 이름이다.
- `email: String`  
  계정 이메일이다.
- `password: String`  
  계정 비밀번호이다.
- `accountType: AccountType`  
  계정 유형이다. 일반 사용자 또는 관리자 구분에 사용한다.
- `restricted: Boolean`  
  계정이 제한 상태인지 여부를 나타낸다.

#### 설명
공통 속성이 많고 역할 구분은 `accountType`으로 충분히 가능하므로 `Account` 하나로 통합하였다.

### 5.8 PC
#### 역할
실습실 PC 자체의 정보를 표현하는 엔티티 클래스이다.

#### 어트리뷰트
- `pcId: String`  
  PC 식별자이다.
- `location: String`  
  PC 설치 위치이다.
- `status: PCStatus`  
  현재 PC 상태를 나타낸다.
- `ipAddress: String`  
  PC의 네트워크 주소이다.

#### 설명
PC는 물리적인 대상이므로 세션과는 구분되는 독립 엔티티로 유지하였다.

### 5.9 Session
#### 역할
실제 PC 사용 세션을 표현하는 엔티티 클래스이다.  
현재 사용 세션과 과거 사용 이력을 모두 같은 개념으로 관리한다.

#### 어트리뷰트
- `sessionId: String`  
  세션 식별자이다.
- `startTime: DateTime`  
  세션 시작 시각이다.
- `endTime: DateTime`  
  세션 종료 예정 시각 또는 종료 시각이다.
- `remainingTime: Number`  
  현재 남은 사용 시간이다.
- `status: SessionStatus`  
  세션 상태를 나타낸다.

#### 메소드
- `close(): void`  
  세션을 종료 상태로 변경한다.

#### 설명
Session은 시간 흐름에 따라 생성되고 종료되는 사용 기록이다.  
PC와는 구분되는 시간적 객체이므로 별도 클래스로 유지하였다.

## 6. 클래스 간 관계 설명

### 6.1 의존 관계
- `AdminLoginScreen ..> AdminAuthManager`  
  관리자 로그인 화면은 관리자 인증 처리를 `AdminAuthManager`에 의존한다.
- `PcMainScreen ..> PcUsageManager`  
  일반 사용자 메인 화면은 코드 검증, 세션 조회, 연장 신청, 자동 로그아웃, 자동 종료 처리를 위해 `PcUsageManager`에 의존한다.
- `AdminDashboardScreen ..> AdminManager`  
  관리자 화면은 관리자 기능 처리를 위해 `AdminManager`에 의존한다.
- `AdminManager ..> PcUsageManager`  
  관리자 기능은 일반 사용자 세션 흐름과 연결되므로 `PcUsageManager`를 참조한다.

### 6.2 연관 관계
- `AdminAuthManager 1 --> 0..1 Account`  
  한 시점에 `AdminAuthManager`는 최대 하나의 로그인 관리자 계정을 관리한다.
- `PcMainScreen 1 --> 0..1 Session`  
  인증 전에는 세션이 없을 수 있고, 인증 완료 후에는 현재 사용 세션 하나와 연결된다.
- `AdminDashboardScreen 1 --> 0..1 Account`  
  관리자 화면은 선택된 계정이 없을 수도 있고 하나일 수도 있다.
- `Session 0..* --> 1 Account`  
  하나의 계정은 여러 세션을 가질 수 있다.
- `Session 0..* --> 1 PC`  
  하나의 PC는 여러 사용 세션 기록을 가질 수 있다.

### 6.3 집합 관계를 쓰지 않은 이유
최종 구조에서는 집합 관계를 사용하지 않았다.  
`AdminManager`나 `PcUsageManager`가 `Account`나 `Session`을 소유한다고 보기보다는, 조회하고 처리하고 참조하는 관계로 보는 것이 더 자연스럽기 때문이다.

## 7. 최종 구조의 장점
이번 클래스 다이어그램 구조의 장점은 다음과 같다.

### 7.1 클래스 수 최소화
기존 구조를 크게 늘리지 않고, 역할 재정의를 통해 변경된 요구사항을 반영하였다.

### 7.2 일반 사용자와 관리자 흐름 분리
일반 사용자는 코드 인증 기반으로, 관리자는 계정 로그인 기반으로 흐름이 분리되어 화면과 로직의 역할이 더 명확해졌다.

### 7.3 변경된 인증 정책 반영
모바일 앱 코드 표시와 PC 앱 코드 입력 구조, 연장 미신청 시 자동 로그아웃 정책이 클래스 구조에 반영되었다.

### 7.4 관리자 기능과 일반 사용자 기능의 연결 유지
관리자 기능은 여전히 세션 흐름과 연결되어 있어 조회, 제한, 강제 종료 기능을 일관되게 처리할 수 있다.

## 8. 결론
최종 PC 앱 클래스 다이어그램은 변경된 요구사항을 반영하여, 기존보다 더 현재 정책에 맞는 구조로 정리되었다.

정리하면 다음과 같다.

- `AdminLoginScreen`, `PcMainScreen`, `AdminDashboardScreen`은 화면 역할을 담당한다.
- `AdminAuthManager`, `PcUsageManager`, `AdminManager`는 실제 기능 처리 로직을 담당한다.
- `Account`, `PC`, `Session`은 시스템의 핵심 데이터를 보관한다.

이 구조를 기준으로 PC 앱 구현을 진행하면, 이후 설명 문서와 활동 다이어그램, 실제 React 컴포넌트 구조를 일관되게 연결할 수 있다.
