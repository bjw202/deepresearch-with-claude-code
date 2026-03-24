# 팔란티어 온톨로지 종합 보고서 (보강판)

> **역할**: Synthesizer
> **작성일**: 2026-03-24 (보강)
> **통합 대상**: R1(기술 아키텍처), R2(산업별 사례), R3(AIP 진화와 한계), DR1(Airbus 심층), DR2(AML 심층), DR3(설계 패턴), Critic 1차+2차
> **사용자 질문**: "팔란티어에서 내세우는 온톨로지로 어떤 문제들을 해결하고 어떻게 운영하고 있는지 실제적인 사례들을 상세하게 리서치해줘. 단순히 결과가 아니라 어떤 방식으로 온톨로지를 구축하고 운영하는지가 기술적으로 그리고 원리적으로 잘 나타나야 한다."
> **보강 초점**: 역설계 가능 수준의 상세 사례, 인과 체인 명시, 쉬운 언어

---

## 핵심 요약 (Executive Summary)

팔란티어 온톨로지는 기업의 데이터를 비즈니스 엔티티(Object Type), 속성(Property), 관계(Link), 실행 가능한 동작(Action)으로 구조화하여 **의사결정을 모델링하는 운영 레이어**다. 마치 도시를 건설하듯, Object Type은 건물의 종류(아파트, 병원, 공장)이고, Link는 건물을 잇는 도로이며, Action은 "소방서에 화재 신고가 들어오면 → 소방차 출동 + 경찰 통보 + 입주민 문자 발송"과 같은 운영 규칙이다.

개별 구성요소는 데이터베이스의 Table/Column/FK/Stored Procedure와 동형이지만, 이를 **단일 플랫폼에서 비기술자도 사용할 수 있는 형태로 통합**하고, **보안·AI·워크플로우를 일체화**한 점이 제품 레벨의 차별점이다.

6개 산업(국방, 헬스케어, 항공제조, 에너지, 금융, 이민집행)의 사례와 2개의 심층 역설계(Airbus Skywise, AML 거래감시)를 분석한 결과, 온톨로지는 **이종 데이터 소스 통합 → 엔티티 중심 관계 그래프 구축 → 운영 워크플로우 자동화**라는 일관된 패턴으로 작동한다. 이 패턴은 도메인에 관계없이 동일한 골격을 가진다: **이벤트 → 경보 → 조사 → 해결**.

2023년 이후 AIP(AI Platform) 도입으로 온톨로지가 LLM의 grounding layer 역할을 하게 되었으며, Function이 LLM의 "도구(Tool)"로 등록되어 실행 가능한 AI 에이전트 구축을 가능하게 한다.

**핵심 유의사항**: 이 보고서의 모든 정량적 성과 데이터(A350 납품 33% 가속화, KYC 처리 20배 효율화 등)는 팔란티어 자체 출처에서 나왔으며, 독립적으로 검증된 성과 수치는 단 하나도 없다. 이는 개별 수치의 문제가 아니라 팔란티어 성과 평가 전체의 구조적 한계다.

---

## 1. 온톨로지의 핵심 원리: 무엇이고, 왜 이렇게 설계했는가

### 1.1 공식 정의와 설계 철학

팔란티어 공식 문서는 온톨로지를 이렇게 정의한다:

> "The Ontology is designed to represent the complex, interconnected *decisions* of an enterprise, not simply the data."
> — [Palantir Foundry 공식 문서](https://palantir.com/docs/foundry/architecture-center/ontology-system/)

이 정의에서 핵심은 **"데이터가 아니라 의사결정을 표현한다"**는 부분이다. 기존 데이터베이스가 "무엇이 있는가"를 저장한다면, 팔란티어 온톨로지는 "이 데이터로 무엇을 해야 하는가"까지 포함한다. 이를 위해 온톨로지는 **시맨틱 요소**(명사: Objects, Properties, Links)와 **키네틱 요소**(동사: Actions, Functions, 동적 보안)로 이분화된다.

### 1.2 4개 핵심 프리미티브와 DB 모델링의 관계

| 팔란티어 용어 | DB 유사 개념 | 추가된 차원 | 쉬운 비유 |
|---|---|---|---|
| Object Type | Table / Class | GUI 기반 생성, 비즈니스 컨텍스트 내장 | 엑셀 시트의 컬럼 템플릿. "항공기 시트에는 기체번호, 기종, 항공사 컬럼이 있다" |
| Property | Column / Field | Value Types로 도메인 특화 타입 캡슐화 | 엑셀 셀 하나하나. "기체번호 = MSN523" |
| Link | Foreign Key / Association | 명시적 의미와 방향성, 다형성 지원 | 엑셀의 VLOOKUP보다 강력한 양방향 연결. "항공기 → 비행편" 관계에 이름이 있다 |
| Action | Stored Procedure | 보안 상속, Side Effects(웹훅/알림), 히스토리 로그 | 결재 시스템의 "승인" 버튼. 누르면 관련 문서 전부가 연쇄로 업데이트 |
| Function | UDF | ML 모델·LLM 호출 통합, AIP Logic 연동 | 온톨로지의 "계산기". 속성을 읽고 결과를 계산해서 돌려줌 |
| Interface | 다형성 | 서로 다른 Object Type의 공통 구조 추상화 | 220V 표준 플러그. 노트북이든 냉장고든 같은 규격 |

**[상충점 해결]** R1은 이 구조가 "기존과 근본적으로 다른 설계 철학"이라 평가했고, R3는 Feng(Pigsty 창업자)의 분석을 인용하며 "DB 모델링과 실질적으로 동형"이라 평가했다.

**통합 판단**: 양쪽 모두 부분적으로 옳다. 개별 프리미티브 수준에서 팔란티어 온톨로지는 ER 모델(1976), OOP(1990년대), OWL(2001)과 동일한 개념적 계보에 있다. 그러나 **혁신의 소재는 개념이 아니라 통합과 접근성**에 있다:

1. **데이터 + 로직 + 액션 + 보안의 4중 통합**: 기존 시스템에서는 데이터 모델(DB), 비즈니스 로직(애플리케이션 코드), 실행 동작(API/워크플로우 엔진), 권한 관리(IAM)가 별도 시스템이다. 팔란티어는 이를 하나의 레이어에 통합했다.
2. **비기술자 접근성**: Ontology Manager GUI로 비개발자도 Object Type을 생성·수정할 수 있다.
3. **AI 연동 내장**: AIP를 통해 온톨로지가 LLM의 컨텍스트로 직접 주입된다.

따라서 정확한 평가는: **"개념은 기존 데이터 모델링과 동형이나, 통합·접근성·AI 연동에서 제품 레벨의 차별점이 존재한다."** Feng 자신도 "팔란티어의 가치는 온톨로지 개념이 아니라 그 밖의 모든 것에 있다"고 인정했다.

### 1.3 Object Type 설계의 5가지 원칙

어떤 도메인에서든 온톨로지를 설계할 때 적용되는 핵심 원칙 5가지가 있다. 이 원칙들은 팔란티어 공식 문서와 커뮤니티 가이드, 실제 사례 분석에서 추출한 것이다.

#### 원칙 1: 핵심 엔티티 허브(Hub) 패턴 — "중심을 먼저 찾아라"

모든 도메인에는 **"모든 것이 이 주변을 돈다"는 중심 Object**가 있다. 마치 태양계에서 행성들이 태양 주위를 도는 것처럼, 온톨로지에서도 다른 모든 Object가 하나의 허브를 중심으로 연결된다.

**중심 Object를 식별하는 질문**: "우리 조직이 매일 아침 가장 먼저 확인하는 것은 무엇인가?"

| 도메인 | 허브 Object | 이유 |
|---|---|---|
| 항공 MRO | `Aircraft`(항공기) | 센서, 정비, 부품이 모두 항공기에 연결 |
| 병원 | `Patient`(환자) | 처방, 검사, 입원이 모두 환자에 연결 |
| 제조업 | `WorkOrder`(작업지시서) | 자재, 기계, 작업자가 모두 작업지시서에 연결 |
| 금융 | `Transaction`(거래) | 계좌, 고객, 위험도가 모두 거래를 통해 연결 |

허브 없이 설계하면 온톨로지가 "데이터 목록"이 된다. 모든 Object가 동등하게 나열되면, "어디서 시작해야 하는가"가 불분명해진다. **허브 선택은 비즈니스 질문에 따라 달라진다** — 항공사 운영에서는 Flight가 중심이지만, 항공 MRO/제조에서는 Aircraft가 중심이다.

#### 원칙 2: 이벤트 타임라인 패턴 — "상태 변화를 별도 Object로 분리하라"

핵심 엔티티 허브에는 반드시 **시간에 따라 쌓이는 이벤트들**이 존재한다. 이 이벤트들을 허브 Object의 속성(Property)에 넣으면 안 된다. **반드시 별도 Object Type**으로 분리해야 한다.

예를 들어, 환자(Patient) Object에 "진료일1, 진료내용1, 진료일2, 진료내용2..."를 Property로 추가하면, 한 환자에 대한 모든 진료 이력이 하나의 거대한 행(row)이 되어버린다. 대신 `MedicalVisit`이라는 별도 Object Type을 만들고 Patient와 1:N으로 연결하면, 각 진료를 독립적으로 조회하고 분석할 수 있다.

**이벤트를 별도 Object로 분리해야 하는 3가지 신호:**
1. "언제 발생했나"가 중요한 정보일 때
2. 같은 종류의 이벤트가 하나의 엔티티에 여러 번 발생할 수 있을 때
3. 이벤트 자체에 추가 속성이 붙을 때 (진료 이력에 "담당의사", "처방약", "비용" 등)

#### 원칙 3: 기본 키(Primary Key) 전략 — "단일 비즈니스 ID를 써라"

팔란티어 온톨로지에서 Primary Key는 **오브젝트 인스턴스를 유일하게 식별하는 하나의 값**이다. 복합 키(composite key: 여러 컬럼의 조합)를 쓰면 Link 설정, Action 설계 등 모든 곳에서 참조가 복잡해진다.

좋은 Primary Key의 기준: 조직 내에서 이미 쓰는 비즈니스 ID(직원번호, 항공편 코드, 주문번호)이면서, 변하지 않는 값이어야 한다. 실패 사례로는 한 제조업체에서 `(생산라인ID, 날짜, 시퀀스번호)` 3개를 조합해 WorkOrder를 식별하려 했다가 결국 리팩토링한 사례가 있다.

#### 원칙 4: 네이밍 규칙 — "버전명과 기술명 금지"

`EmployeeV2`, `FlightNew`, `LegacyOrder` — 이런 이름은 금지다. `EmployeeV2`가 생겼다는 것은 `Employee`와 `EmployeeV2`가 동시에 존재한다는 뜻이며, 어떤 앱은 `Employee`를 보고 다른 앱은 `EmployeeV2`를 보게 된다. 올바른 방법은 기존 Object Type을 수정(property 추가/삭제)하는 것이다. 팔란티어 공식 문서 표현: Object Type 정의는 버전 관리 대상이 아니라 **진화(evolve)** 대상이다.

#### 원칙 5: Property vs 별도 Object 분리 기준 — "이 데이터가 독립적 생명체인가?"

온톨로지 설계에서 가장 자주 맞닥뜨리는 판단 문제다. 아래 4가지 질문 중 하나라도 "Yes"이면 별도 Object로 분리한다:

| 질문 | Yes → 별도 Object | No → Property |
|---|---|---|
| 이 데이터가 여러 오브젝트에서 공유되는가? | ✓ (부서는 여러 직원이 공유) | (이름은 이 직원만의 것) |
| 이 데이터가 독립적으로 검색될 필요가 있는가? | ✓ (부서별 예산 조회 필요) | (직급은 직원을 통해서만 조회) |
| 이 데이터 자체에 추가 속성이 붙는가? | ✓ (부서에는 부서장, 위치가 있음) | (생년월일은 단일 값) |
| 이 데이터가 독립적으로 존재할 수 있는가? | ✓ (직원 없는 부서도 존재) | (직원 없는 이름은 무의미) |

### 1.4 전통적 온톨로지(OWL/RDF)와의 차이

| 비교 항목 | 팔란티어 온톨로지 | OWL/RDF |
|---|---|---|
| 주 목적 | 운영 워크플로우, 의사결정 실행 | 형식적 시맨틱, 기계 추론 |
| 추론 능력 | 없음 (규칙 기반 액션으로 대체) | OWL 추론 엔진으로 새 사실 도출 |
| 실시간 운영 | 핵심 기능: 실시간 라이트백, 스트리밍 | 일반적으로 정적, 주기적 갱신 |
| UI/워크플로우 통합 | 기본 내장 (Workshop, AIP) | 표준에 없음 |
| 보안 모델 | 행/열 수준 세분화 보안 내장 | 표준에 없음 |
| 사용 난이도 | GUI 기반, 비개발자 친화적 | SPARQL, 추론 엔진 필요 |
| 상호운용성 | 독점적 (JSON/OpenAPI 내보내기 지원) | W3C 표준, 오픈 생태계 |

팔란티어가 OWL의 형식적 추론을 포기하고 실행 속도·거버넌스·접근성에 집중한 것은 의도적 설계 선택이다.

### 1.5 플랫폼 아키텍처에서의 위치

```
사용자 애플리케이션 (Workshop, AIP, 외부 앱)
         ↕ OSDK (Ontology SDK)
[온톨로지 레이어]
  - Ontology Metadata Service (OMS): 타입 정의 관리
  - Object Set Service (OSS): 읽기·검색·집계
  - Object Storage V2: 인덱싱된 데이터 저장
  - Actions Service: 사용자 편집·트랜잭션·로그
  - Object Data Funnel: 소스 데이터 → 인덱스 동기화
         ↕
[데이터 레이어]
  - Foundry 데이터셋, Virtual Tables, ML 모델
         ↕
[파이프라인 레이어]
  - Pipeline Builder (raw → clean 변환)
         ↕
[데이터 연결 레이어]
  - 외부 소스 (ERP, CRM, IoT 센서, 지리공간 DB 등)
```

데이터 흐름의 핵심 원칙: **데이터를 원본 그대로(as-is) 수집**하고, 변환 이력을 Foundry 파이프라인 내부에서 완전히 관리한다.

---

## 2. 구축과 운영의 실제: 어떻게 만들고, 어떻게 유지하는가

### 2.1 온톨로지 구축 프로세스

#### Object Type 생성의 두 가지 경로

**경로 A: Ontology Manager에서 직접 생성**
1. Ontology Manager에서 New → Object Type 선택
2. 백킹 데이터소스 없이 스키마만 먼저 정의하거나, 기존 데이터셋을 선택
3. 데이터셋 컬럼이 Properties로 자동 매핑
4. 기본 키(primary key)와 타이틀 키 설정
5. 메타데이터(아이콘, 설명) 추가

**경로 B: Pipeline Builder에서 파이프라인 출력으로 생성**
1. Pipeline Builder에서 transform 노드 → Add output → New object type
2. Object type 이름·온톨로지 지정
3. 데이터 컬럼 → Properties 매핑 자동 처리
4. Link Types 추가: 소스/타겟 오브젝트 지정
5. 파이프라인 배포(deploy)로 온톨로지 업데이트

배포 후 Object type ID, 링크, 소스/타겟은 수정 불가하므로 초기 설계가 중요하다.

### 2.2 Action/Writeback의 완전한 인과 체인: "버튼 하나의 여정"

Action과 Writeback은 온톨로지를 "읽기 전용 데이터 레이어"가 아닌 **운영 시스템**으로 만드는 핵심이다. 사용자가 버튼 하나를 누르면 벌어지는 일을 7단계로 분해한다.

> **비유**: 구글 독스에서 문서를 편집하면 동시에 모든 사람이 변경 내용을 본다. 팔란티어의 Action은 더 정교하다: 이메일 편지지에 서명하면 → 원본 파일이 갱신되고 → 관련 부서에 알림이 가고 → ERP 시스템에 기록된다. 이 모든 것을 **하나의 원자적 트랜잭션**으로 처리한다.

#### Writeback 7단계 완전 체인

```
[1] 사용자가 Workshop 앱에서 Action 버튼 클릭 → 파라미터 입력 → 제출
     예: 정비 엔지니어가 "작업 완료" 버튼을 누르고 교체 부품 번호를 입력

[2] Submission Criteria 검사
     → "이 사용자가 이 항공기의 정비를 담당하는 인증된 기술자인가?"
     → 조건 불만족 시: 오류 메시지. 여기서 종료.
     → 조건 만족 시: 다음 단계 진행

[3] Writeback Webhook 실행 (설정된 경우)
     → 외부 시스템(ERP, 규제 보고 시스템 등)에 HTTP 요청
     → 외부 시스템 실패 시: 롤백. 온톨로지 변경 없음. (중요!)
     → 외부 시스템 성공 시: 다음 단계 진행

[4] Ontology Rules 실행 (원자적 트랜잭션)
     → WorkOrder.status = "Completed"
     → MaintenanceAlert.status = "Resolved"
     → Component(구 부품).installedOn = null (장착 해제)
     → Component(신 부품).installedOn = 항공기 (장착)
     → Aircraft ↔ Component Link 재설정
     → 모든 변경이 하나의 트랜잭션으로 커밋

[5] 변경 내용을 Writeback 데이터셋에 저장
     → Object Storage V2에 즉시 인덱스 업데이트 (준실시간, 수 초 이내)

[6] Side Effect Webhook/Notification 실행
     → 항공사 운항 관리팀에 "HL8082 WO-2026-3441 완료" 알림 발송
     → EASA 규정 준수 보고 시스템에 Webhook 트리거
     → 실패해도 이미 완료된 [4] 변경은 취소되지 않음

[7] Object Data Funnel이 인덱스 동기화
     → 모든 앱(Workshop, AIP, OSDK 외부 앱)에서 변경 반영
     → 구독(subscription) 설정된 앱은 즉시 업데이트 이벤트 수신
```

**이것이 중요한 이유**: [3]의 Writeback Webhook과 [6]의 Side Effect Webhook은 실패 시 행동이 정반대다. Writeback Webhook이 실패하면 온톨로지 변경 자체가 취소되지만(예: ERP에 기록 못 하면 아예 안 한다), Side Effect Webhook이 실패하면 온톨로지 변경은 유지된다(예: 알림은 못 보냈지만 작업 완료 처리는 됐다). 이 설계 선택이 외부 시스템 연동의 핵심이다.

**지연 시간**: 트랜잭션 커밋부터 모든 앱 반영까지 스트리밍 기준 **약 6-7초**. 배치 파이프라인은 분~시간 단위 [출처: Palantir 공식 문서].

#### Action의 3요소: 파라미터 → 규칙 → Side Effect

**파라미터(Parameters)**: 사용자가 입력하는 값. GUI 폼의 입력 필드와 같다. 기본 타입(텍스트, 숫자, 날짜), Object 참조("어떤 직원을 대상으로 하는가"), Object Set(여러 오브젝트 한번에 선택), 동적 드롭다운을 지원한다.

**규칙(Rules)**: 두 종류가 있다.
- **Ontology Rules**: 오브젝트 속성 변경, 생성, 삭제, 링크 생성/삭제를 GUI로 설정
- **Side Effect Rules**: 알림(Notification), Webhook(외부 API 호출)

**Submission Criteria(제출 조건)**: "이 Action은 누구나 볼 수 있지만, 실제로 제출하려면 특정 조건이 충족되어야 한다." 예를 들어 "항공기 배정 변경은 출발 24시간 이상 남은 항공편에만 적용 가능", "예산 집행은 잔여 예산이 집행 금액 이상일 때만 가능" 같은 규칙을 코드 없이 설정한다.

#### Function-backed Action: 복잡한 연쇄 변경

단순 규칙으로 "이 사고가 종결되면 → 연결된 모든 경보도 해결됨으로 → 경보 수에 따라 심각도 재계산"처럼 복잡한 연쇄를 표현하기 어려울 때, TypeScript 또는 Python으로 작성된 Function을 Action에 연결한다.

```typescript
@OntologyEditFunction()
async closeIncident(incident: Incident): Promise<void> {
  incident.status = "Closed";
  incident.closedAt = new Date();

  const alerts = await incident.$link.hasAlerts.fetchPage();
  for (const alert of alerts.data) {
    alert.status = "Resolved";
  }

  const alertCount = alerts.data.length;
  incident.severity = alertCount > 10 ? "HIGH" : alertCount > 5 ? "MEDIUM" : "LOW";
}
```

### 2.3 데이터 흐름: 외부 소스에서 온톨로지까지

```
1. Data Connection: 외부 소스 → raw 데이터셋 (전처리 없이 원본 수집)
2. Pipeline Builder: raw → clean 변환 (타입 캐스팅, UTC 정규화)
3. Ontology Hydration: clean 데이터셋 → Object Type 백킹 소스 연결
4. Object Data Funnel: 데이터셋 → 오브젝트 인덱싱
5. Actions: 사용자 편집 → writeback 데이터셋 → 파이프라인 재처리
```

> **Pipeline Builder란**: 엑셀의 파워쿼리와 비슷하다. 여러 소스에서 데이터를 가져와, 각 단계마다 어떻게 가공할지를 박스와 화살표로 그리면서 정의한다. 최종 결과가 온톨로지의 Object Type을 채우는 데이터셋이 된다.

### 2.4 유지보수와 거버넌스

**스키마 변경 관리 원칙**:
- 버전 명 금지: `Message_v2`, `Customer_old` 대신 속성 추가/deprecated 처리
- 안정적 ID 전략: 복합 키보다 단일 비즈니스 ID 사용
- Branch 활용: 운영 환경 영향 없이 변경 테스트

**대규모 온톨로지 운영 리스크**:
- 시스템 경계 충돌: 팀이 많아질수록 동일 비즈니스 개념의 Object Type이 중복 생성
- DRY 원칙 위반: 유사한 Logic이 여러 Function에 반복 구현
- 데이터 신선도: 백킹 데이터셋의 업데이트 빈도를 모니터링하지 않으면 "stale ontology" 문제 발생

**Forward-Deployed Engineer(FDE) 모델**: 팔란티어 엔지니어가 고객사에 상주하며 구축을 지원하는 독특한 모델이다. 상위 20개 고객의 평균 연간 계약은 $93.9M, 전체 954개 고객 평균은 $4.7M/년이다 [출처: Palantir 2025 Annual Report].

---

## 3. 분야별 사례로 본 작동 방식

6개 산업 사례에서 온톨로지는 일관된 설계 패턴을 보인다: **핵심 엔티티 허브 + 이벤트 타임라인 + 계층적 소속 관계 + 경보/결과 객체**.

### 3.1 국방/정보기관 — Gotham: Entity Resolution

Gotham의 핵심은 **Entity Resolution**이다. 동일한 실세계 개체가 복수의 데이터 소스에서 서로 다른 식별자로 존재할 때, 유사도 임계값(s_ij > θ) 기반으로 하나의 캐노니컬 객체로 통합한다.

**온톨로지 구조**: Person, Vehicle, Organization, Location, Event, Asset을 핵심 Object Type으로, 이들 사이의 관계 그래프를 통해 위협 네트워크를 탐지한다.

**핵심 유의사항**: 유사도 임계값 θ는 비공개이며, 잘못된 설정 시 무고한 민간인이 테러 네트워크에 포함되는 위험이 있다.

### 3.2 항공 제조 — Airbus Skywise: 역설계 수준의 상세 분석

#### 문제 상황: "특정 항공기에 남은 작업이 무엇인가"에 아무도 답할 수 없었다

2015년, Airbus는 A350 생산량을 4배로 늘리겠다는 목표를 세웠다. 하나의 A350에는 약 500만 개의 부품이 들어간다. 4개국 8개 이상의 공장이 각각의 파트를 담당한다. 문제는 생산 일정, 교대 근무 일정, 부품 납품 현황, 작업 지시서, 품질 이슈가 **팀마다, 국가마다 분산된 별개의 시스템**에 저장되어 있었다는 것이다.

구체적으로, 프랑스 툴루즈 공장의 최종 조립 라인에서 A350-900 기체 MSN523번의 남은 작업이 몇 건인지 알려면: SAP ERP를 열어 작업 지시서를 조회하고 → MES를 별도로 열어 실제 진행 상황을 확인하고 → 부품 조달팀의 엑셀 파일을 받아 납품 지연을 확인하고 → 세 시스템을 수동으로 대조해야 했다.

팔란티어의 해결책은 새로운 시스템을 구축하는 것이 아니었다. 기존 시스템들 위에 **공통 언어 레이어(온톨로지)**를 얹는 것이었다.

#### 온톨로지 구조: 7개 핵심 Object Type의 인과 체인

**Aircraft(항공기)** — 모든 관계의 닻(anchor)

Aircraft가 없으면 "특정 항공기에 대한 질문"을 할 수 없다. 센서 판독값, 정비 기록, 비행 이력, 부품 장착 이력 모두 "어느 항공기의 데이터인가"와 연결되어야 한다.

핵심 속성과 그 존재 이유:
- `msn` (기체 일련번호): 이것 없이는 항공기를 구별할 수 없다
- `aircraftType` (A320neo, A350-900 등): A320과 A350는 동일 온도에 다른 경보 기준을 가진다
- `operatorAirlineCode`: 보안 필터링의 기준. 에어프랑스는 에어프랑스 항공기만 봐야 한다
- `totalFlightHours`: 부품 수명 계산의 기준. "이 엔진은 5,000시간마다 교체" 규칙 적용

**인과 체인**: Aircraft.totalFlightHours가 특정 임계값에 도달하면 → Component.remainingLifeHours가 재계산되고 → 잔여 수명이 경고 구간(예: 100시간 미만)에 들어오면 MaintenanceAlert가 생성되고 → WorkOrder 생성 Action이 트리거되고 → 담당 항공사의 정비 계획 대시보드에 표시된다. **이 연쇄는 자동으로 발생한다. 엔지니어가 수동으로 세 시스템을 확인할 필요가 없다.**

**Component(부품)** — 파생 속성의 핵심 사례

Component에서 가장 중요한 설계 포인트는 `remainingLifeHours`(잔여 수명)이다. 이것은 외부 소스에서 가져오는 것이 아니라, 온톨로지 내 Function이 `maxLifeHours - totalFlightHours`를 계산해서 채우는 **파생 속성(Derived Property)**이다. 엑셀의 수식 셀과 같다 — A열과 B열이 바뀌면 C열의 수식도 자동으로 갱신된다. 이것이 가능한 이유는 온톨로지가 단순한 데이터 저장소가 아니라 계산 로직을 포함하기 때문이다.

**SensorReading(센서 판독값)** — 시계열 데이터의 특수 처리

A350 한 대에는 약 6,000개의 센서가 있다. 한 번의 10시간 비행에서 수천만 개의 데이터 포인트가 생성된다. 이를 일반 Object Type으로 만들면 인덱싱 오버헤드가 크다. 팔란티어에서는 이것을 **Time Series Object**로 구현하여 별도의 최적화된 저장소를 사용한다.

중요한 설계 결정: SensorReading은 Aircraft에 직접 링크되는 것이 아니라 **Aircraft → Flight → SensorReading**의 체인으로 연결된다. 동일한 엔진 진동 수치도 이륙 단계인지 순항 단계인지에 따라 의미가 완전히 다르기 때문에, Flight라는 맥락 없이는 센서 데이터가 해석 불가능하다.

#### 센서 데이터 하나의 raw → Object 변환 추적

A350-900 MSN523의 엔진 오일 온도 센서 데이터가 비행기 안에서 온톨로지의 Object가 되기까지:

```
[비행기 안] 센서 → ACMU(Aircraft Condition Monitoring Unit) 수집
  ↓ ACARS 전송 (비행 중 이상 시) 또는 WiFi/셀룰러 (착륙 후)
[Foundry 수신] Raw Dataset 저장 (가공 없는 원본)
  ↓ Pipeline Builder 변환
[Transform] MSN 표준화("MSN523"→"523"), UTC 정규화,
  품질 플래그 부여(물리적 불가능 범위 → "ERROR"),
  항공기 컨텍스트 JOIN
  ↓ Ontology Output 매핑
[온톨로지] SensorReading Object 인스턴스 생성
  └── Flight와 Link, Aircraft와 간접 연결
  ↓ Phonograph 인덱싱
[쿼리 가능] OSDK, Workshop, AIP 에이전트에서 조회 가능
```

#### Skywise 보안 모델: 3계층 구조

Skywise는 수십 개의 항공사가 같은 플랫폼을 공유하므로 보안이 핵심이다:

**1계층 — Organization 격리 (가장 강한 격벽)**:
```
Foundry Enrollment: Skywise
  ├── Organization: Airbus (전체 데이터 접근)
  ├── Organization: 대한항공 (KAL 항공기만)
  ├── Organization: 에어프랑스 (AF 항공기만)
  └── Organization: Delta (Delta 항공기만)
```

**2계층 — 행 수준 보안**: 대한항공 사용자가 Aircraft를 쿼리하면 `operatorAirlineCode = "KE"`인 행만 자동으로 반환. 별도의 WHERE 조건 불필요.

**3계층 — 열 수준 보안**: Component.manufacturingCost(제조 단가)는 Airbus 내부 직원만, MaintenanceAlert.rawSensorData는 엔지니어링팀만 접근 가능.

**도입 효과**: A350 납품 33% 가속화 [출처: 팔란티어-에어버스 공동 PDF, 2020 — **팔란티어 자체 주장, 독립 검증 없음**]. Skywise는 현재 12,000대 이상 항공기, 50,000명 이상 사용자를 연결 [출처: Airbus 뉴스룸 + Flying Magazine — **독립 확인됨**].

### 3.3 헬스케어 — N3C: 업계 표준 수용

N3C(National COVID Cohort Collaborative)는 75개 이상 의료 기관의 COVID-19 환자 데이터를 통합했다. 주목할 점은 팔란티어가 자체 온톨로지를 정의하지 않고 **OMOP 5.3.1 공통 데이터 모델**이라는 업계 표준을 수용했다는 것이다. 총 1,300만 명 이상 환자, 50억 건 이상 데이터 행 통합.

**[Critic 지적 반영]** 이 사례는 "팔란티어가 온톨로지를 어떻게 설계하는가"보다 "어떤 온톨로지든 그 위에서 통합·운영·AI 연동을 제공하는 플랫폼 능력"의 사례로 보는 것이 더 정확하다. 이는 팔란티어의 가치가 "온톨로지 설계 능력" 자체보다 **플랫폼 능력**에 있음을 시사한다.

### 3.4 에너지 — BP: 자산 디지털 트윈

BP는 200만 개 이상 센서의 실시간 데이터를 통합한 모델 기반 디지털 트윈을 구축했다. AIP 추가 이후, 엔지니어가 "현재 북해 플랫폼의 압력 이상 설비 목록을 보여줘"라고 자연어로 질의하면 AIP가 온톨로지를 탐색하여 답한다.

### 3.5 금융 — AML/사기 탐지: 역설계 수준의 상세 분석

#### 문제 상황: 왜 은행 AML 시스템의 Alert 90~95%가 오탐인가

전세계 금융기관의 AML 경보 중 **90~95%는 오탐(false positive)**이다 [출처: Flagright, Unit21, Retail Banker International — **다수 독립 출처 일치**]. 세 가지 구조적 이유가 있다:

1. **고객 세분화 없는 균일 규칙**: "$9,500 이상 현금 입금 3회 → Alert" 규칙이 월급 9,500달러 간호사에게도, 하루 매출 9,500달러인 편의점 주인에게도 동일하게 적용
2. **맥락(context) 부재**: 시스템이 "오늘 거래"만 보고, 고객이 10년 전부터 같은 패턴으로 거래하고 있다는 역사적 맥락이 없음
3. **데이터 사일로**: KYC 팀, 거래감시 팀, 조사 팀이 각각 별도 시스템에서 동일 고객 정보를 따로따로 봄

#### Transaction 하나의 완전한 생애주기: 0단계~6단계

"고객 A가 고객 B에게 $9,500을 국제 송금"한다. 이 하나의 이벤트가 온톨로지 안에서 어떻게 살아서 움직이는지 추적한다.

**[0단계] 코어뱅킹 원본 데이터**

은행 핵심 시스템에서 이 거래는 숫자와 코드들일 뿐이다. "이 사람이 누구인지", "이 패턴이 과거와 비교해 이상한지"를 전혀 모른다.

**[1단계] 파이프라인 처리 — 데이터 정제**

통화 변환($9,500 → 단일 통화 기준), 타임스탬프 UTC 통일, 지역 코드 매핑(수취 계좌 `KR-80-...` → 국가 코드 KR 추출 → 고위험 관할권 DB 대조), 데이터 품질 검증.

**[2단계] Transaction Object 생성 및 관계 연결**

정제된 데이터가 Transaction Object로 온톨로지에 들어오는 순간, 가장 중요한 일이 발생한다 — **기존 Customer, Account Object와의 Link 형성**.

```
Transaction (신규 생성)
  └── participates_in ← Account [송금 계좌]
                              └── owned_by ← Customer [CID-KR-0028472]
                                                  └── (이 고객의 이력 전체와 연결됨)
  └── participates_in → Account [수취 계좌]
                              └── owned_by → Customer [수취인]
```

이 순간부터 Transaction은 단순한 숫자 기록이 아니다. 이 고객의 지난 90일 모든 거래, 현재 KYC 위험 점수, 연결된 다른 고객/법인 네트워크, 같은 주소/IP를 공유하는 다른 계좌들 — 모든 맥락이 한번에 보인다.

**[3단계] ML 모델이 위험 점수를 계산 (Function)**

Transaction 생성 순간, 위험 점수 계산 Function이 실행된다. 팔란티어는 두 가지 방식을 결합한다:

- **동종집단 비교**: "같은 유형 고객들과 비교해서 이 거래가 얼마나 이상한가?" 30대 직장인 평균 국제 송금이 $500/월인데 이 고객은 $9,500 — 동종집단 대비 19배
- **자기 자신과의 비교**: "이 고객 자신의 과거 행동과 비교해서 얼마나 달라졌는가?" 매달 $9,500을 같은 계좌로 보내왔다면 이번은 완전히 정상

출력: `transaction_risk_score: 42` + score_breakdown(금액 이상도 28, 빈도 패턴 8, 네트워크 위험 6, 관할권 0) + 설명("90일 개인 기준선 4.2배이나 월간 송금 패턴과 일치")

**[4단계] 임계값 판단 → Alert 생성 여부**

위험 점수 42점이므로 ML 기반 Alert는 생성 안 됨(임계값 60점). 하지만...

**[5단계] 시나리오 엔진 병렬 실행**

ML과 독립적으로 Foundry Rules가 규칙을 검사한다: "7일 이내 $9,000~$10,000 국제 송금 2회 이상" 규칙에 걸림 (7일 전 $9,200 송금 이력 발견) → Alert 생성: `{type: "POTENTIAL_CTR_AVOIDANCE", score: 75}`

**왜 ML과 규칙을 둘 다 쓰는가**: ML은 "이상하다"는 신호를 잡고, 규칙 엔진은 "왜 이상한지"를 설명해준다. AML 분야에서 모델 해석 가능성은 선택이 아닌 **규제 요건**이다.

**[6단계] 분석관 할당 및 검토**

Alert가 생성되면 자동 배정 로직이 실행된다: 유형별 전문화 매칭, 부하 분산, 우선순위 결정. 분석관 화면에는 해당 Alert와 연결된 **모든 정보가 한 화면에** 표시된다.

#### 분석관의 판정 → 피드백 루프 (이것이 진짜 핵심)

분석관이 "오탐(False Positive)"으로 판단하면 — 이것이 시스템 개선의 황금 데이터다:

```
1. 분석관의 FP 판정 → Alert Object에 레이블 저장
2. 이 레이블이 학습 데이터셋에 추가됨
3. ML 모델 재학습 파이프라인 트리거
4. "이런 특성을 가진 거래는 FP일 가능성 높다"고 모델이 학습
5. 다음번 유사 거래에서 더 낮은 위험 점수 예측
```

**이 피드백 루프가 중요한 이유**: 팔란티어 문서 전체를 분석하면, 결과 지표(40배 개선, 90% 비용 절감)는 주로 피드백 루프에서 나온다. 데이터를 한 곳에 모으는 것은 필요조건이지만 충분조건이 아니다. 분석관의 판단이 ML 모델로 돌아가지 않으면, 시간이 지날수록 정확도가 떨어진다.

**위험성**: 피드백 루프의 악용 가능성도 실재한다. 2020년 FinCEN Files 보도에서 드러난 것처럼, 일부 은행들은 SAR를 제출하면서도 같은 고객과 거래를 계속 허용했다. 온톨로지가 아무리 정교해도 인간이 잘못 운용하면 시스템이 자금세탁에 최적화될 수 있다.

#### 실소유권 그래프: 쉘 컴퍼니 추적

쉘 컴퍼니(Shell Company)란 실제 사업 활동이 없는 껍데기 회사다. 자금세탁자는 버진아일랜드 → 케이맨제도 → 싱가포르 → 한국으로 이어지는 소유 체인을 만들어 돈의 출처를 숨긴다. 한국 은행 입장에서는 "싱가포르 법인의 컨설팅 대금"처럼 평범해 보인다.

**그래프 순회가 SQL보다 유리한 이유**: SQL로 소유 체인을 추적하려면 층수를 미리 알아야 한다(4단계 JOIN vs 15단계 JOIN). 그래프 순회는 종점(실제 사람)이 나올 때까지 자동으로 올라간다.

```
Delta_KR ← 소유 ← Gamma_SG ← 소유 ← Beta_KY ← 소유 ← Alpha_VI ← 소유 ← A씨
```

### 3.6 이민집행 — ICE: 윤리적 논쟁

ICE 사례는 온톨로지의 기술적 능력과 윤리적 함의를 동시에 보여준다. FOIA 공개 자료에 따르면 민사 추방 대상을 형사 수사처럼 등록하여 더 광범위한 데이터 접근을 정당화하는 사례가 확인되었다. 온톨로지 설계(어떤 엔티티를 어떻게 연결하는가)가 권력 구조를 결정한다는 점에서, **기술적 질문이 곧 정치적 질문이 된다**.

### 3.7 산업 횡단 공통 패턴

| 패턴 | 국방 | 헬스케어 | 항공 | 에너지 | 금융 | 이민 |
|---|:---:|:---:|:---:|:---:|:---:|:---:|
| 핵심 엔티티 허브 | 인물 | 환자 | 항공기 | 설비 | 고객 | 대상자 |
| 이벤트 타임라인 | Event | Encounter | FlightPhase | Reading | Transaction | Encounter |
| 계층적 소속 관계 | Org→Person | — | Supplier→Part | Well→Asset | Org→Account | Case→Subject |
| 경보/결과 객체 | — | — | WorkOrder | Alert | Alert/Case | Case |

모든 사례에서 온톨로지는 **"이벤트 → 경보 → 조사 → 해결"**이라는 동일한 4단계 체인으로 작동한다. Airbus의 "센서 이상 → MaintenanceAlert → WorkOrder → 정비 완료"와 AML의 "Transaction → Alert → Case → SAR"가 구조적으로 동형이다. 차이는 도메인별 엔티티와 관계의 구체적 내용이다.

---

## 4. AIP 시대의 온톨로지: LLM과의 결합

### 4.1 Grounding Layer의 기술적 실체

AIP에서 온톨로지가 LLM의 grounding layer라는 주장의 기술적 메커니즘:

1. **컨텍스트 경계 설정**: LLM은 전체 온톨로지를 스캔하지 않는다. AIP Logic 함수 실행 시 특정 Ontology Object들이 변수처럼 주입된다. "AIP does not magically scan the entire ontology or attempt to understand the full enterprise at once. It reasons inside the boundaries you give it." [출처: Sainath Palla, Towards AI, 2025-11]

2. **환각 감소**: LLM이 자체 생성하면 환각이 발생하지만, 온톨로지 쿼리를 통해 실제 데이터를 반환받으면 정확도가 높아진다.

3. **도구 호출 패턴**: AIP Logic에서 Actions와 Functions가 LLM의 "도구(Tool)"로 등록된다. LLM은 추론 과정에서 어떤 도구를 호출할지 결정하고, 온톨로지를 통해 실제 시스템에 작용한다.

4. **권한 상속**: LLM은 사용자/프로젝트의 권한 범위 안에서만 온톨로지에 접근할 수 있다.

### 4.2 Function이 LLM의 "도구(Tool)"로 등록되는 구체적 메커니즘

팔란티어 AIP Logic은 GUI로 LLM 프롬프트를 작성하고, 온톨로지 오브젝트를 입력으로 받아서 출력을 생성하거나 온톨로지를 수정할 수 있는 인터페이스다.

**등록 과정**:
1. TypeScript Function을 `@Tool` 데코레이터로 표시하면 AIP 에이전트가 호출할 수 있는 도구로 등록된다
2. LLM 에이전트가 사용자 요청을 처리하면서 "이 작업에는 온톨로지 조회가 필요하다"고 판단하면 등록된 Function을 자동으로 호출
3. Function의 반환값이 LLM의 응답 생성에 사용된다
4. **LLM은 자신의 권한 범위를 벗어나는 함수를 호출할 수 없다** — 보안 모델과 완전 통합

**예시**: "내일 비행에 문제가 있는 항공기가 있나요?" 질문에 AIP 에이전트가:
1. `getFlightsByDate("tomorrow")` Function 호출 → Flight 오브젝트 목록 반환
2. `getAircraftStatus(aircraftId)` Function 호출 → 각 항공기 상태 반환
3. 결과를 종합해 자연어로 응답 생성

이 과정에서 **LLM이 볼 수 없는 오브젝트는 컨텍스트에 아예 들어가지 않는다**. LLM이 "모르겠다"고 답하는 것이 아니라 애초에 그 데이터가 존재하지 않는 것처럼 처리된다.

### 4.3 진화 역사: Gotham → Foundry → AIP

| 시대 | 기간 | 목적 | 온톨로지 역할 |
|---|---|---|---|
| Gotham | 2008~2016 | 정보기관 데이터 통합 | 엔티티 관계 그래프 |
| Foundry | 2016~2023 | 기업 데이터 사일로 해소 | Object/Property/Link/Action 4요소 |
| AIP | 2023~현재 | LLM + 운영 워크플로우 통합 | LLM의 grounding layer + 에이전트 도구 |

AIP Agent Studio(2024)는 멀티스텝 에이전트를 지원한다: 재고 확인 → 공급업체 평가 → 주문 생성 같은 연속 작업을 온톨로지 기반으로 자동화한다.

### 4.4 AIP의 한계

온톨로지를 통한 grounding이 환각을 **완전히** 제거한다는 주장에 대해: "LLM generation is still a beautiful semantic wrapper, while combining the algorithmic-based approach of 'classical' software with the probabilistic AI-based approach remains an unsolved problem." [출처: Kiryll Shynharow, Palantir Blog Comments, 2025-01]

---

## 5. 균형 잡힌 평가

### 5.1 실질적 차별점

| 차원 | 팔란티어 Foundry/AIP | Databricks | Snowflake |
|---|---|---|---|
| 시맨틱 레이어 | 실행 가능한 운영 레이어 | Unity Catalog (메타데이터) | YAML 시맨틱 모델 (분석) |
| AI 집중 | 운영 워크플로우에 AI 배포 | AI 모델 빌딩·훈련 | AI 기반 분석 |
| 주요 사용자 | 비즈니스 분석가, 운영팀 | 데이터 엔지니어, 과학자 | 분석가, 데이터 엔지니어 |
| 오픈소스 | 코어 폐쇄, SDK/API 공개 | 오픈소스 기반 (Delta Lake) | Apache Iceberg 지원 |

핵심 차별점: Databricks Unity Catalog는 데이터 카탈로그와 거버넌스를 제공하지만 비즈니스 Actions를 직접 실행하는 기능은 없다. 팔란티어는 **데이터 모델 + 비즈니스 로직 + 실세계 액션이 하나의 레이어에 통합**되어 있다.

### 5.2 Security 모델 요약

팔란티어의 보안은 테이블/파일 수준이 아니라 **행(Row), 열(Column), 심지어 셀(Cell) 수준**까지 내려간다. 그리고 이 정책이 온톨로지 타입에 붙어서 어떤 앱에서 접근해도 동일하게 적용된다.

| 보안 계층 | 구현 | 비유 |
|---|---|---|
| 행 수준 (Object Security Policy) | 특정 조건의 오브젝트만 보임 | 건물의 특정 층에만 입장 가능 |
| 열 수준 (Property Security Policy) | 특정 속성만 보임 (나머지 null) | 특정 방에만 입장 가능 |
| Action-only Edit | 직접 편집 차단, Action으로만 수정 | 결재를 통해서만 문서 변경 가능 |

**Link를 통한 보안 전파는 일어나지 않는다**: Object A에 접근 권한이 있어도 Link로 연결된 Object B의 보안 정책을 별도로 통과해야 한다. 예를 들어, Flight를 볼 수 있다고 해서 자동으로 Passenger PII를 볼 수 있지 않다.

### 5.3 OSDK를 통한 외부 접근 패턴

OSDK(Ontology SDK)는 외부 애플리케이션이 팔란티어 온톨로지를 읽고 쓸 수 있는 API 라이브러리다. 특별한 점: 온톨로지 스키마가 변경되면 SDK 타입 정의가 **자동으로 재생성**되어, 스키마 변경이 컴파일 타임 오류로 즉시 발견된다.

```typescript
// 타입 안전한 조회
const aircraft = await client(Aircraft)
  .where({ msn: { $eq: "523" } })
  .fetchOne();

// Link 탐색으로 관련 WorkOrder 조회
const openWorkOrders = await aircraft
  .$link.hasWorkOrder
  .where({ status: { $eq: "Open" } })
  .fetchPage({ pageSize: 100 });

// Action 실행
await client.actions.completeWorkOrder({
  workOrderId: "WO-2026-3441",
  completionDate: "2026-03-24",
  technicianSignature: "김민준"
});

// 실시간 구독
const subscription = client(Aircraft).subscribe({
  onChange: (update) => {
    console.log("Updated:", update.object.msn, update.object.totalFlightHours);
  }
});
```

### 5.4 벤더 락인

**[Critic 지적 반영]** R3가 "완전 폐쇄 소스"라고 단정한 반면, R1은 OSDK(GitHub 공개), JSON 내보내기, OpenAPI Spec 내보내기를 구체적으로 기술했다. 정확한 표현: **"코어 플랫폼은 폐쇄 소스이나, SDK와 API는 공개"**이다.

그럼에도 벤더 락인 우려는 실질적이다:
- 온톨로지 데이터를 CSV/JSON으로 내보낼 수 있지만, 다른 동등한 시스템에서 즉시 사용 불가
- 온톨로지 위에 워크플로우와 앱이 쌓이면 전환 비용이 기하급수적으로 증가
- Databricks(Delta Lake), Snowflake(Apache Iceberg)와 달리 자체 호스팅 불가

---

## 6. 온톨로지 설계 가이드: 새 도메인에서 처음부터 설계하기

이 섹션은 이 보고서만 읽으면 어떤 도메인에서든 온톨로지 설계를 시작할 수 있도록 작성되었다. Airbus와 AML 사례에서 추출하고, 팔란티어 공식 문서의 설계 원칙으로 일반화한 6단계 프로세스다.

### 단계 1: 허브 Object 식별

**질문**: "우리 조직이 매일 아침 가장 먼저 확인하는 엔티티는 무엇인가?" "모든 보고서와 알림이 이것을 중심으로 도는가?"

Airbus에서는 Aircraft, AML에서는 Transaction/Customer가 허브였다. 허브를 잘못 선택하면 링크 구조 전체가 뒤집어진다.

### 단계 2: 허브에 붙는 이벤트를 별도 Object로 분리

허브 Object에 시간에 따라 쌓이는 것이 있는가? 그것은 반드시 별도 Object Type으로 분리한다.

예를 들어 Airbus의 Flight, AML의 Transaction이 이벤트 Object다. SensorReading처럼 초당 수백 건 생성되는 고빈도 데이터는 Time Series Object로 별도 처리한다.

### 단계 3: 지원 Object 식별

허브 Object가 공유하는 엔티티는 무엇인가? 이들은 독립적으로 존재하고 독립적으로 검색되는가?

Airbus: Airline(항공사), Component(부품), Supplier(공급업체)
AML: Account(계좌), Organization(법인), Alert(경보), Case(케이스)

### 단계 4: Link 방향과 카디널리티 결정

| 조건 | 선택 |
|---|---|
| 한쪽이 "소유자"이고 다른 쪽이 "소속 항목" | 1:N 직접 Link |
| 양쪽 모두 "여러 개"와 관계를 맺지만 관계에 속성이 없다 | M:N 직접 Link |
| 관계 자체에 속성이 있다 (시작일, 역할 등) | 조인 Object |
| 관계 이력을 추적해야 한다 | 조인 Object |

각 방향의 이름은 비즈니스 용어로 의미 있게 붙여야 한다. `Employee → manages → DirectReport` / `DirectReport → reportsTo → Manager`처럼 양방향 이름이 다르다.

### 단계 5: Action 설계 (운영 워크플로우 파악)

**질문**: "사용자가 매일 반복하는 작업은 무엇인가?" 그 작업을 Action으로 정의한다.

각 Action에 대해:
- 파라미터는 무엇인가? (어떤 Object를 대상으로, 어떤 값을 입력)
- Submission Criteria가 있는가? (누가, 어떤 조건에서 실행 가능)
- 외부 시스템에 전파되어야 하는가? (Webhook: Writeback vs Side Effect)
- 이 Action이 피드백 루프로 연결되는가? (AML의 분석관 판정 → ML 재학습)

Airbus에서는 `CompleteWorkOrder` Action이, AML에서는 `ConfirmSuspiciousActivity`와 `CloseFalsePositive` Action이 핵심이었다.

### 단계 6: Security 계층 적용 + Interface 검토 + 테스트

**보안 설계 순서**:
1. Organization 격리가 필요한가? (다중 테넌트)
2. 행 수준 보안(Object Security Policy)이 필요한 Object Type은?
3. 열 수준 보안(Property Security Policy)이 필요한 속성은?
4. Action-only Edit로 잠가야 하는 Object Type은?

**Interface 검토**: 다른 Object Type이지만 같은 워크플로우에서 함께 다뤄지는 것이 있는가? (ThreatAlert, SensorAlert, FraudAlert → 공통 `Alert` Interface)

**테스트**: Branch를 활용하여 운영 환경 영향 없이 변경을 테스트한다.

### 실전 적용 예시: "물류 회사의 온톨로지를 설계해보자"

1. **허브**: `Shipment`(배송건) — 매일 아침 확인하는 것은 "오늘 처리할 배송"
2. **이벤트**: `TrackingEvent`(추적 이벤트) — 픽업, 허브 도착, 출발, 배달 각각 별도 Object
3. **지원**: `Customer`, `Driver`, `Warehouse`, `Vehicle`
4. **Link**: Shipment → TrackingEvent (1:N), Shipment → Customer (N:1), Driver → Vehicle (N:1)
5. **Action**: `AssignDriver` (배차), `ConfirmDelivery` (배달 완료), `ReportException` (이상 보고)
6. **보안**: 고객은 자기 배송만, 기사는 자기 배차만, 관리자는 전체

---

## 근거 신뢰도 매트릭스

| 핵심 주장 | 출처 | 도메인 일치도 | 확신도 | 독립 검증 |
|---|---|---|---|---|
| 온톨로지 4중 통합이 제품 차별점 | R1, 팔란티어 공식 문서 | 직접 | 높음 | 불필요 (기술 구조 사실) |
| 개별 프리미티브가 DB 모델링과 동형 | R3, Feng(vonng.com) | 인접 (외부 관찰) | 중간 | 기술적으로 유효하나 비사용자 관점 |
| A350 납품 33% 가속화 | 팔란티어-에어버스 공동 PDF | 직접 | 중간 | **없음 (팔란티어 작성)** |
| Skywise 12,000대 항공기, 50,000명 사용자 | Airbus 뉴스룸 + Flying Magazine | 직접 | 높음 | **있음 (독립 확인)** |
| AML Alert 90~95% 오탐 | Flagright, Unit21, Retail Banker Int'l | 직접 | 높음 | **있음 (다수 독립 출처)** |
| KYC 10일→10시간, TP 40배 | 팔란티어 AML 브로슈어 | 직접 | 낮음 | **없음 (자체 마케팅)** |
| 벤더 락인이 심각 | HASH.ai 독립 분석 | 인접 | 높음 | 있음 (구조적 논거) |
| AIP가 환각을 줄인다 | 팔란티어 블로그 | 직접 | 중간 | **없음 (자체 사례)** |
| Writeback 7단계 체인 | 팔란티어 공식 문서 | 직접 | 높음 | 불필요 (기술 메커니즘) |
| 정부 매출 비중 54% | Palantir Annual Report | 직접 | 높음 | 있음 (IR 공시) |

**구조적 한계**: 모든 정량적 **성과** 데이터가 팔란티어 자체 출처에서 나왔다. 기술 메커니즘(어떻게 작동하는가)은 공식 문서로 검증 가능하지만, 효과 크기(얼마나 좋아졌는가)에 대한 독립 데이터는 시장에 존재하지 않는다.

---

## 상충점 해결 테이블

| 상충 주제 | R1 입장 | R3 입장 | 통합 판단 | 근거 |
|---|---|---|---|---|
| 온톨로지 기술적 독창성 | 근본적으로 다른 설계 철학 | DB 모델링과 동형, 과대포장 | **개념은 동형이나, 통합·접근성에서 제품 레벨 차별점 존재** | Feng 자신이 "가치는 개념 밖에 있다"고 인정 |
| 벤더 락인 심각도 | OSDK/JSON 내보내기로 일부 완화 | 완전 폐쇄 소스 | **코어 폐쇄, SDK/API 공개; 전환 비용은 실질적으로 높음** | R1의 기술적 사실과 R3의 구조적 분석 결합 |
| Feng 비판 근거 강도 | (해당 없음) | 높음 | **중간** | 비사용자의 외부 관찰이며 제품 가치를 포함하지 않음 |
| 허브 Object: 항공사=Flight vs Skywise=Aircraft | DR3에서 Flight | DR1에서 Aircraft | **비즈니스 질문에 따라 달라짐** | 항공사 운영→Flight, 항공 MRO→Aircraft |

---

## 역방향 의사결정 가이드

팔란티어 온톨로지 도입 검토 시:

| 조건(X) | 의사결정(Y) |
|---|---|
| 이종 데이터 소스가 10개 미만이고 단일 팀이 관리 | 온톨로지 도입 ROI가 낮을 가능성. ETL + BI 도구로 충분한지 먼저 검토 |
| 데이터 기반 의사결정이 "분석"이 아닌 **"운영 실행"** 수준 | Action/Writeback 기능이 핵심 차별점. 경쟁사에 없는 기능 |
| 연간 소프트웨어 예산이 $5M 미만 | 복잡한 온톨로지 구축은 예산 초과 위험. AIP Bootcamp로 소규모 시작 |
| LLM 기반 AI를 운영 워크플로우에 통합하려 함 | 온톨로지 이미 구축 시 AIP 도입 ROI 높음. 미구축 시 선행 비용 발생 |
| 멀티벤더·오픈소스 전략이 조직 원칙 | 벤더 락인 리스크 높음. Apache Atlas + Airflow + dbt 조합 검토 |
| 비즈니스 도메인이 빠르게 변화 | 온톨로지 유지보수 부담 증가. "불완전한 온톨로지는 없는 것보다 위험" |
| 정부/규제 환경에서 데이터 통합 필요 | 팔란티어의 정부 조달 경험과 보안 인증이 강점. 단, 시민 데이터 집중화 윤리 평가 필요 |
| **피드백 루프가 핵심 가치인 도메인** (AML, 예측 정비 등) | 온톨로지의 진짜 가치 소재. Action → 판정 → ML 재학습 체인이 제대로 작동하는지가 ROI의 핵심 |

---

## 예상 밖 핵심 발견

1. **N3C 사례에서 팔란티어는 자체 온톨로지를 설계하지 않았다**: 팔란티어의 가치가 "온톨로지 설계 능력" 자체보다 **"어떤 온톨로지든 그 위에서 통합·운영·AI 연동을 제공하는 플랫폼 능력"**에 있음을 시사한다.

2. **ICE 사례는 온톨로지의 도구 비중립성을 보여준다**: 온톨로지 설계가 권력 구조를 결정한다. 기술적 질문이 곧 정치적 질문이다.

3. **AML 온톨로지의 진짜 가치는 "데이터 통합"이 아니라 "피드백 루프"다**: 성과 지표(40배 개선, 90% 절감)는 주로 분석관 판정 → ML 재학습 피드백 루프에서 나온다. 데이터를 모으는 것은 필요조건일 뿐이다.

4. **Entity Resolution이 AML의 진짜 핵심 기술이다**: 화려한 그래프 분석보다 "같은 사람을 다른 이름으로 등록한 것을 하나로 합치는" 능력이 성능에 가장 큰 영향을 미친다.

5. **MCP(Model Context Protocol)의 부상이 팔란티어 위치를 위협할 수 있다**: OpenAI, Anthropic 등이 표준화한 MCP가 확산되면 팔란티어의 독점적 grounding layer 포지션이 약화될 수 있다. 2025년 Foundry에서 MCP 연동 실험이 시작되었다 [출처: Medium, 2025-10].

6. **Airbus Skywise의 진짜 비즈니스 모델은 집단 지성**: 한 항공사의 비정상 패턴이 익명화되어 전체 A350 함대에 경보로 전파되는 메커니즘이 진짜 가치. 개별 데이터가 아니라 패턴과 집계만 공유함으로써 모든 참가자가 혜택을 받는다.

---

## 후속 탐색 질문

1. **온톨로지 구축의 실제 ROI**: "ETL + 범용 LLM" 조합 대비 팔란티어 온톨로지 구축의 경제적 타당성을 정량적으로 비교할 수 있는가? 특히 중견기업($50M~$500M 연매출) 규모에서의 손익분기점은 어디인가?

2. **온톨로지 거버넌스 실무**: 대규모 조직(Object Type 수백 개, 사용자 수천 명)에서 온톨로지 변경 승인 프로세스, 스키마 변경 시 기존 데이터 처리(Property 추가 시 null, 삭제 시 데이터 보존 여부), 팀 간 충돌 해결이 실제로 어떻게 운영되는가?

3. **MCP 시대의 온톨로지 포지셔닝**: MCP가 표준으로 자리잡을 경우, 팔란티어 온톨로지의 grounding layer 역할은 어떻게 변화하는가?

4. **온톨로지 설계 실패 사례**: 온톨로지를 도입했으나 사용되지 않거나 폐기된 사례는? 어떤 조건에서 실패하고, 어떻게 복구하는가?

5. **암호화폐/DeFi 거래에서 AML 온톨로지**: 블록체인 거래는 코어뱅킹 데이터와 구조적으로 다르다. on-chain 데이터를 온톨로지에 어떻게 연결하는가?

---

## 출처 통합 목록

### 1차 출처 (팔란티어 공식)
1. Palantir Foundry 공식 문서 — The Ontology System: https://palantir.com/docs/foundry/architecture-center/ontology-system/
2. Palantir Foundry 공식 문서 — Overview Ontology: https://palantir.com/docs/foundry/ontology/overview/
3. Palantir 공식 문서 — Action Types Overview: https://palantir.com/docs/foundry/action-types/overview/
4. Palantir 공식 문서 — Object Backend Overview: https://palantir.com/docs/foundry/object-backend/overview/
5. Palantir 공식 문서 — OSDK Overview: https://palantir.com/docs/foundry/ontology-sdk/overview/
6. Palantir Blog — Reducing Hallucinations with the Ontology in AIP (2024-07)
7. Palantir Blog — Ontology-Oriented Software Development (2024-01)
8. Palantir Interoperability PDF (2022)
9. Palantir-Airbus Partnership Overview PDF (2020)
10. Palantir Foundry for AML PDF (2021)
11. Palantir Foundry for Transaction Monitoring WP (2022)
12. Palantir Foundry for AML — Case Management PDF (2021)
13. Palantir 2025 Annual Report
14. Palantir 공식 문서 — Webhooks, Submission Criteria, Function-backed Actions, AIP Logic, Object/Property Security Policies, OSDK TypeScript/Python, Interfaces, Streaming Performance

### 독립 출처
15. PMC 학술 논문 — N3C OMOP (PMID 32761549, PMC7454687)
16. HASH.ai — "The Problem with Palantir" (2025-04)
17. Ruohang Feng (vonng.com) — "Palantir's Ontology Narrative" (2025)
18. BiometricUpdate — ICE FALCON 분석 (2025)
19. EFF — ELITE 도구 보고 (2026-01)
20. Flagright — Understanding False Positives in Transaction Monitoring (2024)
21. Unit21 — How to Reduce False Positives in AML
22. Retail Banker International — Hidden Cost of AML (2025)
23. TigerGraph — AML Graph Analytics (2026)
24. Airbus Newsroom — Digital Twins (2025-04)
25. Flying Magazine — Airbus Skywise (2025)
26. Palantir Community — Ontology and Pipeline Design Principles

### 인접 출처
27. Sainath Palla — Towards AI (2025-11)
28. Latentview — "Databricks vs Palantir" (2026-01)
29. Wikipedia — Palantir
