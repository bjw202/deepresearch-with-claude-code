# 아노다이징 피막 강건성의 정량적 지수화: 기존 연구 및 산업 사례 조사

> 조사일: 2026-03-18

---

## 1. EIS 데이터 기반 지수화 시도

### 1.1 저주파 임피던스 모듈러스 (|Z|_lf)

EIS 기반 코팅 평가에서 가장 널리 사용되는 단일 숫자 지표는 **저주파 임피던스 모듈러스**이다.

- **측정 주파수**: 0.01 Hz ~ 0.1 Hz (가장 흔히 |Z|₀.₀₁Hz 또는 |Z|₀.₁Hz)
- **의미**: 코팅 전체 저항(barrier + 기판 보호)의 종합적 척도
- **등급 분류 기준** (Amirudin & Thierry, 1995; USBR 기술 보고서):

| |Z| at 0.1 Hz (Ω·cm²) | 코팅 상태 |
|---|---|
| > 10⁸ | Excellent — 우수한 부식 방호 |
| 10⁶ ~ 10⁸ | Intermediate — 열화 진행 중 |
| < 10⁶ | Poor — 부식 방호 부족 |

- **한계**: Bongiorno et al. (2024)은 단일 시점 |Z|_lf 값보다 **시간 적분 지표** (∫(1/|Z|_lf)dt)가 금속 기판의 최종 외관과 더 강한 상관관계를 보인다고 보고. 이 적분 지표는 시험 기간과 전해질 조성에 무관하게 유효함.

