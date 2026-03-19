# 아노다이징 피막 강건성의 정량적 지수화: 기존 연구 및 산업 사례 조사 (v2)

> 조사일: 2026-03-19
> 이전 버전: 2026-03-18 v1 기반, 신규 문헌 및 반증 탐색 보강

---

## 1. EIS 데이터 기반 지수화 시도

### 1.1 저주파 임피던스 모듈러스 (|Z|_lf)

EIS 기반 코팅 평가에서 가장 널리 사용되는 단일 숫자 지표이다.

- **측정 주파수**: 0.01 Hz ~ 0.1 Hz (가장 흔히 |Z|₀.₀₁Hz 또는 |Z|₀.₁Hz)
- **의미**: 코팅 전체 저항(barrier + 기판 보호)의 종합적 척도
- **등급 분류 기준** (Bacon et al., 1948; Amirudin & Thierry, 1995; USBR 기술 보고서):

| |Z| at 0.1 Hz (Ω·cm²) | 코팅 상태 |
|---|---|
| > 10⁸ | Excellent — 우수한 부식 방호 |
| 10⁶ ~ 10⁸ | Intermediate — 열화 진행 중 |
| < 10⁶ | Poor — 부식 방호 부족 |

- **역사적 맥락**: Bacon et al. (1948)이 300개 이상의 코팅 시스템을 조사하여 저항값과 부식 방호 성능 간 신뢰할 수 있는 상관관계를 최초 확립. "Good protection: > 100 MΩ·cm⁻², Poor protection: < 1 MΩ·cm⁻²" [1]
- **산업 권장**: USBR(미국 개척국)은 실무적으로 "실험실 평가에서 코팅 시스템은 수년간 풍화 노출의 후보가 되려면 |Z| > 10⁸ Ω을 유지해야 하며, 가급적 10⁹ Ω 이상이어야 한다"고 권고 [4]
- **수치 투명성**: 이 임계값은 주로 유기 코팅(에폭시, 폴리우레탄 등)에서 도출됨. 아노다이징 피막(무기 세라믹 산화물)에 직접 적용 시, 피막 구조(다공층+배리어층)와 유기 코팅의 연속 필름 구조 차이로 인해 임계값이 달라질 수 있음. [인접 도메인: 유기 코팅]

#### 반증 탐색: |Z|_lf의 한계

1. **Bongiorno et al. (2024)**: 단일 시점 |Z|_lf 값보다 **시간 적분 지표** (∫(1/|Z|_lf)dt)가 금속 기판의 최종 외관과 더 강한 상관관계를 보임 [2]
2. **Piccinini et al. (2023)**: 36개 코팅 시스템의 2년 C5 환경 노출 결과, |Z|_lf와 scribe corrosion creep 간에는 **명확한 상관관계가 없었음**. 다만 블리스터링 및 녹 발생과는 상관관계 확인 — 즉 |Z|_lf는 barrier 성능만 반영하며, 결함 기점 부식은 예측하지 못함 [19]
3. **가속 시험과의 불일치**: 가속 노출 시험이 실제 서비스와 동일한 열화 메커니즘을 유발하지 않으면, |Z|_lf 기반 평가가 실제 성능과 괴리될 수 있음 [20]

**실행 연결**: |Z|_lf는 초기 스크리닝과 공정 관리에는 유효하지만, 최종 품질 판정의 유일한 기준으로 사용하기에는 불충분. 시간 적분 지표 또는 다중 파라미터 조합과 병행 사용을 권장.

