# EIS(전기화학 임피던스 분광법)를 이용한 아노다이징 피막 강건성 평가 방법론 (v2)

## 목차

1. [EIS 기본 원리와 아노다이징 피막 적용](#1-eis-기본-원리와-아노다이징-피막-적용)
2. [EIS 파라미터와 피막 품질의 상관관계](#2-eis-파라미터와-피막-품질의-상관관계)
3. [EIS로 피막 열화/박리를 감지하는 방법](#3-eis로-피막-열화박리를-감지하는-방법)
4. [EIS의 한계점](#4-eis의-한계점)
5. [최신 AutoEIS/ML 기반 해석 자동화 동향](#5-최신-autoeisml-기반-해석-자동화-동향)
6. [참고문헌](#6-참고문헌)

---

## 1. EIS 기본 원리와 아노다이징 피막 적용

### 1.1 EIS의 기본 원리

EIS(Electrochemical Impedance Spectroscopy)는 전기화학 시스템에 소진폭(small amplitude)의 교류(AC) 전압 신호(통상 1~10 mV)를 인가하고, 그에 대한 전류 응답을 주파수 함수로 측정하는 비파괴 기법이다 [1][2]. 인가 전압이 충분히 작아야 시스템의 유사 선형(pseudo-linear) 응답 영역 내에서 측정이 가능하다.

측정된 임피던스 Z는 복소수로 표현된다:

```
Z(ω) = Z_real + j·Z_imaginary = |Z|·e^(jφ)
```

여기서 ω = 2πf (각주파수), |Z|는 임피던스 크기(magnitude), φ는 위상각(phase shift)이다.

### 1.2 나이퀴스트(Nyquist) 플롯 해석

나이퀴스트 플롯은 X축에 실수 임피던스(Z_real), Y축에 음의 허수 임피던스(-Z_imaginary)를 표시한다. 각 점은 하나의 주파수에서의 측정값이다.

**핵심 해석 포인트:**

- **반원(semicircle)의 직경**: 분극 저항(polarization resistance)에 대응. 반원이 클수록 전하이동 저항이 크며, 피막의 보호성이 우수함을 의미한다 [1].
- **고주파 절편(좌측)**: 용액 저항(Rs)에 해당.
- **저주파 절편(우측)**: Rs + Rp(분극 저항)의 합.
- **반원의 찌그러짐(depressed semicircle)**: 이상적 커패시터가 아닌 CPE(Constant Phase Element) 거동을 나타내며, 표면 불균일성이나 거칠기를 반영한다.
- **두 개의 반원**: 아노다이징 피막의 이중 구조(다공성층 + 배리어층)에 의한 2-시정수(two time constant) 응답 [3][4]. 밀봉(sealing) 처리된 시편에서 두 반원이 명확히 분리된다. 미밀봉 시편은 단일 시정수만 관찰되기도 한다 [4].
- **저주파 직선(45° 기울기)**: Warburg 임피던스로, 확산 지배 과정을 나타낸다 [1].

**한계**: 나이퀴스트 플롯에서는 각 데이터 포인트의 주파수 정보가 직접 보이지 않으므로, 반드시 보드 플롯과 병행 해석해야 한다 [1].

### 1.3 보드(Bode) 플롯 해석

보드 플롯은 X축에 log(주파수), Y축에 log|Z|(임피던스 크기)와 위상각(φ)을 동시에 표시한다.

**핵심 해석 포인트:**

- **log|Z| vs log(f) 곡선**:
  - 고주파 수평 영역: 용액 저항(Rs)
  - 저주파 수평 영역: Rs + Rp (총 저항)
  - 기울기가 -1인 영역: 순수 커패시티브 거동 (이상적 코팅) [1]
- **위상각 vs log(f) 곡선**:
  - -90°에 가까울수록 이상적 커패시터 거동 (양호한 피막)
  - 피크가 두 개인 경우: 2-시정수 시스템 (다공성층과 배리어층을 각각 반영) [4]
  - 위상각이 넓은 주파수 범위에서 -80° ~ -90°를 유지: 우수한 절연/보호 피막

**장점**: 나이퀴스트 플롯과 달리 주파수 정보를 직접 확인할 수 있어 각 주파수 영역에서의 피막 거동을 구분하기 용이하다 [1].

### 1.4 아노다이징 피막의 등가회로 모델

아노다이징으로 형성된 산화알루미늄 피막은 **이중 구조(duplex structure)**를 가진다:

- **내부 배리어층(barrier layer)**: 매우 얇고(수십 nm) 치밀한 구조. 궁극적 부식 방어선.
- **외부 다공성층(porous layer)**: 상대적으로 두껍고(수~수십 μm) 규칙적인 육각형 셀 구조 [3][5].

#### (a) 단순 Randles 회로

가장 기본적인 등가회로로, 피막을 단일층으로 근사한다.

```
Rs — [Cdl || Rct]
```

- **Rs**: 용액 저항 (이온 농도, 온도, 전극 기하구조에 의존)
- **Cdl**: 이중층 커패시턴스 (일반적으로 20~60 μF/cm²) [1]
- **Rct**: 전하이동 저항

> **[도메인 적용성 주의]** Cdl = 20~60 μF/cm²는 bare metal/electrolyte 계면에서의 값이다 [인접 도메인: 전기화학 일반]. 아노다이징 피막이 건전한 상태에서는 이중층 자체가 형성되지 않으므로 이 값은 Stage 3(피막 파괴 후 금속 노출)에서만 적용 가능하다.

#### (b) 2-시정수 모델 (Two Time Constant Model) — 아노다이징 피막 표준 모델

아노다이징 피막의 이중 구조를 반영하는 가장 널리 사용되는 모델이다 [3][4][5][6]:

```
Rs — [CPEp || Rp] — [CPEb || Rb]
```

여기서 Re(RpCp)(RbCb)는 약칭 표기이다.

| 회로 요소 | 물리적 의미 | 대응 주파수 영역 |
|-----------|------------|----------------|
| **Rs** | 전해질 저항 | 최고주파(>10⁵ Hz) |
| **Rp** | 다공성층 저항 (pore resistance) | 고~중주파 |
| **CPEp** | 다공성층 커패시턴스 | 고~중주파 |
| **Rb** | 배리어층 저항 (barrier layer resistance) | 저주파 |
| **CPEb** | 배리어층 커패시턴스 | 저주파 |

**주의**: 미밀봉(unsealed) 아노다이징 피막에서는 다공 내부에 전해질이 침투하여 다공성층의 저항이 매우 낮아지므로, 다공성층 시정수가 EIS 스펙트럼에서 관찰되지 않을 수 있다. 밀봉 시편은 두 개의 위상각 최대치(phase angle maxima)를 보이며 두 시정수가 분리된다 [4][6].

#### (c) CPE(Constant Phase Element)의 역할

실제 아노다이징 피막에서는 이상적 커패시터(C) 대신 CPE를 사용한다. 이는 피막의 비균질성 때문이다 [3][4].

```
Z_CPE = 1 / [Q(jω)^α]
```

- **Q**: CPE 계수 (pre-exponential factor)
- **α**: 지수 (0 ≤ α ≤ 1)
  - α = 1: 이상적 커패시터
  - α = 0.5: Warburg 임피던스 (확산)
  - α = 0: 순수 저항
  - **0.8 < α**: CPE를 커패시턴스 근사로 사용하기 위한 최소 요건 [4]
  - 아노다이징 피막에서는 다공 구조로 인해 통상 α = 0.8~0.95 범위에서 관찰된다.

> **[수치 투명성]** α > 0.8 기준은 CPE-to-capacitance 변환의 물리적 타당성에 대한 경험적 합의에서 비롯된다. 매우 거친 표면이나 비균질 합금(예: 2024-T3의 Cu 석출물 주변)에서는 α < 0.8이 관찰될 수 있으며, 이 경우 CPE를 단순 커패시턴스로 해석하면 오류가 발생한다.

#### (d) Warburg 요소

확산 과정이 속도 결정 단계일 때 나타나며, 나이퀴스트 플롯에서 45° 기울기의 직선으로 관찰된다 [1].

```
Z_W = σ·ω^(-1/2) · (1 - j)
```

아노다이징 피막에서 Warburg 요소는 주로:

- 밀봉 처리 후 다공 내부에서의 이온 확산
- 부식 진행 시 금속/용액 계면에서의 산소 확산
- 배리어층 결함을 통한 전해질 침투 과정

을 반영한다.

---

## 2. EIS 파라미터와 피막 품질의 상관관계

### 2.1 주파수 영역별 정보

| 주파수 영역 | 범위 (대략) | 반영하는 피막 특성 |
|------------|-----------|------------------|
| **고주파** (>10³ Hz) | kHz ~ MHz | 다공성층(porous layer)의 저항 및 커패시턴스 [4] |
| **중주파** (10⁰ ~ 10³ Hz) | 1 Hz ~ kHz | 다공성층과 배리어층의 전이 영역. 밀봉 품질 반영 |
| **저주파** (<10⁰ Hz) | mHz ~ 1 Hz | 배리어층(barrier layer)의 저항 및 커패시턴스. 피막의 궁극적 보호성을 결정하는 핵심 영역 [4] |

### 2.2 임피던스 크기(|Z|)와 피막 강건성

**|Z|₀.₁Hz (0.1 Hz에서의 임피던스 크기)**는 피막 보호성의 대표적 지표로 사용된다.

| |Z| @ 저주파 | 피막 상태 | 비고 |
|------------|----------|--------|
| > 10⁹ Ω·cm² | 매우 우수 | 초기 고품질 아노다이징+밀봉 피막. ISO 16773-2는 >10⁹ Ω·cm²를 고임피던스 코팅으로 정의 [7] |
| 10⁸ ~ 10⁹ Ω·cm² | 우수 | USBR 기준: 구조물 사양 후보로서 수년간 유지되어야 하는 최소 수준 [8] |
| 10⁶ ~ 10⁸ Ω·cm² | 보통 | 열화 징후 시작. 모니터링 강화 필요 |
| < 10⁶ Ω·cm² | 불량 | 피막 보호 기능 상실. 즉각 조치 필요 [8] |

> **[출처 평가]** 위 임피던스 등급 기준은 주로 유기 코팅(organic coating) 및 폴리머 도장 시스템에서 확립된 것이다 [인접 도메인: organic/polymeric coatings]. USBR 보고서 [8]와 ISO 16773 시리즈 [7]는 유기 코팅을 주 대상으로 한다. 아노다이징 피막은 무기 산화물이므로 열화 메커니즘(가수분해 vs 용해)이 다르며, 임계값을 직접 이식할 때 주의가 필요하다. 다만, Boisier 등 [9]이 아노다이징 Al 6061에 대해 EIS를 적용하여 유사한 임피던스 범위에서 보호 성능을 확인하였으므로, 정성적 등급 체계로서는 유효하다.

> **[반증 탐색]** Bongiorno 등(2024) [10]은 |Z|₀.₀₁Hz 임계값(예: 10⁶ Ω·cm² 미만 = 실패)이 가속 시험에서 실제 코팅 열화와 항상 상관하지 않을 수 있다고 보고하였다. 즉, 저주파 임피던스 하락이 없어도 국소 부식이 진행될 수 있으며, 반대로 임피던스가 낮아도 기재 부식이 미미한 경우가 있다. 이는 EIS가 면적 평균 응답이라는 본질적 한계에서 기인한다.

> **[수치 투명성]** |Z| > 10⁸ Ω·cm² 기준의 원전은 USBR Technical Memorandum 8540-2019-03 [8]이다. 이 기준은 강구조물의 유기 코팅에 대해 설정되었으며, 아노다이징 피막에 적용 시 "보수적(conservative)" 방향으로 작용할 가능성이 높다. 아노다이징 피막은 유기 코팅보다 본질적으로 화학적 안정성이 높으므로, 10⁷ Ω·cm² 수준에서도 충분한 보호성을 제공하는 경우가 있다.

> **[실행 연결]** 제조 현장에서는 다음과 같이 활용할 수 있다: (1) 출하 기준으로 |Z|₀.₁Hz > 10⁸ Ω·cm²를 설정하되, (2) 10⁷~10⁸ 범위의 제품은 "조건부 합격"으로 분류하여 추가 염수분무 시험 등으로 확인, (3) < 10⁶은 즉시 불합격. 단, 반도체 장비용 아노다이징처럼 극도로 높은 내식성이 요구되는 경우 Rpo > 5 × 10⁶ Ω·cm² 등 별도 기준을 적용해야 한다 [9].

### 2.3 위상각(Phase Angle)과 피막 강건성

- **-80° ~ -90° (넓은 주파수 범위)**: 우수한 절연 피막. 이상적 커패시터 거동에 가까움 [1].
- **10 Hz에서의 위상각**: 코팅 성능의 중요 지표. 위상각이 -40° ~ -20° 이하로 안정화되면, 전해질이 피막을 완전히 관통하여 피막 아래에서 전기화학 반응이 진행 중임을 의미한다 [11].
- **고주파 위상각 변화**: 피막의 초기 열화는 보드 플롯의 고주파 위상각에서 먼저 감지된다. 임피던스 크기 그래프에서는 거의 변화가 보이지 않을 때에도 위상각 변화로 감지 가능하다 [12].

> **[실행 연결]** 위상각은 |Z|보다 열화 초기 감지에 민감하므로, 모니터링 프로토콜에서 |Z|와 위상각을 병행 추적하는 것이 필수적이다. 특히 고주파(1~10 kHz) 위상각이 -80°에서 -60°로 이동하면, |Z| 변화가 눈에 띄기 전에 다공성층 열화를 조기 경고할 수 있다.

### 2.4 Pore Resistance(다공성층 저항, Rp)의 의미

- 다공 벽 및 다공 내 전해질의 저항을 반영한다.
- **높은 Rp**: 다공이 잘 밀봉되었거나 다공 구조가 치밀함을 의미.
- **Rp 감소**: 밀봉 품질 저하, 다공 확대, 또는 전해질 침투 증가를 나타낸다.
- 밀봉 품질 기준: Rpo > 2 × 10⁵ Ω·cm² = 일반 용도 적절, Rpo > 5 × 10⁶ Ω·cm² = 반도체 장비용 [9].
- 밀봉된 시편에서 specific admittance (As) = 10 μS/cm²는 적절한 열수 밀봉의 지표로 사용된다 [9].

> **[수치 투명성]** Rpo > 2 × 10⁵ Ω·cm² 기준은 Boisier 등 [9]의 Al 6061 연구에서 유래한다. 합금 종류(예: 2024-T3 vs 6061-T6), 아노다이징 전해질(황산 vs 혼합산 vs 옥살산), 밀봉 방법(열수 vs 냉간 vs 중온)에 따라 달성 가능한 Rpo 범위가 크게 다르므로, 단일 임계값을 모든 아노다이징 공정에 일괄 적용하는 것은 부적절하다.

### 2.5 Barrier Layer Resistance(배리어층 저항, Rb)의 의미

- 아노다이징 피막의 궁극적 부식 방어선이다.
- **높은 Rb**: 치밀하고 결함 없는 배리어층. 피막의 장기 내식성을 좌우하는 핵심 파라미터.
- 일반 아노다이징 피막: Rb ~ 1.48 MΩ (clear anodized), ~ 0.74 MΩ (black anodized) [3].
- 프리 아노다이징 + 분체 도장: 아노다이징층 ~ 2 kΩ, 분체 도장층 ~ 7.5 MΩ [3].
- **Rb의 급격한 감소**: 배리어층의 국소 파괴(pitting 개시)를 나타내며 즉각적인 주의가 필요하다.

> **[수치 투명성]** Franco(2012) [3]의 Rb 값(1.48 MΩ, 0.74 MΩ)은 면적 정규화 없이 보고된 것으로 보인다. 시편 면적이 다르면 직접 비교가 불가능하므로, 반드시 Ω·cm² 단위로 환산하여 비교해야 한다.

### 2.6 커패시턴스와 수분 흡수

피막 커패시턴스는 유전율에 비례한다 (C = ε₀εᵣA/d) [1].

- 건조 산화알루미늄: εᵣ ≈ 8~10
- 수분 침투 시: εᵣ 증가 (물의 εᵣ ≈ 80)
- **Brasher-Kingsbury 식**으로 수분 흡수율(φ) 산출 가능:

```
φ = log(Ct/C₀) / log(εwater)
```

여기서 Ct는 시간 t에서의 커패시턴스, C₀는 초기 커패시턴스이다.

유기 코팅에서 피막의 수분 포화는 약 2.5~3%에서 발생하며, 커패시턴스와 수분 흡수율이 약 4시간(15,000초) 후 포화 안정기에 도달한다 [12].

> **[도메인 적용성 주의]** Brasher-Kingsbury 식은 유기 코팅(εᵣ = 2~7)에 대해 개발/검증되었다 [인접 도메인: organic coatings]. 아노다이징 피막(εᵣ ≈ 8~10)은 유기 코팅보다 유전율이 높고, 다공 구조의 수분 흡수 메커니즘(모세관 응축)이 다르므로, 동일 식을 그대로 적용하면 수분 흡수율을 과소 추정할 수 있다. 아노다이징 피막 전용 수분 흡수 모델에 대한 연구는 아직 제한적이다.

---

## 3. EIS로 피막 열화/박리를 감지하는 방법

### 3.1 열화 3단계 모델

아노다이징/코팅 피막의 열화는 EIS로 관찰 가능한 3단계를 거친다 [12][13]:

#### Stage 1: 초기 상태 (Intact Coating)

- **EIS 특징**: 단일 시정수, 매우 높은 |Z| (>10⁸ Ω·cm²)
- **나이퀴스트**: 매우 큰 반원 (또는 반원의 일부만 관찰 — 측정 주파수 범위 내에서 완결되지 않을 수 있다)
- **보드**: 넓은 주파수 범위에서 기울기 -1, 위상각 -80°~-90°
- **등가회로**: Rs + (CPEc || Rc) — 피막이 단순 커패시터로 거동
- **물리적 의미**: 수분과 부식성 이온이 피막을 투과하지 못하는 상태 [13]

#### Stage 2: 전해질 침투 (Porous Degradation)

- **EIS 특징**: 2-시정수 출현, 고주파 위상각 변화 시작
- **나이퀴스트**: 두 번째 반원이 나타나기 시작
- **보드**: 고주파 영역에서 위상각 감소, |Z| 감소 시작
- **등가회로**: Rs + (CPEp || Rp) + (CPEb || Rb) — 외층 다공화와 내층 보존
- **물리적 의미**: 전해질이 다공을 통해 침투하면서 다공성층의 저항이 감소하고, 커패시턴스가 증가한다. 이 단계에서는 임피던스 크기 변화보다 **위상각 변화가 먼저 감지**된다 [12].

> **[실행 연결]** Stage 2는 "조치 가능한 창(actionable window)"이다. 이 단계에서 (1) 재밀봉(re-sealing) 처리를 하거나 (2) 보호 코팅을 추가 도포하면 Stage 3 진입을 방지할 수 있다. 모니터링 프로토콜에서 Stage 2 진입을 감지하는 트리거로 "고주파(1 kHz) 위상각이 초기 대비 15° 이상 감소"를 사용할 수 있다.

#### Stage 3: 피막 파괴 (Corrosion Initiation)

- **EIS 특징**: 3-시정수, 저주파 임피던스 급락
- **나이퀴스트**: 반원 직경 현저히 감소, 저주파에서 Warburg 직선 출현 가능
- **보드**: 전체 주파수에서 |Z| 감소, 위상각 -40°~-20° 이하로 안정화 [11]
- **등가회로**: Rs + (CPEp || Rp) + (CPEb || Rb) + (CPEdl || Rct) — 금속/전해질 계면의 부식 반응 포함
- **물리적 의미**: 전해질이 배리어층까지 도달하여 금속 기재와 직접 접촉. 전하이동 저항(Rct)과 이중층 커패시턴스(Cdl)가 새로운 시정수로 나타난다.

### 3.2 NaCl 침지 환경에서의 스펙트럼 변화 패턴

**3.5 wt% NaCl 용액 침지 시 전형적 변화:**

| 침지 기간 | |Z|₀.₁Hz 변화 | 위상각 변화 | 해석 |
|----------|-------------|------------|---------|
| 초기 (0~24h) | >10⁹ Ω·cm² 유지 | -85°~-90° | 피막 건전 |
| 중기 (수일~수주) | 10⁸ → 10⁷ Ω·cm² | 고주파 위상각 감소 시작 | 수분 침투, 다공층 열화 |
| 후기 (수주~수개월) | <10⁶ Ω·cm² | 전체적 위상각 감소 | 배리어층 파괴, 부식 진행 |

잘 아노다이징+밀봉된 시편(혼합산 공정 + 열수 밀봉)의 경우, 3.5 wt% NaCl에서 **365일 침지 후에도** specific admittance와 breakpoint frequency가 일정하게 유지되어, 임피던스 특성에 거의 변화가 없었다는 보고가 있다 [9].

### 3.3 Breakpoint Frequency 방법

**Breakpoint frequency (fb)**는 위상각이 -45°가 되는 주파수로 정의되며, 코팅 열화의 단일 지표로 활용된다 [12].

```
fb = 1 / (2π·Rc·Cc)
```

- **fb 증가**: 코팅 저항(Rc) 감소 또는 커패시턴스(Cc) 증가 → 열화 진행
- fb로부터 **Coating Damage Function(DF)**과 **Coating Delamination Index(CDI)**를 산출하여 정량적 열화 평가가 가능하다.

### 3.4 열화 감지를 위한 핵심 모니터링 파라미터 요약

| 파라미터 | 건전한 피막 | 열화 징후 | 심각한 열화 |
|---------|-----------|----------|-----------|
| \|Z\|₀.₁Hz | >10⁸ Ω·cm² | 10⁶~10⁸ Ω·cm² | <10⁶ Ω·cm² |
| 위상각 (mid-freq) | -80°~-90° | -60°~-80° | <-40° |
| Rb (배리어층 저항) | >10⁶ Ω·cm² | 감소 추세 | 급락 |
| Rp (다공성층 저항) | 높음 (>10⁵ Ω·cm²) | 점진적 감소 | 매우 낮음 |
| 커패시턴스 | 초기값 유지 | 점진적 증가 | 급격한 증가 |
| Breakpoint freq. | 매우 낮음 (<0.1 Hz) | 증가 추세 | 높음 (>100 Hz) |
| 시정수 수 | 1~2개 | 2개 | 2~3개 |

---

## 4. EIS의 한계점

### 4.1 등가회로 피팅의 비유일성 (Non-Uniqueness)

EIS의 가장 근본적인 한계이다.

**핵심 문제:**

- 동일한 임피던스 스펙트럼에 대해 **수학적으로 동일한 결과**를 산출하는 서로 다른 회로 토폴로지가 존재한다 [1][14].
- 회로 요소를 추가하면 피팅 품질은 항상 개선되지만, 추가된 요소가 물리적 의미를 갖는다는 보장은 없다.
- 따라서 좋은 피팅 결과가 정확한 물리적 모델을 보장하지 않는다 [14].
- 특히 2개 이상의 시정수가 겹칠 때 모호성이 커진다 — 유사한 시정수를 가진 프로세스들은 주파수 도메인에서 중첩되어 분리가 어렵다 [14].

**실무적 대응:**

- 등가회로의 각 요소가 과학적 논리에 기반하여 개별 물리 과정에 대응되어야 한다 [1].
- **Kramers-Kronig(K-K) 분석**으로 데이터의 선형성, 인과성, 안정성을 사전 검증해야 한다. K-K 관계를 위반하는 데이터는 피팅 이전에 기각해야 한다 [1].
- 여러 등가회로가 동일한 피팅 품질을 보이면, **최소 요소 수 원칙(principle of parsimony)**을 적용한다 — 물리적으로 정당화되는 가장 단순한 모델을 선택한다.

> **[반증 탐색]** "EIS 등가회로의 비유일성은 EIS를 정량 도구로 사용하는 것을 무효화하는가?" — 이에 대한 반증: Orazem & Tribollet의 교과서적 관점에서, 등가회로는 "현상학적 모델"이므로 물리적 모델과 병행해야 하지만, 동일 시편의 시간 추이(time evolution)를 추적할 때는 회로 구조를 고정하고 파라미터 변화만 관찰하므로 비유일성 문제가 크게 완화된다. 즉, 절대값보다 **변화율(trend)**을 추적하는 접근이 비유일성 한계를 실무적으로 회피한다.

### 4.2 해석의 주관성

- 연구자에 따라 동일 스펙트럼에 대해 다른 등가회로를 선택할 수 있다 [14].
- 초기값(initial guess) 설정에 따라 비선형 최소자승(NLLS) 알고리즘이 다른 극솟값에 수렴할 수 있다 [1].
- "the interpretation of EIS can be non-trivial and time-consuming, which limits its application, especially for routine analysis" [15]

> **[실행 연결]** 해석 주관성을 줄이기 위한 실무 권장사항: (1) 동일 라인 제품에 대해 **표준 등가회로를 사전 확정**하고 변경 시 기술적 근거를 문서화, (2) NLLS 피팅 시 **2개 이상의 초기값 세트**로 수렴 결과를 비교, (3) AutoEIS 등 자동화 도구로 주관적 판단 최소화 (Section 5 참조).

### 4.3 재현성 및 측정 조건 의존성

**정상 상태(steady state) 요구:**

- EIS 측정 중 시스템이 정상 상태를 유지해야 하나, 실제로는 달성이 어렵다 [1].
- 측정 중 발생하는 변화: 용액 불순물의 흡착, 산화막 성장, 반응 생성물 축적, 코팅 열화 자체.

**측정 조건 영향:**

- 전해질 농도, 온도, pH
- 기준전극 위치 및 전극 배치
- 인가 전위 (OCP vs 특정 전위)
- 주파수 범위 및 스캔 속도
- 교란 전압 크기 (선형 응답 범위 이탈 위험)

이러한 요인들이 피막의 본질적 특성과 무관하게 측정값에 영향을 미칠 수 있어, **실험 간 비교 시 조건 통일이 필수적**이다.

### 4.4 국소 결함 감지의 어려움

**EIS의 근본적 한계:**

- EIS는 전극 면적 전체에 대한 **평균 응답(global surface-averaged response)**을 제공한다 [16].
- 따라서 피막의 국소적 결함(pinhole, 미세 크랙, pitting 핵생성)을 초기에 감지하기 어렵다.
- 결함 면적이 전체 면적 대비 충분히 클 때에만 EIS 스펙트럼에 반영된다.
- Gamry의 코팅 평가 예시에서, 금속 1% 노출(delamination)은 10³~10⁶ Ω 범위의 임피던스를 보이지만, 99% 건전 영역이 이를 마스킹할 수 있다 [1].

**보완 기법:**

| 기법 | 원리 | 공간 해상도 | 장점 |
|------|------|-----------|------|
| **LEIS** (Localized EIS) | AC 전위 구배를 국소 측정 | 프로브 크기 의존 (수십~수백 μm) | 결함 위치 특정, 서브서피스 결함 조기 감지 [16][17] |
| **SECM** (Scanning Electrochemical Microscopy) | 미세 전극 표면 스캐닝 | μm 수준 | 국소 전기화학 활성 매핑 |
| **SKP** (Scanning Kelvin Probe) | 전위 분포 매핑 | 수십 μm | 박리 영역 비접촉 검출 |
| **SVET** (Scanning Vibrating Electrode Technique) | 국소 전류 밀도 측정 | 수십 μm | 양극/음극 영역 분리 |

> **[실행 연결]** 제조 현장에서의 실용적 접근: (1) 먼저 기존 EIS로 배치(batch) 수준의 품질을 스크리닝하고, (2) |Z|가 기준 미달인 시편에 대해서만 LEIS나 SECM으로 결함 위치를 특정하는 2단계 검사 프로토콜을 구성. 이는 비용 대비 검출력을 최적화한다. 단, LEIS 장비는 아직 범용화되지 않아 연구소 수준에서 주로 활용되며, 양산 라인 적용에는 스캐닝 속도 한계가 있다.

### 4.5 시간 및 비용

- 저주파(mHz) 영역 측정에 상당한 시간이 소요된다 (10 mHz까지 스캔 시 수십 분 이상).
- 고임피던스 코팅(>10⁹ Ω)의 경우, 매우 작은 전류(수 pA)를 정확히 측정해야 하므로 고사양 포텐시오스탯이 필요하다 [1].
- 장기 모니터링 시 반복 측정의 누적 시간이 크다.

### 4.6 요약: 장점과 한계의 균형

| 장점 | 한계 |
|------|------|
| 비파괴 검사 | 등가회로 비유일성 |
| 정량적 파라미터 추출 | 해석 주관성 |
| 열화 진행 모니터링 가능 | 국소 결함 감지 곤란 |
| 다층 구조 개별 특성 파악 | 정상 상태 요구 |
| 높은 감도 (특히 위상각) | 측정 조건 의존성 |
| 산업 현장 적용 가능 | 저주파 측정 시간 |
| 표준화된 방법론 (ISO 16773) | 고임피던스 측정의 장비 한계 |

---

## 5. 최신 AutoEIS/ML 기반 해석 자동화 동향

### 5.1 등가회로 자동 식별의 필요성

EIS 분석의 최대 병목은 등가회로 모델 선택의 주관성과 비유일성이다 (Section 4.1, 4.2). 이를 자동화하려는 시도가 최근 활발하다.

### 5.2 AutoEIS

**개요**: AutoEIS는 EIS 데이터에서 통계적으로 타당한 등가회로 모델(ECM)을 자동으로 제안하는 오픈소스 Python 패키지이다 [18][19].

**핵심 워크플로우** (5단계):

1. **데이터 전처리**: 원시 EIS 데이터 정제, Kramers-Kronig 유효성 검증
2. **ECM 생성**: 진화 알고리즘(evolutionary search)을 이용한 후보 회로 자동 생성
3. **회로 후필터링**: 전기화학적으로 비물리적인 회로 제거
4. **Bayesian 추론**: 각 후보 회로에 대해 Bayesian inference로 파라미터 및 불확실성 추정
5. **모델 평가**: 통계적 모델 비교(Bayesian model selection)를 통해 최적 ECM 순위화

**핵심 기여**:

- **비유일성 문제 완화**: 단일 "최적" 모델만 제시하지 않고, 통계적으로 타당한 여러 모델을 순위와 함께 제공하여 전문가가 물리적 타당성을 판단할 수 있게 한다.
- **재현성 향상**: 분석자 간 주관성을 제거하여 동일 데이터에 대해 동일 결과를 보장.
- **불확실성 정량화**: Bayesian 접근으로 각 파라미터의 신뢰 구간을 제공.

**발표**: Journal of The Electrochemical Society (2023), Journal of Open Source Software (2025) [18][19].

**설치**: `pip install -U autoeis` (Julia 의존성 자동 설치)

### 5.3 머신러닝 기반 등가회로 분류

**Random Forest 기반 접근** [20]: 임피던스 스펙트럼의 특징(feature)을 추출하여 Random Forest 분류기로 등가회로 모델을 예측. 전역 최적화 알고리즘(Differential Evolution)으로 파라미터 식별.

**CNN(Convolutional Neural Network) 기반 접근** [21]: 1D-CNN이 EIS 스펙트럼을 입력으로 받아 등가회로 유형을 분류. 나이퀴스트 플롯을 이미지로 변환하여 2D-CNN에 입력하는 접근도 연구 중.

**벤치마크 연구** [21]: CNN, Random Forest, XGBoost, SVM 등을 비교한 결과, CNN 기반 모델이 노이즈가 있는 실험 데이터에서 가장 강건한 분류 성능을 보였다.

### 5.4 비지도 학습 기반 열화 상태 클러스터링

Unsupervised clustering(비지도 학습)을 이용하여 EIS 스펙트럼을 자동으로 열화 상태별로 분류하는 접근이 최근 보고되었다 [22]:

- 38개 산업용 코팅 시스템의 가속 시험 EIS 데이터를 비지도 ML 파이프라인으로 분석
- 배리어 무결성(barrier integrity), 수분 흡수 민감도에 따른 자동 클러스터링
- 등가회로 피팅 없이 스펙트럼 형상만으로 열화 단계를 분류

> **[실행 연결]** 제조 현장 적용 시나리오: (1) AutoEIS를 품질관리 루틴에 통합하여 EIS 측정 → 자동 ECM 피팅 → 파라미터 추출 → 합격/불합격 판정을 자동화. (2) 비지도 학습 기반 클러스터링은 과거 EIS 데이터베이스가 축적된 환경에서 "이상 스펙트럼" 자동 탐지에 활용 가능. (3) 현재 이 도구들은 연구 단계이며, 양산 라인에서의 신뢰성 검증(validation)이 향후 과제이다.

### 5.5 금속 패시비티 분류에 ML 적용

Classifying Metal Passivity from EIS Using Interpretable ML (2025) [23]: 최소한의 데이터로 금속 표면의 패시비티(부동태) 상태를 EIS에서 분류하는 해석 가능한(interpretable) ML 프레임워크. 데이터 효율성이 높아 소규모 실험 데이터셋에도 적용 가능.

> **[도메인 적용성 주의]** 위 연구는 bare metal의 패시비티 분류에 초점을 맞추고 있다 [인접 도메인: metal passivation]. 아노다이징 피막은 인위적으로 생성된 두꺼운 산화층이므로, 패시비티 분류 모델을 직접 이식하기보다 아노다이징 피막 전용 학습 데이터로 재훈련이 필요하다.

### 5.6 현재 한계와 전망

| 항목 | 현재 상태 | 전망 |
|------|----------|------|
| AutoEIS | 연구용 도구로 성숙. JOSS 출판 | 산업 QC 통합 가능성 |
| CNN 기반 ECM 분류 | 벤치마크 수준. 노이즈 강건성 검증 중 | 실시간 인라인 분석 가능성 |
| 비지도 클러스터링 | 소규모 데이터셋 검증 | 대규모 산업 데이터에 확장 필요 |
| Transformer 기반 접근 | 초기 연구 단계 | EIS 시계열 특성과의 적합성 탐색 중 |

> **[반증 탐색]** "ML/AI가 EIS 해석의 전문가 판단을 대체할 수 있는가?" — 현재 ML 모델은 학습 데이터 분포 내에서는 강력하지만, 분포 밖(out-of-distribution) 스펙트럼(예: 새로운 합금, 새로운 아노다이징 조건)에 대한 일반화 능력은 검증되지 않았다. 따라서 ML은 전문가를 "대체"하기보다 "보조"하는 도구로 위치시키는 것이 현재로서는 적절하다. 반증 미발견: ML이 전문가보다 체계적으로 열등하다는 직접적 증거는 발견되지 않았으나, 산업 현장 검증 사례가 아직 부족하다.

---

## 6. 참고문헌

[1] Gamry Instruments, "Basics of Electrochemical Impedance Spectroscopy" — https://www.gamry.com/application-notes/EIS/basics-of-electrochemical-impedance-spectroscopy/

[2] ACS Measurement Science Au, "Electrochemical Impedance Spectroscopy — A Tutorial" — https://pubs.acs.org/doi/10.1021/acsmeasuresciau.2c00070

[3] Franco (2012), "Porous Layer Characterization of Anodized and Black-Anodized Aluminium by Electrochemical Studies," International Scholarly Research Notices — https://onlinelibrary.wiley.com/doi/10.5402/2012/323676

[4] Characterization of porous aluminium oxide films from a.c. impedance measurements, Journal of Applied Electrochemistry — https://link.springer.com/article/10.1023/A:1003481418291

[5] Characterisation of porous and barrier layers of anodic oxides on different aluminium alloys, Journal of Applied Electrochemistry — https://link.springer.com/article/10.1007/s10800-007-9344-y

[6] Characterization of anodized and sealed aluminium by EIS, Corrosion Science — https://www.sciencedirect.com/science/article/abs/pii/S0010938X02001373

[7] ISO 16773-2:2016, "Electrochemical impedance spectroscopy (EIS) on coated and uncoated metallic specimens — Part 2: Collection of data" — https://www.iso.org/standard/64795.html

[8] U.S. Bureau of Reclamation, "Electrochemical Impedance Methods to Assess Coatings," Technical Memorandum 8540-2019-03 — https://www.usbr.gov/tsc/techreferences/mands/mands-pdfs/ElectrochemicalImpedanceMethods_8540-2019-03_508.pdf

[9] Boisier et al. (2008), "Evaluation of the corrosion resistance of anodized aluminum 6061 using EIS," Corrosion Science — https://www.sciencedirect.com/science/article/abs/pii/S0010938X08003806

[10] Bongiorno et al. (2024), "Evaluating organic coating performance by EIS: Correlation between long-term EIS measurements and corrosion of the metal substrate," Materials and Corrosion — https://onlinelibrary.wiley.com/doi/full/10.1002/maco.202313863

[11] The evaluation of coating performance by the variations of phase angles in middle and high frequency domains of EIS, Corrosion Science — https://www.sciencedirect.com/science/article/abs/pii/S0010938X08003697

[12] PMC, "Electrochemical Characterization of Polymeric Coatings for Corrosion Protection: A Review of Advances and Perspectives" — https://pmc.ncbi.nlm.nih.gov/articles/PMC9228341/

[13] PHM Society, "Electrochemical Impedance Spectroscopy for Coating Evaluation" — https://papers.phmsociety.org/index.php/phmconf/article/download/2340/1317

[14] Kim et al. (2025), "Application of Electrochemical Impedance Spectroscopy for Diagnostics in Fuel Cells, Electrolyzers, and Batteries," ChemElectroChem — https://chemistry-europe.onlinelibrary.wiley.com/doi/full/10.1002/celc.202500005

[15] EIS equivalent circuit model prediction using interpretable machine learning and parameter identification using global optimization algorithms, Electrochimica Acta — https://www.sciencedirect.com/science/article/abs/pii/S0013468622005126

[16] BioLogic, "LEIS101: An Introduction to Local Electrochemical Impedance Spectroscopy" — https://www.biologic.net/topics/leis101-an-introduction-to-local-electrochemical-impedance-spectroscopy/

[17] AMETEK, "LEIS Localized Electrochemical Impedance Spectroscopy" — https://www.ameteksi.com/products/scanningelectrochemicalsystems/leis-localized-electrochemical-impedance-spectroscopy

[18] Sadeghi et al. (2023), "AutoEIS: Automated Bayesian Model Selection and Analysis for Electrochemical Impedance Spectroscopy," Journal of The Electrochemical Society — https://ouci.dntb.gov.ua/en/works/7Ab0rKP4/

[19] Sadeghi et al. (2025), "AutoEIS: Automated equivalent circuit modeling from electrochemical impedance spectroscopy data using statistical machine learning," Journal of Open Source Software, 10(109), 6256 — https://joss.theoj.org/papers/10.21105/joss.06256

[20] Equivalent Electrical Circuit recommendation for EIS: A benchmark of different Machine Learning algorithms, Journal of Electroanalytical Chemistry — https://www.sciencedirect.com/science/article/pii/S1572665724007902

[21] Machine Learning Benchmarks for the Classification of Equivalent Circuit Models from Electrochemical Impedance Spectra — https://arxiv.org/abs/2302.03362

[22] Unsupervised clustering of EIS spectra for distinguishing degradation states of polymer coatings, Progress in Organic Coatings — https://www.sciencedirect.com/science/article/abs/pii/S0300944026001384

[23] Classifying metal passivity from EIS using interpretable machine learning with minimal data, Scientific Reports — https://www.nature.com/articles/s41598-025-18575-w

[24] Optimizing unsupervised clustering of electrochemical impedance spectra via normalization and dimensionality reduction, Scientific Reports — https://www.nature.com/articles/s41598-026-35621-3

[25] ISO 16773-4:2017, "Electrochemical impedance spectroscopy (EIS) on coated and uncoated metallic specimens — Part 4: Examples of spectra" — https://www.iso.org/standard/62343.html

[26] ASTM D8370, "Standard Test Method for Field Measurement of Electrochemical Impedance on Coatings and Linings" — https://store.astm.org/d8370-22.html

[27] Effect of Sealing on the Morphology of Anodized Aluminum Oxide, OSTI — https://www.osti.gov/servlets/purl/1836473

[28] On the Limits of the EIS Low-Frequency Impedance Modulus as a Tool to Describe the Protection Properties of Organic Coatings, Coatings — https://www.mdpi.com/2079-6412/13/3/598
