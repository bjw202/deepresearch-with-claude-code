# 기어 유형별 3D 형상 수학 (Gear Types 3D Geometry Mathematics)

**Researcher 2 산출물** | 2026-04-01
**핵심 질문**: 기어 시뮬레이션 앱 구현에 필요한 기어 유형별 3D 좌표 생성 수학
**조사 범위**: 스퍼/헬리컬/베벨/내접 기어의 3D 좌표 생성 수학, 3D 모델링 알고리즘
**비범위**: 인벌류트 기초(Researcher 1 담당), 공구 설계(Researcher 3 담당), 메쉬 시뮬레이션, FEA

---

## 1. 개요

기어 3D 형상 생성은 다음 단계로 구성된다:

1. **2D 치형 프로파일 생성**: 인벌류트 곡선 + 루트 필렛(트로코이드) + 이끝원호
2. **3D 솔리드 변환**: 압출(extrusion), 스윕(sweep), 로프트(loft)
3. **메쉬 생성**: 삼각분할(tessellation) → 법선 벡터 계산
4. **부가 형상**: 보어(bore), 키홈(keyway), 챔퍼(chamfer)

기어 유형에 따라 "2D → 3D" 변환 방법이 달라진다는 점이 핵심이다.

---

## 2. 스퍼 기어 (Spur Gear) 3D 형상

### 2.1 기본 파라미터 및 치수 계산

| 파라미터 | 기호 | 수식 | 단위 |
|---------|------|------|------|
| 모듈 | $m$ | 입력 | mm |
| 잇수 | $z$ | 입력 | - |
| 압력각 | $\alpha$ | 보통 20° | deg |
| 피치원 반지름 | $r$ | $r = \frac{mz}{2}$ | mm |
| 기초원 반지름 | $r_b$ | $r_b = r \cos\alpha$ | mm |
| 이끝원 반지름 | $r_a$ | $r_a = r + m$ | mm |
| 이뿌리원 반지름 | $r_f$ | $r_f = r - 1.25m$ | mm |
| 이끝 높이 | $h_a$ | $h_a = m$ | mm |
| 이뿌리 높이 | $h_f$ | $h_f = 1.25m$ | mm |

★★★ [KHK Gear Technical Reference, 2017] https://khkgears.net/new/gear_knowledge/gear_technical_reference/calculation_gear_dimensions.html

### 2.2 인벌류트 치형 좌표 (2D)

인벌류트 파라메트릭 방정식:

$$x(\phi) = r_b(\cos\phi + \phi\sin\phi)$$
$$y(\phi) = r_b(\sin\phi - \phi\cos\phi)$$

여기서 $\phi$는 전개각(roll angle, radian)이다. $\phi = 0$이 기초원 접점.

**한 치의 우측 플랭크 생성 알고리즘**:

```python
import numpy as np

def involute_coords(r_b, phi_min, phi_max, n_points=50):
    """인벌류트 좌표 생성
    r_b: 기초원 반지름
    phi_min: 기초원(이뿌리) 쪽 시작 각도 (보통 0)
    phi_max: 이끝원에 해당하는 각도
    """
    phi = np.linspace(phi_min, phi_max, n_points)
    x = r_b * (np.cos(phi) + phi * np.sin(phi))
    y = r_b * (np.sin(phi) - phi * np.cos(phi))
    return np.column_stack([x, y])

def phi_at_radius(r_b, r_target):
    """특정 반지름에서의 전개각 계산"""
    return np.sqrt((r_target / r_b)**2 - 1)
```

**치 중심선 기준 반전 (좌측 플랭크)**:

치 피치각 = $2\pi / z$, 한 치 두께의 절반 각도:

$$\alpha_{tooth} = \frac{\pi}{2z} + \text{inv}(\alpha_0) - \text{inv}(\alpha_a)$$

여기서 인벌류트 함수: $\text{inv}(\alpha) = \tan\alpha - \alpha$

우측 플랭크를 $-\beta_{tooth}$ 각도만큼 회전 후 y축 반전하면 좌측 플랭크가 된다.

```python
def rotate_2d(points, angle):
    """2D 좌표 회전"""
    c, s = np.cos(angle), np.sin(angle)
    R = np.array([[c, -s], [s, c]])
    return points @ R.T

def mirror_x(points):
    """x축 대칭 (y 반전)"""
    p = points.copy()
    p[:, 1] = -p[:, 1]
    return p
```

★★★ [Alibre Design, 2024] https://www.alibre.com/blog/the-math-behind-involute-spur-gears/
★★★ [Gearsolutions.com, 2017] https://gearsolutions.com/features/parametric-geometric-modeling-of-a-spur-gear-using-solidworks/

### 2.3 루트 필렛 (Root Fillet) - 트로코이드 곡선

실제 치형은 인벌류트 구간 아래에 공구 끝이 그리는 **트로코이드(trochoid)** 곡선이 연결된다. 단순 구현에서는 원호(arc)로 근사한다.

**트로코이드 파라메트릭 방정식** (호브 가공 시):

$$x_f(\phi) = (r + r_c)\cos\phi - d_c \cos\left(\frac{r+r_c}{r_c}\phi\right)$$
$$y_f(\phi) = (r + r_c)\sin\phi - d_c \sin\left(\frac{r+r_c}{r_c}\phi\right)$$

