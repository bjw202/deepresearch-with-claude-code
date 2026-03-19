# 아노다이징 피막 강건성 평가: EIS 대안 방법론 및 복합 지수 구축

## 1. 비EIS 평가법

### 1.1 염수분무 시험 (Salt Spray Test)

#### NSS (Neutral Salt Spray) — ISO 9227
- 5% NaCl 용액, 35°C, pH 6.5~7.2
- 아노다이징 피막의 전반적 내식성 평가에 사용
- 시험 시간은 제품 규격에 따라 결정 (일반적으로 336~1000시간) [1]
- **장점**: 가장 보편적이고 재현성 높은 가속 부식 시험
- **한계**: 실제 환경과 상관관계가 약하다는 비판 존재. 아노다이징 피막의 경우 봉공 품질보다는 피막 자체의 결함(핀홀, 크랙)에 더 민감 [2]

#### AASS (Acetic Acid Salt Spray) — ISO 9227
- 5% NaCl + 빙초산, pH ~3.0
- NSS 대비 가속 효과 우수
- 아노다이징 피막의 산성 환경 내성 평가에 적합

#### CASS (Copper-Accelerated Acetic Acid Salt Spray) — ISO 9227
- 5% NaCl + 0.2g/L CuCl₂ + 빙초산, pH 3.1~3.3
- 장식용 아노다이징 피막 평가에 특히 적합 [3]
- 소비전자 제품의 장식용 아노다이징(착색 피막)에 높은 관련성
- **의사결정 연결**: CASS 시험은 소비전자 착색 아노다이징의 외관 열화(변색, 박리) 예측에 가장 적합한 가속 시험. NSS보다 판별력이 높으므로 수입검사 또는 공정 변경 시 우선 적용 권장

#### 공핍 부식 평가 — ISO 8993
- 염수분무 시험 후 피팅(pitting) 부식을 등급화하는 평가 체계
- 시각적 판정을 표준화하여 객관성 확보 [4]

### 1.2 봉공 품질 시험

#### 어드미턴스 시험 (Admittance Test) — ISO 2931
- 1kHz에서 측정, 단위: μS (마이크로지멘스)
- **합격 기준: 20μS 이하** (QUALANOD 기준) [5]
- 측정 범위: 3~200μS
- 봉공된 피막의 유전 특성을 전기적으로 평가
- **장점**: 비파괴, 빠른 측정 (수초), 현장 적용 가능
- **한계**: 피막 두께에 따라 보정 필요. 두꺼운 피막(>25μm)에서는 봉공 불량이어도 낮은 어드미턴스 값이 나올 수 있음
- **수치 투명성**: 20μS 기준은 QUALANOD 건축용 아노다이징 규격에서 유래. 소비전자용 얇은 피막(5~15μm)에서의 최적 임계값은 별도 검증 필요. [인접 도메인: 건축용 아노다이징] — 건축용은 20μm 이상의 두꺼운 피막을 전제하므로, 소비전자의 얇은 피막에서는 임계값을 더 엄격하게(예: 15μS 이하) 설정해야 할 수 있음
- **반증 탐색**: 어드미턴스만으로 봉공 품질을 완전히 판정할 수 없다는 연구 존재. 특히 니켈 봉공과 열수 봉공의 어드미턴스 응답이 상이하여 단일 임계값 적용에 한계가 있음. 반증 미발견은 아님 — ISO/TR 16689:2012에서 대안 시험법 비교 연구가 수행됨 [6]
- **의사결정 연결**: 인라인 봉공 품질 관리에 어드미턴스를 1차 스크리닝으로 사용하고, 불합격 시 산용해 시험으로 확인하는 2단계 체계 권장

#### 염료반점 시험 (Dye Spot Test) — ISO 2143
- 봉공된 표면에 염료 적용 후 흡착 정도 판정
- **합격 기준: 반점 강도 2 미만** [5]
- 등급: 0(완전 봉공)~5(미봉공)
- **장점**: 가장 간편하고 저렴한 봉공 품질 시험
- **한계**: 주관적 판정, 정량성 부족

