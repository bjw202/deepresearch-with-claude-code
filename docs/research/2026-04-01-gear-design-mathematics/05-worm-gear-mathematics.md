# 05. 웜 기어(Worm Gear) 수학 레퍼런스

> **역할**: Researcher 5 — 웜 기어 3D 형상 및 가공 수학 **작성일**: 2026-04-01 **확신도 기호**: ★★★ 교과서급 | ★★☆ 산업 표준/다수 출처 | ★☆☆ 단일 출처

---

## 개요

웜 기어(Worm Gear) 세트는 교차하지 않는 두 축(보통 90°) 사이에서 큰 감속비를 단일 단계로 구현한다. 웜(worm)은 나사형 나선면을 가지며, 웜 휠(worm wheel/worm gear)은 웜과 포락(envelope) 관계로 생성되는 복잡한 3D 공간 치면을 갖는다.

웜 기어 수학의 핵심 난점:

- 웜 치면은 헬리코이드(helicoid) 곡면이며, 웜 유형(ZA/ZI/ZN/ZK)에 따라 모선(generatrix) 정의가 다르다.
- 웜 휠 치면은 웜(또는 웜 형 호브)의 운동에 의한 **포락선**으로 정의되어 해석적 닫힌 형태(closed-form)가 없다.
- 3D 좌표 생성은 좌표계 변환(homogeneous coordinates)과 포락 조건 방정식을 연립 풀어야 한다.

---

## 1. 웜(Worm) 기본 파라미터 및 관계식

### 1.1 기본 기호 정의

| 기호 | 의미 | 단위 |
| --- | --- | --- |
| $m_x$ | 축방향 모듈(axial module) | mm |
| $m_n$ | 법선 모듈(normal module) | mm |
| $z_1$ | 웜 스레드 수(thread count) | — |
| $z_2$ | 웜 휠 이수 | — |
| $q$ | 직경 지수(diameter quotient) = $d_1 / m_x$ | — |
| $d_1$ | 웜 기준원 지름 | mm |
| $d_2$ | 웜 휠 기준원 지름 | mm |
| $\gamma$ | 리드각(lead angle) | deg/rad |
| $\alpha_x$ | 축방향 압력각 | deg |
| $\alpha_n$ | 법선 압력각(normal pressure angle) | deg |
| $p_x$ | 축방향 피치(axial pitch) | mm |
| $p_n$ | 법선 피치(normal pitch) | mm |
| $L$ | 리드(lead) = 1회전당 축방향 이동량 | mm |
| $a$ | 축간 거리(center distance) | mm |

★★★ [IIT Madras Machine Design II, Lecture 15, Gopinath & Mayuram]

### 1.2 핵심 파라미터 관계식

$$p_x = \pi m_x \tag{1}$$

$$L = p_x \cdot z_1 = \pi m_x z_1 \tag{2}$$

$$d_1 = q \cdot m_x \tag{3}$$

$$\tan\gamma = \frac{L}{\pi d_1} = \frac{z_1}{q} \tag{4}$$

$$d_2 = m_x z_2 \tag{5}$$

$$a = \frac{d_1 + d_2}{2} = \frac{m_x(q + z_2)}{2} \tag{6}$$

**법선 모듈과 축방향 모듈의 관계:**$$m_n = m_x \cos\gamma \tag{7}$$

**법선 압력각과 축방향 압력각:**$$\tan\alpha_n = \tan\alpha_x \cos\gamma \tag{8}$$

★★★ [KHK Gears Technical Reference, Table 4.23; Roy Mech Worm Gears]

> **수치 투명성**: $q$ (직경 지수)는 표준화된 값이 없지만, DIN 3975 및 AGMA 6022에서는 $q \geq z_1 + 1$ 권고. 실용 범위는 $q = 6 \sim 20$이며, $q$가 작으면 리드각이 커져 효율은 높지만 웜 강도가 저하된다.

### 1.3 표준 치형 비례

$$h_{a1} = m_x \quad \text{(웜 이끝 높이)} \tag{9}$$

$$h_{f1} = 1.2, m_x \quad \text{(웜 이뿌리 높이)} \tag{10}$$

$$d_{a1} = d_1 + 2h_{a1} = d_1 + 2m_x \tag{11}$$

$$d_{f1} = d_1 - 2h_{f1} = d_1 - 2.4, m_x \tag{12}$$

$$h_{a2} = m_x \quad \text{(웜 휠 이끝 높이)} \tag{13}$$

$$d_t = d_2 + 2h_{a2} \quad \text{(목 지름, throat diameter)} \tag{14}$$

$$d_{a2} = d_t + m_x \quad \text{(웜 휠 외경, 근사)} \tag{15}$$

$$r_i = a - \frac{d_{a1}}{2} \quad \text{(목면 반지름, throat surface radius)} \tag{16}$$

★★★ [KHK Gears Technical Reference, Table 4.23]

---

## 2. 웜 치형 유형과 3D 형상 수식

웜 유형은 **DIN 3975**에 따라 축단면 또는 법선단면의 치형 형상으로 분류된다.

### 2.1 좌표계 정의

