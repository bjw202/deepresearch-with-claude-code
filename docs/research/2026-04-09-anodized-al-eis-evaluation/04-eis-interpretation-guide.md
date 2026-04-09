# EIS 결과 해석 가이드 — 양극산화 알루미늄 피막

**Researcher 산출물** | 2026-04-09  
**검색 전략 모드**: academic  
**관점**: EIS 측정 결과를 어떻게 해석하는가 — 실무 가이드 + 쉬운 메타포

---

## 개요

EIS(전기화학 임피던스 분광법)는 넓은 주파수 범위에서 소진폭 AC 신호를 인가하여 전기화학 시스템의 저항성·용량성 특성을 분리 측정하는 기법이다. 양극산화 알루미늄 피막에 적용하면 다공층(porous layer)과 장벽층(barrier layer)의 임피던스를 독립적으로 정량화할 수 있다. 이 가이드는 측정 직후 실무자가 확인해야 할 사항부터 등가회로 피팅 파라미터 해석까지를 단계적으로 정리한다.

**핵심 요약**: 좋은 양극산화 피막은 (1) Nyquist에서 큰 이중 반원, (2) Bode에서 저주파 |Z| > 10⁴ Ω·cm², phase angle ≈ −80° 이상, (3) R_pore + R_barrier 합계 수백 kΩ·cm² 수준을 보인다. ★★☆

---

## 핵심 발견

### 1. Nyquist plot 해석 — 측정 직후 가장 먼저 보는 것

#### 1-1. 기본 구조: 반원 = 시정수 ★★★

Nyquist plot은 실수 임피던스 Z'(X축)와 음의 허수 임피던스 −Z''(Y축)를 주파수별로 표시한 그래프다. 이상적인 RC 병렬 회로는 완전한 반원을 그리며, 반원 하나 = 시정수(τ = RC) 하나를 의미한다.

**쉬운 메타포**: "Nyquist 반원은 산이다. 산이 클수록 전류가 넘어가기(등반하기) 어렵다." 반원의 지름이 곧 그 층의 저항값이다.

| 위치 | 읽는 값 |
|------|---------|
| 고주파수 측 Z' 절편 (왼쪽 끝) | R_s (용액 저항) |
| 저주파수 측 Z' 절편 (오른쪽 끝) | R_s + R_pore + R_barrier (총 저항) |
| 반원 지름 | 해당 층의 저항 R |
| 반원 꼭대기 주파수 | f_max = 1/(2πRC), 시정수 결정 |

#### 1-2. 두 개의 반원 = 양극산화 피막의 전형적 신호 ★★★

완전히 산화된 양극산화 알루미늄은 Nyquist에서 **두 반원**이 나타난다. ★★★

```
[고주파수 반원]          [저주파수 반원]
   다공층(porous)  →  장벽층(barrier)
   빠른 과정        →  느린 과정
```

- **고주파수(HF) 반원**: 다공층의 전해질 충전 과정. 지름 ≈ R_pore
- **저주파수(LF) 반원**: 장벽층의 전하 전달 저항. 지름 ≈ R_barrier (더 크고 중요)

두 반원이 명확히 분리되려면 두 시정수의 비가 τ₁/τ₂ ≥ 100 이어야 한다 (ACS tutorial, 2023). 두 시정수가 가까우면 겹쳐 보여 왜곡된 단일 반원처럼 관측된다.

**"두 개의 반원 = 두 층 분리됨"의 의미**: 다공층과 장벽층이 각각 독립적인 전기화학 응답을 갖는다. 이것은 피막이 이중 구조로 잘 형성되었음을 뜻한다. 반면 단일 반원만 보이면 두 층의 특성이 구분되지 않을 만큼 피막이 불균질하거나, 장벽층이 극도로 얇아 다공층만 지배적임을 시사한다.

**쉬운 메타포**: "피막은 다층 우산이다. 바깥 층(porous)은 큰 빗방울을 막고, 안쪽 층(barrier)은 스며든 물이 새지 않게 한다."

