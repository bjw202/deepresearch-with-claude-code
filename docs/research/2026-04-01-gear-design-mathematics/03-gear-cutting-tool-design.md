# 기어 가공 공구 설계 수학 (Gear Cutting Tool Design Mathematics)

> **역할**: Researcher 3 — 기어 가공 공구 설계 수학 **작성일**: 2026-04-01 **목적**: 기어 시뮬레이션 앱 구현에 직접 사용 가능한 수학적 레퍼런스

---

## 개요

기어 가공은 크게 네 가지 공구 유형으로 구분된다:

- **호브(Hob)**: 연속 창성(generating) 방식, 생산성 최고
- **피니언 커터(Pinion Cutter / Shaper Cutter)**: 기어 쌍 맞물림 원리 활용, 내접기어 가공 가능
- **랙 커터(Rack Cutter)**: 직선 랙과 롤링 운동으로 치형 창성
- **스키빙 커터(Skiving Cutter)**: 교차축 연속 회전, 내접기어 고속 가공 (Section 3A)

네 공구 모두 **포락선(envelope) 이론**을 공통 수학 기반으로 사용한다: 공구의 운동 궤적들의 포락선이 곧 기어 치형이 된다.

---

## 1. 호브(Hob) 설계 수학

### 1.1 기본 구조와 좌표계

호브는 나선형(helical)으로 배치된 래크 치형(rack tooth profile) 집합체다. 기어 가공 시 호브와 기어 블랭크가 **연속 동기 회전**하여 창성한다.

**주요 좌표계**:

- $S_h$: 호브 고정 좌표계 (hob frame)
- $S_w$: 공작물(workpiece) 좌표계

**호브-기어 회전 동기 관계** [Bergseth, KTH 2011]:

$$\frac{\dot{\phi}_w}{\dot{\phi}_h} = \frac{N_o}{N}$$

- $\dot{\phi}_w$: 공작물 회전 속도
- $\dot{\phi}_h$: 호브 회전 속도
- $N_o$: 호브 스레드(thread) 수
- $N$: 기어 이수(tooth number)

> **실행 연결**: 위 비율로 호빙 머신의 인덱스 기어트레인을 설계한다. 예: 32이 기어, 단선(single-start) 호브 → 기어:호브 = 1:32

### 1.2 호브 리드 각(Lead Angle) 계산 ★★★

$$\gamma_o = \arcsin\left(\frac{N_o \cdot m_{no}}{d_o}\right)$$

- $\gamma_o$: 호브 리드 각 (hob lead angle)
- $N_o$: 호브 스레드 수
- $m_{no}$: 호브 법선 모듈 (normal module)
- $d_o$: 호브 피치 원 직경

**피치 값(pitch value)**: 나선이 1회전 동안 이동하는 축 방향 거리:

$$p = \pi \cdot m_{no}$$

**헬리컬 기어 가공 시 스위블 각(swivel angle)** $\eta$:

$$\eta = \gamma_o \pm \beta$$

- $\beta$: 기어 나선각 (helix angle)
- 동일 방향 나선: $-$, 반대 방향 나선: $+$
- **스퍼 기어의 경우**: $\eta = \gamma_o$ (리드 각만큼 틸트)

### 1.3 호브 기준 프로파일(Reference Profile) ★★★

호브의 법선 단면(normal section)은 기본 랙(basic rack) 치형이다.

**좌표 정의** (피치선을 원점으로):

| 구간 | X 좌표 | Y 좌표 | 설명 |
| --- | --- | --- | --- |
| 플랭크 (직선) | $\pm(h_f - t) \tan\alpha_n$ | $h_f - t$ | $t$: 피치선에서 거리 |
| 이끝 필릿 | $x_f + r_f \sin\theta$ | $y_f + r_f \cos\theta$ | $r_f$: 필릿 반경 |
| 이끝 평탄부 | $x_t$ | $h_a$ | 상수 |

여기서 $\alpha_n$: 법선 압력각, $h_a$: 어덴덤, $h_f$: 디덴덤.

**프로투버런스(protuberance) 설계**: 피치선 위 특정 높이에서 치형을 안쪽으로 오프셋하여 치근부(root)에 언더컷(pregrinding undercut)을 생성한다.

$$h_{pa} = h_a - h_{protu}$$

프로투버런스 구간에서 플랭크 압력각이 $\alpha_n$에서 $\alpha_{protu}$로 변환된다.

### 1.4 호브 3D 좌표 파라메트릭 방정식 ★★☆

호브 이면(tooth surface)의 법선 단면 좌표를 $(u, v)$로 파라메트릭 표현:

**법선 단면 플랭크 (involute-equivalent straight line)**:

$$\mathbf{R}_{hob}^{normal}(u) = \begin{pmatrix}
 u \tan\alpha_n \\
u \\
0 
\end{pmatrix}
$$

$u \in [-h_f, h_a]$

**나선 배치 (helix wrapping)**로 3D 좌표 변환:

$$\mathbf{r}_{hob}(u, \phi_h) = \begin{pmatrix}
 \left(\frac{d_o}{2} - u\right) \cos\phi_h \\
\left(\frac{d_o}{2} - u\right) \sin\phi_h \\
u \tan\alpha_n \sin\gamma_o + \phi_h \cdot \frac{p}{2\pi} \cos\gamma_o 
\end{pmatrix}
$$

- $\phi_h$: 호브 회전각 파라미터
- 나선 진행: 회전각에 따라 $z$축 방향으로 선형 이동

> **구현 주의**: 나선 배치 시 `cos(gamma_o)`와 `sin(gamma_o)` 보정 항을 정확히 넣어야 한다. 직교좌표계에서 나선각을 쿼터니언 회전으로 처리하면 수치 안정성이 향상된다.

### 1.5 호빙 인덱싱 — 창성 운동 수학 ★★★

**헬리컬 기어 호빙의 복합 인덱싱**:

$$\frac{n_{gear}}{n_{hob}} = \frac{N_o}{N_{gear}} \pm \frac{v_{feed} \cdot N_o}{\pi \cdot m_n \cdot N_{gear} \cdot \tan\beta}$$

- 우변 첫 항: 기본 인덱스 비율
- 우변 둘째 항: 나선 가공을 위한 차동(differential) 보정 항
- $v_{feed}$: 호브 축 방향 이송 속도, $\beta$: 기어 나선각

**변화 기어(change gear) 선택**:

$$\frac{a}{b} = \frac{K \cdot N_o}{N_{gear}}$$

$K$: 머신 상수 (통상 90 또는 40), 정수비로 근사.

---

## 2. 피니언 커터(Pinion Cutter / Shaper Cutter) 설계 수학

### 2.1 기본 원리

피니언 커터는 절삭 날을 가진 기어다. 커터-공작물 쌍은 **평기어 쌍(spur gear pair)과 수학적으로 동일**하게 동작한다.

**회전 비율**:

$$\frac{\phi_g}{\phi_c} = \frac{N_c}{N_g}$$

- $\phi_c$: 커터 회전각, $\phi_g$: 공작물(gear blank) 회전각
- $N_c$: 커터 이수, $N_g$: 가공할 기어 이수

**피치 원 반경**:

$$r_c = \frac{m \cdot N_c}{2}, \quad r_g = \frac{m \cdot N_g}{2}$$

**중심 거리**:

$$a = r_c + r_g \quad \text{(외접기어)}, \quad a = r_g - r_c \quad \text{(내접기어)}$$

### 2.2 커터 치형 프로파일 수학 ★★★

[Fetvaci 2010, Litvin vector 방법 기반]:

커터 치형은 6개 구간(region)으로 구성된다:

| Region | 형태 | 생성하는 기어 부위 |
| --- | --- | --- |
| 1, 6 | 인벌류트 곡선 | 기어 플랭크 (involute 부) |
| 2, 5 | 원호(circular arc) | 기어 필릿 (fillet) |
| 3, 4 | 직선 (topland) | 기어 이뿌리 평탄부 |

**커터 좌표계 $S_s$**에서 피치점 위치:

$$\mathbf{R}_{s} = r_s \begin{pmatrix}
 \cos\theta \\
\sin\theta 
\end{pmatrix}
$$

**$S_c$ (커터 중심 좌표계)로 변환**:

$$\mathbf{R}*{c}^{i} = \begin{pmatrix}
 \cos\psi_s & \sin\psi_s \\
-\sin\psi_s & \cos\psi_s 
\end{pmatrix} \mathbf{R}*{s}^{i}
$$

여기서 $\psi_s = \frac{\pi}{2N_s}$는 커터 이면 반각(half-tooth width angle).

**인벌류트 구간(Region 1) 위치 벡터** (커터 좌표계 $S_c$):

$$\mathbf{R}_{c}^{1} = \begin{pmatrix}
 r_b\cos(\delta - \psi) - r_b,\delta\sin(\delta - \psi) \\
r_b\sin(\delta - \psi) + r_b,\delta\cos(\delta - \psi) 
\end{pmatrix}
$$

- $r_b$: 커터 기초원(base circle) 반경, $r_b = r_c \cos\alpha$
- $\delta$: 인벌류트 파라미터 (involute curve parameter), $\delta \in [0, \delta_{max}]$
- $\psi$: 기초원 위 이두께 반각

**필릿 구간(Region 2) 위치 벡터**:

$$\mathbf{R}_{c}^{2} = \begin{pmatrix}
 x_A + r_f(\sin(\mu + \mu_0) - \sin\mu_0) \\
y_A - r_f(\cos(\mu + \mu_0) - \cos\mu_0) 
\end{pmatrix}
$$

- $(x_A, y_A)$: 인벌류트 구간 끝점 좌표
- $r_f$: 커터 이끝 필릿 반경 (tip fillet radius)
- $\mu$: 필릿 파라미터

**단위 법선 벡터** (기어링 이론에 필요):

$$\mathbf{n}_c^i = \frac{\partial \mathbf{R}_c^i / \partial l_j}{|\partial \mathbf{R}_c^i / \partial l_j|} \times \mathbf{k}_c$$

$\mathbf{k}_c$: Z축 단위 벡터

### 2.3 창성 운동 수학 ★★★

**좌표 변환 행렬** ($S_c$ → $S_g$):

$$\mathbf{M}_{gc} = \begin{pmatrix}
 \cos(\phi_g + \phi_c) & \sin(\phi_g + \phi_c) & -r_c\sin\phi_g \\
-\sin(\phi_g + \phi_c) & \cos(\phi_g + \phi_c) & r_c(1 - \cos\phi_g) \cdot \frac{r_c}{r_g} \cdot r_g \\
0 & 0 & 1 
\end{pmatrix}
$$

정확한 형태 [Fetvaci 2010, Eq.12]:

$$\mathbf{M}_{gc} = \begin{pmatrix}
 \cos(\phi_g + \phi_c) & \sin(\phi_g + \phi_c) & r_c\sin\phi_g - r_g\sin(\phi_g + \phi_c - \phi_g) \\
-\sin(\phi_g + \phi_c) & \cos(\phi_g + \phi_c) & -r_c\cos\phi_g + r_g\cos(\phi_g + \phi_c - \phi_g) \\
0 & 0 & 1 
\end{pmatrix}
$$

**롤링 구속 조건**:

$$\phi_g = \frac{N_c}{N_g} \cdot \phi_c$$

**기어 치형 궤적(locus)**:

$$\mathbf{R}*g^i(\delta, \phi_c) = \mathbf{M}*{gc}(\phi_c) \cdot \mathbf{R}_c^i(\delta)$$

### 2.4 맞물림 방정식(Equation of Meshing) ★★★

창성된 기어 표면은 다음 두 조건을 동시에 만족해야 한다:

1. **궤적 방정식**: $\mathbf{R}*g^i = \mathbf{M}*{gc} \cdot \mathbf{R}_c^i$
2. **맞물림 방정식**: 접촉점에서 공통 법선이 피치점(I)을 통과

맞물림 방정식 (커터 좌표계 $S_c$ 기준):

$$n_{cx}^i \cdot (Y_c^I - y_c^i) - n_{cy}^i \cdot (X_c^I - x_c^i) = 0$$

- $(X_c^I, Y_c^I) = (r_c\cos\phi_c,\, r_c\sin\phi_c)$: 피치점 I의 좌표
- $(x_c^i, y_c^i)$: 커터 표면 좌표
- $(n_{cx}^i, n_{cy}^i)$: 커터 법선 벡터 성분

> **구현 연결**: 파라미터 $\delta$와 $\phi_c$에 대해 위 두 방정식을 연립하여 풀면 기어 치형 좌표를 얻는다. Newton-Raphson 반복법으로 $(\delta, \phi_c)$ 쌍을 수치적으로 풀 수 있다.