- $\theta$: 웜 회전 파라미터 (helix parameter), $\theta \in [0, 2\pi \cdot n_{turns}]$
- $u$: 축단면 프로파일 상의 위치 파라미터 (반지름 방향)
- $p = L / (2\pi)$: 웜 나선 파라미터 (pitch parameter)
- $r_f = d_{f1}/2$: 이뿌리 원 반지름
- $r_a = d_{a1}/2$: 이끝 원 반지름
- $r_0 = d_1/2 = q m_x / 2$: 기준원 반지름

**일반 웜 표면 방정식 (헬리코이드):**

$$\mathbf{r}_{1F}(\eta, \theta) = \begin{pmatrix}
 \xi(\eta)\cos\theta - \eta\sin\theta \\
\xi(\eta)\sin\theta + \eta\cos\theta \\
\zeta(\eta) + p\theta 
\end{pmatrix} \tag{17}
$$

여기서 $(\xi(\eta), \eta, \zeta(\eta))$는 좌표계 $K_S(\xi, \eta, \zeta)$에서의 모선(generatrix) 파라미터 방정식이다. ★★☆ [Dudás, IJIREM 2015]

> 웜 유형별 차이는 **모선 $(\xi(\eta), \zeta(\eta))$의 정의**에만 있다.

---

### 2.2 ZA 웜 (아르키메디안 웜, Archimedean Worm)

**정의**: 축단면(axial section)에서 치형이 직선(trapezoid). 축단면을 나선 축을 따라 이동시키면 피치면이 아르키메디안 나선이 된다.

**모선 (축단면 직선 프로파일):**$$\xi(\eta) = \eta \cdot \cot\alpha_x, \quad \zeta(\eta) = 0 \tag{18}$$

여기서 $\eta \in [r_f, r_a]$, 우측 치면: $\alpha_x > 0$, 좌측 치면: $-\alpha_x$.

**ZA 웜 치면 3D 파라메트릭 방정식 (우측 치면):**

$$\begin{cases} x = \eta\cos\theta - \eta\cot\alpha_x \sin\theta \\ y = \eta\sin\theta + \eta\cot\alpha_x \cos\theta \\ z = p\theta \end{cases} \tag{19}$$

단, 양 치면을 모두 생성하려면 $\pm\alpha_x$에 대해 각각 계산하고, 위상차(치두께)를 고려한다.

★★☆ [ZHY Gear, Parametric Accurate 3D Modeling of ZA Worm Gears, 2026]

---

### 2.3 ZI 웜 (인벌류트 웜, Involute Worm)

**정의**: 법선단면(normal section)이 인벌류트 치형. 기저 원통의 접선 방향에서 직선 모선으로 생성된다.

**기저 원 반지름:**$$r_b = r_0 \cos\alpha_n = \frac{d_1}{2}\cos\alpha_n \tag{20}$$

**ZI 웜 치면 3D 방정식 (인벌류트 헬리코이드):**

$$\begin{cases} x = r_b\cos(\theta + u) + r_b u\sin(\theta + u) \\ y = r_b\sin(\theta + u) - r_b u\cos(\theta + u) \\ z = p\theta \pm r_b u \tan\gamma \end{cases} \tag{21}$$

여기서 $u$는 인벌류트 파라미터. ZI 웜은 법선단면이 인벌류트이므로 홈 가공 및 연삭이 용이하다.

★★☆ [ScienceDirect, ZN-type hourglass worm mathematical model; SDP-SI Metric Gear Technology]

---

### 2.4 ZN 웜 (법선직선 웜, Normal Straight-sided Worm)

**정의**: 법선단면(normal section)에서 치형이 직선. 치면 법선 방향에 직선 모선을 가지므로, 법선 피치 기준으로 설계된다.

**법선 단면의 직선 프로파일 → 치면 방정식:**

$$\begin{cases} x = r\cos\theta \\ y = r\sin\theta \\ z = p\theta \end{cases}, \quad r \text{에서 } \alpha_n \text{방향으로 오프셋} \tag{22}$$

법선 벡터를 이용한 정확한 형식:

$$\mathbf{r}_{ZN}(\rho, \theta) = \begin{pmatrix}
 (r_0 + \rho\sin\alpha_n)\cos\theta \mp \rho\cos\alpha_n\sin\theta \\
(r_0 + \rho\sin\alpha_n)\sin\theta \pm \rho\cos\alpha_n\cos\theta \\
p\theta - \rho\cos\alpha_n\tan\gamma 
\end{pmatrix} \tag{23}
$$

여기서 $\rho \in [-h_f/\cos\alpha_n,\, h_a/\cos\alpha_n]$.

★☆☆ [Eng-Tips ZN Worm Profiles 포럼; SDP-SI Normal Module System]

---

### 2.5 ZK 웜 (원뿔 숫돌 웜, Conical-disk Worm)

**정의**: 원통형 숫돌(원뿔면)로 연삭하여 생성. ZC 또는 KK라고도 한다. 축단면이 오목 곡선.

ZK 웜은 회전하는 원뿔 그라인딩 휠의 원뿔면 모선으로 치면이 정의된다. 수식이 가장 복잡하며, 공구 형상에 의존한다.

$$\mathbf{r}_{ZK}(u, \theta): \text{공구 중심 좌표계에서 원뿔면을 웜 축 좌표계로 변환} \tag{24}$$

실용에서는 CAD 소프트웨어(CATIA, NX)의 좌표 변환 파이프라인으로 구현.