**출처:**
- [1] Bacon et al. (1948), via [PMC 9228341](https://pmc.ncbi.nlm.nih.gov/articles/PMC9228341/)
- [2] [Bongiorno et al. (2024) - Materials and Corrosion](https://onlinelibrary.wiley.com/doi/full/10.1002/maco.202313863)
- [4] [USBR Electrochemical Impedance Methods (2019)](https://www.usbr.gov/tsc/techreferences/mands/mands-pdfs/ElectrochemicalImpedanceMethods_8540-2019-03_508.pdf)
- [19] [Piccinini et al. (2023) - Limits of |Z|_lf](https://www.mdpi.com/2079-6412/13/3/598)

### 1.2 Protection Efficiency (PE%)

EIS에서 측정된 분극 저항(Rp) 또는 전하 이동 저항(Rct)을 이용하여 보호 효율을 산출한다.

**수식:**

```
PE% = (Rp,coated - Rp,bare) / Rp,coated × 100
```

또는

```
IE% = (Rct,coated - Rct,bare) / Rct,coated × 100
```

- Rp,coated: 코팅된 시편의 분극 저항
- Rp,bare: 비코팅 시편의 분극 저항
- 값이 높을수록 코팅의 부식 방호 성능이 우수

**수치 투명성**: PE%는 bare 시편의 Rp 값에 크게 의존. 합금 조성, 표면 상태, 전해질에 따라 Rp,bare가 수 order 변동 → PE%의 절대값 비교에 주의 필요.

**출처:**
- [3] [PMC Review: Electrochemical Characterization of Polymeric Coatings (2022)](https://pmc.ncbi.nlm.nih.gov/articles/PMC9228341/)

### 1.3 Porosity Estimation (P%)

코팅의 through-porosity를 EIS 분극 저항 비로 추정한다.

**수식:**

```
P = Rp,bare / Rp,coated
```

- P: 유사 다공도(pseudo-porosity), 0~1 범위
- Rp,bare: 비코팅 기판의 분극 저항
- Rp,coated: 코팅된 시편의 분극 저항
- 선형 분극 측정(LPR)과 EIS 양쪽에서 일관된 결과 확인 [21]

**수치 투명성**: 이 "유사 다공도"는 실제 기하학적 기공률과 다름. 전기화학적 활성 면적 비율을 나타내며, 기공 형상·분포 정보는 반영하지 못함. [인접 도메인: PVD 코팅에서 최초 개발]

**출처:**
- [21] [ResearchGate: Pseudo-porosity of coatings from LPR](https://www.researchgate.net/figure/Pseudo-porosity-of-the-coatings-calculated-from-linear-polarization-measurements-using_tbl2_370321892)
- [22] [ScienceDirect: Through-coating porosity in PVD coatings](https://www.sciencedirect.com/science/article/abs/pii/S0169433204004635)

### 1.4 Coating Damage Function (DF%)

Bode plot 아래 면적 비를 이용하여 코팅 손상 정도를 정량화한다.

**수식:**

```
DF% = [1 - (A₂ + A₁) / A₁] × 100
```

- A₁: 용량성(capacitive) 영역 면적
- A₂: 저항성(resistive) 영역 면적
- 코팅 열화가 진행될수록 DF% 증가

**실행 연결**: DF%는 Bode plot 전체 주파수 대역을 활용하므로 단일 주파수 지표보다 포괄적. 자동화 계산이 용이하여 인라인 모니터링에 적합.

**출처:**
- [3] [PMC 9228341](https://pmc.ncbi.nlm.nih.gov/articles/PMC9228341/)

### 1.5 Coating Delamination Index (CDI%)

0.1 Hz에서의 임피던스 변화율로 계면 박리(delamination) 정도를 추적한다.

**수식:**

```
CDI% = (Z_i - Z_f) / Z_i |₀.₁Hz × 100
```

- Z_i: 초기 임피던스 (0.1 Hz)
- Z_f: 최종 임피던스 (0.1 Hz)
- 계면 결합 파괴가 진행될수록 CDI% 증가

**수치 투명성**: CDI%는 초기값(Z_i)에 강하게 의존. 초기 임피던스가 매우 높은(>10⁹ Ω·cm²) 고품질 코팅에서는 미세한 열화도 CDI%로 크게 나타날 수 있어 과잉 경보 위험.

**출처:**
- [3] [PMC 9228341](https://pmc.ncbi.nlm.nih.gov/articles/PMC9228341/)

### 1.6 Breakpoint Frequency (f_b)

**정의:** 위상각이 -45°가 되는 주파수

- 코팅의 barrier 성능 열화를 추적하는 시간 의존적 지표
- f_b가 높아질수록 코팅 열화가 진행된 것
- 코팅 아래 활성 부식 면적(delaminated area ratio α = A_d/A)과 비례 관계
- 초기 우수한 코팅: f_b < 1 Hz
- 심하게 열화된 코팅: f_b > 10³ Hz

#### 반증 탐색: f_b의 한계

PMC 8358942의 연구에 따르면, 분산 수(dispersive number, n)가 이상적 값에서 크게 벗어나면 전통적 f₋₄₅° 방법은 "더 이상 breakpoint frequency로 간주할 수 없다". CRPA(Constant Ratio Phase Angle) 방법이 이 한계를 보완하는 대안으로 제안됨 [23].

**출처:**
- [3] [PMC 9228341](https://pmc.ncbi.nlm.nih.gov/articles/PMC9228341/)
- [23] [PMC 8358942: Delamination of polymer-coated galvanized steel](https://pmc.ncbi.nlm.nih.gov/articles/PMC8358942/)

### 1.7 Water Uptake (φ) — Brasher-Kingsbury 관계

코팅 내 수분 침투 정도를 정전용량 변화로 추정한다.

**수식:**

```
φ = log(Cp / Cp₀) / log(ε_w)
```

- Cp: 현재 코팅 정전용량
- Cp₀: 초기 코팅 정전용량 (t=0)
- ε_w: 물의 유전율 (78.3 at 25°C)
- φ: 수분 체적 분율 (0~1)
- 포화 수준: 일반적으로 2.5~3% 수분 함량에서 포화 [3]

#### 반증 탐색: Brasher-Kingsbury의 한계

Lacombe et al. (2017)은 EIS로 계산한 수분 흡수량이 중량법(gravimetry) 대비 **과대 추정**되는 경향을 보고. 원인은 CPE(Constant Phase Element) 파라미터에서 유효 정전용량(effective capacitance) 산출 시 수식 선택에 있음. CPE의 두 파라미터(Q, α)를 모두 사용하여 유효 정전용량을 계산하면 중량법과 일치하는 결과 획득 가능 [24]. 또한 코팅 팽윤(swelling)을 보정하면 양 방법 간 정합성이 개선됨.

**수치 투명성**: ε_w = 78.3은 25°C 순수한 물의 값. 전해질 농도, 온도, 코팅 내 구속 효과에 따라 실효 유전율이 달라질 수 있음.

**출처:**
- [3] [PMC 9228341](https://pmc.ncbi.nlm.nih.gov/articles/PMC9228341/)
- [24] [Lacombe et al. (2017) - Electrochimica Acta](https://www.sciencedirect.com/science/article/abs/pii/S0013468617303158)

### 1.8 저주파 임피던스의 시간 적분 지표 (D)

Bongiorno et al. (2024)이 제안한 **누적 열화 지표**:

**수식:**

```
D = ∫₀ᵗ [1 / |Z|_lf(τ)] dτ
```

- 단일 시점 |Z|_lf보다 코팅 아래 금속의 최종 외관과 **더 강한 상관관계**
- 시험 기간, 전해질 조성에 **무관하게 유효**
- 열화 이력(history)을 통합적으로 반영
- 반증 미발견: 현재까지 이 적분 지표의 유효성을 부정하는 연구는 발견되지 않음

**실행 연결**: 연속 모니터링 인프라(인라인 EIS 센서)가 있는 환경에서 즉시 적용 가능. 단, 이산적(batch) 측정 환경에서는 측정 간격에 따른 적분 정밀도 저하에 주의.

**출처:**
- [2] [Bongiorno et al. (2024) - Materials and Corrosion](https://onlinelibrary.wiley.com/doi/full/10.1002/maco.202313863)

---

## 2. 국제 표준 및 산업 규격의 정량 평가

### 2.1 MIL-PRF-8625F (미군 아노다이징 규격)

미군 규격은 피막 유형별로 명확한 수치 기준을 제시한다. **성능(Performance) 기반 규격**으로, EIS 등 전기화학적 지표는 포함하지 않고 전통적 시험(염수분무, 중량, 두께, 마모)으로 합격 여부를 판정한다.

#### 피막 중량 (Coating Weight, 비봉공 상태)

| Type | 최소/최대 (mg/ft²) |
|---|---|
| Type I, IB | ≥ 200 |
| Type IC | 200 ~ 700 |
| Type II | ≥ 1,000 |
| Type IIB | 200 ~ 1,000 |
| Type III | 4,320 mg/ft² per 0.001 inch 두께 |

#### 피막 두께

Type III 표준 두께: 0.002 inch (약 50 μm)
- 허용차: 0.002 inch 이하 ±20%, 초과 시 ±0.0004 inch

#### 부식 저항성 (Salt Spray, ASTM B117)

- **시험 시간**: 336시간
- **합격 기준**:
  - 150 in² (5개 이상 시편): 총 15개 이하 고립 피트, 각 직경 < 0.031 inch
  - 30 in² (1개 시편): 5개 이하 고립 피트, 각 직경 < 0.031 inch
- **Type III**: 봉공 처리된 경우에만 부식 시험 수행 (내마모 용도의 미봉공 Type III는 부식 시험 면제)

**수치 투명성**: 336h 염수분무는 실제 환경 노출과의 상관관계가 일관적이지 않음. 특히 동남아 등 고온다습 환경에서는 336h가 과소 평가일 수 있고, 건조 대륙성 환경에서는 과도할 수 있음. MIL 규격 자체가 "salt spray 결과를 옥외 성능 직접 예측에 사용해서는 안 된다"고 경고.

#### 내마모성 (Type III Only, Taber Abrasion, ASTM D4060)

- CS-17 wheel, 1,000 g 하중, 70 rpm, 10,000 cycles
- **Cu ≥ 2% 합금**: 마모 지수 ≤ 3.5 mg/1,000 cycles
- **기타 합금**: 마모 지수 ≤ 1.5 mg/1,000 cycles

#### 내광성 (Class 2 염색)

- 200시간 UV 노출 후 ΔE ≤ 3 (CIE L\*a\*b\*)

#### 도장 밀착성

- FED-STD-141 Method 6301.3에 따라 코팅-도장 간, 코팅-기판 간 층간 분리 불허

**출처:**
- [5] [MIL-A-8625F 원문](https://www.coastlinemetalfinishing.com/uploads/Mil-A-8625%20Specification.pdf)
- [6] [MIL-PRF-8625F 요약 (Anoplex)](https://www.anoplex.com/references/MIL-PRF-8625.html)

### 2.2 QUALANOD 품질 라벨 (유럽 건축용 아노다이징)

#### 실링 품질 — 질량 손실 시험 (ISO 3210, referee test)

- **합격 기준**: 질량 손실 ≤ **30 mg/dm²**
- 시험은 실링 후 2주 이내 실시
- 이것이 QUALANOD의 **심판 시험(referee test)** — 어드미턴스/염료 시험과 결과 상충 시 질량 손실이 우선

#### 실링 품질 — 어드미턴스 시험 (ISO 2931:2017)

- 실링된 산화 피막의 전기적 어드미턴스를 측정 (1 kHz, 단일 주파수)
- **합격 기준**: 약 **20 μS** (피막 두께 20 μm 기준)
  - 어드미턴스가 낮을수록 실링 품질 우수
  - 측정 기기 정밀도: 3 μS에서 ±1 μS, 20 μS에서 ±2 μS
- **적용 제한**:
  - Cold seal(저온 봉공) 부품에는 적용 불가
  - Si > 2%, Mn > 1.5%, Mg > 3% 합금에는 적용 불가
  - 전해 착색 중~진한 브론즈, 블랙에는 비착색 한도 적용 불가
- **최소 시험 면적**: 직경 약 20 mm 원형, 피막 두께 > 3 μm

**수치 투명성**: 20 μS 기준은 열수(boiling water) 및 니켈 아세테이트 봉공에 최적화됨. 저온 봉공(cold seal) 메커니즘은 기공 충전 방식이 달라 어드미턴스와 실링 품질 간 상관관계가 약화됨.

#### 실링 품질 — 염료 반점 시험 (ISO 2143)

- 산 처리 후 염료 흡수 정도로 실링 품질 평가
- 정성적 판정 (무착색/연색 마감에만 적용)

#### 피막 두께 기준

- 공칭 ≤ 50 μm: 평균 두께 공칭값 ±20% 이내
- 공칭 > 50 μm: 평균 두께 공칭값 ±10 μm 이내
- 국소 두께: 등급 최소값의 80% 이상

#### 부식 저항성

- AASS (아세트산 염수분무): 1,000시간
- NSS (중성 염수분무): 336시간

**출처:**
- [7] [QUALANOD Specifications](https://www.readkong.com/page/specifications-for-the-qualanod-quality-label-for-sulfuric-5773062)
- [8] [ISO 2931:2017](https://www.iso.org/standard/70155.html)
- [9] [QUALANOD V10 (2026)](https://www.qualanod.net/current-edition.html?file=files/qualanod/downloads/2026-01-01+QUALANOD+General+Regulations+I-VIII_V10.pdf)

### 2.3 ASTM B457 — 아노다이징 피막 임피던스 측정 (2023년 폐지)

- 아노다이징 피막의 임피던스를 측정하여 실링 품질 평가에 사용
- **원래 1967년 제정**, 수차례 갱신 후 **2023년 공식 폐지(withdrawn)**
- 폐지 사유: 미확인 (대체 표준 미지정)
- ISO 2931이 사실상의 국제 대체 표준 역할

**실행 연결**: ASTM B457 폐지는 단일 주파수 임피던스 측정의 한계를 시사. 향후 표준은 다중 주파수 EIS 또는 ML 기반 평가로 전환될 가능성.

**출처:**
- [10] [ASTM B457-67(R18) Withdrawn](https://store.astm.org/b0457-67r18.html)

### 2.4 관련 ISO/ASTM 표준 요약

| 표준 | 측정 대상 | 정량 지표 | 비고 |
|---|---|---|---|
| ISO 2360 | 피막 두께 | μm (와전류법) | 비파괴 |
| ISO 2931:2017 | 실링 품질 | 어드미턴스 (μS) | 비파괴, cold seal 제외 |
| ISO 2143 | 실링 품질 | 염료 흡수 등급 (정성) | 비파괴, 연색만 |
| ISO 3210 | 실링 품질 | 질량 손실 (mg/dm²) | 파괴, referee test |
| ISO 9227 / ASTM B117 | 부식 저항성 | 피트 수/크기, 노출 시간 (h) | 파괴, 장시간 |
| ASTM B137 | 피막 중량 | mg/ft² (용해법) | 파괴 |
| ASTM B244 | 피막 두께 | μm (와전류법) | 비파괴 |
| ASTM B457 | 피막 임피던스 | Ω (단일 주파수) | **2023년 폐지** |

---

## 3. 복합 지수(Composite Index) 구축 사례

### 3.1 EIS 다중 파라미터 종합 프레임워크

EIS로부터 도출되는 주요 파라미터와 이들의 코팅 상태 해석:

| 파라미터 | 물리적 의미 | 증가 시 해석 |
|---|---|---|
| 코팅 저항 (Rc) | 전해질 차단 능력 | 방호 우수 |
| 코팅 정전용량 (Cc) | 수분 침투 정도 반영 | 수분 흡수 증가 (열화) |
| 분극 저항 (Rp) | 기판 부식 속도의 역수 | 기판 보호 우수 |
| 이중층 정전용량 (Cdl) | 활성 부식 면적에 비례 | 부식 면적 확대 (열화) |
| 수분 흡수율 (φ) | Brasher-Kingsbury로 산출 | 열화 진행 |
| Breakpoint frequency (fb) | 활성 박리 면적 비례 | 열화 진행 |

Murray & Hack (1993)과 Amirudin & Thierry (1995)는 이 파라미터들의 **시간 변화 패턴**으로 코팅 열화 단계를 구분하는 프레임워크를 제안 [3].

### 3.2 Salt Spray-EIS 회귀 상관

Mansfeld & Kendig는 conversion-coated 알루미늄 합금에 대해:

- log(Rc)와 salt spray 통과 확률 간 **선형 회귀** 관계를 확인
- 168시간 salt spray 통과를 위한 **임계 Rc 값**을 합금별로 제안
- EIS가 salt spray보다 **극단적 성능 영역에서 더 민감한 판별력**을 보임

**수치 투명성**: 이 회귀 관계는 conversion coating(화성 코팅)에서 도출됨. 아노다이징 피막은 구조적으로 다르므로 회귀 계수의 직접 전용은 부적절하며, 아노다이징 전용 회귀 모델 구축이 필요. [인접 도메인: 화성 코팅(chromate conversion)]

**출처:**
- [11] [Mansfeld et al. - Salt Spray and EIS Correlation](https://www.researchgate.net/publication/240846029_A_Correlation_Between_Salt_Spray_and_Electrochemical_Impedance_Spectroscopy_Test_Results_for_Conversion-Coated_Aluminum_Alloys)

### 3.3 Machine Learning 기반 피막 품질 분류 및 예측

#### 3.3.1 비지도 학습(Unsupervised) — KMeans 클러스터링 (Bongiorno et al., 2025)

- **입력**: EIS 스펙트럼 전체 (주파수, |Z|, 위상각) — 등가회로 피팅 불요
- **알고리즘**: KMeans (Scikit-learn)
- **전처리**: 주파수와 |Z|는 로그 변환, 위상각은 라디안
- **정확도**: 외관 기반 성능 그룹 대비 **73%**
- **장점**: 전문가 개입 없이 코팅 성능 그룹 자동 분류
- **한계**: 73% 정확도는 생산 현장 의사결정에는 불충분할 수 있음

**출처:**
- [12] [Bongiorno et al. (2025) - J. Applied Electrochemistry](https://link.springer.com/article/10.1007/s10800-025-02268-3)

#### 3.3.2 비지도 학습 — 최적화된 클러스터링 파이프라인 (Scientific Reports, 2026)

- **입력**: 38개 산업용 코팅 시스템의 풍화 EIS 스펙트럼
- **방법론**: 30개 파이프라인 조합 비교 (정규화 × 차원축소 × 클러스터 수)
- **최적 구성**: per-block normalization of log|Z| + phase → 3-component PCA → t-SNE 시각화
- **핵심 발견**: 정규화 방법이 클러스터 분리도에 결정적 영향. 적절한 정규화 시 물리적으로 의미 있는 클러스터 + 높은 silhouette 값 달성
- **의의**: 등가회로 피팅, 사전 라벨링, 전문가 개입 **없이** 코팅 열화 구조를 완전 자동으로 파악

**실행 연결**: 이 파이프라인은 아노다이징 피막 EIS 데이터에도 적용 가능. per-block normalization이 핵심이므로, 아노다이징 특유의 임피던스 범위(10⁴~10⁹ Ω·cm²)에 맞는 정규화 파라미터 튜닝이 필요.

**출처:**
- [25] [Optimizing unsupervised clustering of EIS (2026) - Scientific Reports](https://www.nature.com/articles/s41598-026-35621-3)

#### 3.3.3 SOM(Self-Organizing Map) 기반 열화 단계 분류

- **입력**: 주기적 건습 반복(cyclic wet-dry) 조건에서의 EIS 시계열
- **방법**: 1D SOM 네트워크로 EIS 스펙트럼 자동 분류
- **결과**: 열화 과정이 3단계로 자동 분리
  - Stage I: 수분 침투 (완만한 과정)
  - Stage II: 코팅 아래 부식 개시 (비교적 빠른 전환기)
  - Stage III: 부식 확장 → 박리 → 방호 기능 상실
- **의의**: SOM이 "단순하고 효과적인" 열화 과정 분석 도구임을 입증

**출처:**
- [26] [SOM + EIS coating deterioration - Electrochimica Acta (2007)](https://www.sciencedirect.com/science/article/abs/pii/S1388248107000525)

#### 3.3.4 지도 학습 — Two-Stage ML (npj Materials Degradation, 2025)

- Stage 1: 환경 인자 → 물리적 특성 (광택, 밀착력, 접촉각, 황변도) 예측
- Stage 2: 예측된 물리적 특성 → 코팅 건전/손상 판별
- 9개 기후 환경에서 폴리우레탄 코팅 1년 옥외 노출 데이터 기반
- [인접 도메인: 폴리우레탄 유기 코팅]. 아노다이징 적용 시 물리적 특성 지표(광택 등)를 아노다이징 특화 지표(어드미턴스, 피막 중량)로 대체 필요

**출처:**
- [13] [Two-stage ML - npj Materials Degradation (2025)](https://www.nature.com/articles/s41529-025-00614-6)

#### 3.3.5 ANN 기반 아노다이징 공정 최적화

- **Random Forest-Levy Flight Algorithm (RF-LFA)**: 전처리 파라미터로부터 표면 마감, 피막 두께, 보정률 예측. 기존 RF 및 DNN 대비 2~3배 우수한 예측 성능 [14]
- **Hybrid DNN**: 자동화 아노다이징 플랜트의 디지털 트윈 구축 [15]

**출처:**
- [14] [RF-LFA for Anodizing - Chemical Engineering Science (2024)](https://www.sciencedirect.com/science/article/abs/pii/S0009250924008121)
- [15] [Digital Twin Anodizing - Engineering Applications of AI (2023)](https://www.sciencedirect.com/science/article/abs/pii/S0952197623002701)

### 3.4 AHP (Analytic Hierarchy Process) 기반 다기준 평가

AHP는 코팅 품질의 다기준 의사결정에 적용 가능한 방법론이다:

- 기준 쌍(pair-wise comparison)으로 상대적 중요도를 전문가 판단에 기반하여 산출
- 일관성 비율(CR) ≤ 0.1 필수
- 코팅 분야 직접 적용 사례: 현재까지 아노다이징 피막 강건성 지수화에 AHP를 적용한 공개 문헌은 **발견되지 않음**
- [인접 도메인: 건설 자재 선정, 제조 결함 우선순위화]. 아노다이징에 적용하려면 EIS 파라미터(|Z|, CDI%, DF%)와 표준 시험(salt spray, 두께, 중량) 간 가중치를 전문가 패널로 산출해야 함

**실행 연결**: AHP는 "전문가 지식이 풍부하나 데이터가 부족한" 초기 단계에서 복합 지수 가중치를 설정하는 데 적합. 데이터 축적 후에는 ML 기반 가중치로 전환 권장.

**출처:**
- [27] [AHP Wikipedia](https://en.wikipedia.org/wiki/Analytic_hierarchy_process)
- [28] [AHP for Construction Material - PMC 7178692](https://pmc.ncbi.nlm.nih.gov/articles/PMC7178692/)

---

## 4. 피막 열화 모니터링 지수

### 4.1 3단계 열화 추적 (저주파 임피던스 기반)

코팅의 열화는 저주파 임피던스로 추적할 때 3단계로 구분된다:

| 단계 | |Z|_lf 거동 | Cc 거동 | 물리적 해석 |
|---|---|---|---|
| I. 수분 흡수 | 완만한 감소 | 증가 | 전해질이 기공을 통해 침투 |
| II. 잠복기 | 안정 또는 소폭 변동 | 안정화 | 수분 포화, 계면 반응 개시 |
| III. 기판 부식 | 급격한 감소 (수 order) | 급증 | 활성 부식, 박리 진행 |

이 3단계 구분은 SOM 네트워크에 의해서도 자동으로 재현됨 [26].

**출처:**
- [4] [USBR Coating Evaluation by EIS](https://www.usbr.gov/research/projects/download_product.cfm?id=1558)
- [26] [SOM + EIS (2007)](https://www.sciencedirect.com/science/article/abs/pii/S1388248107000525)

### 4.2 Wiener 과정 기반 수명 예측 모델

**3상 Wiener 과정 모델** (Measurement, 2024):

- EIS 데이터를 입력으로 코팅 수명을 **확률적**으로 예측
- 열화 과정을 3개 상(phase)으로 분할, 각 상에 별도 수학 모델 및 운동 모델(kinetic model) 적용
- 상 전환 검출: t-분포 기반 + Schwarz Information Criterion (SIC)
- 신뢰도 및 수명 평가: Fiducial Inference-Monte Carlo (FIMC) 시뮬레이션
- **장점**: 비단조적(non-monotonic) 열화 과정도 모델링 가능 (Gamma/IG 과정은 단조 증가만 가능)

**수치 투명성**: Wiener 과정은 가우시안 독립 증분 분포를 가정. 실제 코팅 열화에서 급격한 상 전환(예: 봉공층 붕괴)이 발생하면 가우시안 가정이 위반될 수 있음.

**실행 연결**: 제조 현장에서 구현하려면 (1) 정기 EIS 데이터 수집 체계, (2) 상 전환 자동 감지 알고리즘, (3) 실시간 잔여수명(RUL) 대시보드가 필요. 초기에는 오프라인 분석으로 시작하여 점진적으로 자동화 확장 권장.

**출처:**
- [16] [3-phase Wiener process - Measurement (2024)](https://www.sciencedirect.com/science/article/abs/pii/S0263224124014179)

### 4.3 가속 시험과 EIS 상관관계

| 가속 시험 | EIS 상관성 | 필드 상관성 | 비고 |
|---|---|---|---|
| NSS (ASTM B117, 336h) | 양호 — |Z|_lf 감소 추이와 피트 발생 일치 | C5 환경 9년 노출과 **낮은** 상관 [20] | 표준이지만 실제 예측력 한계 |
| AASS (아세트산 염수분무) | 과도한 부식 — 산화층 빠른 파괴 | 실제 노출보다 가혹 | 일부 규격에서만 사용 |
| AC/DC/AC 전기화학 가속 | NSS와 유사한 열화 양상 재현 | 미확인 | 수 시간 내 평가 가능 |
| 침지 시험 (Immersion) | EIS 모니터링 최적화 — in-situ 측정 용이 | 양호 (barrier 성능 한정) | 장기 추적에 적합 |

#### 반증 탐색: 가속 시험-필드 상관의 한계

Piccinini et al. (2023)에 따르면, 여러 가속 실험실 노출 시험 결과를 해양 C5 환경 9년 필드 노출과 비교한 결과 **낮은 상관관계**를 보임. "가속 시험은 서비스에서 발생하는 것과 동일한 코팅 실패 메커니즘을 유발해야 하지만, 이 조건이 항상 충족되지는 않는다." [19][20]

**출처:**
- [19] [Piccinini et al. (2023) - Coatings](https://www.mdpi.com/2079-6412/13/3/598)
- [20] [ResearchGate: Accelerated vs field correlation](https://www.researchgate.net/publication/360887425_Correlations_between_standard_accelerated_tests_for_protective_organic_coatings_and_field_performance)

---

## 5. 등가회로 모델(ECM) 기반 파라미터 추출

### 5.1 아노다이징 피막 등가회로

봉공된 아노다이징 피막의 EIS 해석에는 일반적으로 **이중 시정수(two time-constant) 모델**을 사용:

```
Rs — [CPE_p || Rp] — [CPE_b || Rb]
```

- Rs: 용액 저항
- CPE_p, Rp: 다공성층(porous layer)의 정전용량 및 기공 저항
- CPE_b, Rb: 배리어층(barrier layer)의 정전용량 및 저항
- CPE(Constant Phase Element)는 비이상적 커패시터 거동을 보정 (파라미터: Q, α)

### 5.2 코팅 정전용량 참고값

- **손상되지 않은 코팅**: ~200 pF (1 cm² 시편, 25 μm 두께, 유전율 6 기준) [5]
- **두꺼운 고품질 코팅**: ~10 pF
- **손상된 코팅**: nF 범위 (예: 4 nF)
- **일반 규칙**: "정전용량은 면적이 증가하면 증가하고, 두께가 감소하면 증가"

### 5.3 CPE와 유효 정전용량

CPE에서 유효 정전용량(C_eff) 산출 시 Q와 α 모두 사용해야 정확:

```
C_eff = Q^(1/α) × R^((1-α)/α)
```

이 수식을 사용하지 않으면 수분 흡수량 등의 후속 계산에서 체계적 오차 발생 [24].

**출처:**
- [5] [Gamry: EIS of Organic Coatings](https://www.gamry.com/application-notes/EIS/eis-of-organic-coatings-and-paints/)
- [24] [Lacombe et al. (2017)](https://www.sciencedirect.com/science/article/abs/pii/S0013468617303158)

---

## 6. 종합 정리: 정량 지수 체계의 현황과 방향

### 6.1 현재 사용 가능한 정량 지표 분류

| 범주 | 지표 | 타입 | 강점 | 약점 |
|---|---|---|---|---|
| **단일 EIS 지표** | \|Z\|₀.₁Hz | 연속값 (Ω·cm²) | 측정 간편, 비파괴, 역사적 기준 확립 | 단일 시점, barrier만 반영, scribe 부식 예측 불가 |
| **EIS 변화율** | CDI%, DF% | 백분율 | 열화 진행 추적, 자동 계산 가능 | 초기값 의존, 고품질 코팅에서 과잉 경보 |
| **EIS 효율** | PE%, P% | 백분율/비율 | bare 대비 직관적 비교 | 기준 시편 필요, 합금/전해질 의존 |
| **EIS 적분** | ∫(1/\|Z\|)dt | 누적값 | 이력 통합, 전해질 무관, 가장 강건 | 연속 모니터링 필요 |
| **EIS 주파수** | f_b | Hz | 박리 면적 추정 | CPE n값 편차 시 부정확 |
| **EIS 수분** | φ (Brasher-Kingsbury) | 체적 분율 | 수분 침투 정량 | CPE 보정 필수, 과대추정 경향 |
| **표준 시험** | Salt spray h, 피트 수/크기 | Go/No-Go | 산업 표준, 합격 판정 | 파괴적, 장시간, 필드 상관 불확실 |
| **물리 측정** | 두께, 중량, 어드미턴스 | 연속값 | 공정 관리 용이, 비파괴(일부) | 부식 성능과 간접적 |
| **ML 분류** | KMeans, SOM, PCA+t-SNE | 범주형 | 다인자 통합, 전문가 불요 | 학습 데이터 의존, 73% 정확도 |
| **ML 예측** | RF, ANN, DNN | 연속/범주 | 공정-품질 직접 연결 | 도메인 전이 불확실 |
| **확률 모델** | Wiener RUL | 확률 분포 | 잔여수명 예측, 불확실성 정량 | 가우시안 가정, 데이터 필요량 큼 |

### 6.2 핵심 발견

1. **표준화된 단일 "강건성 지수"는 아직 없다.** 산업 표준(MIL-PRF-8625, QUALANOD)은 개별 특성별 Go/No-Go 기준을 사용하며, 이를 통합한 단일 숫자 지수는 공식적으로 존재하지 않는다.

2. **EIS 기반 지표가 가장 유망하지만, 단일 지표의 한계가 명확히 입증되었다.** |Z|_lf는 barrier 성능만 반영하고 scribe 부식을 예측하지 못하며(Piccinini 2023), f_b는 CPE 비이상성에 취약하고(PMC 8358942), Brasher-Kingsbury는 CPE 보정 없이 과대추정한다(Lacombe 2017).

3. **시간 적분 지표(∫(1/|Z|)dt)가 현재 가장 강건한 단일 지표이다.** 시험 조건에 무관하게 유효하며, 반증이 아직 보고되지 않음. 다만 연속 모니터링이 전제.

4. **비지도 ML이 급속히 발전 중이다.** 2025~2026년 연구에서 등가회로 피팅 없이 EIS 스펙트럼만으로 코팅 상태 자동 분류가 가능함을 입증. 정규화 방법이 핵심 변수.

5. **가속 시험-필드 상관의 불확실성이 지속된다.** 9년 C5 환경 데이터에서 실험실 가속 시험과의 상관이 낮다는 결과가 있어, EIS 기반 직접 평가의 상대적 가치가 더욱 부각.

6. **ASTM B457 폐지(2023)는 전환점이다.** 단일 주파수 임피던스 측정의 시대가 끝나고, 다중 주파수 EIS + 데이터 분석 기반 평가로의 전환을 시사.

### 6.3 복합 지수 구축을 위한 제안 경로

| 단계 | 접근법 | 데이터 요구 | 적합 상황 |
|---|---|---|---|
| **1단계: AHP 전문가 가중** | EIS 지표 + 표준시험 기준을 전문가 패널이 쌍대비교로 가중 → 가중 합산 지수 | 전문가 3~5명, 데이터 불요 | 초기 도입, 데이터 부족 시 |
| **2단계: 회귀 모델** | EIS 파라미터 → salt spray/필드 결과 회귀 (log(Rc) vs 통과 확률) | EIS+salt spray 병행 데이터 50~100건 | 중기, 상관 검증 |
| **3단계: 비지도 ML** | EIS 스펙트럼 → PCA+클러스터링 → 자동 등급 분류 | EIS 스펙트럼 100건+ | 등가회로 피팅 비용 절감, 자동화 |
| **4단계: 지도 ML + Wiener** | 공정 파라미터+EIS → 수명/품질 예측 + 잔여수명 추정 | 공정+EIS+필드 데이터 수백 건 | 장기, 디지털 트윈 |

**실행 연결**: 제조 현장에서는 1단계(AHP)를 즉시 시작하고, 동시에 EIS 데이터를 체계적으로 축적하여 2~3단계로의 전환을 준비하는 것이 가장 현실적인 경로이다. 특히 per-block normalization + PCA 파이프라인(2026 연구)은 아노다이징 EIS 데이터에 비교적 적은 커스터마이징으로 적용 가능할 것으로 예상.

---

## 참고문헌 (전체)

[1] Bacon, R.C., Smith, J.J., Rugg, F.M. (1948). Electrolytic resistance in evaluating protective merit of coatings on metals. *Industrial & Engineering Chemistry*, 40(1), 161-167. (via [PMC 9228341](https://pmc.ncbi.nlm.nih.gov/articles/PMC9228341/))
[2] Bongiorno, V., et al. (2024). Evaluating organic coating performance by EIS. *Materials and Corrosion*. [Link](https://onlinelibrary.wiley.com/doi/full/10.1002/maco.202313863)
[3] [PMC Review: Electrochemical Characterization of Polymeric Coatings (2022)](https://pmc.ncbi.nlm.nih.gov/articles/PMC9228341/)
[4] [USBR: Electrochemical Impedance Methods to Assess Coatings (2019)](https://www.usbr.gov/tsc/techreferences/mands/mands-pdfs/ElectrochemicalImpedanceMethods_8540-2019-03_508.pdf)
[5] [Gamry: EIS of Organic Coatings and Paints](https://www.gamry.com/application-notes/EIS/eis-of-organic-coatings-and-paints/)
[6] [MIL-A-8625F Specification](https://www.coastlinemetalfinishing.com/uploads/Mil-A-8625%20Specification.pdf)
[7] [MIL-PRF-8625F Summary (Anoplex)](https://www.anoplex.com/references/MIL-PRF-8625.html)
[8] [QUALANOD Specifications](https://www.readkong.com/page/specifications-for-the-qualanod-quality-label-for-sulfuric-5773062)
[9] [ISO 2931:2017](https://www.iso.org/standard/70155.html)
[10] [ASTM B457-67(R18) Withdrawn](https://store.astm.org/b0457-67r18.html)
[11] [Mansfeld et al. - Salt Spray and EIS Correlation](https://www.researchgate.net/publication/240846029_A_Correlation_Between_Salt_Spray_and_Electrochemical_Impedance_Spectroscopy_Test_Results_for_Conversion-Coated_Aluminum_Alloys)
[12] [Bongiorno et al. (2025) - Unsupervised classification of coating performance](https://link.springer.com/article/10.1007/s10800-025-02268-3)
[13] [Two-stage ML Coating Degradation (2025)](https://www.nature.com/articles/s41529-025-00614-6)
[14] [RF-LFA for Anodizing Optimization (2024)](https://www.sciencedirect.com/science/article/abs/pii/S0009250924008121)
[15] [Digital Twin Anodizing (2023)](https://www.sciencedirect.com/science/article/abs/pii/S0952197623002701)
[16] [3-phase Wiener Process for Coating (2024)](https://www.sciencedirect.com/science/article/abs/pii/S0263224124014179)
[17] [AC/DC/AC Accelerated Aging (2019)](https://www.sciencedirect.com/science/article/abs/pii/S0300944019300736)
[18] [Corrosion Testing of Anodized Aerospace Alloys](https://www.researchgate.net/publication/339399853_Corrosion_Testing_of_Anodized_Aerospace_Alloys)
[19] [Piccinini et al. (2023) - Limits of |Z|_lf](https://www.mdpi.com/2079-6412/13/3/598)
[20] [Correlations between accelerated tests and field performance](https://www.researchgate.net/publication/360887425_Correlations_between_standard_accelerated_tests_for_protective_organic_coatings_and_field_performance)
[21] [Pseudo-porosity from LPR measurements](https://www.researchgate.net/figure/Pseudo-porosity-of-the-coatings-calculated-from-linear-polarization-measurements-using_tbl2_370321892)
[22] [Through-coating porosity in PVD coatings](https://www.sciencedirect.com/science/article/abs/pii/S0169433204004635)
[23] [PMC 8358942: Delamination of polymer-coated galvanized steel](https://pmc.ncbi.nlm.nih.gov/articles/PMC8358942/)
[24] [Lacombe et al. (2017) - Brasher-Kingsbury water uptake EIS vs gravimetry](https://www.sciencedirect.com/science/article/abs/pii/S0013468617303158)
[25] [Optimizing unsupervised clustering of EIS (2026) - Scientific Reports](https://www.nature.com/articles/s41598-026-35621-3)
[26] [SOM + EIS coating deterioration (2007) - Electrochimica Acta](https://www.sciencedirect.com/science/article/abs/pii/S1388248107000525)
[27] [AHP - Wikipedia](https://en.wikipedia.org/wiki/Analytic_hierarchy_process)
[28] [AHP for Construction Material Selection - PMC 7178692](https://pmc.ncbi.nlm.nih.gov/articles/PMC7178692/)
[29] [QUALANOD V10 (2026)](https://www.qualanod.net/current-edition.html?file=files/qualanod/downloads/2026-01-01+QUALANOD+General+Regulations+I-VIII_V10.pdf)
[30] [Unsupervised clustering of EIS spectra for degradation states (2026)](https://www.sciencedirect.com/science/article/abs/pii/S0300944026001384)