여기서:
- $r$: 기어 피치 반지름
- $r_c$: 공구 생성원 반지름
- $d_c$: 공구 끝 거리 (팁 반지름)
- $\phi$: 롤링 파라미터

**간단한 구현을 위한 근사**: 루트 필렛 반지름 $\rho_f \approx 0.38m$ (모듈 기준 근사치)를 원호로 사용하면 된다.

수치 안정성 주의: 이 수치가 틀릴 수 있는 조건 — 공구 압력각이나 팁 반지름이 표준에서 벗어나면 실제 필렛이 달라진다.

★★☆ [Eng-Tips Forum, 2010] https://www.eng-tips.com/threads/trochoid-generation-for-gear-root-fillet.272852/

### 2.4 완전한 치형 프로파일 조립

한 치의 2D 윤곽선 조립 순서:

1. 좌측 이뿌리원 점 (이뿌리원 위)
2. 좌측 루트 필렛 (트로코이드 or 원호)
3. 좌측 인벌류트 플랭크 (기초원 → 이끝원)
4. 이끝원호 (치선)
5. 우측 인벌류트 플랭크 (이끝원 → 기초원)
6. 우측 루트 필렛
7. 우측 이뿌리원 점

### 2.5 2D → 3D 압출 (Extrusion)

스퍼 기어는 치형 프로파일을 **z축 방향으로 단순 압출**:

$$P_{3D}(x, y, z) = (x_{profile}, y_{profile}, z), \quad z \in [0, b]$$

여기서 $b$는 이폭(face width).

```python
def extrude_profile_to_3d(profile_2d, face_width, z_slices=2):
    """2D 프로파일을 z방향으로 압출하여 3D 정점 생성
    profile_2d: (N, 2) 배열
    face_width: 이폭
    z_slices: z방향 분할 수 (최소 2: 앞면/뒷면)
    반환: (z_slices, N, 3) 배열
    """
    z_vals = np.linspace(0, face_width, z_slices)
    vertices = []
    for z in z_vals:
        layer = np.column_stack([profile_2d, np.full(len(profile_2d), z)])
        vertices.append(layer)
    return np.array(vertices)
```

### 2.6 잇수 배열 (Circular Pattern)

$k$번째 치의 회전 각도: $\theta_k = k \cdot \frac{2\pi}{z}$

```python
def arrange_teeth(tooth_profile, num_teeth):
    """모든 치를 원형 배열"""
    all_teeth = []
    for k in range(num_teeth):
        angle = k * 2 * np.pi / num_teeth
        rotated = rotate_2d(tooth_profile, angle)
        all_teeth.append(rotated)
    return all_teeth
```

### 2.7 보어(Bore) 및 키홈(Keyway) 추가

보어는 반지름 $r_{bore}$의 원형 구멍 → CSG 차집합(Boolean difference).
키홈은 표준 치수(DIN 6885 등)에 따른 직사각형 홈.

**키홈 좌표** (중심 기준, 폭 $b_k$, 깊이 $t_k$):

$$x \in \left[-\frac{b_k}{2}, +\frac{b_k}{2}\right], \quad y \in [r_{bore}, r_{bore} + t_k]$$

---

## 3. 헬리컬 기어 (Helical Gear) 3D 형상

### 3.1 모듈 변환 관계

헬리컬 기어에서 법선면(normal plane)과 횡단면(transverse plane) 간의 변환은 비틀림각 $\beta$로 연결된다.

| 파라미터 | 기호 | 변환 수식 |
|---------|------|---------|
| 법선 모듈 → 횡단면 모듈 | $m_n, m_t$ | $m_t = \dfrac{m_n}{\cos\beta}$ |
| 법선 압력각 → 횡단면 압력각 | $\alpha_n, \alpha_t$ | $\tan\alpha_t = \dfrac{\tan\alpha_n}{\cos\beta}$ |
| 피치원 직경 | $d$ | $d = \dfrac{z \cdot m_n}{\cos\beta}$ |
| 기초원 직경 | $d_b$ | $d_b = d \cdot \cos\alpha_t$ |
| 이끝원 직경 | $d_a$ | $d_a = d + 2m_n$ |
| 이뿌리원 직경 | $d_f$ | $d_f = d - 2(1 + 0.25)m_n$ |
| 헬릭스 리드 | $L$ | $L = \pi d \cot\beta$ |

★★★ [Drivetrain Hub, 2020] https://drivetrainhub.com/notebooks/gears/geometry/Chapter%203%20-%20Helical%20Gears.html
★★★ [ZHY Gear, 2026] https://www.zhygear.com/parametric-modeling-of-helical-gears-in-transmissions-a-comprehensive-guide/

### 3.2 등가 스퍼 기어 수 (Virtual Number of Teeth)

헬리컬 기어의 치형 강도 계산을 위한 등가 잇수:

$$z_v = \frac{z}{\cos^3\beta}$$

이 값은 법선면에서의 치형 곡률 반지름 계산에 사용된다. $z_v$가 최소 잇수(보통 17) 이상이어야 언더컷이 없다.

수치 투명성: 이 수치가 틀릴 수 있는 조건 — 이 공식은 표준 비틀림각($\beta < 45°$)에서 유효하다. 극단적 비틀림각에서는 보정이 필요하다.

