# 제조 실행 지능 레이어 (Manufacturing Execution Intelligence Layer)

> 공장 현장(shop floor)에서 실제로 작동하는 AI 시스템 — 품질 관리, 예측 정비, MES 연동, 센서 데이터 활용에 대한 조사 보고서

---

## 1. AI 기반 품질 관리

### 1.1 인라인 품질 검사 AI (머신비전 + 센서)

**현재 수준: 양산 (TRL 8–9)**

AI 기반 시각 검사는 2025~2026년 기준으로 양산 라인에서 **표준 기술**로 자리잡았다. 핵심 성능 지표는 다음과 같다:

| 지표 | AI 시스템 | 인간 검사원 | 출처 |
|------|-----------|-------------|------|
| 결함 검출 정확도 | 99%+ | ~87% (피로로 저하) | [1] |
| 이미지 분석 속도 | <100ms/장 | 수 초 | [1] |
| 결함률 감소 | 30–40% | 기준선 | [2] |
| ROI 회수 기간 | 6–12개월 | — | [2] |
| 연간 라인당 인건비 절감 | ~$691,200 | — | [2] |

**반도체 분야 사례:**
- NVIDIA의 NV-DINOv2 비전 파운데이션 모델: 자기지도학습(SSL)으로 약 100만 장의 비라벨 이미지로 도메인 적응 후, 600장의 라벨 데이터만으로 **98.51% 정확도** 달성. 기존 범용 모델(93.84%) 대비 4.67%p 향상 [3]
- 웨이퍼 수준 VLM(Cosmos Reason) 접근: few-shot 학습으로 **96%+ 정확도**, 기존 CNN 대비 라벨링 비용 2배 절감 [3]
- 자동 분류로 클린룸 리뷰 인력 **90% 감소**, 사이클 타임 **30% 단축** [4]

**자동차 분야 사례:**
- Samsung Electronics: 시각 + 전자 테스트 파라미터 결합 다단계 ML 시스템으로 고객 반품률 **31% 감소** (18개월 내) — IEEE Journal of Semiconductor Manufacturing [4]
- BMW: 다수 생산 시설에 AI 시각 검사 도입, 결함 검출률 향상 + 재작업 감소 [4]

> **수치 투명성**: $691,200 연간 절감 수치는 인건비만 반영하며, 시스템 도입/운영 비용은 제외된 상태다. 실제 ROI는 시스템 가격($50K–$500K+), 라인 속도, 결함 유형 복잡도에 따라 달라진다. 이 수치가 틀릴 수 있는 조건: 이미 자동화된 라인이거나, 결함 유형이 시각적으로 미묘한 경우.

**엣지 하드웨어 성능:**
- NVIDIA Jetson AGX Orin: 200 TOPS, **<5ms 추론 지연시간**, 15–60W, IP67 등급 [5]
- ResNet-50 기준: FP16 모드에서 **500+ FPS**, SSD MobileNet: **200+ FPS** [5]
- TensorRT 최적화: transformer 기반 모델도 **<30ms** 추론 가능 [5]

### 1.2 SPC + ML (통계적 공정 관리 + 머신러닝 결합)

**현재 수준: 시제~양산 (TRL 6–8)**

전통적 SPC(Shewhart, EWMA, CUSUM 차트)는 단변량/선형 패턴에 강하지만, 현대 제조의 **고차원 비선형 데이터**에서는 한계가 명확하다 [6]:

- 전통 SPC: 사후 반응적(reactive), 높은 오경보율, 다변량 상관관계 포착 불가
- ML 강화 SPC: 실시간 예측적(predictive), LSTM/Autoencoder/Random Forest로 미묘한 이상 감지

**결합 접근법의 핵심:**
1. **다변량 통계 공정 관리(MSPC)**: 센서 데이터를 ML로 분석하여 단변량 SPC → 다변량 SPC로 전환 [6]
2. **자기지도 MSPC(SSMSPC)**: 라벨 없이 공정 센서 데이터에서 이상 패턴을 학습 [6]
3. **반도체 AI-SPC**: XGBoost + SHAP/LIME으로 이상 탐지와 원인 변수 동시 식별 [7]