#### 산용해 시험 (Acid Dissolution / Mass Loss Test) — ISO 3210
- 인산-크롬산 용액(85% H₃PO₄ 35mL + CrO₃ 20g + 물 1000mL)에 38°C(100°F), 15분 침지 [7]
- **합격 기준: 질량 손실 30 mg/dm² 이하** (QUALANOD) [5]
- AAMA 611-92 기준: 40 mg/dm² 이하 [7]
- ISO 3210:2017에서 두 가지 방법 제공:
  - Method 1: 사전 산처리 없음 (장식/보호 목적 피막)
  - Method 2: 사전 산처리 포함 (건축 외장용 피막)
- **수치 투명성**: 30 mg/dm² 기준은 양호한 열수 봉공을 전제. 니켈 봉공, 저온 봉공 등 대안 봉공 방식에서는 이 기준의 적용성이 달라질 수 있음
- **의사결정 연결**: 봉공 공정 변경(예: 열수→니켈→저온) 시 산용해 시험을 기준으로 동등성 검증 필수

#### Machu 시험 (변형 산침지 시험)
- ISO/TR 16689:2012에서 인산-크롬산 침지 시험의 대안으로 연구된 시험법 중 하나 [6]
- 인산 기반 용액에서의 질량 손실로 봉공 품질 평가
- 크롬산 미사용 변형도 연구 중 (환경 규제 대응)
- **현황**: 아직 독립 ISO 표준으로 채택되지 않음. 연구 단계

### 1.3 기계적 시험

#### 접착력 시험 (Adhesion Test)
- **크로스컷 시험 (Cross-cut Test)** — ISO 2409: 격자 절단 후 테이프 박리, 등급 0~5
- **필 테스트 (Peel Tape Test)**: 타르타르산-황산 아노다이징(TSA) 피막에 대한 정량적 접착력 평가법 연구 존재 [8]
- **의사결정 연결**: 소비전자에서 아노다이징 위에 추가 코팅(PVD, AF 코팅 등)을 적용할 경우, 층간 접착력이 핵심. 크로스컷 시험을 필수 항목으로 포함

#### 내마모 시험 (Abrasion Resistance Test)
- 테이버 마모 시험 (Taber Abraser) — ASTM D4060 / ISO 10074
- MIL-A-8625 Type III(하드 아노다이징)의 경우 마모 저항 기준 명시
- **의사결정 연결**: 스마트폰 케이스 등 직접 접촉하는 표면에서는 EIS보다 마모 시험이 실사용 수명 예측에 더 직접적

### 1.4 시험법 비교 요약

| 시험법 | 표준 | 파괴/비파괴 | 시간 | 비용 | 측정 대상 | 인라인 가능 |
|--------|------|-------------|------|------|-----------|-------------|
| NSS 염수분무 | ISO 9227 | 파괴 | 수백~수천 시간 | 중 | 전반적 내식성 | 불가 |
| CASS | ISO 9227 | 파괴 | 수백 시간 | 중 | 장식 피막 내식성 | 불가 |
| 어드미턴스 | ISO 2931 | 비파괴 | 수초 | 저 | 봉공 품질 | **가능** |
| 염료반점 | ISO 2143 | 비파괴* | 수분 | 저 | 봉공 품질 | 제한적 |
| 산용해 | ISO 3210 | 파괴 | 30분 | 저 | 봉공 품질 | 불가 |
| 크로스컷 접착 | ISO 2409 | 파괴 | 수분 | 저 | 피막 접착력 | 불가 |
| 테이버 마모 | ASTM D4060 | 파괴 | 수십분 | 중 | 내마모성 | 불가 |
| EIS | ASTM G106 등 | 비파괴 | 수분~수십분 | 고 | 배리어층/봉공 종합 | 제한적 |

*염료반점은 표면을 오염시킬 수 있어 완전한 비파괴로 보기 어려움

---

## 2. 소비전자/동남아 환경 특화 시험

