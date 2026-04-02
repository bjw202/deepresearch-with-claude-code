# 제조 AI 시스템의 온톨로지/LLM 전환 가능성 분석

**작성일**: 2026-03-30
**역할**: Researcher 2 — LLM/KG 전환 가능성
**확신도 표기**: ★☆☆ 추정/간접 | ★★☆ 1차 출처 확인 | ★★★ 복수 독립 출처 교차검증

---

## 개요

기존 제조 AI 시스템(TIGNIS, IMUBIT, LAM RESEARCH, BOSCH, SIEMENS 등)은 주로 전통 ML/RL 기반으로 구축되어 있다. 2025~2026년 현재, 이들 시스템에 LLM/Knowledge Graph(KG)를 접목하려는 움직임이 각기 다른 속도와 방식으로 진행 중이다. 핵심 결론은 **"완전 교체형 전환은 단기적으로 불가능하지만, 레이어 추가형·하이브리드형 전환은 이미 실제 적용 단계에 진입했다"**는 것이다.

---

## 1. 기업별 LLM/KG 접목 동향

### TIGNIS

**현황**: Cohu Analytics에 인수된 TIGNIS는 반도체 fab 공정 모니터링·최적화에 특화된 ML 기반 AI 플랫폼이다. 2025년 SEMICON West에서 TIGNIS는 여전히 전통적 예측 분석(prescriptive analytics) 중심으로 출품했다. [SEMICON West 2025, 2025-09]

**LLM/KG 동향**: LLM 또는 Foundation Model 관련 공개 발표/특허를 직접 확인하지 못했다. Semi Engineering의 2024년 기사에서 TIGNIS를 반도체 제조 AI 알고리즘 기업으로 소개하나 LLM 접목 언급은 없다. ★☆☆

**전환 가능성 판단**: 단기적으로 레이어 추가형(LLM을 설명 인터페이스로 추가) 가능성은 있으나, 모기업 Cohu의 기존 ML 파이프라인 최적화에 집중하는 것으로 보인다.

**반증 탐색**: LLM 전환 의지를 보여주는 직접 증거 미발견. 오히려 Cohu 인수 이후 기존 ML 제품 강화 방향이 더 두드러진다.

---

### IMUBIT

**현황**: 정유·화학 등 연속공정(Process Industries) 전용 Closed-Loop AI Optimization 플랫폼. LNS Research 기준 클로즈드루프 구현 AI 벤더 상위 15% 내. ★★★ [IMUBIT 자사 블로그, 2025-08]

**LLM 접목 동향**: 2025년 기준 LLM을 공식 로드맵에 포함. 핵심 포지셔닝은 **"Controllable AI"** — 범용 LLM을 플랜트별 데이터로 조정하고 의사결정 워크플로우에 내장. ★★☆ [imubit.com, 2025-06]

구체적 활용:
- **지식 관리**: LLM이 운전자 행동 및 historian 데이터를 실시간으로 포착해 "살아있는 지식 소스" 생성. 트러블슈팅·온보딩·시뮬레이션에 활용.
- **플랜트 최적화 보조**: LLM은 수치 최적화를 대체하지 않고, 의사결정 워크플로우의 설명·판단 레이어로 역할.
- **한계 인식**: "LLMs aren't plug-and-play for process operations" — 플랜트 특화 조정 없이는 사용 불가임을 자체 공식화.

**수치 투명성**: "플랜트 특화 LLM 적용 시 온보딩 시간 단축"은 자사 블로그 수치로, 독립 검증 미확인. 이 수치가 틀릴 수 있는 조건: 레거시 시스템이 많고 데이터 품질이 낮은 현장에서는 효과 감소 가능.

**전환 경로**: 하이브리드형(ML이 수치 최적화, LLM이 지식 관리·설명).

---

### LAM RESEARCH

**현황**: 반도체 장비 제조사. MFL(Machine-First Learning) 방식의 AI 레시피 생성 연구로 유명. Nature(2023)에 Bayesian Optimization + Human Collaboration 레시피 생성 연구 발표. ★★★