#### 1-3. 기울어진 직선(45°) = Warburg 임피던스 ★★★

반원 이후 저주파수 영역에서 45° 기울기의 직선이 나타나면 **Warburg 임피던스**: 반무한 확산 지배(semi-infinite diffusion)를 의미한다.

```
|
-Z''  |      /
      |    /   ← 45° 직선 = Warburg
      |  /
      |/_________________________ Z'
```

- **Bode에서 대응**: phase angle ≈ −45°, |Z| ∝ ω^(-1/2)
- **실무적 의미**: 부식이 진행 중이거나, 부식 생성물이 쌓여 이온 확산을 제한함. 양극산화 피막이 열화되면서 금속/전해질 계면에 확산 지배 과정이 생긴다
- **반증 탐색**: Warburg가 항상 부식 진행을 의미하지는 않는다. 다공성 피막에서 기공 내부 확산(pore diffusion)도 Warburg를 만들 수 있다 [인접 도메인: 리튬이온 배터리 EIS 해석]. 하지만 양극산화 피막 맥락에서 Warburg는 열화 신호로 간주하는 것이 표준 해석이다.

---

### 2. Bode plot에서 보는 것

#### 2-1. |Z| vs log(f): 저주파수 임피던스 = 피막 총 저항 ★★★

```
|Z|
(log)  ──────────────────────────────
        ↑                           |
   고주파수:                          |
   R_s만 반영          저주파수:      |
   (작은 값)          R_total 반영  ↓
                    (클수록 좋은 피막)
        ──────────────────────────── f (log)
        고                          저
```

**핵심 기준 (at 0.01 Hz)**:
- 일반 코팅 우수: |Z|₀.₀₁ ₕ₂ > 10⁶ Ω·cm²
- 양극산화 피막 (sealing 완료): |Z|₀.₀₁ ₕ₂ ≈ 10⁴~10⁶ Ω·cm² ★★☆
- 불량 피막 또는 미실링: |Z|₀.₀₁ ₕ₂ < 10³~10⁴ Ω·cm²
- 나금속(bare metal): |Z| ≈ 10~20 kΩ·cm² (10⁴ Ω·cm² 수준)

[출처: IOP J. Electrochem. Soc., 2020; Armatec EIS Research PDF]  
**이 수치가 틀릴 수 있는 조건**: 측정 전해질(3.5% NaCl vs 5% NaCl), 피막 두께(5 µm vs 20 µm), 합금 종류(6061 vs 2024)에 따라 절대값은 크게 달라진다. 비교는 동일 조건 내에서만 유효하다.

#### 2-2. Phase angle vs log(f): −90°에 가까울수록 좋은 절연체 ★★★

```
Phase
angle  0°   ──────────────────────────────
             R_s 지배 (저항성)
      -45°                  Warburg (확산 지배)
      -80°      ~~~~~~~~~~~~~~~~~
      -90°  ─────────────────────────────
             이상적 커패시터 (절연성 최대)
```

| Phase angle | 의미 |
|-------------|------|
| ≈ 0° (at low f) | 저항 지배 — 이온 통로 존재, 피막 열화 |
| ≈ −45° | Warburg — 확산 제한 과정 |
| −60° ~ −80° | 비이상적 커패시터(CPE) — 일반적 양극산화 피막 |
| ≈ −90° | 이상적 커패시터 — 완벽한 절연 피막 (드문 경우) |

**쉬운 메타포**: "−90°는 전하가 쌓이기만 하고 흐르지 않는다는 뜻이다. 전류 차단막이 완벽한 것." phase angle이 −80° 이상 넓은 주파수 구간에 걸쳐 유지된다면 피막이 훌륭한 절연체다.

---

### 3. 등가회로 파라미터 해석

#### 3-1. 표준 양극산화 등가회로 (Duplex 모델) ★★★

```
Rs ─── [Rpore ║ CPEpore] ─── [Rbarrier ║ CPEbarrier]
```

이 회로는 용액 저항(Rs) + 다공층 RC쌍 + 장벽층 RC쌍으로 구성된다. 소프트웨어(ZView, NOVA, Equivcrt 등)로 측정 데이터에 비선형 최소자승 피팅하여 각 파라미터를 추출한다.