### 2.1 인공땀 시험 (Artificial Sweat Test)

스마트폰, 스마트워치 등 피부 접촉 제품에서 아노다이징 피막의 땀 부식은 실제 필드 불량의 주요 원인이다 [9].

#### 인공땀 용액 표준
| 표준 | 조성 | pH | 용도 |
|------|------|-----|------|
| ISO 3160-2 | NaCl 20g/L + NH₄Cl 17.5g/L + 아세트산 5g/L + 젖산 15g/L | 4.7 | 시계 케이스 부식 시험 |
| EN 1811 (EU) | NaCl 0.5% + 요소 0.1% + 젖산 0.1% | 6.6 | 니켈 방출 시험 |
| ISO 105-E04 | 별도 규격 | 산성/알칼리성 | 섬유 염색 견뢰도 (금속 직접 적용 아님) |

- 부식의 95%는 NaCl에 기인, 젖산과 요소는 약 5% 기여 [10]
- **수치 투명성**: 실제 인체 땀의 pH는 4.0~6.8로 개인차가 크며, 운동 시 염분 농도가 크게 상승. 표준 용액은 "평균적" 조건을 모사하므로 극단적 사용자(고염분 분비)에 대한 예측력은 제한적
- [인접 도메인: 시계 산업] — ISO 3160-2는 시계 케이스용으로 개발. 스마트폰의 경우 접촉 면적, 접촉 시간, 온도 조건이 다르므로 직접 적용 시 조건 조정 필요
- **반증 탐색**: Apple 제품에서 실제로 땀에 의한 아노다이징 피막 부식이 보고됨(MacBook 팜레스트, Apple Watch). 이는 아노다이징이 땀 부식에 완전히 면역이 아님을 보여줌 [9]
- **의사결정 연결**: 소비전자 아노다이징 평가에 ISO 3160-2 기반 인공땀 침지 시험을 필수 항목으로 포함 권장. 특히 동남아 시장에서는 고온으로 인한 발한량 증가를 고려하여 시험 온도를 40°C 이상으로 설정

### 2.2 고온고습 시험 (85/85 Damp Heat Test)

- **조건**: 85°C, 85% RH, 지속 시간 500~1000시간 [11]
- 20년 수준의 수분 노출을 가속 시뮬레이션 가능
- **평가 항목**: 박리(delamination), 부식, 변색, 절연 저하
- 관련 표준: IEC 60068-2-78 (정상 고온고습), IEC 60068-2-67 (습열 사이클)
- **수치 투명성**: "20년 등가"는 특정 활성화 에너지를 전제한 Arrhenius 가속 모델 기반. 아노다이징 피막의 열화 메커니즘(봉공 열화, 수화물 변환)이 이 모델에 정확히 부합하는지는 검증 필요
- [인접 도메인: 반도체/태양전지] — 85/85 시험은 원래 반도체 패키지와 PV 모듈 수명 평가용. 아노다이징 피막에 대한 직접적 가속 계수 연구는 제한적
- **의사결정 연결**: 동남아(연평균 습도 75~85%, 온도 28~35°C) 환경 모사에 가장 적합한 가속 시험. 500시간 후 외관 변화와 어드미턴스 변화를 동시 측정하면 실사용 수명 예측 가능

### 2.3 열충격 시험 (Thermal Shock / Thermal Cycling)

- 아노다이징 피막의 열팽창계수 불일치가 핵심 열화 메커니즘
- 알루미늄의 열팽창계수는 산화알루미늄의 **5배** [12]
- 피막 두께 >6μm(0.25mil)에서 160°C 초과 시 크레이징 발생 [12]
- **관련 표준**: IEC 60068-2-14 (온도 변화), QUALANOD 열 크레이징 시험
- **소비전자 적용**: 스마트폰이 직사광선에 노출되면 표면 온도 60~70°C 도달 가능. 동남아의 경우 자동차 내부 방치 시 80°C+ 가능
- **의사결정 연결**: 피막 두께를 필요 이상으로 두껍게 하면 열충격 크레이징 위험 증가. 소비전자에서는 5~15μm 범위에서 내식성과 열충격 저항의 최적점 탐색 필요