### 2.5 에피트로코이드 필릿 궤적 ★★★

커터 이끝의 원형 모서리가 그리는 **에피트로코이드(epitrochoid)** 곡선이 기어 필릿을 결정한다.

**1차 트로코이드** (커터 이끝 원호 중심 $E$의 궤적):

$$\begin{pmatrix}
 x_T \\
y_T 
\end{pmatrix} = \begin{pmatrix}
 (r_c + r_g)\cos\phi_g - r_c\cos\left(\frac{r_c + r_g}{r_c}\phi_c + \phi_c\right) + x_E\cos(\phi_g + \phi_c) - y_E\sin(\phi_g + \phi_c) \\
(r_c + r_g)\sin\phi_g - r_c\sin\left(\frac{r_c + r_g}{r_c}\phi_c + \phi_c\right) + x_E\sin(\phi_g + \phi_c) + y_E\cos(\phi_g + \phi_c) 
\end{pmatrix}
$$

**2차 트로코이드** (실제 필릿 — 1차 트로코이드의 오프셋 곡선):

$$\begin{pmatrix}
 x_F \\
y_F 
\end{pmatrix} = \begin{pmatrix}
 x_T \\
y_T 
\end{pmatrix} + r_f \cdot \frac{(\dot{y}_T, -\dot{x}_T)}{\sqrt{\dot{x}_T^2 + \dot{y}_T^2}}
$$

$r_f$: 이끝 필릿 반경, $(\dot{x}_T, \dot{y}_T) = d(x_T, y_T)/d\phi_c$

### 2.6 세이핑(Shaping) 왕복 운동 수학

**왕복 운동** (Z축):

$$z(t) = A \sin(2\pi f_{stroke} \cdot t)$$

- $A$: 스트로크 진폭 (half-amplitude)
- $f_{stroke}$: 분당 왕복 스트로크 수 (strokes/min)

**창성 운동**: 롤링 없이 순수 왕복만으로는 치형이 생성되지 않는다. 스트로크당 커터-공작물 회전 증분:

$$\Delta\phi_c = \frac{2\pi}{N_c} \cdot \frac{f_{stroke}}{RPM_{feed}}$$

> **수치 안정성**: 왕복 운동의 상사점/하사점에서 속도=0이므로 창성 시뮬레이션 시 스텝 크기를 동적으로 조절해야 한다.

---

## 3. 랙 커터(Rack Cutter) 설계 수학

### 3.1 랙 커터 프로파일

랙은 피치 반경이 무한대인 기어다. 랙 커터 프로파일은 **직선 플랭크 + 원호 필릿**이다.

**플랭크 (2D 좌표)**:

$$\begin{pmatrix}
 x \\
y 
\end{pmatrix} = \begin{pmatrix}
 \pm(h_f - t)\tan\alpha_n \\
h_f - t 
\end{pmatrix}, \quad t \in [0, h_a + h_f]
$$

**필릿 구간** (이뿌리 전환부):

$$\begin{pmatrix}
 x_f \\
y_f 
\end{pmatrix} = \begin{pmatrix}
 x_{fillet} + r_{f0}\sin\theta \\
-h_f + r_{f0}(1 - \cos\theta) 
\end{pmatrix}, \quad \theta \in [0, \pi/2 - \alpha_n]
$$

$r_{f0}$: 이뿌리 필릿 반경 (standard: $r_{f0} \approx 0.38m$)

### 3.2 랙-기어 창성 운동학 ★★★

**랙 이송과 기어 회전의 롤링 조건**:

$$v_{rack} = r \cdot \dot{\phi}$$

- $v_{rack}$: 랙 커터의 직선 이동 속도 (m/s)
- $r$: 기어 피치원 반경
- $\dot{\phi}$: 기어 회전 각속도 (rad/s)

**창성된 기어 치형 좌표** (기어 고정 프레임 기준):

파라미터 $u$ (랙 프로파일 위치)와 $\phi$ (기어 회전각)에 대해:

$$\begin{pmatrix}
 x_g \\
y_g 
\end{pmatrix} = \begin{pmatrix}
 \cos\phi & -\sin\phi \\
\sin\phi & \cos\phi 
\end{pmatrix} \begin{pmatrix}
 x_{rack}(u) - r\phi \\
y_{rack}(u) - r 
\end{pmatrix}
$$

**맞물림 조건** (랙-기어 접촉):

$$n_{rack,x} \cdot (x_{rack} - r\phi) + n_{rack,y} \cdot y_{rack} = 0$$

$\phi$를 $u$의 함수로 풀어 좌표를 구한다.

### 3.3 전위 가공(Profile Shift)의 수학적 표현 ★★★

전위 계수 $x$를 도입하면 랙 커터를 $x \cdot m$ 만큼 외측으로 이동:

**전위된 기어의 피치원 반경** (변화 없음):

$$r = \frac{m \cdot N}{2}$$

**전위 후 이두께** (피치원 위):

$$s = \frac{\pi m}{2} + 2xm\tan\alpha$$

**언더컷 방지를 위한 최소 전위 계수**:

$$x_{min} = \frac{N_{min} - N}{N_{min}}, \quad N_{min} = \frac{2h_a^*}{\sin^2\alpha}$$

표준 기어 ($h_a^* = 1$, $\alpha = 20°$):

$$N_{min} = \frac{2}{\sin^2 20°} \approx 17.1 \approx 17\text{개}$$

$$x_{min} = \frac{17 - N}{17} \quad (N < 17\text{일 때})$$

예: $N = 10$이면 $x_{min} \approx 0.41$

---

## 3A. 파워 스키빙(Power Skiving) 공구 설계 수학

### 3A.1 기본 원리와 운동학

파워 스키빙은 세이핑(shaping)과 호빙(hobbing)의 장점을 결합한 **연속 창성 가공법**이다. 공구와 공작물이 **교차축(crossed axes)** 상에서 동기 회전하며, 교차축 각도가 절삭 속도를 생성한다.

**핵심 차이점**: 세이핑이 평행축 + 왕복 운동으로 절삭하는 반면, 파워 스키빙은 교차축 + 연속 회전으로 절삭한다. 왕복 운동이 없어 **비절삭 시간이 제거**된다.

**축교차각(Crossed Axis Angle / Shaft Angle)** $\Sigma$:

$$\Sigma = \beta_t + \beta_w \quad \text{(동일 방향 나선)}, \quad \Sigma = \beta_t - \beta_w \quad \text{(반대 방향 나선)}$$

- $\beta_t$: 공구 나선각 (tool helix angle)
- $\beta_w$: 공작물 나선각 (workpiece helix angle)
- 스퍼 기어 가공 시: $\Sigma = \beta_t$ (공구 나선각이 곧 축교차각)

> **실용 범위**: $\Sigma = 10° \sim 25°$ (내접기어 가공 시 통상 $20°$). 이론적 최대 $45°$이나, 큰 각도일수록 공구 프로파일 비대칭이 심화되어 여유각 확보가 어렵다.

### 3A.2 절삭 속도(Cutting Speed) ★★★

축교차각이 절삭 속도를 결정한다. 공구-공작물 접촉점에서의 상대 속도 벡터 분해:

$$v_c = \frac{\pi \cdot D_{t,maj} \cdot n_1 \cdot \sin\Sigma}{1000 \cdot \cos\beta}$$

- $v_c$: 절삭 속도 [m/min]
- $D_{t,maj}$: 공구 이끝원 직경 [mm]
- $n_1$: 공구 회전수 [RPM]
- $\Sigma$: 축교차각
- $\beta$: 나선각 (helix angle)

**역산 — 목표 절삭 속도에서 공구 RPM 결정**:

$$n_1 = \frac{1000 \cdot v_c \cdot \cos\beta}{\pi \cdot D_{t,maj} \cdot \sin\Sigma}$$

[Gear Technology, Gear Skiving — A Step Changing Manufacturing Process]

**공작물 RPM** (동기 회전 조건):

$$n_2 = n_1 \cdot \frac{z_t}{z_g}$$

- $z_t$: 공구 이수, $z_g$: 공작물 이수

> **축교차각이 0이면 절삭 속도도 0이다** — 이것이 세이핑에서 왕복 운동이 필수적인 근본 이유이며, 파워 스키빙에서 교차축 배치가 필수인 이유이다.

### 3A.3 좌표계와 좌표 변환 ★★★

파워 스키빙은 3개의 좌표계를 사용한다 [Wang et al. 2021, Conjugate Surface Theory]:

- $S_1(o_1, x_1, y_1, z_1)$: **공작물 좌표계** — $z_1$축 = 공작물 회전축
- $S_2(o_2, x_2, y_2, z_2)$: **공구 좌표계** — $z_2$축 = 공구 회전축, $z_1$과 $z_2$ 사이 각도 = $\Sigma$
- $S_f$: **고정 프레임** (기계 좌표계)

**좌표 변환 행렬** ($S_1 \to S_2$):

$$\mathbf{M}_{S1 \to S2} = \mathbf{M}_{S2 \leftarrow t} \cdot \mathbf{M}_{cross} \cdot \mathbf{M}_{S1 \leftarrow w}$$

분해하면:

$$\mathbf{M}_{S1 \leftarrow w} = \text{Rot}(\mathbf{k}, \phi_w)$$

$$\mathbf{M}_{cross} = \text{Rot}(\mathbf{i}, \Sigma) \cdot \text{Tran}(\mathbf{i}, e_x) \cdot \text{Tran}(\mathbf{j}, e_y) \cdot \text{Tran}(\mathbf{k}, v_0 t)$$

$$\mathbf{M}_{S2 \leftarrow t} = \text{Rot}(\mathbf{k}, \phi_t)$$

- $\phi_w$, $\phi_t$: 공작물·공구 회전각
- $e_x$, $e_y$: 중심 거리(center distance)의 $x$, $y$ 성분
- $v_0 t$: 축 방향 이송(axial feed)에 의한 $z$ 방향 이동
- $\text{Rot}$, $\text{Tran}$: 회전·이동 변환 행렬

**롤링 구속 조건** (동기 회전):

$$\phi_w = \frac{z_t}{z_g} \cdot \phi_t$$

**축교차각에 의한 좌표 변환 행렬** $\text{Rot}(\mathbf{i}, \Sigma)$:

$$\text{Rot}(\mathbf{i}, \Sigma) = \begin{pmatrix}
 1 & 0 & 0 & 0 \\
0 & \cos\Sigma & -\sin\Sigma & 0 \\
0 & \sin\Sigma & \cos\Sigma & 0 \\
0 & 0 & 0 & 1 
\end{pmatrix}
$$

### 3A.4 공구 형상 설계 — 켤레면(Conjugate Surface) 방법 ★★★

파워 스키빙 공구의 절삭날(cutting edge) 설계는 **켤레면 이론**에 기반한다.

**설계 절차**:

1. **가상 켤레면(Virtual Conjugate Surface)** 도출: 교차축 조건에서 목표 기어 치면과 켤레 관계를 만족하는 공구 치면을 구한다.
2. **레이크면(Rake Face)** 정의: 공구 전면(front face)의 기하학적 형상을 정의한다.
3. **절삭날** = 켤레면 ∩ 레이크면: 두 곡면의 교선이 실제 절삭날이 된다.

**켤레면 조건** (맞물림 방정식):

$$\mathbf{N}_2 \cdot \mathbf{v}_{rel}^{(12)} = 0$$

- $\mathbf{N}_2$: 공구 표면의 법선 벡터 (기어 프레임 기준)
- $\mathbf{v}_{rel}^{(12)}$: 공구-공작물 상대 속도 벡터

이를 전개하면:

$$\mathbf{v}_{rel}^{(12)} = \boldsymbol{\omega}_1 \times \mathbf{r}_1 - \boldsymbol{\omega}_2 \times \mathbf{r}_2 + \mathbf{v}_{feed}$$

- $\boldsymbol{\omega}_1$, $\boldsymbol{\omega}_2$: 공작물·공구 각속도 벡터 (**교차축이므로 비평행**)
- $\mathbf{r}_1$, $\mathbf{r}_2$: 접촉점의 위치 벡터
- $\mathbf{v}_{feed}$: 축 방향 이송 속도 벡터

> **세이핑과의 핵심 차이**: 세이핑에서는 $\boldsymbol{\omega}_1 \parallel \boldsymbol{\omega}_2$ (평행축)이므로 상대 속도가 접선 방향뿐이다. 파워 스키빙에서는 교차축으로 인해 **축 방향 성분**이 추가되어 절삭이 발생한다.

