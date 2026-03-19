# 02. 공정 지능 레이어 (Process Intelligence Layer)

> 조사일: 2026-03-19
> 역할: Researcher — AI 기반 공정 계획, 공정 최적화, 디지털 트윈의 현재 기술 수준과 실제 작동 시스템

---

## 목차
1. [AI-Powered CAPP](#1-ai-powered-capp)
2. [제조 온톨로지와 지식 그래프](#2-제조-온톨로지와-지식-그래프)
3. [디지털 트윈과 공정 시뮬레이션](#3-디지털-트윈과-공정-시뮬레이션)
4. [공구 선정 및 절삭 조건 최적화](#4-공구-선정-및-절삭-조건-최적화)
5. [실제 산업 사례와 성숙도](#5-실제-산업-사례와-성숙도)
6. [시너지 연결점: 설계 지능 ↔ 공정 지능 ↔ 실행 지능](#6-시너지-연결점)
7. [참고문헌](#참고문헌)

---

## 1. AI-Powered CAPP

### 1.1 전통적 CAPP vs AI CAPP

전통적 CAPP는 세 가지 접근법으로 구분된다:

| 접근법 | 원리 | 한계 |
|--------|------|------|
| **변형 방식 (Variant)** | GT 코드 기반 유사 공정 검색·수정 | 신규 형상 대응 불가, DB 의존 |
| **생성 방식 (Generative)** | 의사결정 규칙/로직으로 공정 자동 생성 | 규칙 코딩 비용 막대, 유지보수 난이도 |
| **하이브리드** | 변형+생성 결합 | 두 방식의 단점을 동시에 가짐 |

AI CAPP는 이 구분을 넘어 데이터 기반 학습과 LLM 추론을 결합하는 새로운 패러다임을 형성하고 있다.

### 1.2 LLM 기반 CAPP 시스템

#### CAPP-GPT

CAPP-GPT는 GPT 아키텍처를 공정 계획에 적용한 프레임워크로, 공정 파라미터 적응과 툴패스 최적화를 디지털 트윈 기반 온라인 공정 시그니처 측정으로 수행한다 [1]. 핵심 기여는 CAPP와 생산 스케줄링을 하나의 프레임워크에서 결합하여, 공장 현장의 disruption에 대한 "자가 치유(self-healing)" 메커니즘을 제공하는 것이다.

- **성숙도**: 연구 단계 (TRL 3-4). 실제 양산 라인 적용 사례 미확인.
- **이 수치가 틀릴 수 있는 조건**: 논문에서 제시된 성능은 제한된 파트 유형과 단일 생산 환경에서의 결과이며, 복잡한 다품종 소량 환경에서는 검증되지 않았다.

#### GPT-2 기반 분산 제조 CAPP (2026년 1월)

가장 최신 연구는 CAPP 문제를 **시퀀스 예측 태스크**로 정의하고, GPT-2 기반 LLM이 공정 체인을 자기 회귀적으로(autoregressively) 생성하는 접근법이다 [2].

- **인코딩**: 파트의 전체 형상, 기하학적 특징, 대응 제조 공정을 커스텀 인코딩 스킴으로 표현
- **성능**: 학습 데이터의 5%만 사용해도 공정 체인 수준에서 **99% 이상 정확도** 달성
- **비교**: RNN 대비 LLM이 명확히 우월하며, 학습 데이터가 적을수록 격차가 커짐
- **한계**: 7,840개 합성 파트 + 전문가 규칙 기반 로직으로 생성된 데이터셋. 실제 제조 데이터 검증 필요.
- **반증 탐색**: 합성 데이터에서 99%는 인상적이나, 실제 공장의 비정형 파트·재료·기계 제약 조건을 포함하면 성능 저하가 예상된다. 반증 미발견 (아직 실제 데이터 벤치마크 논문 없음).

#### ARKNESS (Augmented Retrieval Knowledge Network Enhanced Search & Synthesis)

ARKNESS는 KG(지식 그래프) + RAG 파이프라인을 결합한 가장 주목할 시스템이다 [3].

- **방법**: 이종 가공 문서를 자동으로 multi-relational 그래프로 변환 → 쿼리에 필요한 최소 서브그래프를 LLM 컨텍스트에 주입
- **벤치마크**: 155개 산업 큐레이션 질문 (공구 사이즈, 이송/속도 최적화, 공차 진단)
  - 3B 파라미터 Llama-3 + ARKNESS가 **GPT-4o와 동등한 정확도** 달성
  - 객관식 정확도 **+25 pp**, F1 **+22.4 pp**, ROUGE-L **8.1배** 향상
  - 수치 환각(numeric hallucination) **22 pp 감소**
- **실행 연결**: 3B 모델이 GPT-4o급 성능을 보이므로, on-premise 배포가 가능하며 보안 민감 제조 환경에 적합. 통합 제조 AI에서 "공정 지식 질의 엔진" 역할 가능.

### 1.3 Feature Recognition → 공정 순서 자동 결정

현재 수준은 피처 인식 → 선행/제약 해결 → 소재/치구/기계 할당 → 오퍼레이션 그래프 합성 → ISO 6983 또는 STEP-NC 컴파일의 파이프라인이 연구 수준에서 작동한다 [3]. 그러나:

- 피처 인식 정확도는 단순 prismatic 파트에서 높지만, 자유곡면이나 복합 피처에서는 여전히 인간 개입 필요
- 공정 순서 결정은 전문가 규칙 + ML 하이브리드가 현실적 접근법
- **성숙도**: 연구/시제 단계 (TRL 4-5)

### 1.4 G-code/NC 프로그램 자동 생성 AI

| 모델 | 능력 | 한계 | 출처 |
|------|------|------|------|
| GPT-3.5 | 단순 G-code 생성 가능 | 버그 탐지 실패, 존재하지 않는 에러 보고 | [4] |
| GPT-4o | 기능적으로 작동하는 ISO G-code 생성 | 단순 작업(드릴링 등)에 제한, 특수 CNC 구문 부족 | [4] |
| GLLM (StarCoder-3B 파인튜닝) | RAG + 자기수정 G-code 생성 | 도메인 특화 학습 데이터 필요, 범용성 미검증 | [5] |

- **핵심 제약**: LLM 학습 데이터에 CNC 가공 데이터셋이 충분하지 않음. 특수 공정이나 독점 제어 구문에서 에러 발생.
- **실행 연결**: 현 수준에서는 "초안 생성 → 인간 검증 → 수정" 워크플로우가 현실적. 완전 자동화는 단순 파트에만 가능.
- **성숙도**: 연구 단계 (TRL 2-3). 양산 적용 불가.

---

## 2. 제조 온톨로지와 지식 그래프

### 2.1 주요 온톨로지 비교

| 온톨로지 | 개발 | 강점 | 약점 | 실제 사용 | 성숙도 |
|----------|------|------|------|-----------|--------|
| **MASON** | 유럽 연구 프로젝트 | 제품-공정-자원 3축 모델링, OWL 기반 | 실시간 데이터 통합 미지원 | 학술 연구 중심 | 연구 |
| **MSDL** | ASU Semantic Computing Lab | 5계층 추상화 (공급자→공정), 높은 공리화 수준, 서비스 지향 | 정적 구조, 동적 제조 상황 반영 어려움 | 분산 제조 매칭에 사용 | 연구/시제 |
| **STEP-NC** | ISO 14649 | 공작기계 직접 구동 가능, 양방향 데이터 교환 | 구현 복잡, 레거시 시스템과 호환 어려움 | AM 디지털 스레드에서 활용 | 시제 |
| **OntoSTEP** | NIST | STEP→OWL 자동 변환, 지식 그래프 생성 유연 | STEP 데이터 의존, 독자적 의미 추론 제한 | NIST 연구, 2024년 새 구현체 발표 [6] | 시제 |

- **출처 평가**: MASON과 MSDL은 학술 환경에서 개발·검증되었으며, 산업 현장 ROI 데이터는 부재. [인접 도메인: 학술 연구] 산업 적용 시 스케일링 비용과 유지보수 문제가 발생할 수 있다.

### 2.2 제조 지식 그래프 구축 사례

- **NIST OntoSTEP (2024)**: STEP 스키마와 인스턴스를 OWL 온톨로지 및 지식 그래프로 변환하는 새로운 구현체 발표. 제품 모델 데이터의 유연한 KG 생성이 가능 [6].
- **고로 제철 공정 KG (2024)**: 온톨로지 기반 다층 지식 그래프 구축으로 공정 지식 체계화. [인접 도메인: 제철/프로세스 산업] 이산 제조(discrete manufacturing)와는 공정 특성이 다르나, KG 구축 방법론은 참고 가능 [7].
- **제지 공정 결함 진단 KG (2024)**: 지속가능 공정 산업을 위한 KG 기반 결함 진단 [8]. 역시 프로세스 산업 사례.

### 2.3 온톨로지 + LLM 결합 패턴

| 패턴 | 설명 | 대표 사례 | 장단점 |
|------|------|-----------|--------|
| **KG Grounding** | LLM 출력을 KG 트리플로 검증/보정 | ARKNESS [3] | 환각 감소, KG 구축 비용 |
| **Schema-in-Prompt** | 온톨로지 스키마를 프롬프트에 삽입 | 일반 RAG 패턴 | 간편하나 컨텍스트 윈도우 제약 |
| **GraphRAG** | KG에서 관련 서브그래프를 검색해 LLM에 주입 | Document GraphRAG [9] | 정확도↑, 그래프 DB 인프라 필요 |
| **KG-enhanced Fault Diagnosis** | 결함 진단 파이프라인에 KG+LLM 결합 | FDRKG-LLM [10] | 설명 가능성↑, 도메인 특화 필요 |

### 2.4 온톨로지의 실제 ROI

**솔직한 평가**: 제조 온톨로지가 직접적으로 ROI를 창출한 산업 사례는 매우 드물다. 대부분의 온톨로지 프로젝트는:

- 학술 논문에서 "가능성 시연" 수준에 머무름
- 산업 적용 시 유지보수 비용이 초기 구축 비용을 초과
- 레거시 시스템과의 통합이 핵심 병목

다만, KG 구축 분야 전체로 보면 2024-2025년 **300-320% ROI** 달성 사례가 금융·의료·제조에서 보고되고 있다 [11]. 단, 이 수치는 제조 온톨로지 단독이 아닌 KG 플랫폼 전체의 ROI이며, 제조 특화 분해는 불명확하다.

- **반증 탐색**: 온톨로지 유지보수 비용, 도메인 전문가 의존성, 레거시 통합 난이도를 고려하면 "온톨로지 = ROI"라는 등식은 성립하지 않는다. ROI는 온톨로지 위에 구축된 응용 시스템(검색, 추천, 진단)에서 발생한다.

---

## 3. 디지털 트윈과 공정 시뮬레이션

### 3.1 공정 시뮬레이션 AI

#### Physics-Informed Neural Networks (PINNs)

| 응용 영역 | 방법 | 성과 | 성숙도 |
|-----------|------|------|--------|
| 절삭력 예측 | PIWNN-PEP (xLSTM-Informer 기반) | 물리 모델 예측 오차를 학습하여 보정 | 연구 (TRL 3) |
| 공구 마모 예측 | 순차적 PIML (분석 모델 + ML) | Taylor 기반 해석 모델과 RF/SVM 결합 | 연구/시제 (TRL 4) |
| 표면 거칠기 최적화 | PINN 기반 공정 체인 최적화 | 황삭 파라미터→연삭 요구→최종 품질 연결 | 연구 (TRL 3) |
| EDM 공정 최적화 | PINN 기반 펄스 파라미터 최적화 | MRR 극대화 + 표면 거칠기/전극 마모 최소화 | 연구 (TRL 3) |

- **핵심 가치**: 순수 데이터 기반 ML 대비 적은 학습 데이터로 물리적으로 의미 있는 예측 가능
- **한계**: 복잡한 멀티피직스 문제에서 수렴 어려움, 실시간 추론 속도 보장 미확인
- **이 수치가 틀릴 수 있는 조건**: PINN 성능은 물리 방정식의 정확도에 직접 의존. 경험식 기반 물리 모델이 부정확한 신소재/신공정에서는 성능 저하.

#### Surrogate Model (대리 모델)

FEA/CFD 시뮬레이션을 ML로 근사하여 실시간 추론을 가능하게 하는 접근법이 활발:

- **용도**: 설계 공간 탐색, 실시간 공정 파라미터 최적화, 디지털 트윈의 실시간 레이어
- **성숙도**: 특정 공정에 대해 시제/양산 적용 사례 존재 (TRL 5-7)

### 3.2 디지털 트윈 플랫폼

| 플랫폼 | 제공사 | 강점 | 약점 | 실제 배포 사례 |
|--------|--------|------|------|--------------|
| **Siemens Xcelerator** | Siemens | 엔드투엔드 (설계→생산→운영), Industrial Copilot, Process Simulate AI 코파일럿 | 높은 비용, 벤더 락인 | JetZero 공장 시뮬레이션 [12], SINUMERIK ONE 마이그레이션 (20-30% 생산성 향상) [13] |
| **PTC ThingWorx** | PTC | IoT+AR 통합, 실시간 모니터링, 예측 정비 | DT 전용이 아닌 IoT 플랫폼 확장 | 이산 제조 분야 다수 |
| **Azure Digital Twins** | Microsoft | 클라우드 네이티브, DTDL 모델링, 에코시스템 | 제조 도메인 특화 약함, 파트너 의존 | Mars 160개 공장 [14], Krones 병입 라인 (시뮬레이션 3-4시간→5분) [15] |

#### Siemens Industrial Copilot (2025)

Siemens는 Industrial AI를 공장 현장에 직접 가져오는 Industrial Copilot for Operations를 발표했다 [12]. 주요 특징:
- 자연어 인터페이스로 시뮬레이션 로직 생성, 결과 해석, 액션 제안
- Process Simulate 내에서 AI 코파일럿으로 작동
- 소규모 제조업체도 SaaS로 로봇 셀 시뮬레이션 가능

### 3.3 실시간 공정 최적화 (Adaptive Machining)

| 시스템/접근법 | 설명 | 성과 | 성숙도 |
|-------------|------|------|--------|
| **Lambda Function** | 물리 기반 ML + 실시간 현장 피드백 결합 | 폐루프 학습, 이상 탐지, 공구 수명 모니터링 | 시제/양산 (TRL 6-7) |
| **CAPPSNC** | 가공 중 치수 계측 피드백으로 파라미터 지속 조정 | 가상 CMM, 적응형 워크 오프셋 | 시제 (TRL 5-6) |
| **DRL 기반 적응 제어** | 딥 강화학습을 CNC 제어 루프에 통합 | 교란에 적응적 대응, 절삭 파라미터 동적 최적화 | 연구 (TRL 3-4) |
| **CAM Assist (Mastercam)** | AI 기반 CAM 보조, 2024년 7월 전 세계 출시 | 약 1,000개 기계 공장에서 일상 사용 | **양산** (TRL 8-9) |

- **CAM Assist**가 현재 양산 수준에서 작동하는 가장 성숙한 AI 공정 도구이다. 다만, 이것은 "실시간 폐루프 제어"가 아닌 "CAM 프로그래밍 보조"이므로 범위가 다르다.

### 3.4 반증: 디지털 트윈의 현실

디지털 트윈이 제조를 혁신한다는 주장에 대한 반증 [16][17]:

1. **비용 대비 효과 불확실**: 센서, 소프트웨어, 통합 비용이 막대. 특히 SME에게는 진입 장벽.
2. **데이터 품질 문제**: 레거시 MES/SCADA, 사일로된 PLC 데이터, 불일치하는 센서 품질이 정확한 DT 구축을 방해.
3. **스케일링 난이도**: 특정 기계에 대한 DT는 기계별 맞춤 → 확장성 부족. 고가의 데이터 사이언스 인력 필요.
4. **ROI 측정 어려움**: 예산 승인 확보, ROI 추정, 비용 정당화가 주요 장벽.
5. **조직적 저항**: 변화 저항, 이해관계자 동의 부재, 전문 인력 부족.

**교훈**: "시스템의 시스템(system of systems)" 접근법과 라이프사이클 통합이 필요. 병목 자산에 대한 예측 정비 등 **고영향 유스케이스를 먼저 식별**하고 ROI를 측정한 후 확장해야 한다.

---

## 4. 공구 선정 및 절삭 조건 최적화

### 4.1 AI 기반 공구 추천 시스템

| 시스템 | 제공사 | 방식 | 특징 |
|--------|--------|------|------|
| **CoroPlus ToolGuide** | Sandvik Coromant | 재료/공정/기계 질문 기반 추천 | 60,000+ 공구 DB, 속도/이송 자동 추천, CAM 연동 |
| **CoroPlus Process Control** | Sandvik Coromant | 실시간 가공 데이터 분석 (절삭력, 진동) | 적응형 절삭 깊이 추천, 공구 마모 예측 |
| **NOVO** | Kennametal | 분류 데이터 + 엔지니어링 지식 + 알고리즘 | 경험 수준별 맞춤 추천, 온라인 카탈로그 이상 |

- **성숙도**: CoroPlus와 NOVO는 **양산** 수준 (TRL 8-9). 전 세계 기계 공장에서 일상적으로 사용.
- **한계**: 자사 공구만 추천 (벤더 락인). 크로스 벤더 최적화는 불가.

### 4.2 ISO 13399 / GTC 활용

ISO 13399는 절삭 공구 데이터의 컴퓨터 해석 가능한 디지털 포맷 표준이다 [18]:

- 공구 제조사 간 통일된 데이터 포맷 제공
- CAM 소프트웨어와 공구 데이터 관리 시스템 간 원활한 정보 교환
- **핵심 가치**: "한 제조사의 데이터가 다른 제조사의 데이터와 동일하게 보이게" 하여 소프트웨어 별도 번역기/인터페이스 불필요

- **실행 연결**: ISO 13399는 RAG 기반 공구 카탈로그 검색의 데이터 표준화 기반이 될 수 있다. 표준화된 공구 데이터 → KG 구축 → LLM RAG 검색으로 이어지는 파이프라인이 기술적으로 가능.

### 4.3 RAG 기반 공구 카탈로그 검색

ARKNESS [3]가 이 분야의 최신 사례:
- 이종 가공 문서 (공구 카탈로그, 가공 매뉴얼)를 KG로 자동 변환
- 공구 사이즈, 이송/속도 최적화, 공차 진단 질의에 3B 모델로 GPT-4o급 응답
- **실행 연결**: 현장 엔지니어가 자연어로 "SUS304, Ra 0.8, 포켓 가공, 최적 공구?" 같은 질의를 할 수 있는 시스템의 기반 기술.

### 4.4 절삭 조건 최적화 ML 모델

#### Taylor 방정식과 ML의 결합

Taylor의 공구 수명 방정식 ($VT^n = C$)은 여전히 기본 모델이나, 현대 연구는 ML로 확장하고 있다 [19]:

- **Modified Taylor + ML**: 절삭 속도, 이송, 절삭 깊이를 포함한 확장 Taylor 방정식의 계수를 ML로 추정
- **전력 소비 기반 예측**: 실시간 전력 소비를 모니터링하여 공구 수명 예측. Taylor 방정식 형태를 유지하면서 단순한 구성.
- **1D CNN + ANN**: 절삭 공구 신호를 직접 입력으로 하는 딥러닝 모델

- **"DeepCut" 관련**: 이 이름의 공개된 시스템/논문은 검색에서 발견되지 않았다. 반증 미발견이 아니라 존재 자체 미확인. 독점/비공개 시스템일 가능성.
- **성숙도**: ML 기반 공구 수명 예측은 시제/양산 (TRL 5-7). 특정 공정·재료 조합에서 실용화.

---

## 5. 실제 산업 사례와 성숙도

### 5.1 성숙도 종합 매트릭스

| 기술 | TRL | 성숙도 | 실제 사용 여부 | 비고 |
|------|-----|--------|--------------|------|
| CAPP-GPT / LLM CAPP | 3-4 | 연구 | 아니오 | 합성 데이터에서만 검증 |
| ARKNESS (KG+RAG) | 4-5 | 연구/시제 | 벤치마크만 | on-premise 가능성 입증 |
| G-code 자동 생성 (LLM) | 2-3 | 연구 | 아니오 | 단순 파트만, 양산 불가 |
| 제조 온톨로지 (MASON 등) | 3-4 | 연구 | 학술 중심 | 산업 ROI 미입증 |
| OntoSTEP (NIST) | 4-5 | 시제 | 연구기관 | 2024 새 구현체 |
| 디지털 트윈 플랫폼 | 7-9 | 양산 | 예 | Siemens/PTC/Azure |
| PINN 공정 시뮬레이션 | 3-4 | 연구 | 아니오 | 학술 수준 |
| Surrogate Model (FEA→ML) | 5-7 | 시제/양산 | 일부 | 특정 공정 한정 |
| 적응 가공 (폐루프) | 5-7 | 시제/양산 | 일부 | Lambda, CAPPSNC |
| CAM Assist (Mastercam) | 8-9 | 양산 | 예 | 1,000+ 공장 |
| CoroPlus / NOVO | 8-9 | 양산 | 예 | 전 세계 |
| ISO 13399 공구 데이터 | 9 | 양산 | 예 | 국제 표준 |

### 5.2 실제 공장에서 작동하는 공정 AI

**작동 확인된 시스템:**
1. **CAM Assist (Mastercam)**: 2024년 7월 출시, 약 1,000개 기계 공장에서 일상 사용 [13]
2. **Sandvik CoroPlus Process Control**: 실시간 가공 데이터 분석으로 적응형 파라미터 추천
3. **Siemens SINUMERIK ONE**: 마이그레이션 고객 20-30% 생산성 향상 보고 [13]
4. **Mars + Azure Digital Twins**: 160개 공장에서 예측 정비 및 폐기물 감소 [14]
5. **Krones + Azure/Ansys**: 시뮬레이션 시간 3-4시간 → 5분 단축 [15]

### 5.3 실패/도입 포기 사례

구체적 기업명이 공개된 실패 사례는 드물지만, 패턴은 명확하다 [16][17]:

- **88%의 조직이 AI를 사용하지만, 1/3만 기업 전체로 확장**. 나머지는 파일럿에서 정체.
- **예측 정비/비전 QC**는 3-6개월 내 ROI 달성이 가능하나, **공정 계획 AI**는 ROI 달성 사례가 거의 없음.
- SME는 대부분 파일럿 단계에서 머물며, 대기업만 스케일링 성공.
- 디지털 트윈의 주요 포기 원인: 데이터 품질 미달, 통합 비용 초과, 전문 인력 부재.

---

## 6. 시너지 연결점

### 설계 지능(상위) ↔ 공정 지능

| 인터페이스 | 데이터 흐름 | 현재 기술 |
|-----------|-----------|-----------|
| CAD → Feature Recognition | 3D 모델 → 피처 목록 | STEP, STEP-NC, OntoSTEP |
| DfM 피드백 | 공정 제약 → 설계 수정 권고 | 규칙 기반 (LLM 확장 가능) |
| 재료/공차 요구 | 설계 의도 → 공정 파라미터 제약 | PLM/PDM 연동 |

### 공정 지능 ↔ 실행 지능(하위)

| 인터페이스 | 데이터 흐름 | 현재 기술 |
|-----------|-----------|-----------|
| 공정 계획 → NC 프로그램 | 오퍼레이션 그래프 → G-code/STEP-NC | CAM, LLM G-code (연구) |
| 공정 파라미터 → MES | 속도/이송/공구 → 작업 지시 | ERP/MES 연동 |
| 현장 피드백 → 공정 적응 | 센서 데이터 → 파라미터 수정 | 적응 가공, DT 폐루프 |
| 품질 데이터 → 공정 개선 | SPC/CMM → 공정 파라미터 조정 | 통계적 공정 관리 + ML |

### 통합 제조 AI에서의 역할

공정 지능 레이어는 설계 의도를 실행 가능한 제조 명령으로 변환하는 **번역 레이어**이다:

```
설계 지능 (무엇을 만들 것인가)
    ↓ [피처, 재료, 공차, 기능 요구]
공정 지능 (어떻게 만들 것인가)  ← 이 문서의 범위
    ↓ [공정 순서, 공구, 파라미터, NC 프로그램]
실행 지능 (실제로 만들기)
    ↑ [센서 피드백, 품질 데이터, 기계 상태]
```

---

## 참고문헌

[1] "CAPP-GPT: A computer-aided process planning-generative pretrained transformer framework for smart manufacturing" — https://www.sciencedirect.com/science/article/pii/S221384632400066X

[2] "Large language models for high-level computer-aided process planning in a distributed manufacturing paradigm" (2026) — https://www.sciencedirect.com/science/article/pii/S073658452600013X

[3] "Knowledge Graph Fusion with Large Language Models for Accurate, Explainable Manufacturing Process Planning" (ARKNESS) — https://arxiv.org/abs/2506.13026

[4] "Large language models for G-code generation in CNC machining: A comparison of ChatGPT-3.5 and ChatGPT-4o" — https://www.researchgate.net/publication/397562415

[5] "GLLM: Self-Corrective G-Code Generation using Large Language Models with User Feedback" — https://arxiv.org/abs/2501.17584

[6] "A new implementation of OntoSTEP for flexible generation of ontology and knowledge graphs of product model data" (NIST, 2024) — https://www.nist.gov/publications/new-implementation-ontostep-flexible-generation-ontology-and-knowledge-graphs-product

[7] "Ontology guided multi-level knowledge graph construction and its applications in blast furnace ironmaking process" (2024) — https://dl.acm.org/doi/abs/10.1016/j.aei.2024.102927

[8] "Toward sustainable process industry based on knowledge graph: a case study of papermaking process fault diagnosis" (2024) — https://link.springer.com/article/10.1007/s43621-024-00259-6

[9] "Document GraphRAG: Knowledge Graph Enhanced Retrieval Augmented Generation for Document Question Answering Within the Manufacturing Domain" — https://www.mdpi.com/2079-9292/14/11/2102

[10] "A knowledge-graph enhanced large language model-based fault diagnostic reasoning and maintenance decision support pipeline towards industry 5.0" — https://www.tandfonline.com/doi/full/10.1080/00207543.2025.2472298

[11] "From LLMs to Knowledge Graphs: Building Production-Ready Graph Systems in 2025" — https://medium.com/@claudiubranzan/from-llms-to-knowledge-graphs-building-production-ready-graph-systems-in-2025-2b4aff1ec99a

[12] "Siemens unveils breakthrough innovations in industrial AI and digital twin technology at CES 2025" — https://press.siemens.com/global/en/pressrelease/siemens-unveils-breakthrough-innovations-industrial-ai-and-digital-twin-technology-ces

[13] "AI-Enabled Manufacturing Programs to Watch in 2025" — https://mastercam.com/news/blog/ai-enabled-manufacturing-programs-to-watch-in-2025

[14] "Leveraging AI and digital twins to transform manufacturing with Sight Machine" (Mars case) — https://azure.microsoft.com/en-us/blog/leveraging-ai-and-digital-twins-to-transform-manufacturing-with-sight-machine/

[15] "Synopsys Demonstrates Framework for Optimizing Manufacturing Processes with Digital Twins at Microsoft Ignite" (Krones case) — https://news.synopsys.com/2025-11-18-Synopsys-Demonstrates-Framework-for-Optimizing-Manufacturing-Processes-with-Digital-Twins-at-Microsoft-Ignite

[16] "Digital Twins in Manufacturing: Separating Hype from Reality" — https://www.wwt.com/article/digital-twins-in-manufacturing-separating-hype-from-reality

[17] "AI Adoption in Manufacturing: Insights, ROI Benchmarks & Trends" — https://tech-stack.com/blog/ai-adoption-in-manufacturing/

[18] "ISO 13399—A Key Step Toward Data-Driven Manufacturing" — https://www.mmsonline.com/articles/iso-13399a-key-step-toward-data-driven-manufacturing

[19] "Predicting cutting tool life: models, modelling, and monitoring" (2024) — https://link.springer.com/article/10.1007/s00170-024-14961-2