> **실행 연결**: SPC+ML 결합 시스템이 상위 레이어(공정 지능)에 제공하는 데이터 — 공정 능력 지수(Cpk)의 실시간 변동, 드리프트 경고, 다변량 이상 패턴. 이를 통해 CAPP 시스템이 공정 파라미터를 적응적으로 조정할 수 있다.

### 1.3 불량 원인 분석 (Root Cause Analysis) AI

**현재 수준: 시제~초기 양산 (TRL 5–7)**

전통적 RCA는 결함 발생 후 수동으로 장비 교정, 재료 품질, 공정 파라미터, 환경 요인, 작업자 절차를 점검한다. AI는 이를 **사전 예측적/자동적**으로 전환한다.

**주요 접근법:**

| 방법론 | 특징 | 성숙도 |
|--------|------|--------|
| 상관 기반 ML (XGBoost, RF) | 결함-파라미터 상관관계 식별, 빠름 | 양산 |
| 인과 AI (Causal AI) | 인과관계 모델링, 상관 vs 원인 구분 | 시제 |
| 설명가능 AI (XAI: SHAP, LIME) | ML 예측의 근거 시각화 | 시제~양산 |
| 에이전트 기반 RCA | 다수 데이터 소스 자동 탐색/분석 | 연구~시제 |

**인과 AI의 차별점:** 상관 기반 ML이 "변수 A와 결함이 함께 나타난다"를 보여준다면, 인과 AI는 "작업자 숙련도와 기계 설정이 품질에 가장 강한 **인과적** 영향을 미친다"를 식별한다 [8]. 이는 개입(intervention) 전략 수립에 직결된다.

**실제 사례:** 사출 성형(injection moulding)에서 XAI 기반 RCA — XGBoost로 고/저 결함 시나리오를 분류하고, SHAP/LIME/PDP로 영향 변수를 식별하여 공정 조정에 활용 [9].

> **반증 탐색**: RCA AI의 주요 한계는 데이터 품질 의존성이다. 센서 드리프트, 미기록 변수, 공정 변경 이력 누락 시 인과 추론이 오도될 수 있다. "AI가 원인을 찾았다"는 주장은 데이터 커버리지가 충분한 경우에만 유효하다.

### 1.4 품질 예측 모델

**현재 수준: 시제~양산 (TRL 6–8)**

공정 파라미터(온도, 압력, 속도, 진동 등) → 최종 품질 예측. 이는 SPC의 자연스러운 확장이다.

- 전자 조립 분야: AI 검사 + 로봇 수리 스테이션 연동으로 솔더 결함 **94% 자동 수정**, 인간 개입 제거 [4]
- 핵심 가치: "결함 발생 후 검출" → "결함 발생 전 예방"으로의 패러다임 전환
- 공정 파라미터 실시간 모니터링 → 품질 이탈 예측 → 자동 공정 조정 (closed-loop)

---

## 2. 예측 정비 (Predictive Maintenance)

### 2.1 센서 기반 장비 상태 모니터링

**현재 수준: 양산 (TRL 8–9) — 단, 도입률은 낮음**

회전 기계(펌프, 터빈, 컴프레서, 팬, 기어)를 중심으로 다양한 센서 모달리티가 사용된다 [10]:

| 센서 유형 | 감지 대상 | 하드웨어 예시 | 특징 |
|-----------|-----------|---------------|------|
| 가속도계 (진동) | 불균형, 미정렬, 베어링 결함 | MEMS 가속도계 | 가장 성숙, 핵심 모달리티 |
| 마이크 (음향) | 마찰, 공기 누출, 초기 결함 | MEMS 마이크로폰 | 진동에서 안 보이는 결함 포착 |
| 전류 센서 | 모터 상태, 부하 이상 | Hall effect 센서 | 비침습적 |
| 온도 센서 | 과열, 냉각 이상 | 열전대, IR | 보조 지표 |
| 오일/입자 분석 | 마모, 오염 | 인라인 입자 카운터 | 기어박스/유압 시스템 |

**신호 처리 기법:** FFT, 파워 스펙트럼 밀도, 대역 통과 필터, RMS, 고차 통계량이 결함 시그니처 추출의 핵심이다 [10].