**출처:**
- [Bongiorno et al. (2024) - Materials and Corrosion](https://onlinelibrary.wiley.com/doi/full/10.1002/maco.202313863)
- [USBR Electrochemical Impedance Methods (2019)](https://www.usbr.gov/tsc/techreferences/mands/mands-pdfs/ElectrochemicalImpedanceMethods_8540-2019-03_508.pdf)
- [Gamry Application Note: EIS of Organic Coatings](https://www.gamry.com/application-notes/EIS/eis-of-organic-coatings-and-paints/)

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

**출처:**
- [PMC Review: Electrochemical Characterization of Polymeric Coatings (2022)](https://pmc.ncbi.nlm.nih.gov/articles/PMC9228341/)
- [IntechOpen: EIS Review - Corrosion Mechanism Applied to Steels](https://www.intechopen.com/chapters/74147)

### 1.3 Coating Damage Function (DF%)

Bode plot 아래 면적 비를 이용하여 코팅 손상 정도를 정량화한다.

**수식:**

```
DF% = [1 - (A₂ + A₁) / A₁] × 100
```

- A₁: 용량성(capacitive) 영역 면적
- A₂: 저항성(resistive) 영역 면적
- 코팅 열화가 진행될수록 DF% 증가

**출처:**
- [PMC 9228341, Ref. 70](https://pmc.ncbi.nlm.nih.gov/articles/PMC9228341/)

### 1.4 Coating Delamination Index (CDI%)

0.1 Hz에서의 임피던스 변화율로 계면 박리(delamination) 정도를 추적한다.

**수식:**

```
CDI% = (Z_i - Z_f) / Z_i |₀.₁Hz × 100
```

- Z_i: 초기 임피던스 (0.1 Hz)
- Z_f: 최종 임피던스 (0.1 Hz)
- 계면 결합 파괴가 진행될수록 CDI% 증가

**출처:**
- [PMC 9228341, Ref. 77](https://pmc.ncbi.nlm.nih.gov/articles/PMC9228341/)

### 1.5 Breakpoint Frequency (f_b)

**정의:** 위상각이 -45°가 되는 주파수

- 코팅의 barrier 성능 열화를 추적하는 시간 의존적 지표
- f_b가 높아질수록 코팅 열화가 진행된 것
- 코팅 아래 활성 부식 면적(delaminated area)과 비례 관계
- 초기 우수한 코팅: f_b < 1 Hz
- 심하게 열화된 코팅: f_b > 10³ Hz

**출처:**
- [PMC 9228341](https://pmc.ncbi.nlm.nih.gov/articles/PMC9228341/)
- [USBR Coating Evaluation Report](https://www.usbr.gov/research/projects/download_product.cfm?id=1558)

### 1.6 Water Uptake (φ) — Brasher-Kingsbury 관계

코팅 내 수분 침투 정도를 정전용량 변화로 추정한다.

**수식:**

```
φ = log(Cp / Cp₀) / log(ε_w)
```

- Cp: 현재 코팅 정전용량
- Cp₀: 초기 코팅 정전용량 (t=0)
- ε_w: 물의 유전율 (78.3)
- φ: 수분 체적 분율 (0~1)

정전용량은 다음으로부터 산출:

```
Cp = 1 / (2πfZ_i)
```

**출처:**
- [PMC 9228341, Refs. 76, 107](https://pmc.ncbi.nlm.nih.gov/articles/PMC9228341/)

---

## 2. 국제 표준 및 산업 규격의 정량 평가

### 2.1 MIL-PRF-8625F (미군 아노다이징 규격)

미군 규격은 피막 유형별로 명확한 수치 기준을 제시한다.

#### 피막 중량 (Coating Weight)

| Type | 최소/최대 (mg/ft²) |
|---|---|
| Type I, IB | ≥ 200 |
| Type IC | 200 ~ 700 |
| Type II | ≥ 1,000 |
| Type IIB | 200 ~ 1,000 |
| Type III | 4,320 mg/ft² per 0.001 inch 두께 |

#### 피막 두께

| Type | 범위 (inch) |
|---|---|
| Type I/IB/IC/IIB | 0.00002 ~ 0.0007 |
| Type II | 0.00007 ~ 0.0010 |
| Type III | 0.0005 ~ 0.0045 (표준 0.002) |

Type III 두께 허용차: 0.002 inch 이하 ±20%, 초과 시 ±0.0004 inch

#### 부식 저항성 (Salt Spray, ASTM B117)

- **시험 시간**: 336시간
- **합격 기준**: 150 in² (5개 이상 시편) 기준 **총 15개 이하 고립 피트**, 각 피트 직경 0.031 inch 미만
- 1개 시편(30 in²) 기준: 5개 이하 고립 피트, 직경 0.031 inch 미만

#### 내마모성 (Type III Only, Taber Abrasion)

- CS17 wheel, 1,000 g 하중, 70 rpm, 10,000 cycles
- **Cu ≥ 2% 합금**: 마모 지수 ≤ 3.5 mg/1,000 cycles
- **기타 합금**: 마모 지수 ≤ 1.5 mg/1,000 cycles

#### 내광성 (Class 2 염색)

- 200시간 UV 노출 후 ΔE ≤ 3 (CIE L*a*b*)

#### 도장 밀착성

- 코팅-도장 간, 코팅-기판 간 층간 분리(intercoat separation) 불허

**출처:**
- [MIL-A-8625F 원문 (Coastline Metal Finishing)](https://www.coastlinemetalfinishing.com/uploads/Mil-A-8625%20Specification.pdf)
- [MIL-PRF-8625F 요약 (Anoplex)](https://www.anoplex.com/references/MIL-A-8625.html)

### 2.2 QUALANOD 품질 라벨 (유럽 건축용 아노다이징)

#### 실링 품질 — 질량 손실 시험 (ISO 3210)

- **합격 기준**: 질량 손실 ≤ **30 mg/dm²**
- 시험은 실링 후 2주 이내 실시

#### 실링 품질 — 어드미턴스 시험 (ISO 2931)

- 실링된 산화 피막의 전기적 어드미턴스를 측정
- **기준값**: 약 **20 μS** (피막 두께 20 μm 기준, 일부 규격에서 25 μS)
- 어드미턴스가 낮을수록 실링 품질 우수
- **제한**: Si > 2%, Mn > 1.5%, Mg > 3% 합금에는 적용 불가

#### 실링 품질 — 염료 반점 시험 (ISO 2143)

- 산 처리 후 염료 흡수 정도로 실링 품질 평가
- 정성적 판정 (염료 흡수 없음 = 양호)

#### 피막 두께 기준

- 공칭 ≤ 50 μm: 평균 두께 공칭값 ±20% 이내
- 공칭 > 50 μm: 평균 두께 공칭값 ±10 μm 이내
- 국소 두께: 등급 최소값의 80% 이상

#### 부식 저항성

- AASS (아세트산 염수분무): 1,000시간
- NSS (중성 염수분무): 336시간 (ISO 10074)

**출처:**
- [QUALANOD Specifications (ReadKong)](https://www.readkong.com/page/specifications-for-the-qualanod-quality-label-for-sulfuric-4642882)
- [ISO 2931:2017](https://www.iso.org/standard/70155.html)
- [ISO 2143:2017](https://www.iso.org/standard/70154.html)
- [ISO 3210 via QUALANOD Synopsis](https://www.qualanod.net/synopsis-of-iso-standards-for-qualanod-specifications.html)

### 2.3 관련 ISO/ASTM 표준 요약

| 표준 | 측정 대상 | 정량 지표 |
|---|---|---|
| ISO 2360 | 피막 두께 | μm (와전류법) |
| ISO 2931 | 실링 품질 | 어드미턴스 (μS) |
| ISO 2143 | 실링 품질 | 염료 흡수 등급 (정성) |
| ISO 3210 | 실링 품질 | 질량 손실 (mg/dm²) |
| ISO 9227 / ASTM B117 | 부식 저항성 | 피트 수, 피트 크기, 노출 시간 (h) |
| ASTM B137 | 피막 중량 | mg/ft² (용해법) |
| ASTM B244 | 피막 두께 | μm (와전류법) |

---

## 3. 복합 지수(Composite Index) 구축 사례

### 3.1 EIS 다중 파라미터 종합

EIS로부터 도출되는 주요 파라미터는 다음과 같으며, 이들을 조합하여 코팅 상태를 평가하는 시도가 다수 보고되었다:

1. **코팅 저항 (Rc)**: 전해질 차단 능력
2. **코팅 정전용량 (Cc)**: 수분 침투 정도 반영
3. **분극 저항 (Rp)**: 기판 부식 속도의 역수
4. **이중층 정전용량 (Cdl)**: 활성 부식 면적에 비례
5. **수분 흡수율 (φ)**: Brasher-Kingsbury 관계로 산출

Murray & Hack (1993)과 Amirudin & Thierry (1995)는 이 파라미터들의 시간 변화 패턴으로 코팅 열화 단계를 구분하는 프레임워크를 제안하였다.

### 3.2 Salt Spray-EIS 회귀 상관

Mansfeld & Kendig의 연구에서는 conversion-coated 알루미늄 합금에 대해:

- log(Rc)와 salt spray 통과 확률 간 **선형 회귀** 관계를 확인
- 168시간 salt spray 통과를 위한 **임계 Rc 값**을 합금별로 제안
- EIS가 salt spray보다 **극단적 성능 영역에서 더 민감한 판별력**을 보임

**출처:**
- [Mansfeld et al. - Salt Spray and EIS Correlation (ResearchGate)](https://www.researchgate.net/publication/240846029_A_Correlation_Between_Salt_Spray_and_Electrochemical_Impedance_Spectroscopy_Test_Results_for_Conversion-Coated_Aluminum_Alloys)
- [Corrosion Testing of Anodized Aerospace Alloys (Academia)](https://www.academia.edu/45181754/Corrosion_Testing_of_Anodized_Aerospace_Alloys_Comparison_Between_Immersion_and_Salt_Spray_Testing_using_Electrochemical_Impedance_Spectroscopy)

### 3.3 Machine Learning 기반 피막 품질 예측 모델

#### 아노다이징 공정 최적화

- **Random Forest-Levy Flight Algorithm (RF-LFA)**: 아노다이징 전처리 파라미터(Nitric bath pH, Caustic pH, alkaline pH, 시간)로부터 표면 마감, 피막 두께, 보정률을 예측. 기존 RF 및 DNN 대비 2~3배 우수한 예측 성능.
- **Hybrid Deep Neural Network**: 자동화 아노다이징 플랜트의 디지털 트윈 구축에 활용.

**출처:**
- [Random Forest Levy Flight Method - Chemical Engineering Science (2024)](https://www.sciencedirect.com/science/article/abs/pii/S0009250924008121)
- [Digital Twin Anodizing - Engineering Applications of AI (2023)](https://www.sciencedirect.com/science/article/abs/pii/S0952197623002701)

#### 코팅 열화 예측

- **Two-Stage ML 프레임워크** (npj Materials Degradation, 2025):
  - Stage 1: 환경 인자 → 물리적 특성 (광택, 밀착력, 접촉각, 황변도) 예측 (semi-supervised collaborative training)
  - Stage 2: 예측된 물리적 특성 → 코팅 건전/손상 판별
  - 9개 기후 환경에서 폴리우레탄 코팅 1년 옥외 노출 데이터 기반

- **CNN 기반 수명 예측**: 코팅 이미지로부터 직접 수명 예측

**출처:**
- [Two-stage ML for coating degradation - npj Materials Degradation (2025)](https://www.nature.com/articles/s41529-025-00614-6)
- [CNN lifetime prediction - npj Materials Degradation (2024)](https://www.nature.com/articles/s41529-024-00532-z)

#### ANN 기반 코팅 특성 예측 (일반)

ANN은 코팅 분야에서 다음 특성 예측에 활용:
- 피막 두께
- 경도
- 미세조직
- 트라이볼로지 특성
- 산화 거동

주요 알고리즘: SVM, ANN, Random Forest, Extra Trees, XGBoost

**출처:**
- [ANN Review for Surface Coatings - Materials Today (2020)](https://www.sciencedirect.com/science/article/abs/pii/S2214785320365779)
- [ML Algorithms for Coating Properties - ACS Omega (2022)](https://pubs.acs.org/doi/10.1021/acsomega.2c06471)

---

## 4. 피막 열화 모니터링 지수

### 4.1 저주파 임피던스의 시간 적분 지표

Bongiorno et al. (2024)이 제안한 지표:

**수식:**

```
D = ∫₀ᵗ [1 / |Z|_lf(τ)] dτ
```

- 단일 시점 |Z|_lf보다 코팅 아래 금속의 최종 외관과 **더 강한 상관관계**
- 시험 기간, 전해질 조성에 **무관하게 유효**
- 열화 이력(history)을 통합적으로 반영

**출처:**
- [Bongiorno et al. (2024) - Materials and Corrosion](https://onlinelibrary.wiley.com/doi/full/10.1002/maco.202313863)

### 4.2 3단계 열화 추적 (저주파 임피던스 기반)

코팅의 열화는 저주파 임피던스로 추적할 때 3단계로 구분된다:

1. **수분 흡수 단계**: |Z|_lf 완만한 감소, Cc 증가
2. **잠복 단계**: |Z|_lf 안정 또는 소폭 변동
3. **기판 부식 단계**: |Z|_lf 급격한 감소 (수 order of magnitude)

**출처:**
- [USBR Coating Evaluation by EIS](https://www.usbr.gov/research/projects/download_product.cfm?id=1558)
- [NACE CORROSION 2000 - EIS In-Situ Sensor for Coatings Degradation](https://onepetro.org/NACECORR/proceedings-abstract/CORR00/All-CORR00/NACE-00275/112089)

### 4.3 Wiener 과정 기반 수명 예측 모델

**3상 Wiener 과정 모델** (Measurement, 2024):

- EIS 데이터를 입력으로 코팅 수명을 확률적으로 예측
- 열화 과정을 3개 상(phase)으로 분할
- 각 상에 별도 수학 모델 및 운동 모델(kinetic model) 적용
- 상 전환 검출: t-분포 기반 + Schwarz Information Criterion (SIC)
- 신뢰도 및 수명 평가: Fiducial Inference-Monte Carlo (FIMC) 시뮬레이션

**출처:**
- [3-phase Wiener process for coating degradation - Measurement (2024)](https://www.sciencedirect.com/science/article/abs/pii/S0263224124014179)

### 4.4 가속 시험과 EIS 상관관계

| 가속 시험 | EIS 상관성 | 비고 |
|---|---|---|
| NSS (ASTM B117, 336h) | 양호 — |Z|_lf 감소 추이와 피트 발생 일치 | 표준 평가 방법 |
| AASS (아세트산 염수분무) | 과도한 부식 — 산화층 빠른 파괴 | 실제 노출보다 가혹 |
| AC/DC/AC 전기화학 가속 | NSS와 유사한 열화 양상 재현 | 수 시간 내 평가 가능 |
| 침지 시험 (Immersion) | EIS 모니터링 최적화 — in-situ 측정 용이 | 장기 추적에 적합 |

NSS와 prohesion 시험 결과는 EIS 측정과 정합성이 확인되었으나, AASS는 실제 사용 환경보다 과도하게 가혹한 것으로 평가됨.

**출처:**
- [Corrosion Testing of Anodized Aerospace Alloys (ResearchGate)](https://www.researchgate.net/publication/339399853_Corrosion_Testing_of_Anodized_Aerospace_Alloys_Comparison_Between_Immersion_and_Salt_Spray_Testing_using_Electrochemical_Impedance_Spectroscopy)
- [AC/DC/AC accelerated aging - Corrosion Science (2019)](https://www.sciencedirect.com/science/article/abs/pii/S0300944019300736)

---

## 5. 종합 정리: 기존 정량 지수 체계

### 5.1 현재 사용 가능한 정량 지표 분류

| 범주 | 지표 | 타입 | 강점 | 약점 |
|---|---|---|---|---|
| **단일 EIS 지표** | \|Z\|₀.₁Hz | 연속값 (Ω·cm²) | 측정 간편, 비파괴 | 단일 시점, 코팅 구조 무관 |
| **EIS 변화율** | CDI%, DF% | 백분율 | 열화 진행 추적 | 초기값 의존 |
| **EIS 효율** | PE%, IE% | 백분율 | bare 대비 직관적 비교 | 기준 시편 필요 |
| **EIS 적분** | ∫(1/\|Z\|)dt | 누적값 | 이력 통합, 강건 | 연속 모니터링 필요 |
| **표준 시험** | Salt spray hours, 피트 수 | Go/No-Go | 산업 표준, 합격 판정 | 시간 소요, 파괴적 |
| **물리 측정** | 두께, 중량, 어드미턴스 | 연속값 | 공정 관리 용이 | 부식 성능과 간접적 |
| **ML 예측** | 다변량 모델 출력 | 연속/범주 | 다인자 통합 | 학습 데이터 의존 |

### 5.2 핵심 발견

1. **표준화된 단일 "강건성 지수"는 아직 없다.** 산업 표준(MIL-PRF-8625, QUALANOD)은 개별 특성별 Go/No-Go 기준을 사용하며, 이를 통합한 단일 숫자 지수는 공식적으로 존재하지 않는다.

2. **EIS 기반 지표가 가장 유망하다.** |Z|_lf, CDI%, PE%, DF% 등은 비파괴적이고 정량적이지만, 각각 한계가 있어 단독 사용보다는 조합이 권장된다.

3. **시간 적분 지표가 최신 트렌드이다.** Bongiorno et al.의 ∫(1/|Z|)dt는 단일 시점 측정의 한계를 극복하며, Wiener 과정 모델은 이를 확률적 수명 예측으로 확장한다.

4. **ML 모델은 복합 지수 구축의 현실적 경로이다.** 공정 파라미터와 환경 인자를 통합하여 피막 품질을 예측하는 Random Forest, ANN 등의 모델이 활발히 연구 중이다.

5. **EIS와 가속 시험의 상관관계가 확립되고 있다.** log(Rc)와 salt spray 통과 확률 간 선형 관계가 확인되어, EIS를 기반으로 한 빠른 품질 판정이 가능하다.

---

## 참고문헌 (전체)

1. Amirudin, A., & Thierry, D. (1995). Application of EIS to study the degradation of polymer-coated metals. *Progress in Organic Coatings*, 26(1), 1-28.
2. Bongiorno, V., et al. (2024). Evaluating organic coating performance by EIS. *Materials and Corrosion*. [Link](https://onlinelibrary.wiley.com/doi/full/10.1002/maco.202313863)
3. [PMC Review: Electrochemical Characterization of Polymeric Coatings (2022)](https://pmc.ncbi.nlm.nih.gov/articles/PMC9228341/)
4. [USBR: Electrochemical Impedance Methods to Assess Coatings (2019)](https://www.usbr.gov/tsc/techreferences/mands/mands-pdfs/ElectrochemicalImpedanceMethods_8540-2019-03_508.pdf)
5. [Gamry: EIS of Organic Coatings and Paints](https://www.gamry.com/application-notes/EIS/eis-of-organic-coatings-and-paints/)
6. [MIL-A-8625F Specification](https://www.coastlinemetalfinishing.com/uploads/Mil-A-8625%20Specification.pdf)
7. [MIL-PRF-8625F Summary (Anoplex)](https://www.anoplex.com/references/MIL-A-8625.html)
8. [QUALANOD Specifications](https://www.readkong.com/page/specifications-for-the-qualanod-quality-label-for-sulfuric-4642882)
9. [ISO 2931:2017](https://www.iso.org/standard/70155.html)
10. [ISO 2143:2017](https://www.iso.org/standard/70154.html)
11. [Mansfeld et al. - Salt Spray and EIS Correlation](https://www.researchgate.net/publication/240846029_A_Correlation_Between_Salt_Spray_and_Electrochemical_Impedance_Spectroscopy_Test_Results_for_Conversion-Coated_Aluminum_Alloys)
12. [Corrosion Testing of Anodized Aerospace Alloys](https://www.researchgate.net/publication/339399853_Corrosion_Testing_of_Anodized_Aerospace_Alloys_Comparison_Between_Immersion_and_Salt_Spray_Testing_using_Electrochemical_Impedance_Spectroscopy)
13. [RF-LFA for Anodizing Optimization (2024)](https://www.sciencedirect.com/science/article/abs/pii/S0009250924008121)
14. [Digital Twin Anodizing (2023)](https://www.sciencedirect.com/science/article/abs/pii/S0952197623002701)
15. [Two-stage ML Coating Degradation (2025)](https://www.nature.com/articles/s41529-025-00614-6)
16. [3-phase Wiener Process for Coating (2024)](https://www.sciencedirect.com/science/article/abs/pii/S0263224124014179)
17. [AC/DC/AC Accelerated Aging (2019)](https://www.sciencedirect.com/science/article/abs/pii/S0300944019300736)
18. [ANN for Surface Coatings Review (2020)](https://www.sciencedirect.com/science/article/abs/pii/S2214785320365779)
19. [MDPI: Limits of |Z|_lf as Coating Performance Tool](https://www.mdpi.com/2079-6412/13/3/598)
20. [NACE CORROSION 2000: EIS In-Situ Sensor](https://onepetro.org/NACECORR/proceedings-abstract/CORR00/All-CORR00/NACE-00275/112089)
