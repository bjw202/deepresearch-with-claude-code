# 온톨로지 기반 KG + LLM 멀티에이전트 제조 불량 분석 폐쇄 루프 시스템 -- 구현 아키텍처 보고서

> **작성일**: 2026-03-20
> **역할**: Researcher (제조 AI 시스템 아키텍트)
> **범위**: 전체 아키텍처 설계, 기술 스택, 에이전트 구성, KG/온톨로지, 설비 연동, HITL, 레퍼런스

---

## 목차

1. [전체 아키텍처 개요](#1-전체-아키텍처-개요)
2. [LLM 멀티에이전트 구성](#2-llm-멀티에이전트-구성)
3. [지식그래프/온톨로지 설계](#3-지식그래프온톨로지-설계)
4. [설비 연동 프로토콜](#4-설비-연동-프로토콜)
5. [Human-in-the-Loop 설계](#5-human-in-the-loop-설계)
6. [유사 아키텍처 레퍼런스](#6-유사-아키텍처-레퍼런스)
7. [추천 기술 스택 요약](#7-추천-기술-스택-요약)
8. [관점 확장 및 숨은 변수](#8-관점-확장-및-숨은-변수)

---

## 1. 전체 아키텍처 개요

### 1.1 시스템 흐름 다이어그램

```
┌─────────────────────────────────────────────────────────────────────┐
│                        데이터 수집 계층 (Data Ingestion)             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────────┐    │
│  │ SPC 데이터 │  │ 센서 스트림 │  │ 검사 결과 │  │ MES/ERP 이벤트  │    │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └──────┬───────────┘    │
│       └──────────────┴──────────────┴───────────────┘               │
│                              │                                       │
│                    ┌─────────▼──────────┐                            │
│                    │ 이벤트 브로커       │                            │
│                    │ (Kafka / MQTT)      │                            │
│                    └─────────┬──────────┘                            │
└──────────────────────────────┼──────────────────────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────────────┐
│                     불량 감지 계층 (Defect Detection)                │
│  ┌─────────────────────────────────────────────────┐                │
│  │ 규칙 기반 + ML 기반 이상 감지 (Anomaly Detector) │                │
│  │ - SPC 규칙 위반 (Western Electric rules)         │                │
│  │ - ML 모델 (Autoencoder, Isolation Forest)        │                │
│  └────────────────────┬────────────────────────────┘                │
└───────────────────────┼─────────────────────────────────────────────┘
                        │ 불량 이벤트 (DefectEvent)
                        ▼
┌─────────────────────────────────────────────────────────────────────┐
│                  지식 탐색 계층 (Knowledge Layer)                    │
│                                                                     │
│  ┌───────────────────────┐    ┌───────────────────────────────┐     │
│  │ 온톨로지 (OWL/RDFS)   │◄──►│ 지식그래프 (Knowledge Graph) │     │
│  │ - MASON PPR 확장       │    │ - 불량-원인-파라미터 트리플   │     │
│  │ - 불량 모드 온톨로지   │    │ - 이력 데이터 인스턴스        │     │
│  │ - 설비 capability      │    │ - FMEA 지식                   │     │
│  └───────────────────────┘    └──────────┬────────────────────┘     │
│                                          │ SPARQL/Cypher 질의       │
└──────────────────────────────────────────┼──────────────────────────┘
                                           │
┌──────────────────────────────────────────▼──────────────────────────┐
│                LLM 멀티에이전트 계층 (Agent Orchestration)          │
│                                                                     │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │                   오케스트레이터 에이전트                       │ │
│  │              (Supervisor / Router Agent)                       │ │
│  └──┬──────────┬──────────┬──────────┬──────────┬───────────────┘ │
│     │          │          │          │          │                   │
│  ┌──▼───┐  ┌──▼───┐  ┌──▼───┐  ┌──▼───┐  ┌──▼──────────┐       │
│  │분석   │  │레시피│  │보고  │  │검증  │  │이력 학습     │       │
│  │에이전트│  │생성  │  │에이전트│ │에이전트│ │에이전트     │       │
│  │       │  │에이전트│ │       │  │       │  │              │       │
│  └──┬───┘  └──┬───┘  └──┬───┘  └──┬───┘  └──────────────┘       │
│     │ Tool    │ Tool    │ Tool    │ Tool                           │
│     │ Calling │ Calling │ Calling │ Calling                        │
│  ┌──▼────────▼────────▼────────▼─────────────────────────────┐    │
│  │                   도구 레지스트리 (Tool Registry)           │    │
│  │  - KG 질의 도구    - SPC 분석 도구    - 시뮬레이션 도구    │    │
│  │  - 통계 분석 도구  - 레시피 조회 도구  - 알림 도구         │    │
│  └───────────────────────────────────────────────────────────┘    │
└──────────────────────────────────────────┬──────────────────────────┘
                                           │ 레시피 조정안
                                           ▼
┌─────────────────────────────────────────────────────────────────────┐
│               Human-in-the-Loop 계층 (Approval Layer)               │
│                                                                     │
│  ┌───────────────────────────────────────────────────────┐          │
│  │ 승인 UI (웹 대시보드)                                 │          │
│  │ - 위험도별 자동/수동 분기                             │          │
│  │ - 분석 근거 + 레시피 변경 diff + 영향 범위 표시       │          │
│  │ - 승인/거부/수정 후 재제출                            │          │
│  └──────────────────────┬────────────────────────────────┘          │
│                         │ 승인됨                                    │
└─────────────────────────┼───────────────────────────────────────────┘
                          │
┌─────────────────────────▼───────────────────────────────────────────┐
│              설비 실행 계층 (Equipment Execution)                    │
│                                                                     │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────────────┐         │
│  │ Recipe        │  │ OPC UA /     │  │ PLC / 설비        │         │
│  │ Manager       │──│ MQTT Gateway │──│ Controller        │         │
│  │ (ISA-88)      │  │              │  │                   │         │
│  └──────────────┘  └──────────────┘  └───────────────────┘         │
└─────────────────────────────────────────────────────────────────────┘
```

### 1.2 컴포넌트별 역할 요약

| 계층 | 컴포넌트 | 역할 |
|------|---------|------|
| 데이터 수집 | 이벤트 브로커 | 센서, SPC, MES 데이터를 통합 스트림으로 집약 |
| 불량 감지 | 이상 감지기 | 규칙 + ML 기반으로 불량 이벤트를 발행 |
| 지식 탐색 | 온톨로지 + KG | 불량-원인-파라미터 관계를 의미적으로 탐색 |
| 에이전트 | 멀티에이전트 | 원인 분석, 레시피 생성, 검증, 보고를 분업 수행 |
| HITL | 승인 UI | 사람이 레시피 변경을 검토하고 승인/거부 |
| 설비 실행 | Recipe Manager + 게이트웨이 | 승인된 레시피를 ISA-88 구조로 변환하여 설비에 전달 |

### 1.3 핵심 설계 원칙

- **폐쇄 루프(Closed Loop)**: 불량 감지 -> 분석 -> 레시피 조정 -> 설비 적용 -> 결과 모니터링 -> 지식 축적의 순환
- **사람 승인 필수(Human-in-the-Loop)**: 자동 분석까지는 기계가 하되, 설비에 적용하는 결정은 반드시 사람이 확인
- **지식 축적(Knowledge Accumulation)**: 모든 불량 분석 결과와 레시피 조정 이력이 KG에 누적되어 시스템이 학습

---

## 2. LLM 멀티에이전트 구성

### 2.1 에이전트 역할 정의

```
┌─────────────────────────────────────────────┐
│           오케스트레이터 (Supervisor)        │
│  - 불량 이벤트를 받아 적절한 에이전트 호출   │
│  - 에이전트 간 결과를 조율                   │
│  - 최종 결과를 HITL로 전달                   │
└──────┬───────┬───────┬───────┬──────────────┘
       │       │       │       │
  ┌────▼──┐ ┌─▼────┐ ┌▼─────┐ ┌▼──────┐
  │ 분석   │ │레시피│ │ 검증  │ │ 보고   │
  │Agent   │ │Agent │ │Agent  │ │Agent   │
  └────────┘ └──────┘ └──────┘ └────────┘
```

| 에이전트 | 역할 | 호출하는 도구 |
|---------|------|-------------|
| **오케스트레이터** (Supervisor) | 불량 이벤트를 분류하고 적절한 에이전트를 호출. 결과를 조율하여 HITL로 전달 | 라우팅 로직, 상태 관리 |
| **분석 에이전트** (Root Cause Analyzer) | KG를 질의하여 과거 유사 불량 탐색, 통계 분석 도구로 상관관계 파악, 원인 후보 순위화 | KG 질의 도구, SPC 분석, 상관분석, Pareto 분석 |
| **레시피 생성 에이전트** (Recipe Generator) | 분석 결과를 바탕으로 파라미터 조정안 생성. 기존 레시피와의 diff 산출. 안전 범위 확인 | 레시피 DB 조회, 파라미터 범위 검증, 시뮬레이션 |
| **검증 에이전트** (Validator) | 제안된 레시피 변경이 물리적/공정적 제약을 위반하지 않는지 확인 | 공정 시뮬레이터, 제약 조건 체커, KG 제약 질의 |
| **보고 에이전트** (Reporter) | 분석 과정과 결론을 사람이 읽을 수 있는 형태로 정리 | 템플릿 렌더링, 차트 생성 |
| **이력 학습 에이전트** (Learner) | 승인/거부 결과와 적용 후 품질 데이터를 KG에 피드백 | KG 쓰기 도구, 모델 업데이트 |

### 2.2 오케스트레이션 프레임워크 선택

**추천: LangGraph** (production 환경 기준)

| 기준 | LangGraph | CrewAI | AutoGen |
|------|-----------|--------|---------|
| 상태 관리 | TypedDict + 체크포인터 (Postgres/Redis). 크래시 복구, 시간 여행(time travel) 지원 | Pydantic 모델, LanceDB. 상대적으로 단순 | 대화 기반. 상태 관리 제한적 |
| HITL 지원 | **네이티브**. interrupt_before/after로 승인 노드 삽입 가능 | 제한적. 별도 구현 필요 | 제한적 |
| 도구 호출 | 노드 단위로 LLM/도구 호출. 조건부 라우팅, 순환 지원 | 에이전트별 도구 바인딩 | 함수 호출 기반 |
| 관찰성 (Observability) | LangSmith 연동. 전체 실행 그래프 시각화 | 기본 로깅 | 기본 로깅 |
| 제조 적합성 | **높음**. 결정론적 라우팅 + 순환 (반복 분석) + HITL 네이티브 | 프로토타입에 적합 | 연구용 |

출처: LangGraph vs CrewAI 비교 (xcelore.com, 2025; dev.to, 2026; christianmendieta.ca, 2026)

**의사결정 근거**: 제조 환경에서는 (1) 에이전트 실행의 **결정론적 제어**가 필수이고, (2) 분석 결과에 확신이 낮으면 **반복 루프**를 돌려야 하며, (3) HITL 승인이 워크플로우 안에 자연스럽게 들어가야 한다. LangGraph의 directed graph 모델이 이 세 가지를 모두 네이티브로 지원한다.

**반증 탐색**: CrewAI가 더 나은 경우도 있다. 초기 PoC에서 빠르게 에이전트를 조합하고 검증할 때는 CrewAI의 낮은 보일러플레이트가 유리하다. "LangGraph로 시작하면 오버엔지니어링"이라는 의견도 존재한다 (christianmendieta.ca). 그러나 **production에서 safety-critical한 레시피 변경을 다루는 이 시스템에서는 LangGraph의 제어력이 필수**라고 판단한다.

### 2.3 LangGraph 기반 에이전트 그래프 설계

```
START
  │
  ▼
[불량 이벤트 수신] ─── DefectEvent를 State에 기록
  │
  ▼
[오케스트레이터] ─── 불량 유형 분류, 긴급도 판단
  │
  ├── 단순 불량 ──► [분석 에이전트] ──► [레시피 생성] ──► [검증] ──► [HITL]
  │
  └── 복합 불량 ──► [분석 에이전트] ──┐
                                       │ confidence < 0.8?
                                       ├── YES ──► [추가 분석 루프] ──► [분석 에이전트]
                                       └── NO  ──► [레시피 생성] ──► [검증] ──► [HITL]
                                                                        │
                                                     검증 실패? ────────┘ (레시피 재생성)
                                                                        │
                                                                   [HITL 승인]
                                                                        │
                                                              ┌─── 승인 ───┐
                                                              ▼            ▼
                                                         [설비 전달]   [거부/수정]
                                                              │            │
                                                              ▼            ▼
                                                         [모니터링]   [재분석 요청]
                                                              │
                                                              ▼
                                                         [이력 학습]
                                                              │
                                                             END
```

### 2.4 상태 스키마 (예시)

```python
class DefectAnalysisState(TypedDict):
    defect_event: dict          # 불량 이벤트 원본 데이터
    defect_type: str            # 분류된 불량 유형
    severity: str               # "critical" | "major" | "minor"
    kg_context: list[dict]      # KG에서 조회한 관련 지식
    analysis_result: dict       # 원인 분석 결과 (후보 원인, 확신도)
    confidence: float           # 분석 확신도 (0.0~1.0)
    recipe_current: dict        # 현재 레시피 파라미터
    recipe_proposed: dict       # 제안 레시피 파라미터
    recipe_diff: list[dict]     # 변경된 파라미터 목록
    validation_result: dict     # 검증 결과
    approval_status: str        # "pending" | "approved" | "rejected" | "modified"
    report: str                 # 사람 읽기용 보고서
    iteration_count: int        # 분석 반복 횟수
```

---

## 3. 지식그래프/온톨로지 설계

### 3.1 온톨로지 구조: MASON PPR 확장

MASON(MAnufacturing's Semantics ONtology)의 **Product-Process-Resource (PPR)** 상위 구조를 기반으로, 불량 분석에 필요한 개념을 확장한다.

```
                    ┌─────────────┐
                    │  MASON Core │
                    │  (PPR)      │
                    └──────┬──────┘
           ┌───────────────┼───────────────┐
           ▼               ▼               ▼
    ┌──────────┐    ┌──────────┐    ┌──────────┐
    │ Product  │    │ Process  │    │ Resource │
    │ (Entity) │    │(Operation)│   │(Resource)│
    └────┬─────┘    └────┬─────┘    └────┬─────┘
         │               │               │
    ┌────▼─────┐    ┌────▼─────┐    ┌────▼─────┐
    │ 확장:    │    │ 확장:    │    │ 확장:    │
    │ - Defect │    │ - Recipe │    │ - Sensor │
    │ - Quality│    │ - Param  │    │ - Setting│
    │   Spec   │    │ - Step   │    │ - Calib  │
    │ - Symptom│    │ - FMEA   │    │   Status │
    └──────────┘    └──────────┘    └──────────┘
```

### 3.2 핵심 클래스와 관계

| 클래스 (Class) | 설명 | 주요 속성 (Properties) |
|---------------|------|----------------------|
| `Defect` | 불량 현상 (스크래치, 기포, 치수 초과 등) | defect_type, severity, detected_at, detection_method |
| `RootCause` | 불량의 근본 원인 | cause_category, mechanism, domain_knowledge |
| `ProcessParameter` | 공정 파라미터 (온도, 압력, 시간 등) | param_name, current_value, unit, valid_range |
| `Recipe` | 레시피 (파라미터 세트) | recipe_id, version, product_type, status |
| `Equipment` | 설비 | equipment_id, type, capabilities, calibration_status |
| `QualitySpec` | 품질 규격 | spec_name, target, upper_limit, lower_limit |
| `AnalysisRecord` | 분석 이력 | analysis_id, timestamp, result, confidence, approved_by |

**핵심 관계 (Object Properties)**:

```
Defect  ──hasRootCause──►  RootCause
Defect  ──detectedIn──►    Process
Defect  ──affectsProduct──► Product

RootCause ──causedByParam──► ProcessParameter
RootCause ──relatedToEquip──► Equipment
RootCause ──mitigatedBy──►   Recipe (조정)

ProcessParameter ──belongsToRecipe──► Recipe
ProcessParameter ──controlledBy──►    Equipment

Recipe  ──appliedToProcess──► Process
Recipe  ──usesResource──►     Resource

AnalysisRecord ──analyzedDefect──► Defect
AnalysisRecord ──proposedRecipe──► Recipe
AnalysisRecord ──approvedBy──►     (사용자 URI)
```

### 3.3 기술 선택: Neo4j + RDF/OWL 하이브리드

| 계층 | 기술 | 이유 |
|------|------|------|
| **온톨로지 정의** (TBox) | OWL-DL + Protege | MASON 확장에 적합. 클래스 계층, 제약 조건, 추론 규칙 정의 |
| **지식그래프 저장** (ABox) | Neo4j (Label Property Graph) | 실시간 질의 성능. Cypher 질의 직관성. 에이전트 도구에서 호출 용이 |
| **RDF 브릿지** | Neosemantics (n10s) | OWL 온톨로지를 Neo4j로 임포트. SHACL 제약 검증 |
| **추론** | SWRL 규칙 + Neo4j GDS | 간단한 규칙은 SWRL, 그래프 기반 패턴 매칭은 Neo4j Graph Data Science |

**왜 순수 RDF/SPARQL 스토어(예: Apache Jena, Stardog)를 쓰지 않는가?**

- RDF 트리플스토어는 온톨로지 추론에는 강하지만, **실시간 질의 성능과 개발 생산성**에서 Neo4j보다 불리하다.
- LLM 에이전트의 도구로 사용할 때 Cypher가 SPARQL보다 **자연어에서 변환하기 쉽다** (LLM이 Cypher를 더 잘 생성하는 경향).
- 대안: Amazon Neptune은 RDF + Property Graph를 모두 지원하지만, 클라우드 종속성이 생긴다.
- 반증 미발견: Neo4j가 제조 KG에 부적합하다는 근거는 검색 범위 내에서 발견하지 못했다.

### 3.4 KG 데이터 파이프라인

```
[FMEA 문서] ──LLM 추출──► [트리플 생성] ──► [Neo4j 적재]
[과거 불량 이력 DB] ──ETL──► [인스턴스 생성] ──► [Neo4j 적재]
[설비 사양서] ──구조화──► [Equipment 노드] ──► [Neo4j 적재]
[레시피 DB] ──동기화──► [Recipe 노드] ──► [Neo4j 적재]
```

FMEA 워크시트를 KG로 변환하는 과정에서 LLM의 ontology-guided entity extraction이 효과적이다. arXiv (2510.15428) 연구에서 FMEA 테이블을 온톨로지 가이드 LLM으로 추출하여 KG를 구축한 후, RGCN(Relational Graph Convolutional Network)으로 원인 예측 시 **F1@20 = 0.523**을 달성했다 (RAG 기반 0.267 대비 약 2배). 출처: arXiv 2510.15428 (2025). 이 수치가 틀릴 수 있는 조건: 자동차 센서 조립이라는 특정 도메인의 FMEA 데이터에서 측정된 것이므로, 다른 제조 도메인(예: 화학 공정, 반도체)에서는 달라질 수 있다.

---

## 4. 설비 연동 프로토콜

### 4.1 프로토콜 비교

| 프로토콜 | 용도 | 장점 | 단점 | 적용 포인트 |
|---------|------|------|------|-----------|
| **OPC UA** | 설비 파라미터 읽기/쓰기, 레시피 다운로드 | 산업 표준, 보안(인증/암호화), 정보 모델링, Companion Specification | 구현 복잡도 높음, 라이센스 비용 | PLC/설비 ↔ Recipe Manager |
| **MQTT** | 센서 데이터 스트림, 이벤트 알림 | 경량, pub/sub, 저지연 | 정보 모델 없음 (페이로드 자유) | 센서 → 이벤트 브로커 |
| **REST API** | 상위 시스템 간 통신 (MES ↔ 에이전트 ↔ UI) | 범용, 구현 쉬움 | 실시간 부적합, 보안 별도 구현 | 에이전트 ↔ HITL UI ↔ MES |
| **OPC UA Pub/Sub over MQTT** | 센서 스트림 + OPC UA 정보 모델 결합 | 시맨틱 + 경량의 장점 결합 | 아직 채택 초기 | Edge → Cloud 집계 |

### 4.2 레시피 다운로드 흐름 (ISA-88 준수)

ISA-88(ANSI/ISA-88.01)은 레시피를 **General → Site → Master → Control** 계층으로 관리한다. 이 시스템에서의 레시피 변경 흐름:

```
1. [레시피 생성 에이전트]가 Master Recipe의 파라미터 변경안을 생성
2. [검증 에이전트]가 파라미터 범위, 공정 제약 검증
3. [HITL]에서 사람이 승인
4. [Recipe Manager]가 Master Recipe를 업데이트하고 Control Recipe를 생성
5. [OPC UA 클라이언트]가 Control Recipe를 PLC에 전달
   - OPC UA Method Call: SetRecipeParameters()
   - 또는 OPC UA NodeWrite: 개별 파라미터 노드에 값 쓰기
6. PLC가 파라미터 적용 후 Ack 반환
7. 시스템이 변경 적용 확인 로그를 KG에 기록
```

**OPC UA를 통한 PLC 파라미터 쓰기 예시** (개념):

```
// Siemens S7 PLC 예시
서버 URL: opc.tcp://192.168.1.10:4840
노드 ID: ns=3;s=DataBlocks.RecipeDB.Temperature
쓰기 값: 185.0 (°C)

// Allen-Bradley 예시
OPC UA Companion Spec: PackML (ISA-TR88)
Method: SetRecipeValue(param_name, value, unit)
```

**핵심 안전 장치**:
- PLC 측에서 **하드 리밋(hard limit)**은 항상 유지. AI가 제안한 값이 하드 리밋을 초과하면 PLC가 거부
- Master Recipe 변경은 **버전 관리** 필수. 롤백 가능해야 함
- Control Recipe는 1회 실행 후 폐기 (추적성 확보)

출처: ISA-88 표준, Siemens PCS 7 ISA-88 구현 가이드 (109784331), Copa-Data Batch Control 백서

### 4.3 Edge Gateway 아키텍처

```
┌─────────────────────────────────────────┐
│           Cloud / On-Premise 서버        │
│  [LLM Agent]  [KG]  [Recipe Manager]    │
└──────────────────┬──────────────────────┘
                   │ REST API / gRPC
         ┌─────────▼─────────┐
         │  Edge Gateway     │
         │  (NVIDIA Jetson   │
         │   또는 산업용 PC)  │
         │                   │
         │  - OPC UA Client  │
         │  - MQTT Broker    │
         │  - 프로토콜 변환  │
         │  - 로컬 캐시      │
         └────┬────┬────┬────┘
              │    │    │
           ┌──▼┐ ┌▼──┐ ┌▼──┐
           │PLC│ │PLC│ │센서│
           └───┘ └───┘ └───┘
```

---

## 5. Human-in-the-Loop 설계

### 5.1 위험도 기반 분기 정책

| 위험도 | 판단 기준 | 처리 방식 | 예시 |
|--------|----------|----------|------|
| **Critical** | 안전 관련 파라미터 변경, 설비 손상 가능성 | 반드시 수동 승인 + 상위 관리자 에스컬레이션 | 압력 한계 근처 변경, 온도 30% 이상 변경 |
| **Major** | 품질에 직접 영향, 고가 원자재 관련 | 수동 승인 필수 | 핵심 공정 파라미터 변경 |
| **Minor** | 미세 조정, 과거 승인 이력 있는 패턴 | **자동 승인 가능** (조건부) | 온도 +/- 2도 이내 미세 조정 |

**자동 승인 조건** (Minor 등급에 한해):
- 동일 패턴의 변경이 과거 3회 이상 승인된 이력
- 변경 폭이 기설정 임계값 이내
- 검증 에이전트가 모든 제약 통과 확인
- 자동 승인 후 48시간 이내 결과 모니터링

이 임계값(3회, 48시간 등)은 초기값이며, 운영 데이터가 쌓이면 조정해야 한다. 지나치게 보수적이면 병목이 되고, 느슨하면 품질 사고 위험이 있다.

### 5.2 승인 UI 필수 정보

승인자가 판단하려면 아래 정보가 화면에 표시되어야 한다:

```
┌─────────────────────────────────────────────────────┐
│ 불량 분석 보고서 #2026-0320-0042                    │
├─────────────────────────────────────────────────────┤
│ ■ 불량 요약                                         │
│   유형: 표면 기포 (Surface Bubble)                  │
│   감지 시각: 2026-03-20 14:23:05                    │
│   심각도: Major                                      │
│   영향 제품: PCB-A320 Lot #2026032014               │
│                                                     │
│ ■ 원인 분석 (확신도: 0.87)                          │
│   1순위: 리플로우 오븐 Zone 3 온도 과다 (0.87)      │
│   2순위: 솔더 페이스트 점도 이상 (0.45)             │
│   근거: KG 유사 사례 12건 참조, SPC 트렌드 분석     │
│                                                     │
│ ■ 레시피 변경 제안                                   │
│   ┌──────────────┬──────────┬──────────┬────────┐   │
│   │ 파라미터      │ 현재값   │ 제안값   │ 범위   │   │
│   ├──────────────┼──────────┼──────────┼────────┤   │
│   │ Zone3_Temp   │ 260°C    │ 248°C    │ 230-270│   │
│   │ Conveyor_Spd │ 0.8 m/min│ 0.7 m/min│ 0.5-1.2│   │
│   └──────────────┴──────────┴──────────┴────────┘   │
│                                                     │
│ ■ 영향 범위                                         │
│   - 대상 설비: Reflow Oven #3                       │
│   - 영향 제품: PCB-A320, PCB-A321                   │
│   - 예상 효과: 기포 발생률 87% → 12% (KG 추정)     │
│                                                     │
│ ■ 검증 결과                                         │
│   ✓ 파라미터 범위 내                                │
│   ✓ 인접 공정 영향 없음                             │
│   ✓ 과거 유사 조정 3건 (모두 성공)                  │
│                                                     │
│        [승인]    [수정 후 승인]    [거부]            │
└─────────────────────────────────────────────────────┘
```

### 5.3 에스컬레이션 정책

```
불량 발생
    │
    ▼
[에이전트 분석 완료] ──► 위험도 판정
    │
    ├── Minor ──► 자동 승인 조건 충족? ──► YES: 자동 적용 + 로그
    │                                    └── NO: 현장 엔지니어에게 알림
    │
    ├── Major ──► 공정 엔지니어에게 알림 (Slack/이메일/모바일 푸시)
    │             └── 30분 내 미응답 ──► 상위 관리자 에스컬레이션
    │
    └── Critical ──► 즉시 라인 정지 권고 + 공정 엔지니어 + 품질 관리자 동시 알림
                     └── 15분 내 미응답 ──► 공장장 에스컬레이션
```

---

## 6. 유사 아키텍처 레퍼런스

### 6.1 학술 연구

| 연구 | 구조 | 시스템과의 유사도 | 출처 |
|------|------|-----------------|------|
| **FMEA KG + LLM 원인 예측** (2025) | FMEA → ontology-guided LLM 추출 → KG 구축 → RGCN 링크 예측으로 불량 원인 식별 | 높음. KG 기반 원인 분석 부분이 직접 대응 | arXiv 2510.15428 |
| **LLM 멀티에이전트 자율 보전** (2025) | Chatbot + Solution Finder + Actor + Supervisor 4-agent 구조. CNC 머신툴 HMI 자동 조작 | 높음. 에이전트 구조와 설비 연동 패턴 참고 가능 | PHM Asia Pacific 2025 (phmsociety.org) |
| **LLM-Enabled MAS for Manufacturing** (2024) | Process Agent(PA) + Resource Agent(RA) + GPT-4 기반 자연어 처리. G-code 생성 및 실행 | 중간. 에이전트-설비 연동 패턴 참고 | arXiv 2406.01893 |
| **LLM Roll-to-Roll 공정 제어** (2025) | LLM 에이전트가 roll-to-roll 공정의 컨트롤러 파라미터를 조정 | 높음. 폐쇄 루프 파라미터 조정의 직접 사례 | arXiv 2511.22975 |

### 6.2 산업 구현

| 프로젝트/기업 | 내용 | 참고 포인트 |
|-------------|------|-----------|
| **Binghamton Univ. / SEMI** | PCB SMT 리플로우 오븐 레시피를 AI로 최적화. 열 프로파일 예측 모델 → 최적 레시피 자동 생성. **적합도 97%** 달성 | 가장 직접적인 레퍼런스. "AI가 레시피를 제안하고 설비에 적용"하는 전체 흐름 실증 |
| **LONGi (태양광)** | AI 기반 불량 근본 원인 분석 + multimodal 이미지 분석 + feature-based tracing + 폐쇄 루프 품질 전문가 시스템 | 폐쇄 루프 품질 시스템의 실제 운영 사례 |
| **Hengtong Alpha** | 광섬유 preform/drawing 공정 파라미터를 AI로 자동 최적화. 처리량 40-140% 증가 | 파라미터 자동 조정의 생산성 효과 레퍼런스 |
| **MongoDB MAS Demo** | 예측 보전 에이전트 + 품질 분석 에이전트 + 공정 최적화 에이전트가 협업하여 파라미터 조정 | 멀티에이전트 협업 패턴의 구체적 구현 참고 |

출처: SEMI Technology Trends (semi.org), Fujitsu Next Gen Manufacturing (2025), MongoDB Blog

**Binghamton 사례의 97% 적합도**에 대한 주의: 이는 리플로우 오븐이라는 특정 공정에서, 열 프로파일이라는 단일 품질 지표에 대해 측정된 것이다. 다변량 공정이나 복합 불량에서는 이 수준의 적합도를 기대하기 어려울 수 있다. [인접 도메인: PCB SMT 조립]

### 6.3 Fujitsu의 제조 AI 성숙도 3단계 모델

Fujitsu(2025)는 제조 AI의 자율성을 3단계로 구분했는데, 이 시스템의 목표 위치를 파악하는 데 유용하다:

| 단계 | AI 역할 | 사람 역할 | 이 시스템 해당 |
|------|--------|----------|--------------|
| 1단계 | 실시간 파라미터 자동 설정으로 정상 운전 유지 | 최소 개입 | 부분 해당 (이상 감지) |
| **2단계** | **성능 저하 감지 → 조정안 제안 → 레시피 수정 → 불순물 제거** | **의사결정 검토, 승인/조정** | **주 목표** |
| 3단계 | 자율 운영, 자가 치유(self-healing) | 결과 모니터링만 | 미래 목표 |

출처: Fujitsu "Next Generation Intelligent Manufacturing with Generative AI" (2025)

---

## 7. 추천 기술 스택 요약

| 영역 | 추천 기술 | 대안 | 비고 |
|------|----------|------|------|
| **에이전트 오케스트레이션** | LangGraph (Python) | CrewAI (PoC), Anthropic Agent SDK | HITL 네이티브, 상태 체크포인트 |
| **LLM** | Claude Sonnet 4 / GPT-4o (클라우드), Llama 3.1 70B (온프레미스) | Mistral Large | 온프레미스는 데이터 보안 필요 시 |
| **지식그래프 DB** | Neo4j (AuraDB 또는 Self-hosted) | Amazon Neptune, Stardog | Cypher 질의, LLM 호환성 |
| **온톨로지 편집** | Protege (OWL-DL) | WebVOWL, TopBraid | MASON 확장 정의 |
| **RDF 브릿지** | Neosemantics (n10s) | RDF4J, RDFlib | OWL → Neo4j 임포트 |
| **이벤트 브로커** | Apache Kafka | MQTT (Mosquitto), RabbitMQ | 대용량 스트림 시 Kafka, 소규모 시 MQTT |
| **설비 통신** | OPC UA (open62541, Eclipse Milo) | MQTT + Sparkplug B | PLC 연동 표준 |
| **Edge Gateway** | NVIDIA Jetson / 산업용 PC | Raspberry Pi (비생산용) | 프로토콜 변환, 로컬 캐시 |
| **승인 UI** | React + WebSocket | Streamlit (PoC) | 실시간 알림 필수 |
| **알림** | Slack API + 이메일 + 모바일 푸시 | MS Teams | 에스컬레이션 자동화 |
| **모니터링/관찰성** | LangSmith + Grafana + Prometheus | Datadog | 에이전트 실행 추적 + 설비 메트릭 |
| **레시피 관리** | ISA-88 준수 자체 구현 또는 MES 연동 | Siemens SIMATIC BATCH, Copa-Data zenon | 기존 MES가 있으면 연동 우선 |

---

## 8. 관점 확장 및 숨은 변수

### 8.1 이 시스템의 성패를 가르는 숨은 변수

1. **KG 초기 데이터 품질**: 시스템의 분석 품질은 KG에 축적된 불량-원인 지식의 양과 질에 완전히 의존한다. FMEA 데이터가 부실하거나 과거 이력이 체계적으로 정리되지 않았다면, LLM이 아무리 좋아도 쓸모없는 분석을 내놓는다. **KG 구축이 가장 먼저, 가장 많은 노력이 필요한 작업**이다.

2. **LLM 환각(hallucination)의 제조 현장 위험**: LLM이 잘못된 원인을 자신 있게 제안하면, 잘못된 레시피 변경으로 이어진다. HITL이 이를 막는 최후 방어선이지만, 승인자가 LLM의 자신감 있는 표현에 속을 수 있다. **확신도(confidence)를 에이전트 자체 평가가 아닌, KG 근거 수에 기반하여 산출**하는 것이 더 안전하다.

3. **조직 저항**: 현장 엔지니어가 "AI가 내 레시피를 바꾼다"고 느끼면 채택이 실패한다. 시스템은 "AI가 결정한다"가 아니라 "AI가 분석을 도와주고, 당신이 결정한다"로 포지셔닝해야 한다.

### 8.2 인접 질문

1. **데이터 드리프트 대응**: 설비가 노화하면 같은 파라미터로도 다른 결과가 나온다. KG와 분석 모델이 이 변화를 어떻게 추적할 것인가? 설비 상태를 KG에 시계열로 기록하는 구조가 필요할 수 있다.

2. **멀티 라인 확장**: 단일 라인에서 검증된 시스템을 여러 라인으로 확장할 때, 라인별 특성 차이를 온톨로지가 어떻게 반영할 것인가? MASON의 Resource 계층에 라인/설비 인스턴스별 특성을 분리해야 한다.

### 8.3 문제 재정의 제안

원래 질문("이 시스템을 구현한다면 어떤 구조가 되는가")보다 더 적절할 수 있는 핵심 질문:

> **"KG의 초기 지식을 어떻게 빠르게 구축하고, 운영 중에 어떻게 지속적으로 보정할 것인가?"**

아키텍처 자체보다, KG의 **콜드 스타트(cold start) 문제**와 **지속적 학습(continuous learning)** 메커니즘이 이 시스템의 실제 성패를 결정할 가능성이 높다. FMEA 기반 LLM 추출(arXiv 2510.15428)이 콜드 스타트 해결의 유력한 접근이며, 이력 학습 에이전트가 지속적 학습을 담당하는 구조로 설계했다.

---

## 출처 목록

- arXiv 2510.15428 - "Fault Cause Identification across Manufacturing Lines through Ontology-guided LLM KG" (2025)
- PMC/12252116 - "Knowledge-Graph-Driven Fault Diagnosis Methods for Intelligent Production Lines" (2025)
- arXiv 2511.22975 - "An LLM-Assisted Multi-Agent Control Framework for Roll-to-Roll Manufacturing" (2025)
- PHM Society (phmsociety.org/4480) - "LLM-based multi-agent system for autonomous maintenance" (2025)
- arXiv 2406.01893 - "Large Language Model-Enabled Multi-Agent Manufacturing System" (2024)
- MongoDB Blog - "Multi-Agent Collaboration for Manufacturing Operations Optimization"
- MDPI Electronics 14(18)/3749 - "Industrial Process Automation Through ML and OPC UA" (2025)
- SEMI Technology Trends - "Smart Factory: AI-based Closed-Loop Feedback Control" (Binghamton Univ.)
- Fujitsu - "Next Generation Intelligent Manufacturing with Generative AI" (2025)
- ISA-88.01 - Batch Control Standard
- Siemens PCS 7 ISA-88 Implementation Guide (109784331)
- Copa-Data Batch Control White Paper
- OPC Foundation - Machine Vision Recipe Management Companion Specification
- MASON: Lemaignan et al., "MASON: A Proposal For An Ontology Of Manufacturing Domain" (2006)
- xcelore.com, dev.to, christianmendieta.ca - LangGraph vs CrewAI 비교 (2025-2026)