**저비용 IoT 접근:** ESP32 + MEMS 센서(가속도계 + 마이크)로 진동/음향 동시 수집 → RMS/FFT 처리. MEMS 센서의 저비용/저전력/통합 용이성이 중소기업까지 접근성을 확대한다 [10].

**멀티센서 융합:** 단일 센서보다 진동+음향+온도 동시 수집 시 예측 정확도가 향상된다. 이는 베어링 진단 등에서 MEMS 가속도계의 대역폭 한계를 마이크로폰이 보완하는 구조다 [10].

### 2.2 잔여 수명 예측 (RUL)

**현재 수준: 시제~초기 양산 (TRL 5–7)**

| 접근법 | 설명 | 강점 | 한계 |
|--------|------|------|------|
| 물리 기반 모델 | 열화 메커니즘 수학적 모델링 | 해석 가능, 소량 데이터 | 복잡한 시스템 적용 난이 |
| 데이터 기반 ML | LSTM, CNN, Transformer | 복잡한 패턴 포착 | 대량 고장 데이터 필요 |
| 하이브리드 | 물리+데이터 결합 | 양쪽 장점 결합 | 구현 복잡도 높음 |
| 확률적 열화 모델 | 확률분포로 RUL 불확실성 정량화 | 신뢰구간 제공 | 분포 가정 민감 |

밀링 머신 RUL 예측 웹 앱 (2024): ML 기반 RUL 예측 → 정비 일정 최적화 → 제로 다운타임 목표 [11].

> **수치 투명성**: RUL 예측의 정확도는 고장 모드 다양성, 운전 조건 변동성, 센서 수/위치에 크게 의존한다. 논문 환경(통제된 실험)과 실제 양산 라인의 정확도 차이가 클 수 있다. "RUL 정확도 95%"라는 주장이 있다면, 어떤 고장 모드에 대해, 어떤 조건에서인지 확인이 필요하다.

### 2.3 실제 ROI와 실패 사례

**McKinsey 인용 수치 (Imubit 경유)** [12]:
- 비계획 다운타임 **30–50% 감소**
- 정비 비용 **20–30% 절감**
- 처리량 **10–30% 증가**
- ROI 회수: **6개월 미만**

**그러나 현실은 다르다:**

**60–70%의 예측 정비 프로젝트가 목표 ROI를 달성하지 못한다** [13]. 성공적으로 장벽을 해결한 시설만이 85–90% 배포 성공률 + 40–55% 정비 비용 절감을 달성한다.

**실패의 5대 원인** [13][14]:

1. **데이터 과부하 + 낮은 알림 신뢰도**: 하루 수백 건의 미우선순위 알림 → 알림 피로 → 경고 무시. "너무 많은 오경보나 놓친 결함 후, 팀이 경고를 무시하기 시작한다" [14]
2. **레거시 시스템 통합 어려움**: 센서 미장착 구형 장비, CMMS/ERP와의 연동 부재
3. **조직적 저항**: 기술적 한계보다 **문화적 저항, 스킬 갭, 변경 관리 부재**가 실패에 더 큰 영향 [13]
4. **전문 인력 부재**: "인사이트에 따라 행동할 전문성이 없어" 데이터가 방치됨 [14]
5. **센서/AI 기술 품질**: 열악한 환경에서의 센서 내구성, 잘못된 설치, 결함 있는 예측 모델 [14]

> **반증 탐색**: "예측 정비로 다운타임 50% 감소"는 최고 사례(best case)이며, McKinsey 수치는 성공 사례 편향이 있을 가능성이 높다. 60–70% 실패율을 감안하면, 중간값(median) ROI는 이보다 훨씬 낮을 것이다. 시장 규모($10.6B→$47.8B, 2024→2029)는 급성장 중이나, 이는 도입 시도를 반영하지 성공을 반영하지는 않는다 [13].

### 2.4 데이터 인프라 요구사항

**성공적 배포를 위한 최소 인프라:**

| 계층 | 구성 요소 | 역할 |
|------|-----------|------|
| 센서 계층 | MEMS 가속도계, 마이크, 온도, 전류 | 원시 데이터 수집 |
| 엣지 계층 | IoT 게이트웨이 (ESP32~산업용 PC) | 전처리, FFT, 필터링, 로컬 추론 |
| 통신 계층 | MQTT, OPC-UA | 경량 전송, 구조화된 데이터 |
| 플랫폼 계층 | 시계열 DB, ML 파이프라인 | 모델 훈련, 이력 분석 |
| 통합 계층 | CMMS/ERP 연동 | 정비 작업 지시, ROI 추적 |