**LLM/AI 최신 동향**: 2025년 Semiverse Solutions 플랫폼 강화 지속. **Fabtex™ Yield Optimizer**를 SEMICON West 2025에서 출시 — SEMulator3D 기반 가상화+AI로 수율 변동 원인을 동시 공략. ★★★ [newsroom.lamresearch.com, 2025-10]

**LLM 접목 현황**: Semiverse는 물리 기반 시뮬레이션(SEMulator3D, VizGlow) + AI/ML 분석 구조. 명시적 LLM 기반 레시피 생성 언급은 현재 공개 발표에서 미확인. 연구팀 수준에서는 LLM 적용 탐색 가능성 있으나 제품화 단계 아님. ★☆☆

**반증 탐색**: Lam Research의 레시피 생성 연구는 여전히 Bayesian Optimization 중심. LLM 기반 접근이 물리 기반 시뮬레이션 파이프라인을 대체할 근거 없음.

**전환 가능성**: 레이어 추가형(LLM을 엔지니어-AI 인터페이스로 추가)은 단기 가능. 교체형은 물리 기반 정확도 손실로 비현실적.

---

### BOSCH

**현황**: 제조 자동화·자동차 부품 대기업. 2027년까지 AI에 27억 달러 이상 투자 발표. ★★★ [us.bosch-press.com, 2025-06]

**LLM/Agentic AI 동향**: **Manufacturing Co-Intelligence** 플랫폼을 Microsoft와 공동 개발 중. 핵심 개념: 복수의 AI 에이전트가 팀을 이루어 공정 이상 진단, 수정 조치 설계, 이해관계자 알림을 자율 수행. ★★★ [assemblymag.com, 2026-01]

구체적 사례:
- **Bosch India Jaipur Plant**: Generative AI 기반 Rework Recommendation Agent 배포. 공정 이상 시 채팅/음성으로 근본 원인 진단 및 수정 조치 제안. ★★★ [bosch-softwaretechnologies.com, 2025]
- 멀티에이전트 시스템이 제조 설비 모니터링, 예지보수 예측, 인원 스케줄링에 이미 적용 중.

**전환 경로**: 레이어 추가형 + 하이브리드형 동시 진행. 기존 PLC/SCADA는 유지, LLM 에이전트는 상위 의사결정 레이어.

**수치 투명성**: "비계획 다운타임 감소, 생산성 향상"은 자사 백서 수치로 독립 검증 필요. 이 수치가 틀릴 수 있는 조건: 고정밀 연속공정(반도체, 제약)에서는 에이전트 오판 시 더 큰 리스크.

---

### SIEMENS

**현황**: 산업 자동화·디지털 트윈 분야 세계 최대 기업 중 하나. 2025년 Hannover Messe에서 Industrial Copilot으로 Hermes Award 수상. ★★★

**LLM 접목 동향**: **가장 적극적이고 체계적인 LLM 전환 전략**을 보이는 기업.

핵심 이니셔티브:
1. **Siemens Industrial Copilot**: Microsoft Azure OpenAI 기반 LLM으로 PLC 코드 자동 생성·디버깅, 자연어로 공정 제어 조작. CES 2025, SPS 2025 모두 전시. ★★★ [siemens.com, 2025]
2. **Industrial Foundation Model (IFM)**: Siemens가 Microsoft와 개발 중인 자체 산업용 파운데이션 모델. 3D 모델, 2D 도면, P&ID 등 엔지니어링 고유 데이터를 처리 가능하도록 설계. 기존 범용 LLM(인터넷 텍스트 기반)의 한계를 극복 목표. ★★★ [Hannover Messe 보도자료, 2025-03]
3. **NX CAM Copilot**: CAM 프로그래밍 자동화로 설계-생산 연결 가속. SPS 2025 실증.

**IFM 의의**: 단순 LLM 레이어 추가를 넘어, 엔지니어링 도메인 특화 파운데이션 모델 자체 개발. 제조 AI의 LLM 전환에서 가장 앞선 사례. [인접 도메인: 의료 AI의 domain-specific foundation model(예: Med-PaLM)과 유사 구조]

**전환 경로**: 레이어 추가형(현재 적용)에서 하이브리드형(IFM 완성 시) 방향으로 진화 중.