★★★ [KHK Gear Reference] [발행일: 2017]

### 3.3 헬리컬 치형 3D 좌표 파라메트릭 방정식

헬릭스는 다음과 같이 정의된다:

$$\mathbf{h}(\theta) = \begin{pmatrix}
 r\cos\theta \\
r\sin\theta \\
\frac{L}{2\pi}\theta 
\end{pmatrix}
$$

여기서 $L = \pi d \cot\beta$ (리드).

**3D 치형 좌표 생성**: z위치에 따라 치형 프로파일을 회전시킨다:

$$P_{3D}(x, y, z) = R_z\left(\frac{2\pi z}{L}\right) \cdot P_{2D}(x, y) + (0, 0, z)$$

여기서 $R_z(\theta)$는 z축 중심 회전 행렬.

```python
def helical_tooth_coords(profile_2d, face_width, lead, n_z=20, handedness=1):
    """헬리컬 기어 3D 치형 좌표 생성
    profile_2d: 횡단면 인벌류트 프로파일 (N, 2)
    face_width: 이폭
    lead: 헬릭스 리드 L = pi*d/tan(beta)
    handedness: +1 우선, -1 좌선
    """
    z_vals = np.linspace(0, face_width, n_z)
    layers = []
    for z in z_vals:
        # z위치에 따른 회전각 (리드 방향)
        twist_angle = handedness * (2 * np.pi * z / lead)
        c, s = np.cos(twist_angle), np.sin(twist_angle)
        R = np.array([[c, -s], [s, c]])
        rotated_2d = profile_2d @ R.T
        layer_3d = np.column_stack([rotated_2d, np.full(len(profile_2d), z)])
        layers.append(layer_3d)
    return np.array(layers)  # shape: (n_z, N, 3)
```

CAD 도구(SolidWorks, CREO)에서는 인벌류트 프로파일을 헬릭스 경로를 따라 스윕(sweep)하는 방식으로 구현한다.

★★★ [Siemens Community, 2024] https://community.sw.siemens.com/s/question/0D5Vb000006tYCKKA2/

---

## 4. 베벨 기어 (Bevel Gear) 3D 형상

### 4.1 기본 원뿔 기하학

베벨 기어는 꼭짓점이 한 점에 모이는 원뿔면을 참조면으로 사용한다.

| 원뿔 | 기호 | 설명 |
|------|------|------|
| 피치 콘(Pitch Cone) | $\delta$ | 맞물림 기준면. 피치 콘각 |
| 이끝 콘(Face Cone) | $\delta_a$ | 이끝이 놓이는 원뿔 |
| 이뿌리 콘(Root Cone) | $\delta_f$ | 이뿌리가 놓이는 원뿔 |
| 배면 콘(Back Cone) | - | 피치 콘과 수직한 콘. Tredgold 근사 기준 |

**피치 콘각** (직각 베벨, $\Sigma = 90°$):

$$\tan\delta_1 = \frac{z_1}{z_2}, \quad \tan\delta_2 = \frac{z_2}{z_1}$$

**원뿔 거리** (Cone Distance):

$$R = \frac{d_1}{2\sin\delta_1} = \frac{m \cdot z_1}{2\sin\delta_1}$$

이끝 콘각: $\delta_a = \delta + \theta_a$, 여기서 $\theta_a = \arctan(h_a / R)$
이뿌리 콘각: $\delta_f = \delta - \theta_f$, 여기서 $\theta_f = \arctan(h_f / R)$

★★★ [KHK Gear Reference] [발행일: 2017]

### 4.2 Tredgold 근사법 (구현에 실용적)

복잡한 구면 인벌류트 대신, **배면 원뿔(back cone)의 등가 스퍼 기어**로 치형을 근사한다.

**등가(가상) 잇수**:

$$z_v = \frac{z}{\cos\delta}$$

$z_v$는 종종 소수점이 나오며, 실제 잇수가 아닌 배면 원뿔의 피치 반지름으로 생성되는 가상 스퍼 기어의 잇수다.

**배면 원뿔 반지름**:

$$r_{back} = R \cdot \sin\delta + h_a \cos\delta$$

**구현 절차**:

```
1. 피치 콘각 δ 계산
2. 등가 잇수 z_v = z / cos(δ) 계산
3. z_v에 대한 인벌류트 스퍼 기어 치형 생성 (2D)
4. 배면 원뿔 위에 치형 배치
5. 원뿔 꼭짓점을 향해 치형을 선형 스케일링 (내측으로 갈수록 작아짐)
6. 이폭 방향으로 원뿔면을 따라 치형 생성
```

```python
def bevel_gear_parameters(z1, z2, m, shaft_angle=np.pi/2):
    """직각 베벨 기어 기본 파라미터"""
    delta1 = np.arctan(z1 / z2)
    delta2 = np.pi/2 - delta1
    R = m * z1 / (2 * np.sin(delta1))  # 원뿔 거리
    z_v1 = z1 / np.cos(delta1)         # 등가 잇수
    z_v2 = z2 / np.cos(delta2)
    return {
        'delta1': delta1, 'delta2': delta2,
        'R': R, 'z_v1': z_v1, 'z_v2': z_v2
    }
```

★★☆ [YouTube Fusion 360 Bevel Gear, 2021] https://www.youtube.com/watch?v=SkCyp5wS9uM
★★☆ [KU Leuven, Deproximating Tredgold, 2016] https://lirias.kuleuven.be/retrieve/385177

