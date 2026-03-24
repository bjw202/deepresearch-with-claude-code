# 팔란티어 온톨로지 역설계: Airbus Skywise 케이스

> **Researcher**: Sub-Agent (Deep Researcher)
> **작성일**: 2026-03-24
> **조사 범위**: Airbus Skywise 플랫폼의 팔란티어 Foundry 온톨로지 구조를 역설계 수준으로 분석. Object Type 설계 인과 체인, 데이터 흐름, Action/Writeback, 쿼리 시나리오, 보안 모델 포함.

---

## 시작 전: 이 문서를 읽는 방법

이 문서는 "정답을 외우는 것"이 아니라, **"왜 이렇게 설계했는지"를 따라가는 것**이 목적이다. Airbus Skywise가 팔란티어 Foundry 위에 구축된 방식을 분해하면서, 독자가 비슷한 온톨로지를 처음부터 설계할 수 있는 사고 틀을 제공한다.

기술 용어가 나올 때마다 일상적 비유로 먼저 설명한다. 전문가에게는 부연 설명처럼 보일 수 있지만, 개념 간 연결 고리를 명확히 하기 위한 의도적 선택이다.

---

## 1. 문제 상황의 구체적 묘사: Before

### 1.1 A350 생산 현장의 실제 고통

2015년, Airbus는 A350 생산량을 4배로 늘리겠다는 목표를 세웠다. 하나의 A350에는 약 500만 개의 부품이 들어간다. 이 부품들은 4개국 8개 이상의 공장에서 만들어진다. 프랑스 툴루즈, 독일 함부르크, 영국 브리스톨, 스페인 헤타페가 각각의 파트를 담당한다.

문제는 데이터였다. 생산 일정(production schedule), 교대 근무 일정(shift schedule), 부품 납품 현황(parts delivery), 작업 지시서(work orders), 품질 이슈(quality issues)가 **팀마다, 국가마다 분산된 별개의 시스템**에 저장되어 있었다.

구체적 시나리오를 상상해 보자:

> 프랑스 툴루즈 공장의 최종 조립 라인에서 A350-900 기체 MSN523번의 남은 작업이 몇 건인지 알고 싶다. 어떻게 해야 하는가?
>
> 1. SAP ERP를 열어 해당 기체 번호로 작업 지시서 목록을 조회한다.
> 2. MES(제조실행시스템)를 별도로 열어 실제 진행 상황을 확인한다.
> 3. 부품 조달팀의 엑셀 파일을 받아 납품 지연 부품이 있는지 확인한다.
> 4. 세 시스템의 데이터를 수동으로 대조해 "MSN523의 실제 잔여 작업"을 추산한다.

팔란티어의 공식 사례 문서는 이렇게 기술한다: *"no single person could answer a key question — What work remains, at any given time, on a given aircraft?"* 어떤 한 사람도 특정 시점에 특정 기체에 남은 작업량을 알 수 없었다. 각 팀은 자신이 접근할 수 있는 데이터만 보고 결정을 내렸고, 그 결정이 다른 팀의 작업을 막는 일이 반복되었다.

결과: A350 납기 지연, 생산 목표 미달.

### 1.2 왜 기존 ERP/MES로는 해결이 안 됐는가

기존 시스템들은 각자의 역할에서는 훌륭하게 작동했다. 문제는 **시스템 간 연결**이었다.

SAP ERP는 "재무 관점에서의 작업 지시서"를 알지만, 어느 엔지니어가 지금 무슨 교대 근무 중인지, 필요한 특정 나사가 어느 창고에 있는지는 모른다. MES는 실제 제조 공정 상태를 추적하지만 항공기 전체의 납기 일정과 연동되지 않는다.

더 근본적인 문제는 **의미(semantics)의 부재**였다. ERP의 "A350-900"이라는 텍스트와 MES의 "MSN523"이라는 일련번호가 같은 항공기를 가리킨다는 사실을 컴퓨터는 알지 못했다. 사람이 두 시스템 사이에서 중간 번역 역할을 해야 했다.

팔란티어의 해결책은 새로운 시스템을 구축하는 것이 아니었다. 기존 시스템들 위에 **공통 언어 레이어**를 얹는 것이었다. 그것이 온톨로지다.

### 1.3 Skywise로의 확장: 운항 단계의 문제

A350 생산 문제를 해결한 후, 팔란티어와 Airbus의 협력은 운항 단계로 확장되었다. 2018년 Skywise 플랫폼이 론칭되었고, 지금은 전 세계 12,000대 이상의 항공기가 Skywise에 연결되어 있다. 50,000명 이상의 사용자(항공사 정비 엔지니어, Airbus 엔지니어, MRO 업체)가 이 플랫폼을 쓴다.

운항 단계의 문제는 더 복잡했다:

- 한 대의 항공기에는 수천 개의 센서가 있다. 에어버스 A350에는 각기 다른 시스템(엔진, 유압, 전기, 랜딩기어 등)을 모니터링하는 센서가 약 6,000개 이상 달려 있다.
- 비행 중 생성되는 원시 데이터의 양은 막대하다. 한 항공기가 한 번 비행할 때 수백 MB~수 GB의 데이터가 생성된다.
- 이 데이터에서 "실제로 정비가 필요한 신호"를 찾아내려면 맥락(context)이 필요하다. 동일한 온도 수치도 A320과 A350에서, 또 여름과 겨울에 다른 의미를 가진다.

*[출처: Palantir & Airbus Partnership Overview, 2020; Airbus Newsroom, 2025-04-Digital Twins; Flying Magazine, Airbus 12,000 aircraft Skywise]*

---

## 2. 온톨로지 설계의 인과 체인

이제 Skywise 온톨로지를 구성하는 핵심 Object Type들을 하나씩 분해한다. 각 Object Type에 대해 "왜 필요한가 → 어떤 속성을 가지는가 → 무엇과 어떻게 연결되는가 → 이것이 변하면 무슨 일이 일어나는가"의 순서로 설명한다.

> **Object Type을 모르는 독자를 위한 비유**: Object Type은 엑셀에서 하나의 시트를 만들기 전에 정하는 "이 시트에는 어떤 컬럼들이 있을 것이다"라는 템플릿과 같다. 예를 들어 "항공기" Object Type을 만든다면 "기체번호, 기종, 등록일, 소속항공사" 같은 컬럼들을 미리 정의하는 것이다. 실제 항공기 한 대 한 대는 그 템플릿을 채운 "행(row)"에 해당한다.