#### 3-2. 각 파라미터의 의미와 수치 기준

**R_s (용액 저항)**
- 전해질 고유 저항 + 셀 기하학(전극 간격)에 의존
- 피막 품질과 무관 → 측정 조건 보정/확인용으로만 사용
- 일반적 범위: 수 Ω~수십 Ω (3.5% NaCl 기준 ≈ 3~20 Ω·cm²)
- ★★☆

**R_pore (기공 저항)** ★★☆
- 다공층 기공 내부에 침투한 전해질 기둥의 이동 저항
- sealing이 잘 될수록 기공이 막혀 R_pore 증가
- sealing 품질의 직접 지표

| 상태 | R_pore 범위 |
|------|------------|
| 미실링(unsealed) | 수백 Ω·cm² ~ 수 kΩ·cm² |
| 열수 실링 완료 | > 10 kΩ·cm² (일반적으로 수십~수백 kΩ·cm²) |
| 우수한 sealing (boiling water) | > 200 kΩ·cm² [Academy.edu 인용] |

[출처: Evaluation of anodized Al 6061, Academia.edu; OSTI Sealing morphology PDF, 2021]  
**이 수치가 틀릴 수 있는 조건**: 측정 온도, 침지 시간, 합금 내 Cu/Si 함량에 따라 크게 달라진다.

**R_barrier (장벽층 저항)** ★★★
- 장벽층(두께 10~100 nm, 금속/산화막 계면)의 이온 전도 저항
- 부식 보호 능력과 가장 직결된 파라미터
- 장벽층이 두꺼울수록, 결함이 적을수록 R_barrier 증가

| 상태 | R_barrier 범위 |
|------|---------------|
| 일반 양극산화 + 실링 | 10 ~ 200 kΩ·cm² |
| 하드 코팅 (hard coat) | ~ 수백 kΩ·cm² |
| 참고: 유기 코팅 (에폭시 등) | 10⁶ ~ 10⁹ Ω·cm² |

[인접 도메인: 유기 코팅 EIS] 유기 코팅의 R_pore는 10⁶~10⁹ Ω·cm² 수준으로 양극산화 피막보다 2~3 오더 크다. 양극산화 피막을 유기 코팅 기준으로 판단하면 오해가 생긴다.  
[출처: Walsh Medical Media PDF, Al-Mg EIS study; finishingandcoating.com EIS study]  
**이 수치가 틀릴 수 있는 조건**: 황산 농도, 양극산화 전류밀도, 합금 조성이 다르면 장벽층 두께가 달라져 R_barrier가 수 배 이상 차이난다.

**CPE_pore, CPE_barrier (상수 위상 요소)**

실제 알루미늄 산화막은 이상적인 커패시터가 아니라 CPE(Constant Phase Element)로 표현해야 한다:

```
Z_CPE = 1 / [Q(jω)^n]
```

- **Q**: 유효 커패시턴스 계수 (단위: F·cm⁻²·s^(n-1))
- **n**: CPE 지수 (0 < n ≤ 1)
  - n = 1: 이상적 커패시터
  - n = 0: 이상적 저항
  - n = 0.7~0.9: 양극산화 피막의 전형적 범위 ★★★
- 유효 커패시턴스: C_eff = Q × R^((1-n)/n)

CPE가 필요한 이유: 피막 두께 불균질, 기공 크기 분포, 표면 거칠기. CPE로 표현하지 않으면 피팅이 수렴하지 않거나 물리적으로 의미 없는 값이 나온다.

**쉬운 메타포**: "n = 1은 완벽한 스프링(커패시터), n = 0은 순수 마찰(저항). n = 0.8은 그 사이 어딘가 — 스프링에 약간의 마찰이 있는 상태."

**n값과 피막 품질** ★★☆:
- n_barrier 가 sealing 후 1에 가까워지면 → 기공이 채워지며 균질해진 것
- n이 sealing 후에도 0.7 이하 → 불균질, 결함 많음

