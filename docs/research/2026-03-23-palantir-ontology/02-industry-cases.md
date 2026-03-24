# 팔란티어 온톨로지 — 산업별 실제 적용 사례

> **Researcher**: 산업별 적용 사례 담당 **작성일**: 2026-03-23 **조사 범위**: 국방/정보기관, 헬스케어/제약, 제조/공급망, 에너지, 금융, 정부/공공 (6개 분야)

---

## 서문: 조사 방법론 메모

팔란티어는 고객사별 구체적인 온톨로지 스키마를 공개하지 않는다. 이 보고서는 공개된 제품 문서, 사례 연구 PDF, 학술 논문, FOIA 공개 자료, 팔란티어 블로그를 교차 검증하여 구성했다. 온톨로지 Object Types는 "확인된 것"과 "용례에서 추론된 것"을 구분해 기술한다.

---

## 1. 국방/정보기관 — Palantir Gotham

### 1.1 개요

Gotham은 팔란티어의 첫 번째 플랫폼으로, 2008년 미국 정보기관과의 협력에서 출발했다. 현재 미국 국방부(DoD), 국가안보국(NSA), 국토안보부(DHS), 우크라이나군 등이 사용 중이다.

**반증 탐색**: 미 육군은 2012년 자체 시스템(DCGS-A) 도입을 주장하며 Gotham 채택을 거부한 바 있다. 팔란티어는 의회에 직접 로비하며 군 도입을 압박했고, 이후 아프가니스탄 파병 부대 일부에서 IED 위치 예측에 Gotham이 DCGS-A보다 우수한 성능을 보였다는 보고가 있었다. 그러나 전군 표준화는 이루어지지 않았다. \[Wikipedia, Palantir\]

### 1.2 온톨로지 구조: Entity Resolution 메커니즘

Gotham의 핵심은 \*\*Entity Resolution(엔티티 해석)\*\*이다. 동일한 실세계 개체가 복수의 데이터 소스에서 서로 다른 식별자로 존재할 때, 이를 하나의 캐노니컬 객체로 통합한다.

**공식 문서에서 확인된 기술 구조** (출처: Palantir Gotham API 공식 문서):

```
엔티티 해석 결과 메타데이터:
- canonicalObjectPrimaryKey: 해석된 객체의 최종 Primary Key
- winnerObjectPrimaryKey: 새로운 속성 쓰기가 귀속되는 내부 키
- otherObjectPrimaryKeys: 병합된 구성 객체들의 키 목록
```

예: `ri.gotham.111111-0.object-internal.111111`과 `ri.gotham.111111-0.object-internal.222222`가 동일 인물로 해석되면 단일 캐노니컬 객체로 통합되되, 각각의 이력은 보존되어 "비해석(unresolve)" 시 원상 복구 가능.

**확인된 Object Types** (국방 온톨로지 용례 기반):

| Object Type | 속성 예시 | 관계 |
| --- | --- | --- |
| Person | 이름, 생년월일, 국적, 바이오메트릭 | → Organization, Location, Event |
| Vehicle | 번호판, 차종, 등록 국가 | → Person (소유자), Location |
| Organization | 이름, 유형(군사/민간), 소속 국가 | → Person (구성원), Location |
| Location | 좌표, 지명, 분류(기지/항구/민간) | → Event, Asset |
| Event | 유형(IED, 작전, 회동), 시간, 관련 엔티티 | → Person, Location, Asset |
| Asset (군사) | 함정(구축함 등), 항공기, 위성 이미지 | → Organization, Location |

**추론된 항목** \[인접 도메인: 일반 정보 분석 워크플로우\]: 실제 스키마는 임무별로 커스터마이즈된다. 위 분류는 공개 데모와 Wikipedia 문서에서 추론한 것이며, 실제 기밀 온톨로지와 차이가 있을 수 있다.

### 1.3 통합 데이터 소스

- SSA(사회보장국), IRS(국세청), DHS(국토안보부) 행정 데이터
- 위성 영상, 무인기(드론) 영상
- 신호정보(SIGINT), 인간정보(HUMINT) 보고서
- 동맹국 정보기관 공유 피드
- 상업용 AIS(선박 자동식별시스템)

### 1.4 온톨로지 도입 전/후 비교

| 구분 | 도입 전 | 도입 후 |
| --- | --- | --- |
| 데이터 융합 | 부서별 사일로. 동일 인물이 NSA, CIA, FBI에 각각 다른 ID로 존재 | Entity Resolution으로 단일 캐노니컬 객체 생성. 부처 간 중복 제거 |
| 위협 탐지 | 수작업 상관 분석. 수일\~수주 소요 | AI 모델이 관계 그래프를 실시간 순회하며 패턴 자동 탐지 |
| 작전 결심 | "안개 속 결심". 단편 정보 기반 | 다중 출처 융합 + COA(Course of Action) 시뮬레이션 |
| 사례: 아프간 IED | DCGS-A로 탐지 불가 | Gotham이 DCGS-A보다 우수한 위치 예측 \[Wikipedia\] |
| 사례: 남중국해(데모 시나리오) | 어선 집결·구축함 실종 미인지 | AI가 "어두운" 선박 탐지, 봉쇄 리스크 경보, COA 생성 |

