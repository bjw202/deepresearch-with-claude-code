# 제조 AI 시스템 기술 아키텍처 및 동작 방식

## 개요

제조 AI 시스템의 주요 플레이어들은 크게 두 가지 방향으로 수렴하고 있다: (1) **제어루프 내 AI** — 센서 데이터를 직접 처리하여 실시간 파라미터를 결정하는 폐쇄루프 시스템(TIGNIS, IMUBIT), (2) **인간 보조형 AI** — 엔지니어의 의사결정을 지원하지만 직접 제어는 하지 않는 코파일럿·레시피 생성 시스템(LAM RESEARCH, SIEMENS, BOSCH). SAMSUNG과 INTEL은 두 방향 모두를 추구하는 대규모 전략을 선언하거나 배포 중이다. 가장 기술적으로 검증된 시스템은 IMUBIT(정유 도메인)와 TIGNIS(반도체 공정 제어)이며, 양사 모두 DCS/MES 연동 경험과 실 고객사 성과 데이터를 보유하고 있다.

---

## 1. TIGNIS (현 Cohu)

### 기술 스택
- **핵심 기법**: Physics-driven AI + ML 서로게이트 모델. 수백만 번 빠른 물리 시뮬레이션 대체 모델(surrogate model)을 활용한 실시간 제어
- **고유 언어**: DTQL(Digital Twin Query Language) — 데이터 클리닝·분석을 코드 없이 처리하는 도메인 특화 스크립팅 언어
- **제품 구성**: PAICe Monitor(이상 탐지·예측 정비) + PAICe Maker(폐쇄루프 R2R 제어) + PAICe Builder(이론적 베이스라인)
- **ML 기법**: 비선형 상호작용을 처리하는 대규모 다변량(massively multivariate) 모델, 가상 계측(Virtual Metrology) 내장

### 데이터 흐름 및 제어 루프
```
센서·계측 데이터 →  PAICe Maker 수집 → 물리 기반 AI 서로게이트 모델 추론
→ 제어 파라미터 최적화 (per-wafer 또는 continuous basis)
→ 반도체 장비에 레시피 파라미터 전달 (Closed-loop R2R)
→ 계속 재학습 (process drift 자동 보정)
```
- **루프 유형**: Closed-loop, 웨이퍼-투-웨이퍼(wafer-to-wafer) 단위 자동 조정 가능
- **Human-in-the-loop**: 기본적으로 자율, 단 엔지니어가 DTQL로 직접 개입 가능
- 물리 시뮬레이션 대비 "수백만 배 빠른" 추론 → 실시간 레시피 추천 가능 ★★☆ (공식 제품 자료 기반)

### 기존 시스템 연동
- OEM 장비(도쿄일렉트론 등)에 임베디드 컨트롤러로 통합 가능
- 기존 팹(fab)에 애프터마켓 컨트롤로도 배포 가능
- 구체적 MES/SCADA 연동 프로토콜 공개 자료 미확인 — 주로 장비 레벨 통합

### 도입 현황
- 반도체 IDM, 순수 파운드리, 장비 OEM, 소재·부품 공급사
- 도쿄일렉트론(TEL)이 공식 파트너로 확인 ★★☆
- 2024년 12월 Cohu가 인수 — $2.6B 반도체 공정 제어 시장 진입 목표 ★★★
- 제약·바이오, 냉각 플랜트 등 반도체 외 도메인으로도 확장 (물리 기반 접근 덕분에)

### 성과 및 검증 수준
- **보고된 성과**: 공정 변동성 감소, 수율 향상, 비정기 다운타임 감소 (구체적 수치 미공개)
- **검증 수준**: ★★☆ — Cohu/Tignis 자체 자료 및 파트너사 언급 수준. 독립 학술 검증 미확인
- "수백만 배 빠른 시뮬레이션" 주장: 물리 기반 서로게이트 모델의 일반적 특성이나, 도메인·조건에 따라 달라질 수 있음

