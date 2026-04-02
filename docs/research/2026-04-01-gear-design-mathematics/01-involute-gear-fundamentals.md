# 01 — 인벌류트 기어 기하학 기초 수학

**Researcher 1: 기어 기하학 기초 수학저장 경로**: `docs/research/2026-04-01-gear-design-mathematics/01-involute-gear-fundamentals.md`**작성일**: 2026-04-01 **확신도 표기**: ★★★ 교과서급, ★★☆ 산업 표준/다수 출처, ★☆☆ 단일 출처

---

## 개요

인벌류트 기어(involute gear)는 현대 기계 설계에서 가장 널리 쓰이는 치형(tooth profile)이다. 기초원(base circle)에서 실을 풀어내는 점이 그리는 궤적—인벌류트 곡선—을 이(tooth)의 프로파일로 사용한다. 이 특성 덕분에 두 기어가 맞물릴 때 법선력(normal force)의 방향이 일정하게 유지되어, 정속비(constant velocity ratio)와 부드러운 동력 전달이 보장된다.

이 문서는 기어 시뮬레이션 앱 구현에 직접 사용할 수 있는 수준의 수식과 알고리즘을 제공한다. 수식은 LaTeX 표기이며, 모든 각도는 **라디안(radian)** 기준이다(특별 명시 제외).

---

## 1. 인벌류트 곡선 수학 ★★★

### 1.1 인벌류트의 기하학적 정의

인벌류트는 반지름 $r_b$인 기초원(base circle)에 팽팽하게 감긴 실의 끝이 풀려 나가면서 그리는 궤적이다.

파라미터 $t$ (풀림 각도, radians, $t \geq 0$)를 기준으로 한 **직교좌표 파라메트릭 방정식**:

$$ \begin{aligned} x(t) &= r_b \bigl(\cos t + t \sin t\bigr) \\ y(t) &= r_b \bigl(\sin t - t \cos t\bigr) \end{aligned} $$