### 1.5 운영 워크플로우

1. 다중 소스 데이터 수집 → Gotham 연합 레이어(Federation Layer)
2. Entity Resolution 엔진이 유사도 임계값(s_ij &gt; θ) 기반으로 엔티티 통합
3. 온톨로지 레이어에서 관계 그래프 구축
4. 분석관이 쿼리/시각화 도구로 네트워크 탐색
5. AI 모델이 경보 생성 → 분석관 검토 → 작전 결심

**수치 투명성**: 유사도 임계값 θ는 공개되지 않았다. 도메인(테러 vs. 일반 범죄)과 임무별로 달라지며, 잘못된 임계값 설정 시 무고한 민간인이 테러리스트 네트워크에 포함되는 위험이 있다.

### 출처

- Palantir Gotham API Documentation: https://palantir.com/docs/gotham/api/revdb-resources/resolution/resolution-basics/
- Wikipedia - Palantir: https://en.wikipedia.org/wiki/Palantir
- Palantir Defense Solutions: https://www.palantir.com/offerings/defense/
- Defense OSDK: https://www.palantir.com/defense/sdk/

---

## 2. 헬스케어/제약 — Palantir Foundry

### 2.1 사례 A: NIH N3C — 세계 최대 COVID-19 코호트 데이터 통합

**배경**: 미국 국립보건원(NIH) 산하 N3C(National COVID Cohort Collaborative)는 미국 전역 75개 이상 의료 기관의 COVID-19 환자 데이터를 단일 분석 환경으로 통합하는 프로젝트다. Palantir Foundry가 AWS GovCloud 기반 보안 데이터 엔클레이브로 구동한다.

**온톨로지 구조**: N3C는 \*\*OMOP 5.3.1 공통 데이터 모델(CDM)\*\*을 표준 온톨로지로 채택했다. 이는 팔란티어가 온톨로지 스키마를 자체 정의하는 방식이 아니라, 보건의료 업계 표준을 온톨로지 레이어에 수용한 사례다.

**확인된 Object Types** (출처: PMC 학술 논문 PMID 32761549):

| Object Type | 설명 | 예시 속성 |
| --- | --- | --- |
| Patient (Person) | 환자 프로파일. 코호트 분류 포함 | 연령, 성별, 인종, COVID 양성/음성/가능성 |
| Encounter | 의료 접촉 이벤트 | 방문 유형(외래/입원/ICU), 기간, 기관 |
| Lab Result | 검사 결과 | PCR 결과, 측정값, 측정일, LOINC 코드 |
| Diagnosis | 진단 코드 | ICD-10 코드, 진단일, 진단 유형 |
| Procedure | 시술/처치 | 인공호흡기 적용, 처치 코드 |
| Medication | 약물 투여 | 약물명, 용량, 투여 경로 |

**통합 데이터 소스**: ACT(Accrual to Clinical Trials), PCORnet, TriNetX 등 4개 CDM 형식의 이종 EHR 시스템. 총 1,300만 명 이상 환자, 50억 건 이상 데이터 행.

**온톨로지 도입 전/후**:

- **전**: 각 기관이 자체 EHR 형식 사용. COVID-19 연구에 필요한 환자 수 확보가 불가능(단일 기관 데이터로는 통계적 유의성 부족)
- **후**: OMOP 기반 온톨로지로 이기종 데이터 자동 변환. 200개 이상 연구 프로젝트가 단일 플랫폼에서 코호트 쿼리. 기계학습으로 중증도 예측, 위험 요인 분석

**실행 연결**: 이 인프라로 가능해진 의사결정 → (1) 취약 집단 우선 백신 배분 계획, (2) 코로나19-기저질환 상관관계 분석을 통한 임상 가이드라인 업데이트, (3) 약물 재창출(remdesivir 등) 후보 탐색.

\[출처: PMC 논문 PMC7454687, PMC7814838; NIH-Palantir 계약 발표\]

### 2.2 사례 B: HHS Protect / Tiberius — 백신 배포 온톨로지

**배경**: 팔란티어는 HHS(미국 보건복지부)를 위해 코로나19 종합 데이터 플랫폼 HHS Protect를 구축하고, 그 위에 백신 배포 특화 시스템 **Tiberius**를 개발했다. 최대 3,000명의 사용자(HHS, CDC, FEMA, 국방부, 주정부, 약국 체인)가 사용했다.

**Tiberius 온톨로지 구조** (출처: 공개 문서 및 NIH 온톨로지 연구 논문):