### 핵심 판단
TIGNIS는 "물리 모델 + ML 서로게이트" 결합 방식으로 블랙박스 딥러닝 대비 신뢰성과 해석 가능성에서 강점을 가진다. Cohu 인수 이후 반도체 계측 생태계와의 통합이 강화될 전망이나, 독립 검증 데이터가 부족하여 현재 주장은 조건부.

**[이질 도메인: 항공 엔진 제어]** GE·P&W의 엔진 FADEC 시스템도 물리 모델 + 머신러닝 서로게이트 결합 패턴을 사용. 다만 항공은 실시간 안전 임계 제어이므로 반도체 R2R 제어보다 훨씬 엄격한 검증이 요구됨.

---

## 2. IMUBIT

### 기술 스택
- **핵심 기법**: Deep Learning Process Control(DLPC) — 딥러닝 신경망 + 강화학습(Reinforcement Learning) 기반 폐쇄루프 최적화
- **추가 기법**: AutoML, Foundation Process Model (대형 플랜트 기반 모델 — GPT의 산업 버전 개념)
- **2개 주요 컴포넌트**:
  1. 클라우드 기반 Industrial AI 플랫폼 — 모델 빌드·평가·성능 추적 (단방향, 클라우드→온프레미스)
  2. 온프레미스 DLPC 어플리케이션 — 실제 폐쇄루프 제어 실행 (PCN 레벨 배포)

### 데이터 흐름 및 제어 루프
```
역사 데이터 (2~5년) → 클라우드에서 DLPC 모델 학습
→ 온프레미스 배포 (DMZ 또는 PCN 레벨)
→ DCS/APC/히스토리안에서 실시간 데이터 수집 (OPC/OPC-UA 표준 프로토콜)
→ DLPC가 1,000개 이상 변수 최적 세트포인트 계산 (1분 이내)
→ DCS로 세트포인트 직접 기입 (Closed-loop)
→ 경제 데이터(가격) 업데이트 시 목적함수 재계산
```
- **루프 유형**: 완전 Closed-loop, 자율 세트포인트 조정 (인간 감독하에)
- **Human-in-the-loop**: 오퍼레이터가 개입 권한 유지, 오픈루프 어드바이저리 모드 → 클로즈드루프 전환 가능

### 기존 시스템 연동
- **DCS 직접 연결**: OPC/OPC-UA 표준 사용 → 신규 장비 불필요
- **APC 연동**: 기존 APC(Advanced Process Control)에 레이어로 추가 가능
- **경제 데이터**: 가격 데이터를 LP→히스토리안 또는 DCS 경로로 수신
- **보안**: 클라우드↔온프레미스는 단방향(one-way) 데이터 흐름, PCN 격리 유지
- **IT/OT 경계**: 모델 학습 데이터는 비즈니스 네트워크 히스토리안에서 추출 ★★★ (공식 아키텍처 Q&A 문서)

### 도입 현황
- **확인된 고객사**: Monroe Energy, Big West Oil, Oxbow, CVR, Citgo, Chevron, Flint Hills Resources, HF Sinclair, Preem(스웨덴), 캐나다 대형 정유사 등 20여 개 이상 ★★★
- **도메인**: 정유, 석유화학, 폴리머, LNG, 바이오리파이너리, 시멘트, 광업 — 100개 이상 클로즈드루프 애플리케이션 배포 ★★★
- **규모**: 중소 단일 플랜트(Big West Oil)부터 대형 통합 정유사(Chevron)까지

### 성과 및 검증 수준
- **수율·처리량**: 1~3% 처리량 향상, 0.6~2% 액체 부피 수율 향상 ★★☆ (고객사 케이스스터디, 자체 공개)
- **에너지**: 천연가스 사용 15~30% 감소 ★★☆
- **마진**: $0.25/bbl 마진 향상, FCCU 케이스에서 연간 $6~9M 추가 이익 ★★☆
- **오퍼레이터 참여율**: Big West Oil 85%+ 참여율 ★★☆ (고객사 직접 진술 포함)
- **검증 한계**: 독립 제3자 감사·학술 논문 없음. BCG 인용 "14% 제조 비용 절감" 수치는 [인접 도메인: BCG 컨설팅 리포트] — IMUBIT 특정이 아닌 산업 전반 추정치