**배럴형 켤레면(Barrel-Shaped Conjugate Surface)**: 교차축 조건에서 내접기어와 켤레인 공구 치면은 **중앙이 볼록하고 양단이 좁은 배럴(barrel) 형상**이 된다. 이는 호브의 원통형 치면이나 세이퍼 커터의 원추형 치면과 구별되는 파워 스키빙 공구의 고유 특성이다.

### 3A.5 절삭날 프로파일의 비대칭성 ★★★

축교차각과 레이크각의 결합 효과로, 파워 스키빙 공구의 절삭날 프로파일은 **좌우 비대칭**이다.

**비대칭 원인**:

- 축교차각 $\Sigma$에 의해 좌우 플랭크에서 상대 속도 방향이 다름
- 공구 축 방향 오프셋 $z_{off}$
- 기하학적 레이크각 $\gamma_0$

**결과**:

- 좌측 플랭크(leading flank)와 우측 플랭크(trailing flank)의 여유각(clearance angle)이 다르다
- 한쪽 플랭크에서 **음(negative) 여유각**이 발생할 수 있으며, 이 경우 간섭(interference)을 일으켜 가공 불가

**여유각 확보 조건**: 절삭날 위 모든 점에서 작용 여유각(working clearance angle)이 양(positive)이어야 한다:

$$\alpha_{w,i} > 0 \quad \forall \text{ point } i \text{ on cutting edge}$$

### 3A.6 작용 레이크각·여유각 해석 ★★☆

파워 스키빙 공구의 작용각(working angle)은 **절삭날 위 위치**와 **절삭 진행 순간**에 따라 모두 변한다 [Tsai, 2016, Mechanism and Machine Theory].

**ISO 기준면 체계** (ISO 3002-1):

- **기준면(reference plane) $P_r$**: 절삭 속도 벡터에 수직
- **절삭면(cutting plane) $P_s$**: 절삭날 접선과 절삭 속도 벡터를 포함
- **법선면(normal plane) $P_n$**: $P_r$과 $P_s$에 모두 수직

**작용 레이크각(working rake angle)** $\gamma_w$:

$$\gamma_w = \arcsin\left(\frac{\mathbf{n}_{rake} \cdot \mathbf{v}_c}{|\mathbf{v}_c|}\right)$$

- $\mathbf{n}_{rake}$: 레이크면의 외향 법선 벡터
- $\mathbf{v}_c$: 절삭 속도 벡터

**작용 여유각(working clearance angle)** $\alpha_w$:

$$\alpha_w = \frac{\pi}{2} - \arccos\left(\frac{\mathbf{n}_{flank} \cdot \mathbf{v}_c}{|\mathbf{n}_{flank}| \cdot |\mathbf{v}_c|}\right)$$

- $\mathbf{n}_{flank}$: 공구 플랭크면(flank face)의 법선 벡터

> **구현 주의**: 작용각 해석에는 각 절삭 시점별로 변환 행렬을 재계산해야 한다. 절삭날 위 $n$개 점에 대해 $\phi_t$ 범위 전체를 순회하며 $\gamma_w$, $\alpha_w$를 계산하는 루프가 필요하다.

### 3A.7 세이퍼 커터 기반 스키빙 공구 설계 ★★☆

실용적 접근법으로, 기존 **세이퍼 커터(shaper cutter)**를 파워 스키빙 공구로 전용할 수 있다 [Guo et al., 2015]:

**방법**: 세이퍼 커터에 대해 **중심 거리 보정($\Delta a$)**, **축교차각 보정($\Delta\Sigma$)**, **공작물 회전각 보정($\Delta\phi_w$)** 세 가지 상수 오프셋을 적용한다.

$$a' = a + \Delta a, \quad \Sigma' = \Sigma + \Delta\Sigma, \quad \phi_w' = \phi_w + \Delta\phi_w$$

이 오프셋들은 세이퍼 커터의 프로파일과 목표 기어 치형 사이의 오차를 최소화하도록 최적화한다. 전용 스키빙 공구 대비 정밀도는 떨어지나, **기존 공구 재활용**이 가능하다.

### 3A.8 내접기어 가공에서의 간섭 회피 ★★★

내접기어 파워 스키빙에서 가장 중요한 설계 제약은 **공구-공작물 간섭(interference)**이다.

**간섭 유형**:

1. **이끝 간섭(tip interference)**: 공구 이끝이 공작물 이뿌리를 넘어 파고듦
2. **이뿌리 간섭(root interference)**: 공구 이뿌리가 공작물 이끝과 충돌
3. **이면 간섭(flank interference)**: 공구가 가공된 치면을 2차 절삭

**간섭 회피를 위한 공구 이수 범위**:

$$z_{t,min} < z_t < z_{t,max}$$

- $z_{t,min}$: 이끝 간섭 방지를 위한 최소 이수 (너무 적으면 공구 이끝이 너무 큼)
- $z_{t,max}$: 공구-공작물 이뿌리 간섭 방지를 위한 최대 이수

**수치 판별법**: 공구 치형의 모든 점을 공작물 좌표계로 변환한 후, 공작물 치형과의 간섭 여부를 확인:

```python
def check_skiving_interference(tool_profile, gear_profile, M_transform, phi_range, n_phi=2000):
    """파워 스키빙 간섭 판별"""
    for phi_t in np.linspace(phi_range[0], phi_range[1], n_phi):
        M = M_transform(phi_t)
        tool_in_gear = M @ tool_profile  # 공구 좌표 → 공작물 좌표
        # 공구 점이 공작물 치형 내부에 있으면 간섭
        if any_point_inside(tool_in_gear, gear_profile):
            return True, phi_t  # 간섭 발생, 해당 각도 반환
    return False, None
```

### 3A.9 가공 파라미터

**이송**: 공작물 1회전당 축 방향 이동량:

$$f_a \text{ [mm/rev of workpiece]}$$

**가공 시간**: 축 방향 이동 거리 $L = b + \text{approach} + \text{overtravel}$:

$$T = \frac{L \cdot N_{pass}}{f_a \cdot n_2} \quad \text{[min]}$$

- $N_{pass}$: 다중 패스 수 (통상 3\~8 패스)
- $n_2$: 공작물 RPM

**이끝 바닥 여유(clearance at root)**:

$$\text{clearance} = r_{tool} \cdot \sin\Sigma + \Delta_{overtravel}$$

### 3A.10 세이핑·호빙과의 비교