온톨로지는 백신 배포의 "행동(Actions)", "자원(Resources)", "수혜 집단(Populations)"을 3축으로 구성되었다:

- **행동 축**: 교육(Educate), 우선순위화(Prioritize), 위치파악(Locate), 소통(Communicate), 조율(Coordinate), 동원(Mobilize), 재배치(Redirect)
- **자원 축**: 공간적(거리/위치), 시간적(가용성/일정), 재정, 정보, 인적, 기술적 자원
- **데이터 소스**: 연방 기관, 주/지방 정부, 제약사, 물류 유통사

**통합 데이터 소스**:

- 인구통계 데이터 (연령, 인종, 직업군 — 우선순위 집단 식별)
- 백신 생산·재고 데이터 (제약사)
- 물류·배송 데이터 (유통사)
- 공중보건 데이터 (감염 현황, 병원 용량)
- 소매약국 예약 시스템

**온톨로지 도입 전/후**:

| 구분 | 도입 전 | 도입 후 |
| --- | --- | --- |
| 데이터 접근 | 기관별 분산. 백신 재고를 실시간으로 아는 주체 없음 | 단일 대시보드에서 생산→배분→접종 전 과정 가시화 |
| 우선순위 결정 | 수동 인구 통계 분석 | 인구통계+직업 데이터 융합으로 취약군 자동 식별 |
| 재배분 결정 | 불가 (데이터 없음) | 과잉/부족 지역 실시간 감지 후 재배분 권고 |

**수치 투명성**: "40% 더 많은 백신 도달"이나 "30% 빠른 배포" 같은 정량적 성과는 공식 발표되지 않았다. HHS는 PII(개인식별정보) 미포함을 강조했으나, 개인 수준 추적 가능성에 대한 우려가 공익감시 단체에서 제기되었다 (출처: Public Integrity).

\[출처: GovConWire, FedScoop, HHS Protect FAQ, Public Integrity\]

### 2.3 사례 C: Palantir 임상 데이터 R&D 플랫폼

팔란티어 공식 사이트에 따르면, 100개 이상 면역치료제 임상시험(25,000명 이상 환자)의 종양학 데이터를 Foundry로 통합했다. 데이터 형식은 HL7, FHIR, CDISC, BAM/VCF(유전체 파일)를 자동 통합한다.

**반증 탐색**: 특정 제약사와의 구체적 아웃컴 데이터는 공개된 것이 없다. AstraZeneca 협업이 언급되는 경우가 있으나 원문 확인 결과 해당 파트너십은 검색 결과에서 확인되지 않았다. **반증 미발견**이나 특정 제약사 협업의 구체적 성과는 입증 불가.

### 출처

- PMC 논문 (N3C): https://pmc.ncbi.nlm.nih.gov/articles/PMC7454687/
- NIH-Palantir 계약: https://www.biospace.com/national-institutes-of-health-awards-palantir-with-contract-to-advance-critical-health-research
- HHS Protect FAQ: https://www.hhs.gov/sites/default/files/hhs-protect-faqs.pdf
- Palantir Clinical Data R&D: https://www.palantir.com/impact/clinical-data-rd/

---

## 3. 제조/공급망 — Airbus Skywise & Stellantis

### 3.1 사례 A: Airbus Skywise — 항공 온톨로지

**배경**: 2015년, Airbus는 A350 항공기 생산량을 4배 늘리는 목표를 세웠다. 5백만 개 부품이 4개국, 8개 이상 공장에 분산되어 있었으며, "특정 항공기에 현재 남은 작업이 무엇인가?"라는 단순한 질문에 아무도 답할 수 없었다. Palantir Foundry가 Skywise 플랫폼의 기술 엔진이다.

**확인된 Object Types** (출처: Palantir-Airbus Partnership Overview PDF, Skywise 브로슈어):

| Object Type | 속성 예시 | 관계 |
| --- | --- | --- |
| Aircraft (by Tail Number) | 기종, 등록번호, 항공사, 도입일 | → Sensor, MaintenanceEvent, FlightPhase |
| Sensor | 센서 ID, 유형, 측정 주기 | → Aircraft, Reading |
| FlightPhase | 이륙/순항/착륙, 시작/종료 시간 | → Aircraft, Reading |
| MaintenanceEvent | 작업 유형, 담당팀, 부품 교체 내역 | → Aircraft, Part |
| Part (Component) | 부품 번호, 제조사, 납기일, 결함 여부 | → Aircraft, Supplier, WorkOrder |
| WorkOrder | 작업 지시 내용, 우선순위, 담당 팀 | → Aircraft, Part |
| Supplier | 회사명, 납품 이력, 공급 정확도 | → Part, ProductionSchedule |
| ProductionSchedule | 예정 완료일, 진행률, 블로킹 이슈 | → Aircraft, WorkOrder |

**통합 데이터 소스**:

- 항공기 센서 데이터: 항공기당 최대 20,000개 센서, 비행당 100만 데이터 포인트
- 생산 일정, 교대 일정, 부품 납품, 작업 지시서, 품질 이슈 데이터
- 100개 이상 항공사의 운항 데이터
- 공급망 납품 현황 (수백 개 공급사)

**온톨로지 도입 전/후**:

| 구분 | 도입 전 | 도입 후 |
| --- | --- | --- |
| 생산 현황 파악 | 팀별 데이터 사일로. 항공기 단위 통합 뷰 불가 | 단일 UI에서 일정/교대/부품/납품/결함 통합 조회 |
| A350 생산성 | 목표치 미달 | **A350 납품 33% 가속화** (팔란티어-에어버스 공동 발표) |
| 예지 정비 | 결함 발생 후 대응 | 센서 데이터 분석으로 결함 사전 탐지, 지연/취소 감소 |
| 공급망 가시성 | 납품 지연 인지 불가 | 공급사-에어버스 간 수요/공급 실시간 정렬 |

**수치 투명성**: "A350 납품 33% 가속화"는 팔란티어-에어버스 공동 발간 Partnership Overview PDF(2020)에 명시되어 있다. 단, 이 문서는 팔란티어가 제작한 마케팅 자료이므로 독립적 검증이 필요하다. "이 수치가 틀릴 수 있는 조건": 생산 가속화의 일부가 추가 인력 투입이나 병행 공정 최적화 같은 비소프트웨어 요인에 기인할 수 있다.

**확장**: Skywise는 현재 50,000명 이상 사용자, 10,500대 이상 항공기를 연결하는 항공 산업 공개 플랫폼으로 성장했다. 2026년 팔란티어-에어버스가 다년간 협력 연장 계약 체결.

### 3.2 사례 B: Stellantis (구 Fiat Chrysler) — 자동차 제조 온톨로지

**배경**: 2022년 5월, Stellantis(Fiat, Chrysler, Jeep, Dodge, Alfa Romeo 등 14개 브랜드)가 Palantir Foundry와 글로벌 엔터프라이즈 계약 체결. 2021년 합병 이후 14개 브랜드, 수십 개 공장, 복수의 물류 생태계를 단일 운영 플랫폼으로 통합하는 것이 목표.

**온톨로지 기능**:

- **공급망 부품 가용성**: 반도체 쇼티지 등 공급 제약 환경에서 부품 현황 실시간 추적
- **차량 품질 분석**: 수십억 커넥티드 차량 데이터 포인트로 생산 전 품질 이슈 예측
- **제조 디지털 트윈**: 14개 브랜드 데이터를 통합하는 공통 운영 데이터 레이어 구축

**통합 데이터 소스**: 커넥티드 차량 텔레메트리, 생산라인 센서, ERP 시스템, 물류 데이터, 품질 검사 기록

**반증 탐색**: 구체적 성과 수치(생산 효율 X% 향상 등)가 공식 발표된 것은 없다. "디지털 트윈"이라는 용어를 사용하지만 실제 온톨로지 스키마가 얼마나 성숙했는지는 외부에서 검증 불가. 2025년 스텔란티스가 대규모 구조조정을 진행했는데, 이는 소프트웨어 투자만으로 자동차 제조의 근본적 문제(수요 감소, 경쟁 심화)를 해결하기 어렵다는 점을 보여준다.

### 출처

- Palantir-Airbus Partnership Overview PDF: https://www.palantir.com/assets/xrfr7uokpv1b/7uEHPTEM0MkKtBFcx2zh63/9d75da5b76439717ac95135b5012479e/Palantir-Airbus-Partnership_Overview.pdf
- Palantir Airbus Impact: https://www.palantir.com/impact/airbus/
- Stellantis 계약 발표: https://www.palantir.com/newsroom/press-releases/palantir-announces-global-enterprise-deal-with-stellantis/
- Skywise 브로슈어 (2019): https://www.aircraft.airbus.com/sites/g/files/jlcbta126/files/Skywise-brochure-2019.pdf

---

## 4. 에너지/유틸리티 — BP

### 4.1 개요

BP는 2014년부터 팔란티어와 협력해왔다. 2024년 9월, 팔란티어 AIP를 추가하는 5년 전략적 파트너십 계약을 체결했다. 에너지 분야에서 가장 장기적이고 공개된 팔란티어 협력 사례 중 하나다.

### 4.2 온톨로지 구조

BP는 Foundry 위에서 \*\*모델 기반 디지털 트윈(Model-based Digital Twin)\*\*을 구축했다. 온톨로지의 핵심은 물리적 자산의 구조적 관계를 데이터 레이어에서 반영하는 것이다.

**주요 자산 유형과 관계** (출처: Palantir 블로그, SPE Journal):