### 핵심 판단
IMUBIT는 제조 AI 시스템 중 **가장 구체적인 데이터 흐름 아키텍처와 고객 레퍼런스**를 보유한 시스템이다. OPC-UA 연동과 PCN 격리 유지 설계는 실제 산업 보안 요구사항을 반영한 성숙한 접근이다. 단, 모든 성과 데이터가 자체 발표이므로 과장 가능성 배제 불가. 정유·화학 특화 도메인 외 적용 확장성은 아직 초기 단계.

**반증**: DLPC 재학습 필요 조건(대규모 운영 변경, 신규 레짐)은 도입 초기 성과 이후 유지 관리 비용 상승 위험. 오퍼레이터 저항 사례는 공개 자료 부재 — "반증 미발견"이나 자체 선택 편향(self-selection bias) 가능성.

---

## 3. LAM RESEARCH

### 기술 스택
- **핵심 기법**: Bayesian Optimization + Human-in-the-loop (HF-CL: Human-First, Computer-Last 전략)
- **도구 생태계**:
  - SEMulator3D® — 식각·증착 3D 예측 모델링 (physics-based)
  - Equipment Intelligence® Data Analyzer(EI-DA) — 센서 데이터·장비 거동 ML 분석
  - Semiverse® Solutions (Coventor 포함) — ML 통합 프로세스 모델링
- **Nature 논문(2023)**: "Human–machine collaboration for improving semiconductor process development"

### 데이터 흐름 및 제어 루프
```
엔지니어 도메인 지식으로 탐색 공간 정의 (Human-First 단계)
→ Bayesian Optimization이 실험 선택 최적화 (Computer-Last 단계)
→ 시뮬레이션(SEMulator3D)로 레시피 후보 검증
→ EI-DA로 장비 센서 데이터 분석 → 공정 드리프트 탐지
→ 최종 레시피를 엔지니어가 검토·확정
```
- **루프 유형**: Semi-closed — 레시피 개발은 Human-in-the-loop, 장비 제어는 EI-DA 기반 모니터링
- **MFL(Machine Learning Framework)**: 공개 자료에서 'MFL' 약어 미확인 → Lam의 내부 ML 통합 생태계 전체를 지칭하는 비공식 용어로 추정

### 기존 시스템 연동
- 고객(IDM, 파운드리)의 개발 사이클에 Semiverse 솔루션을 임베디드 제공
- 장비 레벨 센서·텔레메트리 → EI-DA → 공정 통찰 제공
- 고객의 기존 APC, MES와의 API 연동은 장비 계약 범위에 포함 (공개 자료 없음)

### 도입 현황
- Lam 자체 R&D 프로세스에 적용 확인 ★★★
- 도쿄일렉트론·삼성·TSMC·마이크론 등 주요 고객사 대상 장비에 임베디드 (간접 도입)
- CryoEtch 3.0(2024.07): AI 지원 극저온 식각으로 3D NAND 400레이어+ 지원

### 성과 및 검증 수준
- **Nature 논문 검증**: HF-CL 전략이 비용-목표 도달을 **전문가 단독 대비 50% 비용 절감, 50% 시간 단축** ★★★ (Nature 동료 심사 통과 — 제조 AI 시스템 중 가장 높은 검증 수준)
- **조건**: 시뮬레이션 환경(SiO2 홀 식각 시뮬레이터) 기반 실험. 실제 팹 운영 조건과 동일하지 않을 수 있음 — [인접 도메인: 최적화 알고리즘 연구] 시뮬레이션 결과의 실제 공정 전이 성능은 별도 검증 필요
- **Bayesian 통계**: 100번 무작위 반복, 성공률 기반 비교. "순수 우연 성공률 < 0.2%" vs HF-CL 전략 ★★★