### 4.3 구면 인벌류트 (Spherical Involute) - 정밀 구현

Tredgold보다 정확한 치형. 기초 원뿔(base cone)의 접평면이 구름운동할 때 구면 위에 생기는 곡선.

**기초 원뿔각**:

$$\cos\delta_b = \cos\delta \cdot \cos\alpha_n$$

**구면 인벌류트 좌표** (구면 위, 반지름 $R$의 구):

$$\mathbf{r}(R, \beta) = R\begin{pmatrix}
 \sin\psi\cos\lambda \\
\sin\psi\sin\lambda \\
\cos\psi 
\end{pmatrix}
$$

여기서 $\psi$, $\lambda$는 기초 원뿔의 구름운동에서 파생되며, Litvin의 벡터 형식으로 완전히 표현된다.

[출처: Litvin, F.L., "Gear Geometry and Applied Theory", Cambridge University Press, 2004]

수치 투명성: 구면 인벌류트는 정밀 계산이 필요하며, Tredgold 근사는 이폭이 크거나(b > 0.3R) 큰 압력각에서 오차가 증가한다.

★★★ [Gearsolutions.com, 2024] https://gearsolutions.com/features/involute-bevel-gears-the-importance-of-conjugate-action-in-design/
★★☆ [IJME Paper, Spherical Involute] https://ijme.us/cd_11/PDF/Paper%20163%20ENG%20107.pdf

### 4.4 직선 베벨 기어 3D 치형 좌표 생성

```python
def straight_bevel_tooth_3d(profile_2d_outer, delta, R, face_width, n_slices=20):
    """직선 베벨 기어 치형 3D 좌표 (Tredgold 근사 기반)
    profile_2d_outer: 외단(large end) 치형 프로파일
    delta: 피치 콘각 (radian)
    R: 원뿔 거리
    face_width: 이폭
    """
    layers = []
    for i in range(n_slices):
        # 내단에서 외단까지 비율 (0=내단, 1=외단)
        t = i / (n_slices - 1)
        r_cone = R - face_width * (1 - t)  # 원뿔 거리 위치
        scale = r_cone / R                  # 스케일 비율 (내단으로 갈수록 작아짐)

        # 치형 스케일링
        scaled_profile = profile_2d_outer * scale

        # 원뿔면 위의 3D 좌표 변환
        # 원뿔축을 z축으로 가정
        z_pos = r_cone * np.cos(delta)
        r_pos = r_cone * np.sin(delta)

        # 치형을 원뿔면에 투영
        layer_3d = np.column_stack([
            scaled_profile[:, 0],
            scaled_profile[:, 1] + r_pos,
            np.full(len(scaled_profile), z_pos)
        ])
        layers.append(layer_3d)

    return np.array(layers)
```

### 4.5 스파이럴 베벨 기어 (Spiral Bevel Gear) 기초

스파이럴 베벨 기어는 Gleason 시스템을 따르며, 치면이 원호 커터(face mill)의 운동으로 생성된다.

**주요 파라미터**:
- 평균 스파이럴각 $\beta_m$: 보통 35°
- 법선 압력각 $\alpha_n$: 보통 20°
- 치형은 원호(circular arc)로 근사된다

**치면 곡선 정의 (원호 근사)**:

$$x(\theta) = R_c \cos\theta, \quad y(\theta) = R_c \sin\theta$$

여기서 $R_c$는 커터 반지름.

반증 탐색: Gleason 스파이럴 베벨의 치면은 진정한 구면 인벌류트가 아니며, 비공액(non-conjugate) 표면이다. 약 100개의 기계 파라미터가 필요하여 일반 프로그래밍으로 완전 재현이 어렵다. 이 점에서 "반증 미발견"이 아닌 — 정확한 스파이럴 베벨 구현은 Gleason 독점 소프트웨어 없이는 근사에 그친다.

★★☆ [ZHY Gear, 2026] https://www.zhygear.com/analytical-design-method-for-gleason-spiral-bevel-gears/
★★☆ [Scribd Gleason Calculation] https://www.scribd.com/document/520679098/

---

## 5. 내접 기어 (Internal Gear) 3D 형상

### 5.1 외접 기어와의 차이

내접 기어는 치가 내부를 향하므로 인벌류트 곡선의 방향이 반전된다.

| 파라미터 | 외접 기어 | 내접 기어 |
|---------|---------|---------|
| 이끝원 반지름 | $r_a = r + m$ | $r_a = r - m$ (내접: 피치원보다 작음) |
| 이뿌리원 반지름 | $r_f = r - 1.25m$ | $r_f = r + 1.25m$ (피치원보다 큼) |
| 인벌류트 방향 | 바깥쪽 볼록 | 안쪽 오목 |
| 프로파일 대칭 | y축 반전 | x축 반전 (또는 $+\pi$ 회전) |

### 5.2 내접 인벌류트 좌표

내접 기어의 치형은 기초원 반지름 $r_{b2}$에서 생성:

$$r_{b2} = r_2 \cos\alpha_0$$

좌표 방정식 (y2축 대칭):

$$\mathbf{r}_2(\theta_2) = r_{b2}(\cos\theta_2 + \theta_2\sin\theta_2, \; \sin\theta_2 - \theta_2\cos\theta_2)$$