---

### 4. 시간 의존성 — 침지 시간에 따른 임피던스 변화 ★★★

침지 실험(NaCl 용액 등)에서 EIS를 반복 측정하면 피막 열화를 추적할 수 있다.

**정상적인 진화 패턴** (좋은 피막):
```
초기 침지 (0~48h): R_pore가 약간 증가하는 경우 있음
  → 자연 sealing(autosealing): 수화물이 기공 입구를 막음
중기 (수일~수주): R_barrier 서서히 감소
  → 전해질이 장벽층에 침투하기 시작
장기 (수개월~): 전반적 임피던스 감소
  → 피막 보호 기능 저하
```

[출처: IOP J. Electrochem. Soc. 2020, 14 V 양극산화 시편 192h 추적 연구]

**열화 신호** (경보 기준):
- |Z|₀.₀₁ ₕ₂가 기준값 대비 1 오더 이상 감소
- Nyquist에서 세 번째 반원 등장 → 금속 기재 부식 개시
- Bode phase angle의 −90° 구간이 좁아짐 (커패시터 거동 손실)
- 저주파수에서 phase angle이 −45° 이하로 하락 → Warburg 성분 증가

[출처: Academia.edu 열사이클 EIS 연구, 열 처리 200°C 시 가장 빠른 열화 확인]

---

### 5. 좋은 피막 vs 나쁜 피막 — 전형적 응답 비교

#### 5-1. 수치 기준 비교표

| 파라미터 | 우수한 실링 피막 | 미실링 / 불량 피막 | 나금속(Al) |
|----------|----------------|-----------------|-----------|
| R_pore | > 100 kΩ·cm² | < 5 kΩ·cm² | N/A |
| R_barrier | 10 ~ 200 kΩ·cm² | < 2 kΩ·cm² | < 1 kΩ·cm² |
| R_total (R_pore + R_barrier) | > 100 kΩ·cm² | < 10 kΩ·cm² | 10~20 kΩ·cm² |
| |Z|₀.₀₁ ₕ₂ | > 10⁵ Ω·cm² | < 10³ Ω·cm² | ≈ 10⁴ Ω·cm² |
| phase angle (최대) | −80° ~ −90° | < −60° | −60° 내외 |
| n (CPE 지수) | 0.85~0.98 | 0.6~0.75 | 0.7~0.85 |
| Nyquist 모양 | 이중 대형 반원 | 소형 단일 반원 | 중형 반원 + Warburg |

[출처: Perplexity sonar-pro 합성, Academia.edu Al 6061 EIS, OSTI sealing study; 확신도 ★★☆]  
**이 수치가 틀릴 수 있는 조건**: 합금 종류(6061/2024/7075), 피막 두께, 실링 방법(열수/중온/크롬산), 전해질 조건에 따라 절대값 편차 크다.

#### 5-2. Nyquist 형태 시각적 가이드

```
우수한 실링 피막:
-Z''
  |     (장벽층 반원 — 훨씬 크다)
  |    ╭──────────────────╮
  |   ╭──╮               │
  |   │  │ (다공층 반원)  │
  |___│__│_______________│_________ Z'
       →                  →
       R_pore              R_barrier


불량 피막:
-Z''
  |  ╭──╮
  |  │  │  (작은 단일 반원)
  |__|__│___________________________________ Z'
         \
          \ ← 45° Warburg (부식 진행)


미처리 Al:
-Z''
  |
  |     ╭──────╮
  |     │      │
  |_____|______|______________________ Z'
                \
                 \ ← Warburg
```

---

### 6. 쉬운 언어 메타포 모음