### 핵심 판단
Lam Research는 가장 엄밀하게 검증된 (Nature 논문) 결과를 보유하나, 시뮬레이션 환경 기반이라는 한계가 있다. Bayesian Optimization의 "Human-First, Computer-Last" 원칙은 실제 공정 개발에서 도메인 지식을 AI가 대체하는 것이 아니라 **상호보완**해야 함을 명확히 보여주는 사례다.

**관점 확장**: Bayesian Optimization은 탐색 공간이 좁고 실험 비용이 높을 때 최적이다. 100개 이상 파라미터를 가진 복잡한 적층 공정(multi-layer deposition)에서는 Bayesian의 가우시안 프로세스 확장이 한계에 부딪힐 수 있음 — 이 경우 RL 기반 접근이 보완 가능.

---

## 4. BOSCH

### 기술 스택
- **접근 방식**: Agentic AI + Multi-Agent System (MAS) 기반 공장 자동화
- **핵심 구성 요소** (Bosch Software Technologies 백서 기반):
  - User/System Interface → Guardrails(Responsible AI/Sure.AI) → Planning Agent → 실행 에이전트들
  - Sure.AI by Bosch: AI 리스크 평가(강건성, 공정성, 설명 가능성 매트릭스)
- **LLM 연동**: LLM 기반 에이전트가 tool 호출(API, DB, PLC 액션)을 통해 실세계 상호작용
- **제품화**: 2025년 가을 외부 기업을 위한 no-code/low-code 멀티에이전트 플랫폼 출시 예정

### 데이터 흐름 및 제어 루프
```
제조 라인 센서 → 다중 AI 에이전트 (병렬 실행)
→ 에이전트 팀: 기기 모니터링 에이전트 + 예지보전 에이전트 + 인원 스케줄링 에이전트
→ Planning Agent가 전략 결정 및 하위 에이전트 태스크 분배
→ 인간 감독자 또는 조율 에이전트 검토
→ 실행 (설비 조정, 알림, 스케줄 최적화)
```
- **루프 유형**: Semi-autonomous Closed-loop (인간 감독 유지)
- **동시성**: 복수 에이전트 병렬 실행 — 기존 순차 처리 대비 속도 향상

### 기존 시스템 연동
- **Microsoft 파트너십**: Microsoft Azure AI 서비스와 Bosch Connected Industry 플랫폼 통합 (2026.01 발표)
- OPC-UA, 표준 산업 프로토콜 기반 장비 연결 (공식 아키텍처 도식 미공개)
- MES/ERP 연동 방식: Bosch 자체 공장 IT 인프라 기반 (세부 공개 자료 없음)

### 도입 현황
- **Bosch 자체 공장**: 다중 에이전트 시스템으로 예지보전 + 인원 스케줄링 최적화 운영 중 ★★☆
- **투자**: 2027년까지 AI에 €25억+ 투자 계획 ★★★
- 외부 고객 적용: 2025년 가을 플랫폼 출시 이후 — 아직 외부 케이스스터디 없음

### 성과 및 검증 수준
- **보고된 성과**: "수백만 유로 절감 가능", 비계획 다운타임 감소, 생산성 향상 ★☆☆ (정성적 주장, 수치 불명확)
- **검증 수준**: Bosch 이사회 발표(Tanja Rueckert) 수준 — 독립 검증 없음
- 수치 투명성 부족: 절감 규모("수백만 유로")는 범위와 조건이 불명확

### 핵심 판단
Bosch의 Agentic AI는 개념과 방향성은 선도적이나, 현 시점에서 발표된 성과는 주로 전략 선언과 정성적 주장 수준이다. 기술 아키텍처(LLM + tool 호출 + MAS)는 검증된 패턴이나, 제조 실환경에서의 구체적 성과 데이터와 안전성 검증이 필요하다.