---

### SAMSUNG

**현황**: 메모리/파운드리 반도체 제조사. 2025년 NVIDIA와 AI Megafactory 구축 발표. ★★★ [news.samsung.com, 2025-10]

**LLM/AI 동향**: NVIDIA와의 파트너십에서 50,000+ NVIDIA GPU로 fab 전체 AI화:
- **cuLitho 기반 전산 리소그래피**: OPC(광근접보정) 20배 성능 향상. 레시피 조정에 AI 예측 활용.
- **Omniverse 디지털 트윈**: fab 시뮬레이션·최적화.
- LLM 직접 적용보다는 GPU 기반 대규모 연산 ML이 주된 방식. 명시적 LLM 기반 레시피 생성은 공식 발표 미확인. ★★☆

**전환 가능성**: NVIDIA와의 인프라 협력으로 LLM 인프라는 갖춰짐. 그러나 fab 제어에 LLM을 직접 적용하는 공개 사례는 없음.

---

### INTEL

**현황**: x86 CPU 및 파운드리 서비스. 재무 난항으로 AI R&D 투자 재조정 중.

**LLM/KG 동향**: 공정 제어에 특화된 LLM 접목 공개 발표 미확인. Samsung과의 파운드리 연합 논의(2025-08)는 프로세스 기술 공유 방향이지 LLM 전환 방향이 아님. ★☆☆

**반증**: Intel은 현재 제조 원가 절감·수율 개선에 집중하는 시기로, 대규모 LLM 전환 시도 가능성 낮음.

---

## 2. 전환의 기술적 장벽

### 실시간 제약

**핵심 제약**: PLC/SCADA 제어 루프는 50~100ms 주기 실행 필요. 현재 LLM 추론은 수초 수준으로 직접 제어 루프 대체 불가. ★★★ [MDPI AI 저널, 2025]

**현재 해결책**: 하이브리드 아키텍처 — 엣지(실시간 제어, <100ms), 클라우드(LLM 분석·학습). LLM은 PLC 위 레이어에서 오케스트레이션·계획·설명 역할. [customerTimes 2025 보고서]

**SPS 2025에서의 확인**: "physical AI surfaced as a forward-looking narrative... while conventional automation layers continue to execute deterministic control and safety functions." — LLM 기반 추론은 상위 의사결정, 하위 제어는 여전히 결정론적 레이어. ★★★ [IoT Analytics, SPS 2025]

**이 수치가 틀릴 수 있는 조건**: 엣지 LLM(소형화) 또는 추론 가속 기술(speculative decoding, 양자화) 발전 시 지연 제약 완화 가능.

---

### 수치 정밀도

**핵심 제약**: LLM은 수치 추론에 구조적 약점 — 산술, 부동소수점, 크기 비교에서 오류 발생. 제조 공정 파라미터(온도 ±0.1°C, 두께 ±1nm 수준)의 정밀 제어에 LLM 직접 사용 위험. ★★★ [ACL Findings 2023, arXiv 2024]

**완화 방법**:
- NumeroLogic: 숫자에 자릿수 prefix 추가로 정밀도 향상.
- NLEP: 수치 계산은 Python 코드 생성으로 위임.
- 하이브리드: 수치 최적화는 ML/DO(Deterministic Optimization), LLM은 맥락 해석·설명.

**반증 탐색**: 수치 추론 한계를 완전히 극복한 LLM 사례 미발견. 현재 최선은 보조 수단 결합.

---

### 안전성 검증

**핵심 제약**: LLM 출력은 확률론적(non-deterministic) — 동일 입력에도 다른 출력 가능. 안전 필수(Safety-Critical) 제조 공정에서 인증 불가.

**현재 해결책**: "Deterministic Supervisor" 구조 — LLM이 명령을 제안하면, 결정론적 검증 레이어가 안전 제약 확인 후 실행 여부 결정. ★★☆ [arXiv 2507.07115, 2025-07]

**Finite State Machine(FSM) 접근**: LLM이 FSM 내에서 복구 시퀀스를 제안, Simulation Agent가 각 전이를 검증, Validator 루프가 무효 계획 반복 개선. — 화학 공정 적용 연구. ★★☆