| Object Type | 속성 예시 | 관계 |
| --- | --- | --- |
| Asset (설비) | 설비 ID, 유형(펌프/밸브/압축기), 위치, 설치일 | → Sensor, WorkOrder, Alert |
| Sensor | 센서 유형(압력/온도/유량), 측정 주기, 상태 | → Asset, Reading |
| Reading (측정값) | 측정 시간, 측정값, 이상 여부 | → Sensor |
| Alert | 경보 유형, 심각도, 발생 시간 | → Asset, Sensor |
| WorkOrder | 정비 유형, 담당팀, 완료 시간, 상태 | → Asset |
| Well/Field | 유정명, 생산량(bpd), 위치 | → Asset, ProductionForecast |
| ProductionForecast | 예측 생산량, 실제 생산량, 차이 | → Well/Field |

**통합 데이터 소스**:

- 200만 개 이상 센서 데이터 (실시간)
- 북해/멕시코만/오만(Khazzan 가스전) 해양 플랫폼 운영 데이터
- 엔지니어링 문서, 유지보수 이력
- 생산 트랜잭션 데이터

### 4.3 온톨로지 도입 전/후

| 구분 | 도입 전 | 도입 후 |
| --- | --- | --- |
| 데이터 접근 | 엔지니어링/운영/정비 데이터 별도 시스템. 상호 참조 수동 작업 | Foundry에서 전 과정 데이터를 단일 쿼리로 접근 |
| 신뢰성 분석 | 수백만 정적·동적 데이터 포인트 수동 분석. 지연 발생 | 저코드 변환으로 실시간 "나쁜 행위자(bad actor)" 식별 |
| 의사결정 속도 | 수일 | AI 권고사항으로 수 시간 내 결정 |
| Azule Energy 사례 | 미상 | 20만 bpd 생산 최적화 (출처: Palantir/SPE Journal) |

### 4.4 AIP 추가 이후

2024년 5년 계약에서 추가된 팔란티어 AIP(LLM 통합)는 기존 온톨로지 위에서 자연어 질의와 AI 권고사항을 제공한다. 엔지니어가 "현재 북해 플랫폼의 압력 이상 설비 목록을 보여줘"라고 물으면, AIP가 온톨로지 그래프를 탐색해 관련 Asset, Alert, WorkOrder를 연결해 보고한다.

**반증 탐색**: BP는 2024\~2025년 재생에너지 투자 축소 및 대규모 감원을 단행했다. 디지털 전환 투자 대비 실질 생산성 향상이 얼마나 이루어졌는지는 독립 검증이 어렵다. **부분적 반증**: 팔란티어와의 협력이 BP의 재무 성과를 구조적으로 개선했다는 근거는 공개 재무 데이터에서 명확히 확인되지 않는다.

### 출처

- Palantir 블로그 (BP 신뢰성 전환): https://blog.palantir.com/how-palantir-foundry-powers-bps-digital-transformation-in-reliability-4c644e36b6fc
- 5년 계약 발표: https://investors.palantir.com/news-details/2024/Palantir-and-bp-Agree-to-5-Year-Strategic-Relationship-With-New-AI-Capabilities/
- SPE Journal: https://jpt.spe.org/palantir-bp-agree-to-5-year-strategic-relationship-with-new-ai-capabilities

---

## 5. 금융 — AML·사기 탐지

### 5.1 개요

팔란티어의 금융 범죄 대응 솔루션(Foundry for AML)은 은행의 자금세탁방지(AML), KYC(고객 실사), 제재 스크리닝, 사기 탐지를 통합 온톨로지로 운영한다. Societe Generale(프랑스)가 2025년 3월 이 솔루션을 도입했으며, 여러 글로벌 은행에 배포 중이다.

### 5.2 온톨로지 구조

**확인된 Object Types** (출처: Palantir Foundry for AML PDF, 팔란티어 Impact 페이지):

| Object Type | 속성 예시 | 관계 |
| --- | --- | --- |
| Customer/Client | 이름, KYC 데이터, 위험 점수(25개 이상 지표), 행동 변화 이력 | → Account, Transaction, Alert |
| Account | 잔액, 계좌 유형, 거래 이력, 관련 엔티티 | → Customer, Transaction |
| Transaction | 금액, 유형(현금/국경간/암호화폐), 당사자, 이상 플래그 | → Customer, Account, Alert |
| Entity/Network | 실사한 정체성(PEP, 제재 대상), 실소유권 그래프 | → Customer, Organization |
| Alert/Case | 위험 점수 트리거, 시나리오 유형, 분석관 처리 상태 | → Customer, Transaction |
| Sanction/PEP Match | 글로벌 제재 목록 매칭 결과, 매칭 신뢰도 | → Customer, Entity |
| Organization | 기업명, 소유 구조, 실소유자 체인 | → Customer, Account |

**링크(관계) 유형**:

- Customer → Account (계좌 보유)
- Transaction ↔ Transaction (의심 거래 패턴, 예: 스머핑)
- Customer → Entity (관련 기업/개인)
- Organization → Organization (실소유권 체인)