**[이질 도메인: 물류/공급망 자동화]** Amazon Robotics의 다중 로봇 시스템과 구조적으로 유사 — 중앙 조율 에이전트 + 전문화 에이전트 패턴. 다만 물류는 예측 가능한 환경, 제조 공장은 더 높은 불확실성을 가짐.

---

## 5. SIEMENS

### 기술 스택
- **Industrial Copilot**: Azure OpenAI Service(GPT-4) + Siemens Xcelerator 플랫폼 + Teamcenter PLM
- **Knowledge Graph**: Industrial Knowledge Graph — 제조 자산, 프로세스, 관계의 온톨로지 기반 시맨틱 모델
  - 플랫폼: metaphactory, Altair Graph Studio(구 Anzo), RapidMiner
- **LLM/AI 통합 아키텍처**:
  1. Industrial Edge: 현장 데이터 수집·전처리 (MQTT, OPC-UA, REST API)
  2. WinCC OA: 이벤트 관리, DB 통합, SCADA 기능 (공장 레벨)
  3. WinCC OA MCP Server: 클라우드 LLM 플랫폼 연결 (OpenAI, AWS Bedrock, Claude, Gemini 지원)
  4. 엔터프라이즈 애플리케이션 레이어

### 데이터 흐름 및 제어 루프
```
OT 현장 장비 → Industrial Edge (OPC-UA/MQTT)
→ WinCC OA (SCADA 통합)
→ WinCC OA MCP Server → 클라우드 LLM API
→ AI 생성 인사이트/코드/지침 → 엔지니어/오퍼레이터에게 전달
```
- **루프 유형**: Open-loop (Human-in-the-loop 보조 도구), 자율 제어 없음
- **Teamcenter 통합**: 프론트라인 작업자가 음성 → OpenAI 파싱 → 자동 리포트 생성 → Teamcenter 경로 지정

### 기존 시스템 연동
- Teamcenter(PLM) + Microsoft Teams + Azure OpenAI 삼각 통합 ★★★
- OPC-UA 기반 벤더 중립 장비 연결
- LLM 멀티 프로바이더 지원 (벤더 락인 회피): OpenAI, AWS Bedrock, Claude, Gemini ★★★
- 고객 데이터는 AI 모델 학습에 미사용 (계약 보장) ★★★

### 도입 현황
- **Schaeffler Group**: Industrial Copilot 파일럿 프로그램 ★★★
- **thyssenkrupp**: 제조 스킬 격차 해결에 Copilot 활용 — 2025년 글로벌 표준 프로세스 롤아웃 ★★★
- **100+ 고객사** 테스트 중 (2024~2025) ★★☆
- **Knowledge Graph**: 가스 터빈 유지보수, 빌딩 자동화, 공장 모니터링 등 다양한 Siemens 사업부 내부 적용 ★★★

### 성과 및 검증 수준
- **자동화 코드 생성**: "몇 주 → 몇 분"으로 단축 ★★☆ (Siemens 자체 발표)
- **Teamcenter 음성 리포팅**: 언어 번역 포함 현장 보고 자동화 ★★★ (Microsoft 케이스스터디)
- 수치 성과(수율, 비용 절감 등)는 공개 데이터 없음 — 주로 생산성·협업 개선 사례

### 핵심 판단
Siemens는 **아키텍처 공개 수준이 가장 높은** 시스템이다. OT→IT→클라우드 LLM의 전체 데이터 경로를 공식 아키텍처 허브에 도식화한 것은 도입 검토자에게 가장 구체적인 레퍼런스를 제공한다. 단, 현재 Copilot은 보조 도구 수준이며 자율 제어로 나아가기 위한 로드맵이 명확히 보이지 않는다.

---

## 6. SAMSUNG