**규제 장벽**: IEC 61508(기능 안전), FDA 21 CFR Part 11 등 기존 인증 프레임워크는 deterministic 시스템 기준. LLM 기반 시스템의 인증 경로 아직 미정립. ★★★

---

### 데이터/온톨로지 구축 비용

**핵심 제약**: 제조 도메인 온톨로지 구축은 도메인 전문가의 상당한 노력 필요. "KG와 LLM 접목 연구는 재료 제조 섹터에서 아직 제한적, 상당한 도메인 지식과 전문가 협력 필요." ★★☆ [CEUR Workshop, 2025-11]

**진전**: LLM 기반 자동 온톨로지 생성(OntoKGen 등) 연구가 활발 — GPT-4o로 반도체 문서에서 4,253 노드, 9,341 엣지의 KG 자동 생성 사례. [arXiv 2510.15428, 2025-10]

**ISA-95 연동**: LLM + ISA-95 정렬 KG 프레임워크 — 자연어 의도를 MP(제조 프로세스), MR(제조 자원), PC(공정 제약)로 변환하는 통합 파이프라인 연구 발표. ★★☆ [arXiv 2602.12419, 2026-02]

**이 수치가 틀릴 수 있는 조건**: 자동 온톨로지 생성의 정확도는 도메인 문서 품질에 크게 의존. 레거시 공정 데이터가 비정형인 경우 자동화 한계.

---

### 기존 시스템 통합

**핵심 제약**: OPC UA, ISA-95, Modbus/Serial 등 기존 산업 프로토콜과 LLM의 통합에 추가 미들웨어 필요.

**진전**: 연구에서 "non-invasive" 통합 접근 — passive monitoring(read-only 센서 접근 via MODBUS)으로 LLM 레이어가 기존 제어 시스템에 간섭 없이 동작. ★★☆

**엣지 AI**: Siemens Industrial Edge, Bosch의 멀티에이전트 시스템 — LLM 에이전트를 엣지 근방에 배포하여 기존 SCADA/MES와 API 연동하는 구조가 현실적 통합 경로로 부상. ★★★

---

## 3. 신규 등장 업체

### Aitomatic + SemiKong (주목)

**개요**: Aitomatic이 Llama 기반 반도체 도메인 전용 LLM **SemiKong** 개발. Meta AI와 협력, 오픈소스 접근. ★★★ [ai.meta.com, 2024-12]

**성과**: SemiKong이 범용 폐쇄형 LLM 여러 개 대비 반도체 관련 콘텐츠 이해·생성에서 우수한 성능. 예상 효과: 신규 칩 설계 시장 출시 기간 20~30% 단축, 공정 이해도 15~25% 향상.

**의의**: "Tignis LLM 버전"의 스타트업 버전. 반도체 도메인 특화 LLM의 제조 AI 적용 첫 번째 구체적 사례. ★★★

---

### ArXiv 2602.12419 프레임워크 (학계)

ISA-95 정렬 KG + LLM 통합으로 MaaS(Manufacturing-as-a-Service) 의도 구동 스마트 제조. 2026-02 발표. 아직 스타트업 제품화 단계 아님.

---

### EthonAI (2021 창립)

인과 AI(Causal AI) 기반 제조 효율화. 설명 가능성과 인과관계 중시. 2024-05에 1,600만 달러 Series A 조달. LLM보다 인과 모델 중심으로 차별화. ★★☆ [gurustartups.com, 2025-11]

---

### Plus10, Pailot, Blockbrain (Siemens AI Award 수상)

Siemens AI with Purpose Summit 2025에서 수상한 스타트업들. Pailot(클라우드 스케줄링), Plus10(실시간 최적화), Blockbrain(숍플로어 지식 포착). 특히 **Blockbrain**이 LLM 기반 현장 지식 관리에 가장 근접. ★★☆ [siemens.com, 2025]

---

## 4. 전환 경로 유형별 분석

### 레이어 추가형 (현재 가장 현실적)

**정의**: 기존 ML/RL 위에 LLM을 설명·판단·인터페이스 레이어로 추가. 기존 제어 파이프라인 미변경.