**단계적 접근이 필수**: 고영향 자산부터 파일럿 → 모듈형 아키텍처로 점진적 확대 → 지속적 모델 재훈련 → IT/정비/운영 간 협업 [11].

---

## 3. MES/MOM 연동과 데이터 파이프라인

### 3.1 MES의 AI 확장

**현재 수준: 시제~초기 양산 (TRL 5–7)**

전통적 MES는 작업 지시, 실적 수집, 추적성(traceability)에 집중한다. AI 확장은 이를 **예측적/자율적** 시스템으로 전환한다 [15]:

| 기능 | 전통 MES | AI 확장 MES |
|------|----------|-------------|
| 품질 관리 | 사후 검사, SPC 차트 | 실시간 ML 이상 감지, 자동 분류 |
| 생산 스케줄링 | 규칙 기반, 정적 | 동적 최적화 (장비 상태, 재고, 주문 우선순위 반영) |
| 정비 | 시간 기반/사후 | 예측 정비 통합 |
| 에너지 | 모니터링만 | ML 수요 예측, 재생에너지 최적화 |
| 의사결정 | 인간 판단 | AI 추천 + 인간 승인 (human-in-the-loop) |

**구현 프레임워크 5원칙** [15]:
1. 명확한 KPI와 전략적 계획
2. IT/OT/운영 간 크로스 기능 협업
3. 파일럿 프로젝트 → 확대
4. 지속적 모델 모니터링/업데이트
5. 핵심 의사결정에 human-in-the-loop 유지

### 3.2 ISA-95 / ISA-88과 AI의 결합

**2025년 ISA-95 업데이트 (ANSI/ISA-95.00.01-2025)** [16]:
- 컨테이너화된 워크로드, 클라우드 하이브리드 아키텍처, 데이터 중심 시스템 지원 강화
- AI/ML 분석, 디지털 트윈, IIoT 플랫폼과의 통합을 위한 **공유 온톨로지와 시맨틱 모델** 제공
- ISA-95의 계층적 구조가 Industry 4.0 기술 도입 시 운영 무결성과 규제 준수를 보장

**ISA-95 계층과 AI 위치:**

```
Level 4: 비즈니스 계획/로지스틱스 (ERP) ← AI: 수요 예측, 공급망 최적화
Level 3: 제조 운영 관리 (MES/MOM)     ← AI: 스케줄링 최적화, 품질 예측 ★실행 지능의 핵심 위치
Level 2: 모니터링/감시/자동 제어 (SCADA) ← AI: 이상 감지, 예측 정비
Level 1: 감지/조작 (센서/액추에이터)    ← AI: 엣지 추론, 실시간 검사
Level 0: 물리적 공정                   ← 데이터 원천
```

> **실행 연결**: ISA-95의 2025 업데이트는 AI를 "별도 시스템"이 아닌 기존 제조 데이터 모델 안에 통합하는 방향을 공식화했다. 이는 공정 지능(상위)과 현장 장비(하위)를 잇는 표준화된 인터페이스를 제공한다.

### 3.3 현장 데이터 프로토콜

| 프로토콜 | 역할 | 특징 | 적합 시나리오 |
|----------|------|------|---------------|
| **OPC-UA** | 구조화된 데이터 교환 | 계층적 데이터 모델 + 메타데이터 + 보안, 결정적 통신 | 공장 내부 PLC/SCADA 연동 |
| **MQTT** | 경량 메시지 전송 | Pub/Sub, 저대역폭/불안정 네트워크에 강함 | 엣지→클라우드, 원격 장비 |
| **OPC-UA PubSub over MQTT** | 두 강점 결합 | OPC-UA의 시맨틱 + MQTT의 효율성 | 현대 IIoT 아키텍처의 표준 |
| **Sparkplug B** | MQTT 구조화 | MQTT 메시지에 일관된 구조/의미 부여 | 로보틱스, 에너지, 의료기기 |
| **MTConnect** | CNC/공작기계 데이터 | RESTful, XML/JSON, 읽기 전용 | 공작기계 모니터링 |