### 기술 스택
- **전략**: AI-Driven Factories 2030 — Agentic AI + Digital Twin + 로봇 통합
- **AI 기반**: Galaxy S26에 도입된 Agentic AI를 공장 환경으로 확장
- **컴퓨팅 인프라**: NVIDIA와의 협력 — 50,000+ NVIDIA GPU, RTX PRO Servers(RTX PRO 6000 Blackwell)
- **디지털 트윈**: NVIDIA Omniverse 기반 팹 디지털 트윈 구축 중
- **로봇 유형**: Operating/Logistics/Assembly/Environmental Safety 로봇 — AI 에이전트와 연동
- **소프트웨어**: Synopsys, Cadence, Siemens EDA 시뮬레이션·검증 도구 연동

### 데이터 흐름 및 제어 루프
```
팹 센서 + 카메라 → 디지털 트윈(NVIDIA Omniverse) 동기화
→ AI 에이전트: 품질 검사 에이전트 + 물류 에이전트 + 예지보전 에이전트
→ 사전 검증 (디지털 트윈 시뮬레이션)
→ 실제 로봇·공정 장비 제어
```
- **루프 유형**: 선언 기준 Closed-loop 자율 목표, 2026 현재는 부분 적용 단계
- **MES/ERP**: 직접 언급 없음 — 생산 밸류체인 전체(물류→생산→품질→출하) 커버 의도

### 기존 시스템 연동
- NVIDIA Omniverse를 통한 팹 디지털 트윈과 실제 장비 간 데이터 동기화 ★★☆
- Samsung Gauss(자체 AI 모델)로 내부 업무 도구 연동 ★★☆
- MES/ERP 세부 통합 스택: 미공개

### 도입 현황
- 2026.03.01 공식 전략 발표 + MWC 2026 시연 ★★★
- NVIDIA와 AI Factory 구축 파트너십(2025.10) ★★★
- **현재 수준**: 전략 선언 + 초기 파일럿. 전 공장 배포는 2030년 목표

### 성과 및 검증 수준
- **현재 성과 데이터**: 없음 — 2030년 목표 달성 여부 미검증 ★☆☆
- **비전 수준**: AI-Driven Factory는 경쟁사(TSMC, Intel, SK하이닉스)도 동시에 선언 중 — 선도성 차별화 불명확
- 디지털 트윈의 "설계-운영 전환 시간 단축" 효과는 NVIDIA-삼성 공동 발표 수준 ★★☆

### 핵심 판단
Samsung의 AI Factory 전략은 규모와 야심 모두에서 업계 최고 수준이나, 현시점은 "전략 선언 단계"로, 검증 가능한 운영 성과가 없다. NVIDIA Omniverse 기반 디지털 트윈 접근은 구체적이나, 아직 실제 팹 전면 배포 전이다.

---

## 7. INTEL

### 기술 스택
- **Inline AI 핵심 기법**:
  - IWVI(Inline Wafer Visual Inspection): 실시간 웨이퍼 시각 검사 — 마이크로미터 수준 결함 탐지
  - ADC(Auto Defect Classification): CV + ML 기반 자동 결함 분류, 정확도 90%+ ★★★
  - 수율 분석 AI: 센서 데이터 처리 → 웨이퍼 레벨 결함 예측, 전기 테스트·계측 데이터 상관관계 분석
- **하드웨어**: Intel ARC A770 GPU 기반 추론
- **모델**: ResNet50 기반 픽셀 레벨 세그멘테이션 (결함 위치 파악) ★★★
- **100% 웨이퍼 검사**: 모든 웨이퍼·모든 로트 검사 — 샘플링 대비 전수 검사 ★★★