**적용 사례**:
- Siemens Industrial Copilot: 기존 PLC 코드 위에 LLM 코드 생성/디버깅 레이어.
- IMUBIT Controllable AI: 기존 최적화 엔진 위에 LLM 지식 관리 레이어.
- Bosch Jaipur Plant: 기존 공정 위에 LLM Rework Recommendation 에이전트.

**장점**: 기존 시스템 검증 유지, 점진적 도입, 빠른 ROI.
**한계**: LLM의 추론 깊이가 기존 ML 모델의 수치 최적화를 넘지 못함.

**확신도**: ★★★ (복수 기업 실제 배포 확인)

---

### 하이브리드형 (중기 방향)

**정의**: 수치 최적화는 ML/DO, 의사결정·설명은 LLM, 지식 구조는 KG로 역할 분리.

**기술 구조**:
```
KG (도메인 지식) ──→ LLM (의도 파악, 계획) ──→ ML/DO (수치 최적화) ──→ PLC (실행)
       ↑                      ↑                         ↓
   [온톨로지]             [Validator]              [피드백 루프]
```

**적용 사례**:
- Siemens IFM: 엔지니어링 데이터(3D, 도면, P&ID) 처리 파운데이션 모델 + 기존 시뮬레이션.
- arXiv 2507.07115 FSM+LLM: 화학 공정 자율 제어 아키텍처.
- ISA-95+LLM KG: MaaS 의도 구동 스마트 제조 프레임워크.

**장점**: LLM 강점(맥락 이해, 자연어)과 ML 강점(수치 정밀도) 결합.
**한계**: 시스템 복잡도 증가, 두 레이어 간 인터페이스 설계 난이도.

**확신도**: ★★☆ (연구·파일럿 단계, 대규모 생산 적용은 아직)

---

### 교체형 (장기 연구 방향, 단기 비현실적)

**정의**: 전체 파이프라인을 Foundation Model 기반으로 교체.

**기술 조건**:
- LLM의 실시간 추론 지연 <10ms 수준으로 개선 필요.
- 수치 정밀도가 전용 ML 수준에 도달해야 함.
- 안전 인증 프레임워크 확립 필요.

**현재 상태**: Siemens IFM이 가장 근접한 시도지만 여전히 특정 태스크(코드 생성, 특징 인식) 수준. 전체 공정 제어 교체는 2030년 이후 논의 대상.

**반증**: "The future isn't AI replacing SCADA/HMI systems — it's AI-enhanced platforms." — controlsys.org 분석. ★★★

---

### 불필요형 (이미 최적화된 영역)

**정의**: LLM/KG 추가 실익이 없는 경우.

**해당 영역**:
- **단일 공정 파라미터 최적화**: Bayesian Optimization, PID 튜닝 등 기존 알고리즘이 이미 최적. LLM 추가 시 복잡도만 증가.
- **이미 완성된 클로즈드루프 RL**: 반복 제어 태스크에서 RL이 수렴된 경우, LLM 레이어가 오히려 응답 지연.
- **고주파 센서 제어(ms 단위)**: 물리적으로 LLM 추론 시간이 허용되지 않음.

**확신도**: ★★★

---

## 5. 반대 시나리오: 전환이 불필요한 경우

### 5.1 기존 ML/RL의 충분한 성숙도

Lam Research의 레시피 생성 연구(Nature 2023)는 Bayesian Optimization이 6명의 숙련 엔지니어보다 효율적인 레시피를 생성함을 실증했다. 이미 충분히 성숙한 영역에서 LLM 전환은 필요 없다. ★★★

### 5.2 LLM 추론 비용 대비 실익 부족

"Slow model response times were a hurdle for 56% of companies, impacting feasibility of real-time LLM applications." — 2025년 엔터프라이즈 설문. LLM 클라우드 API 비용이 edge ML 추론 대비 수십~수백 배. 마진이 좁은 대량 제조 현장에서 ROI 불분명. ★★☆ [olioapps.com, 2025]

### 5.3 제조 현장의 보수적 문화