### 2.1 Aircraft (항공기)

**이것이 왜 필요한가**

Aircraft Object Type이 없으면 "특정 항공기에 대한 질문"을 할 수 없다. 항공기는 모든 다른 데이터의 **닻(anchor)**이다. 센서 판독값, 정비 기록, 비행 이력, 부품 장착 이력 모두 "어느 항공기의 데이터인가"라는 질문과 연결되어야 한다.

만약 Aircraft Object Type이 없다면, 온톨로지는 무수한 데이터 포인트들이 서로 연결되지 않은 채 떠 있는 상태가 된다. MSN523에 대한 작업 지시서와 MSN524에 대한 센서 경보가 같은 항공기 것인지 다른 것인지 알 수 없게 된다.

**속성(Property) 설계**

| 속성 이름 | 데이터 타입 | 출처 시스템 | 이 속성이 없으면? |
|---|---|---|---|
| `msn` (기체 일련번호) | String (기본 키) | Airbus 내부 생산 DB | 이 항공기를 다른 기체와 구별할 수 없음 |
| `aircraftType` | String (A320neo, A350-900 등) | 항공기 등록 DB | 성능 임계값 설정 불가. A320과 A350는 동일 온도에 다른 경보 기준을 가짐 |
| `registrationMark` | String (예: F-WZFM) | 항공 당국 등록부 | 항공사 운용 기록과 연결 불가 |
| `operatorAirlineCode` | String (예: AF, DL) | 항공사 계약 DB | 보안 필터링 불가. 에어프랑스는 에어프랑스 항공기 데이터만 봐야 함 |
| `deliveryDate` | LocalDate | 인도 기록 DB | 기체 나이(age) 기반 정비 주기 계산 불가 |
| `totalFlightHours` | Double | ACARS(비행 데이터 전송 시스템) | 부품 수명 계산 불가. "이 엔진은 5,000시간마다 교체" 같은 규칙 적용 불가 |
| `totalLandingCycles` | Integer | ACARS | 랜딩기어, 브레이크 등 사이클 기반 부품 수명 계산 불가 |

> **수치 투명성**: `totalFlightHours`와 `totalLandingCycles`는 ACARS(Aircraft Communications Addressing and Reporting System)에서 자동 집계되지만, 실제 Skywise에서는 항공사 자체 Ground Handling 시스템에서 보정되는 경우도 있다. "이 수치가 틀릴 수 있는 조건": 항공사 IT 시스템과 ACARS 데이터 간 동기화 지연이 있을 경우 일시적으로 부정확할 수 있다.

**관계(Link) 설계**

Aircraft는 온톨로지에서 가장 많은 관계를 가지는 Object Type이다. 모든 운항 데이터의 중심이기 때문이다.

> **Link를 모르는 독자를 위한 비유**: Link는 두 엑셀 시트를 VLOOKUP으로 연결하는 것과 비슷하다. 그런데 VLOOKUP보다 강력한 이유는, (1) 양방향으로 탐색 가능하고, (2) 관계 자체에 의미와 이름이 붙어 있기 때문이다. "항공기는 여러 개의 비행편을 가진다"는 관계와 "항공기는 여러 개의 작업 지시서를 가진다"는 관계는 둘 다 항공기로부터 뻗어 나가지만 전혀 다른 의미를 가진다.

| Link 이름 | 대상 Object Type | 카디널리티 | 설계 이유 |
|---|---|---|---|
| `hasFlight` | Flight | 1:N (한 항공기 → 여러 비행편) | 비행 이력 추적, 비행 후 데이터 집계 |
| `hasWorkOrder` | WorkOrder | 1:N | 특정 항공기에 열린 정비 작업 조회 |
| `hasComponent` | Component | 1:N | 현재 장착된 부품 목록 및 각 부품의 잔여 수명 |
| `hasAlert` | MaintenanceAlert | 1:N | 이 항공기에 발생한 경보 전체 이력 |
| `operatedBy` | Airline | N:1 (여러 항공기 → 한 항공사) | 항공사별 집계, 보안 필터링 |

**이 Object가 변하면 무슨 일이 일어나는가**

Aircraft의 `totalFlightHours` 속성이 특정 임계값에 도달하면:
1. 연결된 Component Object들의 잔여 수명이 재계산된다.
2. 잔여 수명이 경고 구간(예: 100시간 미만)에 들어온 Component는 MaintenanceAlert를 생성한다.
3. MaintenanceAlert가 생성되면 WorkOrder 생성 Action의 트리거가 된다.
4. WorkOrder가 생성되면 담당 항공사의 정비 계획 대시보드에 표시된다.

이 연쇄는 자동으로 발생한다. 엔지니어가 수동으로 세 시스템을 확인하지 않아도 된다.

---

### 2.2 Flight (비행편)

**이것이 왜 필요한가**

Flight Object Type이 없으면 "맥락 있는 센서 데이터 해석"이 불가능하다. 동일한 엔진 진동 수치도 이륙 단계인지 순항 단계인지, 기온이 영하 60도인 고고도인지 착륙 직전의 저고도인지에 따라 의미가 완전히 달라진다.

Flight는 센서 데이터에 **운항 컨텍스트**를 붙여주는 역할을 한다.

**속성(Property) 설계**

| 속성 이름 | 데이터 타입 | 출처 | 의미 |
|---|---|---|---|
| `flightNumber` | String (기본 키) | 항공사 운항 시스템 | |
| `departureAirport` | String (IATA 코드) | 항공사 운항 시스템 | |
| `arrivalAirport` | String | 항공사 운항 시스템 | |
| `actualDepartureTime` | Timestamp | ACARS | 실제 이륙 시각. "예정" 시각과 구분 |
| `flightDuration` | Integer (분) | ACARS 계산 | 비행 시간당 부품 마모율 계산의 기준 |
| `flightPhaseAtEvent` | String (이륙/순항/착륙) | ACARS 파생 | 센서 이벤트 발생 시점의 비행 단계 |

**관계 설계**

- `Flight` → `Aircraft`: N:1 (여러 비행편이 한 항공기에 연결)
- `Flight` → `SensorReading` (시계열): 1:N (한 비행에서 수백만 개의 센서 읽기값)
- `Flight` → `FaultCode` (고장 코드): 1:N (비행 중 BITE 시스템이 기록한 고장 코드)

---