**"OPC UA가 데이터를 조직하고, MQTT가 이동시킨다"** — 이것이 현대 커넥티드 제조의 기본 공식이다 [17].

### 3.4 엣지 컴퓨팅과 실시간 AI 추론

**아키텍처 패턴: 센서 → 엣지 → 클라우드**

```
[센서/PLC] → [OPC-UA/MQTT] → [엣지 게이트웨이] → [요약/예외만] → [클라우드]
                                    │
                                    ├─ 고주파 데이터 수집
                                    ├─ 타임스탬프 정렬, 필터링
                                    ├─ 특징 추출, 실시간 분석
                                    ├─ ML 추론 (품질 검사, 이상 감지)
                                    ├─ Closed-loop 액션 (중지/분류/알림)
                                    └─ 로컬 시계열 DB + 오프라인 버퍼(store-and-forward)
```

**엣지의 역할** [17][18]:
- 시간 임계적 작업을 데이터 원점에서 처리 (지연시간 최소화)
- 대역폭/송신 비용 절감 (요약과 예외만 상위 전송)
- 네트워크 단절 시에도 로컬 운영 지속
- 데이터 주권(data sovereignty) 보장

**클라우드의 역할:**
- 모델 훈련, 플릿 분석, 장기 저장, 엔터프라이즈 리포팅

**최신 연구 (2025):** OPC-UA + Kafka 기반 분산 실시간 데이터 관리 프레임워크 — 엣지 컴퓨팅으로 현장 데이터 처리 속도 향상 + 린 관리 실현 [19]. 디지털 트윈 + 엣지 AI + 연합 학습(Federated Learning) 결합으로 스마트 팩토리 실시간 공동 시뮬레이션 [20].

---

## 4. 현장 데이터 → 상위 레이어 피드백

### 4.1 제조 데이터 → 설계 피드백 (DFM 자동화)

**현재 수준: 시제 (TRL 4–6)**

"인프로세스 및 니어라인 검사가 루프를 닫는다. 프로빙 사이클과 카메라 기반 점검이 CAD/PMI 대비 형상을 비교하고, 공차 이탈을 후속 공정 전에 플래깅한다. 시간이 지나면 그 계측 데이터가 설계와 CAM에 피드백되어 **공차 맵이 실제 공정 능력을 반영하게 된다 — 희망적 사고가 아닌**" [21].

**구체적 메커니즘:**
1. 인라인 계측 데이터 → 공차 달성 능력(Cpk) 통계 축적
2. 축적된 Cpk 데이터가 CAD의 공차 설정에 피드백
3. DFM 도구가 "이 공차는 현재 공정에서 달성 불가"를 설계 단계에서 경고
4. 로우코드 플랫폼이 IoT 센서 + 생산 메트릭 + 품질 시스템을 설계 데이터와 연결 [21]

> **출처 평가**: DFM 자동화 피드백의 대부분 사례는 아직 파일럿/개념 증명 수준이다. 완전 자동화된 "제조 데이터 → 설계 변경" 루프는 연구 단계에 가깝다. [인접 도메인: 항공우주 — 항공 분야의 MBD(Model-Based Definition)가 가장 앞서 있으나, 일반 제조에의 확산은 느림]

### 4.2 공정 데이터 → CAPP 피드백 (Adaptive Process Planning)

**현재 수준: 연구~시제 (TRL 3–5)**

**적응적 공정 계획(Adaptive CAPP):**
- 머신의 진동, 스핀들 부하, 표면 결과를 학습하여 **스텝오버, 진입 동작, 절삭 파라미터를 특정 재료-공구-기계 조합에 맞게 자동 튜닝** [21]
- 결과: 채터 감소, 표면 품질 향상, 사이클 타임 단축, 공구 수명 연장
- 하이브리드 CAPP: 저장된 템플릿 + 새로운 솔루션 생성을 결합 → 다품종 유연 생산 시스템에 적합 [22]

### 4.3 Closed-Loop Manufacturing의 현재 수준

**현재 수준: 연속 공정(화학/석유)은 양산, 이산 제조는 시제**