| 항목 | 호빙(Hobbing) | 세이핑(Shaping) | 파워 스키빙(Power Skiving) |
| --- | --- | --- | --- |
| 축 배치 | 교차축 (~90°) | 평행축 | 교차축 (10°~25°) |
| 절삭 운동 | 연속 회전 | 왕복(reciprocating) | 연속 회전 |
| 내접기어 | 불가 | 가능 | 가능 |
| 숄더 근접 가공 | 제한적 | 가능 | 가능 (오버트래블 최소) |
| 가공 시간 (상대) | 1× | 3~5× | 0.3~0.5× (세이핑 대비) |
| 공구 프로파일 | 원통형 나선 | 원추형 (여유각) | 배럴형 (비대칭) |
| 기계 강성 요구 | 중 | 저 | 고 (연속 절삭력) |

---

## 4. 기어 가공 공통 수학

### 4.1 포락선(Envelope) 이론 ★★★

**기본 개념**: 시간 파라미터 $t$에 따라 변하는 곡선족(family of curves) $F(x, y, t) = 0$의 포락선은:

$$F(x, y, t) = 0 \quad \text{와} \quad \frac{\partial F}{\partial t}(x, y, t) = 0$$

의 연립방정식으로 구한다.

**3D 곡면족의 포락선** (Litvin, 1994):

$\mathbf{r}_2(u, v, \phi)$가 공구 표면의 기어 프레임에서의 좌표일 때, 포락선(생성된 기어 치형) 조건:

$$\det\left[\frac{\partial \mathbf{r}_2}{\partial u},\, \frac{\partial \mathbf{r}_2}{\partial v},\, \frac{\partial \mathbf{r}_2}{\partial \phi}\right] = 0$$

이를 **맞물림 방정식(equation of meshing)**이라 한다:

$$\mathbf{N}*2 \cdot \mathbf{v}*{rel}^{(12)} = 0$$

- $\mathbf{N}_2$: 공구 표면의 법선 벡터
- $\mathbf{v}_{rel}^{(12)}$: 공구-기어 상대 속도

> **수치 구현**: 포락선을 직접 해석적으로 구하기 어려울 때는 **이산화 시뮬레이션(discretized simulation)** 사용: 공구를 충분히 작은 회전 단계로 이동하면서 부울 차집합(Boolean subtraction)으로 재료 제거를 시뮬레이션한다.

### 4.2 접촉선(Line of Action)과 작용 압력각 ★★★

**인벌류트 기어 쌍의 작용 압력각** $\alpha_w$:

$$\cos\alpha_w = \frac{r_{b1} + r_{b2}}{2a_w}$$

$$\text{invol}(\alpha_w) = \text{invol}(\alpha) + \frac{2(x_1 + x_2)\tan\alpha}{N_1 + N_2}$$

여기서 $\text{invol}(\alpha) = \tan\alpha - \alpha$ (rad).

**접촉선**: 두 기초원의 공통 접선, 피치점에서 $\alpha_w$ 기울기.

**접촉비(contact ratio)**:

$$\varepsilon_\alpha = \frac{g_\alpha}{p_b}$$

$$g_\alpha = \sqrt{r_{a1}^2 - r_{b1}^2} + \sqrt{r_{a2}^2 - r_{b2}^2} - (r_1 + r_2)\sin\alpha_w$$

$$p_b = \pi m \cos\alpha$$

### 4.3 언더컷(Undercut) 발생 조건 ★★★

**랙 커터 가공 시 언더컷 조건**: 커터 이끝이 기어 기초원 아래로 파고들 때 발생.

접촉선의 한계점(interference point)이 기초원 접점보다 안쪽에 있을 때:

$$h_a^* \leq x + \frac{N\sin^2\alpha}{2}$$

위 조건 위반 시 언더컷 발생. 위반 없을 조건:

$$x \geq h_a^* - \frac{N\sin^2\alpha}{2}$$

**피니언 커터 가공 시 최소 이수** [Shigley 기계설계]:

$$N_{min} = \frac{2k}{(1 + \frac{1}{m_G})\sin^2\phi}\left(m_G + \sqrt{m_G^2 + (1 + 2m_G)\sin^2\phi}\right)$$

- $k$: 이높이 계수 (full depth: $k=1$)
- $m_G$: 기어비 $N_g/N_c$
- $\phi$: 압력각

### 4.4 절삭 간섭(Cutting Interference) 판별 ★★☆

호브/랙 커터 이끝과 기어 치형의 간섭(interference):

**기초원 아래 한계점**:

$$r_{limit} = r\sin\alpha$$

**공구 이끝이 한계점을 넘지 않는 조건**:

$$\frac{h_a^*}{1} \leq x + \frac{N}{2}\sin^2\alpha$$

**수치 판별법**: 공구 이끝의 좌표를 기어 좌표계로 변환 후 기초원 반경과 비교:

```python
def check_interference(h_a_star, x_shift, N, alpha_rad):
    """언더컷 발생 여부 판별"""
    limit = h_a_star - (N / 2) * (math.sin(alpha_rad))**2
    if x_shift >= limit:
        return False  # 언더컷 없음
    else:
        return True   # 언더컷 발생, x_min 필요
```

---

## 5. 이두께 측정 수학

### 5.1 스팬(Span) 측정 ★★★

스패너 마이크로미터로 $k$개 이에 걸친 법선 방향 치폭 $W$를 측정:

**스퍼 기어**:

$$W = m\cos\alpha \left[\pi(k - 0.5) + N \cdot \text{invol}(\alpha)\right] + 2xm\sin\alpha$$

**$k$ 최적값** (이끝 밖으로 나오지 않는 최대 $k$):

$$k_{max} = \frac{N}{\pi}\left(\frac{\pi}{2} - \text{invol}(\alpha) - \frac{2x\tan\alpha}{N}\right) + 0.5$$

$k = \text{round down}(k_{max})$

**헬리컬 기어 (법선 평면 측정)**:

$$W_n = m_n\cos\alpha_n \left[\pi(k - 0.5) + N_v \cdot \text{invol}(\alpha_n)\right]$$

- $N_v = N / \cos^3\beta$: 가상 이수(virtual number of teeth)
- $\beta$: 나선각

### 5.2 오버핀(Over-Pin) 측정 ★★★

직경 $d_p$인 핀/볼을 이골에 삽입하여 외경을 측정.

**이상적 핀 직경** ($d+2xm$ 원에서 접선):

$$d_{p,ideal} = \frac{m\cos\alpha}{\cos\alpha_d} \cdot \frac{\pi}{N}$$

