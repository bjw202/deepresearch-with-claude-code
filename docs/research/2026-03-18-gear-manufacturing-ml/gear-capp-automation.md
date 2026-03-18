# 기어 가공 CAPP 자동화, 공구 선정, 공정 최적화: 현황과 AI/LLM 적용 가능성

**작성일**: 2026-03-18
**검색 도구**: Perplexity sonar-pro (5건), Tavily advanced search (4건)
**기존 리서치 참조**: `docs/research/2026-03-18-gear-system/` 시리즈

---

## 목차

1. [기어 가공 공정 종류](#1-기어-가공-공정-종류)
2. [전통적 CAPP 시스템의 구조와 한계](#2-전통적-capp-시스템의-구조와-한계)
3. [AI/ML 기반 CAPP 연구 현황](#3-aiml-기반-capp-연구-현황)
4. [기어 가공 공구 선정 자동화](#4-기어-가공-공구-선정-자동화)
5. [절삭 조건 최적화 - 기어 특화](#5-절삭-조건-최적화---기어-특화)
6. [기어 품질 등급과 공정 선택의 관계](#6-기어-품질-등급과-공정-선택의-관계)
7. [상용 소프트웨어 현황](#7-상용-소프트웨어-현황)
8. [공정 시뮬레이션 및 검증 도구](#8-공정-시뮬레이션-및-검증-도구)
9. [Industry 4.0 / Smart Manufacturing 트렌드](#9-industry-40--smart-manufacturing-트렌드)
10. [LLM이 CAPP 시스템을 보완/대체할 수 있는 시나리오](#10-llm이-capp-시스템을-보완대체할-수-있는-시나리오)
11. [종합 분석 및 결론](#11-종합-분석-및-결론)

---

## 1. 기어 가공 공정 종류

### 1.1 주요 공정 비교

| 공정 | 원리 | 적용 기어 | 생산성 | 달성 품질 (ISO) | 특징 |
|------|------|----------|--------|----------------|------|
| **호빙 (Hobbing)** | 워크기어와 호브의 연속 창성 | 외부 스퍼/헬리컬 | 매우 높음 | 7-10 | 대량생산 표준 공정 |
| **셰이핑 (Shaping)** | 왕복 운동 기반 창성 | 내/외부, 숄더 기어 | 낮음 | 7-9 | 간섭 윤곽 가공 가능 |
| **브로칭 (Broaching)** | 다수 치가 순차적으로 절삭 | 내부 스플라인/기어 | 매우 높음 | 8-11 | 공구비 높음, 대량생산 전용 |
| **연삭 (Grinding)** | 연삭 휠로 경화 후 정삭 | 전 유형 (경화 후) | 낮음 | 3-7 | 최고 정밀도, 열처리 후 필수 |
| **파워 스카이빙** | 호빙+셰이핑 결합, 연속 절삭 | 내/외부, 복잡 형상 | 높음 (셰이핑 2-3배) | 5-8 | 1클램핑 황삭+정삭 |
| **셰이빙 (Shaving)** | 열처리 전 정삭 | 스퍼/헬리컬 | 중간 | 6-8 | 열처리 변형 전 품질 향상 |
| **호닝 (Honing)** | 내접 기어형 숫돌 | 경화 후 정삭 | 중간 | 5-7 | 연삭 대비 저비용 |

출처: [EMAG - Power Skiving](https://www.emag.com/industries-solutions/technologies/power-skiving/), [EMAG - Hobbing vs Skiving 비교](https://www.emag.com/blog/en/differences-between-hobbing-skiving-and-power-skiving/), [Sandvik Coromant - Gear Manufacturing](https://www.sandvik.coromant.com/en-us/knowledge/milling/gear-manufacturing)

### 1.2 파워 스카이빙의 부상

파워 스카이빙은 호빙과 셰이핑의 장점을 결합한 공정으로, 특히 내부 기어에서 혁신적이다.

- **셰이핑 대비 2-3배 생산성**, 공구 수명도 우수
- 1클램핑으로 황삭+정삭 가능 → 재클램핑 오차 제거
- e-모빌리티 트랜스미션 변화로 수요 급증
- Sandvik 전망: "파워 스카이빙이 셰이핑, 브로칭, 스플라인 롤링을 대체하고, 일부 호빙까지 대체할 것"

출처: [Sandvik Coromant](https://www.sandvik.coromant.com/en-us/knowledge/milling/gear-manufacturing), [EMAG](https://www.emag.com/industries-solutions/technologies/power-skiving/)

### 1.3 적층제조(3D 프린팅) + 후가공

금속 적층제조(AM)로 기어를 생산하는 시도가 확대되고 있으나, 아직 초기 단계이다.

**현황**:
- L-PBF (Laser Powder Bed Fusion)가 35.1% 시장 점유, SLM 기반 고밀도 기어 부품 생산
- as-printed 표면 조도 10-50 μm Ra → 기어 치면에 직접 적용 불가
- 후가공(CNC 정삭, 연삭)이 필수 → **하이브리드 제조** 트렌드

**하이브리드 제조 접근**:
- AM 조형 + CNC 밀링/연삭으로 기어 치면 정삭
- 미 육군 MELD 고상 적층 + 서브트랙티브 대형 기어/차체 부품 프로그램
- 금속 AM 장비 시장: 2024년 $53.8B → 2033년 $306.4B (CAGR 22%)

**한계**: 대량생산 검증 미완, 표면 품질 한계, 후가공 비용. 프로토타이핑, 수리, 소량 복잡 형상에 적합.

출처: [Grand View Research - Metal AM Market](https://www.grandviewresearch.com/industry-analysis/metal-additive-manufacturing-equipment-market-report), [SAE - Army AM Program](https://saemobilus.sae.org/papers/program-overview-extra-large-metal-additive-manufacturing-system-targeted-towards-army-ground-vehicle-systems-2024-01-3924)

### 1.4 공정 선택 결정 트리

```
기어 유형 판별
├── 외부 기어
│   ├── 대량 → 호빙 (표준)
│   ├── 소량/복잡 → 5축 CNC 밀링 또는 파워 스카이빙
│   └── 경화 후 정삭 → 연삭 (프로파일 or 창성)
├── 내부 기어
│   ├── 대량 → 브로칭
│   ├── 중량/유연성 → 파워 스카이빙
│   └── 소량/비표준 → 셰이핑
├── 베벨 기어
│   ├── Gleason 계열 → Face Milling
│   └── Klingelnberg 계열 → Face Hobbing
└── 웜 기어
    ├── 웜 → 선삭 + 나사 연삭
    └── 웜 휠 → 전용 호빙
```

---

## 2. 전통적 CAPP 시스템의 구조와 한계

### 2.1 CAPP 개요

CAPP(Computer-Aided Process Planning)는 CAD와 CAM 사이의 다리 역할로, 제품 설계를 최적 제조 순서로 변환한다. 1965년 Niebel이 최초 제안한 이래 60년 이상 발전해왔다.

출처: [ScienceDirect - KG-based CAPP Survey](https://www.sciencedirect.com/science/article/abs/pii/S0278612523001577)

### 2.2 두 가지 전통적 접근

#### Variant (Retrieval) CAPP
- **원리**: Group Technology(GT) 코딩으로 유사 부품을 분류 → 기존 공정 계획 검색/수정
- **장점**: 기존 검증된 계획 재활용, 구현 용이, 약 90% 계획을 베이스라인으로 커버
- **한계**: 유사 부품이 없으면 대응 불가, 기존 계획의 편향 답습, 최적화 보장 없음

#### Generative CAPP
- **원리**: 의사결정 로직, 알고리즘, 지식 베이스로 공정 계획을 처음부터 생성
- **장점**: 새로운 부품에 대응 가능, 이론적으로 최적 계획 생성 가능
- **한계**: 방대한 제조 지식 코드화 필요, 계산 비용 높음, 견고한 DB 필수
- **Dynamic Generative**: 실시간 공장 자원(워크로드 등) 기반 동적 계획 적응

출처: [Allen Engineering Journal - CAPP](https://www.allengineeringjournal.com/assets/archives/2018/vol2issue2/2-2-15-769.pdf), [ASEE - CAPP Revolutionize Manufacturing](https://peer.asee.org/computer-aided-process-planning-revolutionize-manufacturing.pdf)

### 2.3 Expert System 기반 CAPP

- 도메인 전문가 지식을 IF-THEN 규칙으로 코드화
- 라우트 시트 자동 생성, 일관된 품질의 공정 계획
- **성과**: 처리 시간 47% 감소, 효율 35% 향상 보고
- **한계**: 지식 획득 병목(Knowledge Acquisition Bottleneck), 규칙 유지보수 부담, 새 기술/소재 추가 시 수동 업데이트 필수

출처: [Allen Engineering Journal](https://www.allengineeringjournal.com/assets/archives/2018/vol2issue2/2-2-15-769.pdf)

### 2.4 기어 CAPP의 특수 과제

일반 CAPP를 기어에 적용할 때의 추가 복잡성:

| 과제 | 설명 |
|------|------|
| **기어 지오메트리 복잡성** | 인볼류트 치형, 마이크로 지오메트리(tip relief, crowning) 등 전문 파라미터 |
| **다단계 공정 체인** | 블랭크→치절→열처리→정삭→검사의 긴 체인, 각 단계 상호의존 |
| **열처리 변형** | 침탄/담금질 후 변형 예측 → 정삭 여유량 결정 |
| **전용 공구/기계** | 호빙머신, 기어 연삭기 등 전용 장비 필요 |
| **품질 등급-공정 매핑** | ISO 1328/AGMA 등급이 공정 선택을 직접 결정 |

---

## 3. AI/ML 기반 CAPP 연구 현황

### 3.1 심층강화학습 (DRL) in CAPP

| 연구 | 알고리즘 | 적용 | 연도 |
|------|---------|------|------|
| Wu et al. | Actor-Critic | 대량 맞춤 생산 CAPP | 2021 |
| Mueller-Zhang et al. | DQN | 순차적 공정 계획 | 2020 |
| Sugisawa et al. | Inverse RL | 전문가 지식 추출 기반 CAPP 강화 | 2021 |
| He et al. | DQN+MARL | 다목적 공정 최적화 | 2021 |

DRL의 핵심 가치: **경험 재사용성과 일반화** → 새로운 부품/상황에 적응 가능. Inverse RL은 인간 전문가의 암묵적 의사결정 규칙을 추출하여 CAPP에 활용.

출처: [PolyU - DRL in Smart Manufacturing](https://ira.lib.polyu.edu.hk/bitstream/10397/101475/1/Li_Deep_Reinforcement_Learning.pdf)

### 3.2 Knowledge Graph (KG) 기반 CAPP

KG는 CAPP 분야에서 가장 최신의 기술 방향으로 주목받고 있다.

**장점**:
- 가공 features, 공구, 공정, 기계를 구조화된 entity-relation으로 표현
- Wang et al.: feature-machining KG → 홀 가공 체계에서 0.8450 유사도로 전문가 수준 공정 선택
- Guo et al.: 특징 토폴로지 + 기계 능력 기반 라우팅 → 공정 설계 시간 50-80분 → ~15분
- 고장 진단에서 >90% 정확도 (센서 데이터 부재 시에도)

**한계**: KG 구축의 수동 큐레이션 병목 → LLM으로 자동화 가능성

출처: [ScienceDirect - KG-based CAPP Survey (2023)](https://www.sciencedirect.com/science/article/abs/pii/S0278612523001577)

### 3.3 LLM 기반 CAPP

#### CAPP-GPT (2024, ScienceDirect)
- 하이브리드 제조의 Macro-CAPP를 GPT 아키텍처로 자동화
- CSG 트리, B-Rep, 메타데이터 토큰화 → 인코더-디코더
- Logical Analysis of Data + 생성/변형 방법 하이브리드
- 공정 파라미터와 툴패스의 실시간 자기 복구(self-healing) 개념 제시

출처: [CAPP-GPT](https://pure.kfupm.edu.sa/en/publications/capp-gpt-a-computer-aided-process-planning-generative-pretrained-/)

#### ARKNESS (2025, arXiv)
- KG + RAG를 결합한 모델 불가지론적(model-agnostic) CAPP 어시스턴트
- 제로샷 GPT 기반 entity-relation 추출로 기술 문서 자동 KG화
- **3B Llama-3 + ARKNESS가 GPT-4o급 정확도** (MC +25pp, F1 +22.4pp)
- 수치 할루시네이션 22pp 감소, 온프레미스 실시간 추론 가능
- 이기종 문서(PDF 매뉴얼, 스펙시트, NC 코드 코멘트) 자동 그래프화

출처: [ARKNESS (arXiv 2506.13026)](https://arxiv.org/html/2506.13026v1)

#### LLMAPM (2025, IJPR)
- LLM Adaptive Process Management: 비정형 사용자 설명 → 구조화된 제조 태스크 플로우
- 3단계: 태스크 분할 → 스텝 생성 → 전체 합성
- 상태 머신 검증으로 논리적 정확성/안전성 보장
- 저코드 플랫폼 실험에서 워크플로우 효율, 장치 조정, 배포 유연성 개선 확인

출처: [LLMAPM (IJPR 2025)](https://bibbase.org/network/publication/ni-wang-leng-chen-cheng-alargelanguagemodelbasedmanufacturingprocessplanningapproachunderindustry50-2025)

#### LLM 기반 가공 공정 루트 자동 생성 (ACM, ~2024)
- LLM으로 가공 공정 루트를 입력으로부터 직접 생성
- 수동 계획의 한계를 해결하는 자동 방법 제안

출처: [ACM - Automatic Machining Process Route](https://dl.acm.org/doi/10.1145/3756423.3756528)

#### MIT CSAIL - GPT-4 for DfM (2024)
- GPT-4의 제조 프로세스 선택, 설계 최적화, 부품 소싱, 제조 지침 생성 능력 평가
- 5단계 파이프라인: 설계 생성 → 설계 공간 → DfM → 성능 예측 → 역설계
- GPT-4의 제조 지식은 유용하나, 정밀 수치 작업에는 외부 도구 위임 필수

출처: [MIT CSAIL - LLMs for CDaM](https://hdsr.mitpress.mit.edu/pub/15nqmdzl/download/pdf)

### 3.4 AI/ML CAPP 접근법 종합 비교

| 접근법 | 장점 | 한계 | 성숙도 |
|--------|------|------|--------|
| **Expert System** | 설명 가능, 일관성 | 지식 획득 병목, 유지보수 | 성숙 |
| **DRL** | 적응성, 일반화 | 학습 시간, 시뮬레이션 환경 필요 | 연구 단계 |
| **KG 기반** | 구조화, 추론 가능, 다목적 | KG 구축 비용, 도메인 의존 | 초기 상용화 |
| **LLM 직접** | 자연어 인터페이스, 범용 지식 | 할루시네이션, 수치 부정확 | 연구 단계 |
| **KG+LLM 하이브리드** | 정확성+유연성 겸비 | 시스템 복잡성 | 초기 연구 |

---

## 4. 기어 가공 공구 선정 자동화

### 4.1 호브(Hob) 선정 파라미터

**필수 매칭**: 법선 모듈 = 기어 모듈, 압력각 = 기어 압력각

| 파라미터 | 선택 기준 |
|----------|----------|
| **재질** | HSS(범용, 습식) → PM-HSS(고성능) → Solid Carbide(건식, 소경) → Carbide-tipped(인성+내마모) |
| **코팅** | TiN(수명 4x) → TiAlN(고경도, 건식) → AlCrN(TiAlN+50% 수명, 건식 hobbing 최적) |
| **등급** | AA→ISO 6+, A→ISO 7, B→ISO 8, C→ISO 9+ |
| **조수(Starts)** | 다조 호브 → 생산성 증가, 단일조 → 정밀도 우선 |
| **프로투버런스** | 연삭 전 언더컷 확보, 연삭 여유량과 연계 |

출처: [Gear Solutions - Cutting Tool Selection](https://gearsolutions.com/features/cutting-tool-selection-criteria-for-cylindrical-gear-manufacturing/)

### 4.2 연삭 휠 선정

| 항목 | Aluminum Oxide | CBN |
|------|---------------|-----|
| 드레싱 간 가공수 | 40-80개 | 2,200-2,500개 |
| 워크 열전달 | ~63% | ~4% |
| 수명 | 단기 | 4-6개월 |
| 초기 비용 | 낮음 | 높음 |
| 적합 시나리오 | 소량/다품종 | 대량생산 |

출처: [Norton Abrasives - CBN for Gear Grinding](https://www.nortonabrasives.com/en-us/resources/expertise/why-select-gear-grinding-cbn)

### 4.3 파워 스카이빙 공구 선정

- 공구 형상 최적화(경사각, 여유각)가 절삭력 저감의 핵심
- 공구 설계 시뮬레이션으로 최적 형상 결정 (Dontyne GPS, ShapePro)
- 공구 재연삭 후 상태까지 시뮬레이션하여 수명 최적화

출처: [ACM - Gear Shaper Cutter Optimization](https://dl.acm.org/doi/abs/10.1145/3467707.3467774)

### 4.4 공구 선정 자동화의 AI 적용

#### 현황
- **MachiningCloud**: 벤더 디지털 공구 데이터를 단일 플랫폼으로 통합 → CAM/시뮬레이션 연동
- **CloudNC Cutting Parameters AI**: 물리 기반 모델로 소재-공구-기계 맥락에서 자동 이송/속도 생성
- **ShapePro (U Waterloo)**: 기어 절삭 시뮬레이션으로 칩 형상, 절삭력, 변형 예측 → 자동/수동 최적화

#### 자동화 수준

| 수준 | 설명 | 현황 |
|------|------|------|
| L0: 수동 | 전문가 경험 + 카탈로그 참조 | 현재 주류 |
| L1: 디지털 카탈로그 | ISO 13399 기반 디지털 공구 데이터 검색 | MachiningCloud, Liebherr 오픈 데이터 |
| L2: 규칙 기반 추천 | IF-THEN 규칙으로 공구 후보 제시 | 일부 상용 CAM |
| L3: AI 기반 최적화 | ML/물리 모델로 최적 공구+조건 자동 결정 | CloudNC, ShapePro (초기) |
| L4: 자율 선정 | 실시간 센서 피드백으로 적응적 공구 교체 | 연구 단계 |

출처: [Metrology News - CloudNC](https://metrology.news/new-cutting-parameters-ai-solution-to-transform-cnc-machining/), [CTE Mag - AI Tool Selection](https://ctemag.com/articles/ai-guide-cutting-tool-selection-future/), [UWaterloo - ShapePro](https://uwaterloo.ca/news/new-digital-simulation-tool-gear-machining-saves-time)

### 4.5 ISO 13399와 공구 데이터 표준화

- **ISO 13399 / GTC**: Siemens PLM + Sandvik + Iscar + Kennametal 공동 벤더 중립 분류
- 공구의 기하학적, 물리적, 기술적 데이터를 표준화
- **Liebherr**: 오픈소스 기어 공구 데이터 구조 (hobbing, grinding, shaping, skiving 전 커버)
- AI/LLM 시스템과의 연동을 위한 핵심 인프라

출처: [Machinery - Vendor Neutral Cutting Tools](https://www.machinery.co.uk/content/news/vendor-neutral-cutting-tools-catalogue-structure-supports-standardised-data-exchange-with-plm-and-cadcam-systems)

---

## 5. 절삭 조건 최적화 - 기어 특화

### 5.1 호빙 절삭 조건

| 파라미터 | 중탄소강 (45#) | 합금강 (40Cr) | 침탄강 (20MnCr5) | 단위 |
|----------|---------------|--------------|------------------|------|
| 절삭속도 Vc (HSS) | 50-80 | 40-60 | 40-60 | m/min |
| 이송 f | 0.2-0.4 | 0.2-0.3 | 0.2-0.3 | mm/rev |
| 고속 가공 (Carbide, Dry) | 200-400 | 150-300 | 150-300 | m/min |

출처: [THORS - Hobbing Parameters](https://thors.com/gear-hobbing-cutting-parameters-to-optimize-the-hobbing-process/)

### 5.2 연삭 절삭 조건

| 파라미터 | 프로파일 연삭 | 창성 연삭 | 단위 |
|----------|-------------|----------|------|
| 휠 속도 | 25-35 | 40-63 | m/s |
| 이송 | 0.01-0.05 | 0.02-0.1 | mm/stroke |
| 절입 | 0.01-0.03 | 0.02-0.05 | mm |

### 5.3 AI/ML 기반 절삭 조건 최적화

| 방법 | 최적화 대상 | 목적함수 | 성과 |
|------|-----------|---------|------|
| **PSO + GRA + PCA** | 속도, 이송/치, 절입 | 마모, 조도, 제거율 | 최적 조합 도출 |
| **유전 알고리즘 (GA)** | 스핀들 속도, 이송 | 절삭력, 시간/비용 | 스핀들 70.95 m/min, 이송 0.95 mm/r |
| **꿀벌 군집 알고리즘** | 속도, 이송, 절입 | 가공 시간/비용 | 연속 변수 제약 최적화 |
| **응답 곡면법 (RSM)** | 속도, 이송, 절입 | 조도, 절삭력 | 다목적 최적 조합 |
| **디지털 트윈** | CNC 전 파라미터 | 총 시간/비용 | 실시간 시뮬레이션 기반 적응 |

출처: [PMC - Tool Parameter Optimization](https://pmc.ncbi.nlm.nih.gov/articles/PMC8538737/), [CSROC - CNC Parameters ML](https://csroc.cmex.org.tw/journal/JOC35-3/JOC3503-21.pdf)

### 5.4 핵심 Trade-off

```
생산성 ←→ 품질
  ↑ Vc → ↓ 사이클 타임 BUT ↓ 공구 수명
  ↑ 품질 등급 → 연삭 필수 → ↑ 비용
  CBN 휠 → 긴 드레싱 주기 BUT ↑ 초기 비용
  건식 가공 → ↓ 환경/비용 BUT ↑ 공구 부하
```

---

## 6. 기어 품질 등급과 공정 선택의 관계

### 6.1 ISO 1328 체계

- **범위**: Grade 1(최고) ~ 11(최저), 낮은 숫자 = 높은 정밀도
- **측정 항목**: 치형 편차(fα), 리드 편차(fβ), 피치 편차(fp), 런아웃(Fr)
- **허용 편차**: 모듈 + 기준 직경의 함수로 계산
- ISO 1328-1:2013이 현행 표준, ANSI/AGMA 1328-1-B14로 동일 채택

출처: [Motion Control Tips - AGMA/ISO Quality Standards](https://www.motioncontroltips.com/current-status-of-agma-and-iso-gear-quality-standards/), [AGMA - ANSI/AGMA ISO 1328-1-B14](https://members.agma.org/MyAGMA/MyAGMA/Store/Item_Detail.aspx?iProductCode=1328_1_B14)

### 6.2 AGMA 체계

- **기존**: Q3~Q15 (높은 숫자 = 높은 정밀도) - AGMA 2000-A88
- **현행**: A2~A11 (낮은 숫자 = 높은 정밀도) - ANSI/AGMA 2015-1-A01
- ISO 1328-1:2013 채택 후 ISO와 통일

| 표준 | 범위 | 정밀 방향 | 주 사용 지역 |
|------|------|---------|------------|
| ISO 1328 | 1-11 | 1 = 최고 | 글로벌 |
| DIN | 1-12 | 1 = 최고 | 유럽 |
| AGMA (현행) | A2-A11 | A2 = 최고 | 북미 |

출처: [MAS Gear Tech - Quality Standards Comparison](https://masgeartech.com/2025/09/05/gear-quality-standards-explained-agma-din-iso-what-procurement-needs-to-know/)

### 6.3 품질 등급별 공정 매핑

| ISO 등급 | 달성 공정 | 응용 분야 |
|---------|----------|----------|
| 3-5 | 프로파일/창성 연삭 | 항공우주, 로봇, 정밀 기기 |
| 5-7 | 창성 연삭, 하드 스카이빙 | 자동차 변속기, 산업용 감속기 |
| 6-8 | 셰이빙, 파워 스카이빙 | 일반 산업 기어 |
| 7-10 | 호빙 | 범용 산업 기어 |
| 8-11 | 브로칭, 포밍 | 농기계, 건설장비 |

**품질 등급이 공정 선택을 결정하는 핵심 관계**:
- ISO 6 이상 → 연삭 필수 (열처리 후)
- ISO 7-8 → 셰이빙 또는 파워 스카이빙으로 달성 가능
- ISO 8 이하 → 호빙 단독으로 가능

출처: [Gear Technology India - Process Selection](https://geartechnologyindia.com/choosing-the-right-gear-process-for-short-runs-skiving-vs-hobbing-vs-grinding-the-right-method-for-indian-shops/)

---

## 7. 상용 소프트웨어 현황

### 7.1 KISSsoft (Gleason)

**기능**:
- ISO 6336 / AGMA 2001 기반 강도 계산
- 원통, 베벨, 웜, 랙 등 전 유형 기어 설계
- 마이크로 지오메트리 최적화, LTCA (Loaded Tooth Contact Analysis)
- KISSdesign (2024~): 기존 KISSsys 대체, 복잡 드라이브트레인 가속 계산

**자동화/API**:
- **COM Interface**: VBA(Excel) 등에서 원격 제어 → 파일 로드, 변수 설정/읽기, 계산 실행, 보고서 생성
- **Extended COM (K04a)**: CallFunc/CallFuncNParam으로 사이징/최적화 함수 호출
- **SKRIPT (K22/K22a)**: 내장 스크립팅, 이벤트 트리거(파일 로드 후, 저장 전, 계산 전후), 커스텀 UI 생성
- **데이터 교환**: GDE (VDI 2610 XML), GAMA (Gleason 측정기), GEMS 인터페이스, DXF/IGES

**2025 릴리즈**: 결과 시각화 혁신, 원통 기어 제조 시뮬레이션 기능 확장

출처: [KISSsoft Release 2024 PDF](https://www.kisssoft.com/files/aznw8h/KISSsoft-Productdescription-en-v2402.pdf), [KISSsoft Module List 2023](https://www.kisssoft.com/files/R7qjUS/KISSsoft_Module_List_Release_2023-en-v2300-jl-public.pdf), [KISSsoft COM Training](https://www.kisssoft.com/en/academy/events/script-and-com-interface)

### 7.2 GEMS (Gleason Engineering & Manufacturing System)

**기능**:
- 베벨/하이포이드 기어 설계, 시뮬레이션, 제조 통합
- 2D/3D Loaded TCA, 공구 설계, 치면 최적화
- Gleason 절삭기/블레이드 연삭기 데이터 생성
- Closed-loop: 검사(G-AGE) → 절삭 보정 자동 계산

**KISSsoft 연동**:
- KISSsys/KISSsoft와 양방향 데이터 교환
- 시스템 설계(KISSsoft) → 베벨 기어 제조(GEMS) 일원화 워크플로우

출처: [KISSsoft-GEMS Interface 2019](https://www.kisssoft.ch/news/pdf/KISSsoft_GEMS_2019.pdf), [Gleason Design](https://www.gleason.com/design)

### 7.3 Klingelnberg KIMoS / KOMET

- **KIMoS**: 스파이럴 베벨 설계-최적화-생산 통합
- **KOMET**: 측정 편차 → 기계/공구 보정 자동 계산 (Closed-loop)
- 폐쇄적 생태계, API 접근 제한

### 7.4 MASTA (SMT)

- 전체 트랜스미션 설계/시뮬레이션 (75+ 모듈)
- C# 기반 → 프로그래밍 접근성 중간
- 전기 파워트레인 통합, 효율/열 분석

출처: [SMT - MASTA](https://www.smartmt.com/masta/)

### 7.5 Romax (Hexagon)

- 기어박스/드라이브라인 최적화
- Concept → Enduro 파이프라인
- 시스템 수준 NVH/내구 분석

### 7.6 Dontyne GPS (Gear Production Suite)

- 2008년부터 개발, 설계-가공 시뮬레이션-검사 통합 단일 환경
- **Machine Centre**: 호빙, 셰이핑, 셰이빙, 프로파일 연삭, 창성 연삭, 스카이빙, 호닝, 베벨 기어 시뮬레이션
- **Optimal 모듈**: 측정 데이터 → 가공 보정 계산 (Closed-loop)
- 2025: 하이포이드 LTCA 확장, 플런지 셰이빙/내부 프로파일 연삭 추가
- 16개국 210+ 설치

출처: [Dontyne Systems - GPS](https://dontynesystems.com/software-products-and-services/gear-production-suite/), [Gear Technology - Dontyne 2025](https://www.geartechnology.com/mpt-expo-preview-dontyne-systems)

### 7.7 상용 SW API/자동화 요약

| 소프트웨어 | API 유형 | 개방성 | LLM 연동 가능성 |
|-----------|---------|--------|----------------|
| KISSsoft | COM, SKRIPT, GDE XML | **중-상** | COM → Python 래퍼 → LLM tool_use |
| GEMS | CAGE/UNICAL, KISSsoft 인터페이스 | 폐쇄적 | 제한적 |
| KIMoS/KOMET | 측정-보정 루프 | 폐쇄적 | 제한적 |
| MASTA | C# API | 중간 | C# 래퍼 가능 |
| Dontyne GPS | 파일 기반, Optimal 모듈 | 중간 | 배치 실행 가능 |

---

## 8. 공정 시뮬레이션 및 검증 도구

### 8.1 ShapePro (University of Waterloo)

- Dr. Kaan Erkorkmaz 연구팀 개발
- **3대 기어 가공 공정 시뮬레이션**: 셰이핑, 호빙, 파워 스카이빙
- 칩 형상, 절삭 역학(절삭력, 공구/공작물 변형) 예측
- 가상 절삭 + 가상 측정 → 물리적 시행착오 대폭 감소
- 파라미터의 자동/수동 최적화 지원
- 재료 사용 및 에너지 낭비 감소 → 지속가능성 기여

출처: [UWaterloo - ShapePro](https://uwaterloo.ca/news/new-digital-simulation-tool-gear-machining-saves-time), [TechXplore - ShapePro](https://techxplore.com/news/2023-11-digital-simulation-tool-gear-machining.html)

### 8.2 Dontyne Machine Centre

- 기어 가공 시뮬레이션 전문 모듈
- 공구 설계, 공구 DB, 프로파일 생성 시뮬레이션, 공차 분석
- G-code 재생, 스톡 플롯, 로터리 테이블 기능
- 프로투버런스, 단축 호빙 시뮬레이션
- 호닝 시뮬레이션: 접촉선 분포 분석 → 생성 중 힘 균형 평가
- 상류 공정(호빙/스카이빙) 데이터 통합 → 가공 여유량/파단 위치 계산

출처: [Dontyne Machine Centre Brochure](https://dontynesystems.com/wp-content/uploads/2024/02/Dontyne_MC_Brochure2023_5.8_web.pdf)

### 8.3 GEMS TCA/LTCA

- 2D/3D Loaded Tooth Contact Analysis
- 베벨/하이포이드 기어 치면 접촉 패턴 시뮬레이션
- 절삭 시뮬레이션 → 측정 결과 비교 → 보정 루프

### 8.4 FVA-Workbench

- FVA (독일 기어 연구 협회) 개발
- 기어박스 설계 + 해석 통합
- V9 (2024): 기어박스 설계 재정의 수준의 업데이트

### 8.5 시뮬레이션 도구 비교

| 도구 | 범위 | 특화 공정 | API/자동화 |
|------|------|----------|-----------|
| ShapePro | 셰이핑, 호빙, 스카이빙 | 절삭 역학 예측 | 연구용 |
| Dontyne MC | 전 기어 공정 | 제조 시뮬레이션 + 보정 | 상용 |
| GEMS TCA | 베벨/하이포이드 | 치면 접촉 분석 | Gleason 폐쇄 |
| FVA-Workbench | 기어박스 시스템 | 시스템 해석 | 중간 |

---

## 9. Industry 4.0 / Smart Manufacturing 트렌드

### 9.1 기어 제조 디지털화 핵심 요소

| 요소 | 기어 제조 적용 | 주요 업체/사례 |
|------|--------------|--------------|
| **IoT 센서** | 호빙/연삭기 진동, 온도, 공구 마모 실시간 모니터링 | THK OMNIedge (공구 상태 AI 감지) |
| **Closed-loop** | 측정→보정 자동 피드백 | Klingelnberg KOMET, Dontyne Optimal |
| **디지털 트윈** | 기어 제조 공정 가상 시뮬레이션 | ShapePro, Dontyne GPS |
| **예측 정비** | IoT 기반 장비 고장 예측, 다운타임 최소화 | Liebherr, 범용 센서 솔루션 |
| **공구 관리** | RFID 기반 공구 추적, 수명 관리 | Liebherr 오픈소스 공구 데이터 |
| **데이터 표준** | ISO 13399/GTC 벤더 중립 공구 데이터 교환 | Siemens+Sandvik+Iscar+Kennametal |

출처: [THK - Tool Monitoring AI](https://www.thk.com/eu/en/journal/products/article-17052023-1.html), [Liebherr - Industry 4.0](https://liebherr.com/en/int/products/gear-technology-and-automation-systems/gear-cutting-machines/industry-4.0/industry-4.0.html)

### 9.2 Closed-Loop Manufacturing의 진화

```
설계 (KISSsoft)
    ↓ 기어 파라미터
가공 (호빙/연삭기)
    ↓ 가공 완료 부품
검사 (CMM / 기어 측정기)
    ↓ 측정 편차 데이터
보정 계산 (KOMET / Dontyne Optimal)
    ↓ 기계/공구 보정값
가공 (보정 적용) ← 루프
```

이 피드백 루프가 디지털화의 핵심이며, AI/ML이 보정 계산을 자동화/최적화하는 방향으로 진화 중.

### 9.3 e-모빌리티와 기어 제조 변화

- EV 감속기는 고회전/저소음 → ISO 5-6급 이상 요구 → 연삭 비중 증가
- NVH 요구 강화 → 마이크로 지오메트리 최적화 중요성 증가
- 다축/복합기계에서의 기어 가공 → 파워 스카이빙 수요 증가
- Sandvik: "전용 기어 기계에서 복합기계로의 이동이 대세"

---

## 10. LLM이 CAPP 시스템을 보완/대체할 수 있는 시나리오

### 10.1 LLM 적용 가능성 매트릭스

| 시나리오 | 설명 | 실현 가능성 | 기대 가치 | 리스크 |
|---------|------|-----------|---------|--------|
| **S1: 자연어 공정 조회** | "Module 2, 20T 스퍼 기어의 공정 순서는?" → 지식 기반 답변 | **높음** | 중간 | 낮음 |
| **S2: 공구 카탈로그 RAG** | 호브/연삭 휠 스펙 검색, 조건부 추천 | **높음** | **높음** | 낮음 |
| **S3: KG 기반 공정 체인 생성** | 기어 파라미터 → KG 추론 → 공정 라우팅 자동 생성 | **중간** | **높음** | 중간 |
| **S4: 절삭 조건 최적화 보조** | 소재-공구 조합별 초기 절삭 조건 추천 | **중간** | 중간 | 중간 |
| **S5: 품질 등급-공정 매핑** | 목표 ISO 등급 → 필요 공정 체인 자동 결정 | **중-높음** | **높음** | 낮음 |
| **S6: 공정 문서 자동 생성** | 공정 계획서, 작업 지시서, 검사 기준서 자동 작성 | **높음** | 중간 | 낮음 |
| **S7: 트러블슈팅 어시스턴트** | 기어 가공 불량 원인 분석 → 대응책 추천 | **중간** | **높음** | 중간 |
| **S8: KISSsoft COM 오케스트레이션** | LLM이 KISSsoft COM API를 호출하여 설계-검증 자동화 | **중간** | **높음** | 높음 |
| **S9: 견적 자동화** | 기어 스펙 → 공정 체인 → 비용/시간 자동 산출 | **중-높음** | **높음** | 중간 |
| **S10: 엔지니어 교육/멘토링** | 기어 가공 지식의 대화형 학습 | **높음** | 중간 | 낮음 |

### 10.2 가장 유망한 시나리오 상세

#### S2: 공구 카탈로그 RAG — ROI 최고

```
[엔지니어] "Module 3, 압력각 20도, 20MnCr5 소재, ISO 7급 스퍼 기어에
            적합한 호브를 추천해줘"

[LLM+RAG]  ISO 13399/Liebherr 공구 DB 검색
           ↓
           "추천 호브:
            - 재질: PM-HSS ASP2030 (침탄강 최적)
            - 코팅: AlCrN (건식 가능, TiAlN+50% 수명)
            - 등급: A급 (ISO 7 달성)
            - Vc: 40-60 m/min (20MnCr5 권장)
            - f: 0.2-0.3 mm/rev
            출처: Liebherr 카탈로그 p.45, Gear Solutions 2024"
```

**구현 요소**: ISO 13399 공구 데이터 벡터 DB + RAG + LLM 자연어 인터페이스

#### S3: KG 기반 공정 체인 생성

```
[입력] 기어 스펙: 스퍼, Module 2.5, Z=35, 20MnCr5, ISO 6급, 5000개/월

[KG 추론]
  기어유형=스퍼 → requiresProcess → {호빙, 셰이핑, 파워스카이빙}
  수량=5000 → preferProcess → 호빙 (대량)
  ISO등급=6 → requiresFinishing → 연삭
  소재=20MnCr5 → requiresHeatTreatment → 침탄+담금질+템퍼링
  ISO등급=6 → requiresHobClass → A등급

[생성된 공정 체인]
  1. 블랭크 단조 + 선삭 (기준면)
  2. 호빙 (A급 PM-HSS 호브, AlCrN 코팅)
  3. 디버링/챔퍼링
  4. 침탄 (900-950°C) → 담금질 (810-840°C) → 템퍼링 (150-200°C)
  5. 기준면 연삭
  6. 치형 창성 연삭 (CBN 휠, 대량생산)
  7. 검사 (치형, 리드, 피치, 런아웃, 경도)
```

#### S8: KISSsoft COM 오케스트레이션

```python
# LLM이 생성하는 KISSsoft COM 호출 코드 예시
import win32com.client

kisssoft = win32com.client.Dispatch("KISSsoft.Application")
kisssoft.OpenFile("gear_template.z12")

# LLM이 파라미터 설정
kisssoft.SetVar("z1", 35)        # 잇수
kisssoft.SetVar("mn", 2.5)       # 법선 모듈
kisssoft.SetVar("alpha_n", 20)   # 압력각
kisssoft.SetVar("b", 30)         # 이폭

# 계산 실행
kisssoft.Calculate()

# 결과 읽기
sf = kisssoft.GetVar("Sf_min")   # 안전계수
sh = kisssoft.GetVar("Sh_min")

# LLM이 결과 해석 및 보고
```

**핵심**: LLM은 COM API 호출 코드를 생성하고, KISSsoft가 수치 계산을 수행하며, LLM이 결과를 해석하여 보고. LLM이 직접 강도 계산을 하지 않는다.

### 10.3 대체 불가 영역

| 영역 | 이유 |
|------|------|
| ISO 6336 강도 계산 | 수십 년 검증된 수치 공식, LLM의 수치 정확도 불충분 |
| 베벨 기어 TCA | 수치적 정밀도 + 3D 접촉 시뮬레이션 필수 |
| 열처리 변형 예측 | FEA/경험 모델 기반, LLM으로 불가 |
| 실시간 공정 제어 | 밀리초 응답, 결정론적 제어 필요 |

### 10.4 하이브리드 아키텍처 제안

```
사용자 (자연어/도면/스펙시트)
         │
    [LLM Orchestrator]
    ┌────┼────┬────┬────┐
    │    │    │    │    │
  [공구    [공정   [KISSsoft [품질   [문서
   RAG]   KG]    COM]    매핑]   생성]
    │    │    │    │    │
  ISO   Neo4j  KISSsoft  ISO   MD/PDF
  13399  KG    Engine   1328   출력
  DB
```

**LLM의 역할**: 오케스트레이터 + 자연어 인터페이스 + 결과 해석/보고. 수치 계산은 절대로 LLM이 직접 수행하지 않음.

---

## 11. 종합 분석 및 결론

### 11.1 현황 요약

| 영역 | 현재 수준 | AI/LLM 적용 단계 |
|------|----------|-----------------|
| 기어 가공 공정 지식 | 성숙 (수십 년 축적) | 지식 구조화/접근성 개선 가능 |
| CAPP 자동화 | 일반 부품은 중간, 기어 특화는 초기 | KG+LLM 하이브리드 연구 시작 |
| 공구 선정 | 수동/반자동 (카탈로그 기반) | RAG 기반 자동화 가장 유망 |
| 절삭 조건 최적화 | 물리 모델 + ML (일반 가공) | 기어 특화 최적화 연구 초기 |
| 품질-공정 매핑 | 경험 기반, 일부 규칙화 | KG로 자동화 가능 |
| 상용 SW | KISSsoft 중심, COM/SKRIPT 개방 | LLM 연동 미개척 분야 |
| 공정 시뮬레이션 | ShapePro, Dontyne GPS 등 발전 중 | 디지털 트윈 + AI 방향 |
| Industry 4.0 | Closed-loop, IoT 초기 적용 | 기어 특화 스마트 팩토리 초기 |

### 11.2 핵심 통찰

1. **LLM은 기어 CAPP를 "대체"하지 않는다 — "접근성을 민주화"한다**
   - 수십 년 축적된 도메인 지식에 대한 자연어 접근을 제공
   - KISSsoft 같은 검증된 도구를 오케스트레이션하는 방식이 현실적

2. **KG+LLM 하이브리드가 가장 유망한 방향**
   - ARKNESS 사례: 3B 모델이 GPT-4o급 정확도, 수치 할루시네이션 22pp 감소
   - 기어 공정 지식의 entity-relation 구조화 → 추론 가능한 공정 계획

3. **공구 카탈로그 RAG가 즉시 실현 가능한 최고 ROI 항목**
   - ISO 13399 표준화된 데이터 + Liebherr 오픈 데이터 → 벡터 DB화 가능
   - 엔지니어의 카탈로그 검색 시간을 수 시간 → 수 초로 단축

4. **파워 스카이빙이 기어 가공의 게임 체인저**
   - e-모빌리티 트랜스미션 변화와 맞물려 급성장
   - 공구 설계/조건 최적화에 시뮬레이션+AI 적용 여지 큼

5. **Closed-loop 품질 관리가 Industry 4.0의 핵심**
   - 측정→보정 자동 피드백 (KOMET, Dontyne Optimal)
   - AI/ML로 보정 패턴 학습 → 예측적 보정으로 진화 가능

### 11.3 실행 우선순위 제안

| 우선순위 | 항목 | 노력 | 가치 | 선행 조건 |
|---------|------|------|------|----------|
| **1** | 공구 카탈로그 RAG 시스템 | 중간 | 높음 | ISO 13399 데이터 확보 |
| **2** | 기어 공정 KG 구축 | 높음 | 높음 | 도메인 전문가 협력 |
| **3** | 품질 등급-공정 매핑 자동화 | 낮음 | 중간 | KG 또는 규칙 DB |
| **4** | KISSsoft COM 연동 PoC | 중간 | 높음 | KISSsoft 라이선스 |
| **5** | 절삭 조건 최적화 ML 모델 | 높음 | 높음 | 가공 데이터 축적 |
| **6** | 공정 계획 자동 생성 (KG+LLM) | 매우 높음 | 매우 높음 | KG+데이터+검증 |

### 11.4 불확실성 및 한계

- 기어 CAPP 특화 LLM 연구는 **사실상 존재하지 않음** → 일반 CAPP 연구의 기어 적용 가능성은 추론
- 상용 SW(KISSsoft, GEMS)의 AI 통합 로드맵은 **비공개** → 2025 릴리즈 노트에서 AI 관련 기능 미확인
- 금속 AM 기어의 실용성은 **2-5년 추가 연구 필요**
- KG 구축에 필요한 기어 도메인 온톨로지는 **세계적으로 부재** → 신규 구축 필요

---

## 주요 참고 문헌

### 기어 가공 공정
- [EMAG - Power Skiving](https://www.emag.com/industries-solutions/technologies/power-skiving/)
- [EMAG - Hobbing vs Skiving 비교](https://www.emag.com/blog/en/differences-between-hobbing-skiving-and-power-skiving/)
- [Sandvik Coromant - Gear Manufacturing](https://www.sandvik.coromant.com/en-us/knowledge/milling/gear-manufacturing)
- [3ERP - Gear Machining](https://www.3erp.com/blog/gear-machining/)

### CAPP 연구
- [ScienceDirect - KG-based CAPP Survey (2023)](https://www.sciencedirect.com/science/article/abs/pii/S0278612523001577)
- [CAPP-GPT (2024)](https://pure.kfupm.edu.sa/en/publications/capp-gpt-a-computer-aided-process-planning-generative-pretrained-/)
- [ARKNESS (arXiv 2506.13026)](https://arxiv.org/html/2506.13026v1)
- [LLMAPM (IJPR 2025)](https://bibbase.org/network/publication/ni-wang-leng-chen-cheng-alargelanguagemodelbasedmanufacturingprocessplanningapproachunderindustry50-2025)
- [PolyU - DRL in Smart Manufacturing](https://ira.lib.polyu.edu.hk/bitstream/10397/101475/1/Li_Deep_Reinforcement_Learning.pdf)

### LLM + 제조
- [arXiv - LLMs for Manufacturing (2410.21418)](https://arxiv.org/abs/2410.21418)
- [MIT CSAIL - LLMs for CDaM](https://hdsr.mitpress.mit.edu/pub/15nqmdzl/download/pdf)
- [ACM - Automatic Machining Process Route](https://dl.acm.org/doi/10.1145/3756423.3756528)
- [MDPI - Agentic AI in Industry 5.0](https://www.mdpi.com/2218-6581/15/3/58)

### 공구 선정 및 최적화
- [Gear Solutions - Cutting Tool Selection](https://gearsolutions.com/features/cutting-tool-selection-criteria-for-cylindrical-gear-manufacturing/)
- [Norton Abrasives - CBN Gear Grinding](https://www.nortonabrasives.com/en-us/resources/expertise/why-select-gear-grinding-cbn)
- [Metrology News - CloudNC](https://metrology.news/new-cutting-parameters-ai-solution-to-transform-cnc-machining/)
- [PMC - Tool Parameter Optimization](https://pmc.ncbi.nlm.nih.gov/articles/PMC8538737/)

### 품질 등급
- [Motion Control Tips - AGMA/ISO Standards](https://www.motioncontroltips.com/current-status-of-agma-and-iso-gear-quality-standards/)
- [MAS Gear Tech - Standards Comparison](https://masgeartech.com/2025/09/05/gear-quality-standards-explained-agma-din-iso-what-procurement-needs-to-know/)

### 상용 소프트웨어
- [KISSsoft Release 2024 PDF](https://www.kisssoft.com/files/aznw8h/KISSsoft-Productdescription-en-v2402.pdf)
- [KISSsoft-GEMS Interface](https://www.kisssoft.ch/news/pdf/KISSsoft_GEMS_2019.pdf)
- [Dontyne GPS](https://dontynesystems.com/software-products-and-services/gear-production-suite/)
- [Gleason Design](https://www.gleason.com/design)

### 공정 시뮬레이션
- [UWaterloo - ShapePro](https://uwaterloo.ca/news/new-digital-simulation-tool-gear-machining-saves-time)
- [Dontyne Machine Centre Brochure](https://dontynesystems.com/wp-content/uploads/2024/02/Dontyne_MC_Brochure2023_5.8_web.pdf)
- [Gear Technology - Dontyne 2025](https://www.geartechnology.com/mpt-expo-preview-dontyne-systems)

### Industry 4.0 / AM
- [THK - Tool Monitoring AI](https://www.thk.com/eu/en/journal/products/article-17052023-1.html)
- [Grand View Research - Metal AM Market](https://www.grandviewresearch.com/industry-analysis/metal-additive-manufacturing-equipment-market-report)