### 2.4 동남아 환경 특화 복합 시험 프로토콜 (제안)

동남아 환경의 특성:
- 고온(28~35°C 연중), 고습(75~90% RH)
- 높은 발한량, 높은 염분 노출
- 강한 자외선 (착색 아노다이징 퇴색 가속)
- 대기 오염 (SO₂, NOₓ — 산업 지역)

**제안 시험 시퀀스**:
1. 인공땀 침지 (ISO 3160-2, 40°C, 72시간) → 외관/어드미턴스 평가
2. 85/85 고온고습 (500시간) → 외관/어드미턴스/산용해 평가
3. 열충격 사이클 (-20°C ↔ 70°C, 100사이클) → 크레이징 검사
4. CASS 시험 (48시간) → 피팅 등급 평가

이 시퀀스를 순차 수행하면 동남아 환경에서의 복합 열화를 모사할 수 있음.

---

## 3. 인라인/비파괴 검사 가능성

### 3.1 와전류(Eddy Current) 두께 측정

**현황**: 가장 성숙하고 실용적인 인라인 검사 기술

- **원리**: 교류 전자기장과 도전성 기재의 상호작용. 비도전성 아노다이징 피막이 유전체로 작용 [13]
- **정확도**: 100μm 이하에서 최고 분해능 (아노다이징 일반 범위 5~25μm에 적합) [14]
- **속도**: DeFelsko PosiTector 6000 기준 60~90회/분 측정 가능 [14]
- **상용 장비**: Helmut Fischer (Dualscope), DeFelsko (PosiTector 6000 NAS), 기타 다수
- **인라인 적용**: 컨베이어 통합 가능. 반제품(와이어, 바, 튜브) 150 m/s 속도까지 검사 가능 [15]
- **한계**: 두께만 측정. 봉공 품질, 다공성, 배리어층 상태는 평가 불가
- **의사결정 연결**: 두께 균일성은 품질의 필요조건이지 충분조건이 아님. 와전류 두께 측정을 1차 인라인 게이트로 사용하고, 봉공 품질은 별도 방법으로 보완

### 3.2 어드미턴스 인라인 측정

- ISO 2931 기반 어드미턴스 측정은 원리상 인라인화 가능
- 접촉식 전극 필요 (비접촉 불가)
- 봉공 직후 라인에서 측정하면 봉공 품질 실시간 모니터링 가능
- **한계**: 전극 접촉이 필요하므로 완전 자동화에는 지그 설계 필요
- **의사결정 연결**: 와전류(두께) + 어드미턴스(봉공 품질) 조합이 현재 가장 실현 가능한 인라인 품질 보증 체계

### 3.3 Fast EIS (빠른 임피던스 분광)

- 기존 EIS는 저주파수(0.01~0.1Hz) 스캔에 수분~수십 분 소요
- **가속 기법**:
  - 멀티사인(Multi-sine) 기법: 여러 주파수를 동시 인가 → 1회 측정 수초 가능
  - 제한 주파수 범위: 1Hz~10kHz만 측정하면 수초 가능 (단, 저주파 정보 손실)
- ISO 17463: 전기적 스트레스를 가해 열화를 가속, 24시간 내 배리어 성능 비교 가능 [16]
- **인라인 적용성**: 휴대형 포텐시오스탯(Gamry 등)의 자기 프로브로 현장 비파괴 측정 가능 [16]
- [인접 도메인: 유기 코팅/전착 도장] — Fast EIS 인라인 적용 연구는 대부분 유기 코팅 대상. 아노다이징 피막의 경우 임피던스가 매우 높아(10⁶~10⁸ Ω·cm²) 전류 감도 요구가 다름
- **반증 탐색**: Fast EIS의 멀티사인 기법은 비선형 시스템에서 오류 발생 가능. 아노다이징 피막의 고임피던스 + 비이상적 커패시턴스 특성에서 정확도 검증 필요. 실제 아노다이징 인라인 Fast EIS 적용 사례는 발견되지 않음
- **의사결정 연결**: 현재 시점에서 아노다이징 인라인 Fast EIS는 연구 단계. 단기적으로는 어드미턴스(1kHz 단일 주파수)가 더 실용적