> **출처 해설**: 위 방정식은 기어 교과서(Shigley's, KHK 기술 참고서)와 SiliconWit 교육 자료(2026) 모두에서 동일하게 나타나며, 교과서급 표준식이다. [SiliconWit, 2026; tec-science.com, 2021]

#### 극좌표 표현 (반지름과 각도)

임의의 $t$에서 인벌류트 위 점의 반지름:

$$ r(t) = r_b \sqrt{1 + t^2} $$

풀림 각도 $t$와 극좌표 각도 $\theta$ 사이의 관계:

$$ \theta(t) = t - \arctan(t) $$

역방향(반지름 $r$에서 $t$ 구하기):

$$ t = \sqrt{\left(\frac{r}{r_b}\right)^2 - 1} $$

이 역관계식은 특정 원(피치원, 이끝원)에서 인벌류트의 파라미터를 구할 때 핵심적으로 사용된다.

### 1.2 인벌류트 함수 (involute function)

압력각 $\alpha$에서의 인벌류트 함수:

$$ \text{inv}(\alpha) = \tan(\alpha) - \alpha $$

이 함수는 기어 이두께 계산, 물림 압력각, 전위 계수 설계 등 거의 모든 기어 계산에 등장한다. **각도는 반드시 라디안 단위**이다.

### 1.3 압력각(pressure angle)과 인벌류트의 관계

임의의 원(반지름 $r$) 위 인벌류트 점에서의 **작동 압력각** $\alpha_r$:

$$ \cos(\alpha_r) = \frac{r_b}{r} $$

따라서:

- 기초원($r = r_b$)에서 $\alpha = 0$ → 인벌류트가 기초원에 수직(접선)
- 피치원($r = r_0$)에서 $\alpha = \alpha_0$ (기준 압력각, 표준 20°)
- 이끝원($r = r_a$)에서 $\alpha > \alpha_0$

---

## 2. 기어 기본 파라미터 관계식 ★★★

### 2.1 핵심 파라미터 정의

| 기호 | 이름 (영문) | 단위 | 표준값/관계 |
| --- | --- | --- | --- |
| $m$ | 모듈 (module) | mm | 이산 표준값 (ISO 54: 1, 1.25, 1.5, 2, 2.5, 3, …) |
| $z$ | 이수 (number of teeth) | 개 | 정수 |
| $\alpha_0$ | 기준 압력각 (standard pressure angle) | rad | 20° = 0.3491 rad (ISO 표준) |
| $x$ | 전위 계수 (profile shift coefficient) | 무차원 | 0 = 표준, > 0 = 양전위 |

### 2.2 각 원의 지름 계산 ★★★

$$ \begin{aligned} d_0 &= m \cdot z & &\text{(피치원, reference/pitch circle)} \\ d_b &= d_0 \cdot \cos(\alpha_0) = m \cdot z \cdot \cos(\alpha_0) & &\text{(기초원, base circle)} \\ d_a &= d_0 + 2m(1 + x) = m(z + 2 + 2x) & &\text{(이끝원, addendum circle)} \\ d_f &= d_0 - 2m(1.25 - x) = m(z - 2.5 + 2x) & &\text{(이뿌리원, dedendum circle)} \end{aligned} $$

**전위 없는 표준 기어** ($x = 0$):

$$ d_a = m(z+2), \quad d_f = m(z-2.5) $$

### 2.3 이높이 파라미터 ★★★

$$ \begin{aligned} h_a &= m(1 + x) & &\text{(어덴덤, addendum)} \\ h_f &= m(1.25 - x) & &\text{(디덴덤, dedendum)} \\ c &= 0.25m & &\text{(클리어런스, clearance)} \\ h &= h_a + h_f = 2.25m & &\text{(전체 이높이, full tooth height)} \end{aligned} $$

> **수치 투명성**: 클리어런스 계수 0.25는 ISO 54 및 AGMA 표준의 기본값이다. 정밀 기어나 고하중 적용에서는 0.20\~0.30으로 조정될 수 있다. 이 수치가 틀릴 수 있는 조건: 랙 커터 팁 반경(rack cutter tip radius)이 비표준인 경우.

### 2.4 피치 및 기초 피치 ★★★

$$ \begin{aligned} p_0 &= \pi m & &\text{(원호 피치, circular pitch — 피치원 상)} \\ p_b &= \pi m \cos(\alpha_0) & &\text{(기초 피치, base pitch — 기초원 상)} \\ p_b &= p_0 \cos(\alpha_0) \end{aligned} $$

### 2.5 원호 이두께 (circular tooth thickness) ★★★

피치원에서의 이두께 $s_0$ (전위 계수 포함):

$$ s_0 = m\left(\frac{\pi}{2} + 2x\tan(\alpha_0)\right) $$

임의 직경 $d$의 원에서 이두께 $s$:

$$ s = d\left(\frac{s_0}{d_0} + \text{inv}(\alpha_0) - \text{inv}(\alpha_r)\right) $$

여기서 $\alpha_r = \arccos(d_b / d)$.

### 2.6 백래시 (backlash) ★★☆

이론 백래시 없는 기어쌍의 작동 압력각 $\alpha_b$ (전위 합 $x_1 + x_2$ 사용):

$$ \text{inv}(\alpha_b) = \frac{2(x_1 + x_2)}{z_1 + z_2} \tan(\alpha_0) + \text{inv}(\alpha_0) $$

표준 중심거리:

$$ a_0 = \frac{m(z_1 + z_2)}{2} $$

전위된 기어쌍의 실제 중심거리:

$$ a = m(z_1 + z_2) \cdot \frac{\cos(\alpha_0)}{2\cos(\alpha_b)} $$

물림 압력각 $\alpha_b$는 inv 함수의 역함수가 존재하지 않으므로 **뉴턴법(Newton's method)**으로 수치 계산한다.

---

## 3. 치형 프로파일 생성 ★★★

### 3.1 단일 인벌류트 플랭크 (flank) 좌표 계산

**알고리즘**: 파라미터 $t$를 0에서 $t_{tip}$까지 변화시켜 기초원\~이끝원 구간의 인벌류트 점 생성.

$$ t_{tip} = \sqrt{\left(\frac{r_a}{r_b}\right)^2 - 1} $$

인벌류트 점 (이 단계에서는 기초원 기준 "기본" 위치):

$$ \begin{aligned} x_{inv}(t) &= r_b(\cos t + t\sin t) \\ y_{inv}(t) &= r_b(\sin t - t\cos t) \end{aligned} $$

### 3.2 치형 대칭 배치 (tooth half-angle 설정)

피치원에서 이 하나의 각도 폭 절반 (반쪽 이두께 각도):

$$ \delta = \frac{s_0}{d_0} = \frac{\pi}{2z} + x\tan(\alpha_0) \cdot \frac{2}{z} $$

피치원에서 인벌류트의 각도 위치:

$$ \phi_{pitch} = \text{inv}(\alpha_0) = \tan(\alpha_0) - \alpha_0 $$

오른쪽 플랭크(right flank)의 회전 오프셋 각도:

$$ \theta_{offset} = \delta + \phi_{pitch} = \frac{\pi}{2z} + \text{inv}(\alpha_0) + \frac{2x\tan(\alpha_0)}{z} $$

오른쪽 플랭크의 회전 변환 (이를 피치원 기준 대칭 위치로 배치):

$$ \begin{aligned} x_R(t) &= x_{inv}(t)\cos(\theta_{offset}) - y_{inv}(t)\sin(\theta_{offset}) \\ y_R(t) &= x_{inv}(t)\sin(\theta_{offset}) + y_{inv}(t)\cos(\theta_{offset}) \end{aligned} $$

왼쪽 플랭크(left flank): 오른쪽의 Y축 반전 (미러링):

$$ (x_L, y_L) = (x_R, -y_R) $$

### 3.3 이뿌리 필릿 (root fillet) — 트로코이드 곡선 ★★☆

이뿌리 곡선은 랙 커터 팁이 기어 블랭크를 절삭할 때 생성되는 곡선으로, 진정한 트로코이드(trochoid)에 가깝다. 정확한 트로코이드 방정식:

랙 커터의 팁 반경 $r_c \approx 0.38m$ (표준 호빙 커터 기준), 파라미터 $u$ (랙 절삭 위치):

$$ \begin{aligned} x_{fillet}(u) &= r_c\sin\left(\frac{u}{r_0}\right) - \left(r_0 - r_f + r_c\right)\sin\left(\frac{u}{r_0} - \varphi(u)\right) \\ y_{fillet}(u) &= -r_c\cos\left(\frac{u}{r_0}\right) + \left(r_0 - r_f + r_c\right)\cos\left(\frac{u}{r_0} - \varphi(u)\right) \end{aligned} $$

여기서 $r_0 = d_0/2$, $r_f = d_f/2$, $\varphi(u)$는 랙의 각도 오프셋.

> **실용적 대안**: 시뮬레이션 앱에서는 간략화된 원호(circular arc)로 필릿을 근사하는 방법이 많이 쓰인다. 이끝원에서 기초원 아래까지의 필릿 반경을 $\rho_f \approx r_c = 0.38m$으로 설정하고, 인벌류트 곡선과 접선 방향으로 연결한다. **이 수치가 틀릴 수 있는 조건**: 비표준 커터 사용, 전위 계수가 크거나 이수가 적은 경우.

> **반증 탐색**: 일부 문헌에서 실제 트로코이드와 "전이 곡선(transition curve)"이 정확히 일치하지 않음을 지적한다 [gearsolutions.com, 2023]. 트로코이드는 풀 팁 반경 호브에서 생성되는 근사일 수 있다. "반증 미발견"이 아님 — 엄밀한 필릿 계산에는 공구 기하학과 절삭 운동학을 함께 고려해야 한다.

**이끝 처리 (tip treatment)**:

- 모따기(chamfer): 이끝원에서 이두께의 10\~15% 모따기 일반적
- 라운딩: 이끝에 $r_{tip} \approx 0.05m$ 원호 적용 가능

### 3.4 단일 치형 좌표 생성 절차 (알고리즘)

```
입력: m, z, α₀, x (전위계수)
출력: 하나의 이(tooth) 폐합 윤곽 좌표 배열

1. 파라미터 계산:
   r_b = m·z·cos(α₀)/2
   r_a = m(z + 2 + 2x)/2
   r_f = m(z - 2.5 + 2x)/2
   r_0 = m·z/2

2. 인벌류트 파라미터 범위:
   t_start = max(0,  sqrt((r_f/r_b)^2 - 1))  [r_f < r_b 이면 0]
   t_tip   = sqrt((r_a/r_b)^2 - 1)

3. θ_offset 계산 (대칭 배치):
   θ_offset = π/(2z) + inv(α₀) + 2x·tan(α₀)/z

4. 오른쪽 플랭크 점 생성 (N개, 예: N=50):
   for i in 0..N:
     t = t_start + (t_tip - t_start) * i/N
     x_inv = r_b*(cos(t) + t*sin(t))
     y_inv = r_b*(sin(t) - t*cos(t))
     x_R = x_inv*cos(θ_offset) - y_inv*sin(θ_offset)
     y_R = x_inv*sin(θ_offset) + y_inv*cos(θ_offset)

5. 왼쪽 플랭크 점: 오른쪽의 Y 반전 후 역순

6. 이끝 원호 (tip arc):
   두 플랭크 상단을 이끝원(r_a)으로 잇는 원호 보간

7. 이뿌리 원호 (root arc):
   두 플랭크 하단을 이뿌리원(r_f)으로 잇는 원호 보간
   (또는 트로코이드 필릿 곡선 사용)

8. 순서: 왼쪽플랭크↓ → 이뿌리호 → 오른쪽플랭크↑ → 이끝호 (폐합)
```

### 3.5 기어 전체 프로파일 생성 (원형 배열)

단일 이의 좌표를 각도 피치 $\Delta\theta = 2\pi/z$만큼 회전하여 $z$개 이를 배치:

$$ \begin{aligned} x_k(t) &= x(t)\cos(k\Delta\theta) - y(t)\sin(k\Delta\theta) \\ y_k(t) &= x(t)\sin(k\Delta\theta) + y(t)\cos(k\Delta\theta) \end{aligned} $$

$k = 0, 1, \ldots, z-1$

---

## 4. 기어 강도 기초 ★★☆

### 4.1 Lewis 이뿌리 굽힘 강도 공식

루이스 공식 (1892년 Wilfred Lewis): 이를 외팔보(cantilever beam)로 모델링.

$$ \sigma_b = \frac{W_t}{F \cdot m \cdot Y} $$

| 기호 | 의미 | 단위 |
| --- | --- | --- |
| $W_t$ | 접선 하중 (tangential load) | N |
| $F$ | 이폭 (face width) | mm |
| $m$ | 모듈 | mm |
| $Y$ | Lewis 형상 계수 (form factor) | 무차원 |

**Lewis 형상 계수 $Y$ (20° 압력각 표준 이):**

| 이수 $z$ | $Y$ |
| --- | --- |
| 12 | 0.245 |
| 14 | 0.276 |
| 17 | 0.303 |
| 20 | 0.322 |
| 24 | 0.337 |
| 30 | 0.359 |
| 40 | 0.389 |
| 60 | 0.422 |
| ∞ (랙) | 0.485 |

> **수치 투명성**: 위 값은 Shigley's Mechanical Engineering Design(교과서)과 AGMA 데이터로부터 도출된 것으로, 다수 문헌에서 일치한다. 이 수치가 틀릴 수 있는 조건: 비표준 압력각(14.5°, 25°), 스텁 치형, 전위 기어.

접선 하중과 토크의 관계:

$$ W_t = \frac{2T}{d_0} = \frac{2T}{mz} $$

### 4.2 Hertz 접촉 응력 기초 ★★☆

맞물리는 두 기어 이 사이의 접촉 응력(Hertzian contact stress):

$$ \sigma_H = Z_E \sqrt{\frac{W_t}{F \cdot d_1} \cdot \frac{i+1}{i} \cdot \frac{1}{\sin(\alpha_0)\cos(\alpha_0)}} $$

여기서:

- $Z_E$: 탄성 계수 (elastic coefficient, MPa$^{0.5}$)
  - 강/강: $Z_E \approx 191$ MPa$^{0.5}$
- $i = z_2/z_1$: 기어비
- $d_1$: 피니언 피치원 지름

간략 표현 (AGMA 기반):

$$ \sigma_H = \sqrt{\frac{W_t \cdot K}{F \cdot d_1 \cdot I}} $$

여기서 $I$는 기하학 계수(geometry factor for pitting resistance).

### 4.3 AGMA/ISO 표준 핵심 계수 개요

실제 설계에서는 루이스 공식에 아래 수정 계수를 곱해 동적 하중과 응력 집중을 반영한다:

$$ \sigma_b = \frac{W_t \cdot K_o \cdot K_v \cdot K_s}{F \cdot m \cdot J} $$

| 계수 | 의미 | 참고 |
| --- | --- | --- |
| $K_o$ | 과부하 계수 (overload factor) | 1.0\~2.0 |
| $K_v$ | 동적 계수 (dynamic factor) | 피치선 속도 함수 |
| $K_s$ | 크기 계수 (size factor) | 모듈 크기 보정 |
| $J$ | AGMA 굽힘 강도 기하학 계수 | Lewis $Y$를 개선 |

---

## 5. 구현 참고사항 (프로그래밍 시 주의점)

### 5.1 수치 안정성

- **inv() 역함수**: `inv(α) = tan(α) - α`의 역함수는 닫힌 형태(closed-form)가 없다. 뉴턴-랩슨법 사용:

  ```python
  def inv_inv(target, tol=1e-10):
      alpha = target ** (1/3)  # 초기 추정
      for _ in range(50):
          f = math.tan(alpha) - alpha - target
          df = math.tan(alpha)**2  # d/d(alpha)[tan(alpha)-alpha]
          alpha -= f / df
          if abs(f) < tol:
              break
      return alpha
  ```

- **기초원 아래 인벌류트**: $r_f < r_b$이면 인벌류트가 이뿌리원까지 뻗지 않는다. 이 경우 $t_{start} = 0$으로 설정하고 기초원에서 이뿌리원까지는 직선 또는 필릿으로 처리한다.

- **언더컷 발생 조건**: 전위 없는 표준 기어에서 이수가 임계값 이하이면 언더컷(undercut) 발생: $$z_{min} = \frac{2}{\sin^2(\alpha_0)}$$  $\alpha_0 = 20°$에서 $z_{min} \approx 17.1$이므로 **z ≥ 17** 권고.

- **이끝 간섭 (tip interference)**: 이끝원이 상대 기어 기초원 아래로 내려오면 물림 불가. 설계 전 확인 필요.

### 5.2 좌표 배열 순서

기어 윤곽을 SVG/Canvas 렌더링에 사용할 때:

- 반시계 방향(CCW)이 표준 수학 좌표계 (y축 위)
- 화면 좌표계(y축 아래)에서는 CW가 CCW처럼 보임 → 변환 주의

### 5.3 샘플링 밀도

- 인벌류트 1개 플랭크: 20\~50점으로 충분히 부드러운 곡선 생성
- 필릿 구간: 5\~15점 추가
- 이끝/이뿌리 원호: 각도 범위에 비례하여 5\~20점

### 5.4 Python 핵심 구현 스니펫

```python
import math

def involute_point(r_base, t):
    """기초원 반지름 r_base, 파라미터 t에서 인벌류트 좌표."""
    x = r_base * (math.cos(t) + t * math.sin(t))
    y = r_base * (math.sin(t) - t * math.cos(t))
    return x, y

def involute_function(alpha):
    """inv(α) = tan(α) - α. alpha는 라디안."""
    return math.tan(alpha) - alpha

def gear_circles(m, z, alpha0_deg=20.0, x=0.0):
    """기어의 주요 원 반지름 반환."""
    alpha0 = math.radians(alpha0_deg)
    r0 = m * z / 2          # 피치원
    rb = r0 * math.cos(alpha0)  # 기초원
    ra = r0 + m * (1 + x)      # 이끝원
    rf = r0 - m * (1.25 - x)   # 이뿌리원
    return r0, rb, ra, rf

def tooth_profile(m, z, alpha0_deg=20.0, x=0.0, n_pts=40):
    """단일 이(tooth) 인벌류트 플랭크 좌표 (오른쪽 플랭크, 원점 중심)."""
    alpha0 = math.radians(alpha0_deg)
    r0, rb, ra, rf = gear_circles(m, z, alpha0_deg, x)

    # 파라미터 범위
    t_start = math.sqrt(max(0, (max(rf, rb)/rb)**2 - 1))
    t_tip   = math.sqrt((ra/rb)**2 - 1)

    # 이두께 각도 (피치원 기준)
    inv_a0 = involute_function(alpha0)
    theta_offset = math.pi / (2*z) + inv_a0 + 2*x*math.tan(alpha0)/z

    pts = []
    for i in range(n_pts + 1):
        t = t_start + (t_tip - t_start) * i / n_pts
        xi, yi = involute_point(rb, t)
        # 회전
        xr =  xi * math.cos(theta_offset) - yi * math.sin(theta_offset)
        yr =  xi * math.sin(theta_offset) + yi * math.cos(theta_offset)
        pts.append((xr, yr))
    return pts
```

### 5.5 접촉비 (contact ratio) 계산

$$ \varepsilon = \frac{\sqrt{r_{a1}^2 - r_{b1}^2} + \sqrt{r_{a2}^2 - r_{b2}^2} - a\sin(\alpha_b)}{\pi m \cos(\alpha_0)} $$

일반적으로 $\varepsilon > 1.2$ 권고 (소음, 진동 최소화).

---

## 6. 관점 확장 / 문제 재정의

### 인접 질문 1: 언더컷과 전위 최소값

시뮬레이션 앱에서 언더컷 영역을 시각화하려면 이수 $z$와 전위 계수 $x$에 따른 언더컷 한계를 자동 계산해야 한다. 최소 전위 계수: $$x_{min} = 1 - \frac{z}{17}$$ 이 값 이상의 $x$를 쓰면 언더컷이 방지된다.

### 인접 질문 2: 좌표 생성 시 이끝 간섭 자동 검출

두 기어 쌍이 물릴 때, 이끝원이 상대 기초원 이하로 내려오는지 자동 검출하는 로직이 필요하다: $$r_{a2} < a\sin(\alpha_b) + r_{b1} \quad \text{(간섭 없음 조건)}$$

### [이질 도메인: 컴퓨터 그래픽스/스플라인 곡선]

인벌류트 프로파일 생성 문제는 B-스플라인 기반 곡선 렌더링과 구조적으로 유사하다. 파라메트릭 곡선의 샘플링, 접선 방향 계산, 호 길이 기반 균등 재샘플링 기법을 기어 프로파일에 그대로 차용할 수 있다.

### 문제 재정의

"기어 시뮬레이션 앱에 필요한 수학"이라는 원래 질문보다, **"언더컷, 전위, 간섭을 실시간으로 시각화할 수 있는 파라메트릭 기어 프로파일 생성기"** 구현이 더 정확한 핵심 질문이다. 단순 좌표 생성보다 경계 조건(언더컷, 간섭)의 시각 피드백이 앱의 핵심 가치를 결정한다.

---

## 7. 출처 목록

| \# | 출처 | 확신도 | URL |
| --- | --- | --- | --- |
| 1 | tec-science.com, "Calculation of Involute Gears" (2021) | ★★★ | https://www.tec-science.com/mechanical-power-transmission/involute-gear/calculation-of-involute-gears/ |
| 2 | SiliconWit, "Involute Gear Systems" (2026-03) | ★★★ | https://siliconwit.com/education/code-based-mechanical-design/involute-gear-systems/ |
| 3 | Drivetrain Hub, "Geometry / Involute" (2020) | ★★★ | https://drivetrainhub.com/notebooks/gears/geometry/Chapter%201%20-%20Involute.html |
| 4 | Gearsolutions, "Parametric Geometric Modeling of Spur Gear" (Solidworks) | ★★☆ | https://gearsolutions.com/features/parametric-geometric-modeling-of-a-spur-gear-using-solidworks/ |
| 5 | SemanticScholar PDF, "Involute Spur Gear Template Development by Parametric Technique" | ★★☆ | https://pdfs.semanticscholar.org/ac6b/a1bdaabf555d9a3fc50a99d260e855f3836e.pdf |
| 6 | KHK Gears, "Calculation of Gear Dimensions" | ★★★ | https://khkgears.net/new/gear_knowledge/gear_technical_reference/calculation_gear_dimensions.html |
| 7 | Alibre Blog, "The Math Behind Involute Spur Gears" | ★★☆ | https://www.alibre.com/blog/the-math-behind-involute-spur-gears/ |
| 8 | Firgelli, "Gear Tooth Strength Calculator — Lewis Formula" (2026) | ★★☆ | https://www.firgelliauto.com/blogs/engineering-calculators/gear-tooth-strength-calculator-lewis-formula |
| 9 | Gearsolutions, "Transition Curve — Much More Than a Radius at the Root Fillet" | ★★☆ | https://gearsolutions.com/features/transition-curve-much-more-than-a-radius-at-the-root-fillet-of-a-tooth/ |
| 10 | Shigley's Mechanical Engineering Design, 10th ed. (교과서 참조) | ★★★ | 도서 |

---

## 8. 검색 비용 보고

| 도구 | 호출 수 |
| --- | --- |
| Perplexity search | 3 |
| Tavily search (advanced) | 2 |
| Tavily extract | 3 |
| Perplexity reason/research | 0 |

---

*작성: Researcher 1 (기어 기하학 기초 수학) — 2026-04-01*