---

### 2.6 웜 유형 비교표

| 유형 | 축단면 치형 | 법선단면 | 가공 방법 | 특징 |
| --- | --- | --- | --- | --- |
| ZA | 직선 (사다리꼴) | 볼록 곡선 | 선반/나사 절삭 | 제조 용이, 소형 |
| ZI | 인벌류트 곡선 | 직선 | 인벌류트 공구 | 연삭 가능, 정밀 |
| ZN | 오프셋 직선 | 직선 | 특수 공구 | 법선 피치 기준 |
| ZK | 오목 곡선 | — | 원뿔 숫돌 연삭 | 최고 정밀도 |

★★☆ [Gear Solutions, "Worm Gearing Twists Its Way Into Our Design Suite"]

---

## 3. 웜 휠(Worm Wheel) 3D 형상

### 3.1 웜 휠 기하학적 파라미터

| 파라미터 | 수식 | 설명 |
| --- | --- | --- |
| 기준원 지름 | $d_2 = m_x z_2$ | 축방향 모듈 기준 |
| 목 지름 | $d_t = d_2 + 2m_x$ | 웜 휠 최대 지름 |
| 목면 반지름 | $r_i = a - d_{a1}/2$ | 웜 외경 기준 오목면 |
| 외경 | $d_{a2} = d_t + m_x$ | 모서리까지 |
| 이뿌리 지름 | $d_{f2} = d_t - 2.4,m_x$ |  |
| 치폭 | $b_2 \leq 0.75\left(1 + \frac{2}{q}\right)d_1$ | $z_1 < 4$인 경우 |
| 유효 맞물림 폭 | $b_w = 2m_x\sqrt{q+1}$ | 근사식 |

★★★ [KHK Gears Table 4.23; IIT Madras Lecture 15 식 (15.6)]

### 3.2 웜 휠 치면 포락 생성 (Envelope Generation)

웜 휠 치면은 **웜과의 포락(envelope)** 으로 정의된다. 해석 절차:

**Step 1: 좌표계 설정**

- $S_1$: 웜 축 좌표계 (웜이 $\phi_1$ 각도 회전)
- $S_2$: 웜 휠 축 좌표계 (웜 휠이 $\phi_2 = \phi_1 / i$ 각도 회전)
- $S_f$: 고정 좌표계 (두 축간 거리 $a$ 유지)

**Step 2: 운동 변환행렬**

웜 표면 점을 웜 휠 좌표계로 변환: $$\mathbf{r}*2(\phi_1, u, \theta) = M*{21}(\phi_1) \cdot \mathbf{r}_1(u, \theta) \tag{25}$$

$$M_{21} = M_{2f} \cdot M_{f1}(\phi_1) \tag{26}$$

여기서:

$$M_{f1}(\phi_1) = \begin{pmatrix}
 \cos\phi_1 & -\sin\phi_1 & 0 & 0 \\
\sin\phi_1 & \cos\phi_1 & 0 & 0 \\
0 & 0 & 1 & 0 \\
0 & 0 & 0 & 1 
\end{pmatrix} \tag{27}
$$

웜 휠 축이 수직일 때 ($90°$ 축각):

$$M_{2f} = \begin{pmatrix}
 \cos\phi_2 & 0 & \sin\phi_2 & a\cos\phi_2 \\
\sin\phi_2 & 0 & -\cos\phi_2 & a\sin\phi_2 \\
0 & 1 & 0 & 0 \\
0 & 0 & 0 & 1 
\end{pmatrix} \tag{28}
$$

★★☆ [Dudás, IJIREM 2015; de Gruyter, Worm Wheel Generation 2017]

**Step 3: 포락 조건 방정식**

포락 조건은 **접촉선(meshing equation)**: $$f(u, \theta, \phi_1) = \mathbf{n}_1 \cdot \mathbf{v}^{(12)} = 0 \tag{29}$$

여기서:

- $\mathbf{n}_1$: 웜 표면의 단위 법선 벡터
- $\mathbf{v}^{(12)} = \mathbf{v}^{(1)} - \mathbf{v}^{(2)}$: 웜과 웜 휠의 상대 속도 벡터

**Step 4: 웜 휠 치면 좌표 생성**

식 (29)에서 $\phi_1 = f(u, \theta)$를 수치적으로 풀고, 이를 식 (25)에 대입:

$$\mathbf{r}_{2,\text{tooth}} = \mathbf{r}_2(\phi_1^*(u,\theta),, u,, \theta) \tag{30}$$

★★☆ [PMC Article PMC9500664; Semantic Scholar worm wheel tooth flank]

> **반증 탐색**: 일부 CAD 문헌은 간략화된 스위프(sweep)로 웜 휠을 근사하지만, 이 방식은 FEA/정밀 조립 시 간섭 오류를 유발한다. 정확한 시뮬레이션 앱에는 포락 생성 방식이 필수. [ZHY Gear 2026]

---

## 4. 웜-웜 휠 맞물림 기하학

### 4.1 기본 맞물림 관계

$$i = \frac{z_2}{z_1} = \frac{\omega_1}{\omega_2} \tag{31}$$

**속도비 범위**: 통상 $5 \leq i \leq 100$ (단일 단계)

