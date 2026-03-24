# 팔란티어 온톨로지 기술 아키텍처 심층 분석

**Researcher**: Sub-Agent (Researcher)
**작성일**: 2026-03-23
**조사 범위**: 팔란티어 Foundry 온톨로지의 기술 구조, 핵심 개념, OWL/RDF 비교, OSDK, Actions

---

## 1. 팔란티어 온톨로지란 무엇인가

### 공식 정의

팔란티어 공식 문서는 온톨로지를 다음과 같이 정의한다:

> "The Ontology is the system at the heart of Palantir's architecture. The Ontology is designed to represent the complex, interconnected *decisions* of an enterprise, not simply the data. This enables both humans and AI agents to collaborate, across operational workflows that must orchestrate with the physical world."
> — [Palantir Foundry 공식 문서: The Ontology System](https://palantir.com/docs/foundry/architecture-center/ontology-system/)

핵심 포인트: **데이터를 저장하는 것이 아니라 의사결정(decisions)을 표현하는 시스템**이다. 이것이 팔란티어 온톨로지를 기존 데이터 카탈로그나 시맨틱 레이어와 구별하는 첫 번째 원칙이다.

### 디지털 트윈으로서의 온톨로지

온톨로지는 조직의 **디지털 트윈(digital twin)** 역할을 한다. 두 가지 요소로 구성된다:

- **시맨틱 요소(Semantic elements)**: 객체(Objects), 속성(Properties), 링크(Links) — 세계를 기술하는 "명사"
- **키네틱 요소(Kinetic elements)**: 액션 타입(Action types), 함수(Functions), 동적 보안 — 세계를 변화시키는 "동사"

> "In many settings, the Ontology serves as a digital twin of the organization, containing both the semantic elements (objects, properties, links) and kinetic elements (actions, functions, dynamic security) needed to enable use cases of all types."
> — [Overview • Ontology - Palantir](https://palantir.com/docs/foundry/ontology/overview/)

### 의사결정을 모델링하는 네 가지 축

팔란티어의 공식 아키텍처 문서는 온톨로지가 **데이터, 로직, 액션, 보안**의 4중 통합으로 의사결정을 모델링한다고 설명한다:

1. **Data(데이터)**: ERP, CRM, IoT 센서, 지리공간 저장소 등 모든 소스의 데이터를 통합하여 일관된 객체, 속성, 링크로 변환
2. **Logic(로직)**: 단순 비즈니스 규칙부터 ML 모델, LLM 기반 함수, 복잡한 다단계 오케스트레이션까지 포괄하는 계산/추론 레이어
3. **Action(액션)**: 단순 트랜잭션부터 운영 시스템에 실시간으로 라이트백되는 복잡한 다단계 업데이트까지 처리
4. **Security(보안)**: 수만 명의 사용자와 AI 에이전트에 걸쳐 행 수준/열 수준의 세분화된 권한을 실시간 조정

---

## 2. 핵심 구성 요소

### 2.1 Object Types (객체 타입)

Object Type은 실세계의 엔티티 또는 이벤트에 대한 **스키마 정의**다. 구체적인 데이터 행이 아니라 클래스 정의에 해당한다.

- **예시**: `Airport`가 Object Type이면, `JFK`와 `LHR`은 해당 타입의 **오브젝트 인스턴스(Object instance)**다.
- 각 Object Type은 반드시 **기본 키(primary key)**와 **타이틀 키(title key)**를 가져야 한다.
- 하나 이상의 **백킹 데이터소스(backing datasource)**와 연결되어야 실제 데이터를 가진다.
- 데이터소스의 각 컬럼은 하나의 **Property**로 매핑된다.

공식 문서 인용:
> "An object type is a schema definition of a real-world entity or event, comprised of individual objects. For example, both `JFK` and `LHR` can be objects of an `Airport` object type."
> — [Object and link types • Types reference](https://palantir.com/docs/foundry/object-link-types/type-reference/)

### 2.2 Properties (속성)

Properties는 Object Type의 속성이다. 각 Property는 특정 데이터 타입(String, Integer, LocalDate 등)을 가지며, 백킹 데이터소스의 컬럼에 매핑된다.

**Value Types**: 단순 데이터 타입의 래퍼(wrapper)로, 이메일 주소, URL, UUID 등 도메인 특화 데이터 타입을 재사용 가능하게 캡슐화한다. 타입 안전성과 데이터 검증을 강화한다.

참고: Foundry의 데이터 타입은 RDF, OWL, XSD에서 영감을 받았음을 공식 문서가 명시하고 있다. [출처](https://palantir.com/docs/foundry/object-link-types/type-reference/)

### 2.3 Link Types (링크 타입)

Link Types는 Object Types 사이의 **관계(relationship)**를 정의한다. 관계형 데이터베이스의 외래키(foreign key) 제약과 개념적으로 유사하지만, 명시적 의미와 방향성을 가진다.

- 예: `Flight` ↔ `Aircraft` (항공편-항공기), `WorkOrder` ↔ `Shipment` (작업지시-선적)
- 파이프라인 내에서 생성할 때는 같은 파이프라인 내 오브젝트끼리만 링크 가능
- 일대다, 다대다 관계 지원 (다대다는 별도 조인 테이블 사용)

### 2.4 Action Types (액션 타입)

Action Type은 사용자가 한 번에 실행할 수 있는 **오브젝트 변경 집합의 정의**다.

공식 정의:
> "An action type is the definition of a set of changes or edits to objects, property values, and links that a user can take at once. It also includes the side effect behaviors that occur with action submission."
> — [Action types • Overview](https://palantir.com/docs/foundry/action-types/overview/)

액션의 구성 요소:
- **Parameters(파라미터)**: 사용자 입력값. Workshop, Slate, Object Views 같은 Foundry 애플리케이션과의 인터페이스
- **Rules(규칙)**: 실행할 변경 로직. 두 가지 유형 존재:
  - *Ontology rules*: 오브젝트/링크/속성 생성·수정·삭제
  - *Side-effect rules*: 알림(notification), 웹훅(webhook) 등 외부 시스템으로의 트리거
- **Submission criteria**: 액션 실행 권한 조건 (예: HR 직원만 역할 변경 가능)

**Function-backed actions**: 복잡한 비즈니스 로직이 필요한 경우, 단순 규칙 대신 커스텀 함수(TypeScript v2 또는 Python)를 사용하는 액션. 조건부 업데이트, 연관 오브젝트 cascading 수정 등에 활용.

### 2.5 Functions (함수)

Functions는 운영 컨텍스트(대시보드, 애플리케이션)에서 빠르게 실행될 수 있는 **코드 형태의 비즈니스 로직**이다. TypeScript v2, Python을 지원하며, 온톨로지 오브젝트를 읽고 쓸 수 있다.

### 2.6 Interfaces (인터페이스)

Interface는 Object Type의 형태(shape)와 기능을 설명하는 온톨로지 타입이다. 공통 구조를 가진 Object Types 간의 **다형성(polymorphism)**을 제공한다. 서로 다른 소스의 유사한 오브젝트를 동일한 인터페이스로 처리 가능.

---

## 3. 기술 아키텍처: Foundry 플랫폼에서의 위치

### 3.1 전체 레이어 구조

```
사용자 애플리케이션 (Workshop, AIP, 외부 앱)
         ↕ OSDK (Ontology SDK)
[온톨로지 레이어]
  - Ontology Metadata Service (OMS)
  - Object Set Service (OSS)
  - Object Databases (Object Storage V2)
  - Actions Service
  - Object Data Funnel
         ↕
[데이터 레이어]
  - Foundry 데이터셋 (변환 완료)
  - Virtual Tables
  - ML 모델
         ↕
[파이프라인 레이어]
  - Pipeline Builder (변환: raw → clean)
         ↕
[데이터 연결 레이어]
  - Data Connection (외부 소스 수집)
  - ERP, CRM, IoT 센서, 지리공간 DB 등
```

### 3.2 백엔드 마이크로서비스 구조

팔란티어 공식 문서에 따르면, 온톨로지 백엔드는 마이크로서비스 아키텍처로 구성된다:

**Ontology Metadata Service (OMS)**
- Object Types, Link Types, Action Types 등 모든 온톨로지 엔티티의 메타데이터 정의를 관리하는 최상위 서비스

**Object Databases (오브젝트 데이터베이스)**
- 인덱싱된 오브젝트 데이터 저장
- 빠른 쿼리와 쿼리 연산 담당
- *Object Storage V1 (Phonograph)*: 레거시 구성요소. 2026년 6월 30일 이후 지원 종료 예정
- *Object Storage V2*: 차세대 정규 데이터 스토어. 인덱싱과 쿼리 서브시스템을 분리하여 수평 확장성 향상

**Object Set Service (OSS)**
- 온톨로지에서의 읽기(read) 담당
- 오브젝트 검색, 필터링, 집계, 로딩 지원
- Static/Dynamic 오브젝트 셋 관리

**Actions Service**
- 사용자 편집을 오브젝트 데이터베이스에 적용
- 복잡한 권한 및 조건 처리
- 사용자 결정의 히스토리 액션 로그 생성

**Object Data Funnel**
- Object Storage V2 아키텍처의 핵심 마이크로서비스
- Foundry 데이터소스(데이터셋, restricted views, 스트리밍 소스)로부터 읽기
- 사용자 편집(Actions)과 소스 데이터를 오브젝트 데이터베이스로 인덱싱
- 백킹 데이터소스 업데이트 시 인덱스 최신화 담당

**Functions on Objects**
- 운영 컨텍스트에서 빠르게 실행되는 로직 실행 서비스

### 3.3 데이터 흐름: 외부 소스 → 온톨로지

팔란티어의 데이터 통합 철학은 **데이터를 원본 그대로(as-is) 수집**하는 것이다. 외부 전처리 없이, 변환 이력을 완전히 Foundry 파이프라인 내부에서 관리한다.

```
1. Data Connection: 외부 소스 → raw 데이터셋 수집 (전처리 없음)
2. Pipeline Builder: raw 데이터셋 → 변환 → clean 데이터셋
3. Ontology Hydration:
   a. Pipeline Builder에서 Object Type 출력 정의
   b. 또는 Ontology Manager에서 기존 데이터셋을 백킹 소스로 연결
4. Object Data Funnel: 데이터셋 → 오브젝트 인덱싱
5. Actions: 사용자 편집 → writeback 데이터셋 → 파이프라인 재처리
```

온톨로지 정의는 내부적으로 **JSON 형식으로 저장**되며, Ontology Management Application (OMA)에서 직접 다운로드할 수 있다. [출처: Palantir Interoperability PDF](https://www.palantir.com/assets/xrfr7uokpv1b/7BxLPkTqJU9QhLTQCjJMo6/eed1457949dc2d1cd6b6e71936c0aa9c/Enabling_Interoperability_and_Embracing_Openness_with_Foundry.pdf)

---

## 4. 전통적 온톨로지(OWL/RDF)와의 차이

### 4.1 전통적 시맨틱 웹 온톨로지

**RDF (Resource Description Framework)**:
- 지식을 삼중항(triple)으로 표현: `<주어> <서술어> <목적어>`
- 분산 웹에서의 데이터 통합 및 메타데이터 관리에 강점

**OWL (Web Ontology Language)**:
- RDF 기반의 형식 온톨로지 언어
- 클래스, 속성, 계층 관계, 논리적 제약 정의
- Description Logic(DL)을 통한 자동 추론(inference) 지원
- 복잡성 높음: 추론 엔진과 온톨로지 편집기가 별도로 필요

예시 (Turtle 문법):
```turtle
:Train5487 a :Train ;
  :hasRoute :Route12 ;
  :hasDriver :JohnDoe ;
  :maxSpeed "120"^^xsd:int ;
  :currentStatus "Delayed" .
```

이것은 **서술적(descriptive)** 온톨로지다. 무엇이 있는지, 어떻게 연결되는지 기술하지만, 그 정보로 무엇을 **해야 하는지**는 알려주지 않는다.

### 4.2 비교 테이블

| 비교 항목 | 팔란티어 온톨로지 | OWL/RDF (시맨틱 웹) |
|---|---|---|
| **주 목적** | 운영 워크플로우, 의사결정 실행 | 형식적 시맨틱, 기계 추론, 웹 상호운용성 |
| **표현 방식** | 오브젝트/링크/액션/함수 | 삼중항 그래프, 클래스 계층, 논리 공리 |
| **추론 능력** | 없음 (규칙 기반 액션으로 대체) | OWL 추론 엔진으로 새 사실 도출 가능 |
| **실시간 운영** | 핵심 기능: 실시간 라이트백, 스트리밍 | 일반적으로 정적, 주기적 갱신 |
| **UI/워크플로우 통합** | 기본 내장 (Workshop, AIP 연동) | 표준에 없음 |
| **보안 모델** | 행/열 수준의 세분화된 보안 내장 | 표준에 없음 (별도 구현 필요) |
| **사용 난이도** | GUI 기반, 비개발자 친화적 | SPARQL, 추론 엔진 필요, 전문가 도메인 |
| **상호운용성** | 독점적, JSON 내보내기 지원 | W3C 표준, 오픈 생태계 |
| **장점** | 실행 가능, 보안, 확장성, 기업 운영 | 형식적 일관성, 추론, 분산 시스템 |
| **단점** | 독점 플랫폼 락인, OWL 추론 없음 | 운영 속도 낮음, 실시간 쓰기 어려움 |

### 4.3 왜 다르게 설계했는가: 설계 철학의 차이

Vladimir Kozlov의 분석에 따르면 (LinkedIn, 2025.05.02):

> "Traditional ontologies like OWL are about formal logic and reasoning... But they're static and usually don't know anything about UI, workflows, or real-time operations. Palantir's operational ontology is about bridging structure with execution."

팔란티어의 설계 선택은 다음 판단에 기반한다:
- 엔터프라이즈 운영 환경에서 **형식적 추론보다 실행 속도와 거버넌스**가 더 중요하다
- 사용자(비전문가 포함)가 직접 온톨로지를 활용할 수 있어야 한다
- 데이터 모델, UI, 보안, 비즈니스 로직이 하나의 일관된 시스템으로 작동해야 한다

비판적 시각: 시맨틱 웹 전문가 Renato Iannella는 팔란티어 온톨로지에 대해 "So it is not an Ontology - just structured YAML"이라는 의견을 남겼다. 이는 팔란티어 온톨로지가 철학적으로 OWL 의미의 "온톨로지"가 아니라는 관점이다. **반증 탐색**: 이 비판은 유효하지만, 팔란티어는 "온톨로지"라는 단어를 더 넓은 의미(지식 표현 + 실행 시스템)로 사용하고 있으며, 이는 학술적 정의와의 차이일 뿐 기능적 효용과는 별개다.

[이질 도메인: 데이터베이스 설계] 이 구분은 데이터베이스 세계에서 "개념 모델"(ERD)과 "실행 모델"(물리 스키마 + 저장 프로시저 + 트리거)의 차이와 유사하다. 팔란티어는 두 레이어를 "온톨로지"라는 하나의 개념으로 통합했다.

---

## 5. 온톨로지 구축 프로세스

### 5.1 Object Type 생성 방법

Foundry에서 Object Type을 만드는 두 가지 경로:

**경로 A: Ontology Manager에서 직접 생성**
1. Ontology Manager → New → Object Type 선택
2. 백킹 소스 없이 생성 (스키마만 먼저 정의) 또는 기존 데이터셋 선택
3. 속성(Properties) 설정: 데이터셋 컬럼이 자동 매핑됨
4. 기본 키(primary key)와 타이틀 키 설정
5. 아이콘, 설명 등 메타데이터 추가

**경로 B: Pipeline Builder에서 파이프라인 출력으로 생성**
1. Pipeline Builder에서 transform 노드 선택 → Add output → New object type
2. Object type 이름 설정, 온톨로지 지정
3. 데이터 컬럼 → Properties 매핑 자동 처리
4. Link Types 추가: Pipeline outputs → Link type → Add → 소스/타겟 오브젝트 지정
5. 파이프라인 배포(deploy)로 온톨로지 업데이트

파이프라인 배포 후 주의사항: Object type ID, 링크, 소스/타겟 오브젝트는 수정 불가 (변경 시 Resolve 절차 필요)

### 5.2 데이터 품질 관리

공식 권고사항 (Palantir Community):
- 별도의 `id` 기본키 컬럼 사용 (소스에 있어도 별도 생성 권장)
- 일관된 명명 규칙 적용 (예: `{verbed}_at_timestamp` 형식)
- 헬스 체크(Health Checks)로 업데이트 빈도와 데이터 품질 모니터링
- 스케줄 적용으로 데이터 신선도 보장

### 5.3 관계 설정

Link Types를 설정하는 방법:
1. 파이프라인에서 오브젝트 생성 시 동일 파이프라인 내 오브젝트 간 링크 정의
2. Ontology Manager에서 기존 Object Types 간 Link Type 추가
3. 다대다 관계는 별도 조인 테이블 데이터셋 필요

---

## 6. OSDK (Ontology SDK) — 개발자 경험

### 6.1 OSDK 개요

OSDK(Ontology Software Development Kit)는 개발 환경에서 온톨로지에 직접 접근할 수 있는 SDK다.

지원 언어:
- **TypeScript**: NPM 패키지 (`@osdk/client`, `@osdk/api`)
- **Python**: Pip 또는 Conda
- **Java**: Maven
- **기타 언어**: OpenAPI Spec 내보내기로 임의 언어 지원

공식 설명:
> "By treating Foundry as your backend, you can leverage the Ontology's robust ability to perform high-scale queries and Foundry writeback alongside granular governance controls to accelerate the process of securely developing applications."
> — [Ontology SDK • Overview](https://palantir.com/docs/foundry/ontology-sdk/overview/)

### 6.2 OSDK의 핵심 장점

1. **빠른 개발**: 온톨로지 API에 인체공학적 접근 제공, 최소한의 코드로 읽기/쓰기
2. **강한 타입 안전성**: 온톨로지의 타입과 함수를 기반으로 코드 생성 → 에디터에서 직접 쿼리 탐색 가능
3. **중앙화된 유지보수**: 온톨로지가 Foundry에서 중앙 관리되므로 앱 개발자는 데이터 기반 유지보수 부담 감소

### 6.3 TypeScript OSDK 예시 (공식 문서 기반)

```typescript
// 레스토랑 오브젝트 페이지네이션 조회
const page: PageResult<Osdk.Instance<Restaurant>> = await client(Restaurant)
  .fetchPage({
    $orderBy: { restaurantName: "asc" },
    $pageSize: 30,
  });

// 집계: 레스토랑 총 수 조회
const count = await client(Restaurant)
  .aggregate({
    $select: { $count: "unordered" },
  });
```

### 6.4 TypeScript OSDK v1 vs v2 변화

| 항목 | OSDK v1 | OSDK v2 |
|---|---|---|
| **성능 스케일링** | 전체 온톨로지 크기에 비례 | 온톨로지 형태/메타데이터에만 비례 |
| **클라이언트-코드 결합** | 강하게 결합 | 분리 (빠른 핫픽스 배포 가능) |
| **로딩 방식** | 즉시 로딩 | 지연 로딩(lazy loading) 지원 |
| **코드 재사용** | 제한적 | 지수적 향상 |

### 6.5 OSDK 지원 타입 제한 사항

현재 OSDK에서 지원되지 않는 타입이 존재한다 (2026-03-23 기준):

TypeScript SDK 미지원: `Cipher`, `Marking`, `Vectors`
Python SDK 미지원: `Cipher`, `Marking`, `Media`, `Struct`, `Vector`

이는 아직 구현 중인 기능으로, 이 타입을 사용하는 Object Type의 해당 속성은 코드 생성 시 건너뛰어진다.

---

## 7. Actions와 Writeback — 운영 시스템으로서의 온톨로지

### 7.1 Writeback 메커니즘

팔란티어 온톨로지는 읽기 전용이 아니다. 사용자가 Action을 통해 오브젝트를 수정하면:

1. 변경사항이 **원자적(atomic) 트랜잭션**으로 커밋됨
2. Object Type의 **writeback 데이터셋**에 사용자 편집이 저장됨
3. 원본 백킹 데이터셋과 편집 데이터가 **병합(merge)** 처리됨 (충돌 해결 포함)
4. 모든 사용자 애플리케이션에 **실시간 반영**됨

공식 설명:
> "Any changes made to objects, property values, and links will be committed to the Ontology when the user takes the action and will be reflected in all user applications."
> — [Action types • Overview](https://palantir.com/docs/foundry/action-types/overview/)

### 7.2 Side Effects: 외부 시스템 연동

Actions의 Side Effect Rules는 온톨로지 내부 변경 외에 외부 시스템에도 영향을 줄 수 있다:

- **알림(Notification)**: 이메일, 슬랙 등 메시지 전송
- **웹훅(Webhook)**: 외부 REST API 호출
- **CDC (Change Data Capture)**: 다른 운영 시스템과의 저지연 동기화

이를 통해 팔란티어 온톨로지는 단순한 데이터 레이어가 아니라 **운영 시스템(operational system)** 역할을 한다.

### 7.3 연속 학습 루프 (Continuous Learning Loop)

액션을 통해 수집된 피드백(사용자 결정, 오브젝트 변경 이력)은:
1. 히스토리 액션 로그로 축적됨
2. ML 모델 재학습에 활용 가능
3. 증강(augmentation)에서 자동화(automation)으로의 전환을 지원

이것이 팔란티어가 "사이버네틱 엔터프라이즈(cybernetic enterprise)"라고 부르는 피드백 루프다.

---

## 8. Researcher 사고 지침 적용

### 8.1 출처 평가

이번 조사에서 사용한 주요 출처:

| 출처 | 도메인 일치도 | 신뢰도 |
|---|---|---|
| Palantir 공식 문서 (palantir.com/docs) | 직접 도메인 | 최고 |
| Palantir Interoperability PDF (2022) | 직접 도메인 | 높음 |
| PVM IT 블로그 (Palantir 파트너사) | 인접 도메인 | 중간-높음 |
| LinkedIn (Vladimir Kozlov, 2025) | 인접 도메인 | 중간 |
| Unit8 블로그 (Foundry 101) | 인접 도메인 | 중간 |

주의: 인접 도메인 출처들은 팔란티어 공식 입장과 다를 수 있으므로, 핵심 주장은 공식 문서로 교차 검증했다.

### 8.2 반증 탐색 결과

**주요 주장에 대한 반증:**

1. *"팔란티어 온톨로지는 기존 시맨틱 웹 온톨로지와 근본적으로 다르다"*
   반증: 팔란티어 내부 데이터 타입이 RDF/OWL/XSD에서 영감을 받았음을 공식 문서가 명시. 완전히 다른 설계가 아니라, 시맨틱 웹 개념을 실용적으로 재해석한 것에 가깝다.

2. *"온톨로지가 조직의 단일 진실 공급원(single source of truth)이다"*
   반증: writeback 데이터셋과 원본 백킹 데이터셋의 병합 과정에서 충돌이 발생할 수 있으며, 스트리밍 백킹 오브젝트는 편집이 제한된다. 완전한 단일 진실이라 보기 어렵다.

3. *"OSDK는 어떤 온톨로지도 완전히 접근할 수 있다"*
   반증: 미지원 타입(Cipher, Marking, Vectors 등)이 존재하며, 이 타입을 사용하는 속성은 코드 생성 시 건너뛰어진다.

### 8.3 수치 투명성

이번 조사에서 특정 수치(임계값, 가중치)는 발견되지 않았다. 아키텍처와 개념 조사였기 때문이다.

**Object Storage V1 지원 종료일 (2026년 6월 30일)**: 팔란티어 공식 문서([object-backend/overview](https://palantir.com/docs/foundry/object-backend/overview/))에서 명시. 이 날짜는 팔란티어가 변경할 수 있으나 현재 공식 공지 기준이다.

### 8.4 관점 확장

**결론을 바꿀 수 있는 인접 질문:**

1. **AI 에이전트와 온톨로지**: 팔란티어 AIP(AI Platform)에서 AI 에이전트가 온톨로지를 어떻게 활용하는가? 에이전트가 Action을 실행할 수 있는가? 이 질문에 따라 온톨로지의 역할이 수동 도구에서 자율 시스템의 기반으로 확장될 수 있다.

2. **온톨로지 거버넌스 비용**: 대규모 조직에서 Object Types와 Link Types의 수가 급격히 늘어날 때 온톨로지 유지보수 복잡도는 어떻게 변하는가? 팔란티어 커뮤니티에서는 온톨로지 설계 원칙에 대한 논의가 활발하다.

[이질 도메인: 소프트웨어 아키텍처 — Domain-Driven Design]
팔란티어 온톨로지의 구조(Object Types = Aggregate Roots, Actions = Commands, Link Types = 도메인 관계)는 DDD(Domain-Driven Design)의 개념적 구조와 매우 유사하다. DDD에서 차용할 수 있는 패턴: Bounded Context 개념을 도입하여 온톨로지 스코프를 팀별로 분리하면 대규모 조직에서의 복잡도 관리에 효과적일 수 있다.

### 8.5 문제 재정의

조사 후 더 적절한 핵심 질문:

> "팔란티어 온톨로지가 '무엇인가'보다, 조직의 의사결정 프로세스를 온톨로지로 표현할 때 어떤 트레이드오프가 발생하며, 언제 이 복잡성이 가치를 창출하고 언제는 오버엔지니어링인가?"

---

## 출처 목록

1. Palantir. "The Ontology system." Foundry Architecture Center. https://palantir.com/docs/foundry/architecture-center/ontology-system/ (2026-03-23 최신)
2. Palantir. "Overview • Ontology." https://palantir.com/docs/foundry/ontology/overview/ (2026-03-23 최신)
3. Palantir. "Action types • Overview." https://palantir.com/docs/foundry/action-types/overview/ (2026-03-22 최신)
4. Palantir. "Ontology architecture." https://palantir.com/docs/foundry/object-backend/overview/ (2026-03-23 확인)
5. Palantir. "Object and link types • Types reference." https://palantir.com/docs/foundry/object-link-types/type-reference/
6. Palantir. "Ontology SDK • Overview." https://palantir.com/docs/foundry/ontology-sdk/overview/
7. Palantir. "TypeScript OSDK migration guide." https://palantir.com/docs/foundry/ontology-sdk/typescript-osdk-migration/
8. Palantir. "Add an Ontology output - Pipeline Builder." https://palantir.com/docs/foundry/pipeline-builder/outputs-add-ontology-output/
9. Palantir. "Enabling Interoperability and Preventing Lock-In with Foundry." (2022 PDF) https://www.palantir.com/assets/xrfr7uokpv1b/...
10. Kozlov, V. "Understanding Palantir's Operational Ontology: A Beginner's Guide." LinkedIn. May 2025. https://www.linkedin.com/pulse/understanding-palantirs-operational-ontology-beginners-kozlov-d0vse
11. Palantir Community. "Ontology and Pipeline Design Principles." https://community.palantir.com/t/ontology-and-pipeline-design-principles/5481 (2025-11-19)
12. GitHub. "palantir/osdk-ts: Typescript related OSDK libraries." https://github.com/palantir/osdk-ts

---

## 검색 비용 통계

| 도구 | 호출 수 | 비용 |
|---|---|---|
| Perplexity search | 4회 | ~$0.06 |
| Tavily search (advanced) | 2회 | 4 크레딧 |
| Tavily extract | 6회 | 6 크레딧 |
| **합계** | **12회** | **~$0.06 + 10 크레딧** |