**Closed-Loop AI의 3단계 사이클** [12]:
1. **데이터 수집**: 초당 수천 개 데이터 포인트 (전통 시스템이 놓치는 미세 변동 포착)
2. **분석**: 딥러닝(비선형 관계) + 강화학습(시행착오 기반 최적 전략)
3. **자동 조정**: AI가 DCS/PLC에 직접 명령 기록, 세트포인트 실시간 조정

**전통 vs Closed-Loop:**
- 전통: 주간/월간 단위로 세트포인트 업데이트
- Closed-Loop AI: **수 분 단위**로 업데이트
- "고정 규칙이나 주기적 튜닝에 의존하는 전통 시스템과 달리, AIO는 라이브 데이터에서 지속적으로 학습하고, 최적 결과를 예측하며, 즉시 행동한다" [12]

**실행 장벽:**
- 센서 건강 상태/데이터 커버리지 부족
- 센서 드리프트 등 데이터 품질 문제
- 사이버보안 (SOC 2 수준 프로토콜 필요)
- OT-IT 브릿지 구축
- 운전원 수용성/변경 관리

> **실행 연결**: Closed-loop 시스템이 상위 레이어에 제공하는 것 — 공정 파라미터-품질 관계의 실시간 학습 모델, 최적 운전 조건 데이터, 공정 능력의 동적 맵. 이 데이터가 공정 지능(CAPP)에 피드백되면 "양산 조건에서 검증된" 공정 계획이 가능해진다.

---

## 5. 실제 산업 사례와 성숙도

### 5.1 기술별 성숙도 매트릭스

| 기술 | 성숙도 | TRL | 양산 사례 산업 | 핵심 장벽 |
|------|--------|-----|----------------|-----------|
| 인라인 머신비전 검사 | **양산** | 8–9 | 반도체, 자동차, 전자, 식품 | 결함 유형 다양성, 초기 라벨링 비용 |
| SPC + ML | **시제~양산** | 6–8 | 반도체, 정밀 가공 | 다변량 모델 해석, 오경보 관리 |
| RCA AI (상관 기반) | **시제~양산** | 6–7 | 사출 성형, 전자 조립 | 데이터 커버리지, 인과 vs 상관 |
| RCA AI (인과 기반) | **시제** | 5–6 | 파일럿 | 도메인 전문가 필요, 복잡도 |
| 예측 정비 (진동/음향) | **양산** | 8–9 | 모든 회전 기계 | 60–70% 프로젝트 ROI 미달 |
| RUL 예측 | **시제~초기 양산** | 5–7 | 항공 엔진, CNC | 고장 데이터 부족, 다양한 운전 조건 |
| MES AI 통합 | **시제~초기 양산** | 5–7 | 대기업 파일럿 | 레거시 MES 호환, 표준화 |
| Closed-Loop AI 제어 | **양산(연속)/시제(이산)** | 7–9/4–6 | 화학, 석유 / 기계가공 | 안전 인증, OT-IT 통합 |
| 제조→설계 피드백 | **시제** | 4–6 | 항공우주 MBD | 데이터 표준, 조직 사일로 |
| Adaptive CAPP | **연구~시제** | 3–5 | 학술 연구 | 범용화 어려움 |

### 5.2 산업별 주요 사례

**반도체:**
- 웨이퍼 결함 자동 분류: 클린룸 인력 90% 감소, 사이클 타임 30% 단축 [4]
- 비전 파운데이션 모델(NV-DINOv2): 98.51% 정확도, 라벨링 비용 2배 절감 [3]

**자동차:**
- BMW: 다수 시설 AI 시각 검사 도입 [4]
- Samsung (칩): 다단계 ML로 고객 반품률 31% 감소 [4]

**일반 제조:**
- 전자 조립: AI 검사 + 로봇 솔더 수리 94% 자동화 [4]
- 인라인 검사 ROI: 라인당 $691K/년 인건비 절감, 6–12개월 회수 [2]

**연속 공정 (화학/석유):**
- Closed-Loop AI: 처리량 10–30% 증가, 비계획 다운타임 30–50% 감소 [12]

### 5.3 도입 장벽 종합