내접 기어의 치형은 외접과 동일한 수식이지만, **치의 두께와 공간이 반전**된다.

★★★ [Cambridge University Press, Internal Involute Gears PDF] https://resolve.cambridge.org/core/services/aop-cambridge-core/content/view/4CA5DF34E4C401C776AB8FA1BC8524DF/9780511547126c11_p304-317_CBO.pdf/internal-involute-gears.pdf

### 5.3 중심거리 및 작동 압력각

내접 기어 쌍의 중심거리:

$$a_x = \frac{d_{w2} - d_{w1}}{2}$$

작동 압력각:

$$\cos\alpha_w = \frac{d_{b2} - d_{b1}}{2a_x}$$

인벌류트 함수 조건:

$$\text{inv}(\alpha_w) = \text{inv}(\alpha_0) + \frac{2(x_1 - x_2)}{z_2 - z_1}\tan\alpha_0$$

★★★ [SDP/SI Elements of Metric Gear Technology] https://sdp-si.com/resources/elements-of-metric-gear-technology/page3.php

### 5.4 간섭 조건과 최소 이수

**표준 20° 압력각 기준**:

| 조건 | 기준 |
|------|------|
| 외접 피니언 언더컷 없음 | $z_1 \geq 17$ (프로파일 시프트 없을 때) |
| 내접 기어 이끝이 기초원 밖 | $z_2 > 34$ |
| 내접-외접 간격 조건 | $z_2 - z_1 > 3 \sim 5$ (경험치) |

수치 투명성: $z_1 \geq 17$, $z_2 > 34$의 출처는 표준 20° 압력각, 시프트 계수 0의 조건. 압력각이 크거나 프로파일 시프트를 적용하면 이 한계가 변한다.

```python
def check_internal_gear_interference(z1, z2, alpha0=20*np.pi/180, x1=0, x2=0):
    """내접 기어 간섭 체크"""
    # 인벌류트 함수
    inv = lambda a: np.tan(a) - a

    # 기초원 기반 간섭 조건
    db1 = z1 * np.cos(alpha0)
    db2 = z2 * np.cos(alpha0)

    # 내접 기어 이끝이 기초원 안에 들어오면 간섭
    da2_internal = z2 - 2  # 내접 이끝원 반지름 (모듈=1 기준)
    if da2_internal < db2 / 2:
        return "간섭 발생: 내접 기어 이끝이 기초원 안쪽"

    return "간섭 없음"
```

★★★ [Gearsolutions.com, Internal Ring Gears, 2019] https://gearsolutions.com/departments/tooth-tips/internal-ring-gears-design-and-considerations/
★★☆ [SDP/SI Metric Gear Tech] https://sdp-si.com/resources/elements-of-metric-gear-technology/page3.php

### 5.5 내접 기어 3D 형상

스퍼 내접 기어의 3D 형상은 **링(ring) 형태의 원통**에서 내부 치형을 CSG 차집합으로 제거하는 방식:

```
링 원통 = 외경 원통 - 내경 원통(이뿌리원 기준)
각 치 공간 = 인벌류트 프로파일 단면의 압출
내접 기어 = 링 원통 - sum(각 치 공간)
```

---

## 6. 랙 & 피니언 (Rack and Pinion)

### 6.1 랙 치형 좌표 (직선 프로파일)

랙은 인벌류트의 무한대 반지름 극한 = **직선 프로파일**.

**랙 치형 파라메트릭 방정식** (피치선을 x축, 수직을 y축으로):

하나의 치에 대해 (모듈 $m$, 압력각 $\alpha$, 치 피치 $p = \pi m$):

| 구간 | 방정식 |
|------|--------|
| 우측 플랭크 (높이 $h$ 기준) | $x(h) = \frac{p}{4} + h\tan\alpha$, $y(h) = h$ |
| 좌측 플랭크 | $x(h) = -\frac{p}{4} - h\tan\alpha$, $y(h) = h$ |
| 이끝 | $y = h_a = m$, $x \in [-x_{tip}, +x_{tip}]$ |
| 이뿌리 | $y = -h_f = -1.25m$, $x \in [-p/2, +p/2]$ |

$$h \in [-1.25m, +m]$$

여기서 $h=0$은 피치선 위치.

```python
def rack_tooth_profile(m, alpha=20*np.pi/180, n_points=20):
    """랙 치형 2D 프로파일 생성 (한 치)"""
    p = np.pi * m
    h_a = m          # 이끝 높이
    h_f = 1.25 * m   # 이뿌리 깊이

    h = np.linspace(-h_f, h_a, n_points)

    # 우측 플랭크
    x_right = p/4 + h * np.tan(alpha)
    y_right = h

    # 좌측 플랭크 (대칭)
    x_left = -p/4 - h * np.tan(alpha)
    y_left = h

    # 이끝 (수평선)
    x_top = np.linspace(x_left[-1], x_right[-1], 5)
    y_top = np.full(5, h_a)

    # 치형 조립 (CCW 방향)
    profile = np.vstack([
        np.column_stack([x_left[::-1], y_left[::-1]]),
        np.column_stack([x_top, y_top]),
        np.column_stack([x_right, y_right])
    ])
    return profile
```