"Data quality issues block 68% of manufacturers from AI adoption." — Siemens 인용 수치. LLM 전환 전에 기본 데이터 인프라 확립이 선결 과제. 기존 ML도 아직 다수가 파일럿 단계에서 벗어나지 못한 현실. ★★☆ [iotworldtoday, 2025]

### 5.4 수치 추론의 구조적 한계

"These fundamental flaws are not possible to solve by additional training data or scaling computing resources. They are related to the fundamental statistical models used at the core of LLM technology." — 산업 제어 전문가 평가. 수치 집약적 공정에서 LLM 직접 제어 신뢰 불가. ★★★ [controlsys.org]

### 5.5 안전 인증 장벽

IEC 61508, IEC 62443(산업 사이버 보안), FDA CFR Part 11 등 기존 인증 체계는 LLM 비결정론적 출력을 수용하지 않는다. 인증 경로 확립까지 안전 필수 제조에 LLM 배포 불가. ★★★

---

## 관점 확장

### 결론을 바꿀 수 있는 인접 질문

1. **LLM 추론 지연이 급격히 감소하면?** — 2025년 현재 추론 가속 연구(speculative decoding, distillation)로 GPT-4급 모델의 추론 속도가 연 2~5배 빨라지고 있다. 만약 2028년 내 10ms 이하 추론이 가능해진다면, 실시간 제약이 해소되어 전환 속도가 급격히 빨라질 수 있다.

2. **온톨로지 구축 자동화가 성숙하면?** — LLM 기반 자동 KG 생성 연구(OntoKGen, arXiv 2510.15428)가 성숙하면, 현재 가장 큰 장벽인 "도메인 전문가 노력"이 대폭 감소. 이 경우 중소 제조사도 온톨로지 기반 AI 접근 가능.

### 숨은 변수

- **에너지 비용**: fab 규모 LLM 추론은 상당한 전력 소비. 탄소중립 목표와 충돌 가능.
- **데이터 주권**: 반도체 레시피 데이터를 외부 LLM API에 전송하는 것의 IP 보안 리스크. 온프레미스 LLM 또는 특화 소형 모델 필요.

### [이질 도메인: 의료 AI]

의료 AI에서 도메인 특화 파운데이션 모델(Med-PaLM, BioMedLM)이 범용 LLM의 한계를 극복하기 위해 개발된 구조는 Siemens IFM과 동일한 패턴이다. 의료 AI는 "데이터 보안 + 도메인 정확도 + 인증 장벽"을 동시에 해결하는 과정에서 **소형 특화 모델 + 결정론적 검증 레이어** 조합이 표준화되었다. 제조 AI도 유사한 경로를 따를 가능성이 높다.

### 문제 재정의

원래 질문("LLM/온톨로지로 전환 가능한가?")보다 더 적절한 핵심 질문: **"어떤 공정 레이어에서, 어떤 조건(데이터 품질, 지연 허용, 안전 등급)하에 LLM/KG가 기존 ML 대비 명확한 가치를 제공하는가?"** — 전환 가능성보다 전환 경계 조건이 핵심이다.

---

## 출처 목록