### 2.3 Component (부품/컴포넌트)

**이것이 왜 필요한가**

Component Object Type이 없으면 "이 항공기에 지금 어떤 부품이 달려 있고 각각의 잔여 수명은 얼마인가"라는 질문에 답할 수 없다.

항공 정비의 핵심은 부품 수명 관리다. 항공기 부품은 크게 두 종류다:

- **시한성 부품(Life Limited Parts, LLP)**: 제조사가 정한 최대 사용 한계(비행 시간 또는 착륙 사이클)가 있어서 그 한계에 달하면 무조건 교체해야 한다. 엔진 터빈 블레이드, 랜딩기어 액슬 등이 여기에 해당한다.
- **조건 기반 부품(On-Condition Parts)**: 검사 결과나 센서 데이터를 바탕으로 교체 여부를 판단한다. 브레이크 패드, 타이어 등이 여기에 해당한다.

Component Object Type이 없으면 이 두 종류의 부품을 개별적으로 추적할 수 없다.

**속성 설계**

| 속성 이름 | 데이터 타입 | 의미 |
|---|---|---|
| `partNumber` | String (기본 키) | 제조사 부품 번호 |
| `serialNumber` | String | 개별 부품 고유 번호 |
| `componentType` | Enum (LLP, On-Condition, Rotable) | 정비 규칙 결정의 기준 |
| `installedFlightHours` | Double | 이 부품이 현재 항공기에 장착된 이후 누적 비행 시간 |
| `totalFlightHours` | Double | 이 부품의 전체 생애 누적 비행 시간 (항공기 이동 이력 포함) |
| `maxLifeHours` | Double | 제조사 지정 최대 사용 시간 (LLP의 경우) |
| `remainingLifeHours` | Double (파생 속성) | `maxLifeHours - totalFlightHours` |
| `installationDate` | LocalDate | 현재 항공기에 장착된 날짜 |

> **설계 포인트**: `remainingLifeHours`는 실제 외부 소스에서 가져오는 것이 아니라, 온톨로지 내 함수(Function)가 계산해서 채우는 **파생 속성(Derived Property)**이다. 이것이 가능한 이유는 온톨로지가 단순한 데이터 저장소가 아니라 계산 로직을 포함하기 때문이다.

**이 Object가 변하면 무슨 일이 일어나는가**

Component의 `remainingLifeHours`가 100시간 미만으로 떨어지면:
1. 해당 Component에 연결된 MaintenanceAlert Object가 생성된다. (경보 등급: Yellow)
2. `remainingLifeHours`가 50시간 미만이 되면 경보 등급이 Red로 변경된다.
3. Red 경보가 생성되면 연결된 WorkOrder 생성 Action이 자동으로 트리거될 수 있다.

---

### 2.4 SensorReading (센서 판독값)

**이것이 왜 필요한가**

이것은 Skywise에서 가장 특별한 Object Type이다. 일반적인 데이터베이스의 테이블 행이 아닌, **시계열 데이터(time-series data)**로 처리되기 때문이다.

팔란티어 Foundry에서 SensorReading은 표준 Object Type이 아닌 **Time Series Object**로 구현된다. 이것은 빠른 시계열 조회와 이상 탐지 계산에 최적화된 별도의 저장소 구조를 사용한다.

A350 한 대에는 약 6,000개의 센서가 있다. 1초당 수백 개의 측정값을 생성한다. 한 번의 10시간 비행에서 생성되는 데이터 포인트는 수천만 개에 달한다. 이를 일반 테이블 구조로 저장하면 쿼리 성능이 급격히 저하된다.

**속성 설계**

| 속성 이름 | 의미 |
|---|---|
| `sensorId` | 어느 센서에서 온 데이터인가 |
| `timestamp` | 언제 측정됐는가 |
| `value` | 측정값 (온도, 압력, 진동 등 단위는 센서별로 다름) |
| `unit` | 단위 (°C, PSI, g 등) |
| `qualityFlag` | 데이터 품질 (정상, 보정 필요, 오류) |

**특수성: 시계열 링크**

SensorReading은 Aircraft에 직접 링크되는 것이 아니라, **Aircraft → Flight → SensorReading**의 체인으로 연결된다. 이는 맥락(context) 없는 센서 데이터는 의미가 없기 때문이다. 어느 비행의 이륙 단계에서 측정된 값인지가 분석의 기준이 된다.

---

### 2.5 MaintenanceAlert (정비 경보)

**이것이 왜 필요한가**

MaintenanceAlert는 "원시 센서 데이터"와 "사람의 행동"을 연결하는 **인터페이스 역할**을 한다.

수천만 개의 센서 데이터 포인트 중 어느 것이 실제 정비 행동을 필요로 하는지 사람이 직접 보기는 불가능하다. ML 모델이나 임계값 기반 규칙이 "이 데이터는 주의가 필요하다"고 판단하면, 그 판단의 결과물이 MaintenanceAlert Object로 구체화된다. 이 시점에서 비로소 사람이 개입한다.

**속성 설계**

| 속성 이름 | 데이터 타입 | 의미 |
|---|---|---|
| `alertId` | String (기본 키) | |
| `alertType` | String (PredictiveMaintenance, FaultCode, LifeLimitApproach) | 경보의 발생 원인 |
| `severity` | Enum (Green, Yellow, Red) | 긴급도 |
| `detectionMethod` | String (MLModel, ThresholdRule, ManualReport) | 어떻게 탐지됐는가 |
| `affectedSystem` | String (Engine, Hydraulics, LandingGear 등) | 관련 시스템 |
| `predictedFailureDate` | LocalDate (nullable) | ML 모델이 예측한 고장 시점 |
| `recommendedAction` | String | 권장 조치 |
| `status` | Enum (Open, Acknowledged, Resolved, FalsePositive) | 현재 처리 상태 |
| `createdAt` | Timestamp | |

**관계 설계**

- `MaintenanceAlert` → `Aircraft`: N:1
- `MaintenanceAlert` → `Component`: N:1 (어떤 부품에 대한 경보인가)
- `MaintenanceAlert` → `WorkOrder`: 1:0..1 (경보가 작업 지시서로 전환됐는가)

**이 Object가 변하면 무슨 일이 일어나는가**