여기서 $\alpha_d$는 핀 접촉점에서의 압력각:

$$\text{invol}(\alpha_d) = \frac{d_p}{m N\cos\alpha} - \text{invol}(\alpha) + \frac{\pi}{N} + \frac{2x\tan\alpha}{N}$$

**짝수 이수 기어의 오버핀 치수 $M$**:

$$M = d\cos\alpha / \cos\alpha_d + d_p$$

**홀수 이수 기어**:

$$M = d\cos\alpha \cdot \cos\frac{90°}{N} / \cos\alpha_d + d_p$$

---

## 6. 가공 파라미터 계산

### 6.1 호빙(Hobbing) 가공 파라미터

**절삭 속도 (hob peripheral speed)**:

$$V_c = \frac{\pi D_h n_h}{1000} \quad \text{[m/min]}$$

$D_h$: 호브 직경 [mm], $n_h$: 호브 회전수 [RPM]

**축 방향 이송**:

$$f_{axial} = f_a \cdot n_h \quad \text{[mm/rev of workpiece]}$$

통상 $f_a = 0.5 \sim 3.0$ mm/rev (기어 모듈에 따라)

**가공 시간** (축 방향 이동 거리 $L = b + \text{approach}$):

$$T = \frac{L}{f_{axial} \cdot n_w} \quad \text{[min]}$$

$n_w$: 공작물 RPM = $n_h \cdot N_o / N$

### 6.2 세이핑(Shaping) 가공 파라미터

**왕복 스트로크 수**: $v_c$ strokes/min

**원주 방향 이송**: $f_r$ mm/stroke (rotary feed per stroke)

**반경 방향 절입**: 총 절입량 $h = h_a + h_f + \text{backlash allowance}$ → 수 패스로 나눠 절입 (예: 3단계)

**최적 스트로크 속도**:

- 소형 기어 (m ≤ 3): 400\~600 strokes/min
- 중형 기어 (m 3\~6): 200\~400 strokes/min

**표면 거칠기 예측** (경험식 기반):

$$R_a \approx C \cdot f_r^{1.5} \cdot V_c^{-0.5}$$

$C$: 재료 및 공구 상수. 실험적으로 결정. [인접 도메인: 선삭(turning)] 단일 날 공구 이론: $R_a = f^2 / (8r_\varepsilon)$이 유사 구조이나, 기어 세이핑은 다중 날 창성 공정이므로 직접 적용 불가. 예측 정확도 ±30% 수준.

---

## 7. 구현 참고사항

### 7.1 수치 안정성

| 문제 상황 | 권고 대처 |
| --- | --- |
| 포락선 파라미터 $\phi$→0에서 특이점 | $\phi$ 범위를 $[\epsilon, \phi_{max}]$로 제한 |
| 인벌류트 함수 invol$(\alpha) = \tan\alpha - \alpha$ | 소각도에서 테일러 전개: $\approx \alpha^3/3$ |
| 맞물림 방정식 연립 풀기 | Newton-Raphson 초기값으로 해석해 사용 |
| 좌표 변환 누적 오차 | 각도 대신 쿼터니언 사용 권고 |
| 이산화 시뮬레이션 해상도 | 최소 360°/1000 이상의 각도 스텝 권고 |

### 7.2 구현 순서 권고

기어 시뮬레이션 앱 구현 시 권고 순서:

1. **기본 인벌류트 프로파일** 구현 (Researcher 1 담당)
2. **랙 커터 프로파일** 구현 (가장 단순) → 플랭크: 직선, 필릿: 원호
3. **포락선 이산화 엔진** 구현 → 랙의 $n$개 위치에서 부울 차집합 → 기어 치형
4. **피니언 커터** 구현 → 맞물림 방정식 + 2차 트로코이드 필릿
5. **호브** 구현 → 3D 나선 치형 + 축 방향 이송 포함
6. **스키빙 커터** 구현 → 교차축 좌표 변환 + 켤레면 도출 + 비대칭 프로파일 + 간섭 판별

### 7.3 주요 구현 함수 목록

```python
def involute(alpha):
    """인벌류트 함수"""
    return math.tan(alpha) - alpha

def inv_involute(y, alpha0=0.3):
    """역인벌류트 (뉴턴법)"""
    alpha = alpha0
    for _ in range(50):
        f = involute(alpha) - y
        df = math.tan(alpha)**2  # d/dalpha(tan(alpha) - alpha)
        alpha -= f / df
        if abs(f) < 1e-12:
            break
    return alpha

def rack_profile(m, alpha_n, h_a_star, h_f_star, rho_f, x_shift, n_pts=100):
    """랙 커터 프로파일 좌표 생성"""
    # 플랭크 + 필릿 좌표 반환
    ...

def envelope_generate(tool_profile_fn, r_gear, N_gear, phi_range, n_phi=1000):
    """포락선 이산화 시뮬레이션"""
    # 공구 프로파일의 phi별 기어 좌표 변환 후 내부 경계 추출
    ...

def span_measurement(m, alpha, N, x, k):
    """스팬 측정값 계산"""
    inv_alpha = involute(alpha)
    W = m * math.cos(alpha) * (math.pi * (k - 0.5) + N * inv_alpha) + 2 * x * m * math.sin(alpha)
    return W

def over_pin_measurement(m, alpha, N, x, d_p):
    """오버핀 측정값 계산 (짝수 이수)"""
    d = m * N
    r_b = d / 2 * math.cos(alpha)
    # 역인벌류트로 alpha_d 계산
    y = d_p / (m * N * math.cos(alpha)) - involute(alpha) + math.pi / N + 2 * x * math.tan(alpha) / N
    alpha_d = inv_involute(y)
    M = d * math.cos(alpha) / math.cos(alpha_d) + d_p
    return M
```

### 7.4 반증 탐색 결과

**"이산화 시뮬레이션이 해석적 방법보다 항상 정확하다"는 주장에 대한 반증**: 이산화 시뮬레이션은 스텝 크기에 따라 필릿 형상 정밀도가 제한된다. Fetvaci(2010)와 같은 해석적 방법(맞물림 방정식 + 트로코이드)은 수치 해상도와 무관하게 정확한 필릿 형상을 제공한다. 따라서 **필릿 응력 해석**이 목적이라면 해석적 방법이 필수적이다.