★★★ [Drivetrain Hub, Basic Rack Geometry] https://drivetrainhub.com/notebooks/gears/tooling/Chapter%201%20-%20Basic%20Rack.html
★★★ [KHK Basic Gear Terminology] https://khkgears.net/new/gear_knowledge/abcs_of_gears-b/basic_gear_terminology_calculation.html

### 6.2 랙 3D 형상 생성

랙의 3D 형상은 치형 프로파일을 **x축 방향(랙 이동 방향)으로 압출**:

$$P_{3D}(x, y, z) = (x_{rack_axis}, y_{profile}, z_{face_width})$$

여기서:
- $x_{rack_axis}$: 랙 길이 방향 (치 피치 $p$로 반복)
- $y_{profile}$: 치형 높이 방향
- $z_{face_width}$: 폭 방향

### 6.3 피니언과의 맞물림 기하학

피니언이 각도 $\theta$만큼 회전하면, 랙은 선형 이동:

$$\Delta x_{rack} = r_{pinion} \cdot \theta = \frac{m \cdot z_{pinion}}{2} \cdot \theta$$

맞물림 선(line of action): 피치점을 지나고 압력각 $\alpha$만큼 기울어진 직선.

---

## 7. 3D 솔리드 모델링 공통 수학

### 7.1 프로파일 → 솔리드 변환 알고리즘

| 방법 | 적용 기어 | 설명 |
|------|---------|------|
| Extrusion (압출) | 스퍼 기어, 내접 기어, 랙 | 2D 프로파일을 일정 방향으로 선형 이동 |
| Sweep (스윕) | 헬리컬 기어 | 2D 프로파일을 경로 곡선(헬릭스)을 따라 이동 |
| Loft (로프트) | 베벨 기어 | 다른 크기의 단면 프로파일들을 연결 |
| Boolean CSG | 모든 기어 | 기본 솔리드에서 치 공간을 차감(subtract) |

**Sweep을 위한 Frenet-Serret 프레임**:

경로 $\mathbf{C}(t)$ 위에서:

$$\mathbf{T} = \frac{d\mathbf{C}/dt}{|d\mathbf{C}/dt|}, \quad \mathbf{N} = \frac{d\mathbf{T}/dt}{|d\mathbf{T}/dt|}, \quad \mathbf{B} = \mathbf{T} \times \mathbf{N}$$

프로파일의 각 점 $\mathbf{p}_{2D} = (u, v)$는 3D로:

$$\mathbf{P}_{3D} = \mathbf{C}(t) + u\mathbf{N}(t) + v\mathbf{B}(t)$$

헬릭스 경로 $\mathbf{C}(t) = (r\cos t, r\sin t, \frac{L}{2\pi}t)$:

$$\mathbf{T}(t) = \frac{(-r\sin t, r\cos t, L/(2\pi))}{|({\cdot})|}, \quad |\mathbf{T}| = \sqrt{r^2 + (L/2\pi)^2}$$

### 7.2 메쉬 생성 (삼각분할, Tessellation)

기어 치형을 삼각 메쉬로 변환하는 전략:

**1) 단면 연결 (Layer-by-Layer)**:

연속된 두 단면 레이어 $L_k$, $L_{k+1}$ (각각 $N$개 정점) 사이를 삼각분할:

```python
def triangulate_between_layers(layer0, layer1):
    """두 레이어 사이를 삼각형으로 연결
    layer0, layer1: (N, 3) 배열
    반환: 삼각형 인덱스 리스트
    """
    N = len(layer0)
    triangles = []
    for i in range(N - 1):
        # 두 삼각형으로 사각형 분할
        tri1 = (i, i+1, i+N)        # 하단 삼각형
        tri2 = (i+1, i+N+1, i+N)   # 상단 삼각형
        triangles.extend([tri1, tri2])
    return triangles
```

**2) 삼각형 품질 지표**:

$$Q(t) = \frac{6\sqrt{3} \cdot S_t}{p_t \cdot h_t}$$

여기서 $S_t$: 넓이, $p_t$: 반둘레, $h_t$: 최장 변. $Q=1$이 정삼각형.

기어 치면에서 종횡비(aspect ratio)를 1:5 이내로 유지하는 것이 권장된다.

### 7.3 법선 벡터 계산

**면 법선 (face normal)**:

$$\mathbf{n} = \frac{(\mathbf{v}_1 - \mathbf{v}_0) \times (\mathbf{v}_2 - \mathbf{v}_0)}{|(\mathbf{v}_1 - \mathbf{v}_0) \times (\mathbf{v}_2 - \mathbf{v}_0)|}$$

**정점 법선 (vertex normal) - 면적 가중 평균 방법**:

$$\mathbf{n}_{vertex} = \frac{\sum_i A_i \mathbf{n}_i}{|\sum_i A_i \mathbf{n}_i|}$$

여기서 $A_i$는 인접 삼각형의 면적.

```python
def compute_vertex_normals(vertices, faces):
    """정점 법선 계산 (면적 가중 평균)"""
    normals = np.zeros_like(vertices)
    for f in faces:
        v0, v1, v2 = vertices[f[0]], vertices[f[1]], vertices[f[2]]
        edge1 = v1 - v0
        edge2 = v2 - v0
        face_normal = np.cross(edge1, edge2)
        area = np.linalg.norm(face_normal) / 2
        face_normal /= (np.linalg.norm(face_normal) + 1e-12)
        normals[f[0]] += area * face_normal
        normals[f[1]] += area * face_normal
        normals[f[2]] += area * face_normal
    # 정규화
    norms = np.linalg.norm(normals, axis=1, keepdims=True)
    return normals / (norms + 1e-12)
```