MaintenanceAlert의 `severity`가 Green → Red로 변경되면:
1. 연결된 항공사의 운항 관리팀에 Notification Side Effect가 발동된다.
2. 경보가 특정 비행에 영향을 줄 경우, 해당 항공사의 운항 스케줄링 시스템에 Webhook이 발동될 수 있다.
3. 엔지니어가 이 경보를 검토하고 "WorkOrder 생성" Action을 실행할 수 있는 상태가 된다.

---

### 2.6 WorkOrder (작업 지시서)

**이것이 왜 필요한가**

WorkOrder는 "경보가 실제 행동으로 바뀌는 순간"을 기록한다. 정비 업무의 법적, 운영적 단위이기도 하다.

항공사는 모든 정비 작업을 규제 기관(FAA, EASA 등)에 기록하고 보고해야 한다. WorkOrder는 "누가, 언제, 어떤 항공기의 어떤 부품에, 어떤 작업을 했는가"를 공식적으로 기록하는 문서다. 이것이 온톨로지에 있어야 하는 이유는, 작업 지시서와 센서 데이터, 부품 이력, 항공기 가용성이 **하나의 일관된 뷰**로 연결되어야 하기 때문이다.

**속성 설계**

| 속성 이름 | 데이터 타입 | 출처 |
|---|---|---|
| `workOrderId` | String (기본 키) | MRO 시스템 또는 Skywise 생성 |
| `workOrderType` | Enum (Scheduled, Unscheduled, Predictive) | |
| `status` | Enum (Open, InProgress, Completed, Deferred) | |
| `scheduledDate` | LocalDate | 정비 계획 시스템 |
| `completedDate` | LocalDate (nullable) | 정비사 입력 |
| `estimatedDowntimeHours` | Double | 스케줄링 계산용 |
| `taskDescription` | String | |
| `assignedTechnicianId` | String | HR 시스템 |
| `airportLocation` | String | 어느 공항에서 정비가 수행되는가 |

**관계 설계**

- `WorkOrder` → `Aircraft`: N:1
- `WorkOrder` → `Component`: N:N (하나의 작업 지시서가 여러 부품을 다룰 수 있음)
- `WorkOrder` → `MaintenanceAlert`: N:1 (어떤 경보로부터 발생했는가)
- `WorkOrder` → `Technician`: N:N (여러 정비사가 하나의 작업에 참여)

---

### 2.7 Airline (항공사)

**이것이 왜 필요한가**

Skywise는 단일 항공사를 위한 시스템이 아니다. 에어프랑스, 델타항공, 이지젯, 대한항공 등 수십 개의 항공사가 같은 플랫폼을 사용한다. Airline Object Type은 두 가지 역할을 한다:

1. 집계의 기준: "에어프랑스 전체 A350 함대의 미완료 WorkOrder는 몇 개인가"
2. 보안의 기준: 에어프랑스는 자신의 항공기 데이터만 볼 수 있어야 한다.

---

## 3. 데이터 흐름의 완전한 추적: Raw → 온톨로지

### 3.1 구체적 시나리오 선택

A350-900 항공기 MSN523의 **엔진 오일 온도 센서** 데이터가 외부 소스에서 어떻게 온톨로지의 Object가 되는지 추적한다.

### 3.2 0단계: 비행기 안 (센서 → ACARS)

10,000미터 고도에서 비행 중인 A350-900. 엔진 1번의 오일 온도 센서가 매초마다 값을 기록한다.

이 데이터는 먼저 항공기 내부의 **ACMU(Aircraft Condition Monitoring Unit)**에 수집된다. ACMU는 수천 개의 센서 데이터를 수집하고 이상 패턴을 감지하면 ACARS 메시지로 지상에 전송한다.

착륙 후에는 QAR(Quick Access Recorder) 또는 WiFi/셀룰러 연결을 통해 전체 비행 데이터가 지상으로 전송된다.

**원시 데이터 형태** (예시):
```json
{
  "acmsReport": "ATA_79_01",
  "msn": "MSN523",
  "flightId": "AF1234_2026-03-24",
  "timestamp": "2026-03-24T08:23:11Z",
  "parameterCode": "ENG1_OIL_TEMP",
  "value": 187.3,
  "unit": "CELSIUS",
  "phase": "CRUISE"
}
```

이 단계에서 데이터는 Airbus의 데이터 수신 인프라(Skywise Core Platform의 수신 레이어)로 들어온다.

### 3.3 1단계: 수신 및 원시 저장 (Raw Ingestion)

Foundry의 **데이터 연결(Data Connection)** 레이어가 ACARS 메시지와 QAR 데이터를 수신한다.

> **파이프라인이란**: 데이터가 원본 → 정리 → 온톨로지로 흘러가는 과정을 말한다. 물이 파이프를 타고 흐르듯, 데이터가 단계별로 변환되며 이동한다.

이 단계에서 생성되는 데이터셋을 **Raw Dataset**이라고 부른다. 이 데이터셋은 가공되지 않은 원본 그대로다. 형식이 통일되지 않았을 수 있고, 품질 문제가 있을 수 있다.

**Foundry 프로젝트 구조** (팔란티어 공식 문서의 권장 패턴):
```
Skywise [Datasource]:
  - raw_acars_messages (Raw Dataset)
  - raw_qar_data (Raw Dataset)
  - raw_airline_maintenance_records (Raw Dataset)

Skywise [Transform]:
  - cleaned_sensor_readings (변환 Dataset)
  - aircraft_flight_hours_aggregated (변환 Dataset)

Skywise [Ontology]:
  - SensorReading (Object Type 백킹 Dataset)
  - Aircraft (Object Type 백킹 Dataset)
  - WorkOrder (Object Type 백킹 Dataset)
```

*[출처: Palantir Foundry 공식 문서, "Securing a data foundation" — Sky Industries 예시 패턴 적용]*

### 3.4 2단계: 변환(Transform) — 정제와 표준화

Pipeline Builder(팔란티어 Foundry의 시각적 데이터 변환 도구)에서 변환이 수행된다.

> **Pipeline Builder란**: 엑셀의 파워쿼리와 비슷하다. 여러 소스에서 데이터를 가져와, 각 단계마다 어떻게 가공할지를 박스와 화살표로 그리면서 정의한다. 최종 결과가 온톨로지의 Object Type을 채우는 데이터셋이 된다.

이 단계에서 수행되는 변환들:

1. **MSN 표준화**: `"MSN523"`, `"msn_523"`, `"523"` 등 다양한 형식으로 들어오는 기체 번호를 `"523"`으로 통일
2. **타임스탬프 정규화**: UTC로 통일, 시간대 오류 수정
3. **파라미터 코드 매핑**: `"ENG1_OIL_TEMP"` → `"엔진1 오일 온도"`로 사람이 읽을 수 있는 레이블로 변환
4. **품질 플래그 부여**: 측정값이 물리적으로 불가능한 범위(예: 오일 온도 -200°C)인 경우 `qualityFlag = "ERROR"` 설정
5. **항공기 컨텍스트 조인**: `msn`을 키로 항공기 기본 정보(기종, 운항 항공사)를 JOIN

변환 후 데이터 형태:
```json
{
  "sensorReadingId": "uuid-generated",
  "aircraftMsn": "523",
  "aircraftType": "A350-900",
  "operatorCode": "AF",
  "flightId": "AF1234_2026-03-24",
  "sensorId": "ENG1_OIL_TEMP",
  "sensorLabel": "Engine 1 Oil Temperature",
  "timestamp": "2026-03-24T08:23:11Z",
  "value": 187.3,
  "unit": "CELSIUS",
  "flightPhase": "CRUISE",
  "qualityFlag": "NORMAL"
}
```

### 3.5 3단계: Object Type 매핑 — 온톨로지로의 진입

변환된 데이터셋이 Pipeline Builder의 **Ontology Output**으로 연결된다.

> **Ontology Output이란**: Pipeline Builder에서 변환 결과를 단순 데이터셋으로 저장하는 것이 아니라, "이 데이터가 SensorReading Object Type의 인스턴스들이다"라고 선언하는 것이다. 이 선언이 이루어지는 순간, 데이터는 단순한 행이 아니라 온톨로지의 "시민"이 된다.

Pipeline Builder에서 수행하는 매핑:

```
변환된 Dataset의 컬럼 → SensorReading Object Type의 Property

sensorReadingId  → Primary Key
aircraftMsn      → [Aircraft Object Type의 기본 키와 Link 설정]
flightId         → [Flight Object Type의 기본 키와 Link 설정]
sensorId         → sensorId Property
timestamp        → timestamp Property
value            → value Property
unit             → unit Property
qualityFlag      → qualityFlag Property
```

팔란티어 공식 문서는 이 과정에 대해 Aircraft-Flight 링크 예시를 제공한다:

> "One-to-many cardinality: This indicates that one `Aircraft` can be linked to many `Flights`."
> — Palantir Foundry 공식 문서, "Add an Ontology output"

### 3.6 4단계: 인덱싱 — 쿼리 가능 상태

매핑이 완료되면 Foundry의 **Phonograph**(온톨로지 오브젝트 저장소)에 인덱싱된다.

이 시점부터 SensorReading Object는:
- OSDK(온톨로지 SDK)를 통해 프로그래밍으로 조회 가능
- Workshop/Slate 대시보드에서 필터링/시각화 가능
- AIP(AI Platform)의 에이전트가 자연어로 질문하면 읽을 수 있는 상태

전체 경로 요약:
```
A350 센서 → ACMU → ACARS 전송 → Foundry 수신(Raw Dataset)
→ Pipeline Builder 변환(Transform Dataset)
→ Ontology Output 매핑
→ Phonograph 인덱싱
→ SensorReading Object 인스턴스 (쿼리 가능)
```

---

## 4. Action과 Writeback: 엔지니어가 버튼을 누르면

### 4.1 시나리오: "센서 교체 완료" 처리

정비 엔지니어 김민준(대한항공 A350 정비팀)이 HL8082 항공기의 엔진 1번 오일 압력 센서를 교체했다. Skywise 모바일 앱에서 "작업 완료" 버튼을 누른다.

이 버튼 뒤에는 **Action Type: `CompleteWorkOrder`**가 정의되어 있다.

### 4.2 Action Type의 구조

팔란티어 공식 문서에서 Action Type의 공식 정의:

> "An action type is the definition of a set of changes or edits to objects, property values, and links that a user can take at once. It also includes the side effect behaviors that occur with action submission."

`CompleteWorkOrder` Action Type의 정의:

**파라미터 (Parameters)**:
```
workOrderId: WorkOrderObjectSet   # 어떤 작업 지시서를 완료할 것인가
completionDate: LocalDate         # 완료 날짜
technicianSignature: String       # 정비사 서명/ID
newPartSerialNumber: String       # 교체된 새 부품 번호 (nullable)
notes: String                     # 추가 메모
```

**규칙 (Rules)**:
1. **Ontology Rule 1** — WorkOrder Object의 `status`를 `"InProgress"` → `"Completed"`로 변경
2. **Ontology Rule 2** — WorkOrder Object의 `completedDate`를 입력받은 날짜로 설정
3. **Ontology Rule 3** — 연결된 MaintenanceAlert Object의 `status`를 `"Resolved"`로 변경
4. **Ontology Rule 4** — 구 부품의 Component Object: `installedDate = null`, `installedOn = null`로 설정 (장착 해제)
5. **Ontology Rule 5** — 신 부품의 Component Object: `installedDate = 오늘`, `installedOn = 항공기 ID`로 설정, Aircraft와 Link 생성
6. **Side Effect Rule 1** — 항공사 운항 관리팀에 "HL8082 WO-2026-3441 완료" Notification 발송
7. **Side Effect Rule 2** — EASA 규정 준수 보고 시스템에 Webhook 트리거

**Submission Criteria (실행 조건)**:
- 실행자가 해당 항공기의 작업을 담당하는 `CertifiedTechnician` 역할을 가지고 있을 것
- 대한항공 Organization에 속한 사용자일 것

### 4.3 Writeback 메커니즘

> **Writeback이란**: Action이 온톨로지 내 Object를 변경할 때, 그 변경 내용이 다시 백킹 데이터셋(Backing Dataset)에 기록되는 과정이다. 마치 구글 시트에서 데이터를 수정하면 연결된 원본 스프레드시트가 업데이트되는 것과 비슷하다.

Writeback이 실행되는 과정:

```
1. 엔지니어가 "완료" 버튼 클릭

2. Action Type: CompleteWorkOrder 실행
   ↓
3. Foundry의 Action 처리 레이어가 파라미터 검증
   - workOrderId가 유효한가?
   - 실행자에게 권한이 있는가?
   ↓
4. 변경 사항이 Writeback Dataset에 트랜잭션으로 기록
   - 파일 형식: Delta Lake 또는 Parquet
   - 변경 내용: { workOrderId: "WO-2026-3441", status: "Completed", completedDate: "2026-03-24", ... }
   ↓
5. Phonograph(오브젝트 저장소)가 해당 Object 인스턴스 업데이트
   ↓
6. 연결된 모든 대시보드/애플리케이션에 변경 즉시 반영
   ↓
7. Side Effects 실행: Notification, Webhook
   ↓
8. (선택적) 파이프라인 재트리거:
   WorkOrder 상태 변경이 다운스트림 집계 파이프라인을
   트리거하여 "항공기 가용성 예측" 데이터셋 업데이트
```

### 4.4 Function-backed Actions: 복잡한 로직

단순 속성 변경이 아닌 복잡한 비즈니스 로직이 필요할 때는 **Function-backed Action**을 사용한다.

예: "예측 정비 경보 기반 자동 WorkOrder 생성" Action

```typescript
// Palantir Foundry TypeScript Function 예시 (구조만 예시, 실제 코드 아님)
import { Aircraft } from "@ontology/sdk";
import { MaintenanceAlert, WorkOrder } from "@ontology/sdk";

export async function createPredictiveWorkOrder(
  client: Client,
  alertId: string
): Promise<WorkOrder> {

  // 경보 Object 조회
  const alert = await client(MaintenanceAlert).where({
    alertId: { $eq: alertId }
  }).fetchOne();

  // 연결된 항공기 조회 (Link 탐색)
  const aircraft = await alert.$link.aircraft.get();

  // 영향받은 부품 조회
  const component = await alert.$link.affectedComponent.get();

  // 항공기 현재 위치 기반 최적 정비 공항 계산
  const bestAirport = calculateOptimalMaintenanceAirport(
    aircraft.currentLocation,
    component.componentType
  );

  // 새 WorkOrder Object 생성
  return client(WorkOrder).create({
    workOrderType: "Predictive",
    status: "Open",
    scheduledDate: alert.predictedFailureDate,
    airportLocation: bestAirport,
    // ... 기타 속성
  });
}
```

*[출처: Palantir Foundry 공식 문서 TypeScript v2 마이그레이션 가이드의 Aircraft 예시 패턴 적용; palantir.com/docs/foundry/functions/typescript-v2-migration/]*

---

## 5. 실제 쿼리 시나리오: 온톨로지 탐색의 힘

### 5.1 시나리오: "MSN523의 미완료 WorkOrder 전체를 보여줘"

이 질문이 온톨로지에서 어떻게 해결되는지 단계별로 따라간다.

**OSDK TypeScript 코드 (구조 예시)**:
```typescript
import { Aircraft, WorkOrder } from "@ontology/sdk";

// 1. MSN으로 Aircraft Object 조회
const aircraft = await client(Aircraft)
  .where({ msn: { $eq: "523" } })
  .fetchOne();

// 2. Aircraft → WorkOrder Link를 타고 연결된 WorkOrder 조회
const openWorkOrders = await aircraft
  .$link.hasWorkOrder
  .where({ status: { $eq: "Open" } })
  .fetchPage({ pageSize: 100 });

// 3. 각 WorkOrder에서 연결된 Component와 Alert 정보 함께 조회
for (const workOrder of openWorkOrders.data) {
  const relatedAlert = await workOrder.$link.maintenanceAlert.get();
  const affectedComponents = await workOrder.$link.hasComponent.fetchAll();

  console.log({
    workOrderId: workOrder.workOrderId,
    type: workOrder.workOrderType,
    scheduledDate: workOrder.scheduledDate,
    alertSeverity: relatedAlert?.severity,
    componentCount: affectedComponents.length
  });
}
```

*[출처: Palantir Foundry 공식 문서 "Query functions" Aircraft 예시 패턴 적용; palantir.com/docs/foundry/functions/query-functions/]*

### 5.2 이것이 SQL과 어떻게 다른가

표면적으로는 비슷해 보인다. SQL로도 JOIN을 쓰면 같은 결과를 얻을 수 있다.

```sql
-- SQL로 같은 결과를 얻는 방법
SELECT wo.work_order_id, wo.status, wo.scheduled_date
FROM work_orders wo
JOIN aircraft a ON wo.aircraft_id = a.id
WHERE a.msn = '523' AND wo.status = 'Open';
```

그러나 온톨로지 접근법의 차이점이 있다:

**차이 1: 스키마를 몰라도 된다**

SQL을 쓰려면 "work_orders 테이블의 aircraft_id가 aircraft 테이블의 id와 JOIN 된다"는 것을 사전에 알아야 한다. 온톨로지에서는 `aircraft.$link.hasWorkOrder`라는 의미 있는 이름을 타고 탐색하면 된다. 새로운 개발자가 DB 스키마 문서를 읽지 않아도 온톨로지 구조를 직관적으로 탐색할 수 있다.

**차이 2: 데이터 소스가 달라도 하나처럼 작동한다**

Aircraft 데이터는 ERP에서, WorkOrder 데이터는 MRO 시스템에서, Component 데이터는 별도의 부품 추적 DB에서 올 수 있다. SQL JOIN을 하려면 이 세 시스템의 DB에 동시에 접근해야 한다. 온톨로지에서는 세 소스 모두 같은 Object 공간에 있는 것처럼 탐색된다.

**차이 3: 보안이 쿼리에 투명하게 적용된다**

SQL에서는 "대한항공 사용자가 에어프랑스 데이터를 볼 수 없게 하기" 위해 WHERE 절에 별도의 조건을 추가하거나, 뷰(View)를 만들어야 한다. 이를 깜빡하면 데이터 유출이 된다.

온톨로지에서는 사용자의 Organization 소속이 자동으로 모든 쿼리에 적용된다. 대한항공 엔지니어가 `Aircraft`를 쿼리하면 자동으로 대한항공 소속 항공기만 보인다. 별도의 WHERE 조건이 필요 없다.

**차이 4: AI 에이전트가 자연어로 같은 쿼리를 실행할 수 있다**

AIP(AI Platform)에서 LLM 에이전트가 "MSN523에 이번 주 안에 처리해야 할 급한 정비 작업이 있어?"라고 자연어로 물어보면, 에이전트는 동일한 온톨로지 API를 호출해서 답을 찾는다. SQL은 이 과정에서 LLM이 SQL 쿼리를 생성하는 중간 단계가 필요하고, 그 SQL이 틀릴 위험이 있다.

---