**반증 미발견**: "17개 미만 이수에서는 반드시 언더컷이 발생한다"는 통설. 단, 25° 압력각이나 스텁 이 (stub tooth)는 예외.

---

## 8. 관점 확장 / 문제 재정의

### 8.1 숨은 변수

1. **재연삭(resharpening) 효과**: 피니언 커터와 호브는 사용에 따라 이끝 원이 작아진다. 재연삭 후 커터 파라미터가 변화하므로 전위 계수를 보정해야 한다. 시뮬레이션 앱에서 이를 모델링할 경우 가공 품질 예측 정확도가 크게 향상된다.

2. **온도 변형**: 고속 호빙 시 공작물 온도가 15\~30°C 상승하여 치형이 미세하게 팽창한다. 정밀 기어(DIN 5\~6급 이상)에서는 열팽창 보정이 필요하다.

### 8.2 이질 도메인 유추

[이질 도메인: 컴퓨터 그래픽스 / 음함수 곡면 렌더링] 포락선 이론의 이산화 구현은 **SDF(Signed Distance Field)** 기반 부울 연산과 구조적으로 동일하다. Ray marching 기법을 기어 시뮬레이션에 차용하면 GPU 병렬화로 실시간 창성 애니메이션 구현이 가능하다.

### 8.3 문제 재정의

> 원래 질문: "기어 가공 공구 설계 수학" 더 적절한 핵심 질문: **"주어진 기어 사양(모듈, 이수, 전위 계수, 나선각)에서 각 공구 유형별로 (1) 공구 좌표 생성, (2) 창성 운동 시뮬레이션, (3) 필릿 형상 예측을 단일 수식 파이프라인으로 구현하는 방법은?"**

이 관점으로 확장하면 가공 공구뿐 아니라 **공구 마모 모델**과 **가공 치형 오차 예측**까지 시뮬레이터의 범위를 자연스럽게 넓힐 수 있다.

---

## 출처 목록

| 번호 | 출처 | 확신도 | 내용 |
| --- | --- | --- | --- |
| 1 | Fetvaci, C. (2010). "Generation Simulation of Involute Spur Gears Machined by Pinion-Type Shaper Cutters." *Strojniški vestnik - Journal of Mechanical Engineering*, 56(10), 644-652. | ★★★ | 피니언 커터 수학 모델 전체, Litvin 벡터법 적용 |
| 2 | Bergseth, E. (2011). "Virtual Hobbing." KTH Machine Design, DIVA-489822. URL: https://www.diva-portal.org/smash/get/diva2:489822/FULLTEXT01.pdf | ★★★ | 호브 리드각, 스위블각, CAD 기반 호빙 시뮬레이션 |
| 3 | Litvin, F.L. & Fuentes, A. (2004). *Gear Geometry and Applied Theory* (2nd ed.). Cambridge University Press. (NASA 보고서 버전 참조) | ★★★ | 포락선 이론, 맞물림 방정식 |
| 4 | Gearsolutions.com, "A Novel Hob Design for Precision Involute Gears Part I." URL: https://gearsolutions.com/features/a-novel-hob-design-for-precision-involute-gears-part-i/ | ★★☆ | 호브 기초 나선각, 재연삭 보정 |
| 5 | KHK Gears Technical Reference, "Tooth Thickness." URL: https://khkgears.net/new/gear_knowledge/gear_technical_reference/tooth-thickness.html | ★★★ | 스팬 측정, 오버핀 측정 공식 |
| 6 | KHK USA / Gear Solutions, "Determining Tooth Thickness Part II, III." URL: https://khkgears.us | ★★★ | 스팬, 오버핀 측정 수식 상세 |
| 7 | ASME Journal of Manufacturing Science (2018), "Virtual Model of Gear Shaping — Part I: Kinematics." Vol.140, 071007. | ★★★ | 세이핑 운동학, 좌표 변환 |
| 8 | Gearsolutions.com, "Envelope Surfaces in Gear Design and Gear Machining." URL: https://gearsolutions.com/features/envelope-surfaces-in-the-gear-design-and-in-the-gear-machining-processes/ | ★★☆ | 포락선 이론 응용 |
| 9 | IJRAT (2018), "Optimization of Cutting Parameters for Surface Roughness of Gear Shaping." | ★☆☆ | 세이핑 표면 거칠기 경험식 |
| 10 | Perplexity 합성 답변 (2026-04-01) — 호빙 인덱싱, 언더컷 조건, 기초 수식 | ★★☆ | 다수 출처 합성, 원문 교차 확인 필요 |
| 11 | Tsai, C.-Y. (2016). "Mathematical model for design and analysis of power skiving tool for involute gear cutting." *Mechanism and Machine Theory*, 101, 195-208. | ★★★ | 파워 스키빙 공구 수학 모델, 켤레면 이론, 작용각 해석 |
| 12 | Wang, P. et al. (2021). "Research on the Cutting Principle and Tool Design of Gear Skiving Based on the Theory of Conjugate Surface." *Mathematical Problems in Engineering*, 2021, 5469020. | ★★★ | 켤레면 기반 공구 설계, 좌표 변환 행렬 |
| 13 | Guo, E. et al. (2015). "A novel power skiving method using the common shaper cutter." *Proceedings of the IMechE Part B*, 229(10), 1714-1726. | ★★☆ | 세이퍼 커터 전용 스키빙, 오프셋 보정법 |
| 14 | Gear Technology (2021). "Gear Skiving — A Step Changing Manufacturing Process Applicable to Multifunctional 5-Axis Machine Tools." URL: https://www.geartechnology.com/gear-skiving-a-step-changing-manufacturing-process-applicable-to-multifunctional-5-axis-machine-tools | ★★★ | 절삭 속도 공식, RPM 계산, 축교차각 운동학 |
| 15 | Tsai, C.-Y. (2021). "Power-skiving tool design method for interference-free involute internal gear cutting." *Mechanism and Machine Theory*, 164, 104396. | ★★★ | 내접기어 간섭 회피, 여유각 재설계 |
| 16 | EMAG (2022). "Power hobbing vs. power skiving — Comparison." URL: https://www.emag.com/blog/en/differences-between-hobbing-skiving-and-power-skiving/ | ★★☆ | 축교차각 범위, 절삭 속도-벡터 관계, 프로세스 비교 |

---

*작성: Researcher 3 (기어 가공 공구 설계 수학)저장 경로:* `docs/research/2026-04-01-gear-design-mathematics/03-gear-cutting-tool-design.md`