### 5.3 온톨로지 도입 전/후

| 구분 | 도입 전 | 도입 후 |
| --- | --- | --- |
| 규칙 기반 시스템 | 20\~30년 전 로직 그대로. 정적, 변경 불가 | 포인트앤클릭 시나리오 엔진. 피드백 루프 학습 |
| 위험 점수 계산 | 단편적. 고객 전체 프로파일 반영 불가 | 25개 이상 지표 통합 → 전사적 위험 점수 |
| KYC 처리 시간 | 10일 | **10시간** (20배 효율화, 팔란티어 발표) |
| 진양성(True Positive)율 | 기준치 | **40배 향상** (팔란티어 AML 브로슈어 기재) |
| 비용 | 기준치 | **90% 절감** (팔란티어 AML 브로슈어 기재) |
| 조사 시간 | 기준치 | **50% 단축** (팔란티어 AML 브로슈어 기재) |

**수치 투명성**: 위 수치(40배 TP, 90% 비용 절감, 10시간 KYC)는 모두 팔란티어 자체 마케팅 자료(AML 브로슈어, 2021)에서 나온 것이다. 출처가 팔란티어이므로 독립적 검증이 필요하다. Societe Generale 사례는 2025년 3월 도입 발표이므로 아직 공개된 성과 지표가 없다. **이 수치가 틀릴 수 있는 조건**: 기준(baseline)이 어느 시스템 대비인지 명시되지 않아, 극단적으로 열악한 레거시 시스템과 비교했을 가능성을 배제할 수 없다.

**반증 탐색**: 팔란티어 AML 솔루션에 대한 공개적 실패 사례나 규제 당국의 지적은 검색 결과에서 발견되지 않았다. **반증 미발견**. 다만 AML 솔루션의 실제 SAR(의심거래보고) 품질 향상은 규제 당국이 확인해야 하므로, 팔란티어 데이터만으로 단정하기 어렵다.

### 5.4 운영 워크플로우

1. 온보딩 시스템, 거래 모니터링, 조사 시스템 데이터 → Foundry 통합
2. ML 모델이 트랜잭션 패턴과 고객 프로파일 기반으로 위험 점수 자동 생성
3. 시나리오 엔진이 의심 패턴(예: 스머핑, 레이어링) 탐지 → Alert 객체 생성
4. 분석관이 Alert를 검토하고 Case로 격상 또는 기각
5. 처리 결과가 피드백 루프로 ML 모델 개선

### 출처

- Palantir Foundry for AML (PDF): https://www.palantir.com/assets/xrfr7uokpv1b/1faMo2Wb4LJzUZNt3tOmTm/14cc66723edced7355e90c6ef1b56246/Foundry_for_AML.pdf
- Palantir AML 솔루션 페이지: https://www.palantir.com/offerings/anti-money-laundering/
- Societe Generale 파트너십: https://investors.palantir.com/news-details/2025/Palantir-Partners-with-Societe-Generale/
- Palantir Transaction Monitoring: https://www.palantir.com/impact/transaction-monitoring/

---

## 6. 정부/공공 — ICE 이민 집행 시스템

### 6.1 개요

팔란티어는 미국 이민세관단속국(ICE)에 두 가지 핵심 플랫폼을 제공한다: **FALCON**과 **ICM(Investigative Case Management)**. 이는 가장 논쟁적인 팔란티어 적용 사례로, FOIA 자료와 감시단체 보고서를 통해 운영 구조가 부분적으로 공개되어 있다.

### 6.2 온톨로지 구조

**FALCON 플랫폼의 주요 데이터 객체** (출처: FOIA 공개 자료, EFF, EPIC, BiometricUpdate):

| Object Type | 속성 예시 | 데이터 소스 |
| --- | --- | --- |
| Subject (대상자) | 이름, 바이오메트릭(지문/안면), 국적, 체류 신분 | SEVIS, Enforcement Integrated Database |
| Case | 사건 유형(형사/민사), 담당 요원, 상태 | ICM |
| Travel Record | 항공 탑승 기록, 입출국 일시, 경유지 | 국경 여행 데이터 |
| Location Event | GPS 위치, 시간, 이동 패턴 | 모바일 앱, 요원 보고 |
| Vehicle | 번호판, 스캔 시간, 위치 | 번호판 스캔 데이터베이스 |
| Encounter | 체포/심문 기록, 담당 요원, 사진 | 현장 요원 모바일 앱 |
| Asset (수사 대상 자산) | 자산 유형, 압류 기록 | Seized Assets and Case Tracking System |

**ELITE 도구 (2026년 신규, 출처: EFF 보고서)**:

- 추방 대상의 개인 정보를 지도에 시각화
- 주소 신뢰도 점수(HHS 메디케이드 데이터 연계)
- 지리공간 히트맵으로 집중 단속 지역 식별
- "특수 작전"에서 민감 정보 보호 기능 비활성화 가능