### 3.4 OCT (Optical Coherence Tomography)

- **원리**: 저코히어런스 간섭계를 이용한 단면 이미징 [17]
- **분해능**: 축 방향 2.4μm, 횡 방향 3.4μm (초고분해능 시스템) [17]
- **측정 범위**: 2.5~20μm 두께 실시간 측정 가능 [17]
- **장점**: 비접촉, 단면 이미지 → 두께 + 구조(다공성, 결함) 동시 관찰 가능
- **한계**:
  - **투명/반투명 코팅에만 적용 가능**. 아노다이징 피막은 반투명(투명~불투명 스펙트럼)이므로 적용 가능성은 피막 종류에 따라 다름
  - 착색 아노다이징(특히 흑색)에서는 광 투과가 제한되어 적용 어려움
  - 장비 비용 높음 ($50K~$200K+)
- [인접 도메인: 제약 코팅] — OCT 인라인 적용 연구의 대부분은 제약 정제 코팅 대상. 금속 기재 위 산화물 피막에 대한 연구는 매우 제한적 [17]
- **반증 탐색**: 금속 기재 위 보호 코팅에 대한 SD-OCT(Spectral Domain OCT) 연구가 존재하나 [18], 아노다이징 피막 특화 연구는 발견되지 않음. 다공성 산화알루미늄의 산란 특성이 OCT 신호 품질을 저하시킬 가능성 있음
- **의사결정 연결**: 현재 시점에서 아노다이징 인라인 검사에 OCT는 과잉 투자. R&D용 피막 구조 분석에는 유용하나, 생산라인 QC에는 와전류+어드미턴스 조합이 비용효율적

### 3.5 머신비전 (Machine Vision)

- 표면 외관 검사: 색상 균일성, 결함(스크래치, 핀홀, 얼룩) 검출
- AI/딥러닝 기반 결함 분류 가능
- **장점**: 고속(라인스캔 카메라), 비접촉, 외관 품질 전수검사 가능
- **한계**: 피막 내부 특성(봉공 품질, 배리어층)은 평가 불가. 외관 양부 판정에 국한
- **의사결정 연결**: 머신비전은 외관 품질(미적 요소)에, 와전류/어드미턴스는 피막 물성에 각각 배치. 두 시스템의 병행이 인라인 품질 보증의 완성형

### 3.6 인라인 검사 방법 비교 및 도입 우선순위

| 방법 | 측정 대상 | 성숙도 | 속도 | 비용 | 도입 우선순위 |
|------|-----------|--------|------|------|---------------|
| 와전류 두께 | 피막 두께 | 상용화 | 매우 빠름 | 저 | **1순위** |
| 어드미턴스 | 봉공 품질 | 상용화 | 빠름 | 저 | **2순위** |
| 머신비전 | 외관 결함 | 상용화 | 매우 빠름 | 중 | **3순위** |
| Fast EIS | 피막 종합 특성 | 연구 단계 | 보통 | 고 | 4순위 (장기) |
| OCT | 두께+구조 | 연구 단계 | 보통 | 매우 고 | 5순위 (R&D) |

---

## 4. 복합 강건성 지수 구축 프레임워크

### 4.1 지수 구축의 필요성

단일 시험으로 아노다이징 피막의 "강건성"을 종합 평가할 수 없다. EIS, 어드미턴스, 염수분무, 마모 시험 등은 각각 다른 측면을 평가하며, 이들을 통합하는 복합 지수가 필요하다.

### 4.2 계층적 구조 (Hierarchical Structure)