| 장벽 | 영향도 | 해결 방향 |
|------|--------|-----------|
| **데이터 품질** | 최고 | 센서 건강 관리, 데이터 거버넌스, 메타데이터 표준화 |
| **레거시 장비** | 높음 | 레트로핏 센서, IoT 게이트웨이, 단계적 현대화 |
| **조직 저항** | 높음 (기술보다 중요) | 변경 관리, 파일럿 성공 사례, 크로스 기능 팀 |
| **인력/스킬 갭** | 높음 | 전담 CME(Condition Monitoring Engineer), 교육 |
| **비용** | 중간 | 고영향 자산 우선, 단계적 확대, ROI 추적 |
| **사이버보안** | 중간~높음 | OT/IT 분리, SOC 2, 엣지 우선 아키텍처 |
| **표준화 부재** | 중간 | ISA-95 2025, OPC-UA PubSub, Sparkplug B |

---

## 6. 시너지 연결점: 실행 지능의 인터페이스 역할

실행 지능 레이어는 **공정 지능(상위)과 현장 장비(하위)를 잇는 핵심 인터페이스**다.

### 하위(현장 장비) → 실행 지능으로 올라오는 데이터:
- 센서 원시 데이터 (진동, 온도, 전류, 이미지)
- PLC/SCADA 공정 파라미터
- 장비 상태/알람

### 실행 지능 → 상위(공정 지능/설계 지능)로 올려보내는 데이터:
- 실시간 공정 능력(Cpk) 및 드리프트 경고
- 장비 건강 상태 및 RUL 예측
- 품질-공정파라미터 관계 모델 (어떤 파라미터가 품질에 가장 영향을 미치는가)
- 공차 달성 통계 (설계 피드백용)
- RCA 결과 (어떤 원인이 어떤 결함을 유발하는가)
- 실제 사이클 타임, 수율, 에너지 소비 데이터

### 실행 지능 → 하위(현장 장비)로 내려보내는 제어:
- 공정 파라미터 자동 조정 (closed-loop)
- 결함 기반 즉시 중지/분류 명령
- 적응적 절삭 조건 변경
- 정비 작업 지시

---

## 참고문헌

[1] Overview.ai, "AI Inspection Systems for Manufacturing: Complete 2025 Guide" — https://www.overview.ai/blog/ai-inspection-systems-manufacturing/

[2] Ombrulla, "AI Visual Inspection in Manufacturing: 2026 Complete Guide" — https://ombrulla.com/blog/ai-visual-inspection-manufacturing-guide-2026 ; Rock-and-River, "AI Quality Control Systems: Reduce Manufacturing Defects 37%" — https://rock-and-river.com/ai-driven-quality-control-how-machine-vision-systems-cut-defects-by-37-and-deliver-roi-in-6-months/

[3] NVIDIA Developer Blog, "Optimizing Semiconductor Defect Classification with Generative AI and Vision Foundation Models" — https://developer.nvidia.com/blog/optimizing-semiconductor-defect-classification-with-generative-ai-and-vision-foundation-models/

[4] Tech-Stack, "Visual AI in Manufacturing Cuts Defects and Boosts Yield" — https://tech-stack.com/blog/visual-ai-reduces-defects-boosts-manufacturing-yield/ ; Sixsense.ai, "AI-Powered Auto-Defect Classification" — https://sixsense.ai/blog/revolutionizing-chip-manufacturing-ai-powered-auto-defect-classification/

[5] NVIDIA Developer Blog, "Accelerate AI Inference for Edge and Robotics with NVIDIA Jetson T4000" — https://developer.nvidia.com/blog/accelerate-ai-inference-for-edge-and-robotics-with-nvidia-jetson-t4000-and-nvidia-jetpack-7-1/ ; NVIDIA Blog, "Startups NVIDIA Jetson-Enabled Inspections Boost Manufacturing" — https://blogs.nvidia.com/blog/startups-nvidia-jetson-enabled-inspections-boost-manufacturing/

[6] Springer, "SSMSPC: Self-supervised Multivariate Statistical In-process Control" — https://link.springer.com/article/10.1007/s10845-023-02156-7 ; IJSRM, "AI-Enabled SPC for Semiconductor Manufacturing" — https://ijsrm.net/index.php/ijsrm/article/view/6439