## 6. 보안 모델: 항공사 A는 자기 데이터만

### 6.1 다중 테넌트 문제

Skywise는 Airbus의 항공기를 운항하는 수십 개의 항공사가 같은 플랫폼을 공유한다. 핵심 보안 요구사항:

- **대한항공**은 대한항공이 운항하는 항공기 데이터만 볼 수 있다.
- **에어프랑스**는 에어프랑스 데이터만 볼 수 있다.
- **Airbus**는 모든 항공사의 데이터를 볼 수 있다 (OEM으로서).
- 데이터 집계(예: "A350 전체 함대의 평균 엔진 오일 교환 주기")는 각 항공사가 공유에 동의한 익명화 데이터만 사용한다.

### 6.2 Organization 모델: 가장 강한 격벽

팔란티어 Foundry에서 가장 강력한 격리 단위는 **Organization**이다.

> "Organizations are access requirements applied to Projects that enforce strict silos between groups of users and resources. Every user is a member of only one Organization."
> — Palantir Foundry 공식 문서, "Cross-Organization collaboration"

팔란티어 공식 문서에서 제공하는 *Sky Industries / Sunrise Airline* 협업 예시가 정확히 Airbus/항공사 구조와 동일하다:

```
Foundry Enrollment: Skywise
  ├── Organization: Airbus (전체 데이터 접근)
  │     └── Space: Skywise Core
  │           └── Ontology: Master Ontology (전체 Aircraft, WorkOrder 등)
  ├── Organization: 대한항공
  │     └── Space: Korean Air Private
  │           └── Ontology: KAL-only Ontology (KAL 항공기만)
  ├── Organization: 에어프랑스
  │     └── Space: Air France Private
  │           └── Ontology: AF-only Ontology (AF 항공기만)
  └── Organization: Delta Air Lines
        └── Space: Delta Private
              └── Ontology: Delta-only Ontology (Delta 항공기만)
```

*[출처: Palantir Foundry 공식 문서 "Cross-Organization collaboration", Sky Industries/Sunrise Airline 패턴 적용; palantir.com/docs/foundry/security/cross-organization-collaboration/]*

### 6.3 행 수준 보안 (Row-Level Security)

Organization 격리 외에도, 온톨로지 레벨에서 더 세밀한 행 수준 보안이 적용된다.

팔란티어 공식 문서의 항공 예시:

> "As an example, consider a `Passenger` object type in an airline management platform with the properties `User ID`, `Flight Number`, `Seat Assignment`, `Name`, `Address`, and `Phone Number`."
>
> "Row-level security: Certain users are VIPs and their object instances, corresponding to rows in the backing dataset, can only be seen if a user has the `VIP` marking."

Skywise에서의 적용:

```
Aircraft Object Type에 대한 행 수준 보안 정책:

보안 Policy: "AirlineOperatorAccess"
  규칙: aircraft.operatorAirlineCode == 현재_사용자.airlineCode
        OR 현재_사용자.role == "AirbusAdmin"

결과:
- 대한항공 사용자가 Aircraft를 쿼리 → operatorAirlineCode = "KE"인 행만 반환
- Airbus 관리자가 쿼리 → 전체 반환
- Delta 사용자가 쿼리 → operatorAirlineCode = "DL"인 행만 반환
```

*[출처: Palantir Foundry 공식 문서 "Manage object security"; palantir.com/docs/foundry/object-permissioning/managing-object-security/]*

### 6.4 열 수준 보안 (Column-Level Security)

특정 속성이 민감한 정보를 담고 있을 때 열 단위로 접근을 제한할 수 있다.

Skywise 적용 예:

- `Component.manufacturingCost` (제조 단가) — Airbus 내부 직원만 접근 가능
- `Aircraft.purchasePriceUSD` (구매 가격) — 해당 항공사 재무팀과 Airbus만 접근 가능
- `MaintenanceAlert.rawSensorData` — Airbus 엔지니어링팀과 해당 항공사 기술팀만 접근 가능

### 6.5 데이터 공유: 익명화 집계의 힘

Skywise의 독특한 가치 중 하나는 **익명화 집계 데이터 공유**다. easyJet이 A320neo의 특정 브레이크 부품에서 이상 패턴을 발견하면, 그 패턴이 익명화되어 다른 A320neo 운항 항공사에도 경보로 공유된다.

팔란티어 공식 사례 문서는 이를 *"Connected Industry Ecosystem"*이라고 부른다. 개별 항공사의 데이터를 직접 공유하지 않고, 패턴과 집계만 공유함으로써 모든 참가자가 혜택을 받는 구조다.

---

## 7. 설계 인사이트: "나라면 어떻게 유사 온톨로지를 만들까"

이 섹션은 Airbus Skywise 사례에서 추출한 핵심 설계 원칙을 정리한다. 독자가 다른 도메인에서 유사한 온톨로지를 설계할 때 적용할 수 있다.

### 원칙 1: "닻(Anchor) Object부터 찾아라"

Skywise에서 Aircraft가 모든 관계의 중심이었다. 온톨로지 설계를 시작할 때 "모든 질문이 어떤 Object를 중심으로 구성되는가"를 먼저 찾아야 한다.

제조업이면 `ProductionOrder`가 닻일 수 있다. 의료라면 `Patient`가 닻이다. 물류라면 `Shipment`가 닻이다. 닻 Object를 잘못 선택하면 링크 구조 전체가 뒤집어진다.

### 원칙 2: "Object는 행동 가능한 의미 단위여야 한다"

SensorReading은 수백만 개의 데이터 포인트다. 하지만 사람이 행동을 취하는 단위는 MaintenanceAlert이고, 실제 작업의 단위는 WorkOrder다. 온톨로지 Object Type은 **사람(또는 AI)이 결정을 내리는 단위**로 정의해야 한다.

원시 데이터를 그대로 Object로 만들면, 다루기 어렵고 의미가 없는 Object만 생긴다.

### 원칙 3: "파생 속성은 외부에서 계산하지 말고 온톨로지 안에서 계산하라"

`remainingLifeHours = maxLifeHours - totalFlightHours`는 단순한 계산이다. 이 계산을 각 애플리케이션마다 별도로 구현하면 버그의 온상이 된다. 온톨로지 Function으로 한 번만 정의하면, 이 값을 사용하는 모든 대시보드와 앱이 동일한 결과를 본다.

### 원칙 4: "보안은 데이터 레이어에서, 쿼리 레이어에서도 적용하지 마라"