```
아노다이징 피막 강건성 지수 (ARI: Anodizing Robustness Index)
├── L1: 배리어 특성 (Barrier Properties)
│   ├── L2: EIS |Z|₀.₁Hz (Ω·cm²)
│   ├── L2: 어드미턴스 (μS)
│   └── L2: 산용해 질량 손실 (mg/dm²)
├── L1: 환경 내성 (Environmental Resistance)
│   ├── L2: 염수분무/CASS 시간 (h)
│   ├── L2: 85/85 고온고습 후 열화도
│   └── L2: 인공땀 침지 후 열화도
├── L1: 기계적 내구성 (Mechanical Durability)
│   ├── L2: 접착력 등급
│   ├── L2: 내마모성 (mg 손실 또는 사이클)
│   └── L2: 열충격 크레이징 등급
└── L1: 외관 안정성 (Aesthetic Stability)
    ├── L2: 색상 변화 ΔE*
    └── L2: 광택 변화 ΔGU
```

### 4.3 가중치 결정 방법론

#### 주관적 방법: AHP (Analytic Hierarchy Process)
- 전문가 쌍대비교(1~9 스케일)를 통해 가중치 도출 [19]
- **장점**: 도메인 지식 반영, 직관적 해석
- **한계**: 전문가 편향, 일관성 비율(CR) 관리 필요 (CR < 0.1)
- **적용 시나리오**: 최초 지수 설계 시, 전문가 합의 기반으로 초기 가중치 설정

#### 객관적 방법: 엔트로피 가중법 (Entropy Weight Method)
- 데이터 분산이 큰 지표에 높은 가중치 부여 [20]
- **장점**: 데이터 기반, 주관 배제
- **한계**: 분산이 크다고 반드시 중요한 것은 아님. 측정 노이즈에 취약
- **적용 시나리오**: 충분한 양산 데이터 축적 후, 데이터 기반으로 가중치 교정

#### 객관적 방법: CRITIC (Criteria Importance Through Intercriteria Correlation)
- 표준편차와 지표 간 상관관계를 동시 고려 [20]
- **장점**: 중복 정보를 가진 지표의 과대 가중 방지
- **한계**: 소규모 데이터에서 상관 추정 불안정
- **적용 시나리오**: EIS와 어드미턴스처럼 상관이 높은 지표가 포함될 때 특히 유용

#### 복합 방법: AHP + 엔트로피 조합
- AHP로 주관적 중요도, 엔트로피로 객관적 변별력을 각각 산출
- 두 가중치의 조화평균 또는 선형 결합으로 최종 가중치 도출
- **장점**: 전문가 판단과 데이터 현실의 균형
- **권장**: 초기에는 AHP 위주, 데이터 축적 후 엔트로피 비중 점진적 확대

### 4.4 점수 통합 방법

#### 가중 합산법 (Weighted Sum Model, WSM)
- ARI = Σ(wᵢ × sᵢ), sᵢ는 정규화된 점수 (0~1)
- **장점**: 가장 단순하고 해석 용이
- **한계**: 보상적(compensatory) — 한 항목이 극히 낮아도 다른 항목이 높으면 총점 양호. 안전 관련 항목에 부적합
- **적용**: 전반적 순위 매기기

#### TOPSIS (Technique for Order Preference by Similarity to Ideal Solution)
- 이상적 해(best)와 부이상적 해(worst)로부터의 거리 기반 순위 [21]
- 벡터 정규화 사용
- **장점**: 스케일이 다른 지표 통합에 강건
- **적용**: 복수 아노다이징 조건/공급업체 비교 평가

#### VIKOR (VIšeKriterijumska Optimizacija I Kompromisno Rešenje)
- 그룹 효용 최대화 + 개별 후회 최소화의 타협해 [21]
- **장점**: "최악의 항목이 가장 덜 나쁜" 대안을 선택 — 비보상적 성격
- **적용**: 최소 품질 보장이 중요한 경우 (안전/내구성 항목)

### 4.5 정규화 방법

각 시험 결과를 0~1 스케일로 변환:

| 지표 | 방향 | 정규화 | 비고 |
|------|------|--------|------|
| EIS \|Z\|₀.₁Hz | 높을수록 좋음 | (x - min)/(max - min) | log 스케일 변환 후 정규화 |
| 어드미턴스 | 낮을수록 좋음 | (max - x)/(max - min) | 20μS 기준 |
| 산용해 질량손실 | 낮을수록 좋음 | (max - x)/(max - min) | 30 mg/dm² 기준 |
| CASS 시간 | 높을수록 좋음 | (x - min)/(max - min) | 첫 결함 발생까지 시간 |
| 접착력 등급 | 낮을수록 좋음 (0=최고) | (max - x)/(max - min) | ISO 2409 등급 역변환 |
| ΔE* 색차 | 낮을수록 좋음 | (max - x)/(max - min) | 시험 전후 차이 |

### 4.6 구현 로드맵

**Phase 1: 설계 및 파일럿** (1~3개월)
- 계층 구조 확정
- AHP 기반 초기 가중치 설정 (전문가 3~5인)
- 파일럿 배치(10~20 샘플)로 시험 및 점수 산출
- 가중치 민감도 분석

**Phase 2: 검증 및 교정** (3~6개월)
- 양산 데이터 축적 (100+ 샘플)
- 엔트로피/CRITIC으로 객관적 가중치 산출
- AHP 가중치와 비교, 조합 가중치 확정
- 필드 불량 데이터와의 상관 분석 → 예측 유효성 검증

**Phase 3: 인라인 통합** (6~12개월)
- 와전류(두께) + 어드미턴스(봉공) 인라인 측정
- 인라인 측정 가능 항목으로 축약된 "간이 ARI" 도출
- 간이 ARI와 전체 ARI의 상관 검증
- 합격/불합격 임계값 설정

### 4.7 지수 구축 시 주의사항

1. **보상 효과 경계**: 배리어 특성이 극히 불량한데 외관이 우수하여 총점이 양호한 경우를 방지. L1 레벨별 최소 기준(threshold) 설정 필요
2. **도메인 특이성**: 건축용, 자동차용, 소비전자용 아노다이징은 요구 특성이 다름. 가중치는 용도별로 별도 설정
3. **시간 의존성**: 초기 품질과 장기 내구성은 다를 수 있음. 가속 시험 전후의 ARI 변화(ΔARI)도 중요한 지표
4. **수치 투명성**: 모든 가중치의 근거(전문가 합의, 데이터 분석 결과)를 문서화하고, "이 가중치가 틀릴 수 있는 조건"을 명시

---

## 5. 근거 신뢰도 매트릭스

| 핵심 주장 | 출처 | 도메인 일치도 | 확신도 | 검증 필요 |
|-----------|------|---------------|--------|-----------|
| 어드미턴스 합격 기준 20μS | QUALANOD/ISO 2931 [5] | 건축용 → 소비전자 적용 시 조정 필요 | 중 | 예 — 얇은 피막에서의 임계값 |
| 산용해 합격 기준 30 mg/dm² | QUALANOD [5] | 건축용 → 소비전자 유사 적용 가능 | 중~고 | 부분 — 봉공 방식별 차이 |
| Al vs Al₂O₃ 열팽창계수 5배 차이 | 아노다이징 산업 문헌 [12] | 직접 관련 | 고 | 아니오 |
| 85/85 시험 = 20년 수분 노출 | 반도체/PV 산업 [11] | 인접 도메인 | 중 | 예 — 아노다이징 열화 가속 계수 |
| OCT 분해능 2.4μm | 제약 코팅 연구 [17] | 인접 도메인 | 고 (기기 성능) | 예 — 아노다이징 피막 투과성 |
| 인공땀 부식 95% NaCl 기인 | 금속 부식 연구 [10] | 직접 관련 | 고 | 아니오 |
| 와전류 60~90회/분 측정 | DeFelsko 제품 스펙 [14] | 직접 관련 | 고 | 아니오 |

---

## 참고문헌