### 6.3 통합 데이터 소스

- SEVIS (학생비자 정보: 바이오메트릭, 수업 일정)
- Enforcement Integrated Database (추방 기록)
- Seized Assets and Case Tracking System
- 국경 여행 기록
- 운전면허 스캔 데이터베이스
- 휴대폰 위치 데이터
- 상업용 데이터 브로커 데이터
- HHS 메디케이드 데이터 (2026년 ELITE 연계, 심각한 프라이버시 문제 제기됨)

### 6.4 온톨로지 도입 전/후

| 구분 | 도입 전 | 도입 후 |
| --- | --- | --- |
| 데이터 접근 | 여러 연방 데이터베이스 개별 로그인 필요 | FALCON에서 수십 개 데이터베이스 통합 조회 |
| 대상자 추적 | 수동 수사 | 대량 검색, 행동 패턴 분석, 실시간 위치 추적 |
| 사건 관리 | ICM 이전: 비체계적 | ICM: 형사·민사 통합 사건 관리 |
| 확장 (2025\~) | FALCON만 존재 | ImmigrationOS ($3,000만 계약): 자기 추방 추적, 타겟 우선순위화 |

### 6.5 비판과 반증

**확인된 문제점** (FOIA 공개 자료 기반):

1. **민형사 경계 혼합**: 민사 추방 대상(단순 체류 기간 초과)을 ICM에 형사 수사처럼 등록하여 더 광범위한 데이터 접근 정당화
2. **접근 통제 부재**: 비활성 계정 자동 정지 없음. 퇴직 요원이 시스템 접근 유지
3. **데이터 합산**: 오라클 데이터베이스 미패치 상태 등 인프라 취약점
4. **메디케이드 데이터 연계**: HHS 건강 데이터를 이민 집행에 사용 — 의료 데이터 보호 원칙 위반 가능성

**이 사례의 핵심 구조적 질문**: 온톨로지가 얼마나 정교하게 설계되었느냐보다, 어떤 목적으로 어떤 데이터를 통합하도록 설계되었는가가 더 중요한 문제다. 팔란티어 온톨로지는 도구 중립적이지 않다 — 시민 데이터를 집중화하고 국가 집행력을 강화하는 방향으로 작동할 수 있다.

**인접 도메인**: \[이질 도메인: 데이터 집중화의 위험성 연구\] 중국 신장 위구르 감시 시스템(Xinjiang Integrated Joint Operations Platform)도 유사한 다중 소스 통합·엔티티 추적 구조를 가진다. 두 시스템의 기술적 구조는 유사하지만, 법적 맥락과 민주적 감시 메커니즘의 존재 여부가 다르다.

### 출처

- BiometricUpdate (ICE FALCON 분석): https://www.biometricupdate.com/202509/palantir-ice-and-the-quiet-expansion-of-a-biometric-dragnet
- EPIC FOIA 자료: https://epic.org/documents/epic-v-ice-palantir-databases/
- EFF (ELITE 도구): https://www.eff.org/deeplinks/2026/01/report-ice-using-palantir-tool-feeds-medicaid-data
- ImmigrationOS 계약: https://immpolicytracking.org/policies/reported-palantir-awarded-30-million-to-build-immigrationos-surveillance-platform-for-ice/
- American Immigration Council: https://www.americanimmigrationcouncil.org/blog/ice-immigrationos-palantir-ai-track-immigrants/

---

## 7. 교차 분석: 산업별 온톨로지 패턴 비교

### 7.1 공통 구조 패턴

모든 산업 사례에서 반복적으로 나타나는 온톨로지 설계 패턴:

| 패턴 | 국방 | 헬스케어 | 항공 | 에너지 | 금융 | 이민 |
| --- | --- | --- | --- | --- | --- | --- |
| 핵심 엔티티 통합 (Entity Hub) | 인물 | 환자 | 항공기 | 설비 | 고객 | 대상자 |
| 이벤트 타임라인 | Event | Encounter | FlightPhase | Reading | Transaction | Encounter |
| 계층적 소속 관계 | Org → Person | — | Supplier → Part | Well → Asset | Org → Account | Case → Subject |
| 경보/결과 객체 | — | — | WorkOrder | Alert | Alert/Case | Case |

### 7.2 온톨로지가 없었다면 어떤 문제가 있었는가

| 산업 | 온톨로지 없는 세계 |
| --- | --- |
| 국방 | 동일 인물이 NSA에 "John Smith", FBI에 "JS-1", CIA에 "Subject-45"로 분산. 수작업 매핑으로 수일 소요 |
| 헬스케어 | 75개 기관의 서로 다른 EHR 형식. COVID 연구에 필요한 통계적 유의성 확보 불가 |
| 항공 | A350의 "현재 남은 작업"을 아는 사람 없음. 생산 병목 인지 불가 |
| 에너지 | 200만 센서 데이터와 정비 이력이 별도 시스템. 예방 정비 타이밍 포착 불가 |
| 금융 | 고객의 모든 계좌와 거래를 연결해 세탁 패턴 탐지 불가. 규제 벌금 위험 |
| 이민 | 여러 연방 데이터베이스 개별 조회. 수일 소요 단속 계획 수립 |