| 개념 | 메타포 |
|------|--------|
| Nyquist 반원 | 산 — 산이 클수록 등산(전류 흐름)이 어렵다 |
| 이중 반원 | 이중 방어선 — 외성(다공층)과 내성(장벽층) |
| 높은 R_barrier | 두꺼운 성벽 — 이온이 통과하기 힘들다 |
| Warburg 직선 | 안개 속 등산 — 보이지 않는 장애(확산)가 속도를 제한한다 |
| Phase −90° | 댐 — 물(전류)을 저장할 뿐 흘려보내지 않는다 |
| Phase 0° | 열린 파이프 — 전류가 저항 없이 흐른다 |
| CPE 지수 n | 스프링 탄성도 — n=1은 완벽한 스프링, n<1은 점탄성 재료 |
| 주파수 = 시간상수의 역수 | 셔터 속도 — 빠른 주파수(높은 셔터)에서는 빠른 과정만 포착된다 |
| 저주파수 임피던스 | 오랜 노출 내구도 — 낮은 주파수에서 보이는 임피던스가 실제 부식 환경 저항력에 대응한다 |

---

### 7. 실무 함정(Pitfalls)

#### 7-1. 측정 시스템 설계 오류 ★★★

- **참조 전극 임피던스**: 참조 전극의 frит(액락)가 오염되거나 막히면 측정 임피던스에 artifact가 추가된다. 참조 전극 임피던스가 최적값의 2~3배 이상이면 측정 신뢰도 크게 저하.
- **전극 정렬**: 작용 전극(시편)과 대극(counter electrode)의 정렬이 나쁘면 전류 분포가 불균일해져 스펙트럼이 왜곡된다.
- **4단자 측정**: 고임피던스 피막에서는 리드 임피던스 오차가 커지므로 4단자 측정이 필수.
- [출처: Gamry EIS Difficult Samples PDF; 확신도 ★★★]

#### 7-2. 시편 표면 오염 ★★★

- 염화물 오염: 알루미늄에 공식(pitting)을 일으켜 측정 중 피막 상태가 변한다.
- 기름, 지문: 국소 저항 변화 → Nyquist 반원이 비대칭적으로 일그러짐.
- 대책: 측정 전 아세톤→IPA 순차 세정, 면적 마스킹 철저.

#### 7-3. 등가회로 과다 매개변수화(Over-fitting) ★★★

피팅이 잘 되는 것처럼 보여도 물리적으로 의미 없는 값이 나올 수 있다.

| 신호 | 내용 |
|------|------|
| R 값이 음수 | 모델이 과도하게 복잡함 |
| n > 1 또는 n < 0 | 물리적으로 불가능, 모델 재검토 필요 |
| χ² > 10⁻³ | 피팅 품질 불량 — 다른 등가회로 시도 |
| 파라미터 오차 > 파라미터 값의 30% | 파라미터가 데이터로 구속되지 않음 |

**대책**: Kramers-Kronig 변환으로 데이터 품질 먼저 검증 → 피팅 전 Nyquist/Bode에서 시정수 수를 육안 확인 → 필요 최소한의 등가회로 사용.

**쉬운 메타포**: "좋은 피팅은 6개 파라미터로 코끼리를 그리는 것이 아니라, 코끼리의 핵심 특징 3개를 정확히 잡는 것이다."

#### 7-4. 비정상 상태 측정 ★★★

EIS는 정상 상태(steady state) 가정에 기반한다. OCP(개회로 전위)가 안정되기 전에 측정하면 결과가 신뢰 불가.

- OCP가 안정화되는 데 최소 30분~1시간 침지 후 측정 권장.
- 장시간 측정(저주파수 포함 시 30분 이상) 중 시스템 드리프트가 있으면 저주파수 데이터 신뢰도 저하.
- 양극산화 피막은 초기 침지 시 자연 sealing이 일어나므로 침지 시간을 측정 기록에 반드시 명기해야 한다.

---

## 구현/실행 참고사항

### EIS 측정 순서

1. **표면 세정** — 아세톤 → IPA → 건조
2. **면적 마스킹** — 1 cm² 노출 권장 (재현성 확보)
3. **전해질 준비** — 3.5 wt% NaCl (산업 표준) 또는 0.1 M NaCl
4. **OCP 안정화 대기** — 최소 30분, OCP 변동 < 2 mV/min 확인
5. **EIS 측정** — 주파수 범위: 100 kHz ~ 0.01 Hz, 진폭: 10~20 mV (RMS)
6. **Kramers-Kronig 검증** — 데이터 품질 확인
7. **등가회로 피팅** — 3요소 모델로 시작 (Rs + R_pore/CPE_pore + R_barrier/CPE_barrier)
8. **시계열 반복 측정** — 1h, 24h, 72h, 168h (1주) 간격으로 추적