**축간 거리:**$$a = \frac{d_1 + d_2}{2} = \frac{m_x(q + z_2)}{2} \tag{32}$$

### 4.2 미끄러짐 속도 (Sliding Velocity)

$$v_s = \frac{v_1}{\cos\gamma} = \frac{\pi d_1 n_1}{60,000,\cos\gamma} \quad [\text{m/s}] \tag{33}$$

여기서 $n_1$ [rpm], $d_1$ [mm].

### 4.3 효율 (Efficiency)

**웜이 구동(driving worm):**$$\eta_{12} = \frac{\tan\gamma}{\tan(\gamma + \varphi')} \tag{34}$$

**웜 휠이 구동(driving wheel):**$$\eta_{21} = \frac{\tan(\gamma - \varphi')}{\tan\gamma} \tag{35}$$

여기서: $$\tan\varphi' = \frac{\mu}{\cos\alpha_n} \tag{36}$$

$\varphi'$: 수정 마찰각(modified friction angle) $\mu$: 마찰 계수 (브론즈 휠 + 강 웜: $\mu \approx 0.02 \sim 0.05$, 속도에 따라 변동)

★★★ [SDP-SI Metric Gear Technology §9; IIT Madras Lecture 15]

### 4.4 자기잠금 조건 (Self-locking Condition)

$$\gamma < \varphi' = \arctan\left(\frac{\mu}{\cos\alpha_n}\right) \tag{37}$$

즉, 리드각이 마찰각보다 작으면 웜 휠에서 웜을 역구동할 수 없다.

> **수치 투명성**: 자기잠금은 마찰 계수에 크게 의존. $\mu = 0.05$, $\alpha_n = 20°$이면 $\varphi' \approx 3.05°$로 리드각 $3°$ 이하에서 자기잠금. 마찰 계수가 낮거나 충격 하중이 있으면 역구동이 발생할 수 있으므로, "이 수치가 틀릴 수 있는 조건"은 저점도 오일, 고온, 진동이다.

★★★ [ZHY Gear, Worm Gears Self-locking Mechanism; Motion Control Tips]

---

## 5. 설계 파라미터 관계 및 표준

### 5.1 직경 지수 $q$ 권고 범위

| $z_1$ | 추천 $q$ 범위 |
| --- | --- |
| 1 | 14 \~ 17 |
| 2 | 11 \~ 14 |
| 4 | 8 \~ 12 |
| 6+ | 6 \~ 10 |

★★☆ [DIN 3975; AGMA 6022-C93]

### 5.2 표준 축방향 모듈 시리즈 (ISO 54 / DIN 780)

$$m_x \in \{1,\, 1.25,\, 1.5,\, 2,\, 2.5,\, 3,\, 4,\, 5,\, 6,\, 8,\, 10,\, 12,\, 16,\, 20\} \quad [\text{mm}]$$

★★☆ [Roy Mech Worm Gears; KHK Standard]

### 5.3 웜 면폭 (Worm Face Width)

$$b_1 = \pi m_x (4.5 + 0.02 z_2) \quad \text{[mm, 충분 조건]} \tag{38}$$

또는 DIN 방식: $$b_1 = \left[\left(\frac{d_{a2}}{2}\right)^2 - \left(a - \frac{d_{a1}}{2}\right)^2\right]^{0.5} \tag{39}$$

### 5.4 웜 휠 치폭

$$b_2 \leq 0.5, d_{a1} \tag{40}$$

또는: $$b_2 \leq 0.75\left(1 + \frac{2}{q}\right)d_1 \quad (z_1 < 4) \tag{41}$$

★★★ [IIT Madras Lecture 15 식 (15.6); KHK Table 4.23]

### 5.5 이수 조건

$$z_1 + z_2 > 40 \tag{42}$$

웜 휠 최소 이수: $z_2 \geq 24$ (권장)

---

## 6. Python 구현 코드

```python
"""
worm_gear_math.py
웜 기어 3D 형상 생성 및 설계 파라미터 계산
즉시 실행 가능한 독립 모듈
의존성: numpy, matplotlib (선택)
"""

import numpy as np
from dataclasses import dataclass
from typing import Optional


# ─────────────────────────────────────────
# 1. 설계 파라미터 계산
# ─────────────────────────────────────────

@dataclass
class WormGearPair:
    """웜 기어 세트 기본 파라미터 컨테이너 (축방향 모듈 시스템)"""
    mx: float          # 축방향 모듈 [mm]
    z1: int            # 웜 스레드 수 (1~6)
    z2: int            # 웜 휠 이수
    q: float           # 직경 지수 d1/mx
    alpha_x_deg: float = 20.0  # 축방향 압력각 [deg]
    mu: float = 0.03   # 마찰 계수 (브론즈/강 조합 일반값)

    def __post_init__(self):
        # 단위 변환
        self.alpha_x = np.radians(self.alpha_x_deg)

        # 기준 치수 계산
        self.d1 = self.q * self.mx                          # 웜 기준원 지름
        self.d2 = self.mx * self.z2                         # 웜 휠 기준원 지름
        self.a  = (self.d1 + self.d2) / 2                   # 축간 거리

        # 리드 및 리드각
        self.L = np.pi * self.mx * self.z1                  # 리드
        self.gamma = np.arctan(self.z1 / self.q)            # 리드각 [rad]
        self.gamma_deg = np.degrees(self.gamma)

        # 법선 모듈 및 압력각
        self.mn = self.mx * np.cos(self.gamma)
        self.alpha_n = np.arctan(np.tan(self.alpha_x) * np.cos(self.gamma))
        self.alpha_n_deg = np.degrees(self.alpha_n)

        # 헬리컬 파라미터
        self.p = self.L / (2 * np.pi)  # 나선 파라미터

        # 이끝/이뿌리
        self.ha1 = self.mx
        self.hf1 = 1.2 * self.mx
        self.da1 = self.d1 + 2 * self.ha1
        self.df1 = self.d1 - 2 * self.hf1

        # 웜 휠 치수
        self.ha2 = self.mx
        self.dt  = self.d2 + 2 * self.ha2         # 목 지름
        self.da2 = self.dt + self.mx               # 웜 휠 외경 (근사)
        self.df2 = self.dt - 2.4 * self.mx        # 이뿌리 지름
        self.ri  = self.a - self.da1 / 2           # 목면 반지름

        # 속도비
        self.i = self.z2 / self.z1

    def efficiency(self) -> tuple[float, float]:
        """
        효율 계산
        Returns: (eta_12, eta_21) = (웜→휠, 휠→웜)
        """
        phi_prime = np.arctan(self.mu / np.cos(self.alpha_n))
        eta_12 = np.tan(self.gamma) / np.tan(self.gamma + phi_prime)
        tan_diff = np.tan(self.gamma - phi_prime)
        eta_21 = tan_diff / np.tan(self.gamma) if tan_diff > 0 else 0.0
        return eta_12, eta_21

    def is_self_locking(self) -> bool:
        """자기잠금 조건 확인"""
        phi_prime = np.arctan(self.mu / np.cos(self.alpha_n))
        return self.gamma < phi_prime

    def sliding_velocity(self, n1_rpm: float) -> float:
        """미끄러짐 속도 [m/s]"""
        return (np.pi * self.d1 * n1_rpm) / (60_000 * np.cos(self.gamma))

    def summary(self):
        eta12, eta21 = self.efficiency()
        print("=" * 50)
        print("웜 기어 세트 파라미터 요약")
        print("=" * 50)
        print(f"  축방향 모듈 mx    = {self.mx} mm")
        print(f"  웜 스레드 수 z1   = {self.z1}")
        print(f"  웜 휠 이수 z2     = {self.z2}")
        print(f"  직경 지수 q       = {self.q}")
        print(f"  속도비 i          = {self.i:.1f}")
        print(f"  웜 기준원 d1      = {self.d1:.3f} mm")
        print(f"  웜 휠 기준원 d2   = {self.d2:.3f} mm")
        print(f"  축간 거리 a       = {self.a:.3f} mm")
        print(f"  리드 L            = {self.L:.3f} mm")
        print(f"  리드각 γ          = {self.gamma_deg:.4f}°")
        print(f"  법선 모듈 mn      = {self.mn:.4f} mm")
        print(f"  법선 압력각 αn    = {self.alpha_n_deg:.4f}°")
        print(f"  웜 이끝 지름 da1  = {self.da1:.3f} mm")
        print(f"  웜 이뿌리 지름 df1= {self.df1:.3f} mm")
        print(f"  목 지름 dt        = {self.dt:.3f} mm")
        print(f"  목면 반지름 ri    = {self.ri:.3f} mm")
        print(f"  효율 (웜→휠)      = {eta12*100:.1f} %")
        print(f"  효율 (휠→웜)      = {eta21*100:.1f} %")
        print(f"  자기잠금          = {'예' if self.is_self_locking() else '아니오'}")
        print("=" * 50)


# ─────────────────────────────────────────
# 2. 웜 3D 좌표 생성 (ZA 웜)
# ─────────────────────────────────────────

def generate_za_worm_surface(
    wg: WormGearPair,
    n_theta: int = 360,
    n_u: int = 30,
    n_turns: Optional[float] = None
) -> tuple[np.ndarray, np.ndarray, np.ndarray]:
    """
    ZA 웜(아르키메디안) 단일 치면의 3D 좌표 생성

    Args:
        wg: WormGearPair 인스턴스
        n_theta: 나선 방향 분할 수
        n_u: 반지름 방향 (치형 깊이) 분할 수
        n_turns: 웜 길이 (None이면 기본 면폭에서 자동 계산)

    Returns:
        X, Y, Z: shape (n_u, n_theta) 배열
    """
    if n_turns is None:
        # 웜 면폭에서 권장 회전 수 계산
        b1 = np.pi * wg.mx * (4.5 + 0.02 * wg.z2)
        n_turns = b1 / wg.L

    # 파라미터 범위
    theta = np.linspace(-n_turns * np.pi, n_turns * np.pi, n_theta)
    u = np.linspace(wg.df1 / 2, wg.da1 / 2, n_u)

    # 메시 그리드
    TH, U = np.meshgrid(theta, u)

    # ZA 웜 치면 방정식 (우측 치면, 식 19)
    # 축단면 모선: xi = u * cot(alpha_x), zeta = 0
    cot_ax = np.cos(wg.alpha_x) / np.sin(wg.alpha_x)
    xi = U * cot_ax  # 나선 방향 오프셋

    X = U * np.cos(TH) - xi * np.sin(TH)
    Y = U * np.sin(TH) + xi * np.cos(TH)
    Z = wg.p * TH

    return X, Y, Z


def generate_za_worm_both_flanks(
    wg: WormGearPair,
    n_theta: int = 360,
    n_u: int = 30,
    n_turns: Optional[float] = None
) -> tuple:
    """ZA 웜 양쪽 치면 + 이끝면 생성"""
    if n_turns is None:
        b1 = np.pi * wg.mx * (4.5 + 0.02 * wg.z2)
        n_turns = b1 / wg.L

    theta = np.linspace(-n_turns * np.pi, n_turns * np.pi, n_theta)
    u = np.linspace(wg.df1 / 2, wg.da1 / 2, n_u)
    TH, U = np.meshgrid(theta, u)

    cot_ax = np.cos(wg.alpha_x) / np.sin(wg.alpha_x)

    # 치두께 위상차: 기준원에서 치두께 = pi*mx/2 에 해당하는 각도
    tooth_half_angle = np.pi / (2 * wg.q)  # 기준원 반각

    # 우측 치면
    xi_r = U * cot_ax
    X_r = U * np.cos(TH) - xi_r * np.sin(TH)
    Y_r = U * np.sin(TH) + xi_r * np.cos(TH)
    Z_r = wg.p * TH

    # 좌측 치면 (위상 오프셋 + alpha_x 부호 반전)
    TH_l = TH + tooth_half_angle * 2
    xi_l = -U * cot_ax
    X_l = U * np.cos(TH_l) - xi_l * np.sin(TH_l)
    Y_l = U * np.sin(TH_l) + xi_l * np.cos(TH_l)
    Z_l = wg.p * TH_l

    return (X_r, Y_r, Z_r), (X_l, Y_l, Z_l)


# ─────────────────────────────────────────
# 3. 웜 휠 포락 좌표 생성 (ZA 웜 기준)
# ─────────────────────────────────────────

def coordinate_transform_worm_to_wheel(
    r1_pts: np.ndarray,   # (N, 3) worm surface points in S1 frame
    phi1: float,          # worm rotation angle [rad]
    phi2: float,          # wheel rotation angle [rad]
    a: float              # center distance [mm]
) -> np.ndarray:
    """
    웜 표면 점을 웜 휠 좌표계로 변환 (축각 90°)
    식 (25)-(28) 구현

    Args:
        r1_pts: 웜 좌표계의 점들 (N x 3)
        phi1: 웜 회전각 [rad]
        phi2: 웜 휠 회전각 = phi1 / i [rad]
        a: 축간 거리

    Returns:
        r2_pts: 웜 휠 좌표계의 점들 (N x 3)
    """
    # Homogeneous coordinates
    N = r1_pts.shape[0]
    r1_h = np.hstack([r1_pts, np.ones((N, 1))])

    # M_f1: 고정계 → 웜계 역변환 (웜이 phi1 회전)
    c1, s1 = np.cos(phi1), np.sin(phi1)
    Mf1 = np.array([
        [ c1, -s1, 0, 0],
        [ s1,  c1, 0, 0],
        [  0,   0, 1, 0],
        [  0,   0, 0, 1]
    ])

    # M_2f: 고정계 → 웜 휠계 변환 (축간 거리 a, 웜 휠이 phi2 회전)
    # 웜 휠 축은 Y축 방향 (90° 교차)
    c2, s2 = np.cos(phi2), np.sin(phi2)
    M2f = np.array([
        [ c2,  0, s2, a*c2],
        [ s2,  0,-c2, a*s2],
        [  0,  1,  0,    0],
        [  0,  0,  0,    1]
    ])

    M21 = M2f @ Mf1
    r2_h = (M21 @ r1_h.T).T
    return r2_h[:, :3]


def generate_worm_wheel_envelope(
    wg: WormGearPair,
    n_u: int = 20,
    n_theta_worm: int = 180,
    n_phi1: int = 100
) -> np.ndarray:
    """
    수치적 포락 생성으로 웜 휠 치면 3D 좌표 계산

    알고리즘:
    1. phi1 값별로 웜 표면을 웜 휠 좌표계로 변환
    2. 모든 phi1에 대한 점 집합의 외곽(envelope) = 웜 휠 치면

    Returns:
        pts: (M, 3) 웜 휠 치면 좌표 (정렬 안 됨)
    """
    # 웜 표면 파라미터 (1 tooth pitch)
    theta_range = 2 * np.pi / wg.z1  # 1 lead pitch
    theta = np.linspace(-theta_range/2, theta_range/2, n_theta_worm)
    u = np.linspace(wg.df1/2, wg.da1/2, n_u)
    TH, U = np.meshgrid(theta, u)

    cot_ax = np.cos(wg.alpha_x) / np.sin(wg.alpha_x)

    # ZA 웜 치면 점 생성 (우측 치면)
    xi = U * cot_ax
    X1 = (U * np.cos(TH) - xi * np.sin(TH)).ravel()
    Y1 = (U * np.sin(TH) + xi * np.cos(TH)).ravel()
    Z1 = (wg.p * TH).ravel()
    r1_pts = np.column_stack([X1, Y1, Z1])

    # phi1 범위: 웜 1회전 (웜 휠 1이 이동)
    phi1_arr = np.linspace(0, 2 * np.pi / wg.z1, n_phi1)
    all_pts = []

    for phi1 in phi1_arr:
        phi2 = phi1 / wg.i
        r2_pts = coordinate_transform_worm_to_wheel(r1_pts, phi1, phi2, wg.a)
        all_pts.append(r2_pts)

    return np.vstack(all_pts)


# ─────────────────────────────────────────
# 4. 효율 및 자기잠금 곡선
# ─────────────────────────────────────────

def plot_efficiency_vs_lead_angle(
    mu_values: list[float] = [0.02, 0.05, 0.10],
    alpha_n_deg: float = 20.0,
    gamma_range_deg: tuple = (1, 45)
):
    """리드각에 따른 효율 곡선 (matplotlib 필요)"""
    try:
        import matplotlib.pyplot as plt
    except ImportError:
        print("matplotlib이 필요합니다.")
        return

    alpha_n = np.radians(alpha_n_deg)
    gamma = np.linspace(*[np.radians(x) for x in gamma_range_deg], 200)

    fig, ax = plt.subplots(figsize=(8, 5))
    for mu in mu_values:
        phi_prime = np.arctan(mu / np.cos(alpha_n))
        eta = np.tan(gamma) / np.tan(gamma + phi_prime)
        eta = np.where(gamma + phi_prime < np.pi/2, eta, np.nan)
        ax.plot(np.degrees(gamma), eta * 100, label=f'μ={mu}')
        # 자기잠금 경계
        ax.axvline(np.degrees(phi_prime), color=ax.lines[-1].get_color(),
                   linestyle='--', alpha=0.5)

    ax.set_xlabel('리드각 γ [°]')
    ax.set_ylabel('효율 η [%]')
    ax.set_title('웜 기어 효율 vs 리드각 (파선: 자기잠금 경계)')
    ax.legend()
    ax.grid(True, alpha=0.3)
    ax.set_ylim(0, 100)
    plt.tight_layout()
    plt.show()


# ─────────────────────────────────────────
# 5. 사용 예시
# ─────────────────────────────────────────

if __name__ == "__main__":
    # 예제: mx=3, z1=2 (double thread), z2=30, q=11
    wg = WormGearPair(mx=3.0, z1=2, z2=30, q=11.0, alpha_x_deg=20.0, mu=0.04)
    wg.summary()

    # ZA 웜 3D 좌표 생성
    X, Y, Z = generate_za_worm_surface(wg, n_theta=180, n_u=20)
    print(f"\nZA 웜 치면 좌표 shape: {X.shape}")
    print(f"X 범위: [{X.min():.2f}, {X.max():.2f}] mm")
    print(f"Z 범위: [{Z.min():.2f}, {Z.max():.2f}] mm")

    # 웜 휠 포락 생성 (수치적)
    print("\n웜 휠 포락 좌표 생성 중...")
    ww_pts = generate_worm_wheel_envelope(wg, n_u=15, n_theta_worm=60, n_phi1=60)
    print(f"웜 휠 치면 점 수: {len(ww_pts)}")

    # 효율 계산
    eta12, eta21 = wg.efficiency()
    print(f"\n효율 (웜→휠): {eta12*100:.1f}%")
    print(f"효율 (휠→웜): {eta21*100:.1f}%")
    print(f"자기잠금: {'예' if wg.is_self_locking() else '아니오'}")
    print(f"미끄러짐 속도 @1500 rpm: {wg.sliding_velocity(1500):.2f} m/s")

    # 효율 곡선 (matplotlib 설치 시)
    # plot_efficiency_vs_lead_angle()
```

---

## 7. 구현 참고사항

### 7.1 웜 유형 선택 기준

| 상황 | 권장 유형 |
| --- | --- |
| 일반 산업용, 저비용 | ZA |
| 정밀 전동, 연삭 필요 | ZI 또는 ZK |
| 법선 피치 기준 설계 | ZN |
| 고정밀 CNC 가공 | ZK |

### 7.2 3D 모델링 주의사항

1. **ZA 웜**: 코드에서 제공한 식 (19)로 직접 메시 생성 가능. 좌우 치면 위상차(치두께)를 정확히 계산해야 한다.
2. **웜 휠 치면**: 포락 생성은 수치적이므로 점 밀도와 φ₁ 분할 수가 정확도를 결정한다. 고정밀 모델은 n_phi1 ≥ 200 권장.
3. **좌표계 방향**: 코드의 Z축 = 웜 회전축, Y축 = 웜 휠 회전축 (90° 교차 기준). CAD 소프트웨어에 따라 변환 필요.
4. **치수 검증**: 생성된 좌표의 반지름값 범위가 $[r_{f1}, r_{a1}]$에 있는지 확인.
5. **양쪽 치면 + 이끝면**: 완전한 웜 치형은 우측 치면 + 이끝 원호 + 좌측 치면으로 구성. `generate_za_worm_both_flanks()` 함수 참조.

### 7.3 성능 최적화

- `n_theta × n_u` 배열 연산은 NumPy 벡터화로 처리됨 (루프 불필요)
- 웜 휠 포락 생성은 $O(n_{phi1} \times n_u \times n_\theta)$의 점을 생성하므로, 초기 탐색은 낮은 해상도(n≤60)로 먼저 수행
- 최종 시각화용 메시는 `scipy.interpolate.griddata`로 정규 그리드로 리샘플링 권장

---

## 8. 관점 확장 / 문제 재정의

### 8.1 인접 질문 (결론을 바꿀 수 있는 변수)

**Q1. 더블 엔벨로핑(Globoid) 웜 기어는 어떻게 다른가**?단일 엔벨로핑(cylindrical worm)은 웜만 직선, 웜 휠만 포락이다. 더블 엔벨로핑(ZK hourglass worm)은 웜도 곡면이 되어 접촉 면적이 크게 증가하지만, 제조 및 조립 정밀도 요구가 극히 높다. 시뮬레이션 앱 목적이 제조 공정 시각화라면 globoid 웜의 수식도 추가 필요할 수 있다.

**Q2. 수정 웜 기어(profile shift $x_{t2} \neq 0$)의 영향**이수 조합에 따라 표준 모듈로 축간 거리를 맞추기 어려울 때 프로파일 시프트($x_{t2}$)를 적용한다. 이 경우 치두께, 압력각, 이끝 높이 수식이 모두 달라지므로, 코드에 `xt2` 파라미터를 추가해야 한다.

### 8.2 이질 도메인 유추

[이질 도메인: 나사 기계(Thread/Screw Mechanics)] 웜-웜 휠의 포락 생성과 자기잠금 조건은 볼 스크류·리드 스크류의 수학 구조와 동일하다. 특히 효율 식 (34)는 사면 위 블록 마찰 모델과 구조가 같다. 볼 스크류 역전 방지 설계에서 개발된 마찰각 보정 기법을 웜 기어 자기잠금 신뢰성 분석에 차용할 수 있다.

### 8.3 문제 재정의

> 원래 질문: "웜/웜 휠의 3D 형상 생성에 필요한 파라메트릭 수식" 더 적절한 핵심 질문: "시뮬레이션 앱에서 웜 기어 유형(ZA/ZI/ZN/ZK)별로 실시간 3D 메시를 생성하려면 어떤 수준의 포락 계산 근사를 허용할 것인가?" — 이유: 정확한 포락 생성은 연산 비용이 크므로, 앱의 목적(시각화 vs 정밀 시뮬레이션)에 따라 ZA 직선 프로파일 근사 또는 수치 포락 중 하나를 선택해야 한다.

---

## 9. 출처 목록

| 번호 | 출처 | 유형 | 확신도 | URL |
| --- | --- | --- | --- | --- |
| 1 | IIT Madras Machine Design II, Lecture 15, Gopinath & Mayuram | 교과서 | ★★★ | https://archive.nptel.ac.in/content/storage2/courses/112106137/pdf/2_15.pdf |
| 2 | KHK Gears Technical Reference, Table 4.23 (Worm Gear Pair) | 산업 표준 | ★★★ | https://khkgears.net/new/gear_knowledge/gear_technical_reference/calculation_gear_dimensions.html |
| 3 | SDP-SI Elements of Metric Gear Technology §9 | 산업 표준 | ★★★ | https://sdp-si.com/resources/elements-of-metric-gear-technology/page5.php |
| 4 | Roy Mech Worm Gears | 기술 레퍼런스 | ★★☆ | https://roymech.org/Useful_Tables/Drive/Worm_Gears.html |
| 5 | Dudás I., "General Mathematical Model for Cylindrical/Conical Worms", IJIREM 2015 | 학술 논문 | ★★☆ | https://ijirem.org/DOC/1_general-mathematical-model-for.pdf |
| 6 | ZHY Gear, "Parametric Accurate 3D Modeling of ZA Worm Gears", 2026 | 산업 기술 | ★★☆ | https://www.zhygear.com/parametric-accurate-3d-modeling-of-za-worm-gears/ |
| 7 | Gear Solutions, "Worm Gearing Twists Its Way Into Our Design Suite" | 산업 기술 | ★★☆ | https://gearsolutions.com/departments/materials-matter/worm-gearing-twists-its-way-into-our-design-suite/ |
| 8 | MITcalc Worm Gear Geometry | 계산 도구 | ★★☆ | https://www.mitcalc.com/doc/gear4/help/en/gear4.htm |
| 9 | de Gruyter, "Worm Wheel Tooth Generation", 2017 | 학술 논문 | ★★☆ | https://www.degruyterbrill.com/document/doi/10.1515/eng-2017-0047/html |
| 10 | PMC9500664, Worm Wheel Envelope Axial Profile | 학술 논문 | ★★☆ | https://pmc.ncbi.nlm.nih.gov/articles/PMC9500664/ |
| 11 | ZHY Gear, "Worm Gears Self-locking Mechanism" | 산업 기술 | ★★☆ | https://www.zhygear.com/worm-gears-self-locking-mechanism-and-failure-analysis/ |
| 12 | Engineers Edge, Worm Gear Formula Table | 레퍼런스 | ★★☆ | https://www.engineersedge.com/gears/worm_gear_formula_table_13534.htm |

---

*작성: Researcher 5 (Sonnet 4.6) — 2026-04-01저장 경로:* `docs/research/2026-04-01-gear-design-mathematics/05-worm-gear-mathematics.md`