### 7.3 비판적 관점: 온톨로지의 한계

반증 탐색 결과 확인된 구조적 한계:

1. **벤더 종속(Vendor Lock-in)**: 팔란티어 온톨로지는 독점 포맷. 이전(migration) 경로 없음
2. **확장 실패 이력**: 2016년 이전 온톨로지 기반 추론 시스템들은 규모 확장·일반화에 실패한 이력이 있다
3. **투명성 부재**: 폐쇄형 소스. 규제 당국이나 감사인이 시스템 내부를 검증하기 어려움
4. **성과 수치 편향**: 거의 모든 정량적 성과 수치가 팔란티어 자체 자료에서 나옴. 독립 검증 없음

---

## 8. 문제 재정의

> **조사 후 더 적합한 핵심 질문**: "팔란티어 온톨로지가 어떻게 구축되고 운영되는가"보다, "어떤 조직이 어떤 이유로 팔란티어 온톨로지를 선택하고, 그 결과 어떤 결정 권한이 어디로 이동하는가"가 더 본질적인 질문이다. 온톨로지 설계 자체보다 그것이 작동시키는 권력 구조의 변화가 더 중요한 분석 단위일 수 있다.

**관점 확장**:

1. 팔란티어 온톨로지가 AI 에이전트 시대에서 어떻게 진화할 것인가? 현재 AIP는 온톨로지를 LLM의 컨텍스트로 제공한다. 온톨로지가 에이전트의 "세계 모델"이 될 때 그 위험과 기회는 무엇인가?
2. 오픈소스 대안(Apache Atlas, OpenMetadata, OMOP)이 언제 팔란티어 온톨로지와 동등한 수준에 도달할 수 있는가?

---

## 참고 출처 목록

| \# | 출처 | URL | 신뢰도 |
| --- | --- | --- | --- |
| 1 | Palantir Gotham API 공식 문서 | https://palantir.com/docs/gotham/api/revdb-resources/resolution/resolution-basics/ | 높음 (1차) |
| 2 | Wikipedia - Palantir | https://en.wikipedia.org/wiki/Palantir | 중간 (편집 가능) |
| 3 | PMC 학술 논문 (N3C OMOP) | https://pmc.ncbi.nlm.nih.gov/articles/PMC7454687/ | 높음 (동료 검토) |
| 4 | Palantir-Airbus Partnership PDF (2020) | https://www.palantir.com/assets/xrfr7uokpv1b/7uEHPTEM0MkKtBFcx2zh63/9d75da5b76439717ac95135b5012479e/Palantir-Airbus-Partnership_Overview.pdf | 중간 (팔란티어 작성) |
| 5 | Palantir Foundry for AML PDF (2021) | https://www.palantir.com/assets/xrfr7uokpv1b/1faMo2Wb4LJzUZNt3tOmTm/14cc66723edced7355e90c6ef1b56246/Foundry_for_AML.pdf | 중간 (팔란티어 작성) |
| 6 | BiometricUpdate - ICE FALCON 분석 | https://www.biometricupdate.com/202509/palantir-ice-and-the-quiet-expansion-of-a-biometric-dragnet | 높음 (독립 저널리즘) |
| 7 | EFF - ELITE 도구 보고 | https://www.eff.org/deeplinks/2026/01/report-ice-using-palantir-tool-feeds-medicaid-data | 높음 (독립 감시단체) |
| 8 | Palantir 블로그 (BP 신뢰성) | https://blog.palantir.com/how-palantir-foundry-powers-bps-digital-transformation-in-reliability-4c644e36b6fc | 낮음 (팔란티어 자체 블로그) |
| 9 | EPIC FOIA 자료 | https://epic.org/documents/epic-v-ice-palantir-databases/ | 높음 (FOIA 공개 문서) |
| 10 | HHS Protect FAQ (공식) | https://www.hhs.gov/sites/default/files/hhs-protect-faqs.pdf | 높음 (1차 정부 문서) |
| 11 | Palantir Impact - Airbus | https://www.palantir.com/impact/airbus/ | 중간 (팔란티어 작성) |
| 12 | Stellantis 계약 발표 | https://www.palantir.com/newsroom/press-releases/palantir-announces-global-enterprise-deal-with-stellantis/ | 중간 (공식 발표) |
| 13 | Societe Generale 파트너십 | https://investors.palantir.com/news-details/2025/Palantir-Partners-with-Societe-Generale/ | 높음 (공식 IR) |
| 14 | HASH.ai - Palantir 문제점 | https://hash.ai/blog/the-problem-with-palantir | 중간 (독립 분석) |