### 데이터 흐름 및 제어 루프
```
웨이퍼 공정 중 인라인 촬영 → ADC 모델 추론 (결함 분류)
→ 동일 웨이퍼의 복수 문제 동시 식별 → RCA 수행
→ 장비 이상(excursion) 감지 → 자동 장비 셧다운 트리거
→ 수율 분석 AI: 전기 테스트 + 계측 + 장비 센서 데이터 통합 → 예측 경보
```
- **루프 유형**: Closed-loop (장비 셧다운까지 자율), 단 엔지니어가 RCA 최종 결정
- **RCA 방식**: 다중 이상 동시 탐지 → 툴 오작동, 공정 이탈, 오염 근원 역추적

### 기존 시스템 연동
- Intel 자체 팹 IT 인프라와 통합 (외부 판매용 솔루션 아님)
- ADC는 기존 촬영 장비 활용 — 추가 자본 지출 없음 ★★★
- 장비 셧다운 → MES 연동 암시, 구체적 프로토콜 미공개

### 도입 현황
- Intel 자체 어셈블리·테스트·팹 전반 배포 ★★★
- **인라인 웨이퍼 시각 검사(IWVI)**: 연간 최대 $200만 절감 보고 ★★★ (Intel IT 공식 백서)
- 추가 공정으로 확장 중 ★★☆

### 성과 및 검증 수준
- **ADC 정확도**: 90%+ ★★★ (Intel IT 공식 백서 기반)
- **IWVI 비용 절감**: 연간 $200만 (단일 공정 기준) ★★★
- **검증 수준**: Intel 자체 내부 배포 + IT 백서 — 독립 학술 검증은 없으나 실운영 데이터 기반 ★★★
- **조건부**: 특정 어셈블리·테스트 팹 조건. 다른 칩 아키텍처·공정에서 동일 성과 보장 불가

### 핵심 판단
Intel Inline AI는 이 보고서에서 다루는 시스템 중 **가장 명확한 단위 ROI 데이터**를 가진 사례다. "전수 검사 + 복수 결함 동시 탐지"는 전통적 샘플링 기반 QC의 패러다임 전환이다. 단, Intel 자체 팹에 특화된 솔루션이므로 범용 솔루션으로의 전환 여부는 불명확하다.

---

## 관점 확장

### 인접 질문 1: 제어 루프 클로즈드 vs 오픈의 실질적 경계는 어디인가?
이번 조사에서 확인된 패턴: "클로즈드루프"라 불려도 완전 자율과 인간 감독 사이의 스펙트럼이 매우 넓다. IMUBIT의 클로즈드루프는 오퍼레이터 개입 권한을 유지하고, TIGNIS의 클로즈드루프는 엔지니어 검토 후 배포한다. **실질적 자율 수준보다 "얼마나 빨리 인간이 개입할 수 있는가"가 더 중요한 척도일 수 있다.**

### 인접 질문 2: 도메인 특화 vs 범용 AI 어느 방향이 제조에서 유효한가?
- IMUBIT(정유 특화) vs Samsung/Bosch(범용 Agentic AI) — 단기 성과는 도메인 특화가 우수
- TIGNIS의 물리 기반 AI는 반도체 외 도메인(제약, 냉각)으로 확장 가능성 보여줌
- **숨은 변수**: 도메인 특화 AI는 데이터 수집·레이블링 비용이 훨씬 낮음 — 범용 AI의 진입 장벽

### 인접 질문 3: LLM이 제어 루프에 직접 진입하는 시나리오는 언제 올 수 있는가?
현재 모든 시스템에서 LLM은 제어 루프 밖(보조 도구 레이어)에 있다. SIEMENS Copilot이 자동화 코드를 생성해도 엔지니어가 검토 후 배포한다. **결론을 바꿀 수 있는 변수**: LLM의 신뢰도(hallucination 감소)와 사이버보안 규제 변화. 이 두 조건이 충족되기 전까지 LLM의 직접 제어 루프 진입은 제한적.