### 주파수별 정보 맵핑

| 주파수 범위 | 포착되는 현상 |
|------------|-------------|
| > 100 kHz | 용액 저항 R_s |
| 1 kHz ~ 100 kHz | 다공층 응답 |
| 1 Hz ~ 1 kHz | 장벽층 응답 |
| < 0.1 Hz | 확산 과정, 피막 열화 신호 |

---

## 관점 확장 / 문제 재정의

### 반증 탐색 결과

**"큰 |Z|가 항상 좋은 피막을 의미하지 않는 경우"** — 반증 발견:
- 양극산화 피막이 두꺼워도 기공 내 수분 침투가 빠르면 단기 임피던스는 높지만 장기 안정성이 낮다
- 표면에 생긴 오염물(유지)이 국소 저항을 증가시켜 임피던스를 인위적으로 높일 수 있다
- [출처: OSTI PDF 내용 + Perplexity 합성; 확신도 ★★☆]

### 숨은 변수 1: 측정 면적의 영향

면적이 클수록 국소 결함의 영향이 평균화된다. 1 cm² 시편에서 100 cm² 시편으로 바꾸면 임피던스가 오더 단위로 달라질 수 있다. EIS 결과는 면적 정규화(Ω·cm²)가 필수이며, 면적이 다른 결과를 직접 비교해서는 안 된다.

### 숨은 변수 2: 표준 침지 vs 염수 분무(salt spray) 조건의 불일치

EIS는 보통 침지(immersion) 조건에서 측정하지만, 실제 사용 환경은 염수 분무나 습도 변화를 포함한다. IOP 연구(2020)에서 침지 조건의 EIS와 염수 분무 조건의 EIS는 서로 다른 열화 패턴을 보였다. EIS 결과를 실제 사용 환경 예측에 쓸 때 이 간극을 인지해야 한다.

[이질 도메인: 콘크리트 구조물 부식 모니터링] 콘크리트 철근 EIS도 유사한 다층 모델(피막 저항 + 이중층 저항)을 쓴다. 콘크리트 도메인에서 개발된 시간 가중 임피던스 분석법을 양극산화 피막 수명 예측에 차용할 수 있다.

### 문제 재정의

원래 질문("EIS 결과를 어떻게 읽는가")보다 더 근본적인 질문:  
**"어떤 파라미터를 어떤 빈도로 추적해야 피막 수명을 예측할 수 있는가?"**  
— 단순 해석을 넘어, R_barrier의 시간 의존성 감소율(dR_barrier/dt)을 수명 예측 지표로 사용하는 접근이 더 실용적이다.

---

## 상충 정보

| 항목 | 출처 A | 출처 B | 상충 유형 |
|------|--------|--------|----------|
| 양극산화 R_barrier 기준값 | Perplexity 합성: 10~178 kΩ | R4 지시사항: 10⁷~10¹⁰ Ω·cm² | 수치 오더 차이 — 지시사항의 수치는 유기 코팅 기준으로 추정됨. 양극산화 피막은 유기 코팅보다 2~3 오더 낮은 것이 정상 |
| sealing 후 R_pore 기준 | Academia.edu: > 200 kΩ·cm² (boiling water) | 일반 문헌: 수 kΩ ~ 수십 kΩ | sealing 방법 차이 (boiling water vs 중온 sealing) |
| n 값 범위 | 지시사항: 0.7~0.9 일반적 | Perplexity: 0.8~1 (장벽층), 0.6~0.85 (다공층) | 층별 구분 없이 통합 범위 vs 층별 구분 |

---

## 자기 점검