★★☆ [CAD Journal, STL Tessellation, 2009] https://cad-journal.net/files/vol_6/CAD_6(3)_2009_351-363.pdf

### 7.4 CSG 연산 개요

기어 3D 모델에서 주요 CSG 연산:

```
기어 솔리드 = 원통(이끝원)
              - 각_치_홈(인벌류트 프로파일 압출 or 스윕)
              - 보어(bore)
              - 키홈(keyway)
              + 허브(hub) (해당 시)
```

프로그래밍 구현:
- **Python**: CadQuery, Open CASCADE Technology (OCCT)
- **C++**: CGAL (정확 연산), Open CASCADE
- **Web**: three-bvh-csg (Three.js용 CSG)
- **OpenSCAD**: 스크립트 기반 CSG (간단하지만 정밀도 제한)

### 7.5 STL/STEP 출력을 위한 고려사항

**STL 출력**:
- 모든 삼각형의 법선이 솔리드 바깥을 향해야 함 (outward-pointing normals)
- 인접 삼각형은 두 꼭짓점을 공유해야 함 (shared vertices)
- 워터타이트 메쉬(watertight mesh): 구멍 없음

**메쉬 품질 체크리스트**:
1. 뒤집힌 삼각형 없음 (consistent winding)
2. T-junction 없음 (adjacent triangles share complete edges)
3. 중복 정점 제거
4. 최소 삼각형 각도 > 10°

**STEP 출력**: B-Rep(boundary representation) 방식. 삼각형이 아닌 NURBS/B-spline 곡면으로 표현. 기어 플랭크를 하나의 NURBS 패치로 표현하려면 곡면 피팅(surface fitting)이 필요하다.

---

## 8. 구현 참고사항

### 8.1 좌표계 컨벤션

| 컨벤션 | 권장 설정 |
|--------|---------|
| 기어 회전축 | z축 (기어 축이 z축과 평행) |
| 기어 중심 | 원점 (0, 0, 0) |
| 이폭 방향 | z: [0, b] 또는 [-b/2, +b/2] (대칭이 유리) |
| 각도 기준 | 첫 치의 중심선이 +x축 방향 |
| 단위 | mm (산업 표준) |

### 8.2 수치 안정성

**인벌류트 역함수** (inv(α) = x 에서 α 찾기): 뉴턴-랩슨법 사용:

```python
def inv(alpha):
    """인벌류트 함수"""
    return np.tan(alpha) - alpha

def inv_inv(x, tol=1e-10, max_iter=100):
    """인벌류트 역함수 (뉴턴-랩슨)"""
    alpha = x**(1/3)  # 초기값 근사
    for _ in range(max_iter):
        f = inv(alpha) - x
        df = np.tan(alpha)**2  # inv'(α) = tan²(α)
        alpha -= f / (df + 1e-12)
        if abs(f) < tol:
            break
    return alpha
```

**기어 최소/최대 파라미터**:
- $r_{target} \geq r_b$ 를 확인 (이뿌리원이 기초원보다 크면 이론적으로 인벌류트 시작점 불필요)
- $r_b < r_f$이면 언더컷 발생 → 프로파일 시프트 필요

### 8.3 메쉬 품질 권장 값

| 기어 부위 | 권장 분해능 |
|---------|----------|
| 인벌류트 플랭크 | 점당 간격 0.1~0.5mm |
| 루트 필렛 | 점당 간격 0.05~0.2mm (곡률 큰 부분) |
| 이끝원호 | 점당 간격 0.1~0.5mm |
| z방향 (이폭) | 최소 2레이어, 스퍼는 앞/뒤만으로 충분 |
| 헬리컬 z분할 | 비틀림 5°당 최소 1레이어 권장 |

### 8.4 실시간 렌더링 (WebGL/Three.js) 고려사항

기어 시뮬레이션 앱에서 실시간 렌더링을 위한 최적화:

1. **LOD (Level of Detail)**: 거리에 따라 정점 수 동적 감소
2. **IndexedBufferGeometry**: 정점 중복 없이 인덱스 배열로 면 정의
3. **Flat vs Smooth 법선**: 치면은 smooth, 이끝/이뿌리 모서리는 flat 법선 사용
4. **Instancing**: 같은 모양의 기어 여러 개 렌더링 시 InstancedMesh 사용

Three.js에서 기어 메쉬 구성 예:
```javascript
const geometry = new THREE.BufferGeometry();
geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
geometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
geometry.setIndex(indices);
const material = new THREE.MeshStandardMaterial({
    color: 0x888888, metalness: 0.8, roughness: 0.3
});
const gear = new THREE.Mesh(geometry, material);
```

---

## 9. 관점 확장 / 문제 재정의

### 관점 확장

**인접 질문 1**: 기어 메쉬 시뮬레이션에서 맞물림 시각화를 위한 "동적" 좌표 갱신이 더 큰 과제일 수 있다. 두 기어가 맞물릴 때 접촉선(contact line), 접촉 타원(contact ellipse)을 실시간 표시하려면 기어비에 따른 회전 동기화가 필요하다.