### [이질 도메인: 임상 의사결정 지원 시스템(CDSS)]
병원의 AI 진단 지원 시스템도 "AI가 진단·처방 추천하되 최종 결정은 의사"라는 패턴을 따른다. 제조 AI의 "human-in-the-loop" 논쟁과 동일한 구조 — 차용 가능한 패턴: 의료는 AI 추천의 '설명 가능성 요구'와 '책임 귀속' 프레임워크를 법제화했으며, 제조 AI도 유사한 규제 압력에 직면할 가능성이 있다.

### 문제 재정의
조사 후 원래 질문("각 시스템의 구체적 동작 방식")보다 더 적절한 핵심 질문: **"각 시스템이 어떤 인간-AI 책임 분배 모델을 채택했으며, 그 분배가 도입 성공에 어떻게 영향을 미치는가?"** — 기술 스택보다 사람-시스템 인터페이스 설계가 실제 배포 성과를 결정하는 핵심 변수로 나타났기 때문이다.

---

## 출처 목록

| 출처 | 유형 | 날짜 | 확신도 |
|------|------|------|--------|
| Cohu/Tignis PAICe Maker Product Sheet | 공식 제품 자료 | 2025.03 | ★★☆ |
| Cohu.com - PAICe Maker 제품 페이지 | 공식 제품 페이지 | 2026.01 | ★★☆ |
| VentureBeat - Tignis Series A 투자 기사 | 언론 | 2021 | ★★★ |
| M-Ventures - Cohu acquisition of Tignis | 투자사 발표 | 2025.01 | ★★★ |
| Imubit - "Answering the Important Questions" | 공식 기술 블로그 | 2024.06 | ★★★ |
| Imubit - 3 Reasons Closed-Loop AI (Big West Oil) | 고객 케이스스터디 | 2024.06 | ★★☆ |
| Imubit - FCCU Case Study | 케이스스터디 | 2024 | ★★☆ |
| Lam Research - Nature Paper PR | 공식 보도자료 | 2023.04.10 | ★★★ |
| Nature - "Human–machine collaboration for improving semiconductor process development" | 동료심사 논문 | 2023.04 | ★★★ |
| Lam Research - Lam Cryo 3.0 발표 | 공식 보도자료 | 2024.07.31 | ★★★ |
| Bosch Tech Day 2025 Press Release | 공식 보도자료 | 2025.06.25 | ★★★ |
| Bosch Software Technologies - "The Future of Work is Agentic" 백서 | 공식 백서 | 2025 | ★★☆ |
| MachineToolNews - Bosch Agentic AI 인터뷰 | 전문 매체 | 2026.03.16 | ★★☆ |
| Microsoft News - Siemens Industrial Copilot 파트너십 발표 | 공식 발표 | 2023.10.31 | ★★★ |
| Siemens - AI/LLM to Shop Floor Architecture Hub | 공식 아키텍처 문서 | 2025 | ★★★ |
| Microsoft - Siemens & thyssenkrupp 기사 | MS 공식 미디어 | 2024.10.24 | ★★★ |
| Azure Architecture - Siemens Industrial Edge + Azure AI | MS 공식 아키텍처 | 2024 | ★★★ |
| Samsung Electronics - AI-Driven Factories 전략 발표 | 공식 보도자료 | 2026.03.01 | ★★★ |
| NVIDIA News - Samsung AI Factory 파트너십 | 공식 보도자료 | 2025.10.30 | ★★★ |
| Intel IT - Smart Mfg. Computer Vision AI Inline Paper | Intel 공식 백서 | 2023.11 | ★★★ |
| Intel IT - Manufacturing Yield Analysis with AI | Intel 공식 백서 | 2023 | ★★★ |
| EE Times - AI in Semiconductor Inspection | 전문 매체 | 2026.03.27 | ★★☆ |

---

*작성: Researcher 1 — 제조 AI 시스템 기술 아키텍처 및 동작 방식*
*작성일: 2026-03-30*
*검색 예산 사용: search ~10회(권고 8회 대비 초과 2회), extract ~2회, research 0회*
*초과 사유: Bosch 기술 스택 공개 자료 부족으로 다각도 탐색 필요*