[7] Acerta.ai, "Anomaly detection beats SPC for managing quality" — https://acerta.ai/blog/spc-vs-anomaly-detection-methods-to-manage-quality/

[8] Databricks Blog, "Manufacturing Root Cause Analysis with Causal AI" — https://www.databricks.com/blog/manufacturing-root-cause-analysis-causal-ai

[9] arXiv, "Explainable AI for Correct Root Cause Analysis of Product Quality in Injection Moulding" — https://arxiv.org/abs/2505.01445

[10] MDPI, "A Review on Vibration Monitoring Techniques for Predictive Maintenance" — https://www.mdpi.com/2673-4117/4/3/102 ; PMC, "Low-Cost IoT-Based Predictive Maintenance Using Vibration" — https://pmc.ncbi.nlm.nih.gov/articles/PMC12609400/

[11] PMC, "Prediction of the Remaining Useful Life of a Milling Machine Using Machine Learning" — https://pmc.ncbi.nlm.nih.gov/articles/PMC11836486/ ; Springer, "Advanced ML for Predictive Maintenance: A Case Study on RUL" — https://link.springer.com/article/10.1007/s00170-024-13351-y

[12] Imubit, "Closed-Loop AI in Manufacturing: Sustaining Process Gains" — https://imubit.com/article/closed-loop-ai-in-manufacturing/ (McKinsey 수치 인용)

[13] Springer, "Unlocking the Potential of Predictive Maintenance for Intelligent Manufacturing" — https://link.springer.com/article/10.1007/s41471-024-00204-3 ; ScienceDirect, "Systematic Review of Predictive Maintenance Practices in Manufacturing" — https://www.sciencedirect.com/science/article/pii/S2667305325000274

[14] AssetWatch, "Why Most Predictive Maintenance Systems Fail" — https://www.assetwatch.com/blog/predictive-maintenance-challenges

[15] Plant Engineering, "How to Optimize Manufacturing Processes Through AI Integration with MES" — https://www.plantengineering.com/how-to-optimize-manufacturing-processes-through-ai-integration-with-mes/

[16] ISA, "Update to ISA-95 Standard (ANSI/ISA-95.00.01-2025)" — https://www.isa.org/news-press-releases/2025/april/update-to-isa-95-standard-addresses-integration-of ; Industrial Cyber, "New ISA-95 Standard Enhances IT/OT Convergence" — https://industrialcyber.co/regulation-standards-and-compliance/new-isa-95-standard-enhances-it-ot-convergence-for-industrial-automation/

[17] Andrews Cooper, "OPC UA and MQTT: The Data Connection Driving the Future of Automation" — https://www.andrews-cooper.com/tech-talks/opc-ua-and-mqtt-automation/ ; OPC Foundation, "OPC UA + MQTT" — https://opcconnect.opcfoundation.org/2019/09/opc-ua-mqtt-a-popular-combination-for-iot-expansion/

[18] Avassa, "The Future of Smart Factories: Edge Computing in Manufacturing" — https://avassa.io/articles/smart-factories-edge-computing-manufacturing/

[19] MDPI Applied Sciences, "Distributed Real-Time Data Management Framework Based on Edge Computing with OPC UA and Kafka" — https://www.mdpi.com/2076-3417/15/12/6862

[20] Nature Scientific Reports, "Digital Twin Driven Smart Factories: Real-Time Edge AI and Federated Learning" — https://www.nature.com/articles/s41598-025-28466-9

[21] Medium, "Closing the Loop: Revolutionizing Manufacturing with Feedback-Driven Systems" — https://medium.com/@MSR007/closing-the-loop-revolutionizing-manufacturing-with-feedback-driven-systems-7e8627eadfc0 ; Imubit, "Manufacturing Process Control: Closed Loop Optimization Guide" — https://imubit.com/article/manufacturing-process-control/

[22] MechRocket, "Computer-Aided Process Planning (CAPP): A Complete Guide" — https://www.mechrocket.com/2025/10/computer-aided-process-planning-capp.html ; CLEVR, "The 2025 Guide to Design for Manufacturing (DFM)" — https://www.clevr.com/blog/the-2025-guide-to-design-for-manufacturing-dfm