각 애플리케이션이 "이 사용자는 어느 항공사 소속인가"를 확인하고 WHERE 절을 추가하는 방식은 실수가 발생하기 쉽다. 팔란티어의 Organization 모델과 행 수준 보안을 온톨로지 레이어에서 정의하면, 어떤 애플리케이션이 쿼리하든 보안이 자동으로 적용된다.

### 원칙 5: "Action Type은 데이터 변경의 유일한 통로로 만들어라"

WorkOrder를 완료 처리하는 방법이 "SQL UPDATE", "API 직접 호출", "Skywise 앱의 완료 버튼" 세 가지라면, 각각의 경로가 모든 부수 효과(Side Effects)를 빠짐없이 구현해야 한다. 팔란티어에서는 Action Type을 정의해두면 모든 경로가 같은 Action을 호출하게 된다. 로직이 한 곳에서 관리된다.

---

## Researcher 사고 지침 적용

### 출처 평가
이 보고서에서 인용된 수치들의 도메인 평가:
- **12,000대 항공기, 50,000명 사용자**: Airbus 공식 뉴스룸(2025) 및 Flying Magazine이 독립적으로 동일한 수치를 인용. 도메인 일치도 높음.
- **A350 생산 33% 가속**: Palantir & Airbus Partnership Overview (2020) 공식 문서에서 확인. [인접 도메인 없음 — 항공 제조 도메인에서 직접 측정된 수치]
- **Object Type 설계**: 팔란티어 공식 문서의 Aircraft, Flight, WorkOrder 예시를 Skywise 맥락에 적용. **추론 포함** — 실제 Skywise 내부 스키마는 비공개이므로, 공개된 팔란티어 항공 도메인 문서의 Object 명칭과 Airbus 사례 문서를 교차하여 역설계했음.

### 반증 탐색
- **Skywise가 실패했다는 증거**: 조사 중 발견되지 않음. 다만 Airbus가 2024년 이후 팔란티어 의존도를 낮추고 자체 기술 역량 강화를 모색한다는 업계 보도가 있음. 이는 "Skywise 실패"가 아니라 기술 주권 확보 노력으로 해석된다.
- **팔란티어 온톨로지의 한계**: 팔란티어 자체도 인정하는 복잡성(온톨로지 설계가 잘못되면 전체 시스템 재설계 필요)과 높은 구축 비용이 단점으로 제기된다.
- **반증 미발견**: Skywise가 에어버스 항공기 예측 정비에서 실질적 효과가 없다는 증거는 발견되지 않음.

### 관점 확장

1. **숨은 변수**: Skywise의 핵심 가치는 개별 항공사의 데이터가 아니라 **집단 지성(collective intelligence)**에 있다. 한 항공사의 비정상 패턴이 전체 에어버스 A350 함대에 경보로 전파되는 메커니즘이 이 온톨로지 구조의 진짜 비즈니스 모델이다. 이를 빼고 "온톨로지가 어떻게 생겼는가"만 분석하면 왜 Airbus가 이 구조를 선택했는지 이해하기 어렵다.

2. **이질 도메인 유추** [이질 도메인: 금융 거래 모니터링]: 이 구조는 금융 거래 이상 탐지 시스템과 구조적으로 동일하다. 개별 거래(SensorReading) → 패턴 탐지(Alert) → 조사(WorkOrder) → 처리(Action/Writeback). Skywise 설계자들이 금융 사기 탐지 온톨로지 패턴을 직접 참고했을 가능성이 있다. 차용 가능한 패턴: "이벤트 → 경보 → 조사 → 해결" 4단계 체인은 거의 모든 실시간 모니터링 온톨로지의 공통 골격이다.

### 문제 재정의
원래 질문: "Airbus Skywise 온톨로지가 어떻게 생겼는가?"

더 적절한 질문: **"Airbus는 왜 데이터 공유 플랫폼을 데이터베이스로 구축하지 않고 온톨로지로 구축했는가, 그리고 그 선택이 가능하게 한 비즈니스 모델은 무엇인가?"**

이 질문에 답하면, 온톨로지 구조 자체보다 "왜 이 구조여야 했는가"의 인과 논리가 더 명확해진다.

---

## 참고 출처

1. Palantir & Airbus Partnership Overview (2020) — https://www.palantir.com/assets/xrfr7uokpv1b/7uEHPTEM0MkKtBFcx2zh63/9d75da5b76439717ac95135b5012479e/Palantir-Airbus-Partnership_Overview.pdf
2. Airbus Newsroom — "Digital Twins: Accelerating aerospace innovation from design to operations" (2025-04) — https://www.airbus.com/en/newsroom/stories/2025-04-digital-twins-accelerating-aerospace-innovation-from-design-to-operations
3. Palantir Foundry 공식 문서 — Action types Overview — https://palantir.com/docs/foundry/action-types/overview/
4. Palantir Foundry 공식 문서 — Add an Ontology output — https://palantir.com/docs/foundry/pipeline-builder/outputs-add-ontology-output/
5. Palantir Foundry 공식 문서 — Securing a data foundation (Sky Industries 예시) — https://palantir.com/docs/foundry/security/securing-a-data-foundation/
6. Palantir Foundry 공식 문서 — Cross-Organization collaboration — https://palantir.com/docs/foundry/security/cross-organization-collaboration/
7. Palantir Foundry 공식 문서 — Managing object security — https://palantir.com/docs/foundry/object-permissioning/managing-object-security/
8. Palantir Foundry 공식 문서 — Query functions (Aircraft 예시) — https://palantir.com/docs/foundry/functions/query-functions/
9. Delta TechOps Blog — "Delta TechOps Expanding Predictive Maintenance Capabilities with New Airbus Partnership" — https://deltatechops.com/delta-techops-expanding-predictive-maintenance-capabilities-with-new-airbus-partnership/
10. Flying Magazine — "Airbus is Using Software to Make Digital Twins of Its Aircraft" — https://www.flyingmag.com/airbus-is-using-software-to-make-digital-twins-of-its-aircraft/
11. Somasoftware Blog — "Predictive Maintenance Aircraft Technologies" (easyJet Skywise 커뮤니티 사례) — https://www.somasoftware.com/post/predictive-maintenance-aircraft-technologies-changing-game
12. Palantir Foundry 공식 문서 — Object and link types reference — https://palantir.com/docs/foundry/object-link-types/type-reference/