**인접 질문 2**: 기어 치형이 3D로 생성된 이후, **백래시(backlash) 조정**을 위해 치형을 법선 방향으로 오프셋하는 것이 실용적인 다음 단계다. 법선 방향 오프셋은 메쉬의 법선 벡터를 활용하면 구현 가능하다.

**이질 도메인**: [이질 도메인: 컴퓨터 그래픽스 NURBS 모델링] 기어 치면의 B-Rep 표현은 CG에서 곡면 모델링에 쓰이는 NURBS 패치 피팅과 동일한 문제 구조다. Piegl & Tiller의 "The NURBS Book"에서 곡면 피팅 알고리즘을 기어 치면에 그대로 차용할 수 있다.

### 문제 재정의

조사 후 제안: "기어 유형별 3D 좌표 수식"보다 더 적합한 핵심 질문은 **"기어 종류별로 2D 치형 단면을 어떻게 3D 공간에서 이동(extrude/sweep/loft)하는가, 그리고 각 이동 방식에서 좌표 변환 행렬은 어떻게 구성되는가"** 이다. 이 프레임이 프로그래밍 구현에 더 직접적이다.

---

## 10. 출처 목록

| 번호 | 출처 | 유형 | URL | 확신도 |
|------|------|------|-----|--------|
| 1 | KHK Gear Technical Reference | 산업 표준 | https://khkgears.net/new/gear_knowledge/gear_technical_reference/calculation_gear_dimensions.html | ★★★ |
| 2 | Alibre Design - Math Behind Involute Spur Gears | 기술 블로그 | https://www.alibre.com/blog/the-math-behind-involute-spur-gears/ | ★★★ |
| 3 | Gearsolutions - Parametric Modeling SolidWorks | 업계 저널 | https://gearsolutions.com/features/parametric-geometric-modeling-of-a-spur-gear-using-solidworks/ | ★★☆ |
| 4 | Drivetrain Hub - Helical Gear Geometry | 기술 문서 | https://drivetrainhub.com/notebooks/gears/geometry/Chapter%203%20-%20Helical%20Gears.html | ★★★ |
| 5 | ZHY Gear - Parametric Modeling Helical Gears | 업계 | https://www.zhygear.com/parametric-modeling-of-helical-gears-in-transmissions-a-comprehensive-guide/ | ★★☆ |
| 6 | Siemens Community - Helical Gear Profile Shift | 커뮤니티 | https://community.sw.siemens.com/s/question/0D5Vb000006tYCKKA2/ | ★★☆ |
| 7 | Gearsolutions - Involute Bevel Gears | 업계 저널 | https://gearsolutions.com/features/involute-bevel-gears-the-importance-of-conjugate-action-in-design/ | ★★★ |
| 8 | ZHY Gear - Spherical Involute | 업계 | https://www.zhygear.com/the-spherical-involute-and-its-application-in-miter-gears-and-precision-metrology/ | ★★☆ |
| 9 | IJME - Spherical Involute Geometry | 학술 | https://ijme.us/cd_11/PDF/Paper%20163%20ENG%20107.pdf | ★★☆ |
| 10 | KU Leuven - Deproximating Tredgold | 학술 | https://lirias.kuleuven.be/retrieve/385177 | ★★★ |
| 11 | Cambridge University Press - Internal Involute Gears | 교과서 | https://resolve.cambridge.org/core/services/aop-cambridge-core/content/view/4CA5DF34E4C401C776AB8FA1BC8524DF/9780511547126c11_p304-317_CBO.pdf/internal-involute-gears.pdf | ★★★ |
| 12 | SDP/SI - Internal Gear Calculations | 산업 표준 | https://sdp-si.com/resources/elements-of-metric-gear-technology/page3.php | ★★★ |
| 13 | Gearsolutions - Internal Ring Gears | 업계 저널 | https://gearsolutions.com/departments/tooth-tips/internal-ring-gears-design-and-considerations/ | ★★★ |
| 14 | Drivetrain Hub - Basic Rack Geometry | 기술 문서 | https://drivetrainhub.com/notebooks/gears/tooling/Chapter%201%20-%20Basic%20Rack.html | ★★★ |
| 15 | ZHY Gear - Gleason Spiral Bevel | 업계 | https://www.zhygear.com/analytical-design-method-for-gleason-spiral-bevel-gears/ | ★★☆ |
| 16 | CAD Journal - STL Tessellation Algorithm | 학술 | https://cad-journal.net/files/vol_6/CAD_6(3)_2009_351-363.pdf | ★★☆ |
| 17 | Litvin, F.L. - Gear Geometry and Applied Theory | 교과서 | Cambridge Univ. Press, 2004 | ★★★ |
| 18 | Eng-Tips Forum - Trochoid Root Fillet | 커뮤니티 | https://www.eng-tips.com/threads/trochoid-generation-for-gear-root-fillet.272852/ | ★☆☆ |
| 19 | Dr. Hessmer - Online Involute Spur Gear Builder | 오픈소스 | http://www.hessmer.org/blog/2014/01/01/online-involute-spur-gear-builder/ | ★★☆ |

---

*검색 비용 참고: Perplexity search ~8회, Tavily extract ~1회 사용*
