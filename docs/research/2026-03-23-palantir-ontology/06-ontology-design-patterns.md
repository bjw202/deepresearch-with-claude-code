# 팔란티어 온톨로지 설계 패턴과 인과 구조

> **역할**: Researcher (설계 패턴 심층 분석) **작성일**: 2026-03-24 **목표**: 어떤 도메인이든 팔란티어 스타일의 온톨로지를 설계할 수 있는 원리적 이해 제공 **출처**: Palantir Foundry 공식 문서, 커뮤니티 포럼, 실무 가이드

---

## 이 보고서를 읽기 전에: 큰 그림 비유

팔란티어 온톨로지 설계는 **도시를 건설하는 것**과 비슷하다.

- **Object Type** = 건물의 종류 (아파트, 병원, 공장, 공원). 개별 건물이 아니라 "이런 유형의 건물이 존재한다"는 설계도.
- **Object(인스턴스)** = 실제 건물 하나 ("강남구 역삼동 202번지 아파트").
- **Link** = 도로와 다리. 건물들을 연결하는 관계.
- **Action** = 도시의 운영 규칙. "소방서에 화재 신고가 접수되면 → 해당 구역 소방차 출동 + 경찰 통보 + 입주민 문자 발송."
- **Function** = 특수 계산기. "이 건물의 가치는 위치 × 연식 × 주변 시세로 자동 계산된다."
- **Interface** = 표준 규격. "모든 공공시설은 최소한 주소, 운영시간, 담당기관을 반드시 가져야 한다."
- **Security** = 출입 관리 시스템. "일반 시민은 공원 출입 가능. VIP 구역은 배지 소지자만."

이 도시가 잘 설계되면 어떤 부서든 같은 지도 위에서 협업할 수 있다. 잘못 설계되면 소방서 지도와 경찰서 지도가 서로 달라서 재난 시 혼선이 일어난다.

---

## 1. Object Type 설계의 5가지 원칙

### 원칙 1: 핵심 엔티티 허브(Hub) 패턴 — 중심을 먼저 식별하라

모든 도메인에는 **"모든 것이 이 주변을 돈다"는 중심 Object**가 있다. 이것을 먼저 찾지 못하면 온톨로지 전체가 산만해진다.

**중심 Object를 식별하는 질문:**

> "우리 조직이 매일 아침 가장 먼저 확인하는 것은 무엇인가?"

도메인별 예시:

| 도메인 | 허브 Object | 이유 |
| --- | --- | --- |
| 항공사 | `Flight`(항공편) | 스케줄, 승무원, 항공기, 게이트가 모두 이것을 중심으로 돈다 |
| 병원 | `Patient`(환자) | 처방, 검사, 입원, 보험청구가 모두 환자에 연결 |
| 제조업 | `WorkOrder`(작업지시서) | 자재, 기계, 작업자, 품질기록이 모두 작업지시서에 연결 |
| 금융 | `Transaction`(거래) | 계좌, 고객, 상품, 위험도가 모두 거래를 통해 연결 |

**이 원칙을 어기면 어떤 문제가 발생하는가?**

허브 없이 설계하면 온톨로지가 "데이터 목록"이 된다. `Employee`, `Department`, `Project`, `Location`이 모두 동등하게 나열되면, 애플리케이션을 만들 때 "어디서 시작해야 하는가"가 불분명해진다. 팔란티어 공식 예시인 항공사 온톨로지에서 `Flight`가 허브다. `Aircraft`(항공기), `Crew`(승무원), `Airport`(공항), `Gate`(게이트)는 모두 `Flight`에 연결된 지원 Object다.