[1] ISO 9227:2017 — Corrosion tests in artificial atmospheres — Salt spray tests. https://www.iso.org/standard/63543.html

[2] ScienceDirect — The effect of exposure conditions on performance evaluation of post-treated anodic oxides on an aerospace aluminium alloy. https://www.sciencedirect.com/science/article/pii/S0257897220308264

[3] ISO 9227 Corrosion Tests in Artificial Atmospheres — Micom Lab. https://www.micomlab.com/micom-testing/iso-9227/

[4] ISO 8993 — Rating system for the evaluation of pitting corrosion (referenced in ISO 9227 context)

[5] The Sealing Step in Aluminum Anodizing — Finishing and Coating. https://finishingandcoating.com/index.php/anodizingcat/1220-the-sealing-step-in-aluminum-anodizing ; QUALANOD Specifications

[6] ISO/TR 16689:2012 — Experimental research on possible alternative sealing quality test methods. https://www.iso.org/standard/57433.html

[7] ISO 3210:2017 — Assessment of quality of sealed anodic oxidation coatings by measurement of the loss of mass after immersion in acid solution(s). https://www.iso.org/standard/67983.html ; AAMA 611-92

[8] ScienceDirect — Adhesion properties of tartaric sulfuric acid anodic films assessed by a fast and quantitative peel tape adhesion test. https://www.sciencedirect.com/science/article/abs/pii/S0143749622000732

[9] Apple Community — Sweat damages aluminium body. https://discussions.apple.com/thread/7688618 ; MacRumors Forums — Anodised aluminium. https://forums.macrumors.com/threads/anodised-aluminium.2095490/

[10] ScienceDirect — Testing in artificial sweat: Comparison of metal release in two different artificial sweat solutions. https://www.sciencedirect.com/science/article/abs/pii/S0273230016302690

[11] 85/85 Damp Heat Test Guide. https://cntestingchamber.com/what-is-the-85-85-damp-heat-test/ ; MasterBond — The Rigors of 85°C + 85% Humidity Testing. https://www.masterbond.com/certifications/rigors-85%C2%B0c-85-humidity-testing

[12] Lorin Industries — Reducing Crazing in Anodized Aluminum. https://www.lorin.com/reducing-crazing-in-anodized-aluminum/ ; Finishing and Coating — Forming and Crazing of Anodized Aluminum

[13] Helmut Fischer — Amplitude-sensitive eddy current method. https://www.helmut-fischer.com/applications/solutions/amplitude-sensitive-eddy-current-method

[14] DeFelsko — Measuring Anodizing Thickness on Aluminum. https://www.defelsko.com/resources/anodizing-thickness-measurement-on-aluminum

[15] PMC — Non-Destructive Techniques Based on Eddy Current Testing. https://pmc.ncbi.nlm.nih.gov/articles/PMC3231639/

[16] Gamry Instruments — Basics of Electrochemical Impedance Spectroscopy. https://www.gamry.com/application-notes/EIS/basics-of-electrochemical-impedance-spectroscopy/ ; Nature — Field deployable impedance-based corrosion sensor. https://www.nature.com/articles/s41598-021-03840-5

[17] PMC — Feasibility of In-line monitoring of critical coating quality attributes via OCT. https://pmc.ncbi.nlm.nih.gov/articles/PMC7772539/

[18] MDPI Applied Sciences — Spectral Domain Optical Coherence Tomography for Non-Destructive Testing of Protection Coatings on Metal Substrates. https://www.mdpi.com/2076-3417/7/4/364

[19] Wikipedia — Analytic Hierarchy Process. https://en.wikipedia.org/wiki/Analytic_hierarchy_process

[20] DMAME Journal — Specific character of objective methods for determining weights of criteria: Entropy, CRITIC and SD. https://dmame-journal.org/index.php/dmame/article/view/194

[21] Wikipedia — VIKOR method. https://en.wikipedia.org/wiki/VIKOR_method ; ResearchGate — A comprehensive guide to the TOPSIS method. https://www.researchgate.net/publication/374540287
