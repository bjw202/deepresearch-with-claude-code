# 이종 제조 AI 시스템 통합 아키텍처

**날짜**: 2026-03-19
**문서 유형**: 통합 아키텍처 리서치 보고서
**역할**: Researcher — Integration Architecture
**선행 리서치**: `../2026-03-18-build123d-gear-system/02-integrated-architecture.md`, `../2026-03-18-gear-system/02-manufacturing-ontology.md`

---

## 목차

1. [기존 제조 참조 아키텍처 분석](#1-기존-제조-참조-아키텍처-분석)
2. ["뇌 레이어" 비유의 구체화](#2-뇌-레이어-비유의-구체화)
3. [시너지를 만드는 통합 패턴](#3-시너지를-만드는-통합-패턴)
4. [구체적 아키텍처 제안](#4-구체적-아키텍처-제안)
5. [시너지가 실제로 발생하는 시나리오](#5-시너지가-실제로-발생하는-시나리오)
6. [실현 장벽과 리스크](#6-실현-장벽과-리스크)
7. [참고문헌](#7-참고문헌)

---

## 1. 기존 제조 참조 아키텍처 분석

### 1.1 주요 참조 아키텍처 비교

| 아키텍처 | 주체 | 핵심 구조 | AI 통합 수준 | 한계 |
|----------|------|----------|-------------|------|
| **RAMI 4.0** | DIN/DKE (독일) | 3축 모델: 계층(ISA-95) × 수명주기(IEC 62890) × 레이어(자산~비즈니스) | 낮음 — AI를 명시적 레이어로 포함하지 않음 | 정적 계층 구조가 동적 AI 워크로드에 부적합. 클라우드/엣지 구분 없음 [1] |
| **ISA-95 (IEC 62264)** | ISA/ANSI | 5단계 계층: Level 0(물리) → Level 4(비즈니스) | 낮음 — 2025 개정판에서 메타데이터, 모듈형 배포 지원 추가 | "계층적 데이터 흐름"이 AI의 비선형 데이터 접근 패턴과 충돌. 데이터 사일로 유발 [2] |
| **IIRA** | IIC (미국) | 4개 뷰포인트: Functional, Information, Deployment, Operational. 5개 기능 도메인 | 중간 — 디지털 트윈, IT/OT 수렴 명시 (v1.10) | 제조 특화가 아닌 범산업 아키텍처. 구체적 AI 패턴 미정의 [3] |
| **NIST SMSD&A** | NIST | 4대 영역: 참조 아키텍처, 모델링 방법론, 데이터 분석, 성능 보증 | 중간 — 진단/예측 분석, 실시간 최적화 명시 | 연구 프레임워크 성격. 상업적 구현 가이드 부족 [4] |

### 1.2 기존 아키텍처의 공통 AI 통합 한계

**한계 1: 계층적 경직성.** ISA-95의 Level 0~4 구조는 "아래에서 위로" 데이터가 올라가고 "위에서 아래로" 명령이 내려오는 것을 전제한다. 그러나 AI 시스템은 설계 데이터(Level 4)와 센서 데이터(Level 0)를 동시에 참조해야 하며, 계층을 건너뛰는 비선형 데이터 접근이 필수적이다. ANSI/ISA-95.00.01-2025 개정판이 모듈형 배포와 메타데이터를 추가했으나, 근본적인 계층 모델 자체는 유지된다 [2].

**한계 2: 데이터 사일로.** RAMI 4.0의 레이어 모델(Asset, Integration, Communication, Information, Functional, Business)은 각 레이어가 독립적으로 정의되어 있어 레이어 간 시맨틱 통합이 어렵다. 설계 소프트웨어의 "모듈 2.5mm" 기어와 MES의 "Part #GR-001"이 같은 객체라는 매핑이 아키텍처 수준에서 정의되지 않는다 [1].

**한계 3: 피드백 루프 미반영.** ISA-95는 본질적으로 단방향 흐름(계획 → 실행 → 보고)이다. AI가 만들어내는 "실행 데이터 → 설계 자동 수정"이라는 역방향 피드백을 수용할 구조적 장치가 없다.

**한계 4: 실시간 요구.** RAMI 4.0은 수명주기 전체를 다루지만, 밀리초 단위 실시간 의사결정(공구 마모 → 절삭 조건 변경)을 위한 통신 패턴이 정의되지 않았다.

> **반증 탐색**: 이 한계들이 과장되었을 가능성이 있는가? ISA-95의 2025 개정판은 "네트워크 기반 구조로의 전환"을 명시하고 있으며, 실제로 많은 기업이 ISA-95 계층 위에 비공식적 "데이터 레이크" 레이어를 추가하여 AI를 운용하고 있다. 즉, 기존 아키텍처를 완전히 버리는 것이 아니라 **보완하는** 접근이 현실적이다. 반증 미발견: 기존 아키텍처만으로 이종 AI 시스템 간 시너지를 달성한 구체적 사례는 발견되지 않았다.

### 1.3 이 프로젝트에 대한 시사점

기존 참조 아키텍처는 **레거시 시스템과의 인터페이스 계층**으로 참고해야 하지만, AI 통합의 핵심 구조로는 부적합하다. 새로운 아키텍처는 ISA-95의 계층 개념을 참조하되, 비선형 데이터 접근, 양방향 피드백, 시맨틱 통합을 1급 시민(first-class citizen)으로 설계해야 한다.

---

## 2. "뇌 레이어" 비유의 구체화

### 2.1 인간 뇌의 3층 구조와 제조 AI 매핑

사용자의 비전인 "인간의 뇌가 여러 레이어로 나뉘어져 있지만 합쳐졌을 때 종합 지능이 되는 것"을 구체화한다. 뇌과학에서 Paul MacLean의 "삼위일체 뇌(Triune Brain)" 모델은 단순화된 비유이지만, 제조 AI 아키텍처의 레이어 설계에 유용한 프레임을 제공한다 [5][6].

```
┌─────────────────────────────────────────────────────────┐
│        신피질 (Neocortex) — 설계 지능                       │
│   추론, 계획, 추상적 사고, 장기 최적화                       │
│   ← LLM 기반 설계 에이전트, 최적화, 시뮬레이션              │
├─────────────────────────────────────────────────────────┤
│        변연계 (Limbic System) — 공정 지능                   │
│   기억, 패턴 인식, 경험 기반 판단, 감정(=우선순위)           │
│   ← 온톨로지/KG, 공정 계획, 품질 예측, 지식 축적             │
├─────────────────────────────────────────────────────────┤
│        뇌간 (Brainstem) — 실행 지능                        │
│   반사, 자율 조절, 생존 반응, 항상성 유지                     │
│   ← PLC/CNC 제어, 실시간 센서 처리, 안전 인터록              │
└─────────────────────────────────────────────────────────┘
```

| 뇌 레이어 | 제조 AI 레이어 | 속도 | 인지 수준 | 데이터 종류 |
|-----------|-------------|------|---------|-----------|
| **뇌간** (Brainstem) | 실행 지능 | ms 단위 | 반사적 반응 | 센서 신호, 알람, 모터 명령 |
| **변연계** (Limbic) | 공정 지능 | 초~분 | 패턴 인식, 경험 기반 판단 | 공정 파라미터, 품질 데이터, 이력 |
| **신피질** (Neocortex) | 설계 지능 | 분~시간 | 추상적 추론, 창의적 설계 | CAD 모델, 시뮬레이션, 요구사항 |

### 2.2 레이어 간 통신: 신경 경로 ↔ 데이터 파이프라인

인간 뇌에서 레이어 간 통신은 **양방향**이며 **비동기적**이다:

- **상행 경로 (Bottom-Up)**: 뇌간 → 변연계 → 신피질. 감각 데이터가 점진적으로 추상화된다. 제조 AI에서는: 센서 데이터 → 공정 상태 추론 → 설계 개선 인사이트.
- **하행 경로 (Top-Down)**: 신피질 → 변연계 → 뇌간. 의식적 결정이 자율 반응을 조정한다. 제조 AI에서는: 설계 변경 → 공정 재계획 → 기계 파라미터 변경.
- **숏컷 (Shortcut)**: 뇌간의 반사 반응은 신피질을 우회한다 (뜨거운 것을 만지면 생각하기 전에 손을 뗌). 제조 AI에서는: 진동 임계치 초과 → 즉시 장비 정지 (설계 지능 미개입).
- **감정 기반 우선순위 (Limbic Override)**: 변연계가 신피질의 합리적 판단을 무시할 수 있다 (공포 반응). 제조 AI에서는: 품질 이상 패턴 감지 → 생산 일시 중단 (설계 최적화보다 품질 보전이 우선).

```
                    설계 지능 (신피질)
                    ┌─────────────┐
                    │ LLM 설계    │
                    │ 시뮬레이션   │
                    │ 최적화      │
                    └──┬───▲──────┘
           하행 경로 │   │ 상행 경로
        (설계변경)   │   │ (인사이트)
                    ┌──▼───┴──────┐
                    │ 공정 지능    │
                    │ (변연계)     │
                    │ 온톨로지/KG  │
                    │ 공정계획     │
                    │ 품질예측     │
                    └──┬───▲──────┘
           하행 경로 │   │ 상행 경로
      (파라미터변경) │   │ (센서데이터)
                    ┌──▼───┴──────┐
                    │ 실행 지능    │
                    │ (뇌간)      │
                    │ PLC/CNC     │
                    │ 센서/액추에이터│
                    └─────────────┘
                          ▲
                          │ 숏컷 (반사)
                    ┌─────┴───────┐
                    │ 안전 인터록  │
                    │ (설계지능   │
                    │  미개입)    │
                    └─────────────┘
```

### 2.3 비유의 유용한 지점과 한계

**유용한 지점:**

1. **레이어별 시간 척도 분리**: 뇌처럼, 제조 AI도 ms 반응(실행)과 시간 단위 추론(설계)이 공존해야 한다. 이를 단일 시스템으로 처리하면 ms 반응이 추론 지연에 의해 차단된다.
2. **양방향 피드백의 자연스러운 설명**: "현장 데이터가 설계를 개선한다"는 상행 경로, "설계 변경이 현장에 배포된다"는 하행 경로로 명쾌하게 설명된다.
3. **숏컷/우선순위의 정당화**: 안전 관련 이벤트는 상위 레이어를 우회해야 한다는 설계 원칙을 뇌의 반사 메커니즘으로 정당화할 수 있다.
4. **시너지의 정의**: 뇌간만으로는 의식이 없고, 신피질만으로는 생존 불가능하다. 합쳐져야 "지능"이 된다.

**한계 (과도한 확장 경계):**

1. **뇌는 범용, 제조 AI는 특수**: 뇌의 가소성(plasticity)을 제조 AI가 그대로 모방할 필요는 없다. 제조 도메인의 제약 조건은 하드코딩해야 한다 (온톨로지 = 본능).
2. **뇌의 병렬성 과대 해석 주의**: 뇌의 1000억 뉴런 병렬 처리를 소프트웨어로 재현하려는 시도는 비생산적이다. 레이어 비유는 유지하되, 구현은 이벤트 드리븐 아키텍처/에이전트 오케스트레이션 등 소프트웨어 패턴을 사용한다.
3. **"감정" 비유의 한계**: 변연계의 감정을 공정 지능에 매핑하는 것은 "경험 기반 우선순위 결정"까지만 유효하다. 공정 AI에 "두려움"이 필요하다는 주장은 비유의 과잉이다.
4. **학습 메커니즘의 차이**: 뇌는 시냅스 강화로 학습하지만, 제조 AI의 각 레이어는 서로 다른 학습 메커니즘을 사용한다 (지도학습, 강화학습, 규칙 갱신 등). 통합 학습 이론을 뇌에서 차용하려는 시도는 현 단계에서 무리이다.

---

## 3. 시너지를 만드는 통합 패턴

"시너지 = 1+1>2"의 정의에 따라, 단순 연결이 아니라 **통합으로 인해 새로운 능력이 생기는** 패턴만 다룬다.

### 3.1 온톨로지 기반 시맨틱 통합

**패턴**: 공통 어휘/지식 모델(온톨로지)을 통해 이종 시스템이 같은 언어를 사용하도록 만든다.

**구체적 구현**:
- MASON 기반 상위 온톨로지(Entity, Operation, Resource)를 도메인별로 확장 [7]
- OWL로 T-Box(스키마) 정의, SHACL로 S-Box(검증 규칙) 정의, Neo4j로 A-Box(인스턴스 데이터) 관리 [선행 리서치: 03-ontology-enhancement.md]
- OPC UA 정보 모델을 RDF 트리플로 변환하여 Knowledge Graph에 통합 (QOMOU 프레임워크) [8]
- Industrial Ontologies Foundries (IOF)의 코어 온톨로지를 기반으로 확장하여 상호운용성 확보 [9]

**시너지 발생점**: 설계 시스템의 "모듈 2.5mm 헬리컬 기어"와 실행 시스템의 "파트 #GR-001"이 온톨로지를 통해 같은 인스턴스로 인식될 때, "GR-001의 진동 데이터가 높다 → 해당 기어의 설계 파라미터를 조회 → 이너비/모듈 비율이 경계값"이라는 크로스-레이어 추론이 가능해진다. 이는 사일로 상태에서는 불가능한 능력이다.

**성숙도**: 연구~시제 (TRL 4-5). 온톨로지 구축은 검증되었으나, 실시간 크로스-시스템 시맨틱 통합은 제한적 사례만 존재.

**비용**: 온톨로지 초기 구축 3-6개월(전문가 2-3명). 유지보수가 지속적 비용. [인접 도메인: 의료 온톨로지(SNOMED-CT)의 유지보수 비용이 연간 수백만 달러이지만, 제조 도메인은 어휘 규모가 훨씬 작아 비교 시 주의 필요]

### 3.2 이벤트 드리븐 아키텍처 (EDA)

**패턴**: 현장 이벤트가 발생하면 관련 시스템이 비동기적으로 반응한다.

**구체적 구현**:
- Apache Kafka를 이벤트 백본으로 사용. 센서 데이터, 품질 이벤트, 설계 변경 이벤트를 토픽으로 분리 [10]
- Apache Flink로 실시간 스트림 처리: 센서 데이터 → 이상 탐지 → 이벤트 발행
- MQTT (OPC UA Pub/Sub) → Kafka → 각 AI 시스템의 이벤트 소비

```
[CNC 센서]  →  [MQTT/OPC UA]  →  [Kafka Broker]  →  [공정 지능: 이상 탐지]
                                      │
                                      ├──→  [설계 지능: DFM 피드백]
                                      ├──→  [실행 지능: 파라미터 조정]
                                      └──→  [KG 업데이트]
```

**시너지 발생점**: 공구 진동 이벤트 → 공정 지능이 마모 패턴 감지 → 실행 지능에 절삭 조건 변경 명령 → 동시에 설계 지능에 "해당 형상이 공구 수명을 단축시킴" 피드백. 이 세 반응이 밀리초 차이로 동시 발생하는 것은 EDA 없이는 불가능하다.

**성숙도**: 시제~양산 (TRL 6-7). Kafka 기반 제조 이벤트 처리는 산업적으로 검증됨 [10].

### 3.3 Agent 오케스트레이션 (Multi-Agent System)

**패턴**: 각 AI 시스템을 독립적 에이전트로 캡슐화하고, 오케스트레이터가 협업을 조율한다.

**구체적 구현**:
- 선행 리서치(02-integrated-architecture.md)에서 설계한 MCP 기반 멀티-에이전트 아키텍처를 확장
- 설계 에이전트 클러스터 (DIA, PMA, ORA, VA) + 공정 에이전트 클러스터 (MPA, OPA) + 실행 에이전트 (센서 모니터링, 파라미터 조정)
- MADA (arXiv:2603.11515) 패턴: MCP로 에이전트-도구 분리, JSON-RPC over stdio로 통신 표준화 [11]
- CA-MCP (arXiv:2601.18442): 공유 컨텍스트 스토어로 에이전트 간 중간 결과 공유, LLM 호출 수 감소 [12]

**시너지 발생점**: 개별 에이전트는 자기 도메인의 최적화만 수행하지만, 오케스트레이터가 "설계 에이전트의 DFM 분석 결과"와 "공정 에이전트의 실현 가능성 평가"를 결합하여 양쪽 모두를 만족시키는 절충안을 도출한다. 이는 두 시스템이 독립적으로 운영될 때는 발생할 수 없는 조정 능력이다.

**성숙도**: 연구~시제 (TRL 3-5). 제조 MAS 연구는 풍부하나, LLM 기반 오케스트레이션은 2024-2025에 급격히 발전 중. 한 글로벌 제조사는 47개 시설에 MAS를 배포하여 장비 다운타임 42% 감소, 유지보수 비용 31% 감소, ROI 312%를 달성했다고 보고 [13]. (이 수치는 단일 벤더 마케팅 자료에서 출처. 독립 검증 미확인. 실제 ROI는 시설 규모, 기존 자동화 수준에 크게 의존.)

### 3.4 Closed-Loop Feedback

**패턴**: 설계 → 공정 → 실행 → 데이터 → 설계 순환으로, 시스템이 스스로 개선된다.

**구체적 구현**:
- 선행 리서치의 5단계 피드백 루프 확장:
  1. 설계 의도 → 파라메트릭 모델링 → 온톨로지 검증 → 코드 실행 → 형상 검증 (설계 내부 루프)
  2. 기어 파라미터 → 공정 계획 → DFM 검증 → 재설계 (설계-공정 루프)
  3. 현장 가공 → 실측 데이터 → KG 업데이트 → 설계 규칙 갱신 (실행-설계 루프)
- AI 기반 DFM: 역사적 결함 데이터로 학습한 AI가 설계 단계에서 제조 리스크를 사전 경고 [14]
  - 사례: AI 시각 검사와 MES 통합 시 불량 유출(defect escape) 40% 감소, 초도 수율(first-pass yield) 향상 (Quality Magazine, 2025.3) [14]

**시너지 발생점**: 루프가 닫힐 때 "지식 축적"이 발생한다. 100번째 기어를 가공할 때의 시스템은 1번째 기어를 가공할 때보다 (a) 더 정확한 공구 수명 예측, (b) 더 적절한 절삭 조건, (c) 더 현실적인 DFM 규칙을 보유한다. 이 누적 학습은 루프가 닫히지 않으면 발생하지 않는다.

**성숙도**: 설계-공정 루프는 시제 (TRL 5), 실행-설계 루프는 연구~시제 (TRL 3-4). 완전 자동 클로즈드 루프는 양산 사례 극히 제한적.

### 3.5 Digital Thread / Digital Twin

**패턴**: 제품 수명주기 전체를 관통하는 연속적 데이터 연결(Thread)과 동적 가상 복제(Twin).

**구체적 구현**:
- Digital Thread: CAD(build123d STEP) → PLM → MES → CMM 측정 결과가 하나의 데이터 스레드로 연결. JSON-LD 기반 인스턴스 ID로 추적성 확보 [15]
- Digital Twin: 설계 DT(CAD/CAE) + 제조 DT(CAM/CNC 시뮬레이션) + 운용 DT(실시간 센서) [16]
- 온톨로지 중재 레이어(Ontology Mediation Layer)가 세 가지 Twin을 통합 [선행 리서치: 03-ontology-enhancement.md §7]

**시너지 발생점**: Digital Thread가 없으면 "설계 → 가공 → 측정" 각 단계의 데이터가 단절된다. Thread가 있으면: (a) 측정 편차를 설계 원인까지 역추적, (b) 설계 변경이 하류 공정에 자동 전파, (c) 현장 데이터가 설계 Twin을 업데이트하여 시뮬레이션 정확도 향상.

**성숙도**: 양산 (TRL 7-8). Autodesk, Siemens 등이 Digital Thread 플랫폼을 상용화. 다만, AI가 Thread를 능동적으로 활용하는 수준은 TRL 4-5.

---

## 4. 구체적 아키텍처 제안

### 4.1 전체 구조: 3 레이어 + 2 횡단 요소

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  ┌──────────────────── 횡단 요소 1: 온톨로지 허브 ─────────────┐  │
│  │  MASON 확장 OWL + SHACL + Neo4j KG                        │  │
│  │  (시맨틱 통합, 검증, 지식 축적)                               │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐    │
│  │           Layer 3: 설계 지능 (Neocortex)                  │    │
│  │  ┌─────────┐ ┌──────────┐ ┌───────────┐ ┌────────────┐  │    │
│  │  │ Design  │ │Parametric│ │ Optimiza- │ │Verification│  │    │
│  │  │ Intent  │ │ Modeling │ │ tion      │ │ (VLM)      │  │    │
│  │  │ Agent   │ │ Agent    │ │ Agent     │ │ Agent      │  │    │
│  │  └─────────┘ └──────────┘ └───────────┘ └────────────┘  │    │
│  │  입력: 자연어, 이미지, 요구사항                              │    │
│  │  출력: STEP/STL, JSON-LD DesignRequirement                │    │
│  │  도구: build123d, DEAP/scipy, Claude Vision               │    │
│  │  응답시간: 분~시간                                          │    │
│  └──────────────────────────────────────────────────────────┘    │
│        ▲ 인사이트          │ 설계변경                             │
│        │ (상행경로)         ▼ (하행경로)                           │
│  ┌──────────────────────────────────────────────────────────┐    │
│  │           Layer 2: 공정 지능 (Limbic System)               │    │
│  │  ┌──────────┐ ┌──────────┐ ┌───────────┐ ┌───────────┐  │    │
│  │  │ Process  │ │  Tool    │ │ Quality   │ │ DFM       │  │    │
│  │  │ Planning │ │ Selection│ │ Prediction│ │ Validation│  │    │
│  │  │ Agent    │ │ Agent    │ │ Agent     │ │ Agent     │  │    │
│  │  └──────────┘ └──────────┘ └───────────┘ └───────────┘  │    │
│  │  입력: 기어 파라미터, 소재, 품질 등급                        │    │
│  │  출력: ProcessPlan JSON-LD, 공구 목록, 품질 예측              │    │
│  │  도구: KG 쿼리, RAG(핸드북), ARKNESS                       │    │
│  │  응답시간: 초~분                                             │    │
│  └──────────────────────────────────────────────────────────┘    │
│        ▲ 센서데이터         │ 파라미터변경                         │
│        │ (상행경로)         ▼ (하행경로)                           │
│  ┌──────────────────────────────────────────────────────────┐    │
│  │           Layer 1: 실행 지능 (Brainstem)                   │    │
│  │  ┌──────────┐ ┌──────────┐ ┌───────────┐ ┌───────────┐  │    │
│  │  │ Sensor   │ │ Adaptive │ │ Safety    │ │ Data      │  │    │
│  │  │ Monitor  │ │ Control  │ │ Interlock │ │ Collector │  │    │
│  │  │          │ │          │ │ (숏컷)    │ │           │  │    │
│  │  └──────────┘ └──────────┘ └───────────┘ └───────────┘  │    │
│  │  입력: 센서 신호(진동, 온도, 전류, 음향)                     │    │
│  │  출력: 이벤트 스트림, 제어 명령, 측정 데이터                   │    │
│  │  도구: PLC, CNC 컨트롤러, Edge AI                          │    │
│  │  응답시간: ms~초                                             │    │
│  └──────────────────────────────────────────────────────────┘    │
│                                                                 │
│  ┌──────────────────── 횡단 요소 2: 데이터 파이프라인 ──────────┐  │
│  │  Kafka (이벤트 스트림) + MQTT/OPC UA (현장) + REST/gRPC     │  │
│  │  (레이어 간 통신, 이벤트 라우팅, 데이터 변환)                  │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 4.2 각 레이어의 입력/출력 데이터 포맷

| 레이어 | 입력 포맷 | 출력 포맷 | 내부 표현 |
|--------|---------|---------|----------|
| **설계 지능** | 자연어/이미지 → JSON-LD `DesignRequirement` | STEP AP242, JSON-LD `DesignSpec`, build123d Python 코드 | RDF 트리플 (온톨로지 인스턴스) |
| **공정 지능** | JSON-LD `DesignSpec` + 제조 제약 조건 | JSON-LD `ProcessPlan`, 공구 목록, 절삭 조건 | Cypher/SPARQL 쿼리 결과 + KG 서브그래프 |
| **실행 지능** | JSON-LD `ProcessPlan` + 센서 스트림 | Kafka 이벤트 (JSON), G-code/OPC UA 명령, CMM 측정 JSON | 시계열 데이터 (InfluxDB/TimescaleDB) |
| **온톨로지 허브** | RDF 트리플, JSON-LD 인스턴스 | SHACL ValidationReport, SPARQL 결과셋, 추론된 트리플 | OWL + Neo4j Property Graph |
| **데이터 파이프라인** | 모든 레이어의 이벤트/메시지 | 변환·라우팅된 메시지 | Kafka Topic (Avro/JSON Schema) |

### 4.3 레이어 간 인터페이스 설계

**설계 ↔ 공정 인터페이스**:
- 프로토콜: MCP (JSON-RPC over stdio). 선행 리서치의 `process_plan`, `tool_select` 도구 활용
- 데이터: JSON-LD `DesignSpec` → 공정 지능이 `ProcessPlan` 반환
- 동기/비동기: 동기 (설계 워크플로우 내)
- 피드백: DFM 위반 시 `DFMViolationReport` JSON-LD 반환 → 설계 에이전트가 파라미터 수정

**공정 ↔ 실행 인터페이스**:
- 프로토콜: Kafka + OPC UA
- 데이터: `ProcessPlan` → G-code 변환기 → CNC 컨트롤러. 센서 데이터 → Kafka 이벤트 → 공정 지능
- 동기/비동기: 비동기 (이벤트 드리븐)
- 피드백: 실시간 품질 이벤트 → 공정 파라미터 자동 조정

**설계 ↔ 실행 인터페이스 (숏컷)**:
- 프로토콜: Kafka (비정상 상황에서만 활성화)
- 데이터: 중대 품질 편차 이벤트 → 설계 지능에 직접 통보
- 동기/비동기: 비동기
- 트리거: 실측값이 설계 공차의 80% 초과 시

**온톨로지 허브 ↔ 모든 레이어**:
- 프로토콜: MCP (온톨로지 서버)
- 도구: `ontology_query`, `ontology_validate`, `kg_search`
- 설계 지능: 파라미터 검증, 유사 설계 검색
- 공정 지능: 공정-소재-공구 매칭 쿼리, 품질 등급 달성 가능성 추론
- 실행 지능: 측정 데이터 → KG 인스턴스 업데이트, 공구 수명 실측값 기록

### 4.4 MVP → 풀 비전 단계별 구현 전략

#### Phase 1: MVP — 단일 도메인 클로즈드 루프 (3-4개월)

**범위**: 기어 설계 → 공정 계획 → DFM 검증의 설계-공정 루프만 구현.

| 구성 요소 | 구현 내용 | 기술 스택 |
|-----------|---------|----------|
| 설계 지능 | DIA + PMA + VA (기존 02-integrated-architecture.md) | Claude + build123d + MCP |
| 공정 지능 | MPA + 기본 공구 추천 | KG (Neo4j) + SPARQL + RAG |
| 온톨로지 허브 | MASON 기어 확장 OWL + SHACL 기본 검증 | Owlready2 + pyshacl + Neo4j |
| 데이터 파이프라인 | 단순 JSON 파일 교환 (Kafka 미사용) | JSON-LD + 파일 시스템 |

**성공 기준**: "자연어 → 검증된 기어 STEP + 공정 계획"이 end-to-end 동작. SHACL 위반 시 자동 재설계.

**기존 자산 위치**:
- build123d 기어 모델링: `../2026-03-18-build123d-gear-system/01-build123d-gear-modeling.md`
- MASON 온톨로지 확장: `../2026-03-18-build123d-gear-system/03-ontology-enhancement.md`
- MCP 서버 설계: `../2026-03-18-build123d-gear-system/02-integrated-architecture.md` §3
- 기어 공정 체인: `../2026-03-18-gear-system/04-gear-manufacturing-process-chain.md`

#### Phase 2: 이벤트 통합 — 실행 레이어 연결 (3-4개월)

| 구성 요소 | 추가 내용 | 기술 스택 |
|-----------|---------|----------|
| 실행 지능 | 센서 데이터 시뮬레이터 + 이벤트 발행 | Python 시뮬레이터 + Kafka |
| 데이터 파이프라인 | Kafka 도입, 이벤트 토픽 설계 | Apache Kafka + Schema Registry |
| 공정 지능 | 품질 예측 모델 (기본 ML) + 실시간 이벤트 소비 | scikit-learn + Kafka Consumer |
| 온톨로지 허브 | 실측 데이터 → KG 자동 업데이트 | Python ETL + Neo4j |

**성공 기준**: 시뮬레이션된 센서 이벤트 → 공정 파라미터 자동 조정 → KG 업데이트 → 설계 규칙 갱신 루프 동작.

#### Phase 3: 풀 비전 — 자율 클로즈드 루프 (6-12개월)

| 구성 요소 | 최종 내용 | 기술 스택 |
|-----------|---------|----------|
| 설계 지능 | 멀티모달 입력 (이미지/도면), 최적화 에이전트 강화 | CAD-MLLM 패턴, DEAP |
| 공정 지능 | ARKNESS 기반 자동 KG 구축, 고급 품질 예측 | ARKNESS + LLM 트리플 추출 |
| 실행 지능 | 실제 CNC/센서 연결, Edge AI | OPC UA + Edge Device |
| Digital Twin | 설계 DT + 제조 DT 통합 | 시뮬레이션 엔진 연동 |
| 데이터 파이프라인 | Digital Thread 완성 | Kafka + 추적성 ID 체계 |

**성공 기준**: 현장 불량 데이터 → 설계 자동 수정까지 인간 개입 최소화. 100번째 가공이 1번째보다 측정 가능하게 나은 품질/비용.

### 4.5 기존 리서치 자산의 위치

| 자산 | 현재 위치 | 아키텍처 내 역할 |
|------|---------|---------------|
| build123d 기어 모델링 | `../2026-03-18-build123d-gear-system/01-*` | 설계 지능 - PMA의 코어 엔진 |
| MASON 기어 온톨로지 | `../2026-03-18-build123d-gear-system/03-*` | 온톨로지 허브 - T-Box/S-Box |
| MCP 서버 설계 | `../2026-03-18-build123d-gear-system/02-*` | 레이어 간 인터페이스 프로토콜 |
| LLM+CAD/CAM 통합 | `../2026-03-18-gear-system/03-*` | 설계 지능 - DIA/PMA 구현 참조 |
| 기어 공정 체인 | `../2026-03-18-gear-system/04-*` | 공정 지능 - MPA의 KG 초기 데이터 |
| 기어 제조 온톨로지 | `../2026-03-18-gear-system/02-*` | 온톨로지 허브 - 도메인 지식 기반 |

---

## 5. 시너지가 실제로 발생하는 시나리오

### 5.1 시나리오 1: 현장 불량 데이터 → 설계 자동 수정 (Closed-Loop DFM)

**배경**: SCM420 소재, 모듈 2.5mm, 잇수 35, AGMA Q11 목표의 헬리컬 기어 생산 라인.

**이벤트 흐름**:

```
1. [실행 지능] CMM 측정 결과: 치형 프로파일 편차가 공차의 85% 도달
   → Kafka 이벤트: {type: "quality_drift", part_id: "GR-035",
      deviation_ratio: 0.85, parameter: "profile_tolerance"}

2. [공정 지능] 이벤트 수신 → KG 조회:
   - GR-035의 공정 이력: Hobbing → 침탄 → Generating Grinding
   - 최근 50개 부품의 프로파일 편차 트렌드: 0.72 → 0.78 → 0.85 (상승 추세)
   - 원인 추론: 연삭휠 마모 진행 + 열처리 후 변형 누적
   → Kafka 이벤트: {type: "quality_risk", root_cause: "grinding_wheel_wear",
      confidence: 0.78, recommended_action: "wheel_dress_or_replace"}

3. [실행 지능] 즉시 대응: 연삭휠 드레싱 스케줄 앞당김
   → 단기 조치로 편차 0.85 → 0.75 복귀

4. [공정 지능] 장기 분석: "이 기어의 비틀림각 15°와 이너비 25mm 조합에서
    열처리 변형이 예상보다 크다" → KG에 기록:
    (HelicalGear, hasHelixAngle, 15) + (FaceWidth, 25) → heat_distortion_risk: HIGH

5. [설계 지능] 피드백 수신 → SHACL Shape 자동 갱신:
   "비틀림각 15° + 이너비/모듈 비율 10 이상 → 열처리 변형 경고"
   → 다음 유사 기어 설계 시 이너비 축소 또는 전위계수 적용 제안
```

**"통합이 없으면 불가능했을 것"**: CMM 데이터(실행)가 설계 규칙(설계)을 수정하려면, 양쪽이 같은 기어 인스턴스를 인식하고(온톨로지), 이벤트가 전파되며(Kafka), 장기 트렌드가 축적되어야(KG) 한다. 사일로 상태에서는 "품질이 나빠지고 있다"는 것은 알 수 있지만, "어떤 설계 파라미터를 바꿔야 하는가"까지 자동으로 도달할 수 없다.

**관련 수치**: Closed-loop AI 시스템은 실시간 공정 조정으로 응답 시간을 45초로 단축하고 잠재 결함의 78%를 예방한 사례가 보고되었다 [17]. (이 수치의 원출처는 특정 AI 벤더의 구현 사례. 제품 유형, 공정 복잡도에 따라 크게 달라질 수 있으며, 기어 도메인에 직접 적용 시 검증 필요.)

### 5.2 시나리오 2: 설계 변경 → 공정 자동 재계획 → 현장 자동 배포

**배경**: 고객이 기어 모듈을 2.5mm → 3.0mm로 변경 요청.

**이벤트 흐름**:

```
1. [설계 지능] 사용자 입력: "모듈을 3.0으로 변경"
   → DIA가 DesignRequirement 업데이트: module: 2.5 → 3.0
   → ORA가 온톨로지 검증: 잇수 35 + 모듈 3.0 → 피치원 105mm (기존 90mm 대비 17% 증가)
   → 제약 검사: 최대 중심거리 120mm 내 → 통과
   → PMA가 build123d로 새 모델 생성 → VA가 형상 검증

2. [공정 지능] 설계 변경 이벤트 수신:
   → KG 쿼리: "모듈 3.0에 적합한 호브?"
   → 결과: 기존 M2.5 호브 → M3.0 호브로 교체 필요
   → 절삭 조건 재계산: 절삭 속도 80m/min → 70m/min (모듈 증가에 따른 절삭력 증가)
   → 열처리: 침탄 깊이 0.8mm → 1.0mm (피치원 증가에 비례)
   → 연삭: 동일 연삭휠, 연삭 시간 12min → 15min
   → 새 ProcessPlan JSON-LD 생성

3. [실행 지능] 새 ProcessPlan 수신:
   → G-code 재생성 (CAM 후처리)
   → 공구 매거진 확인: M3.0 호브 재고 있음
   → 스케줄러에 반영: 공구 교체 시간 15분 추가
   → 작업자 알림: "다음 배치부터 M3.0 호브 장착"

4. [온톨로지 허브] 전체 변경 이력 기록:
   → Digital Thread: DesignSpec v2 → ProcessPlan v2 → G-code v2
   → 추적성: "이 변경은 고객 요청 CR-2026-042에 의함"
```

**"통합이 없으면 불가능했을 것"**: 모듈 변경이 호브 교체, 절삭 조건, 열처리, 연삭 시간, 스케줄링에 연쇄 영향을 미친다. 사일로 상태에서는 설계 팀이 변경 → 공정 팀에 이메일 → 공정 팀이 수동으로 재계획 → 현장에 구두 전달. 이 과정에서 1-2주가 소요되고 커뮤니케이션 오류가 발생한다. 통합 시스템은 이를 분 단위로 자동 처리한다.

### 5.3 시나리오 3: 공구 마모 예측 → 절삭 조건 자동 조정 → 품질 유지

**배경**: 호빙 공정에서 HSS-PM TiAlN 호브 사용. 기대 수명 800피스.

**이벤트 흐름**:

```
1. [실행 지능] 500번째 피스 가공 중:
   - 스핀들 전류: 12.3A → 13.1A (정상 범위 내, 상승 추세)
   - 진동 RMS: 2.1mm/s → 2.8mm/s (경고 임계값 3.5mm/s)
   - 음향 방출: 패턴 변화 감지 (AI 분류: "정상 마모 진행")
   → Kafka 이벤트: {type: "tool_wear_progressing", tool_id: "HOB-M25-017",
      estimated_remaining_life: 250pcs, confidence: 0.82}

2. [공정 지능] 이벤트 수신 → 의사결정:
   - KG 조회: HOB-M25-017의 과거 패턴 — 유사 조건에서 평균 수명 780피스
   - 예측 모델: 현재 마모율이면 700피스에서 품질 임계값 도달
   - 결정: 절삭 속도를 80 → 72 m/min으로 10% 감속 (공구 수명 연장 + 품질 유지)
   → Kafka 이벤트: {type: "cutting_condition_adjust",
      speed_change: -10%, reason: "tool_life_extension"}

3. [실행 지능] 절삭 조건 변경 적용:
   - CNC에 새 절삭 속도 전달 (OPC UA Write)
   - 사이클 타임 8min → 8.8min (10% 증가)
   → 스케줄러 자동 업데이트

4. [공정 지능] 700번째 피스 도달:
   - 공구 교체 명령 발행
   - KG 업데이트: HOB-M25-017 실제 수명 700피스 (절삭 조건 조정 포함)
   → 이 데이터가 다음 공구 수명 예측 모델을 개선

5. [설계 지능] 장기 분석 (배치 주기):
   - "모듈 2.5mm + SCM420에서 호브 수명이 기대값 대비 12.5% 짧다"
   - 원인 분석: 소재 경도 편차 or 기어 형상의 절삭력 집중
   - 제안: "다음 유사 설계 시 호브 선정 기준에 마모 마진 15% 추가"
```

**"통합이 없으면 불가능했을 것"**: 공구 마모 예측(실행)이 절삭 조건 자동 조정(실행-공정)과 설계 규칙 갱신(설계)까지 연결되려면, 세 레이어가 같은 공구와 기어 인스턴스를 인식하고 데이터가 양방향으로 흘러야 한다. 독립 운영 시: 작업자가 경험적으로 속도를 낮추거나 공구 교체 시점을 놓쳐 불량 발생.

**관련 수치**: AI 기반 CNC 공구 마모 예측 시스템은 스핀들 토크, 진동, 열 데이터를 결합하여 파단 전 공구 파손을 예측한다 [18]. Digital Twin과 결합 시 실시간 최적화 루프가 가능하다고 보고됨 [18]. (정량적 개선 수치는 공구 유형, 소재, 가공 조건에 크게 의존하여 일반화 어려움.)

---

## 6. 실현 장벽과 리스크

### 6.1 기술적 장벽

| 장벽 | 심각도 | 구체적 문제 | 완화 전략 |
|------|-------|-----------|----------|
| **데이터 사일로** | 높음 | 설계(CAD) ↔ 생산(MES) ↔ 품질(QMS)이 서로 다른 DB, 스키마, 벤더. 데이터 품질이 AI 실패의 핵심 원인이며, Gartner는 2025년까지 GenAI 프로젝트의 50% 이상이 데이터 품질 문제로 파일럿 단계에서 중단될 것으로 예측 [19] | 온톨로지 중재 레이어로 시맨틱 매핑. MVP에서는 수동 매핑, Phase 3에서 자동화 |
| **레거시 시스템 통합** | 높음 | 10-20년 된 CNC, PLC가 OPC UA 미지원. 프로토콜 변환 필요 | OPC UA 게이트웨이 + Kafka 어댑터. 레거시 장비는 파일 기반 인터페이스(G-code, CSV) |
| **온톨로지 구축/유지보수** | 중간 | 도메인 전문가 + 온톨로지 엔지니어 협업 필요. 초기 3-6개월. 지속적 유지보수 비용 | ARKNESS 패턴으로 반자동 KG 구축. SHACL로 데이터 품질 자동 검증 |
| **실시간 요구** | 중간 | 센서 → AI 추론 → 제어 명령 경로의 지연. Kafka 기본 지연 수 ms이지만 AI 추론이 병목 | Edge AI로 실행 레이어의 반사적 반응 분리. 복잡한 추론은 비동기 처리 |

### 6.2 AI 모델 간 신뢰도 전파

이것은 통합 아키텍처 고유의 리스크이다. 한 레이어의 AI 모델이 불확실한 결과를 내놓았을 때, 다른 레이어가 이를 확정적 사실로 취급하면 오류가 증폭된다.

**예시**: 공구 마모 예측 모델(실행)의 신뢰도가 0.6일 때, 공정 지능이 이를 기반으로 절삭 조건을 변경하면, 불필요한 감속으로 생산성이 저하되거나 필요한 조치를 놓칠 수 있다.

**완화 전략**:
1. 모든 레이어 간 메시지에 `confidence` 필드 필수 포함
2. 수신 레이어는 confidence 임계값 미달 시 인간 에스컬레이션
3. 온톨로지 검증(SHACL)이 최종 게이트키퍼 역할
4. 누적 불확실성 추적: A 레이어(conf=0.8) → B 레이어(conf=0.9) → 결합 신뢰도 ≤ 0.72

### 6.3 조직적 장벽

| 장벽 | 설명 | 완화 전략 |
|------|------|----------|
| **설계팀 vs 제조팀 vs IT팀** | 각 팀이 다른 KPI, 도구, 언어를 사용. 통합 프로젝트의 소유권 모호 | 교차 기능 팀 구성. 온톨로지를 "공통 언어"로 활용하여 의사소통 |
| **변경 저항** | "기존 방식으로도 잘 되고 있다". 특히 숙련 작업자의 경험 기반 의사결정이 AI로 대체되는 것에 대한 저항 | Human-in-the-loop 설계. AI는 "제안"하고 인간이 "승인". 시간이 지나면서 신뢰 축적 |
| **ROI 불확실성** | 통합 비용(온톨로지 구축, 시스템 연결, 조직 변경)이 이점보다 클 수 있음 | MVP로 빠르게 가치 증명. 정량 지표(불량률, 리드타임, 공구 비용) 사전 정의 |

### 6.4 통합 복잡도가 이점을 초과할 수 있는 경우 (반증)

**통합이 항상 답은 아니다.** 다음 조건에서는 개별 시스템 운영이 더 나을 수 있다:

1. **단품/소량 생산**: 피드백 루프가 닫히기 전에 생산이 끝남. 지식 축적의 이점이 미미.
2. **단순 공정**: 선삭 → 밀링처럼 2-3 공정의 단순 파트. 설계-공정 간 상호작용이 적어 통합의 추가 가치가 낮음.
3. **레거시 의존도가 극히 높은 환경**: 30년 된 장비만 있는 공장. 게이트웨이/어댑터 비용이 새 장비 도입 비용에 근접.
4. **조직 준비도 부족**: IT 팀이 없거나, 데이터 문화가 형성되지 않은 중소기업.

> **의사결정 가이드**: 통합 투자가 정당화되려면, (a) 반복 생산 (연간 1,000+ 동종 파트), (b) 3개 이상 공정의 복잡한 공정 체인, (c) 품질 요구가 높은 제품 (AGMA Q10+), (d) 설계-제조 피드백이 빈번한 제품군 중 최소 2개 이상을 충족해야 한다.

### 6.5 리스크 매트릭스

| 리스크 | 발생 확률 | 영향도 | 대응 전략 |
|--------|----------|--------|----------|
| 온톨로지 불완전 → 잘못된 추론 | 높음 | 높음 | SHACL 검증 + 인간 검토 병행. 추론 결과에 항상 confidence 부여 |
| AI 추천 절삭 조건 → 공구 파손 | 낮음 | 매우 높음 | 안전 인터록(숏컷)이 최종 방어선. AI 추천은 안전 범위 내로 제한 |
| 통합 복잡도 → 프로젝트 지연 | 높음 | 중간 | MVP 우선. Phase별 독립 가치 창출 |
| 데이터 품질 → 학습 오류 축적 | 중간 | 높음 | 데이터 품질 모니터링 대시보드. 이상 데이터 자동 격리 |
| 조직 저항 → 도입 실패 | 중간 | 높음 | 점진적 도입. 기존 워크플로우 보완으로 시작 |

---

## 7. 참고문헌

[1] RAMI 4.0 - Reference Architecture Model for Industry 4.0. ISA InTech, 2019. https://www.isa.org/intech-home/2019/march-april/features/rami-4-0-reference-architectural-model-for-industr

[2] ISA-95 & America's Digital Manufacturing Transformation. Bowdark, 2025. https://www.bowdark.com/blog/isa95-and-americas-digital-manufacturing-transformation

[3] The Industrial Internet Reference Architecture (IIRA) v1.10. Industry IoT Consortium. https://www.iiconsortium.org/iira/

[4] NIST Smart Manufacturing Systems Design and Analysis Program. https://www.nist.gov/programs-projects/smart-manufacturing-systems-design-and-analysis-program

[5] Brain-Inspired AI Agent Architecture. EmergentMind, 2025. https://www.emergentmind.com/topics/brain-inspired-ai-agent-architecture

[6] A brain-inspired agentic architecture to improve planning with LLMs. Nature Communications, 2025. https://www.nature.com/articles/s41467-025-63804-5

[7] A review and classification of manufacturing ontologies. Sapel et al., Journal of Intelligent Manufacturing, 2024. https://link.springer.com/article/10.1007/s10845-024-02425-z

[8] Integration of OPC UA information models into Enterprise Knowledge Graphs. Journal of Machine Engineering, 2022. https://yadda.icm.edu.pl/baztech/element/bwmeta1.element.baztech-6cb5b228-7ea7-4534-b35f-f3efe93370bb

[9] Ontology-Based Semantic Reasoning for Multi-Source Heterogeneous Industrial Devices Using OPC UA. IEEE Xplore, 2025. https://ieeexplore.ieee.org/iel8/6488907/6702522/10960452.pdf

[10] How Apache Kafka and Flink Power Event-Driven Agentic AI in Real Time. Kai Waehner, 2025. https://www.kai-waehner.de/blog/2025/04/14/how-apache-kafka-and-flink-power-event-driven-agentic-ai-in-real-time/

[11] MADA: Multi-Agent Collaboration for Automated Design Exploration on HPC. arXiv:2603.11515, 2026. https://arxiv.org/abs/2603.11515

[12] CA-MCP: Enhancing Model Context Protocol with Context-Aware Shared Context Store. arXiv:2601.18442, 2026. https://arxiv.org/abs/2601.18442

[13] Multi-Agent System: Top Industrial Applications in 2025. XCube Labs. https://www.xcubelabs.com/blog/multi-agent-system-top-industrial-applications-in-2025/ [주의: 벤더 마케팅 자료. 독립 검증 미확인]

[14] AI Visual Inspection Feedback Loops: Closing the Design-to-Quality Gap. The Mantix Method, 2025. https://www.themantixmethod.com/2025/10/ai-visual-inspection-feedback-loops.html

[15] Digital Thread vs. Digital Twin in Manufacturing. Tristar Solutions. https://www.tristar.com/blog/digital-thread-vs-digital-twin/

[16] Closed-Loop Manufacturing with AI-Enabled Digital Twin Systems. ResearchGate, 2025. https://www.researchgate.net/publication/388524086_Closed-Loop_Manufacturing_with_AI-Enabled_Digital_Twin_Systems

[17] Closed-Loop Manufacturing with AI-Enabled Digital Twin Systems. Cognizance Journal, Vol 5. https://cognizancejournal.com/vol5issue1/V5I104.pdf

[18] AI-enabled tool wear detection is transforming CNC milling and rapid manufacturing. Robotics and Automation News, 2025. https://roboticsandautomationnews.com/2025/06/17/ai-driven-tool-wear-detection-in-precision-milling/92189/

[19] The AI Implementation Paradox: Why 42% of Enterprise Projects Fail Despite Record Adoption. Medium, 2025. https://medium.com/@stahl950/the-ai-implementation-paradox-why-42-of-enterprise-projects-fail-despite-record-adoption-107a62c6784a

[20] Transforming Manufacturing with the Help of Ontologies. Microsoft Tech Community, 2024. https://techcommunity.microsoft.com/blog/iotblog/transforming-manufacturing-with-the-help-of-ontologies/4083555

[21] DIPy-AI: Brain-Cognition-Inspired DIKW Pyramid-Based Agile AI Architecture for Industrial Sensor Data Assimilation. Springer, 2024. https://link.springer.com/chapter/10.1007/978-3-031-50381-8_64

[22] Ontology-based knowledge representation of industrial production workflow. ScienceDirect, 2023. https://www.sciencedirect.com/science/article/pii/S1474034623003130

[23] A review of reference architectures for digital manufacturing. ScienceDirect, 2023. https://www.sciencedirect.com/science/article/pii/S0166361523000738

[24] NIST Reference Architecture for Smart Manufacturing Part 1: Functional Models. https://nvlpubs.nist.gov/nistpubs/ams/NIST.AMS.300-1.pdf

[25] The Complete Guide to Agentic AI in Industrial Operations. XMPRO, 2025. https://xmpro.com/the-complete-guide-to-agentic-ai-in-industrial-operations-how-ai-agents-are-transforming-manufacturing-mining-and-asset-intensive-industries-in-2025/