[출처: Palantir Architecture Center - The Ontology System](https://palantir.com/docs/foundry/architecture-center/ontology-system/)

---

### 원칙 2: 이벤트 타임라인 패턴 — 상태 변화를 별도 Object로 분리하라

핵심 엔티티 허브에는 반드시 **시간에 따라 쌓이는 이벤트들**이 존재한다. 이 이벤트들을 허브 Object의 속성(Property)으로 넣으면 안 된다. **반드시 별도 Object Type**으로 분리해야 한다.

**비유**: 환자(Patient) Object에 "진료일1, 진료내용1, 진료일2, 진료내용2..."를 Property로 추가하면, 한 환자에 대한 모든 진료 이력이 하나의 거대한 행(row)이 되어버린다. 대신 `MedicalVisit`이라는 별도 Object Type을 만들고 Patient와 1:N으로 연결하면, 각 진료를 독립적으로 조회하고 분석할 수 있다.

**이벤트를 별도 Object로 분리해야 하는 3가지 신호:**

1. "언제 발생했나"가 중요한 정보일 때 (타임스탬프를 Primary Key처럼 쓸 때)
2. 같은 종류의 이벤트가 하나의 엔티티에 여러 번 발생할 수 있을 때
3. 이벤트 자체에 추가 속성이 붙을 때 (진료 이력에 "담당의사", "처방약", "비용" 등)

**실제 설계 예시:**

```
[허브] Patient
  - patientId (Primary Key)
  - name
  - dateOfBirth
  - bloodType

[이벤트] MedicalVisit  → Patient와 N:1 Link
  - visitId (Primary Key)
  - visitDate
  - diagnosis
  - prescribingPhysician
  - treatmentCost

[이벤트] LabResult  → Patient와 N:1 Link
  - resultId (Primary Key)
  - testDate
  - testType
  - resultValue
```

**이 원칙을 어기면 어떤 문제가 발생하는가?**

이벤트를 Property로 넣으면 "마지막 진료" 정보만 저장할 수 있고 이력이 사라진다. 또는 컬럼 수가 폭발적으로 늘어난다. 온톨로지 기반 애플리케이션에서는 Object Set(여러 오브젝트의 집합)으로 "이 환자의 모든 진료 이력"을 불러와야 하는데, 이벤트가 별도 Object여야만 그것이 가능하다.

[출처: Palantir Community - Ontology and Pipeline Design Principles](https://community.palantir.com/t/ontology-and-pipeline-design-principles/5481)

---

### 원칙 3: 기본 키(Primary Key) 전략 — 단일 비즈니스 ID를 써라

팔란티어 온톨로지에서 Primary Key는 **오브젝트 인스턴스를 유일하게 식별하는 하나의 값**이다. 데이터베이스에서 흔히 쓰는 복합 키(composite key: 여러 컬럼의 조합)를 쓰면 문제가 생긴다.

**왜 단일 비즈니스 ID여야 하는가?**

링크(Link)를 만들 때, 그리고 Action을 설계할 때, 오브젝트를 특정하려면 단 하나의 값으로 그것을 가리킬 수 있어야 한다. 복합 키를 쓰면 모든 참조가 복잡해진다.

**좋은 Primary Key의 기준:**

- 조직 내에서 이미 쓰는 비즈니스 ID (직원번호, 항공편 코드, 주문번호)
- 변하지 않는 값 (이름은 바뀔 수 있지만 직원번호는 바뀌지 않는다)
- 의미가 있는 값 (UUID보다 `EMP-2024-0001` 형태가 가독성 측면에서 낫다)

**실패 사례**:한 제조업체에서 `(생산라인ID, 날짜, 시퀀스번호)` 3개를 조합해 WorkOrder를 식별하려 했다. 이로 인해 모든 Link 설정이 복잡해졌고, Action에서 특정 WorkOrder를 수정할 때마다 3개 값을 모두 전달해야 했다. 결국 별도의 `workOrderId` 컬럼을 추가해서 리팩토링했다.

**이 수치가 틀릴 수 있는 조건**: 기존 레거시 시스템에 비즈니스 ID가 없는 경우, UUID 방식이 불가피하다. 이 경우 Title Key(표시명)를 의미 있게 설정해서 사용자 경험을 보완한다.

[출처: Palantir Docs - Create an object type](https://palantir.com/docs/foundry/object-link-types/create-object-type/)

---

### 원칙 4: 네이밍 규칙 — 버전명과 기술명 금지

팔란티어 공식 문서와 커뮤니티 가이드는 Object Type 이름에 대한 명확한 규칙을 제시한다.

**API Name 규칙 (시스템 내부 이름):**

- 소문자로 시작, camelCase 사용
- 영숫자만 허용
- 최대 100자
- 예약어 금지: `ontology`, `object`, `property`, `link`, `relation`, `rid`, `primaryKey`, `typeId`, `ontologyObject`

**Display Name 규칙 (사람이 보는 이름):**

- 비즈니스 용어 사용 (기술 용어가 아닌)
- 버전명 금지: `EmployeeV2`, `FlightNew`, `LegacyOrder` — 이런 이름은 혼란 초래
- 부서 접두어 금지: `HREmployee`, `FinanceTransaction` — 온톨로지는 부서 경계를 초월해야 한다

**왜 버전명을 금지하는가?**

`EmployeeV2`가 생겼다는 것은 `Employee`와 `EmployeeV2`가 동시에 존재한다는 뜻이다. 이렇게 되면 어떤 앱은 `Employee`를 보고, 다른 앱은 `EmployeeV2`를 본다. 결국 두 Object Type이 실제로는 같은 것인지 다른 것인지 아무도 모르게 된다. 올바른 방법은 기존 `Employee` Object Type을 수정(property 추가/삭제)하는 것이다.

팔란티어 공식 문서는 이렇게 명시한다: Object Type 정의는 버전 관리 대상이 아니라 **진화(evolve)** 대상이다.

[출처: Palantir Community - Ontology as Code API name validation](https://community.palantir.com/t/ontology-as-code-api-name-validation-failing/6220)

---

### 원칙 5: Property vs 별도 Object 분리 기준

언제 어떤 속성을 Property로 넣고, 언제 별도 Object로 빼야 하는가? 이것이 온톨로지 설계에서 가장 자주 맞닥뜨리는 판단 문제다.

**Property로 남겨야 할 때:**

- 해당 속성이 오브젝트 자체를 설명하는 단순 특징일 때 (직원의 이름, 생년월일, 직급)
- 해당 속성이 오직 이 오브젝트에만 관련될 때 (다른 오브젝트가 이 값을 참조할 이유가 없을 때)
- 해당 속성이 독립적인 생명주기가 없을 때 (직원이 삭제되면 이름도 의미 없어짐)

**별도 Object로 분리해야 할 때:**

- 여러 Object Type이 동일한 엔티티를 공유할 때 (여러 직원이 같은 부서에 속함 → `Department`는 별도 Object)
- 해당 엔티티가 독립적인 생명주기를 가질 때 (부서는 직원 없이도 존재할 수 있음)
- 해당 엔티티를 직접 검색하거나 필터링할 니즈가 있을 때
- 해당 엔티티에 여러 속성이 붙을 때 (부서에 부서장, 예산, 위치가 있다면 그것은 오브젝트다)

**판단 기준 표:**

| 질문 | Yes → | No → |
| --- | --- | --- |
| 이 데이터가 여러 오브젝트에서 공유되는가? | 별도 Object | Property |
| 이 데이터가 독립적으로 검색될 필요가 있는가? | 별도 Object | Property |
| 이 데이터 자체에 추가 속성이 붙는가? | 별도 Object | Property |
| 이 데이터가 독립적으로 존재할 수 있는가? | 별도 Object | Property |

**\[이 원칙을 어기면 어떤 문제가 발생하는가?\]**

지위(Status)를 Property로 저장했다가, 나중에 "각 지위 변경의 시간과 이유를 기록하라"는 요구가 생기면 처음부터 다시 설계해야 한다. 또한 "특정 지위에 있는 모든 오브젝트를 찾아라"는 쿼리가 Property 필터로 가능하지만, "특정 지위를 가진 오브젝트들의 평균 체류 시간"은 별도 Object 없이는 계산할 수 없다.

---

## 2. Link 설계의 인과 논리

### Link란 무엇인가 — 단순한 외래키와 다른 점

**비유**: 데이터베이스의 외래키(Foreign Key)는 두 테이블을 연결하는 단순한 참조다. "이 열의 값이 저 테이블의 키와 같다." 반면 팔란티어의 Link는 **관계에 이름과 방향이 붙은 의미 있는 연결**이다.

예: `Employee` ↔ `Company` 링크의 이름은 "Works For" / "Employs". 단순히 "연결됨"이 아니라 "누가 무엇을 한다"는 문맥이 담겨 있다.

[출처: Palantir Docs - Link types overview](https://palantir.com/docs/foundry/object-link-types/link-types-overview/)

---

### 1:N vs M:N 선택 기준

**1:N (일대다) — 직접 Link를 사용하는 경우:**

- 한 쪽이 "소유자"이고 다른 쪽이 "소속 항목"인 경우
- 예: `Order`(주문) ↔ `OrderItem`(주문상품). 하나의 주문은 여러 주문상품을 가지고, 각 주문상품은 하나의 주문에만 속한다.
- 구현: Link Type 설정에서 cardinality를 `ONE_TO_MANY`로 설정

**M:N (다대다) — 조인 Object가 필요한 경우:**

- 양쪽 모두 "여러 개"와 관계를 맺을 수 있는 경우
- 예: `Employee`(직원) ↔ `Project`(프로젝트). 한 직원은 여러 프로젝트에 참여하고, 한 프로젝트에는 여러 직원이 참여한다.
- **중요**: 그냥 M:N Link를 만들 수도 있지만, 그 관계 자체에 속성이 필요하면 (언제부터 참여했는가? 어떤 역할인가?) **조인 Object Type**을 별도로 만들어야 한다.

**조인 Object 설계 예시:**

```
[Employee] ← 1:N → [ProjectAssignment] ← N:1 → [Project]

ProjectAssignment
  - assignmentId (Primary Key)
  - startDate
  - endDate
  - role        ← 이 속성 때문에 조인 Object가 필요했다
  - hoursAllocated
```

**언제 M:N 직접 Link vs 조인 Object를 선택하는가:**

| 조건 | 선택 |
| --- | --- |
| 관계 자체에 속성이 없다 | 직접 M:N Link |
| 관계 자체에 속성이 있다 (참여 시작일, 역할 등) | 조인 Object |
| 관계 이력을 추적해야 한다 (과거 참여 기록) | 조인 Object |
| 관계 자체에 Action(추가, 종료)이 필요하다 | 조인 Object |

---

### Link의 방향성이 왜 중요한가

같은 두 Object Type 사이의 관계도, 어느 방향에서 "출발"하느냐에 따라 쿼리 패턴과 성능이 달라진다.

**예시 —** `Manager` **↔** `DirectReport` **관계:**

- 방향 A: "이 관리자의 모든 직속 부하 찾기" → Manager에서 출발
- 방향 B: "이 직원의 상사 찾기" → Employee에서 출발

팔란티어에서 Link Type은 **양방향으로 정의되지만, 각 방향의 이름이 다르다**. 예를 들어:

- `Employee → manages → DirectReport` (관리자 시점)
- `DirectReport → reportsTo → Manager` (부하 시점)

이 두 방향이 명확하지 않으면, 애플리케이션 개발자가 "어느 방향으로 traversal해야 하나?"를 매번 생각해야 한다.

---

### 그래프 순회(Graph Traversal) vs SQL 조인 — 왜 다른가

**SQL 방식의 한계 — 다단계 연결:**

> "고객 A와 3단계 이내로 연결된 모든 고객을 찾아라."

SQL로 이것을 풀려면 재귀적 조인(recursive JOIN with CTE)이 필요하다:

```sql
WITH RECURSIVE connected AS (
  SELECT customer_b FROM relationships WHERE customer_a = 'A'
  UNION ALL
  SELECT r.customer_b FROM relationships r
  JOIN connected c ON r.customer_a = c.customer_b
  WHERE depth < 3
)
SELECT * FROM connected;
```

이 쿼리는 쓰기도 어렵고, 데이터가 많아지면 성능이 급격히 저하된다.

**그래프 순회 방식:**

팔란티어 온톨로지에서는 Link를 따라 이동하는 것이 기본 작동 방식이다. Object Set API에서:

```
customerA.getLinkedObjects("relatedTo")  // 1단계
  .flatMap(c => c.getLinkedObjects("relatedTo"))  // 2단계
  .flatMap(c => c.getLinkedObjects("relatedTo"))  // 3단계
```

또는 OSDK의 TypeScript에서:

```typescript
const connected = await client(Customer)
  .fetchOne("customer-A")
  .then(c => c.$link.relatedTo.fetchPage())
```

**그래프 순회가 특히 강력한 문제 유형:**

1. **연결 탐색**: "이 물류 허브를 거치는 모든 공급망 경로"
2. **영향 범위**: "이 부품 결함이 영향을 미치는 모든 완성품"
3. **사기 탐지**: "이 거래와 연결된 계좌의 3단계 내 모든 거래"
4. **조직 분석**: "이 임원의 간접 보고 체계 전체"

반증: 단순한 1:1 또는 1:N 조회에서는 SQL이 더 빠르고 최적화되어 있다. 그래프 순회의 장점은 **다단계 연결**과 **관계의 의미를 보존**하는 데에 있다.

[출처: Palantir Docs - Core concepts](https://palantir.com/docs/foundry/ontology/core-concepts/)

---

## 3. Action 설계 패턴 — 온톨로지를 운영 시스템으로 만드는 핵심

### Action이란 무엇인가 — 단순 데이터 수정이 아니다

**비유**: 구글 독스에서 문서를 편집하면 동시에 모든 사람이 변경 내용을 본다. 이것이 "데이터를 직접 수정하는" 방식이다. 팔란티어의 Action은 더 정교하다: 이메일 편지지에 서명하면 → 원본 파일이 갱신되고 → 관련 부서에 알림이 가고 → ERP 시스템에 기록된다. 이 모든 것을 **하나의 원자적 트랜잭션**으로 처리한다.

팔란티어 공식 정의:

> "An action type is the definition of a set of changes or edits to objects, property values, and links that a user can take at once. It also includes the side effect behaviors that occur with action submission." — [Palantir Docs - Action types overview](https://palantir.com/docs/foundry/action-types/overview/)

---

### Action의 3요소: 파라미터 → 규칙 → Side Effect

**1단계: 파라미터(Parameters) — 사용자 입력 정의**

Action을 실행할 때 사용자가 입력하는 값이다. GUI 폼(form)의 입력 필드와 같다.

파라미터 유형:

- **기본 타입**: 텍스트, 숫자, 날짜, 불리언
- **Object 참조**: "어떤 직원을 대상으로 하는가?" — 온톨로지의 Object를 직접 선택
- **Object Set**: 여러 오브젝트를 한번에 선택
- **동적 드롭다운**: 이 파라미터 값에 따라 다른 파라미터의 선택지가 바뀜

예: `AssignEmployee` Action의 파라미터:

```
파라미터1: employee (Object 참조 - Employee 타입)
파라미터2: newRole (텍스트 - 드롭다운: "Manager", "Senior", "Junior")
파라미터3: effectiveDate (날짜)
```

---

**2단계: 규칙(Rules) — 변경 로직 정의**

Rules는 파라미터 값을 받아서 온톨로지에 **어떤 변경을 가할지**를 정의한다. 두 가지 유형이 있다.

**Ontology Rules (온톨로지 규칙)**:오브젝트, 속성, 링크를 어떻게 생성/수정/삭제할지를 정의한다. GUI로 설정 가능.

가능한 Rule 유형:

1. **Set Property**: 특정 속성 값을 새 값으로 설정
2. **Create Object**: 새 오브젝트 생성 (Primary Key 자동 생성 또는 사용자 지정)
3. **Modify Object**: 기존 오브젝트의 속성 수정
4. **Delete Object**: 오브젝트 삭제
5. **Create Link / Delete Link**: 오브젝트 간 링크 생성 또는 삭제

**Side Effect Rules (사이드 이펙트 규칙)**:온톨로지 변경 **이후** 또는 **이전**에 외부 시스템과 통신한다.

사이드 이펙트 유형:

- **Notification(알림)**: 플랫폼 내 사용자에게 이메일 또는 앱 알림
- **Webhook — Side Effect**: 온톨로지 변경 후 외부 REST API 호출 (실패해도 온톨로지 변경은 유지)
- **Webhook — Writeback**: 온톨로지 변경 전 외부 시스템 호출 (실패하면 온톨로지 변경도 취소됨)

이 구분이 중요한 이유:

| Webhook 유형 | 실행 순서 | 외부 실패 시 |
| --- | --- | --- |
| Writeback Webhook | 온톨로지 변경 전 | 온톨로지 변경도 취소 |
| Side Effect Webhook | 온톨로지 변경 후 | 온톨로지 변경은 유지, 외부 통보만 실패 |

[출처: Palantir Docs - Webhooks](https://palantir.com/docs/foundry/action-types/webhooks/)

---

### Function-backed Action — 단순 규칙으로 안 되는 경우

**비유**: 단순 규칙은 "직원 A의 직급을 B로 바꿔라"처럼 명확한 지시다. 그런데 "이 사고가 종결 처리되면 → 연결된 모든 경보도 '해결됨'으로 바꾸고 → 경보 수에 따라 사고 심각도를 재계산하라"처럼 복잡한 연쇄 변경은 단순 규칙으로 표현하기 어렵다. 이때 TypeScript 또는 Python으로 작성된 Function을 Action에 연결한다.

팔란티어 공식 설명:

> "By using a function, you can create action types of any level of complexity, reading any number of objects and modifying objects as you see fit." — [Palantir Docs - Function-backed actions](https://palantir.com/docs/foundry/action-types/function-actions-overview/)

**Function-backed Action이 필요한 경우:**

1. 링크로 연결된 여러 오브젝트를 동시에 수정해야 할 때 (`Incident`를 닫으면 연결된 모든 `Alert`도 닫힘)
2. 수정 값을 복잡한 로직으로 계산해야 할 때 (여러 오브젝트의 데이터를 읽어서 점수를 계산한 후 저장)
3. 여러 다른 타입의 오브젝트를 한번에 생성하고 링크로 연결해야 할 때
4. ML 모델 결과를 오브젝트에 기록할 때

**TypeScript Function 예시 (개념적):**

```typescript
@OntologyEditFunction()
async closeIncident(incident: Incident): Promise<void> {
  // 1. 사고 상태 변경
  incident.status = "Closed";
  incident.closedAt = new Date();

  // 2. 연결된 모든 경보 조회 및 상태 변경
  const alerts = await incident.$link.hasAlerts.fetchPage();
  for (const alert of alerts.data) {
    alert.status = "Resolved";
  }

  // 3. 심각도 재계산
  const alertCount = alerts.data.length;
  incident.severity = alertCount > 10 ? "HIGH" : alertCount > 5 ? "MEDIUM" : "LOW";
}
```

[출처: Palantir Docs - Function-backed actions overview](https://palantir.com/docs/foundry/action-types/function-actions-overview/)

---

### Submission Criteria — 보안과 워크플로우의 결합

**비유**: 결재 시스템. "이 Action은 누구나 실행 버튼을 볼 수 있지만, 실제로 제출하려면 특정 조건이 충족되어야 한다."

Submission Criteria(제출 조건, 과거 명칭: Validations)는 Action이 실제로 실행되기 위해 반드시 만족해야 하는 조건이다. **권한(Permission)과는 다르다**: 권한은 "이 Action을 볼 수 있는가"이고, Submission Criteria는 "이 특정 입력으로 실행할 수 있는가"다.

팔란티어 공식 설명:

> "Submission criteria support encoding business logic into data editing permissions, ensuring Ontology data quality and editing governance." — [Palantir Docs - Submission criteria](https://palantir.com/docs/foundry/action-types/submission-criteria/)

**Submission Criteria 예시:**

- "항공기 배정 변경 Action은 출발 24시간 이상 남은 항공편에만 적용 가능"
- "예산 집행 Action은 잔여 예산이 집행 금액 이상일 때만 가능"
- "승인 Action은 파라미터로 입력된 담당자가 실제 해당 그룹 멤버일 때만 가능"

**결합 가능한 조건:**

- 오브젝트 속성 값 조건 (날짜 비교, 숫자 범위, 특정 상태 여부)
- 사용자 정보 조건 (사용자 ID, 그룹 소속 여부)
- 파라미터 간 논리 조건 (AND, OR, NOT)

이것이 가능하기 때문에 "HR 팀원만 급여를 수정할 수 있고, 수정 금액은 ±20% 이내여야 하며, 직속 상사의 승인이 있어야 한다"는 복잡한 거버넌스 규칙을 코드 없이 Action 설정만으로 구현할 수 있다.

---

### Writeback 메커니즘의 완전한 인과 체인

Action이 실행되면 어떤 일이 순서대로 일어나는가? 이 과정을 단계별로 분해한다.

**완전한 체인 (Writeback Webhook이 있는 경우):**

```
[1] 사용자가 Workshop 앱에서 Action 버튼 클릭 → 파라미터 입력 → 제출

[2] Submission Criteria 검사
    → 조건 불만족 시: 사용자에게 오류 메시지. 여기서 종료.
    → 조건 만족 시: 다음 단계 진행

[3] Writeback Webhook 실행 (설정된 경우)
    → 외부 시스템(ERP, Salesforce 등)에 HTTP 요청
    → 외부 시스템 실패 시: 롤백. 온톨로지 변경 없음.
    → 외부 시스템 성공 시: 다음 단계 진행

[4] Ontology Rules 실행 (원자적 트랜잭션)
    → 오브젝트 속성 변경 / 링크 생성·삭제 / 오브젝트 생성·삭제
    → 모든 변경이 하나의 트랜잭션으로 커밋
    → Actions Service가 변경 이력 로그 기록

[5] 변경 내용을 Writeback 데이터셋에 저장
    → Object Storage V2에 즉시 인덱스 업데이트 (준실시간)

[6] Side Effect Webhook/Notification 실행 (설정된 경우)
    → 이메일 알림 발송, 외부 API 추가 호출
    → 실패해도 이미 완료된 [4] 변경은 취소되지 않음

[7] Object Data Funnel이 인덱스 동기화
    → 모든 앱(Workshop, AIP, OSDK 외부 앱)에서 변경 반영
    → 구독(subscription)이 설정된 앱은 즉시 업데이트 이벤트 수신
```

**지연 시간(Latency):**

- \[4\]\~\[5\] 단계 (트랜잭션 커밋 → Object Storage V2 인덱스): **준실시간** (수 초 이내)
- 스트리밍 파이프라인의 전체 지연: 수집 1-2초 + 변환 5초(exactly-once 기본값) ≈ **총 6-7초**
- Foundry 공식 문서는 배치 파이프라인의 지연을 "분 단위\~시간 단위"로 명시, 스트리밍은 "초 단위"로 구분

**\[수치 투명성\]**: 위 지연 수치는 Palantir의 스트리밍 파이프라인 공식 문서 기반이다. 이 수치가 틀릴 수 있는 조건: 극히 복잡한 Function-backed Action(수백 오브젝트 동시 수정), 외부 Webhook의 응답 지연, Foundry 클러스터 부하 상태.

[출처: Palantir Docs - Streaming performance considerations](https://palantir.com/docs/foundry/building-pipelines/streaming-performance-considerations/)

---

## 4. Function 설계 패턴

### Function이란 무엇인가

**비유**: 온톨로지의 "계산기 + 로직 엔진". 오브젝트 속성을 읽고, 연산하고, 결과를 반환하거나 오브젝트를 수정하는 코드 블록이다. TypeScript 또는 Python으로 작성하며, 서버 사이드에서 격리된 환경에서 실행된다.

팔란티어 공식 설명:

> "Functions enable code authors to write logic that can be executed quickly in operational contexts, such as dashboards and applications designed to empower decision-making processes." — [Palantir Docs - Functions overview](https://palantir.com/docs/foundry/functions/overview/)

**Function의 주요 사용 사례:**

1. **Workshop 컴포넌트에 동적 값 반환**: 대시보드의 KPI 계산
2. **Derived Table Column**: 오브젝트의 속성을 조합해 계산된 컬럼 표시
3. **Function-backed Action**: 복잡한 온톨로지 수정 로직 (앞 섹션 참조)
4. **외부 시스템 조회**: 온톨로지에 없는 데이터를 실시간으로 외부 API에서 가져와 표시
5. **ML 모델 호출**: 오브젝트의 속성값을 ML 모델에 넘겨 예측값을 받아옴

---

### Derived Properties — 계산된 속성

Derived Property(파생 속성)는 다른 속성들로부터 **실시간으로 계산되는 가상의 속성**이다. 저장되지 않고, 조회 시마다 계산된다.

**비유**: 엑셀 스프레드시트의 수식 셀. A열과 B열의 값이 바뀌면 C열의 수식도 자동으로 갱신된다.

**예시: 위험 점수 계산**

```typescript
@Function()
calculateRiskScore(transaction: Transaction): number {
  const volumeScore = transaction.amount > 100000 ? 40 : 20;
  const countryScore = HIGH_RISK_COUNTRIES.includes(transaction.country) ? 40 : 10;
  const historyScore = transaction.previousFlagCount * 5;
  return Math.min(volumeScore + countryScore + historyScore, 100);
}
```

이 함수는 Workshop 대시보드의 "위험 점수" 컬럼에 연결되어, `Transaction` 오브젝트가 로드될 때마다 자동으로 계산된다. 점수를 별도 Property로 저장하지 않아도 된다.

---

### ML 모델 호출 패턴

팔란티어에서 ML 모델을 온톨로지와 연결하는 방법은 두 가지다:

**방법 1: Models in the Ontology**ML 모델을 온톨로지에 직접 등록하면, `Model` Object Type처럼 관리된다. 버전 관리, 성능 메트릭 추적, 배포 상태 관리가 가능하다. 이렇게 등록된 모델은 Function 내에서 바로 호출할 수 있다.

**방법 2: Function에서 직접 모델 API 호출**외부 Webhook을 통해 모델 서빙 엔드포인트를 호출하거나, Python 사이드카 컨테이너를 통해 Pipeline Builder 내에서 직접 호출한다.

---

### AIP Logic과의 연결 — Function이 LLM의 "도구"가 되는 순간

**AIP Logic**은 LLM(대규모 언어 모델)을 온톨로지와 연결하는 인터페이스다. 코드 없이 GUI로 LLM 프롬프트를 작성하고, 온톨로지 오브젝트를 입력으로 받아서 출력을 생성하거나 온톨로지를 수정할 수 있다.

팔란티어 공식 설명:

> "AIP Logic provides an intuitive interface to leverage the Ontology and LLMs via a Logic function that takes inputs (like Ontology objects or text strings) and can return an output (objects and/or strings) or make edits to the Ontology." — [Palantir Docs - AIP Logic overview](https://palantir.com/docs/foundry/logic/overview/)

**Function이 LLM의 도구(Tool)로 등록되는 구체적 메커니즘:**

1. TypeScript Function을 `@Tool` 데코레이터로 표시하면 AIP 에이전트가 호출할 수 있는 도구로 등록된다.
2. LLM 에이전트가 사용자 요청을 처리하면서 "이 작업에는 온톨로지 조회가 필요하다"고 판단하면 등록된 Function을 자동으로 호출한다.
3. Function의 반환값이 LLM의 응답 생성에 사용된다.
4. 중요: **LLM은 자신의 권한 범위를 벗어나는 함수를 호출할 수 없다** (보안 모델과 통합, 다음 섹션 참조)

**예시**: "내일 비행에 문제가 있는 항공기가 있나요?"라는 사용자 질문에 대해 AIP 에이전트가:

1. `getFlightsByDate(date: "tomorrow")` Function 호출 → `Flight` 오브젝트 목록 반환
2. `getAircraftStatus(aircraftId)` Function 호출 → 각 항공기 상태 반환
3. 결과를 종합해 자연어로 응답 생성

[출처: Palantir Docs - AIP Logic](https://palantir.com/docs/foundry/logic/overview/)

---

## 5. Security 모델의 온톨로지 결합

### 기존 보안 모델과의 차이

대부분의 시스템은 보안을 **테이블/파일 수준**으로 관리한다. "HR 테이블은 HR 팀만 볼 수 있다." 팔란티어는 이것을 **행(Row) 수준, 열(Column) 수준, 심지어 셀(Cell) 수준**까지 내려간다. 그리고 이 보안 정책이 온톨로지 타입에 붙어서, 어떤 앱에서 접근해도 동일하게 적용된다.

**비유**: 회사 건물에 들어가는 것(빌딩 접근 = 테이블 수준)과, 특정 층에 들어가는 것(행 수준), 특정 방에 들어가는 것(열 수준), 특정 서랍을 여는 것(셀 수준)을 모두 별도로 제어하는 보안 시스템.

---

### 행 수준 보안(Row-level Security) — Object Security Policy

**개념**: 같은 `Passenger`(승객) Object Type이지만, 일반 직원은 일반 승객 정보만 보고, VIP 담당 직원은 VIP 승객 정보도 볼 수 있다.

팔란티어 공식 설명:

> "Object security policies allow you to configure view permissions on an object instance by configuring security policies on the object type, independently of the permissions on the backing data source. These are used to achieve row-level security." — [Palantir Docs - Object and property security policies](https://palantir.com/docs/foundry/object-permissioning/object-security-policies/)

**구현 방식:**

- `Passenger` Object Type에 Object Security Policy를 설정
- 조건: `passengerType == "VIP"` → 이 조건을 만족하는 오브젝트는 `VIP` 마킹이 있는 사용자만 볼 수 있다
- VIP 마킹이 없는 사용자는 쿼리 결과에서 VIP 승객 행 자체가 나타나지 않는다

**중요한 속성**: 보안 정책은 **원본 데이터셋에 독립적으로** 설정된다. 원본 데이터셋의 권한과 별개로 오브젝트 단위의 권한을 설정할 수 있다. 이렇게 하면 민감한 데이터셋에 직접 접근 권한 없이도, 정제된 오브젝트를 통해 필요한 정보만 볼 수 있게 된다.

---

### 열 수준 보안(Column-level Security) — Property Security Policy

**개념**: 같은 `Passenger` 오브젝트라도, 일반 직원은 이름, 주소, 전화번호(PII)를 볼 수 없고 항공편 정보만 볼 수 있다.

**구현 방식:**

- `Passenger` Object Type에서 `Name`, `Address`, `PhoneNumber` 속성에 Property Security Policy 설정
- 조건: `PII` 마킹이 있는 사용자만 이 속성 값을 볼 수 있음
- PII 마킹이 없는 사용자는 해당 속성이 `null`로 표시된다 (오브젝트 자체는 보이지만 특정 속성이 가려짐)

**셀 수준 보안 조합:**

- Object Security Policy(행 수준) + Property Security Policy(열 수준)를 조합하면 셀 수준 보안이 된다
- 예: "VIP 마킹 없으면 VIP 행 자체가 안 보임 + PII 마킹 없으면 이름/주소가 null로 표시됨"

---

### 보안이 Link를 따라 전파되는가?

**핵심 질문**: Object A에 접근 권한이 있으면 Link로 연결된 Object B도 자동으로 볼 수 있는가?

**답**: 아니다. 각 Object Type은 **독립적인 보안 정책**을 가진다. Link를 통해 연결되어 있더라도, Object B의 보안 정책을 통과해야 Object B를 볼 수 있다.

예시:

- `Flight` → `Passenger` 링크가 있을 때
- 항공편 운영 직원이 `Flight` 오브젝트를 볼 수 있다고 해서 자동으로 `Passenger` PII 정보를 볼 수 있지 않다
- `Passenger`의 Property Security Policy가 별도로 적용된다

**Action에서의 보안:**

- 기본적으로 Action을 실행하려면 편집 대상 오브젝트에 대한 `Read` 권한이 필요
- `Action-only Edit` 모드(기본값): 사용자가 직접 오브젝트를 편집하는 것은 차단하고, 오직 Action을 통해서만 수정 가능 (일관된 거버넌스 강제)
- 이 모드에서 사용자는 수정 대상 오브젝트에 Read 권한만 있으면 Action 실행 가능 (Edit 권한 불필요)

[출처: Palantir Docs - Permissions](https://palantir.com/docs/foundry/action-types/permissions/)

---

### AIP에서의 보안 — LLM이 권한 범위만 따르는 메커니즘

AIP Logic은 **플랫폼의 보안 모델을 그대로 상속**한다. LLM 에이전트가 아무리 강력해도, 현재 사용자의 권한 범위 밖에 있는 오브젝트에는 접근할 수 없다.

팔란티어 공식 설명:

> "AIP Logic is built on the same rigorous security model that governs the rest of the Palantir platform, including user and function permissions. These platform security controls grant an LLM access only to what is necessary to complete a task." — [Palantir Docs - AIP Logic overview](https://palantir.com/docs/foundry/logic/overview/)

**구체적 메커니즘:**

1. LLM이 Function을 호출할 때, 해당 Function은 **현재 사용자의 컨텍스트**로 실행된다
2. Object Set 조회 결과는 사용자의 보안 정책이 적용된 결과만 반환된다
3. 사용자가 볼 수 없는 오브젝트는 LLM에도 전달되지 않는다 — 즉 LLM이 "모른다"고 답하는 것이 아니라 애초에 그 데이터가 컨텍스트에 들어가지 않는다

이것이 팔란티어가 국방·의료 분야에서 AI를 채택하는 핵심 이유다: LLM 기반 에이전트도 기존 보안 거버넌스를 자동으로 따른다.

---

## 6. OSDK를 통한 외부 접근 패턴

### OSDK란 무엇인가

\*\*Ontology SDK(OSDK)\*\*는 외부 애플리케이션이 팔란티어 온톨로지를 읽고 쓸 수 있는 API 라이브러리다. TypeScript와 Python을 지원한다.

**비유**: 팔란티어 온톨로지는 거대한 데이터베이스다. OSDK는 이 데이터베이스에 접근하는 클라이언트 라이브러리인데, **특별한 점**이 있다: 온톨로지 스키마가 변경되면 SDK 코드도 **자동으로 재생성**된다. 즉 Object Type이 바뀌면 TypeScript 타입 정의가 자동으로 업데이트된다.

---

### 타입 안전성(Type Safety)이 왜 중요한가

기존 REST API 방식: `GET /api/employees/123` → JSON 응답. 개발자가 `response.name`을 사용할 때, 이 속성이 정말 존재하는지 컴파일 타임에 알 수 없다.

OSDK 방식: 온톨로지의 `Employee` Object Type이 TypeScript 타입으로 자동 변환된다.

```typescript
// Employee 타입이 자동 생성됨
const employee: Osdk.Instance<Employee> = await client(Employee).fetchOne("emp-123");

// IDE가 자동완성 제공 + 타입 오류 컴파일 타임에 발견
console.log(employee.fullName);    // 컴파일 OK (속성 존재)
console.log(employee.nonExist);   // 컴파일 오류! (존재하지 않는 속성)
```

Object Type의 스키마가 변경되면(속성 추가/삭제/이름 변경), SDK를 재생성하면 모든 외부 앱 코드에서 타입 불일치가 컴파일 오류로 잡힌다. 런타임 오류가 아니라 개발 단계에서 발견된다.

---

### TypeScript OSDK 실제 사용 패턴

**단일 오브젝트 조회:**

```typescript
// Primary Key로 단일 오브젝트 로드
const restaurant: Osdk.Instance<Restaurant> = await client(Restaurant)
  .fetchOne("rest-001");

console.log(restaurant.restaurantName);  // "Seoul BBQ House"
console.log(restaurant.numberOfReviews); // 342
```

**필터 조회:**

```typescript
// 평점 높은 레스토랑만 조회
const page = await client(Restaurant)
  .where(Restaurant.numberOfReviews.gt(100))
  .fetchPage({ $pageSize: 30 });
```

**그룹 집계:**

```typescript
// 개점일 기준 10일 단위로 레스토랑 수 집계
const grouped = await client(Restaurant).aggregate({
  $select: { $count: "unordered" },
  $groupBy: {
    dateOfOpening: { $duration: "days", $value: 10 }
  }
});
```

**Action 실행 (쓰기):**

```typescript
// Action을 통해 오브젝트 수정
await client.actions.updateRestaurantRating({
  restaurant: "rest-001",
  newRating: 4.5,
  reviewerId: "user-123"
});
```

**실시간 구독 (Subscription):**

```typescript
// 오브젝트 변경을 실시간으로 받음
const subscription = client(Country).subscribe({
  onChange: (update) => {
    console.log("Updated:", update.object.countryName, update.object.population);
  },
  onSuccessfulSubscription: () => {
    console.log("Subscription active");
  }
});
```

[출처: Palantir Docs - TypeScript OSDK](https://palantir.com/docs/foundry/ontology-sdk/typescript-osdk/), [Python OSDK](https://palantir.com/docs/foundry/ontology-sdk/python-osdk/)

---

### Python OSDK 패턴 (분석 코드에서 사용)

```python
from ontology_sdk.ontology.objects import Aircraft
from ontology_sdk import FoundryClient

client = FoundryClient()

# 특정 항공기 조회
aircraft = client.ontology.objects.Aircraft.get("aircraft-777")

# 필터 + 반복
for ac in client.ontology.objects.Aircraft.where(
    Aircraft.object_type.status.eq("Maintenance")
):
    print(f"{ac.tailNumber}: {ac.lastInspectionDate}")
```

---

## 7. Interface(다형성)의 실제 사용

### Interface가 왜 필요한가

**비유**: 세상의 모든 전자기기에는 전원 플러그가 있다. 노트북, 냉장고, TV는 서로 완전히 다른 기기지만, 모두 220V 표준 플러그를 사용한다. 이 "표준 플러그 규격"이 Interface다.

팔란티어 공식 정의:

> "An interface is an Ontology type that describes the shape of an object type and its capabilities. Interfaces allow for consistent modeling of and interaction with object types that share a common shape." — [Palantir Docs - Interfaces overview](https://palantir.com/docs/foundry/interfaces/interface-overview/)

**Interface가 없으면 생기는 문제:**

세 산업에서 각각 "경보(Alert)"라는 개념이 있다:

- 국방: `ThreatAlert` (위협 경보, 속성: threatLevel, location, classification)
- 에너지: `SensorAlert` (센서 이상, 속성: sensorId, threshold, deviation)
- 금융: `FraudAlert` (의심 거래, 속성: transactionId, riskScore, rule)

이 세 종류의 경보를 통합 대시보드에서 보여주려면? Interface 없이는 세 Object Type을 각각 별도로 처리해야 한다. 대시보드 코드가 3배 복잡해진다.

**Interface로 해결:**

```
Interface: Alert
  - alertId (공통 속성)
  - severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL" (공통 속성)
  - timestamp (공통 속성)
  - status: "Open" | "Acknowledged" | "Resolved" (공통 속성)

ThreatAlert → implements Alert + threatLevel, location, classification
SensorAlert → implements Alert + sensorId, threshold, deviation
FraudAlert  → implements Alert + transactionId, riskScore, rule
```

이제 대시보드는 `Alert` Interface만 알면 된다. ThreatAlert, SensorAlert, FraudAlert가 추가되더라도 대시보드 코드는 변경 없이 작동한다.

---

### Interface 상속(Extends) 패턴

Interface는 다른 Interface를 상속(extend)할 수 있다. 이것은 프로그래밍 언어의 interface 상속과 동일한 개념이다.

```
Interface: Entity          ← 최상위 공통 Interface
  - entityId
  - createdAt
  - lastModifiedAt

Interface: PhysicalAsset extends Entity  ← 중간 계층
  - location
  - weight
  - serialNumber

Interface: Facility extends PhysicalAsset  ← 더 구체적
  - facilityName
  - operatingHours
  - capacity

Object Types that implement Facility:
  - Airport (추가 속성: iataCode, runways)
  - ManufacturingPlant (추가 속성: productionLine, shiftSchedule)
  - MaintenanceHangar (추가 속성: bayCount, approvedAircraftTypes)
```

이 계층 구조가 있으면:

- "모든 Physical Asset의 위치"를 한 번에 조회 가능
- "모든 Facility의 운영 시간"을 한 번에 조회 가능
- "모든 공항의 IATA 코드"를 Airport 전용으로 조회 가능

**Object Type은 여러 Interface를 동시에 구현할 수 있다:**

```
Airport implements [Facility, EmergencyCapable, RegulatedEntity]
```

---

### Interface와 Object Type의 차이

| 비교 항목 | Interface | Object Type |
| --- | --- | --- |
| 데이터 백킹 | 없음 (추상적) | 있음 (데이터셋에 연결) |
| 인스턴스화 | 불가 | 가능 (Object로 인스턴스화) |
| 속성 정의 | Interface Properties | Properties (로컬 또는 Shared) |
| 시각적 구분 | 점선 아이콘 | 실선 아이콘 |
| 보안 | Ontology Roles로 관리 | Roles + Object/Property Security Policy |

---

## 8. 모든 원칙의 종합: 실전 설계 체크리스트

어떤 도메인이든 팔란티어 스타일의 온톨로지를 설계할 때 아래 순서를 따르면 된다.

### 단계 1: 허브 Object 식별

- "우리 조직이 매일 아침 가장 먼저 확인하는 엔티티는 무엇인가?"
- "모든 보고서와 알림이 이것을 중심으로 도는가?"

### 단계 2: 허브에 붙는 이벤트 분리

- 허브 Object에 시간에 따라 쌓이는 것이 있는가?
- 그것은 별도 Object Type으로 분리하라

### 단계 3: 지원 Object 식별

- 허브 Object가 공유하는 엔티티는 무엇인가? (직원 → 부서, 항공편 → 공항)
- 이들은 독립적으로 존재하고 독립적으로 검색되는가?

### 단계 4: Link 방향과 카디널리티 결정

- 1:N인가 M:N인가?
- M:N 관계에 속성이 있는가? → 조인 Object 필요
- 각 방향의 이름은 비즈니스 용어로 의미 있게 붙였는가?

### 단계 5: Action 설계 (운영 워크플로우 파악)

- "사용자가 매일 반복하는 작업은 무엇인가?"
- 그 작업을 Action으로 정의하라
- 이 Action에 조건(Submission Criteria)이 있는가?
- 이 Action이 외부 시스템에 전파되어야 하는가? (Webhook)

### 단계 6: Interface 필요성 검토

- "다른 Object Type이지만 같은 워크플로우에서 함께 다뤄지는 것이 있는가?"
- 있다면 공통 속성을 Interface로 추상화하라

### 단계 7: Security 계층 설계

- 어떤 Object Type에 행 수준 보안이 필요한가? (Object Security Policy)
- 어떤 속성이 특정 사용자에게 가려져야 하는가? (Property Security Policy)
- Action을 통해서만 수정 가능하도록 잠가야 하는가? (Action-only Edit)

---

## 9. 반증과 한계

### 이 설계 원칙이 작동하지 않는 조건

**1. 매우 단순한 도메인**:물류 추적처럼 단순한 도메인에서 Interface와 Function을 모두 사용하면 오버엔지니어링이다. 허브-이벤트 패턴만으로 충분한 경우가 많다.

**2. 실시간 고빈도 데이터**:IoT 센서가 초당 10만 건의 데이터를 생성할 때, 각 센서 읽기를 별도 Object Instance로 만들면 인덱싱 오버헤드가 크다. 이런 경우 시계열 데이터를 온톨로지 밖에서 관리하고, 이상 탐지 결과만 온톨로지에 Object로 등록하는 것이 낫다.

**3. 레거시 시스템 통합의 복잡성**:복합 키(composite key)가 내재된 레거시 시스템과 통합할 때, "단일 비즈니스 ID" 원칙을 적용하기 어렵다. 이 경우 별도 UUID를 생성하거나 레거시 키를 단일 문자열로 직렬화하는 변환 파이프라인이 필요하다.

**\[반증 미발견\]**: Function-backed Action의 대안으로 "처음부터 완전히 다른 아키텍처(예: 이벤트 소싱)가 더 낫다"는 주장이 있지만, 팔란티어 온톨로지의 맥락에서 이 주장을 뒷받침하는 구체적 사례는 발견되지 않았다. 다만 Function 실행 시간 제한(execution limits)이 있어 매우 복잡한 연산에는 별도의 배치 파이프라인이 더 적합하다는 공식 문서 내용은 확인됨.

---

## 10. 이 설계 원칙으로 가능한 의사결정

이 보고서의 내용이 실제로 어떤 설계 결정을 안내하는가:

1. **새 도메인 온톨로지 설계 시**: 허브-이벤트-지원 패턴으로 초안 작성 → Link 방향 결정 → Action 목록 도출 순서로 진행

2. **기존 온톨로지 리팩토링 시**: Property를 별도 Object로 분리해야 하는 신호(공유, 독립 검색, 추가 속성) 체크 → Link 카디널리티 재검토

3. **보안 설계 시**: Object Security Policy(행) → Property Security Policy(열) → Action-only Edit 여부를 순서대로 결정

4. **외부 앱 개발 시**: OSDK를 사용하면 온톨로지 스키마 변경이 컴파일 타임 오류로 즉시 발견됨 → API 버전 관리 필요 없음

5. **AI 에이전트 통합 시**: AIP Logic의 보안 상속 특성을 이해하고, Function을 LLM Tool로 노출할 범위를 설계

---

## 출처 목록

 1. [Palantir Docs - The Ontology System](https://palantir.com/docs/foundry/architecture-center/ontology-system/) — 아키텍처 전체 개요
 2. [Palantir Docs - Overview • Ontology](https://palantir.com/docs/foundry/ontology/overview/) — 온톨로지 빌딩 개요
 3. [Palantir Docs - Core concepts](https://palantir.com/docs/foundry/ontology/core-concepts/) — Object/Property/Link/Action 정의
 4. [Palantir Docs - Object types](https://palantir.com/docs/foundry/object-link-types/object-types-overview/) — Object Type 상세
 5. [Palantir Docs - Create an object type](https://palantir.com/docs/foundry/object-link-types/create-object-type/) — API 이름 규칙, 예약어
 6. [Palantir Docs - Link types overview](https://palantir.com/docs/foundry/object-link-types/link-types-overview/) — Link 설계 원칙
 7. [Palantir Docs - Action types overview](https://palantir.com/docs/foundry/action-types/overview/) — Action 전체 개요
 8. [Palantir Docs - Submission criteria](https://palantir.com/docs/foundry/action-types/submission-criteria/) — 제출 조건 설계
 9. [Palantir Docs - Permissions (Action types)](https://palantir.com/docs/foundry/action-types/permissions/) — Action 권한 구조
10. [Palantir Docs - Side effects overview](https://palantir.com/docs/foundry/action-types/side-effects-overview/) — 사이드 이펙트 유형
11. [Palantir Docs - Webhooks](https://palantir.com/docs/foundry/action-types/webhooks/) — Writeback vs Side effect Webhook
12. [Palantir Docs - Function-backed actions](https://palantir.com/docs/foundry/action-types/function-actions-overview/) — 복잡한 Action 로직
13. [Palantir Docs - Functions overview](https://palantir.com/docs/foundry/functions/overview/) — Function 전체 개요
14. [Palantir Docs - AIP Logic overview](https://palantir.com/docs/foundry/logic/overview/) — LLM 통합
15. [Palantir Docs - Object and property security policies](https://palantir.com/docs/foundry/object-permissioning/object-security-policies/) — 행/열 수준 보안
16. [Palantir Docs - TypeScript OSDK](https://palantir.com/docs/foundry/ontology-sdk/typescript-osdk/) — TypeScript SDK 패턴
17. [Palantir Docs - Python OSDK](https://palantir.com/docs/foundry/ontology-sdk/python-osdk/) — Python SDK 패턴
18. [Palantir Docs - Interfaces overview](https://palantir.com/docs/foundry/interfaces/interface-overview/) — Interface/다형성
19. [Palantir Docs - Streaming performance considerations](https://palantir.com/docs/foundry/building-pipelines/streaming-performance-considerations/) — 스트리밍 지연 시간
20. [Palantir Community - Ontology and Pipeline Design Principles](https://community.palantir.com/t/ontology-and-pipeline-design-principles/5481) — 현장 설계 원칙
21. [Palantir Community - Ontology as Code API name validation](https://community.palantir.com/t/ontology-as-code-api-name-validation-failing/6220) — 이름 규칙 실제 사례
22. [Fourth Age - Practical Ontologies & How to Build Them, Part 1](https://fourthage.substack.com/p/practical-ontologies-and-how-to-build) — 실무 가이드

---

## 검색 비용 현황

이 보고서 작성을 위한 검색 API 사용:

- Perplexity sonar-pro: 6회 호출 (약 $0.08)
- Tavily extract: 14회 URL 추출 (14 크레딧)
- Tavily search (advanced): 3회 (6 크레딧)
- **총 Tavily 크레딧 사용**: 약 20 크레딧