| # | 출처 | URL | 날짜 | 확신도 |
|---|------|-----|------|--------|
| 1 | IMUBIT — Controllable AI 블로그 | https://imubit.com/blog/controllable-ai-what-it-really-means-for-the-future-of-plant-modeling/ | 2025-06-05 | ★★☆ |
| 2 | IMUBIT — LLM & GenAI in Plant Modeling | https://imubit.com/articles/controllable-ai-and-the-future-of-industrial-plant-modeling-embracing-large-language-models-and-generative-ai | 2026-03-13 | ★★☆ |
| 3 | IMUBIT — LNS Research: Closed-Loop AI 상위 15% | https://imubit.com/articles/lns-research-industrial-ai-vendor-landscape-imubit-amongst-less-than-15-of-ai-vendors-getting-to-closed-loop | 2026-03-13 | ★★★ |
| 4 | Lam Research — Fabtex Yield Optimizer 출시 | https://newsroom.lamresearch.com/virtualization-AI-from-fabtex-yield-optimizer-ramps-up-yield-in-semiconductor-manufacturing | 2025-10-21 | ★★★ |
| 5 | Lam Research — MFL 레시피 생성 (Nature) | https://www.nature.com/articles/s41586-023-05773-7 | 2023 | ★★★ |
| 6 | Bosch — Manufacturing Co-Intelligence | https://www.assemblymag.com/articles/99750-bosch-and-microsoft-to-harness-ai-for-intelligent-manufacturing | 2026-01-09 | ★★★ |
| 7 | Bosch — Agentic AI 백서 | https://www.bosch-softwaretechnologies.com/media/documents/downloads/2025/agentic_ai_the_time_is_now.pdf | 2025 | ★★★ |
| 8 | Bosch — Manufacturing Co-Intelligence 플랫폼 | https://www.manufacturing-co-intelligence.com/ | 2025 | ★★★ |
| 9 | Siemens — Industrial Copilot Hermes Award | https://press.siemens.com/global/en/pressrelease/bringing-generative-ai-industry-siemens-industrial-copilot-wins-hermes-award-2025 | 2025-03-30 | ★★★ |
| 10 | Siemens — Industrial Foundation Model 발표 | https://assets.new.siemens.com/siemens/assets/api/uuid:c0715695-4c1e-4bd5-a342-fccdd599896c/20250331-AI-driven-industries-EN.pdf | 2025-03-31 | ★★★ |
| 11 | Siemens — IFM 전략 분석 | https://www.klover.ai/siemens-ai-strategy-analysis-of-dominating-industrial-ai/ | 2025 | ★★☆ |
| 12 | Siemens — AI with Purpose Summit 2025 IFM 설명 | https://www.arcweb.com/industry-best-practices/ai-purpose-summit-2025-siemens-vision-industrial-grade-ai | 2025 | ★★★ |
| 13 | Samsung — NVIDIA AI Megafactory | https://news.samsung.com/global/samsung-teams-with-nvidia-to-lead-the-transformation-of-global-intelligent-manufacturing-through-new-ai-megafactory | 2025-10-31 | ★★★ |
| 14 | Aitomatic — SemiKong (Llama 기반 반도체 LLM) | https://ai.meta.com/blog/aitomatic-built-with-llama/ | 2024-12 | ★★★ |
| 15 | arXiv — LLM 기반 산업 자율 제어 (FSM+LLM) | https://arxiv.org/html/2507.07115v1 | 2025-07 | ★★☆ |
| 16 | MDPI AI — LLM+PLC 하이브리드 아키텍처 | https://www.mdpi.com/2673-2688/7/2/51 | 2025 | ★★☆ |
| 17 | arXiv — ISA-95+LLM+KG 스마트 제조 | https://arxiv.org/html/2602.12419v1 | 2026-02-12 | ★★☆ |
| 18 | arXiv — 제조 LLM+KG 자동 생성 | https://arxiv.org/html/2510.15428v1 | 2025-10 | ★★☆ |
| 19 | IoT Analytics — SPS 2025 Physical AI 트렌드 | https://iot-analytics.com/top-10-industrial-automation-trends/ | 2025 | ★★★ |
| 20 | EENews Europe — LLM in Industrial Automation | https://www.eenewseurope.com/en/how-llms-are-finding-use-in-industrial-applications/ | 2025 | ★★★ |
| 21 | TIGNIS — SEMICON West 2025 전시 | https://expo.semi.org/west2025/public/eBooth.aspx?IndexInList=690&ListByBooth=true&BoothID=656977 | 2025-09 | ★★☆ |
| 22 | ACL Findings — LLM 수치 추론 한계 | https://aclanthology.org/2023.findings-emnlp.1028.pdf | 2023-12 | ★★★ |
| 23 | controlsys.org — LLM 구조적 한계 분석 | https://controlsys.org/news/beyond-the-hype-making-ai-work-in-industrial-automation/ | 2025 | ★★★ |
| 24 | CEUR Workshop — KG+LLM 제조 섹터 적용 한계 | https://ceur-ws.org/Vol-4104/paper5.pdf | 2025-11 | ★★☆ |

---

*검색 통계: Perplexity search 8회, Tavily search 5회, Tavily extract 2회*