| 기준 | 충족 | 미충족 사유 |
|------|------|-----------|
| Nyquist 모양 해석 (반원, Warburg) | ✓ | |
| Bode plot 저주파/위상 해석 | ✓ | |
| 등가회로 파라미터 수치 기준 | ✓ (문헌값 기반, 일부 조건 의존) | |
| 시간 의존성 설명 | ✓ | |
| 좋은/나쁜 피막 비교표 | ✓ | |
| 쉬운 메타포 모음 | ✓ (8개 이상) | |
| 실무 함정 4가지 | ✓ | |
| 반증 탐색 | ✓ | |
| 수치 투명성 (출처 + 오류 조건) | ✓ | |

---

## 출처 목록

| # | 출처 | 확신도 | URL |
|---|------|--------|-----|
| 1 | Electrochemical Impedance Spectroscopy — A Tutorial, ACS Measurement Science Au, 2023 | ★★★ | https://pubs.acs.org/doi/10.1021/acsmeasuresciau.2c00070 |
| 2 | Gamry Instruments, Basics of EIS (Application Note) | ★★★ | https://www.gamry.com/application-notes/EIS/basics-of-electrochemical-impedance-spectroscopy/ |
| 3 | Characterization of porous Al oxide films, J. Appl. Electrochem., Springer | ★★★ | https://link.springer.com/article/10.1023/A:1003481418291 |
| 4 | Characterization of anodized and sealed Al by EIS, Corr. Sci. 2002 (Suay et al.) | ★★★ | https://www.sciencedirect.com/science/article/abs/pii/S0010938X02001373 |
| 5 | Evaluation of corrosion resistance of anodized Al 6061 using EIS, Corr. Sci. 2008 | ★★★ | https://www.sciencedirect.com/science/article/abs/pii/S0010938X08003806 |
| 6 | Effect of sealing on morphology of anodized Al oxide, OSTI/DOE PDF, 2021 | ★★☆ | https://www.osti.gov/servlets/purl/1836473 |
| 7 | Corrosion testing of anodized aerospace alloys: EIS immersion vs salt spray, IOP J. Electrochem. Soc., 2020 | ★★★ | https://iopscience.iop.org/article/10.1149/1945-7111/ab74e3 |
| 8 | Structures and Properties of Oxide Barrier-Film of Anodized Al by EIS, Walsh Medical Media (Open Access PDF) | ★★☆ | https://www.walshmedicalmedia.com/open-access/structures-and-properties-of-oxide-barrierfilm-of-anodized-aluminum-by-electrochemical-impedance-spectroscopy-at-the-nanometere-scale-2155-9589.1000114.pdf |
| 9 | EIS of Difficult Samples, Gamry Instruments PDF | ★★★ | https://www.gamry.com/assets/uploads/resources/EIS-Difficult-Samples.pdf |
| 10 | Effect of Current Density on Corrosion Resistance — AA2024 EIS, Finishing & Coating | ★★☆ | https://finishingandcoating.com/index.php/anodizingcat/2069-effect-of-current-density-on-corrosion-resistance-on-anodizing-of-aa2024-aluminum-copper-alloy |
| 11 | Electrochemical Impedance Methods for Coatings, USBR/Bureau of Reclamation PDF, 2019 | ★★★ | https://www.usbr.gov/tsc/techreferences/mands/mands-pdfs/ElectrochemicalImpedanceMethods_8540-2019-03_508.pdf |
| 12 | Armatec EIS Research — Barrier Coatings | ★★☆ | https://armatec.squarespace.com/s/ATCoatingsEISResearch.pdf |

---

## 검색 비용 보고

| 도구 | 호출 수 |
|------|--------|
| WebSearch | 3 |
| WebFetch | 4 (2회 403/303 오류 포함) |
| search.sh search (Perplexity) | 3 |
| search.sh search (Tavily) | 1 |
| search.sh extract | 0 |
| search.sh research/reason | 0 |
| **합계** | **11** |

예산 22회 대비 11회 사용 (50% 사용). Layer 0과 Layer 1 조합으로 충분한 데이터를 확보하여 Layer 2/3는 사용하지 않았다.
